// Slug list only, kept apart from landingPages.ts (the ~25 KB of page copy) so App.tsx can
// route on it from the entry bundle without dragging the copy in; the copy loads with the
// lazy LegalPage chunk (2026-10-31).
export const LANDING_SLUGS = ['app-security-audit', 'gdpr-app-audit', 'nis2-software-vendors', 'app-tracker-sdk-check'] as const
export type LandingSlug = typeof LANDING_SLUGS[number]
