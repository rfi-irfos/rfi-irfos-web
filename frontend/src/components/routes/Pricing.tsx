import { useSiteGlue, useDocumentTitle, Reveal, TEAL } from './shared'

export default function Pricing() {
  const { mobile, form } = useSiteGlue()
  useDocumentTitle('Pricing — RFI-IRFOS')
  return (
    <div>
      {/* PRICING */}
      <section id="pricing" style={{ padding: '100px 2rem' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>05 / Pricing</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>priced in plain terms</h2>
            <p style={{ color: 'var(--text2)', marginBottom: 56, maxWidth: 560 }}>
              Fixed rates. No retainer lock-in unless you want one. Scope determines tier, not company size.
            </p>
          </Reveal>

          {/* Security Audit tiers */}
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 20 }}>Security Audits &amp; Responsible Disclosure</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 16, marginBottom: 48 }}>
            {([
              { tier: 'Public',                   price: 'free',      desc: 'Full public disclosure. Findings published after 90-day coordinated embargo. No NDA. First phone sanitizing session included.', highlight: false, stripeKey: null,            contact: false },
              { tier: 'Remediation Advisory',     price: '€4,500',    desc: 'Full report + remediation guidance. 30-day follow-up. GDPR compliance mapping included.',                                        highlight: false, stripeKey: 'remediation',   contact: false },
              { tier: 'Confidential',             price: '€9,000',    desc: 'NDA-protected disclosure. Private report + patch validation. Regulators still notified.',                                        highlight: false, stripeKey: 'confidential',  contact: false },
              { tier: 'Enterprise NDA',           price: '€18,000',   desc: 'Extended embargo + dedicated remediation support + legal evidence package.',                                                     highlight: false, stripeKey: 'enterprise_nda',contact: false },
              { tier: 'Critical Infrastructure',  price: '€75,000',   desc: 'NDA + legal + PR containment strategy + regulator liaison. Fullscope package.',                                                 highlight: true,  stripeKey: null,            contact: true  },
              { tier: 'IoB / Art. 9',             price: '€150,000',  desc: 'Internet of Bodies / wearables with health data (Art. 9 GDPR). Elevated risk premium.',                                        highlight: true,  stripeKey: null,            contact: true  },
              { tier: 'Annual Intelligence Retainer', price: '€250,000', desc: 'Full-year continuous monitoring of your entire app portfolio. Quarterly deep audits. Dedicated regulatory liaison across AP, DSB, BfDI, ICO. Monthly threat intelligence briefings. Instant breach notification. Market signal mapping via aladdin-mini.', highlight: true, stripeKey: null, contact: true },
              { tier: 'Full Intelligence Package',price: '€750,000',  desc: 'Everything in the Annual tier. Unlimited audits across your full vendor and partner ecosystem. Custom business intelligence dashboards. Real-time competitive intelligence. Proactive zero-day hunting. Board-level executive briefings. Custom regulatory strategy. Full-year dedicated research team allocation.', highlight: true, stripeKey: null, contact: true },
            ] as const).map((t, i) => (
              <Reveal key={t.tier} delay={i % 4} from={(['left','bottom','right','scale'] as const)[i % 4]}>
                <div style={{
                  background: t.highlight ? 'rgba(0,245,196,0.06)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${t.highlight ? 'rgba(0,245,196,0.25)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 14, padding: '24px 20px', height: '100%',
                  display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>{t.tier}</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--accent-text)', marginBottom: 10 }}>{t.price}</div>
                  <div style={{ color: 'var(--text2)', fontSize: 12, lineHeight: 1.7, flex: 1 }}>{t.desc}</div>
                  {t.stripeKey && (
                    <button
                      onClick={() => openCheckoutModal(t.stripeKey!)}
                      style={{ marginTop: 16, padding: '8px 16px', background: 'transparent', border: '1px solid var(--accent-border)', borderRadius: 6, color: 'var(--accent-text)', fontSize: 11, fontFamily: 'monospace', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                    >
                      get started →
                    </button>
                  )}
                  {t.contact && (
                    <a href="#contact" onClick={() => proposalRequest(t.tier)} style={{ marginTop: 16, padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 6, color: 'var(--text2)', fontSize: 11, fontFamily: 'monospace', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block' }}>
                      request proposal →
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          {/* Retainer */}
          <Reveal from="left">
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, padding: '24px 28px', marginBottom: 48,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
          }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>Security Retainer</div>
              <div style={{ color: 'var(--text2)', fontSize: 13 }}>continuous monitoring · quarterly audits · priority response · dedicated contact</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--accent-text)', whiteSpace: 'nowrap' }}>€1,500 / mo</div>
              <button
                onClick={() => openCheckoutModal('retainer')}
                style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--accent-border)', borderRadius: 6, color: 'var(--accent-text)', fontSize: 11, fontFamily: 'monospace', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase' }}
              >
                start retainer →
              </button>
            </div>
          </div>
          </Reveal>

          {/* Device Privacy Hardening */}
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 20 }}>Device Privacy Hardening - by appointment</p>
          <Reveal from="right">
          <div style={{
            background: 'rgba(0,245,196,0.04)', border: '1px solid rgba(0,245,196,0.18)',
            borderRadius: 14, padding: '24px 28px', marginBottom: 48,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
          }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>Phone Sanitizing: first session free</div>
              <div style={{ color: 'var(--text2)', fontSize: 13 }}>send us your phone - we disable background tracking scripts permanently · DNS-over-HTTPS · backup hardening · full before/after audit report · by appointment</div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--accent-text)', whiteSpace: 'nowrap' }}>free</div>
          </div>
          </Reveal>

          {/* Market Research & Competitor Analysis */}
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 20 }}>Market Research &amp; Competitor Analysis</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 16, marginBottom: 48 }}>
            {[
              { tier: 'Market Overview',          price: '€2,500',      stripeKey: 'market_overview',  desc: 'Sector landscape report. Key player mapping. Regulatory environment. 10-page minimum. Delivered in 5 business days.' },
              { tier: 'Competitor Intelligence',    price: '€7,500',      stripeKey: 'competitor_intel', desc: 'Deep-dive on 3–5 competitors. Technical stack analysis, privacy posture, market positioning, strategic vulnerabilities.' },
              { tier: 'Sector Intelligence Report', price: '€18,000',     stripeKey: 'sector_intel',     desc: 'Full market + regulatory + tech landscape. Quantified risk exposure per player. Quarterly update cycle.' },
              { tier: 'Ongoing Intelligence Briefing', price: '€4,500 / mo', stripeKey: 'ongoing_intel', desc: 'Continuous competitor tracking. Monthly briefings. Ad hoc alerts on significant moves. Dedicated analyst contact.' },
            ].map((t, i) => (
              <Reveal key={t.tier} delay={i % 4} from={(['left','bottom','right','scale'] as const)[i % 4]}>
                <div style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14, padding: '24px 20px', height: '100%',
                  display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>{t.tier}</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--accent-text)', marginBottom: 10 }}>{t.price}</div>
                  <div style={{ color: 'var(--text2)', fontSize: 12, lineHeight: 1.7, flex: 1 }}>{t.desc}</div>
                  <button
                    onClick={() => openCheckoutModal(t.stripeKey)}
                    style={{ marginTop: 16, padding: '8px 16px', background: 'transparent', border: '1px solid var(--accent-border)', borderRadius: 6, color: 'var(--accent-text)', fontSize: 11, fontFamily: 'monospace', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                  >
                    get started →
                  </button>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Web Development */}
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 20 }}>Web Development</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 16, marginBottom: 64 }}>
            {[
              { tier: 'Landing Page',   price: '€1,500',  stripeKey: 'web_landing'   as string | null, desc: 'Single-page site. React + our open-source template. Live in 48 hours.' },
              { tier: 'Full Site',      price: '€4,500',  stripeKey: 'web_full'      as string | null, desc: 'Multi-page + CMS admin + contact form + analytics. Ships as an installable PWA that runs like a native app on Android & iOS. 2-week delivery.' },
              { tier: 'Enterprise Site',price: '€18,000', stripeKey: 'web_enterprise' as string | null, desc: 'Custom Rust backend + auth + integrations + full scope. Includes native Android & iOS apps. Long-term support included.' },
              { tier: 'Platform Build', price: '€75,000', stripeKey: null,                              desc: 'Full product build. Custom infrastructure, API design, data pipelines, native apps, dedicated team. Ongoing engagement.' },
            ].map((t, i) => (
              <Reveal key={t.tier} delay={i % 4} from={(['left','bottom','right','scale'] as const)[i % 4]}>
                <div style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14, padding: '24px 20px', height: '100%',
                  display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>{t.tier}</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--accent-text)', marginBottom: 10 }}>{t.price}</div>
                  <div style={{ color: 'var(--text2)', fontSize: 12, lineHeight: 1.7, flex: 1 }}>{t.desc}</div>
                  {t.stripeKey ? (
                    <button
                      onClick={() => openCheckoutModal(t.stripeKey!)}
                      style={{ marginTop: 16, padding: '8px 16px', background: 'transparent', border: '1px solid var(--accent-border)', borderRadius: 6, color: 'var(--accent-text)', fontSize: 11, fontFamily: 'monospace', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                    >
                      get started →
                    </button>
                  ) : (
                    <a href="#contact" onClick={() => proposalRequest(t.tier)} style={{ marginTop: 16, padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 6, color: 'var(--text2)', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block' }}>
                      request proposal →
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          {/* Mobile App Development & Fixing */}
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>Mobile App Development &amp; Fixing</p>
          <p style={{ color: 'var(--text2)', marginBottom: 20, maxWidth: 620, fontSize: 13, lineHeight: 1.7 }}>
            Native Android &amp; iOS — built and fixed in-house. Send us your APK and we run root-level analysis, patch the bugs, or build the product from scratch. One team, no outsourced code.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 16, marginBottom: 64 }}>
            {[
              { tier: 'APK Review & Bugfix',  price: 'from €1,500', desc: 'Send us your APK. Root-level code analysis, crash + vulnerability triage, concrete patch guidance. Android & iOS. Fixed-scope, 1-week turnaround.' },
              { tier: 'App Build',            price: 'from €9,000', desc: 'We build your native app end-to-end — Kotlin/Swift + Rust backend, Play & App Store submission handled. Everything in-house.' },
              { tier: 'Maintenance Retainer',  price: '€1,200 / mo', desc: 'Ongoing patch cadence, store-compliance monitoring, dependency + SDK hygiene. Priority response, dedicated contact.' },
              { tier: 'Full Mobile Product',   price: 'on request',  desc: 'Complete mobile product from spec to launch. Custom infrastructure, API design, native apps, dedicated team. Ongoing engagement.' },
            ].map((t, i) => (
              <Reveal key={t.tier} delay={i % 4} from={(['left','bottom','right','scale'] as const)[i % 4]}>
                <div style={{
                  background: 'rgba(0,245,196,0.04)', border: '1px solid rgba(0,245,196,0.18)',
                  borderRadius: 14, padding: '24px 20px', height: '100%',
                  display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>{t.tier}</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--accent-text)', marginBottom: 10 }}>{t.price}</div>
                  <div style={{ color: 'var(--text2)', fontSize: 12, lineHeight: 1.7, flex: 1 }}>{t.desc}</div>
                  <a href="#contact" onClick={() => proposalRequest(t.tier)} style={{ marginTop: 16, padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 6, color: 'var(--text2)', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block' }}>
                    request proposal →
                  </a>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Research Cooperation Products - via our coop partner Laura Serna
              Gaviria / Emergent Interaction Lab. No Stripe checkout: these are
              bespoke engagements, always "on request" via #contact. See the
              COOP PARTNERS section below for who Laura is and the crates. */}
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 20 }}>Research Cooperation - via our coop partner, on request</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 16, marginBottom: 48 }}>
            {[
              { tier: 'Lauras Team',       desc: 'Access to the multi-agent system directed by Laura Serna Gaviria - one SWAT lead team directing 15 specialised sub-agents, built on her Emergent Interaction method. Scoped engagement per case.' },
              { tier: 'Lauras Agents',     desc: 'Licensed access to the private agent stack behind Lauras Team (lauras-team crate, access on request per crates.io). Bespoke licensing and integration scope, agreed case by case.' },
              { tier: 'Business Consulting Package', desc: 'Applying the Emergent Interaction / Case Intelligence method to your own organization - process reconstruction, framework derivation, agent architecture design, delivered jointly with our coop partner.' },
            ].map((t, i) => (
              <Reveal key={t.tier} delay={i % 4} from={(['left','bottom','right'] as const)[i % 3]}>
                <div style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14, padding: '24px 20px', height: '100%',
                  display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>{t.tier}</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--accent-text)', marginBottom: 10 }}>on request</div>
                  <div style={{ color: 'var(--text2)', fontSize: 12, lineHeight: 1.7, flex: 1 }}>{t.desc}</div>
                  <a href="#contact" onClick={() => proposalRequest(t.tier)} style={{ marginTop: 16, padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 6, color: 'var(--text2)', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block' }}>
                    request proposal →
                  </a>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Open Science statement */}
          <Reveal from="bottom">
          <div style={{
            borderTop: '1px solid rgba(0,245,196,0.15)',
            paddingTop: 32,
            textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>where the money goes</div>
            <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.8, maxWidth: 620, margin: '0 auto' }}>
              100% of surplus revenue is reinvested into open science, public research, and infrastructure.{' '}
              <span style={{ color: 'var(--accent-text)', fontWeight: 700 }}>Zero goes to shareholders - we have none.</span>{' '}
              RFI-IRFOS is a regulated not-for-profit (ZVR 1015608684). Every euro above operating costs funds the next audit, the next model training run, or the next research publication. That is not a marketing line. It is a legal obligation.
            </p>
          </div>
          </Reveal>
        </div>
      </section>


    </div>
  )
}
