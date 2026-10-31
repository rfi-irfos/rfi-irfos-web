// Vite/React SPA ships an empty <div id="root"> — crawlers that don't
// execute JS (and Googlebot's delayed second render wave) see nothing.
// This runs after `vite build`, boots a static server over dist/, loads
// each real route in a real headless browser (WebGL canvas needs one —
// plain react-dom/server SSR can't render the ogl hero background), waits
// for the app to paint, then writes the resulting DOM to that route's own
// dist/<route>/index.html. main.tsx still calls createRoot (not
// hydrateRoot), so the client just re-renders on top on first paint — no
// hydration mismatch risk. tower-http's ServeDir (backend/src/main.rs)
// already serves a directory's index.html for its path, same convention
// this repo's /humanrights static page relies on - no backend change needed.
import { chromium } from 'playwright'
import { createServer as createHttpServer } from 'node:http'
import { createServer as createViteServer } from 'vite'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, extname, join } from 'node:path'
import { OG_PAGE_ROUTES, ogPageKey } from './scripts/og-pages.mjs'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const ROOT = fileURLToPath(new URL('./', import.meta.url))
// PRERENDER_DIST: render into/serve from another build directory (used to test a change without
// touching the production dist, see `npm run build:test`). Default stays ./dist/.
const DIST = process.env.PRERENDER_DIST
  ? (process.env.PRERENDER_DIST.endsWith('/') ? process.env.PRERENDER_DIST : process.env.PRERENDER_DIST + '/')
  : fileURLToPath(new URL('./dist/', import.meta.url))
const PORT = 4173

// Legal pages (own standalone content, App.tsx's LEGAL_SLUGS) + public views
// (App.tsx's SECTION_SLUGS) - keep the crawlable routes in sync with those lists.
const ROUTES = [
  '/',
  '/research', '/world-model', '/squad', '/evidence', '/data-solutions', '/datasets', '/access', '/submit',
  // Legacy section URLs remain valid and should keep receiving static output.
  '/track-record', '/pricing',
  '/impressum', '/datenschutz', '/agb', '/security', '/standards', '/team', '/methodology', '/faq',
  // Search landing pages (2026-10-31, buyer-term sweep) - content in src/components/landingPages.ts.
  '/app-security-audit', '/gdpr-app-audit', '/nis2-software-vendors', '/app-tracker-sdk-check',
]

// Individual disclosure-report routes (2026-09-25 crawlability sweep) - every
// published PDF behind the ledger gets its own real /evidence/<slug>/ page instead
// of only a ?report=<slug> deep link into the shared /evidence/ page. Slugs are
// read straight out of TrackRecord.tsx's REPORT_URL_BY_SLUG via a throwaway Vite
// SSR module load (the same transform Vite already uses for `vite dev`/`vite build`,
// just invoked once here in Node rather than through the dev server) rather than
// hand-listed, so a new report gets a working crawlable page automatically the
// moment its PDF lands in AUDIT_META - same reasoning as REPORT_URL_BY_SLUG itself
// being derived instead of hand-maintained (see TrackRecord.tsx's own comment).
const viteServer = await createViteServer({ root: ROOT, server: { middlewareMode: true }, appType: 'custom' })
const trackRecordModule = await viteServer.ssrLoadModule('/src/components/sections/TrackRecord.tsx')
const REPORT_SLUGS = Object.keys(trackRecordModule.REPORT_URL_BY_SLUG)
const REPORT_META_BY_SLUG = trackRecordModule.REPORT_META_BY_SLUG
await viteServer.close()
console.log(`discovered ${REPORT_SLUGS.length} individual report routes from AUDIT_META`)

