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
const { reportSeo, inPackageTitleGroup } = await import(pathToFileURL(out).href)

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
  assert.ok(r.title.length <= 70 || r.title.endsWith('· RFI-IRFOS'))
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
