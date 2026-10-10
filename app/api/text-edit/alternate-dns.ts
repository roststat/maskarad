import { Resolver } from "node:dns/promises";
import { request, type RequestOptions } from "node:https";

// Used only after a connection failure. Keep the configured hostname and TLS
// verification; resolve its current address instead of pinning a provider IP.
export function requestWithAlternateDns(url: string, body: string, apiKey: string, signal: AbortSignal): Promise<Response> {
  const resolver = new Resolver({ timeout: 2000, tries: 1 });
  resolver.setServers(["1.1.1.1"]);
  return new Promise((resolve, reject) => {
    const options: RequestOptions & { autoSelectFamily: boolean; autoSelectFamilyAttemptTimeout: number } = {
      method: "POST", autoSelectFamily: true, autoSelectFamilyAttemptTimeout: 250, signal,
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      lookup: (hostname, options, callback) => {
        resolver.resolve4(hostname).then(addresses => {
          if (!addresses.length) { callback(new Error("dns_empty"), "", 4); return; }
          if (options.all) callback(null, addresses.map(address => ({ address, family: 4 })));
          else callback(null, addresses[0], 4);
        }).catch(error => callback(error, "", 4));
      }
    };
    const outgoing = request(url, options, incoming => {
      const chunks: Buffer[] = [];
      let bytes = 0;
      incoming.on("data", (chunk: Buffer) => {
        bytes += chunk.length;
        if (bytes > 131072) { incoming.destroy(new Error("response_too_large")); return; }
        chunks.push(chunk);
      });
      incoming.on("error", reject);
      incoming.on("end", () => {
        const status = incoming.statusCode || 502;
        resolve(new Response([204, 205, 304].includes(status) ? null : Buffer.concat(chunks).toString("utf8"), { status }));
      });
    });
    outgoing.on("error", reject);
    outgoing.end(body);
  });
}