// German URL architecture (2026-10-24 visibility sweep): every fully localized
// view gets a real crawlable /de/... page. App.tsx reads the /de prefix and
// boots the LocaleProvider in German, so the exact same render pipeline below
// produces a German snapshot (<html lang="de">, German title/description) at
// /de/<route>/. Only canonical routes are localized - aliases (/pricing,
// /track-record, ...) keep a single English redirect-style canonical and never
// get a /de twin, and the ~200 /evidence/<slug>/ report pages stay EN-only for
// now (their body copy is English; a hreflang pair would claim a German page
// that doesn't exist). Both language snapshots of a localized route carry the
// reciprocal hreflang triple (en / de / x-default=en) - one-sided hreflang is
// ignored by Google, which is exactly the bug this sweep removed from
// index.html.
const LOCALIZED_ROUTES = [
  '/',
  '/world-model', '/squad', '/evidence', '/data-solutions', '/access',
  // /team has no German translation (LegalPage META: no titleDe/body-DE) - a /de/team
  // page would claim an alternate that doesn't exist, same reasoning as the EN-only
  // evidence reports. It stays in ROUTES above (the EN page must render) - removing
  // it from the wrong list here is exactly what 404'd /team/ on 2026-10-24.
  '/impressum', '/datenschutz', '/agb', '/security', '/standards', '/methodology', '/faq',
  // DE twins of the four search landing pages (fully translated, 2026-10-31).
  '/app-security-audit', '/gdpr-app-audit', '/nis2-software-vendors', '/app-tracker-sdk-check',
]
const absUrl = (route) => route === '/' ? 'https://rfi-irfos.com' : `https://rfi-irfos.com${route}/`
const deRoute = (route) => route === '/' ? '/de' : `/de${route}`
const enRouteOf = (route) => route.startsWith('/de') ? (route === '/de' ? '/' : route.slice(3)) : route

// --only=/squad,/evidence/outfit7 : render just these routes (plus '/', which a plain `vite build`
// always overwrites with the empty SPA shell). Added 2026-10-02 so a one-page change no longer
// needs all ~190 routes through Chromium. Unknown routes abort instead of being silently skipped.
// Pages that are not re-rendered keep their old HTML and the old hashed bundle, which `npm run
// build:fast` therefore leaves in dist/assets; `npm run stale` lists them.
const onlyArg = process.argv.find(a => a.startsWith('--only='))
const ONLY = onlyArg ? onlyArg.slice('--only='.length).split(',').map(r => r.trim().replace(/\/$/, '')).filter(Boolean) : null
if (ONLY) {
  const known = new Set([...ROUTES, ...LOCALIZED_ROUTES.map(deRoute), ...REPORT_SLUGS.map(slug => `/evidence/${slug}`)])
  const unknown = ONLY.filter(r => !known.has(r))
  if (unknown.length) {
    console.error(`ERROR: unknown route(s) in --only: ${unknown.join(', ')}`)
    process.exit(1)
  }
  console.log(`--only: rendering ${ONLY.length} route(s) plus / (partial run, sitemap.xml is left untouched)`)
}

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.mp4': 'video/mp4',
}

const server = createHttpServer(async (req, res) => {
  const reqPath = req.url.split('?')[0]
  const filePath = join(DIST, reqPath === '/' ? 'index.html' : reqPath)
  try {
    const data = await readFile(filePath)
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' })
    res.end(data)
  } catch {
    const data = await readFile(join(DIST, 'index.html'))
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(data)
  }
})

await new Promise((resolve) => server.listen(PORT, resolve))

// --disable-dev-shm-usage: a standard mitigation for Chromium renderer
// crashes under memory pressure in constrained environments. Checked first
// rather than assumed: /dev/shm itself has 3.4G free on this box, so that
// specific mechanism isn't the cause here - the real constraint (found
// 2026-08-17) is system RAM itself: 140MB free, swap nearly exhausted, while
// the hero route now also loads full-resolution uncompressed screenshots.
// The renderer was killed outright rather than raising a catchable JS
// exception, which is why this surfaced as a silent page-closed crash with
// no console output. This flag is cheap and harmless either way; the actual
// fix if it recurs is freeing real memory on the machine, not this flag.
// A single Chromium process rendering all ~190 routes back-to-back never
// gives the OS anything back - renderer heap, DevTools protocol buffers, and
// Playwright's own page handles all accumulate for the process's lifetime.
// Found 2026-09-26: the ~165+ individual /evidence/<slug>/ report routes
// (added same day this got long enough to matter) pushed that accumulation
// past what both Fly's remote builder AND this machine's own free RAM could
// absorb, surfacing as the same "Target crashed" this file already documents
// below - just later in the run each time, since it's a slow leak, not a
// single expensive route. Restarting the browser process itself every
// ROUTES_PER_BROWSER routes is the actual fix: it returns everything to the
// OS on each restart instead of only ever growing, independent of which
// machine ends up building this.
// 25 is the default; override with PRERENDER_ROUTES_PER_BROWSER=N on a
// machine that's tight on RAM at build time (confirmed 2026-10-02: lowering
// to 6 was what got a build past "Target crashed" on a box with <1.5G free -
// more restarts cost build time, not correctness, so it's a dial, not a fix).
const ROUTES_PER_BROWSER = Number(process.env.PRERENDER_ROUTES_PER_BROWSER) || 25
let browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
let page = await browser.newPage()
let routesSinceRestart = 0

