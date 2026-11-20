import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocale } from '../../hooks/useLocale'

// Second direction of the domain check (19.11.2026): visitors without a domain of their own look at any
// site, passively. Four area requests to /api/safety-check (backend/src/safety.rs) run in parallel and each
// row resolves as soon as its own answer is in. The backend returns codes, the wording lives here.
type St = 'ok' | 'warn' | 'bad' | 'info'
type AreaId = 'tls' | 'headers' | 'mail' | 'dns'
type ApiCheck = { state: St; code: string; value?: string }
type ApiArea = { area: AreaId; state: St; score: number | null; checks: ApiCheck[] }
const AREAS: AreaId[] = ['tls', 'headers', 'mail', 'dns']

type Words = {
  areas: Record<AreaId, string>
  codes: Record<string, string>
  fixes: Record<string, string>
}

const DE_WORDS: Words = {
  areas: { tls: 'Zertifikat', headers: 'Sicherheits-Header', mail: 'E-Mail-Schutz', dns: 'DNS' },
  codes: {
    cert_ok: 'Zertifikat gültig, läuft in {v} Tagen ab', cert_ok_unknown_expiry: 'Zertifikat gültig', cert_expiring: 'Zertifikat läuft in {v} Tagen ab',
    cert_expired: 'Zertifikat ist abgelaufen', cert_not_yet_valid: 'Zertifikat ist noch nicht gültig', cert_untrusted: 'Zertifikat stammt von keiner vertrauenswürdigen Stelle',
    cert_name_mismatch: 'Zertifikat gilt nicht für diesen Namen', tls_failed: 'Die verschlüsselte Verbindung kommt nicht zustande', https_unreachable: 'HTTPS ist nicht erreichbar',
    tls13_yes: 'TLS 1.3 verfügbar', tls13_no: 'TLS 1.3 wird nicht angeboten', https_redirect: 'HTTP leitet auf HTTPS um', http_no_redirect: 'HTTP leitet nicht auf HTTPS um',
    http_open: 'Seite wird unverschlüsselt über HTTP ausgeliefert', http_other: 'HTTP antwortet ohne Umleitung', http_closed: 'Port 80 ist geschlossen',
    hsts_ok: 'HSTS aktiv ({v} Tage)', hsts_short: 'HSTS gilt nur {v} Tage', hsts_missing: 'HSTS fehlt',
    csp_ok: 'Content-Security-Policy gesetzt', csp_report_only: 'Content-Security-Policy nur im Testmodus', csp_missing: 'Content-Security-Policy fehlt',
    frame_ok: 'Schutz vor Clickjacking gesetzt', frame_missing: 'Schutz vor Clickjacking fehlt',
    nosniff_ok: 'Typ-Erkennung im Browser verhindert', nosniff_missing: 'X-Content-Type-Options fehlt',
    server_version: 'Softwareversion im Header sichtbar: {v}', server_hidden: 'Keine Softwareversion im Header',
    spf_strict: 'SPF vorhanden, strikt (-all)', spf_soft: 'SPF vorhanden (~all)', spf_redirect: 'SPF vorhanden (per Weiterleitung)', spf_neutral: 'SPF erlaubt fremde Absender (?all)',
    spf_open: 'SPF erlaubt jedem das Senden (+all)', spf_no_all: 'SPF ohne abschließende Regel', spf_multiple: 'Mehrere SPF-Einträge, dadurch ungültig', spf_missing: 'SPF-Eintrag fehlt',
    dmarc_enforced: 'DMARC aktiv (p={v})', dmarc_none: 'DMARC auf p=none: Fälschungen werden nur beobachtet', dmarc_invalid: 'DMARC-Eintrag ohne gültige Richtlinie', dmarc_missing: 'DMARC fehlt',
    dkim_found: 'DKIM-Schlüssel gefunden ({v})', dkim_unknown: 'DKIM unter üblichen Namen nicht gefunden (kein Urteil)', mail_unused: 'Keine E-Mail-Nutzung erkennbar', lookup_failed: 'Die Abfrage blieb ohne Antwort',
    ns_redundant: '{v} Nameserver eingetragen', ns_single: 'Nur ein Nameserver, kein Ausfallschutz', dnssec_yes: 'DNSSEC signiert', dnssec_no: 'DNSSEC nicht aktiv',
    caa_yes: 'CAA-Eintrag begrenzt, wer Zertifikate ausstellen darf', caa_no: 'Kein CAA-Eintrag', no_dangling: 'Keine hängenden Einträge', dangling_cname: 'Alias zeigt ins Leere: {v}',
  },
  fixes: {
    cert_expired: 'Zertifikat erneuern.', cert_untrusted: 'Zertifikat einer öffentlichen Zertifizierungsstelle einsetzen.', cert_name_mismatch: 'Zertifikat für genau diesen Namen ausstellen.',
    cert_expiring: 'Erneuerung automatisieren.', tls13_no: 'TLS 1.3 am Server aktivieren.', http_open: 'HTTP dauerhaft auf HTTPS umleiten.', http_no_redirect: 'HTTP dauerhaft auf HTTPS umleiten.',
    hsts_missing: 'HSTS mit mindestens sechs Monaten setzen.', hsts_short: 'HSTS auf mindestens sechs Monate verlängern.', csp_missing: 'Content-Security-Policy ergänzen.',
    csp_report_only: 'Richtlinie nach dem Test erzwingen.', frame_missing: 'frame-ancestors oder X-Frame-Options setzen.', nosniff_missing: 'X-Content-Type-Options: nosniff setzen.',
    server_version: 'Softwareversion im Header ausblenden.', spf_missing: 'SPF-Eintrag anlegen.', spf_open: 'SPF auf -all oder ~all stellen.', spf_neutral: 'SPF mit -all abschließen.',
    spf_no_all: 'SPF mit -all abschließen.', spf_multiple: 'Auf einen einzigen SPF-Eintrag zusammenführen.', dmarc_missing: 'DMARC-Eintrag anlegen, zunächst mit p=none.',
    dmarc_none: 'DMARC auf quarantine oder reject stellen.', dmarc_invalid: 'DMARC-Richtlinie (p=) ergänzen.', ns_single: 'Zweiten Nameserver ergänzen.',
    dnssec_no: 'DNSSEC beim Registrar aktivieren.', caa_no: 'CAA-Eintrag für die genutzte Zertifizierungsstelle anlegen.', dangling_cname: 'Alias entfernen oder das Ziel wiederherstellen.',
  },
}

