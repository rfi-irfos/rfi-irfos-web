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
import { createServer } from 'node:http'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = fileURLToPath(new URL('./dist/', import.meta.url))
const PORT = 4173

// Legal pages (own standalone content, App.tsx's LEGAL_SLUGS) + public views
// (App.tsx's SECTION_SLUGS) - keep the crawlable routes in sync with those lists.
const ROUTES = [
  '/',
  '/research', '/systems', '/evidence', '/access', '/submit',
  // Legacy section URLs remain valid and should keep receiving static output.
  '/projects', '/track-record', '/pricing',
  '/impressum', '/datenschutz', '/agb', '/security', '/standards', '/team', '/methodology',
]

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.mp4': 'video/mp4',
}

const server = createServer(async (req, res) => {
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
const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
const page = await browser.newPage()

for (const route of ROUTES) {
  // 'networkidle' hangs intermittently now that the Hero route ships a
  // looping, autoplaying <video> (2026-08-15): this dev-only static server
  // has no HTTP Range support, so Chrome's video-streaming requests for it
  // never resolve the way the browser expects, and 'networkidle' waits for
  // network quiet that a continuously-looping video's own requests keep
  // preventing. Switching outright to 'load' broke OTHER routes instead
  // (some lazy-loaded chunks/async content genuinely need the extra
  // settle time networkidle used to provide, confirmed by /evidence
  // failing its content check under 'load'). Keeping 'networkidle' as the
  // primary wait but swallowing just its timeout - if the network never
  // quiets down within 12s, proceed anyway; the waitForSelector below
  // (with visibility, not just DOM presence) is the actual correctness
  // gate regardless of which path got us here.
  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle', timeout: 12000 }).catch(() => {})
  await page.waitForSelector('#root h1, #root h2', { state: 'visible', timeout: 20000 })
  let html = await page.content() // already includes the doctype

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
  const canonicalUrl = route === '/' ? 'https://rfi-irfos.com' : `https://rfi-irfos.com${route}/`
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${canonicalUrl}" />`
  )

  const outPath = route === '/' ? join(DIST, 'index.html') : join(DIST, route, 'index.html')
  await mkdir(dirname(outPath), { recursive: true })
  await writeFile(outPath, html)
  console.log(`prerendered ${route === '/' ? '/' : route + '/'} (canonical: ${canonicalUrl})`)
}

await browser.close()
server.close()