// Prerender output is serialized DOM only - decoded image/video pixels never
// end up in it, but they dominate the renderer's memory (the hero PNGs are
// up to 3MB compressed, tens of MB decoded). Under memory pressure (recurred
// 2026-08-17 with <900MB available: renderer killed outright, surfacing as
// "Target crashed" with no console output) that's exactly what pushed the
// renderer over the edge. Abort those requests here - <img> src attributes
// and CSS url()s still serialize identically, only the pixel decode is skipped.
async function abortMedia() {
  await page.route(/\.(png|jpe?g|webp|gif|mp4|webm)(\?|$)/, r => r.abort())
  // Sprachwahl pro Route deterministisch (2026-10-31): useLocale.ts speichert die aktive Sprache unter
  // localStorage['rfi-locale'] (Effekt nach jedem Render). Die Seite wird ueber bis zu ROUTES_PER_BROWSER
  // Routen wiederverwendet; eine zuvor gerenderte /de/-Route hinterliess 'de', und EN-only Routen ohne
  // initialLocale (19 Report-Seiten live: <html lang="de"> + deutscher Inhalt) lasen es beim naechsten
  // goto. Das Init-Skript laeuft vor dem App-Code jeder Navigation und loescht den Schluessel; /de/-Routen
  // bekommen ihre Sprache ohnehin ueber initialLocale aus der URL (App.tsx).
  await page.addInitScript(() => { try { localStorage.removeItem('rfi-locale') } catch { /* ignore */ } })
}
await abortMedia()

async function restartBrowserIfDue() {
  routesSinceRestart += 1
  if (routesSinceRestart < ROUTES_PER_BROWSER) return
  routesSinceRestart = 0
  await page.close()
  await browser.close()
  browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  page = await browser.newPage()
  await abortMedia()
}

// Some crawlable routes render byte-identical content to another route: either
// an intentional legacy alias (old bookmarks to /pricing, /track-record,
// /datasets still resolve -- see App.tsx's SECTION_SLUGS comment and
// PublicSite.tsx's viewForSection/sectionMeta, which already treat each pair
// as one view/one meta) or a route with no distinct view of its own
// (/research and /submit both fall through viewForSection's default and
// render the same view='home' full homepage as / itself). Each of those must
// canonicalize to its one indexable counterpart instead of to itself, or
// Google sees the same content split across several "equally valid" URLs
// with no signal which one to rank. Found 2026-09-04 via a GSC/site-structure
// deep sweep as 3 duplicate-content pairs; /research and /submit are the same
// underlying bug, found while fixing the named 3.
const CANONICAL_ALIAS = {
  '/track-record': '/evidence',
  '/pricing': '/access',
  '/datasets': '/data-solutions',
  '/research': '/',
  '/submit': '/',
}


