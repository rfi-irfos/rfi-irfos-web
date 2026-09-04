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
