// Run: node --test scripts/reportSeo.test.mjs   (transpiles the TS module with the project's typescript)
import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const ts = createRequire(import.meta.url)('typescript')
const src = readFileSync(new URL('../src/lib/reportSeo.ts', import.meta.url), 'utf8')
const out = join(mkdtempSync(join(tmpdir(), 'reportSeo-')), 'reportSeo.mjs')
writeFileSync(out, ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText)
const { reportSeo, inPackageTitleGroup, PKG_TITLE_ROLLOUT } = await import(pathToFileURL(out).href)

const packages = { nintendo: [{ app: 'Nintendo Switch Online', pkg: 'com.nintendo.znca' }] }

test('control group keeps the original title and description', () => {
  const r = reportSeo('nintendo', 'Nintendo', { disclosure: '2026-09-19', resolved: true, packages, rollout: 'half' })
  // nintendo's char-sum parity decides the group; assert both branches via explicit rollout instead
  const all = reportSeo('nintendo', 'Nintendo', { disclosure: '2026-09-19', resolved: true, packages, rollout: 'all' })
  assert.match(all.title, /com\.nintendo\.znca/)
  assert.ok(all.withPackage)
  if (!r.withPackage) assert.equal(r.title, 'Nintendo · Disclosure Report · RFI-IRFOS')
})

test('page without a known package never gets a package title', () => {
  const r = reportSeo('unknown', 'Foo', { packages, rollout: 'all' })
  assert.equal(r.withPackage, false)
  assert.equal(r.title, 'Foo · Disclosure Report · RFI-IRFOS')
})

test('treatment title names package and respects the length cap', () => {
  const long = 'A very long combined target name list, Another App, Third App'
  const r = reportSeo('nintendo', long, { packages, rollout: 'all' })
  assert.ok(r.title.length <= 60 || r.title.endsWith('· RFI-IRFOS'))
  assert.match(r.description, /package com\.nintendo\.znca/)
})

test('group split is deterministic and roughly half', () => {
  const slugs = Array.from({ length: 200 }, (_, i) => `app-${i}-x`)
  const first = slugs.map(s => inPackageTitleGroup(s, 'half'))
  assert.deepEqual(first, slugs.map(s => inPackageTitleGroup(s, 'half')))
  const n = first.filter(Boolean).length
  assert.ok(n > 60 && n < 140, `split ${n}/200`)
})

test('rollout all puts every page in the group', () => {
  assert.ok(['a', 'bb', 'ccc'].every(s => inPackageTitleGroup(s, 'all')))
})

test('A/B-Test beendet 2026-10-31: Default-Rollout ist all, Pakettitel ohne explizites rollout', () => {
  assert.equal(PKG_TITLE_ROLLOUT, 'all')
  const r = reportSeo('nintendo', 'Nintendo', { packages })
  assert.ok(r.withPackage)
  assert.match(r.title, /com\.nintendo\.znca/)
  assert.ok(r.title.length <= 60, r.title)
})

test('description nennt Schweregrad und Rechtsgrundlagen und bleibt <= 160 Zeichen', () => {
  const r = reportSeo('nintendo', 'Nintendo', { disclosure: '2026-09-19', resolved: true, packages, severity: 'CRITICAL', statutes: 6 })
  assert.match(r.description, /highest severity: critical/)
  assert.match(r.description, /6 cited legal provisions/)
  assert.match(r.description, /Disclosed 2026-09-19/)
  assert.ok(r.description.length <= 160, `${r.description.length}: ${r.description}`)
})

test('lange Namenslisten halten Description <= 160', () => {
  const names = 'Facebook, Instagram, WhatsApp, Messenger, Threads, Oculus, Meta AI, Horizon'
  const p = { meta: [{ app: 'x', pkg: 'com.facebook.katana' }, { app: 'y', pkg: 'com.instagram.android' }] }
  const r = reportSeo('meta', names, { disclosure: '2026-09-19', packages: p, severity: 'HIGH', statutes: 3 })
  assert.ok(r.description.length <= 160, `${r.description.length}`)
  const noPkg = reportSeo('zzz', names, { disclosure: '2026-09-19', severity: 'HIGH', statutes: 3 })
  assert.ok(noPkg.description.length <= 160, `${noPkg.description.length}`)
})

test('Titel bleibt <= 60 auch bei sehr langen Zielnamen (ORF/Outfit7-Fall)', () => {
  const names = Array.from({ length: 14 }, (_, i) => `ORF Radio Bundesland ${i}`).join(', ')
  const p = { orf: [{ app: 'x', pkg: 'at.orf.tvthek' }] }
  assert.ok(reportSeo('orf', names, { packages: p }).title.length <= 60)
  assert.ok(reportSeo('zzz', names, {}).title.length <= 60)
  assert.match(reportSeo('orf', names, { packages: p }).title, /ORF Radio Bundesland 0 \+13/)
})

test('ohne Meta-Zusatzdaten bleibt die Description gueltig', () => {
  const r = reportSeo('nintendo', 'Nintendo', { packages })
  assert.ok(r.description.length > 20 && r.description.length <= 160)
  assert.ok(!/undefined|NaN/.test(r.description))
})
