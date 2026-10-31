// dist/llms-full.txt: Volltext der Kernseiten für Antwortmaschinen (Lighthouse R104).
// llms.txt ist nur eine Linkliste; llms-full.txt liefert den Seiteninhalt selbst in einer Datei.
// Läuft NACH prerender.mjs und liest ausschließlich das vorgerenderte HTML, enthält also genau den
// veröffentlichten Text, nichts Zusätzliches. Report-Seiten bleiben draußen (eigene Seiten + Feed).
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { LLMS_FULL_ROUTES } from './gen-llms-full-routes.mjs'

const DIST = process.env.PRERENDER_DIST ?? fileURLToPath(new URL('../dist/', import.meta.url))
const SITE = 'https://rfi-irfos.com'

const ENT = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ', '&middot;': '·' }
const text = (s) => s.replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/g, m => ENT[m] ?? m).replace(/[ \t\r\n]+/g, ' ').trim()

function toMarkdown(html) {
  let s = html.replace(/<(script|style|svg|noscript|video|button)\b[\s\S]*?<\/\1>/g, ' ')
  s = s.replace(/<h([1-4])\b[^>]*>([\s\S]*?)<\/h\1>/g, (_, n, t) => `\n\n${'#'.repeat(Math.min(+n + 2, 6))} ${text(t)}\n\n`)
  s = s.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/g, (_, t) => `\n- ${text(t)}\n`)
  s = s.replace(/<(p|div|section|tr|dt|dd|br)\b[^>]*>/g, '\n')
  s = s.split('\n').map(l => l.startsWith('#') || l.startsWith('- ') ? l : text(l)).join('\n')
  return s.replace(/\n{3,}/g, '\n\n').replace(/\n\n(?=- )/g, '\n').replace(/^(- .*)\n(?=[^-\n])/gm, '$1\n\n').trim()
}

const parts = [
  '# RFI-IRFOS: full text of the core pages',
  '',
  `> Plain-text copy of the published pages listed below, generated at build time from the same HTML visitors get. Index with links: ${SITE}/llms.txt. Investigation reports: ${SITE}/evidence/ (Atom feed: ${SITE}/evidence/feed.xml).`,
]
for (const route of LLMS_FULL_ROUTES) {
  const html = await readFile(join(DIST, route, 'index.html'), 'utf8')
  const body = html.match(/<main\b[^>]*>([\s\S]*)<\/main>/)?.[1] ?? html.slice(html.indexOf('<body'))
  const title = text(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? route)
  parts.push('', '---', '', `## ${title}`, '', `URL: ${SITE}${route}`, '', toMarkdown(body))
}
await writeFile(join(DIST, 'llms-full.txt'), parts.join('\n') + '\n')
console.log(`gen-llms-full: ${LLMS_FULL_ROUTES.length} pages`)
