import type { Locale } from '../hooks/useLocale'

// Routes with a real /de/ twin. Keep in sync with prerender.mjs's and
// check-dist-seo.mjs's LOCALIZED_ROUTES. Reports (/evidence/<slug>/), /team and
// /research stay EN-only, so they are left out on purpose.
export const DE_ROUTES = new Set([
  '/',
  '/world-model', '/squad', '/evidence', '/data-solutions', '/access',
  '/impressum', '/datenschutz', '/agb', '/security', '/standards', '/methodology', '/faq',
  '/app-security-audit', '/gdpr-app-audit', '/nis2-software-vendors', '/app-tracker-sdk-check', '/ai-app-privacy-audit',
])

// 2026-10-31 (Lighthouse round 15): the German pages linked 13-14 times per page
// to the English twins (nav, mega menu, footer, in-section CTAs), so the German
// link graph fed the EN pages and /de/ stayed "crawled, not indexed". Only the
// rendered href gets the prefix; click handlers keep passing the EN path, since
// navigateTo() and App.tsx's routing both work on the prefix-free slug.
/** True when this EN path has a real /de/ twin page. */
export function hasDeTwin(pathname: string): boolean {
  return DE_ROUTES.has(pathname.replace(/\/$/, '') || '/')
}

export function localeHref(href: string, locale: Locale): string {
  if (locale !== 'de' || !href.startsWith('/') || href.startsWith('//') || href.startsWith('/de/')) return href
  const [path, hash] = href.split('#')
  const base = path.replace(/\/$/, '') || '/'
  if (!DE_ROUTES.has(base)) return href
  const out = base === '/' ? '/de/' : `/de${base}/`
  return hash !== undefined ? `${out}#${hash}` : out
}
