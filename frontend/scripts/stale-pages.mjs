// Lists prerendered pages whose HTML still references an OLD hashed bundle (index-*.js) after a
// `npm run build:fast`. Those pages work (the old bundle stays in dist/assets) but show the old UI
// until they are re-rendered. Run `npm run build` (full) when this list contains pages that need
// the new code, e.g. after changing shared components such as nav, footer or the ledger.
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = process.env.PRERENDER_DIST ?? fileURLToPath(new URL('../dist/', import.meta.url))
const BUNDLE = /\/assets\/index-[A-Za-z0-9_-]+\.js/

async function* pages(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) yield* pages(p)
    else if (e.name === 'index.html') yield p
  }
}

const current = BUNDLE.exec(await readFile(join(DIST, 'index.html'), 'utf8'))?.[0]
if (!current) { console.error('no bundle reference found in dist/index.html'); process.exit(2) }
const stale = []
let total = 0
for await (const p of pages(DIST)) {
  total += 1
  const ref = BUNDLE.exec(await readFile(p, 'utf8'))?.[0]
  if (ref && ref !== current) stale.push(p.slice(DIST.length).replace(/index\.html$/, '') || '/')
}
console.log(`current bundle: ${current}`)
console.log(`${total - stale.length} of ${total} pages use the current bundle, ${stale.length} are stale`)
if (stale.length) console.log(stale.slice(0, 40).join('\n') + (stale.length > 40 ? `\n... and ${stale.length - 40} more` : ''))
process.exit(stale.length ? 1 : 0)
