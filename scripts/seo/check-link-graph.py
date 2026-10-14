"""Read-only crawl of sitemap pages and their HTML links; no API/admin requests."""
import argparse
import concurrent.futures
import json
import subprocess
import urllib.parse
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path


class Links(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])


def fetch(url):
    result = subprocess.run(
        ["curl", "--silent", "--show-error", "--compressed", "--max-time", "20",
         "--write-out", "\n%{http_code}", url], capture_output=True, text=True)
    body, _, status = result.stdout.rpartition("\n")
    return int(status) if status.isdigit() else 0, body, result.stderr.strip()


def main():
    cli = argparse.ArgumentParser()
    cli.add_argument("--base", required=True)
    cli.add_argument("--output", required=True)
    args = cli.parse_args()
    base = args.base.rstrip("/")
    status, xml, error = fetch(base + "/sitemap.xml")
    if status != 200:
        raise SystemExit(f"Sitemap unavailable: {status} {error}")
    urls = [node.text for node in ET.fromstring(xml).findall(".//{*}loc")]
    paths = {urllib.parse.urlsplit(url).path or "/" for url in urls}
    hosts = {urllib.parse.urlsplit(url).netloc for url in urls}
    hosts.add(urllib.parse.urlsplit(base).netloc)

    def crawl(path):
        status, body, error = fetch(base + path)
        parser = Links()
        parser.feed(body)
        links = set()
        for href in parser.links:
            url = urllib.parse.urlsplit(urllib.parse.urljoin(base + path, href))
            target = url.path or "/"
            if url.scheme in ("http", "https") and url.netloc in hosts:
                if not target.startswith(("/api/", "/admin/", "/_next/")):
                    links.add(target)
        return path, {"status": status, "links": sorted(links), "error": error}

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        pages = dict(pool.map(crawl, sorted(paths)))
    extras = {link for page in pages.values() for link in page["links"]} - paths
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        extra_pages = dict(pool.map(crawl, sorted(extras)))
    incoming = {path: [] for path in paths}
    for source, page in pages.items():
        for target in page["links"]:
            if target in incoming and source != target:
                incoming[target].append(source)
    seen, queue = {"/"}, ["/"]
    while queue:
        page = pages.get(queue.pop(), {})
        for target in page.get("links", []):
            if target in paths and target not in seen:
                seen.add(target)
                queue.append(target)
    bad_status = {p: v["status"] for p, v in pages.items() if v["status"] != 200}
    broken = {p: v["status"] for p, v in extra_pages.items()
              if v["status"] == 0 or v["status"] >= 400}
    redirects = {p: v["status"] for p, v in extra_pages.items()
                 if 300 <= v["status"] < 400}
    summary = {
        "base": base, "sitemap_count": len(paths), "bad_status": bad_status,
        "reachable_count": len(paths & seen), "unreachable": sorted(paths - seen),
        "without_incoming": sorted(p for p, refs in incoming.items() if p != "/" and not refs),
        "broken_link_targets": broken, "redirect_link_targets": redirects,
    }
    output = {"summary": summary, "pages": pages, "incoming": incoming,
              "extra_pages": extra_pages}
    Path(args.output).write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return bool(bad_status or broken or summary["unreachable"] or summary["without_incoming"])


if __name__ == "__main__":
    raise SystemExit(main())
