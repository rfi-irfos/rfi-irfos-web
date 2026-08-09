// Vite/React SPA ships an empty <div id="root"> — crawlers that don't
// execute JS (and Googlebot's delayed second render wave) see nothing.
// This runs after `vite build`, boots a static server over dist/, loads
// the page in a real headless browser (WebGL canvas needs one — plain
// react-dom/server SSR can't render the ogl hero background), waits for
// the app to paint, then overwrites dist/index.html with the resulting
// DOM. main.tsx still calls createRoot (not hydrateRoot), so the client
// just re-renders on top on first paint — no hydration mismatch risk.
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, writeFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = fileURLToPath(new URL('./dist/', import.meta.url))
const PORT = 4173

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
await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' })
await page.waitForSelector('#root h1')
const html = await page.content() // already includes the doctype
await browser.close()
server.close()

await writeFile(join(DIST, 'index.html'), html)
console.log('prerendered dist/index.html')
