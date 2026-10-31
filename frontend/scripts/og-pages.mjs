// Main pages that get their own social preview card (Lighthouse O2/round 52, 2026-10-31):
// they all shared /og-image.png, so a shared /access/ or /gdpr-app-audit/ link looked exactly
// like the homepage on LinkedIn. Imported by prerender.mjs (sets og:image) and
// gen-og-images.mjs (paints the card from the snapshot's own title and description), so the
// two can't disagree about which pages have a card. The homepage keeps its designed card.
export const OG_PAGE_ROUTES = [
  '/squad', '/access', '/evidence', '/world-model', '/data-solutions', '/methodology', '/standards', '/faq', '/team',
  '/app-security-audit', '/gdpr-app-audit', '/nis2-software-vendors', '/app-tracker-sdk-check',
]

// '/de/access' -> 'page-de-access', '/squad' -> 'page-squad'
export const ogPageKey = (route) => 'page-' + route.replace(/^\//, '').replace(/\//g, '-')
