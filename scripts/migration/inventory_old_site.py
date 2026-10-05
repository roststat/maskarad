#!/usr/bin/env python3
from __future__ import annotations

import csv
import html
import os
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
FTP_ROOT = ROOT / "old-site-source" / "ftp"
SQL_PATH = Path(os.environ.get("MASKARAD_SQL_PATH", FTP_ROOT / "mysql.sql"))
OUT_DIR = ROOT / "development-docs" / "reports" / "old-site-inventory"

ALLOWED_TABLES = {
    "maskaradkid_pages",
    "maskaradkid_mod_articles_menu",
    "maskaradkid_mod_articles_list",
    "maskaradkid_mod_articles_list1",
    "maskaradkid_mod_articles_list2",
    "maskaradkid_mod_articles_list3",
    "maskaradkid_mod_articles_body",
    "maskaradkid_mod_news",
}


def unescape_mysql(value: str | None) -> str:
    if value is None:
        return ""
    replacements = {
        "\\0": "\0",
        "\\'": "'",
        '\\"': '"',
        "\\b": "\b",
        "\\n": "\n",
        "\\r": "\r",
        "\\t": "\t",
        "\\Z": "\x1a",
        "\\\\": "\\",
    }
    out = value
    for old, new in replacements.items():
        out = out.replace(old, new)
    return out


def clean_text(raw: str, limit: int = 220) -> str:
    text = re.sub(r"<[^>]+>", " ", raw)
    text = html.unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) > limit:
        return text[: limit - 1].rstrip() + "…"
    return text


def normalize_url(url: str) -> str:
    url = url.strip()
    if not url:
        return ""
    if re.match(r"^https?://", url, flags=re.I) and not re.match(
        r"^https?://(www\.)?(maskarad-teatr\.ru|maskarad\.org)", url, flags=re.I
    ):
        return url
    url = re.sub(r"^https?://(www\.)?(maskarad-teatr\.ru|maskarad\.org)", "", url, flags=re.I)
    if url and not url.startswith("/"):
        url = "/" + url
    return url


def migration_group(url: str) -> str:
    url = normalize_url(url)
    if not url:
        return "no-url"
    if url.startswith("/detskii-prazdnik/") or url.startswith("/detkii-prazdnik/"):
        return "show"
    if url.startswith("/teatr/spektakl/"):
        return "show"
    if url.startswith("/detskie-uslugi/"):
        return "service"
    if url.startswith("/detskie-prazdniki/"):
        return "celebration"
    if url.startswith("/scenarii/"):
        return "scenario"
    if url.startswith("/maskarad/"):
        return "company"
    if url.startswith("/foto") or url.startswith("/pic"):
        return "media"
    return "other"


@dataclass
class InsertBlock:
    table: str
    columns: list[str]
    rows: list[list[str]]


def parse_tuple_values(tuple_text: str) -> list[str]:
    values: list[str] = []
    current: list[str] = []
    in_quote = False
    escape = False
    token_was_quoted = False

    for char in tuple_text:
        if escape:
            current.append("\\" + char)
            escape = False
            continue
        if char == "\\" and in_quote:
            escape = True
            continue
        if char == "'":
            in_quote = not in_quote
            token_was_quoted = True
            continue
        if char == "," and not in_quote:
            token = "".join(current).strip()
            if not token_was_quoted and token.upper() == "NULL":
                values.append("")
            else:
                values.append(unescape_mysql(token))
            current = []
            token_was_quoted = False
            continue
        current.append(char)

    token = "".join(current).strip()
    if not token_was_quoted and token.upper() == "NULL":
        values.append("")
    else:
        values.append(unescape_mysql(token))
    return values


def parse_insert_rows(values_blob: str) -> list[list[str]]:
    rows: list[list[str]] = []
    depth = 0
    start = None
    in_quote = False
    escape = False

    for index, char in enumerate(values_blob):
        if escape:
            escape = False
            continue
        if char == "\\" and in_quote:
            escape = True
            continue
        if char == "'":
            in_quote = not in_quote
            continue
        if in_quote:
            continue
        if char == "(":
            if depth == 0:
                start = index + 1
            depth += 1
        elif char == ")":
            depth -= 1
            if depth == 0 and start is not None:
                rows.append(parse_tuple_values(values_blob[start:index]))
                start = None
    return rows