const EN_WORDS: Words = {
  areas: { tls: 'Certificate', headers: 'Security headers', mail: 'Email protection', dns: 'DNS' },
  codes: {
    cert_ok: 'Certificate valid, expires in {v} days', cert_ok_unknown_expiry: 'Certificate valid', cert_expiring: 'Certificate expires in {v} days',
    cert_expired: 'Certificate has expired', cert_not_yet_valid: 'Certificate is not valid yet', cert_untrusted: 'Certificate is not from a trusted authority',
    cert_name_mismatch: 'Certificate does not cover this name', tls_failed: 'The encrypted connection cannot be established', https_unreachable: 'HTTPS is not reachable',
    tls13_yes: 'TLS 1.3 available', tls13_no: 'TLS 1.3 is not offered', https_redirect: 'HTTP redirects to HTTPS', http_no_redirect: 'HTTP does not redirect to HTTPS',
    http_open: 'Site is served unencrypted over HTTP', http_other: 'HTTP answers without a redirect', http_closed: 'Port 80 is closed',
    hsts_ok: 'HSTS active ({v} days)', hsts_short: 'HSTS only lasts {v} days', hsts_missing: 'HSTS missing',
    csp_ok: 'Content-Security-Policy set', csp_report_only: 'Content-Security-Policy in test mode only', csp_missing: 'Content-Security-Policy missing',
    frame_ok: 'Clickjacking protection set', frame_missing: 'Clickjacking protection missing',
    nosniff_ok: 'Browser type sniffing prevented', nosniff_missing: 'X-Content-Type-Options missing',
    server_version: 'Software version visible in header: {v}', server_hidden: 'No software version in header',
    spf_strict: 'SPF present, strict (-all)', spf_soft: 'SPF present (~all)', spf_redirect: 'SPF present (via redirect)', spf_neutral: 'SPF allows foreign senders (?all)',
    spf_open: 'SPF lets anyone send (+all)', spf_no_all: 'SPF without a closing rule', spf_multiple: 'Several SPF records, which makes them invalid', spf_missing: 'SPF record missing',
    dmarc_enforced: 'DMARC active (p={v})', dmarc_none: 'DMARC on p=none: forged mail is only observed', dmarc_invalid: 'DMARC record without a valid policy', dmarc_missing: 'DMARC missing',
    dkim_found: 'DKIM key found ({v})', dkim_unknown: 'DKIM not found under common names (no verdict)', mail_unused: 'No email use detected', lookup_failed: 'The lookup got no answer',
    ns_redundant: '{v} name servers listed', ns_single: 'Only one name server, no failover', dnssec_yes: 'DNSSEC signed', dnssec_no: 'DNSSEC not active',
    caa_yes: 'CAA record limits who may issue certificates', caa_no: 'No CAA record', no_dangling: 'No dangling records', dangling_cname: 'Alias points to nothing: {v}',
  },
  fixes: {
    cert_expired: 'Renew the certificate.', cert_untrusted: 'Use a certificate from a public certificate authority.', cert_name_mismatch: 'Issue a certificate for exactly this name.',
    cert_expiring: 'Automate the renewal.', tls13_no: 'Enable TLS 1.3 on the server.', http_open: 'Redirect HTTP to HTTPS permanently.', http_no_redirect: 'Redirect HTTP to HTTPS permanently.',
    hsts_missing: 'Set HSTS for at least six months.', hsts_short: 'Extend HSTS to at least six months.', csp_missing: 'Add a Content-Security-Policy.',
    csp_report_only: 'Enforce the policy after testing.', frame_missing: 'Set frame-ancestors or X-Frame-Options.', nosniff_missing: 'Set X-Content-Type-Options: nosniff.',
    server_version: 'Hide the software version in the header.', spf_missing: 'Create an SPF record.', spf_open: 'Set SPF to -all or ~all.', spf_neutral: 'End SPF with -all.',
    spf_no_all: 'End SPF with -all.', spf_multiple: 'Merge into a single SPF record.', dmarc_missing: 'Create a DMARC record, starting with p=none.',
    dmarc_none: 'Move DMARC to quarantine or reject.', dmarc_invalid: 'Add a DMARC policy (p=).', ns_single: 'Add a second name server.',
    dnssec_no: 'Enable DNSSEC at the registrar.', caa_no: 'Create a CAA record for the certificate authority you use.', dangling_cname: 'Remove the alias or restore its target.',
  },
}

