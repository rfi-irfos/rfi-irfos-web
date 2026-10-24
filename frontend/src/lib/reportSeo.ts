// Title/description for the individually indexed /evidence/<slug>/ report pages.
//
// Why package IDs: Search Console (3 months to 2026-10-22) shows the report pages ranking at
// position 4-8 for queries that are app package names ("com.nintendo.znca": 201 impressions, 0
// clicks), while the HTML page never contained that string (only the PDF did, and the PDF competed
// with the page for the query). Naming the package in title + description is a HYPOTHESIS for the
// low CTR, so it ships as a controlled experiment: only PKG_TITLE_ROLLOUT = 'half' of the pages
// with a known package get the new form, the rest stay as the control until the 4-week GSC
// comparison is done. Flip to 'all' after the comparison. No imports on purpose: unit-testable
// with `node --test` (scripts/reportSeo.test.mjs).
export type ReportPackage = { app: string; pkg: string }
export type PackageMap = Record<string, ReportPackage[]>

export const PKG_TITLE_ROLLOUT: 'half' | 'all' = 'half'
const MAX_TITLE = 70

// Deterministic split by slug so a page never flips group between builds.
export function inPackageTitleGroup(slug: string, rollout: 'half' | 'all' = PKG_TITLE_ROLLOUT): boolean {
  if (rollout === 'all') return true
  let sum = 0
  for (const ch of slug) sum += ch.charCodeAt(0)
  return sum % 2 === 0
}

export function reportSeo(
  slug: string,
  names: string,
  opts: { disclosure?: string; resolved?: boolean; packages?: PackageMap; rollout?: 'half' | 'all' } = {},
): { title: string; description: string; withPackage: boolean } {
  const pkgs = opts.packages?.[slug] ?? []
  const withPackage = pkgs.length > 0 && inPackageTitleGroup(slug, opts.rollout)
  const tail = `${opts.disclosure ? ` Disclosed ${opts.disclosure}.` : ''}${opts.resolved ? ' Resolved.' : ''}`
  if (!withPackage) {
    return {
      title: `${names} — Disclosure Report — RFI-IRFOS`,
      description: `RFI-IRFOS GDPR/security disclosure report for ${names}.${tail}`,
      withPackage: false,
    }
  }
  const ids = pkgs.map(p => p.pkg)
  const candidates = [
    `${names} (${ids[0]}) — GDPR & Security Disclosure — RFI-IRFOS`,
    `${names} (${ids[0]}) — Disclosure — RFI-IRFOS`,
    `${names} (${ids[0]}) — RFI-IRFOS`,
  ]
  const title = candidates.find(c => c.length <= MAX_TITLE) ?? candidates[candidates.length - 1]
  return {
    title,
    description: `Evidence-based GDPR and security disclosure report for ${names} (package ${ids.join(', ')}).${tail} Published by RFI-IRFOS.`,
    withPackage: true,
  }
}
