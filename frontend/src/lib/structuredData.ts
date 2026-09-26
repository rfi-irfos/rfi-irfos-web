// Route-specific JSON-LD (BreadcrumbList, FAQPage) that a static <script> tag in
// index.html can't provide, since it depends on which route actually landed here.
// Injected into document.head the same way PublicSite/LegalPage already set
// document.title and meta[name=description] on a direct-URL landing - prerender.mjs
// runs a real headless browser and snapshots the DOM after mount, so whatever this
// writes into <head> before that snapshot ships in the static output, same as those
// existing title/description writes already do.
//
// Tags carry a stable id so re-running on a locale toggle replaces the previous tag
// instead of accumulating duplicates - the callers below only ever call this from a
// mount-once effect, but a stray future call site should stay safe on its own.
export function upsertJsonLd(id: string, data: unknown) {
  const existing = document.getElementById(id)
  if (existing) existing.remove()
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.id = id
  script.text = JSON.stringify(data)
  document.head.appendChild(script)
}

export function breadcrumbJsonLd(pageName: string, canonicalPath: string) {
  const item = canonicalPath === '/' ? 'https://rfi-irfos.com' : `https://rfi-irfos.com${canonicalPath}/`
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'RFI-IRFOS', item: 'https://rfi-irfos.com' },
      { '@type': 'ListItem', position: 2, name: pageName, item },
    ],
  }
}

// 3-level breadcrumb (Home > Evidence > <report>) for the individual
// /evidence/<slug>/ report pages - breadcrumbJsonLd above only ever needed
// Home > <page> since every other crawlable route sits one level deep.
export function reportBreadcrumbJsonLd(reportName: string, slug: string, evidenceLabel: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'RFI-IRFOS', item: 'https://rfi-irfos.com' },
      { '@type': 'ListItem', position: 2, name: evidenceLabel, item: 'https://rfi-irfos.com/evidence/' },
      { '@type': 'ListItem', position: 3, name: reportName, item: `https://rfi-irfos.com/evidence/${slug}/` },
    ],
  }
}

// Article entity for one published disclosure report - 2026-09-25 crawlability
// sweep: the ~160 published PDFs behind the ledger had no structured-data
// representation at all before this, unlike every other page class on the site
// (Organization, WebSite, DefinedTerm in index.html; FAQPage/BreadcrumbList via
// upsertJsonLd). `about` lists every AUDIT_META target the one report covers
// (a single PDF can cover several targets, e.g. Meta's Facebook/Instagram/
// WhatsApp/Messenger) as a schema.org Thing rather than Organization - these
// are audited apps/products, not necessarily the legal entity itself.
export function reportArticleJsonLd(opts: { slug: string; targets: string[]; disclosure?: string; resolved?: boolean; resolvedDate?: string }) {
  const { slug, targets, disclosure, resolved, resolvedDate } = opts
  const names = targets.join(', ')
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${names} — GDPR/Security Disclosure Report`,
    url: `https://rfi-irfos.com/evidence/${slug}/`,
    ...(disclosure ? { datePublished: disclosure } : {}),
    ...(resolved && resolvedDate ? { dateModified: resolvedDate } : {}),
    about: targets.map(name => ({ '@type': 'Thing', name })),
    author: { '@type': 'Organization', name: 'RFI-IRFOS', url: 'https://rfi-irfos.com' },
    publisher: { '@type': 'Organization', name: 'RFI-IRFOS', url: 'https://rfi-irfos.com' },
    isPartOf: { '@type': 'WebPage', name: 'Evidence Ledger', url: 'https://rfi-irfos.com/evidence/' },
  }
}

export function faqPageJsonLd(items: readonly (readonly [string, string])[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }
}
