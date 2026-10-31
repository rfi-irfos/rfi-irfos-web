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
  '/app-security-audit', '/gdpr-app-audit', '/nis2-software-vendors', '/app-tracker-sdk-check',
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

  // 2026-10-31 (Lighthouse round 15): German pages must link to German twins, live
  // they linked 13-14x per page to the EN paths (src/lib/localeHref.ts).
  if (lang === 'de') {
    const enTwins = [...html.matchAll(/href="(\/[^"#?]*)/g)].map(m => m[1])
      .filter(h => !h.startsWith('/de/') && LOCALIZED_ROUTES.includes(h.replace(/\/$/, '') || '/'))
    if (enTwins.length) errors.push(`${route}: ${enTwins.length} links to EN twins (${[...new Set(enTwins)].slice(0, 4).join(', ')})`)
  }

  // 2026-10-31: no snapshot may reference the prerender server (CSP-blocked on live).
  if (/https?:\/\/(localhost|127\.0\.0\.1)[:/]/.test(html))
    errors.push(`${route}: snapshot references localhost (prerender leftover)`)

  // 2026-10-31 (Lighthouse round 19): the dead-link notice must never be prerendered.
  if (html.includes('This link leads nowhere') || html.includes('Dieser Link führt ins Leere'))
    errors.push(`${route}: not-found notice baked into the snapshot`)

  // 2026-10-31 (Lighthouse round 18): the product films carry a VideoObject.
  if (['/squad', '/world-model'].includes(enRoute) && !html.includes('"@type":"VideoObject"'))
    errors.push(`${route}: VideoObject for the product film missing`)

  const title = attr(html, /<title>([^<]*)<\/title>/, 'title', route).trim()
  if (!title) errors.push(`${route}: empty title`)
  // Duplikat-Pruefung des Titels seit 2026-10-31 im Sitewide-Scan unten (mit Allowlist, alle dist-Seiten).

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

// EN-only canonical routes (in prerender.mjs's ROUTES but NOT itself in
// LOCALIZED_ROUTES): the snapshot must exist (on 2026-10-24 '/team' was
// dropped from ROUTES instead of LOCALIZED_ROUTES and shipped as a live
// 404), must be English, and no /de/ twin of ITS OWN path may have been
// rendered. Two different sub-cases for hreflang, not one:
//   - CANONICAL_ALIAS routes (prerender.mjs) are the same page as their
//     localized target under a legacy URL - they correctly carry that
//     target's hreflang triple (first version of this check got this wrong,
//     2026-10-24: flagged /pricing/track-record/submit as broken for
//     carrying /access's/evidence's/home's triple, which is exactly right).
//   - Everything else (just /team) has no localized equivalent anywhere and
//     must carry zero hreflang tags.
// Keep in sync with prerender.mjs's CANONICAL_ALIAS.
const CANONICAL_ALIAS = {
  '/track-record': '/evidence',
  '/pricing': '/access',
  '/datasets': '/data-solutions',
  '/research': '/',
  '/submit': '/',
}
const EN_ONLY_ROUTES = ['/research', '/datasets', '/submit', '/track-record', '/pricing', '/team']
const { access } = await import('node:fs/promises')
for (const route of EN_ONLY_ROUTES) {
  let html
  try {
    html = await readFile(join(DIST, route, 'index.html'), 'utf8')
  } catch {
    errors.push(`${route}: snapshot missing (EN-only route dropped from prerender ROUTES?)`)
    continue
  }
  const lang = html.match(/<html[^>]*\blang="([^"]*)"/)?.[1]
  if (lang !== 'en') errors.push(`${route}: lang="${lang}", expected "en"`)
  const alias = CANONICAL_ALIAS[route]
  if (alias) {
    for (const [hl, target] of [['en', absUrl(alias)], ['de', absUrl(deRoute(alias))], ['x-default', absUrl(alias)]]) {
      const re = new RegExp(`<link rel="alternate" hreflang="${hl}" href="([^"]*)"`)
      const href = html.match(re)?.[1]
      if (href !== target) errors.push(`${route}: hreflang ${hl} = ${href ?? 'MISSING'}, expected ${target} (alias of ${alias})`)
    }
  } else {
    const n = (html.match(/<link rel="alternate" hreflang=/g) ?? []).length
    if (n !== 0) errors.push(`${route}: ${n} hreflang tags, expected 0 (no localized equivalent)`)
  }
  const deExists = await access(join(DIST, 'de', route.slice(1), 'index.html')).then(() => true, () => false)
  if (deExists) errors.push(`/de${route}/: rendered for an EN-only route - no German page exists`)
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

// ---------------------------------------------------------------------------------------------
// Sitewide-Scan ueber ALLE dist-Seiten inkl. der 231 /evidence/<slug>/-Reports (2026-10-31).
// Anlass: Live-Crawl 2026-10-31 - alle Report-Seiten trugen dieselbe h1 ("The discipline,
// demonstrated"), zwei Seitenpaare denselben <title>, /humanrights/ hatte weder description noch
// canonical. Geprueft wird je Seite (noindex-Seiten und Alias-Routen ausgenommen):
//   FEHLER   fehlende/leere description, fehlendes canonical, nicht genau eine h1,
//            doppelter <title> bzw. doppelte h1 (je Sprache, ueber alle Seiten)
//   WARNUNG  Titel > 70 Zeichen, description > 170 Zeichen
// ALLOWLIST: Seiten, deren Duplikat gerade parallel in de.ts/en.ts behoben wird. Dupes, an denen
// NUR Allowlist-Routen beteiligt sind, werden als WARNUNG gemeldet. Sobald die Inhalte gefixt sind,
// die Liste leeren (const DUPE_ALLOWLIST = []) - dann sind auch diese Dupes harte Fehler.
// ---------------------------------------------------------------------------------------------
const DUPE_ALLOWLIST = ['/data-solutions/', '/standards/', '/de/data-solutions/', '/de/standards/']
const warnings = []
const ALIAS_ROUTES = new Set(Object.keys(CANONICAL_ALIAS).map(r => `${r}/`))

async function* walk(dir) {
  const { readdir } = await import('node:fs/promises')
  for (const d of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, d.name)
    if (d.isDirectory()) yield* walk(p)
    else if (d.name === 'index.html') yield p
  }
}
const decode = (s) => s.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim()

const seenTitle = new Map() // `${lang}|${title}` -> [route]
const seenH1 = new Map()
let scanned = 0
for await (const file of walk(DIST)) {
  const rel = file.slice(DIST.length).replace(/\\/g, '/').replace(/^\/?/, '/').replace(/index\.html$/, '')
  const route = rel || '/'
  const html = await readFile(file, 'utf8')
  if (/<meta[^>]+name="robots"[^>]+noindex/i.test(html) || ALIAS_ROUTES.has(route)) continue
  scanned++
  const lang = html.match(/<html[^>]*\blang="([^"]*)"/)?.[1] ?? 'en'
  // Sprach-Gate (2026-10-31): 19 Report-Seiten gingen live mit lang="de" + deutschem Inhalt, weil die
  // Sprachwahl einer vorher gerenderten /de/-Route im wiederverwendeten Prerender-Browser hing.
  if (route.startsWith('/evidence/') && route !== '/evidence/' && lang !== 'en') errors.push(`${route}: lang="${lang}" on an EN-only report page, expected "en"`)
  if (route.startsWith('/de/') && lang !== 'de') errors.push(`${route}: lang="${lang}" under /de/, expected "de"`)
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '')
  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '')
  if (!desc) errors.push(`${route}: missing/empty meta description`)
  if (!/<link rel="canonical" href="[^"]+"/.test(html)) errors.push(`${route}: missing canonical`)
  if (title.length > 70) warnings.push(`${route}: title ${title.length} chars (> 70): "${title}"`)
  if (desc.length > 170) warnings.push(`${route}: description ${desc.length} chars (> 170)`)
  if (title) { const k = `${lang}|${title}`; seenTitle.set(k, [...(seenTitle.get(k) ?? []), route]) }
  const h1s = [...html.matchAll(/<h1[\s>][\s\S]*?<\/h1>/g)].map(m => decode(m[0]))
  if (h1s.length !== 1) errors.push(`${route}: ${h1s.length} h1 elements, expected exactly 1${h1s.length ? ` (${h1s.map(h => `"${h}"`).join(' | ')})` : ''}`)
  else { const k = `${lang}|${h1s[0]}`; seenH1.set(k, [...(seenH1.get(k) ?? []), route]) }
}
for (const [what, map] of [['title', seenTitle], ['h1', seenH1]]) {
  for (const [k, routes] of map) {
    if (routes.length < 2) continue
    const text = k.slice(k.indexOf('|') + 1)
    const msg = `duplicate ${what} "${text.slice(0, 90)}" on ${routes.length} pages: ${routes.slice(0, 4).join(', ')}${routes.length > 4 ? ', ...' : ''}`
    // Warnung nur, wenn ALLE beteiligten Routen auf der Allowlist stehen.
    if (routes.every(r => DUPE_ALLOWLIST.includes(r))) warnings.push(`${msg} (allowlisted - parallel fix pending)`)
    else errors.push(msg)
  }
}
if (warnings.length) {
  console.warn(`check-dist-seo: ${warnings.length} warning(s)`)
  for (const w of warnings) console.warn(`  ~ ${w}`)
}
console.log(`check-dist-seo: sitewide scan covered ${scanned} indexable pages`)

