// Main pages that get their own social preview card (Lighthouse O2/round 52, 2026-10-31):
// they all shared /og-image.png, so a shared /access/ or /gdpr-app-audit/ link looked exactly
// like the homepage on LinkedIn. Imported by prerender.mjs (sets og:image) and
// gen-og-images.mjs (paints the card from the snapshot's own title and description), so the
// two can't disagree about which pages have a card. The homepage keeps its designed card.
export const OG_PAGE_ROUTES = [
  '/services', '/squad', '/access', '/evidence', '/world-model', '/data-solutions', '/methodology', '/standards', '/faq', '/team',
  '/app-security-audit', '/gdpr-app-audit', '/nis2-software-vendors', '/app-tracker-sdk-check', '/ai-app-privacy-audit', '/managed-soc', '/compliance-automation', '/domain-security-test', '/penetration-testing', '/api-security-testing', '/cloud-security-assessment', '/secure-code-review', '/vulnerability-remediation', '/it-security-graz', '/nis2-consulting', '/ai-llm-security-testing', '/security-architecture-review', '/threat-intelligence', '/vendor-risk-management',
  // Research library documents (Simeon 2026-11-22: the benchmark paper link needs its own social preview).
  '/research/european-cyberresilience-benchmark-2026', '/research/wirkungsbericht-2025-26', '/research/ternary-ground-2026', '/research/call-laura-2026', '/research/jarvis-2026', '/research/ternary-intelligence-stack-2026', '/research/physical-ai-blueprint-2025', '/research/pedalgate-2025',
]

// '/de/access' -> 'page-de-access', '/squad' -> 'page-squad'
export const ogPageKey = (route) => 'page-' + route.replace(/^\//, '').replace(/\//g, '-')
