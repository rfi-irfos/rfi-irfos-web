// "Research Cooperation" / coop partner section (`#coop-partners`) - extracted
// verbatim from PublicSite.tsx. Its buy buttons open the same page-level
// checkout modal as Pricing, so `openCheckoutModal` is passed in as a prop.
import { Reveal } from './shared'
import { useLocale } from '../../hooks/useLocale'

type CheckoutInfo = { key: string; tier: string; desc: string; price: string; delivery?: string; directUrl?: string }

// The four separate "GitHub · <repo>" pills used to sit in the same badge row as
// every crates.io/OSF/live-link badge - live feedback: that read as "just a pile
// of pointless badges" eating space. One GitHub-branded pill (linking to the org)
// replaces all four; the individual repos move into a compact plain-text list
// right under it instead of repeating the same platform four times as full pills.
const LAURA_REPOS = ['call-laura', 'lauras-agents', 'lauras-agents-public', 'coevolution-factory']

function GithubMark() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

// COOP PARTNERS - not team, an external research partner whose method
// Lauras Team / Call Laura / Jarvis grew out of. Kept deliberately
// separate from the TEAM grid above (different relationship: Laura
// directs her own research and agent architecture; RFI-IRFOS builds
// on her direction, not the reverse).
export function CoopPartnersSection({
  mobile, openCheckoutModal,
}: {
  mobile: boolean
  openCheckoutModal: (info: CheckoutInfo) => void
}) {
  const { t } = useLocale()
  return (
    <section id="coop-partners" style={{ padding: '48px var(--sec-pad-x) 72px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Reveal>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12, textAlign: 'center' }}>{t.coopPartners.eyebrow}</p>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12, textAlign: 'center' }}>{t.coopPartners.heading}</h2>
          <p style={{ color: 'var(--text)', fontSize: 17, marginBottom: 40, textAlign: 'center', maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
            {t.coopPartners.subheading}
          </p>
        </Reveal>
        <Reveal from="bottom" delay={1}>
          {/* Card narrowed (2026-08-18, live feedback: "die karten schmaler, zu viel
              unused space") - was stretching to the full 1000px section width, most
              of it blank once the text and badge columns settled at their natural
              widths. flexWrap forced to 'nowrap' on desktop (mobile still wraps to a
              stack) so the text column growing with the longer description can't
              push the badge column onto its own line, which is what was pulling the
              badges into a centered-looking row below the text instead of staying
              pinned right beside it. */}
          <div className="rfi-glass-flat rfi-glass-solid" style={{
            display: 'flex', flexWrap: mobile ? 'wrap' : 'nowrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20,
            borderRadius: 14, padding: '28px 28px', maxWidth: 820, margin: '0 auto',
          }}>
            {/* alignItems was 'center', which floated her name down to the vertical
                middle of a tall pill stack instead of anchoring it at the top-left
                of the card (live feedback 2026-08-16). Her name is the heading of
                this card, so it starts where a heading starts. */}
            <div style={{ flex: '1 1 auto', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <p style={{ fontSize: 19, fontWeight: 800, color: 'var(--text)' }}>Laura Serna Gaviria</p>
                {/* The one badge worth promoting out of the pill cloud: a live
                    deployment is a claim about the present tense, so it belongs
                    beside the name rather than buried among version tags. */}
                <a href="https://laura-api.fly.dev" target="_blank" rel="noopener noreferrer"
                   style={{
                     display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700,
                     letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 999,
                     border: '1px solid rgba(16,185,129,.45)', color: '#10b981', textDecoration: 'none', whiteSpace: 'nowrap',
                   }}>
                  <span style={{ width: 5, height: 5, borderRadius: 999, background: '#10b981', display: 'inline-block' }} />
                  Live API
                </a>
              </div>
              <p style={{ fontSize: 13, color: 'var(--accent-text)', marginTop: 2, fontWeight: 600 }}>{t.coopPartners.role}</p>
              {/* Bumped fontSize/maxWidth (2026-08-18, live feedback: the card had
                  empty space next to the pill column) once the description grew
                  from one sentence to three - fills the card better instead of
                  wrapping narrow with blank space beside it. */}
              <p style={{ fontSize: 14.5, color: 'var(--text)', marginTop: 10, lineHeight: 1.6 }}>
                {t.coopPartners.laura.desc}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flex: '0 0 260px', maxWidth: 260 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 8 }}>
                {[
                  { label: 'GitHub · rfi-irfos', href: 'https://github.com/rfi-irfos', icon: true },
                  { label: 'lauras-core v0.2.0', href: 'https://crates.io/crates/lauras-core' },
                  { label: 'lauras-team v0.2.0 (auf Anfrage)', href: 'https://crates.io/crates/lauras-team' },
                  { label: 'lauras-mcp v0.2.0', href: 'https://crates.io/crates/lauras-mcp' },
                  { label: 'lauras-api v0.2.0', href: 'https://crates.io/crates/lauras-api' },
                  { label: 'OSF · HC9ZB', href: 'https://doi.org/10.17605/OSF.IO/HC9ZB' },
                  { label: 'OSF · QCVJB', href: 'https://doi.org/10.17605/OSF.IO/QCVJB' },
                  { label: 'OSF · UXCJE', href: 'https://doi.org/10.17605/OSF.IO/UXCJE' },
                  // "Live API" moved up beside her name. "Coevolution Factory" dropped
                  // entirely: coevolution-factory is already in the repo line below, so
                  // the pill was a second route to the same project and the cloud read
                  // as duplicated rather than dense (live feedback 2026-08-16).
                ].map((c, i) => (
                  <a key={i} href={c.href} target="_blank" rel="noopener noreferrer"
                     style={{
                       display: 'inline-flex', alignItems: 'center', gap: 6,
                       fontSize: 10.5, fontWeight: 600, padding: '5px 10px', borderRadius: 999,
                       border: '1px solid var(--border)', color: 'var(--text2)',
                       textDecoration: 'none', whiteSpace: 'nowrap',
                     }}>
                    {c.icon && <GithubMark />}
                    {c.label}
                  </a>
                ))}
              </div>
              {/* The four repos behind the single GitHub badge above, as a plain compact
                  list rather than four more pills - still one click away, none of the weight. */}
              <p style={{ margin: 0, fontSize: 11, color: 'var(--text3)', textAlign: 'right', lineHeight: 1.7 }}>
                {LAURA_REPOS.map((repo, i) => (
                  <span key={repo}>
                    <a href={`https://github.com/rfi-irfos/${repo}`} target="_blank" rel="noopener noreferrer"
                       style={{ color: 'var(--text3)', textDecoration: 'underline', textUnderlineOffset: 2 }}>
                      {repo}
                    </a>
                    {i < LAURA_REPOS.length - 1 ? ' · ' : ''}
                  </span>
                ))}
              </p>
            </div>
          </div>
          <div style={{ maxWidth: 820, margin: '16px auto 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(4, minmax(0, 1fr))', gap: 10, alignItems: 'stretch' }}>
              {[
                { name: 'Systemaudit', price: '€4.500', href: 'https://buy.stripe.com/14AdRbgpi1fpdqt6jm7N60r' },
                { name: 'Emergent Case Intelligence Sprint', price: '€12.500', href: 'https://buy.stripe.com/bJe9AVc927DNdqtePS7N60m' },
                { name: 'Multi-Agent System Design', price: '€24.500', href: 'https://buy.stripe.com/00w3cxc92bU30DH2367N60n' },
                { name: 'System Design & Deployment', price: '€55.000', href: 'https://buy.stripe.com/dRm9AVgpi7DNdqt37a7N60A' },
              ].map((p, i) => (
                <button key={i}
                  onClick={() => openCheckoutModal({ key: `coop_${i}`, tier: p.name, desc: t.coopPartners.products[i].desc, price: p.price, delivery: t.coopPartners.productsDeliveryNote, directUrl: p.href })}
                  className="rfi-hover-card rfi-glass-flat rfi-glass-solid"
                  style={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 8, padding: '14px 16px', minHeight: 76, boxSizing: 'border-box',
                    borderRadius: 10, textAlign: 'left', cursor: 'pointer',
                  }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{p.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent-text)', marginTop: 'auto' }}>{p.price}</span>
                </button>
              ))}
            </div>
            <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 10 }}>
              {t.coopPartners.footerNotePrefix}{' '}
              <a href="https://emergent-interaction-lab.fly.dev" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text2)' }}>emergent-interaction-lab.fly.dev</a>.
            </p>
          </div>
        </Reveal>
      </div>

    </section>
  )
}
