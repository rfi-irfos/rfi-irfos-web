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

// Legal pages (own standalone content, App.tsx's LEGAL_SLUGS) + section
// pages (homepage scrolled to one section, App.tsx's SECTION_SLUGS) - keep
// in sync with those two lists.
const ROUTES = [
  '/',
  '/research', '/projects', '/track-record', '/pricing', '/submit',
  '/impressum', '/datenschutz', '/agb', '/security', '/standards', '/team', '/methodology',
]

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon',
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

const browser = await chromium.launch()
const page = await browser.newPage()

for (const route of ROUTES) {
  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#root h1')
  const html = await page.content() // already includes the doctype
  const outPath = route === '/' ? join(DIST, 'index.html') : join(DIST, route, 'index.html')
  await mkdir(dirname(outPath), { recursive: true })
  await writeFile(outPath, html)
  console.log(`prerendered ${route === '/' ? '/' : route + '/'}`)
}

await browser.close()
server.close()
