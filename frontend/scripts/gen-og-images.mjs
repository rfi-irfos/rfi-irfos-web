// Pro Report-Seite ein eigenes Social-Vorschaubild (1200x630 PNG) -> dist/og/<slug>.png.
// Warum (2026-10-31): alle ~231 /evidence/<slug>/-Seiten nutzten dasselbe /og-image.png, ein
// geteilter Report erschien auf LinkedIn/X/WhatsApp also immer als dieselbe generische Karte.
// Läuft NACH prerender.mjs (npm run build), liest Slugs und Metadaten auf demselben Weg wie
// prerender.mjs: Vite-ssrLoadModule auf TrackRecord.tsx statt handgepflegter Liste, damit ein
// neuer Report sein Bild automatisch bekommt. Es werden nur vorhandene Metadaten gerendert
// (App-Name, Paketname, Schweregrad, Status, Offenlegungsdatum, Schlagzeile) - nichts erfunden.
//
// OG_DIST: anderes Ausgabeverzeichnis (analog PRERENDER_DIST), Default ./dist/.
// Inkrementell: og/manifest.json hält pro Slug einen Hash der Eingabedaten (+ Template-Version);
// ist das PNG da und der Hash gleich, wird übersprungen. OG_FORCE=1 rendert alles neu.
//
// Logo (bindend): ausschließlich public/og/logo-star.png (Kopie von
// Assets/Logos_und_Grafiken/rfi_irfos_logo_transparent.png, Brushed-Metal-Stern, RGBA).
import { chromium } from 'playwright'
import { createServer as createViteServer } from 'vite'
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../', import.meta.url))
const DIST = process.env.OG_DIST
  ? (process.env.OG_DIST.endsWith('/') ? process.env.OG_DIST : process.env.OG_DIST + '/')
  : join(ROOT, 'dist/')
const OUT = join(DIST, 'og/')
const MANIFEST = join(OUT, 'manifest.json')
// Bei jeder Änderung an Layout/CSS hochzählen, sonst bleiben alte PNGs im Cache stehen.
const TEMPLATE_VERSION = 1
// Wie in prerender.mjs: Chromium sammelt über viele Seiten Speicher an, daher regelmäßig neu starten.
const IMAGES_PER_BROWSER = Number(process.env.OG_IMAGES_PER_BROWSER) || 40

// --- Metadaten laden (gleicher Weg wie prerender.mjs) ---------------------------------------
const viteServer = await createViteServer({ root: ROOT, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const tr = await viteServer.ssrLoadModule('/src/components/sections/TrackRecord.tsx')
const REPORT_URL_BY_SLUG = tr.REPORT_URL_BY_SLUG
const REPORT_META_BY_SLUG = tr.REPORT_META_BY_SLUG
const HIGHLIGHT_BY_TARGET = new Map(tr.AUDIT_HIGHLIGHTS.map(a => [a.target, a]))
await viteServer.close()
const PACKAGES = JSON.parse(await readFile(join(ROOT, 'src/content/reportPackages.json'), 'utf8'))
const SLUGS = Object.keys(REPORT_URL_BY_SLUG)

const SEV_RANK = { CRITICAL: 0, HIGH: 1, MEDIUM: 2 }
function cardData(slug) {
  const meta = REPORT_META_BY_SLUG[slug]
  const rows = meta.targets.map(t => HIGHLIGHT_BY_TARGET.get(t)).filter(Boolean)
  // Mehrere Ziele teilen sich ein PDF (z. B. Meta): höchster Schweregrad gewinnt, Name = erstes Ziel + Anzahl.
  rows.sort((a, b) => (SEV_RANK[a.sev] ?? 9) - (SEV_RANK[b.sev] ?? 9))
  const main = rows[0]
  const first = meta.targets[0]
  const name = meta.targets.length > 1 ? `${first} +${meta.targets.length - 1}` : first
  const pkgs = (PACKAGES[slug] ?? []).map(p => p.pkg).filter(Boolean)
  return {
    slug,
    name,
    pkg: pkgs.length ? pkgs[0] + (pkgs.length > 1 ? ` (+${pkgs.length - 1})` : '') : '',
    sev: main?.sev ?? '',
    status: meta.resolved ? 'RESOLVED' : (main?.status ?? ''),
    disclosure: meta.disclosure ?? '',
    headline: main?.headline?.en ?? '',
  }
}

// --- Template ---------------------------------------------------------------------------------
// Fonts (Archivo, JetBrains Mono) und Logo werden einmal als data-URI in die Seite gelegt; pro
// Bild wird nur der Text getauscht. Ein file://-Laden pro Bild scheitert an Cross-Origin für Fonts.
const fontsCss = await readFile(join(ROOT, 'public/fonts/fonts.css'), 'utf8')
const fontFiles = new Map()
for (const m of fontsCss.matchAll(/url\(\/fonts\/([^)]+\.woff2)\)/g)) {
  fontFiles.set(m[1], 'data:font/woff2;base64,' + (await readFile(join(ROOT, 'public/fonts', m[1]))).toString('base64'))
}
const embeddedFonts = fontsCss.replace(/url\(\/fonts\/([^)]+\.woff2)\)/g, (_, f) => `url(${fontFiles.get(f)})`)
const logoBytes = await readFile(join(ROOT, 'public/og/logo-star.png'))
const logoUri = 'data:image/png;base64,' + logoBytes.toString('base64')