const COPY = {
  en: {
    anyLead: 'See in seconds how well a website is set up.',
    anyBody: 'We read the publicly available information of the site: certificate, security headers, DNS and email protection. The result is a rating of its security hygiene. No sign-up and no email address needed, and nothing is stored.',
    anyMore: 'The result shows where the configuration has gaps, for example missing security headers or email protection that only monitors. For your own domain, with a researcher report and fixes down to the code, switch to the "My domain" tab.',
    items: [['Certificate', 'Validity, expiry, TLS version'], ['Security headers', 'HSTS, CSP, clickjacking protection'], ['Email protection', 'SPF, DKIM, DMARC'], ['DNS', 'DNSSEC, dangling records']] as [string, string][],
    modalTitle: 'Checking', reading: 'Reading public data…',
    tabOwn: 'My domain', tabOwnSub: 'with researcher report', tabAny: 'Any website', tabAnySub: 'instant, no email',
    placeholder: 'any-domain.com',
    label: 'Website or domain',
    cta: 'Check now',
    rating: 'Security hygiene',
    scope: 'What this shows: the configuration of the site. It does not say whether the content is trustworthy, and it does not replace a test with permission.',
    next: 'Want to know what an attacker could really reach? Your own domain gets the full Quick Check.',
    close: 'Close',
    stateLabel: { ok: 'OK', warn: 'Notice', bad: 'Gap', info: 'Not rated' },
    stateMany: { ok: 'OK', warn: 'Notices', bad: 'Gaps', info: 'Not rated' },
    dateLocale: 'en-GB',
    verdict: { good: 'Well set up', solid: 'Solid basis', weak: 'Clear need to catch up', gapIn: 'gap in' },
    fixLabel: 'Recommendation', fixLabelPlural: 'Recommendations',
    ctaOwn: 'Have your own domain checked in full',
    checkedAt: 'Checked', invalid: 'Please enter a website, for example any-domain.com.',
    errors: {
      invalid_domain: 'This does not look like a website address. Please check the spelling.',
      blocked: 'This address cannot be checked: it points to a non-public network.',
      not_found: 'This website could not be found. Please check the spelling.',
      rate_limited: 'You have reached the limit for now. Please try again in a few minutes.',
      target_busy: 'This website was checked very often just now. Please try again in a minute.',
      busy: 'The check is very busy right now. Please try again in a moment.',
      timeout: 'The website took too long to answer. Please try again.',
      generic: 'The check could not be completed. Please try again.',
    } as Record<string, string>,
    words: EN_WORDS,
  },
  de: {
    anyLead: 'Sehen Sie in Sekunden, wie gut eine Website aufgestellt ist.',
    anyBody: 'Wir lesen die öffentlich abrufbaren Informationen der Seite, also Zertifikat, Sicherheits-Header, DNS und E-Mail-Schutz, und fassen sie zu einer Bewertung der Security-Hygiene zusammen. Es braucht weder Anmeldung noch E-Mail-Adresse, und es wird nichts gespeichert.',
    anyMore: 'Das Ergebnis zeigt, wo die Konfiguration Lücken hat, zum Beispiel fehlende Sicherheits-Header oder einen E-Mail-Schutz, der nur beobachtet. Für Ihre eigene Domain, mit Researcher-Report und Fix bis in den Code, wechseln Sie zum Reiter „Meine Domain“.',
    items: [['Zertifikat', 'Gültigkeit, Laufzeit, TLS-Version'], ['Sicherheits-Header', 'HSTS, CSP, Schutz vor Clickjacking'], ['E-Mail-Schutz', 'SPF, DKIM, DMARC'], ['DNS', 'DNSSEC, hängende Einträge']] as [string, string][],
    modalTitle: 'Prüfung von', reading: 'Öffentliche Daten werden gelesen…',
    tabOwn: 'Meine Domain', tabOwnSub: 'mit Researcher-Report', tabAny: 'Beliebige Website', tabAnySub: 'sofort, ohne E-Mail',
    placeholder: 'any-domain.com',
    label: 'Website oder Domain',
    cta: 'Jetzt prüfen',
    rating: 'Security-Hygiene',
    scope: 'Das zeigt die Konfiguration der Seite. Ob der Inhalt vertrauenswürdig ist, sagt es nicht, und es ersetzt keinen Test mit Freigabe.',
    next: 'Möchten Sie wissen, was ein Angreifer wirklich erreicht? Für Ihre eigene Domain gibt es den vollen Quick Check.',
    close: 'Schließen',
    stateLabel: { ok: 'In Ordnung', warn: 'Hinweis', bad: 'Lücke', info: 'Nicht bewertet' },
    stateMany: { ok: 'In Ordnung', warn: 'Hinweise', bad: 'Lücken', info: 'Nicht bewertet' },
    dateLocale: 'de-AT',
    verdict: { good: 'Gut aufgestellt', solid: 'Solide Basis', weak: 'Deutlicher Nachholbedarf', gapIn: 'Lücke bei' },
    fixLabel: 'Empfehlung', fixLabelPlural: 'Empfehlungen',
    ctaOwn: 'Eigene Domain vollständig prüfen lassen',
    checkedAt: 'Geprüft', invalid: 'Bitte geben Sie eine Website ein, zum Beispiel any-domain.com.',
    errors: {
      invalid_domain: 'Das sieht nicht nach einer Website-Adresse aus. Bitte prüfen Sie die Schreibweise.',
      blocked: 'Diese Adresse lässt sich nicht prüfen: Sie zeigt auf ein nicht öffentliches Netz.',
      not_found: 'Diese Website wurde nicht gefunden. Bitte prüfen Sie die Schreibweise.',
      rate_limited: 'Sie haben das Limit vorerst erreicht. Bitte versuchen Sie es in ein paar Minuten erneut.',
      target_busy: 'Diese Website wurde gerade sehr oft geprüft. Bitte versuchen Sie es in einer Minute erneut.',
      busy: 'Die Prüfung ist gerade stark ausgelastet. Bitte versuchen Sie es gleich erneut.',
      timeout: 'Die Website hat zu lange nicht geantwortet. Bitte versuchen Sie es erneut.',
      generic: 'Die Prüfung ließ sich nicht abschließen. Bitte versuchen Sie es erneut.',
    } as Record<string, string>,
    words: DE_WORDS,
  },
}

