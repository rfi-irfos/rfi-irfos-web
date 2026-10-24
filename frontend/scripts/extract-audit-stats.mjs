// Build-time extraction of the two ledger KPIs the HOMEPAGE needs (apps
// audited, critical findings). AppPrivacy.tsx used to read them straight off
// AUDIT_HIGHLIGHTS - correct, but that static import dragged the entire ~1.5MB
// TrackRecord module (the full ledger) into the entry bundle of every page
// (2026-10-24 performance sweep; TrackRecord is a lazily-loaded chunk now).
// Same single-source-of-truth guarantee, shifted to build time: the numbers
// are still derived from AUDIT_HIGHLIGHTS itself via a throwaway Vite SSR
// module load (the exact technique prerender.mjs already uses for
// REPORT_SLUGS), never hand-typed. Runs before `vite build` (see package.json)
// and the result is committed so `vite dev` works without a build step.
import { createServer as createViteServer } from 'vite'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../', import.meta.url))
const OUT = fileURLToPath(new URL('../src/content/auditStats.json', import.meta.url))

const viteServer = await createViteServer({ root: ROOT, server: { middlewareMode: true }, appType: 'custom' })
const { AUDIT_HIGHLIGHTS } = await viteServer.ssrLoadModule('/src/components/sections/TrackRecord.tsx')
await viteServer.close()

const stats = {
  appsAudited: AUDIT_HIGHLIGHTS.length,
  criticalFindings: AUDIT_HIGHLIGHTS.filter((a) => a.sev === 'CRITICAL').length,
}
const next = JSON.stringify(stats, null, 2) + '\n'
const prev = await readFile(OUT, 'utf8').catch(() => '')
if (prev === next) {
  console.log(`auditStats.json unchanged (${stats.appsAudited} audited, ${stats.criticalFindings} critical)`)
} else {
  await writeFile(OUT, next)
  console.log(`auditStats.json written: ${stats.appsAudited} audited, ${stats.criticalFindings} critical`)
}