const SEV_COLOR = { CRITICAL: '#ff5c5c', HIGH: '#ff9a3c', MEDIUM: '#facc15' }
const TEAL = '#00f5c4'

const PAGE = `<!doctype html><html><head><meta charset="utf-8"><style>
${embeddedFonts}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1200px;height:630px;overflow:hidden;background:#0b0d12}
body{font-family:'Archivo',sans-serif;color:#f4f7fa;position:relative}
.glow{position:absolute;inset:0;background:radial-gradient(900px 420px at 100% 0%,rgba(0,245,196,.16),transparent 70%)}
.bar{position:absolute;left:0;top:0;bottom:0;width:10px;background:${TEAL}}
.wrap{position:absolute;inset:0;padding:48px 64px 44px 72px;display:flex;flex-direction:column}
.top{display:flex;align-items:center;justify-content:space-between;height:92px}
.logo{height:92px;width:auto;display:block}
.badges{display:flex;gap:14px;align-items:center}
.badge{font:700 26px 'JetBrains Mono',monospace;letter-spacing:.04em;padding:8px 18px;border-radius:8px;border:2px solid currentColor;white-space:nowrap}
.date{font:600 26px 'JetBrains Mono',monospace;color:#e8eef4;white-space:nowrap}
.title{margin-top:26px;font-weight:800;font-size:84px;line-height:1.02;letter-spacing:-.02em;color:#fff;
  display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;overflow-wrap:anywhere}
.pkg{margin-top:16px;font:600 30px 'JetBrains Mono',monospace;color:${TEAL};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.head{margin-top:22px;font-weight:500;font-size:34px;line-height:1.28;color:#e8eef4;
  display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
.foot{margin-top:auto;display:flex;justify-content:space-between;align-items:baseline;border-top:2px solid rgba(0,245,196,.45);padding-top:16px;
  font:600 26px 'JetBrains Mono',monospace;color:#e8eef4}
.foot b{color:${TEAL};font-weight:700}
</style></head><body><div class="glow"></div><div class="bar"></div>
<div class="wrap">
 <div class="top"><img class="logo" src="${logoUri}"><div class="badges"><span class="badge" id="sev"></span><span class="badge" id="status"></span><span class="date" id="date"></span></div></div>
 <div class="title" id="title"></div>
 <div class="pkg" id="pkg"></div>
 <div class="head" id="head"></div>
 <div class="foot"><span id="url"></span><b>RFI-IRFOS · Graz</b></div>
</div></body></html>`

async function paint(page, d) {
  await page.evaluate(({ d, SEV_COLOR, TEAL }) => {
    const $ = id => document.getElementById(id)
    const show = (id, v) => { $(id).textContent = v; $(id).style.display = v ? '' : 'none' }
    show('sev', d.sev); $('sev').style.color = SEV_COLOR[d.sev] ?? '#e8eef4'
    show('status', d.status); $('status').style.color = d.status === 'RESOLVED' ? TEAL : '#f4f7fa'
    show('date', d.disclosure ? 'Disclosure ' + d.disclosure : '')
    show('pkg', d.pkg); show('head', d.headline)
    $('url').textContent = 'rfi-irfos.com/evidence/' + d.slug
    // Titel: 84 px, bei Überlänge in 4-px-Schritten bis 64 px schrumpfen, danach 2-Zeilen-Ellipse.
    const t = $('title'); t.textContent = d.name
    let size = 84
    t.style.fontSize = size + 'px'
    while (size > 64 && t.scrollHeight > t.clientHeight + 1) { size -= 4; t.style.fontSize = size + 'px' }
  }, { d, SEV_COLOR, TEAL })
  await page.evaluate(() => document.fonts.ready)
}

// --- Lauf -----------------------------------------------------------------------------------------
await mkdir(OUT, { recursive: true })
let manifest = {}
try { manifest = JSON.parse(await readFile(MANIFEST, 'utf8')) } catch {}
const FORCE = !!process.env.OG_FORCE
const next = {}
const todo = []
for (const slug of SLUGS) {
  const d = cardData(slug)
  const hash = createHash('sha256').update(JSON.stringify([TEMPLATE_VERSION, d])).digest('hex').slice(0, 16)
  next[slug] = hash
  const exists = await stat(join(OUT, slug + '.png')).then(() => true, () => false)
  if (FORCE || !exists || manifest[slug] !== hash) todo.push(d)
}

const t0 = Date.now()
let browser, page, sinceRestart = 0
async function launch() {
  browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
  await page.setContent(PAGE, { waitUntil: 'load' })
}
if (todo.length) {
  await launch()
  for (const d of todo) {
    await paint(page, d)
    await page.screenshot({ path: join(OUT, d.slug + '.png'), type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } })
    if (++sinceRestart >= IMAGES_PER_BROWSER) { sinceRestart = 0; await browser.close(); await launch() }
  }
  await browser.close()
}
await writeFile(MANIFEST, JSON.stringify(next, null, 1) + '\n')
console.log(`og images: ${todo.length} gerendert, ${SLUGS.length - todo.length} übersprungen, ${SLUGS.length} Slugs, ${((Date.now() - t0) / 1000).toFixed(1)} s -> ${OUT}`)