// Factored out (2026-09-25) so the ~160 individual /evidence/<slug>/ report
// routes below can reuse the exact same goto/wait/canonicalize/write pipeline
// as the hand-listed ROUTES above, instead of a second copy drifting from it.
// `waitSelector` is the one real difference: report routes render the same
// #root h1/h2 content as /evidence/ itself (the ledger underneath the open
// modal), so that alone can't distinguish "loaded" from "loaded but the
// modal never opened" - waiting on the modal backdrop is the real
// correctness gate for those routes specifically.
async function renderRoute(route, canonicalRoute, waitSelector = '#root h1, #root h2') {
  // See the original inline comment (still applies): 'networkidle' hangs
  // intermittently because of the Hero route's looping <video>; swallow just
  // its timeout and fall back to the waitForSelector gate below.
  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle', timeout: 12000 }).catch(() => {})
  await page.waitForSelector(waitSelector, { state: 'visible', timeout: 60000 })
  let html = await page.content() // already includes the doctype
  // FOUND 2026-10-31 (Simeon, console easter egg opened with three red errors): Vite's
  // dynamic-import helper adds <link rel="modulepreload"> tags at runtime with absolute
  // hrefs, and the snapshot froze them as http://localhost:4173/assets/... - every live
  // visitor then requested localhost and the CSP blocked it. The real lazy imports use
  // relative URLs and are unaffected, so these runtime tags are simply dropped.
  html = html.replace(/<link [^>]*href="http:\/\/localhost:\d+\/[^"]*"[^>]*>/g, '')

  // FOUND 2026-08-19 via Search Console flagging /methodology/ as "Alternative
  // page with proper canonical tag" (i.e. not indexed on its own): index.html's
  // <link rel="canonical"> is a single hardcoded href="https://rfi-irfos.com",
  // and every route's prerendered output starts from that same template. Every
  // non-home route was therefore shipping a canonical tag pointing at the
  // homepage -- correctly telling Google "this page is just an alternate of /,
  // don't index it separately", which Google was doing exactly as instructed.
  // Rewritten here, per route, to the page's own real URL (trailing slash on
  // every route except / itself, matching how the site is actually served and
  // the exact form Search Console's own examples use).
  const canonicalUrl = absUrl(canonicalRoute)
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${canonicalUrl}" />`
  )
  // Strip any inherited hreflang first: '/' renders first and overwrites
  // dist/index.html, which then serves as the SPA fallback TEMPLATE for every
  // later route in this very run - without this, every subsequent snapshot
  // (including all EN-only report pages) would carry the homepage's triple.
  html = html.replace(/<link rel="alternate" hreflang="[^"]*" href="[^"]*"\s*\/?>/g, '')
  // Reciprocal hreflang for localized routes, injected into BOTH language
  // snapshots right before the canonical tag. x-default = EN (the site's
  // default language and what an unmatched locale should land on).
  const enRoute = enRouteOf(canonicalRoute)
  if (LOCALIZED_ROUTES.includes(enRoute)) {
    const alternates = [
      `<link rel="alternate" hreflang="en" href="${absUrl(enRoute)}" />`,
      `<link rel="alternate" hreflang="de" href="${absUrl(deRoute(enRoute))}" />`,
      `<link rel="alternate" hreflang="x-default" href="${absUrl(enRoute)}" />`,
    ].join('')
    html = html.replace('<link rel="canonical"', `${alternates}<link rel="canonical"`)
  }
  // og:url inherited the homepage's hardcoded value from index.html on every
  // route before this -- correct for the canonical route already, wrong on
  // every other one (a shared link posting /evidence would show a preview
  // card claiming the URL is the homepage).
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${canonicalUrl}" />`
  )
  // og:locale (Lighthouse round 42, 2026-10-31): absent before, so LinkedIn/Facebook guessed the
  // language of every card. Same template-inheritance trap as hreflang above: strip, then set.
  html = html.replace(/<meta property="og:locale(?::alternate)?" content="[^"]*"\s*\/?>/g, '')
  const isDe = canonicalRoute === '/de' || canonicalRoute.startsWith('/de/')
  const ogLocale = [`<meta property="og:locale" content="${isDe ? 'de_AT' : 'en_US'}" />`]
  if (LOCALIZED_ROUTES.includes(enRoute)) ogLocale.push(`<meta property="og:locale:alternate" content="${isDe ? 'en_US' : 'de_AT'}" />`)
  html = html.replace('<meta property="og:site_name"', `${ogLocale.join('')}<meta property="og:site_name"`)
  // 2026-10-31: each report gets its own preview card (scripts/gen-og-images.mjs
  // writes dist/og/<slug>.png after this script). width/height stay from index.html.
  if (route.startsWith('/evidence/')) {
    const slug = route.slice('/evidence/'.length)
    const og = `https://rfi-irfos.com/og/${slug}.png`
    const alt = (html.match(/<title>([^<]*)<\/title>/)?.[1] ?? slug).replace(/"/g, '&quot;')
    html = html.replace(/(<meta (?:property|name)="(?:og|twitter):image" content=")[^"]*(")/g, `$1${og}$2`)
    html = html.replace(/<meta property="og:type" content="[^"]*"\s*\/?>/, '<meta property="og:type" content="article" />')
    html = html.replace(/<meta property="og:image:alt"[^>]*>/, '')
    html = html.replace('</head>', `<meta property="og:image:alt" content="${alt}" /></head>`)
  }

  // Main pages get their own card too (scripts/og-pages.mjs); keyed by the canonical route so
  // an alias like /pricing shares /access's card instead of pointing at a PNG nobody paints.
  if (OG_PAGE_ROUTES.includes(enRoute)) {
    const og = `https://rfi-irfos.com/og/${ogPageKey(canonicalRoute)}.png`
    const alt = (html.match(/<title>([^<]*)<\/title>/)?.[1] ?? enRoute).replace(/"/g, '&quot;')
    html = html.replace(/(<meta (?:property|name)="(?:og|twitter):image" content=")[^"]*(")/g, `$1${og}$2`)
    html = html.replace(/<meta property="og:image:alt"[^>]*>/, '')
    html = html.replace('</head>', `<meta property="og:image:alt" content="${alt}" /></head>`)
  }

  const outPath = route === '/' ? join(DIST, 'index.html') : join(DIST, route, 'index.html')
  await mkdir(dirname(outPath), { recursive: true })
  await writeFile(outPath, html)
  console.log(`prerendered ${route === '/' ? '/' : route + '/'} (canonical: ${canonicalUrl})`)
  await restartBrowserIfDue()
}

// The evidence view's ledger (TrackRecord) is a lazily-loaded chunk since the
// 2026-10-24 performance sweep - the generic '#root h1, #root h2' gate can match
// headings that render before that chunk arrives, so the evidence routes wait on
// a heading INSIDE the ledger panel itself or the snapshot could miss the ledger.
const WAIT_SELECTOR = { '/evidence': '#evidence h2' }

for (const route of ROUTES) {
  if (ONLY && route !== '/' && !ONLY.includes(route)) continue
  await renderRoute(route, CANONICAL_ALIAS[route] ?? route, WAIT_SELECTOR[CANONICAL_ALIAS[route] ?? route])
}

// German twins of the localized routes - canonical to themselves (/de/...),
// never back to the EN page: they are real alternate-language pages, not
// duplicates, and hreflang (injected above) is what ties the pair together.
for (const route of LOCALIZED_ROUTES) {
  const de = deRoute(route)
  if (ONLY && !ONLY.includes(de)) continue
  await renderRoute(de, de, WAIT_SELECTOR[route])
}

// Individual /evidence/<slug>/ report pages - each is its own indexable page
// (own <title>/description/JSON-LD, set client-side by PublicSite.tsx's
// initialReportSlug effect before this snapshot happens), canonical to itself
// rather than aliased back to /evidence/ - these are NOT duplicate content of
// the ledger, each one is about one specific disclosure.
for (const slug of REPORT_SLUGS) {
  const route = `/evidence/${slug}`
  if (ONLY && !ONLY.includes(route)) continue
  await renderRoute(route, route, '.rfi-modal-backdrop')
}

await browser.close()
server.close()

if (!ONLY) {
// sitemap.xml (2026-09-25 crawlability sweep) - frontend/public/sitemap.xml is
  // the hand-maintained source of truth for the site's top-level static routes
  // (rarely change, worth reviewing by hand), but the ~160 individual report
  // routes above would immediately go stale as a hand-maintained list the moment
  // a new disclosure report is published. Read the static file, splice in one
  // <url> per REPORT_SLUGS entry (lastmod = that report's disclosure date, where
  // known) before the closing </urlset>, and ship the combined result as the
  // actual dist/sitemap.xml Google/Bing fetch - vite's own build already copied
  // public/sitemap.xml into dist/ verbatim before this script ran, so this
  // intentionally overwrites that with the complete version.
  const staticSitemap = await readFile(join(ROOT, 'public/sitemap.xml'), 'utf8')
  const reportUrls = REPORT_SLUGS.map(slug => {
    const meta = REPORT_META_BY_SLUG[slug]
    const lastmod = meta?.resolvedDate ?? meta?.disclosure
    return [
      '  <url>',
      `    <loc>https://rfi-irfos.com/evidence/${slug}/</loc>`,
      ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
      '    <changefreq>yearly</changefreq>',
      '    <priority>0.4</priority>',
      '  </url>',
    ].join('\n')
  }).join('\n')
  // /de/... twins, generated here (not hand-maintained in public/sitemap.xml)
  // so the DE set can never drift from LOCALIZED_ROUTES above.
  // lastmod of the static pages, EN and DE alike (Lighthouse round 40, 2026-10-31): the EN dates
  // were hand-typed in public/sitemap.xml and sat at 2026-09-05 although /access/ and the rest
  // changed weekly, while the DE twins carried the de.ts commit date, so one page had two dates.
  // Now both come from the last commit touching the page copy and page components; without git
  // history and without SITEMAP_LASTMOD the build date.
  const pageLastmod = (() => {
    // Colony builds get the tree via git archive (no history), so the caller passes the date.
    if (/^\d{4}-\d{2}-\d{2}$/.test(process.env.SITEMAP_LASTMOD ?? '')) return process.env.SITEMAP_LASTMOD
    try {
      const d = execFileSync('git', ['log', '-1', '--format=%cs', '--', 'src/content', 'src/components'], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d
    } catch { /* no git available */ }
    return new Date().toISOString().slice(0, 10)
  })()
  const deLastmod = pageLastmod
  const staticWithDates = staticSitemap.replace(/<url>([\s\S]*?)<\/url>/g, (_, inner) => {
    const body = inner.includes('<lastmod>')
      ? inner.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${pageLastmod}</lastmod>`)
      : inner.replace(/(<\/loc>)/, `$1\n    <lastmod>${pageLastmod}</lastmod>`)
    return `<url>${body}</url>`
  })
  const deUrls = LOCALIZED_ROUTES.map(route => [
    '  <url>',
    `    <loc>${absUrl(deRoute(route))}</loc>`,
    `    <lastmod>${deLastmod}</lastmod>`,
    '    <changefreq>monthly</changefreq>',
    '    <priority>0.6</priority>',
    '  </url>',
  ].join('\n')).join('\n')
  const combinedSitemap = staticWithDates.replace('</urlset>', `${deUrls}\n${reportUrls}\n</urlset>`)
  await writeFile(join(DIST, 'sitemap.xml'), combinedSitemap)
  console.log(`sitemap.xml: ${ROUTES.length} static routes + ${LOCALIZED_ROUTES.length} de routes + ${REPORT_SLUGS.length} report routes`)

  // Atom feed of the newest reports (Lighthouse round 31, 2026-10-31): 248 reports and no
  // feed, so nobody could subscribe, and feed readers / aggregators had nothing to pick up.
  // Title and description come from the snapshots just rendered, so they match the pages.
  const xmlEsc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const htmlUnesc = s => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  const feedEntries = []
  for (const slug of REPORT_SLUGS) {
    const meta = REPORT_META_BY_SLUG[slug]
    const date = meta?.disclosure ?? meta?.notified
    if (!date || !/^\d{4}-\d{2}-\d{2}/.test(date)) continue
    let html
    try { html = await readFile(join(DIST, 'evidence', slug, 'index.html'), 'utf8') } catch { continue }
    const title = htmlUnesc(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? slug)
    const summary = htmlUnesc(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '')
    feedEntries.push({ slug, title, summary, updated: (meta?.resolvedDate ?? date).slice(0, 10), published: date.slice(0, 10) })
  }
  feedEntries.sort((a, b) => b.published.localeCompare(a.published) || a.slug.localeCompare(b.slug))
  const newest = feedEntries.slice(0, 50)
  const feed = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">',
    '  <title>RFI-IRFOS Evidence Ledger: published reports</title>',
    '  <subtitle>Security and GDPR investigations by The Squad, published in full after each disclosure.</subtitle>',
    '  <id>https://rfi-irfos.com/evidence/</id>',
    '  <link rel="alternate" type="text/html" href="https://rfi-irfos.com/evidence/"/>',
    '  <link rel="self" type="application/atom+xml" href="https://rfi-irfos.com/evidence/feed.xml"/>',
    `  <updated>${newest.reduce((m, e) => e.updated > m ? e.updated : m, '1970-01-01')}T00:00:00Z</updated>`,
    '  <author><name>RFI-IRFOS</name><uri>https://rfi-irfos.com/</uri></author>',
    ...newest.map(e => [
      '  <entry>',
      `    <title>${xmlEsc(e.title)}</title>`,
      `    <id>https://rfi-irfos.com/evidence/${e.slug}/</id>`,
      `    <link rel="alternate" type="text/html" href="https://rfi-irfos.com/evidence/${e.slug}/"/>`,
      `    <published>${e.published}T00:00:00Z</published>`,
      `    <updated>${e.updated}T00:00:00Z</updated>`,
      ...(e.summary ? [`    <summary>${xmlEsc(e.summary)}</summary>`] : []),
      '  </entry>',
    ].join('\n')),
    '</feed>',
    '',
  ].join('\n')
  await mkdir(join(DIST, 'evidence'), { recursive: true })
  await writeFile(join(DIST, 'evidence', 'feed.xml'), feed)
  console.log(`evidence/feed.xml: ${newest.length} of ${feedEntries.length} dated reports`)
}