def iter_insert_blocks(sql: str) -> list[InsertBlock]:
    pattern = re.compile(
        r"INSERT INTO `(?P<table>[^`]+)` \((?P<columns>.*?)\) VALUES\s*(?P<values>.*?);",
        re.S,
    )
    blocks: list[InsertBlock] = []
    for match in pattern.finditer(sql):
        table = match.group("table")
        if table not in ALLOWED_TABLES:
            continue
        columns = re.findall(r"`([^`]+)`", match.group("columns"))
        rows = parse_insert_rows(match.group("values"))
        blocks.append(InsertBlock(table=table, columns=columns, rows=rows))
    return blocks


def rows_by_table(blocks: list[InsertBlock]) -> dict[str, list[dict[str, str]]]:
    result: dict[str, list[dict[str, str]]] = defaultdict(list)
    for block in blocks:
        for row in block.rows:
            result[block.table].append({column: row[index] if index < len(row) else "" for index, column in enumerate(block.columns)})
    return result


def write_csv(path: Path, rows: list[dict[str, str]], fieldnames: list[str]) -> None:
    with path.open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def media_rows() -> list[dict[str, str]]:
    rows = []
    for path in sorted(FTP_ROOT.rglob("*")):
        if not path.is_file():
            continue
        suffix = path.suffix.lower().lstrip(".")
        if suffix not in {"jpg", "jpeg", "png", "gif", "webp", "avi", "wma", "ico", "psd"}:
            continue
        rel = path.relative_to(FTP_ROOT).as_posix()
        rows.append(
            {
                "path": rel,
                "extension": suffix,
                "size_bytes": str(path.stat().st_size),
                "bucket": rel.split("/", 1)[0],
            }
        )
    return rows


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    sql = SQL_PATH.read_text(encoding="utf-8", errors="replace")
    tables = rows_by_table(iter_insert_blocks(sql))

    pages = []
    for row in tables["maskaradkid_pages"]:
        pages.append(
            {
                "id": row.get("id", ""),
                "parent": row.get("parent", ""),
                "name": row.get("name", ""),
                "url": normalize_url(row.get("url", "")),
                "title": row.get("title", ""),
                "description": row.get("description", ""),
                "keywords": row.get("keywords", ""),
                "active": row.get("active", ""),
                "sort": row.get("sort", ""),
                "group": migration_group(row.get("url", "")),
            }
        )

    bodies_by_parent: dict[str, dict[str, str]] = {}
    for body in tables["maskaradkid_mod_articles_body"]:
        bodies_by_parent[body.get("parent", "")] = body

    articles = []
    article_tables = [
        "maskaradkid_mod_articles_list",
        "maskaradkid_mod_articles_list1",
        "maskaradkid_mod_articles_list2",
        "maskaradkid_mod_articles_list3",
    ]
    for table in article_tables:
        for row in tables[table]:
            body = bodies_by_parent.get(row.get("id", ""), {})
            reference = normalize_url(row.get("reference", ""))
            articles.append(
                {
                    "table": table,
                    "id": row.get("id", ""),
                    "parent": row.get("parent", ""),
                    "name": row.get("name", ""),
                    "url": reference,
                    "keywords": row.get("keywords", ""),
                    "pic": row.get("pic", ""),
                    "preview": row.get("preview", ""),
                    "photo": row.get("photo", ""),
                    "active": row.get("active", ""),
                    "sort": row.get("sort", ""),
                    "group": migration_group(reference),
                    "announce_text": clean_text(body.get("announce", "")),
                    "body_text": clean_text(body.get("body", "")),
                    "body_chars": str(len(clean_text(body.get("body", ""), limit=100000))),
                }
            )

    menus = []
    for row in tables["maskaradkid_mod_articles_menu"]:
        menus.append(
            {
                "id": row.get("id", ""),
                "parent": row.get("parent", ""),
                "name": row.get("name", ""),
                "url": normalize_url(row.get("url", "")),
                "active": row.get("active", ""),
                "sort": row.get("sort", ""),
                "list": row.get("list", ""),
            }
        )

    urls = {}
    for row in pages:
        if row["url"]:
            urls.setdefault(row["url"], {"url": row["url"], "sources": [], "name": row["name"], "title": row["title"], "group": row["group"]})
            urls[row["url"]]["sources"].append("pages")
    for row in articles:
        if row["url"]:
            urls.setdefault(row["url"], {"url": row["url"], "sources": [], "name": row["name"], "title": "", "group": row["group"]})
            urls[row["url"]]["sources"].append(row["table"].replace("maskaradkid_mod_articles_", "articles_"))
    url_rows = []
    for row in urls.values():
        url_rows.append(
            {
                "url": row["url"],
                "group": row["group"],
                "name": row["name"],
                "title": row["title"],
                "sources": ", ".join(sorted(set(row["sources"]))),
            }
        )
    url_rows.sort(key=lambda item: (item["group"], item["url"]))

    media = media_rows()

    write_csv(OUT_DIR / "pages.csv", pages, ["id", "parent", "name", "url", "title", "description", "keywords", "active", "sort", "group"])
    write_csv(
        OUT_DIR / "articles.csv",
        articles,
        [
            "table",
            "id",
            "parent",
            "name",
            "url",
            "keywords",
            "pic",
            "preview",
            "photo",
            "active",
            "sort",
            "group",
            "announce_text",
            "body_text",
            "body_chars",
        ],
    )
    write_csv(OUT_DIR / "menus.csv", menus, ["id", "parent", "name", "url", "active", "sort", "list"])
    write_csv(OUT_DIR / "urls.csv", url_rows, ["url", "group", "name", "title", "sources"])
    write_csv(OUT_DIR / "media.csv", media, ["path", "extension", "size_bytes", "bucket"])

    group_counts = Counter(row["group"] for row in url_rows)
    media_counts = Counter(row["bucket"] for row in media)
    active_pages = sum(1 for row in pages if row["active"] == "1")
    active_articles = sum(1 for row in articles if row["active"] == "1")
    summary = [
        "# Инвентаризация старого сайта",
        "",
        f"Источник: локальная FTP-выгрузка `old-site-source/ftp` и SQL-дамп `{SQL_PATH.relative_to(ROOT) if SQL_PATH.is_relative_to(ROOT) else SQL_PATH}`.",
        "",
        "В отчет не включены таблицы заказов, пользователей, администраторов и клиентских данных.",
        "",
        "## Сводка",
        "",
        f"- Страницы из `maskaradkid_pages`: {len(pages)}, активных: {active_pages}.",
        f"- Статьи/карточки из `maskaradkid_mod_articles_list*`: {len(articles)}, активных: {active_articles}.",
        f"- Уникальные URL из страниц и карточек: {len(url_rows)}.",
        f"- Медиафайлы в выгрузке: {len(media)}.",
        "",
        "## URL по группам",
        "",
    ]
    for group, count in sorted(group_counts.items()):
        summary.append(f"- `{group}`: {count}")
    summary.extend(["", "## Медиа по папкам", ""])
    for bucket, count in sorted(media_counts.items()):
        summary.append(f"- `{bucket}`: {count}")
    summary.extend(
        [
            "",
            "## Файлы отчета",
            "",
            "- `pages.csv` — старые CMS-страницы с SEO-метаданными.",
            "- `articles.csv` — карточки спектаклей, услуг, галерей и других материалов.",
            "- `menus.csv` — разделы старого каталога.",
            "- `urls.csv` — объединенный список старых URL.",
            "- `media.csv` — список медиафайлов по выгрузке.",
        ]
    )
    (OUT_DIR / "README.md").write_text("\n".join(summary) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