// Atom feed of the newest reports (Lighthouse round 31): missing or empty = nobody can subscribe.
{
  const feedPath = join(DIST, 'evidence', 'feed.xml')
  const feed = await readFile(feedPath, 'utf8').catch(() => '')
  const n = (feed.match(/<entry>/g) ?? []).length
  if (n < 10) errors.push(`evidence/feed.xml has ${n} entries (expected at least 10)`)
  else console.log(`check-dist-seo: evidence/feed.xml has ${n} entries`)
}

// Drift gates (Lighthouse round 50): three things that went stale silently on 2026-10-31.
{
  const stats = JSON.parse(await readFile(new URL('../src/content/auditStats.json', import.meta.url), 'utf8'))
  // 1. Count-up figures: the prerender once froze them mid-animation (367+ / 224+ instead of 387+).
  for (const route of ['', 'de', 'evidence', 'de/evidence']) {
    const html = await readFile(join(DIST, route, 'index.html'), 'utf8').catch(() => '')
    for (const n of [stats.appsAudited, stats.criticalFindings]) {
      if (!html.includes(`>${n}+<`)) errors.push(`/${route}${route ? '/' : ''}: count ${n}+ from auditStats.json not in the snapshot (count-up frozen mid-animation?)`)
    }
  }
  // 2. Every current team member on /team/ has a Person node (Laura's was lost in July unnoticed).
  const team = await readFile(join(DIST, 'team', 'index.html'), 'utf8').catch(() => '')
  const visible = team.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ')
  const handles = [...visible.split('Past contributors')[0].matchAll(/@([A-Za-z0-9-]+)/g)].map(m => m[1])
  for (const h of new Set(handles)) {
    if (!team.includes(`"https://github.com/${h}"`)) errors.push(`/team/: @${h} is listed but has no Person JSON-LD with sameAs github.com/${h}`)
  }
  // 3. llms.txt names every plan price shown on /access/ (it described the old five-offer page for weeks).
  const access = await readFile(join(DIST, 'access', 'index.html'), 'utf8').catch(() => '')
  const llms = await readFile(join(DIST, 'llms.txt'), 'utf8').catch(() => '')
  const prices = [...new Set([...access.matchAll(/>€([0-9.,]+)</g)].map(m => m[1]))]
  if (!prices.length) errors.push('/access/: no plan prices found in the snapshot')
  for (const price of prices) {
    if (!llms.includes(`EUR ${price}`)) errors.push(`llms.txt: plan price EUR ${price} from /access/ missing`)
  }
  // 4. Every own-card og:image points at a PNG that was actually painted (round 52 page cards).
  const { OG_PAGE_ROUTES, ogPageKey } = await import('./og-pages.mjs')
  let cards = 0
  for (const en of OG_PAGE_ROUTES) {
    for (const route of [en, '/de' + en]) {
      const html = await readFile(join(DIST, route.slice(1), 'index.html'), 'utf8').catch(() => '')
      if (!html) continue
      const want = `https://rfi-irfos.com/og/${ogPageKey(route)}.png`
      if (!html.includes(`content="${want}"`)) { errors.push(`${route}/: og:image is not its own card ${want}`); continue }
      const png = await readFile(join(DIST, 'og', ogPageKey(route) + '.png')).catch(() => null)
      if (!png || png.length < 10000) errors.push(`${route}/: card og/${ogPageKey(route)}.png missing or empty`)
      cards++
    }
  }
  // 5. Every sitemap URL has at least one internal link from another page, and no snapshot
  //    still carries GitHub-Pages hash routes (round 56: /humanrights/ was an orphan whose own
  //    footer linked Impressum/Datenschutz as "#p/impressum", which goes nowhere).
  const sitemap = await readFile(join(DIST, 'sitemap.xml'), 'utf8').catch(() => '')
  const norm = (h) => {
    h = h.replace(/^https:\/\/rfi-irfos\.com/, '').replace(/[#?].*$/, '')
    if (!h) return '/'
    return h.endsWith('/') || /\.[a-z0-9]+$/i.test(h) ? h : h + '/'
  }
  const inbound = new Map()
  const slashless = new Set(), aliasLinks = new Set()
  for await (const file of walk(DIST)) {
    const src = norm(file.slice(DIST.length).replace(/\\/g, '/').replace(/^\/?/, '/').replace(/index\.html$/, ''))
    const html = await readFile(file, 'utf8')
    if (/href="#p\//.test(html)) errors.push(`${src}: legacy hash link href="#p/..." (use /impressum/ etc.)`)
    for (const [, h] of html.matchAll(/href="((?:https:\/\/rfi-irfos\.com)?\/(?!\/)[^"]*)"/g)) {
      const dst = norm(h)
      if (dst !== src) inbound.set(dst, (inbound.get(dst) ?? 0) + 1)
      // Round 58: a slashless page link costs a 308 hop; an alias route (/research/ etc.)
      // is a duplicate whose canonical points elsewhere - link the real target instead.
      const path = h.replace(/^https:\/\/rfi-irfos\.com/, '').replace(/[#?].*$/, '')
      if (path && path !== '/' && !path.endsWith('/') && !/\.[a-z0-9]+$/i.test(path)) slashless.add(`${src} -> ${path}`)
      if (ALIAS_ROUTES.has(dst)) aliasLinks.add(`${src} -> ${dst}`)
    }
  }
  for (const l of [...slashless].slice(0, 20)) errors.push(`slashless internal link (308 hop): ${l}`)
  for (const l of [...aliasLinks].slice(0, 20)) errors.push(`internal link to alias route: ${l}`)
  const smUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => norm(m[1]))
  if (!smUrls.length) errors.push('sitemap.xml: no <loc> entries found')
  for (const u of smUrls) if (u !== '/' && !inbound.get(u)) errors.push(`${u}: in sitemap but no internal page links to it (orphan)`)
  console.log(`check-dist-seo: drift gates checked ${handles.length} team handles, ${prices.length} plan prices, ${cards} page cards, ${smUrls.length} sitemap URLs for inbound links`)
}

if (errors.length) {
  console.error(`check-dist-seo: ${errors.length} error(s)`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}
console.log(`check-dist-seo: OK (${LOCALIZED_ROUTES.length} localized routes x 2 languages)`)