const COLOR: Record<St, string> = { ok: 'var(--accent-text)', warn: '#f5b942', bad: 'var(--sev-crit)', info: 'var(--text2)' }
const MARK: Record<St, string> = { ok: '✓', warn: '!', bad: '✕', info: '·' }
const scoreColor = (n: number) => (n >= 75 ? 'var(--accent-text)' : n >= 50 ? '#f5b942' : 'var(--sev-crit)')

export function useSafetyCopy() {
  const { locale } = useLocale()
  return COPY[locale === 'de' ? 'de' : 'en']
}

const KEYFRAMES = `
@keyframes dsc-spin { to { transform: rotate(360deg) } }
@keyframes dsc-sweep { 0% { transform: translateX(-100%) } 100% { transform: translateX(350%) } }
@keyframes dsc-gauge { from { stroke-dashoffset: 214 } }
@keyframes dsc-pop { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }
@keyframes dsc-fade { from { opacity: 0 } }
@keyframes dsc-rise { from { opacity: 0; transform: translateY(12px) scale(.98) } }
@media (prefers-reduced-motion: reduce) { .dsc-anim { animation: none !important } }
`

const fill = (tpl: string, v?: string) => tpl.replace('{v}', v ?? '')

// Overall rating: mean of the scored areas. A gap caps it below "well set up", so one red area never hides behind green ones.
function overall(results: ApiArea[]) {
  const scored = results.filter(r => r.score !== null)
  if (!scored.length) return null
  const mean = scored.reduce((sum, r) => sum + (r.score as number), 0) / scored.length
  return Math.round(results.some(r => r.state === 'bad') ? Math.min(mean, 79) : mean)
}

