// Title/description for the individually indexed /evidence/<slug>/ report pages.
//
// Why package IDs: Search Console (3 months to 2026-10-22) shows the report pages ranking at
// position 4-8 for queries that are app package names ("com.nintendo.znca": 201 impressions, 0
// clicks), while the HTML page never contained that string (only the PDF did, and the PDF competed
// with the page for the query). Naming the package in title + description was shipped as a
// controlled experiment (PKG_TITLE_ROLLOUT = 'half').
//
// A/B-TEST BEENDET 2026-10-31: PKG_TITLE_ROLLOUT = 'all' (Freigabe vom Inhaber liegt vor).
// Grund: die Kontrollgruppe hatte keine Klicks, und der Hebel ist jetzt das Gesamtpaket (eigene h1,
// sichtbarer Report-Text, Titel/Description mit konkretem Inhalt), nicht mehr der Vergleich.
// 'half' bleibt als Typ-Option erhalten, damit der Test (scripts/reportSeo.test.mjs) beide Zweige
// pruefen kann. No imports on purpose: unit-testable with `node --test`.
export type ReportPackage = { app: string; pkg: string }
export type PackageMap = Record<string, ReportPackage[]>

export const PKG_TITLE_ROLLOUT: 'half' | 'all' = 'all'
// 2026-10-31: 60 statt 70 - darueber schneidet Google die Titelzeile in den SERPs ab.
const MAX_TITLE = 60
const MAX_DESC = 160

// Deterministic split by slug so a page never flips group between builds.
export function inPackageTitleGroup(slug: string, rollout: 'half' | 'all' = PKG_TITLE_ROLLOUT): boolean {
  if (rollout === 'all') return true
  let sum = 0
  for (const ch of slug) sum += ch.charCodeAt(0)
  return sum % 2 === 0
}

const SEV_EN: Record<string, string> = { CRITICAL: 'critical', HIGH: 'high', MEDIUM: 'medium', LOW: 'low' }

export function reportSeo(
  slug: string,
  names: string,
  opts: {
    disclosure?: string; resolved?: boolean; packages?: PackageMap; rollout?: 'half' | 'all'
    // Hoechster Schweregrad (CRITICAL/HIGH/...) und Zahl der zitierten Rechtsgrundlagen, beides aus dem
    // vorhandenen Ledger (TrackRecord.getReportFacts). Fehlt ein Wert, entfaellt der Satzteil.
    severity?: string; statutes?: number
  } = {},
): { title: string; description: string; withPackage: boolean } {
  const pkgs = opts.packages?.[slug] ?? []
  const withPackage = pkgs.length > 0 && inPackageTitleGroup(slug, opts.rollout)
  const tail = `${opts.disclosure ? ` Disclosed ${opts.disclosure}.` : ''}${opts.resolved ? ' Resolved.' : ''}`
  const sev = opts.severity ? SEV_EN[opts.severity] ?? opts.severity.toLowerCase() : ''
  const facts = [
    sev ? `highest severity: ${sev}` : '',
    opts.statutes ? `${opts.statutes} cited legal provisions` : '',
  ].filter(Boolean).join(', ')
  // Von detailliert nach knapp; die erste Variante <= MAX_DESC gewinnt.
  const fit = (cands: string[]) => cands.find(c => c.length <= MAX_DESC) ?? cands[cands.length - 1].slice(0, MAX_DESC - 1).trimEnd() + '…'
  // Lange Zielnamen-Listen (ORF: 335 Zeichen Titel im Testbuild 2026-10-31): auf den ersten Namen + "+N" kuerzen.
  const list = names.split(', ')
  const shortNames = list.length > 1 ? `${list[0]} +${list.length - 1}` : names
  const pick = (mk: (n: string) => string[]) => mk(names).find(c => c.length <= MAX_TITLE) ?? mk(shortNames).find(c => c.length <= MAX_TITLE) ?? mk(shortNames).slice(-1)[0]
  if (!withPackage) {
    return {
      title: pick(n => [`${n} · Disclosure Report · RFI-IRFOS`, `${n} · Disclosure · RFI-IRFOS`, `${n} · RFI-IRFOS`]),
      description: fit([
        `GDPR and security disclosure report for ${names}${facts ? `: ${facts}` : ''}.${tail} By RFI-IRFOS.`,
        `RFI-IRFOS GDPR/security disclosure report for ${names}.${tail}`,
      ]),
      withPackage: false,
    }
  }
  const ids = pkgs.map(p => p.pkg)
  const title = pick(n => [
    `${n} (${ids[0]}) · Security Disclosure · RFI-IRFOS`,
    `${n} (${ids[0]}) · Disclosure · RFI-IRFOS`,
    `${n} (${ids[0]}) · RFI-IRFOS`,
    `${n} · Disclosure · RFI-IRFOS`,
    `${n} · RFI-IRFOS`,
  ])
  return {
    title,
    description: fit([
      `Privacy and security findings for ${names} (package ${ids.join(', ')})${facts ? `: ${facts}` : ''}.${tail} By RFI-IRFOS.`,
      `Privacy and security findings for ${names} (package ${ids[0]})${facts ? `: ${facts}` : ''}.${tail}`,
      `Privacy and security findings for ${names} (package ${ids[0]}).${tail}`,
      `Privacy and security findings for ${names}.${tail}`,
    ]),
    withPackage: true,
  }
}
