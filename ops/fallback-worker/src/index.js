// Graz zuerst. Antwortet der Tunnel nicht (530/502/503/504, Netzfehler oder
// Zeitüberschreitung), kommt die Seite aus dem Abbild in ./snapshot.

const DEAD_STATUS = new Set([502, 503, 504, 520, 521, 522, 523, 524, 530]);
const PAGE_TIMEOUT_MS = 8000;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const upstream = toUpstream(request, url, env);
    const isApi = url.pathname.startsWith("/api/");
    const isRead = request.method === "GET" || request.method === "HEAD";

    try {
      // API-Aufrufe (Quick Check, Stripe-Webhook) dürfen lange laufen, Seiten nicht.
      const init = isApi || !isRead ? {} : { signal: AbortSignal.timeout(PAGE_TIMEOUT_MS) };
      const res = await fetch(upstream, init);
      if (!DEAD_STATUS.has(res.status)) return res;
    } catch {
      // Graz nicht erreichbar, weiter zum Abbild.
    }

    if (isApi || !isRead) return offlineApi();
    return fromSnapshot(request, env);
  },
};

function toUpstream(request, url, env) {
  if (!url.hostname.endsWith(".workers.dev")) return request;
  const target = new URL(url.pathname + url.search, env.TEST_ORIGIN);
  return new Request(target, request);
}

async function fromSnapshot(request, env) {
  const res = await env.ASSETS.fetch(request);
  const out = new Response(res.body, res);
  out.headers.set("x-rfi-fallback", "snapshot");
  out.headers.set("cache-control", "no-store");
  return out;
}

function offlineApi() {
  return Response.json(
    {
      ok: false,
      error: "maintenance",
      message: "Our server is briefly offline. Please write to contact@rfi-irfos.com.",
    },
    { status: 503, headers: { "retry-after": "300", "x-rfi-fallback": "snapshot" } },
  );
}