export function DomainSafetyPanel({ onNext }: { onNext: () => void }) {
  const c = useSafetyCopy()
  const fid = useId()
  const [domain, setDomain] = useState('')
  const [hint, setHint] = useState('')
  const [open, setOpen] = useState(false)
  // Closing fades backdrop and card out before the portal unmounts (Simeon 20.11.2026: "smooth, not instantly")
  const [closing, setClosing] = useState(false)
  const closeTimer = useRef<number | undefined>(undefined)
  const [results, setResults] = useState<Partial<Record<AreaId, ApiArea>>>({})
  const [failure, setFailure] = useState<string | null>(null)
  const [checkedAt, setCheckedAt] = useState<Date | null>(null)
  const ctl = useRef<AbortController | null>(null)
  const host = domain.trim().replace(/^https?:\/\//, '').split('/')[0]
  const done = AREAS.every(a => results[a])
  const list = AREAS.map(a => results[a]).filter((r): r is ApiArea => !!r)
  const score = done ? overall(list) : null

  const close = () => {
    ctl.current?.abort()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setOpen(false); return }
    setClosing(true)
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => { setOpen(false); setClosing(false) }, 260)
  }
  useEffect(() => () => { ctl.current?.abort(); window.clearTimeout(closeTimer.current) }, [])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const run = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation() // React bubbles portal events to the outer review form
    if (!host || !host.includes('.')) { setHint(c.invalid); return }
    setHint('')
    ctl.current?.abort()
    const ac = new AbortController()
    ctl.current = ac
    setResults({})
    setFailure(null)
    setCheckedAt(null)
    window.clearTimeout(closeTimer.current)
    setClosing(false)
    setOpen(true)
    const fail = (code: string) => { setFailure(f => f ?? code); ac.abort() }
    AREAS.forEach(async (area, i) => {
      const started = Date.now()
      try {
        const r = await fetch('/api/safety-check', {
          method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ domain: host, area }), signal: ac.signal,
        })
        if (!r.ok) {
          const j = await r.json().catch(() => ({}))
          fail(typeof j.error === 'string' ? j.error : 'generic')
          return
        }
        const data: ApiArea = await r.json()
        // slow, staggered reveal so the rows can be read and the check feels like real work
        const wait = 1200 + i * 700 - (Date.now() - started)
        if (wait > 0) await new Promise(res => window.setTimeout(res, wait))
        if (ac.signal.aborted) return
        setResults(p => { const n = { ...p, [area]: data }; if (AREAS.every(a => n[a])) setCheckedAt(new Date()); return n })
      } catch {
        if (!ac.signal.aborted) fail('generic')
      }
    })
  }

  const text = (k: ApiCheck) => fill(c.words.codes[k.code] ?? k.code, k.value)
  const areaNote = (r: ApiArea) => {
    const worst = r.checks.find(k => k.state === 'bad') ?? r.checks.find(k => k.state === 'warn') ?? r.checks[0]
    return worst ? text(worst) : ''
  }
  const gaps = list.filter(r => r.state === 'bad').map(r => c.words.areas[r.area])
  const verdict = score === null ? '' : `${score >= 90 ? c.verdict.good : score >= 70 ? c.verdict.solid : c.verdict.weak}${gaps.length ? `, ${c.verdict.gapIn} ${gaps.join(', ')}` : ''}`

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
      <style>{KEYFRAMES}</style>
      <form id={`${fid}-f`} onSubmit={run} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
        <label htmlFor={`${fid}-d`} style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{c.label}</label>
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 0 }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ position: 'absolute', left: 16, top: 17, pointerEvents: 'none' }}><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.500 2.500 3.800 5.500 3.800 9s-1.300 6.500-3.800 9c-2.500-2.500-3.800-5.500-3.800-9S9.500 5.500 12 3z" /></svg>
          <input id={`${fid}-d`} type="text" inputMode="url" autoCapitalize="none" autoCorrect="off" spellCheck={false} required value={domain}
            placeholder={c.placeholder} onChange={e => { setDomain(e.target.value); if (hint) setHint('') }} className="fx-input irf-ph"
            aria-invalid={!!hint} aria-describedby={hint ? `${fid}-h` : undefined}
            style={{ width: '100%', borderRadius: 12, padding: '15px 16px 15px 46px', color: 'var(--text)', fontSize: 16, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
      </form>
      {hint && <p id={`${fid}-h`} role="alert" style={{ margin: 0, fontSize: 'var(--fs-label)', color: 'var(--sev-crit)' }}>{hint}</p>}
      <ul style={{ listStyle: 'none', margin: '10px 0 0', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px 18px' }}>
        {c.items.map(([name, desc]) => (
          <li key={name} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <span aria-hidden style={{ flexShrink: 0, width: 22, height: 22, marginTop: 1, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'color-mix(in srgb, var(--accent-text) 16%, transparent)', boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--accent-text) 45%, transparent)' }}>
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="var(--accent-text)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.500l4.500 4.500L19 7.500" /></svg>
            </span>
            <span style={{ fontSize: 'var(--fs-small)', lineHeight: 1.35, color: 'var(--text)' }}><strong>{name}</strong><br /><span style={{ color: 'var(--text)', fontSize: 'var(--fs-label)' }}>{desc}</span></span>
          </li>
        ))}
      </ul>
      <button type="submit" form={`${fid}-f`} className="fx-cta"
        style={{ marginTop: 'auto', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {c.cta}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.400" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </button>
      </div>
      {open && createPortal(
        <div onClick={close} className="dsc-anim" style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(4,4,10,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, overflowY: 'auto', animation: 'dsc-fade .25s ease', opacity: closing ? 0 : 1, transition: 'opacity .26s ease', pointerEvents: closing ? 'none' : undefined }}>
          <style>{KEYFRAMES}</style>
          <div role="dialog" aria-modal="true" aria-labelledby={`${fid}-t`} onClick={e => e.stopPropagation()} className="irf-card-glow dsc-anim"
            style={{ width: '100%', maxWidth: done ? 980 : 520, transition: 'max-width .35s ease, opacity .26s ease, transform .26s ease', animation: 'dsc-rise .3s cubic-bezier(.2,.8,.2,1)', opacity: closing ? 0 : 1, transform: closing ? 'translateY(10px) scale(.98)' : 'none', borderRadius: 20, padding: done ? 34 : 26, display: 'flex', flexDirection: 'column', gap: done ? 22 : 16, boxSizing: 'border-box', background: 'var(--surface, #0e0e18)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div id={`${fid}-t`} style={{ fontWeight: 700, fontSize: 'var(--fs-lead)', color: 'var(--text)', overflowWrap: 'anywhere' }}>{c.modalTitle} {host}</div>
              <button type="button" onClick={close} aria-label={c.close} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            {failure ? (
              <div role="alert" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
                <p style={{ margin: 0, fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', color: 'var(--text)' }}>{c.errors[failure] ?? c.errors.generic}</p>
                <button type="button" onClick={close} className="fx-cta" style={{ color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>{c.close}</button>
              </div>
            ) : (
              <>
                <div aria-hidden style={{ position: 'relative', height: 4, borderRadius: 4, overflow: 'hidden', background: 'color-mix(in srgb, var(--text) 10%, transparent)' }}>
                  {done
                    ? <div style={{ position: 'absolute', inset: 0, background: 'var(--accent-text)', transition: 'opacity .4s' }} />
                    : <div className="dsc-anim" style={{ position: 'absolute', top: 0, bottom: 0, width: '30%', borderRadius: 4, background: 'linear-gradient(90deg, transparent, var(--accent-text), transparent)', animation: 'dsc-sweep 1.1s ease-in-out infinite' }} />}
                </div>
                {!done && <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {AREAS.map(a => {
                    const r = results[a]
                    const running = !r
                    return (
                      <li key={a} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', opacity: 1, transition: 'opacity .3s' }}>
                        <span aria-hidden className="dsc-anim" style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#0b0b12', background: r ? COLOR[r.state] : 'transparent', border: r ? 'none' : '2px solid color-mix(in srgb, var(--text) 25%, transparent)', borderTopColor: running ? 'var(--accent-text)' : undefined, animation: running ? 'dsc-spin .8s linear infinite' : 'dsc-pop .3s ease', boxSizing: 'border-box' }}>{r ? MARK[r.state] : ''}</span>
                        <span style={{ fontSize: 'var(--fs-small)', lineHeight: 'var(--lh-body)', color: 'var(--text)' }}>
                          <strong>{c.words.areas[a]}</strong>
                          <br />
                          {r ? <span className="dsc-anim" style={{ animation: 'dsc-pop .3s ease' }}>{areaNote(r)}</span> : <span style={{ color: 'var(--text2)' }}>{c.reading.replace('…', '')}: {c.items[AREAS.indexOf(a)][1]}…</span>}
                        </span>
                      </li>
                    )
                  })}
                </ul>}
                {done && score !== null && (
                  <div className="dsc-anim" style={{ display: 'flex', flexDirection: 'column', gap: 22, animation: 'dsc-pop .4s ease' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap', padding: '24px 28px', borderRadius: 18, border: `1px solid color-mix(in srgb, ${scoreColor(score)} 40%, transparent)`, background: `color-mix(in srgb, ${scoreColor(score)} 7%, transparent)` }}>
                      <div style={{ position: 'relative', width: 128, height: 128, flexShrink: 0 }}>
                        <svg width={128} height={128} viewBox="0 0 80 80" aria-hidden style={{ transform: 'rotate(-90deg)' }}>
                          <circle cx={40} cy={40} r={34} fill="none" stroke="color-mix(in srgb, var(--text) 12%, transparent)" strokeWidth={7} />
                          <circle cx={40} cy={40} r={34} fill="none" stroke={scoreColor(score)} strokeWidth={7} strokeLinecap="round" strokeDasharray={214} strokeDashoffset={214 - (214 * score) / 100} className="dsc-anim" style={{ animation: 'dsc-gauge 1s ease-out' }} />
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 800, color: 'var(--text)' }}>{score}</div>
                      </div>
                      <div style={{ flex: '1 1 240px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ fontSize: 'var(--fs-small)', fontWeight: 700, color: scoreColor(score) }}>{c.rating} · {score} / 100</div>
                        <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.2, color: 'var(--text)' }}>{verdict}</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 2 }}>
                          {(['ok', 'warn', 'bad'] as St[]).map(k => {
                            const n = list.filter(r => r.state === k).length
                            return n ? <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 999, fontSize: 'var(--fs-small)', fontWeight: 600, color: 'var(--text)', background: `color-mix(in srgb, ${COLOR[k]} 16%, transparent)`, boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${COLOR[k]} 45%, transparent)` }}><span aria-hidden style={{ color: COLOR[k], fontWeight: 800 }}>{MARK[k]}</span>{n} {n > 1 ? c.stateMany[k] : c.stateLabel[k]}</span> : null
                          })}
                        </div>
                        <div style={{ fontSize: 'var(--fs-small)', color: 'var(--text)' }}>{host}{checkedAt ? ` · ${c.checkedAt} ${checkedAt.toLocaleString(c.dateLocale, { dateStyle: 'medium', timeStyle: 'short' })}` : ''}</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
                      {list.map(r => {
                        const fixes = Array.from(new Set(r.checks.filter(k => (k.state === 'warn' || k.state === 'bad') && c.words.fixes[k.code]).map(k => c.words.fixes[k.code]))).slice(0, 3)
                        return (
                          <div key={r.area} style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '20px 22px', borderRadius: 16, border: `1px solid color-mix(in srgb, ${COLOR[r.state]} 30%, transparent)`, background: 'color-mix(in srgb, var(--text) 3%, transparent)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span aria-hidden style={{ width: 28, height: 28, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: '#0b0b12', background: COLOR[r.state] }}>{MARK[r.state]}</span>
                              <strong style={{ flex: 1, fontSize: 'var(--fs-lead)', color: 'var(--text)' }}>{c.words.areas[r.area]}</strong>
                              <span style={{ fontSize: 'var(--fs-small)', fontWeight: 700, color: COLOR[r.state] }}>{c.stateLabel[r.state]}</span>
                            </div>
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                              {r.checks.map(k => (
                                <li key={k.code} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 'var(--fs-small)', lineHeight: 1.45, color: 'var(--text)' }}>
                                  <span aria-hidden style={{ flexShrink: 0, width: 16, textAlign: 'center', fontWeight: 800, color: COLOR[k.state] }}>{MARK[k.state]}</span>{text(k)}
                                </li>
                              ))}
                            </ul>
                            {fixes.length > 0 && <div style={{ marginTop: 'auto', fontSize: 'var(--fs-small)', lineHeight: 1.45, color: 'var(--text)', padding: '10px 12px', borderRadius: 10, background: 'color-mix(in srgb, var(--text) 6%, transparent)' }}><strong>{fixes.length > 1 ? c.fixLabelPlural : c.fixLabel}:</strong> {fixes.join(' ')}</div>}
                          </div>
                        )
                      })}
                    </div>
                    <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between', padding: '22px 26px', borderRadius: 18, border: '1px solid color-mix(in srgb, var(--accent-text) 30%, transparent)', background: 'color-mix(in srgb, var(--accent-text) 6%, transparent)' }}>
                      <span style={{ flex: '1 1 300px', fontSize: 'var(--fs-lead)', fontWeight: 600, lineHeight: 1.35, color: 'var(--text)' }}>{c.next}</span>
                      <button type="button" className="fx-cta" onClick={() => { close(); onNext() }} style={{ color: '#fff', border: 'none', padding: '14px 26px', borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                        {c.ctaOwn}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.400" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </button>
                    </div>
                    <p style={{ margin: 0, textAlign: 'center', fontSize: 'var(--fs-label)', lineHeight: 'var(--lh-body)', color: 'var(--text)' }}>{c.scope}</p>
                  </div>
                )}
                {done && score === null && (
                  <p role="alert" style={{ margin: 0, fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', color: 'var(--text)' }}>{c.errors.not_found}</p>
                )}
              </>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
