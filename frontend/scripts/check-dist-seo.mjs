// Post-build SEO gate (2026-10-24 visibility sweep). Prerendering writes real
// HTML per route; this verifies the properties Google actually keys on, so a
// regression fails the build instead of silently de-indexing pages weeks later:
//   1. <html lang> matches the snapshot's language (en vs /de/... = de)
//   2. canonical href equals the route's own URL (home = no trailing slash)
//   3. hreflang en/de/x-default present on every localized route, in BOTH
//      language snapshots, pointing at the same pair (reciprocity - one-sided
//      hreflang is ignored, which was the original sitewide bug)
//   4. title non-empty and unique across localized pages; description present
//   5. the DE snapshot's title differs from the EN one (locale actually applied)
// Run: node scripts/check-dist-seo.mjs [distDir]   (default ./dist)
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Keep in sync with prerender.mjs's LOCALIZED_ROUTES.
const LOCALIZED_ROUTES = [
  '/',
  '/world-model', '/squad', '/evidence', '/data-solutions', '/access',
  // /team has no German translation (LegalPage META: no titleDe/body-DE) - a /de/team
  // page would claim an alternate that doesn't exist, same reasoning as the EN-only
  // evidence reports.
  '/impressum', '/datenschutz', '/agb', '/security', '/standards', '/methodology', '/faq',
]
const DIST = process.argv[2] ?? fileURLToPath(new URL('../dist/', import.meta.url))
const absUrl = (route) => route === '/' ? 'https://rfi-irfos.com' : `https://rfi-irfos.com${route}/`
const deRoute = (route) => route === '/' ? '/de' : `/de${route}`

const errors = []
// Uniqueness is checked per language: /standards keeps the same (English-term)
// title in both locales on purpose, so DE and EN each get their own namespace.
const titles = { en: new Map(), de: new Map() }

function attr(html, re, what, route) {
  const m = html.match(re)
  if (!m) errors.push(`${route}: missing ${what}`)
  return m?.[1] ?? ''
}

async function checkSnapshot(route, enRoute, lang) {
  const file = route === '/' ? join(DIST, 'index.html') : join(DIST, route, 'index.html')
  let html
  try {
    html = await readFile(file, 'utf8')
  } catch {
    errors.push(`${route}: snapshot missing (${file})`)
    return
  }
  const langAttr = attr(html, /<html[^>]*\blang="([^"]*)"/, 'lang attribute', route)
  if (langAttr !== lang) errors.push(`${route}: lang="${langAttr}", expected "${lang}"`)

  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/, 'canonical', route)
  if (canonical !== absUrl(route)) errors.push(`${route}: canonical ${canonical} != ${absUrl(route)}`)

  // Exactly one triple: '/' is rendered first and becomes the SPA fallback
  // template for all later routes in the same prerender run, so an inherited
  // second triple is a real failure mode this gate exists for.
  const alternateCount = (html.match(/<link rel="alternate" hreflang=/g) ?? []).length
  if (alternateCount !== 3) errors.push(`${route}: ${alternateCount} hreflang tags, expected exactly 3`)

  for (const [hl, target] of [['en', absUrl(enRoute)], ['de', absUrl(deRoute(enRoute))], ['x-default', absUrl(enRoute)]]) {
    const re = new RegExp(`<link rel="alternate" hreflang="${hl}" href="([^"]*)"`)
    const href = html.match(re)?.[1]
    if (href !== target) errors.push(`${route}: hreflang ${hl} = ${href ?? 'MISSING'}, expected ${target}`)
  }

  const title = attr(html, /<title>([^<]*)<\/title>/, 'title', route).trim()
  if (!title) errors.push(`${route}: empty title`)
  else if (titles[lang].has(title)) errors.push(`${route}: title duplicates ${titles[lang].get(title)} ("${title}")`)
  else titles[lang].set(title, route)

  const desc = attr(html, /<meta name="description" content="([^"]*)"/, 'description', route).trim()
  if (!desc) errors.push(`${route}: empty description`)
  return desc
}

for (const route of LOCALIZED_ROUTES) {
  // The locale-applied probe compares DESCRIPTIONS, not titles: /standards keeps
  // an identical title in both languages by design, but every DE description
  // genuinely differs from its EN counterpart.
  const enDesc = await checkSnapshot(route, route, 'en')
  const deDesc = await checkSnapshot(deRoute(route), route, 'de')
  if (enDesc && deDesc && enDesc === deDesc)
    errors.push(`${deRoute(route)}: DE description identical to EN - locale not applied?`)
}

// Spot-check one EN-only report page: it must carry NO hreflang (it has no
// German alternate) - inheriting the homepage triple is the bug class above.
try {
  const { readdir } = await import('node:fs/promises')
  const slugs = (await readdir(join(DIST, 'evidence'), { withFileTypes: true })).filter(d => d.isDirectory())
  if (slugs.length) {
    const sample = join(DIST, 'evidence', slugs[0].name, 'index.html')
    const html = await readFile(sample, 'utf8')
    const n = (html.match(/<link rel="alternate" hreflang=/g) ?? []).length
    if (n !== 0) errors.push(`/evidence/${slugs[0].name}/: ${n} hreflang tags on an EN-only report page, expected 0`)
  }
} catch { /* no report pages in a partial dist - nothing to check */ }

if (errors.length) {
  console.error(`check-dist-seo: ${errors.length} error(s)`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}
console.log(`check-dist-seo: OK (${LOCALIZED_ROUTES.length} localized routes x 2 languages)`)
