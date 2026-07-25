import { useSiteGlue, useDocumentTitle, Reveal } from './shared'

export default function TrackRecord() {
  const { mobile, ledgerRef, ledgerFired, searchQuery, activeStatus, activeSev, sortBy, openDD, now } = useSiteGlue()
  useDocumentTitle('Track Record — RFI-IRFOS')
  return (
    <div>
      {/* TRACK RECORD */}
      <section id="track-record" style={{ padding: '100px 2rem' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <Reveal from="left">
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>03 / Track Record</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>the discipline, demonstrated</h2>
          </Reveal>
          <Reveal from="right" delay={1}>
            <p style={{ color: 'var(--text2)', marginBottom: 48, maxWidth: 720, fontSize: 15, lineHeight: 1.9 }}>
              Root level code analysis. Regulators in <strong style={{ color: 'var(--text)' }}>CC on every submission</strong> - national DPA + EDPS. 90-day coordinated disclosure. Our framework. Our timeline. Disclosure is unconditional: every organization on this ledger gets identical treatment, whether or not they engage us commercially. The full disclosure framework is in our <a href="#p/security" style={{ color: 'var(--accent-text)', textDecoration: 'none' }}>Security Policy</a>.
            </p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
            {[
              { n: `${AUDIT_HIGHLIGHTS.length}+`, label: 'Apps audited',        from: 'left'   },
              { n: `${new Set(AUDIT_HIGHLIGHTS.map(a => a.company ?? a.target)).size}+`, label: 'Companies notified',  from: 'bottom' },
              { n: `${AUDIT_HIGHLIGHTS.filter(a => a.sev === 'CRITICAL').length}+`, label: 'Critical findings',   from: 'top'    },
              { n: '18+',  label: 'Regulators notified', from: 'right'  },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i} from={s.from as 'left'|'bottom'|'top'|'right'}>
                <div style={{
                  background: 'rgba(0,245,196,0.05)', border: '1px solid rgba(0,245,196,0.15)',
                  borderRadius: 12, padding: '24px', textAlign: 'center', height: '100%',
                }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--accent-text)' }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: 'var(--text)', fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 6 }}>{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12, padding: '20px 24px', marginBottom: 48,
            fontFamily: 'monospace', fontSize: 12, color: 'var(--text2)', lineHeight: 1.8,
          }}>
            <span style={{ color: 'var(--accent-text)', fontWeight: 700 }}>NYSE · NASDAQ · LSE · XETRA</span>
            {' '}listed companies · GDPR Art. 5/8/9/13/25/32/44 · COPPA · EU AI Act (minor provisions) · ISO/IEC 29147 · coordinated disclosure 2026-09-19 · DSB · EDPB · ICO · BfDI · DPC · CERT.at · FTC
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', margin: 0 }}>Permanent disclosure ledger</h3>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text3)' }}>{AUDIT_HIGHLIGHTS.length} companies · live response tracking · disclosure 2026-09-19</span>
          </div>
          {/* Search + filter dropdowns - single row (stacks on mobile) */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'stretch', flexWrap: mobile ? 'wrap' : 'nowrap' }}>

            {/* Search */}
            <div style={{ position: 'relative', flex: 1, minWidth: 0, ...(mobile ? { flexBasis: '100%' } : {}) }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(0,245,196,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="search your company..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(0,245,196,0.04)',
                  border: searchQuery ? '1px solid rgba(0,245,196,0.55)' : '1px solid rgba(0,245,196,0.18)',
                  borderRadius: 7, padding: '9px 36px 9px 42px',
                  color: 'var(--text)', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12,
                  outline: 'none', transition: 'border-color 0.15s',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,245,196,0.55)' }}
                onBlur={e => { if (!searchQuery) e.currentTarget.style.borderColor = 'rgba(0,245,196,0.18)' }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: 4, lineHeight: 0,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>

            {/* Status dropdown */}
            <LedgerDropdown id="status" mobile={mobile} minWidth={115}
              value={activeStatus ?? ''} onSelect={v => setActiveStatus(v || null)}
              open={openDD === 'status'} onToggle={setOpenDD} placeholder="STATUS"
              selColor={activeStatus ? (STATUS_META[activeStatus]?.color ?? TEAL) : null}
              options={[{ value: '', label: 'STATUS' }, ...Object.entries(STATUS_META).map(([k, v]) => ({ value: k, label: `${v.label} (${AUDIT_HIGHLIGHTS.filter(a => a.status === k).length})`, color: v.color }))]}
            />

            {/* SEV dropdown */}
            <LedgerDropdown id="sev" mobile={mobile} minWidth={88}
              value={activeSev ?? ''} onSelect={v => setActiveSev(v || null)}
              open={openDD === 'sev'} onToggle={setOpenDD} placeholder="SEV"
              selColor={activeSev === 'CRITICAL' ? '#f87171' : activeSev === 'HIGH' ? '#fb923c' : activeSev === 'MEDIUM' ? '#fbbf24' : null}
              options={[{ value: '', label: 'SEV' }, ...(['CRITICAL', 'HIGH', 'MEDIUM'] as const).map(sev => ({ value: sev, label: `${sev} (${AUDIT_HIGHLIGHTS.filter(a => a.sev === sev).length})`, color: sev === 'CRITICAL' ? '#f87171' : sev === 'HIGH' ? '#fb923c' : '#fbbf24' }))]}
            />

            {/* Sort by dropdown */}
            <LedgerDropdown id="sort" mobile={mobile} minWidth={130}
              value={sortBy} onSelect={v => setSortBy(v)}
              open={openDD === 'sort'} onToggle={setOpenDD} placeholder="SORT"
              selColor={sortBy !== 'default' ? TEAL : null}
              options={[
                { value: 'elapsed-desc', label: 'ELAPSED ↓' },
                { value: 'notified-desc', label: 'NOTIFIED ↓' },
                { value: 'notified-asc', label: 'NOTIFIED ↑' },
                { value: 'sev', label: 'SEV' },
                { value: 'status', label: 'STATUS' },
                { value: 'default', label: 'DEFAULT' },
              ]}
            />

            {/* Moon */}
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 10px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, background: 'rgba(255,255,255,0.02)' }}>
              <MoonPhase now={now} />
            </div>

          </div>
          {(searchQuery.trim() || activeStatus || activeSev || sortBy !== 'default') && (() => {
            const n = AUDIT_HIGHLIGHTS.filter(a =>
              (!searchQuery.trim() ||
                a.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.finding.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (a.aliases ?? []).some(al => al.toLowerCase().includes(searchQuery.toLowerCase()))
              ) &&
              (!activeStatus || a.status === activeStatus) &&
              (!activeSev || a.sev === activeSev)
            ).length
            const sortLabel: Record<string, string> = { 'elapsed-desc': 'elapsed ↓', 'notified-desc': 'notified ↓', 'notified-asc': 'notified ↑', sev: 'sev', status: 'status' }
            return (
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: n > 0 ? TEAL : '#f87171', marginBottom: 10, letterSpacing: '0.06em' }}>
                {n > 0 ? `${n} of ${AUDIT_HIGHLIGHTS.length} entries` : `no matches`}
                {searchQuery.trim() ? ` for "${searchQuery}"` : ''}
                {sortBy !== 'default' ? ` · sorted by ${sortLabel[sortBy] ?? sortBy}` : ''}
              </div>
            )
          })()}

          {/* Table */}
          <div data-native-scroll style={{ maxHeight: mobile ? '65vh' : 900, overflowY: 'auto', borderRadius: 8, scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,245,196,0.2) transparent', border: '1px solid var(--border2)' }}>
            <style>{`@keyframes ledgerRowIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:none}}.ledger-sel{color-scheme:dark}.ledger-sel option{background:#12121e;color:#e2e2f0}@keyframes ekgPulse{0%{stroke-dashoffset:90;opacity:0}8%{opacity:1}80%{opacity:1}100%{stroke-dashoffset:-90;opacity:0}}.ekg-line{stroke-dasharray:90;animation:ekgPulse 2.4s linear infinite}@keyframes ddIn{from{opacity:0;transform:translateY(-6px) scaleY(0.97)}to{opacity:1;transform:none}}.ledger-dd-panel{transform-origin:top}.ledger-dd-opt:hover{background:rgba(0,245,196,0.12)!important;color:#00f5c4!important}`}</style>

            {/* Sticky header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: mobile
                ? '1fr 85px 110px'
                : 'minmax(120px,1.6fr) 82px 100px 72px minmax(160px,4fr) 110px 70px 130px 130px 56px',
              gap: '0 6px',
              padding: '7px 14px',
              position: 'sticky', top: 0, zIndex: 2,
              background: 'var(--bg)', borderBottom: '1px solid var(--border2)',
              fontFamily: 'monospace', fontSize: 10, fontWeight: 700,
              color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              <span>Organisation</span>
              {!mobile && <span>Notified</span>}
              <span>Status</span>
              {!mobile && <span>SEV</span>}
              {!mobile && <span>Intel</span>}
              {!mobile && <span>Statutes</span>}
              {!mobile && <span>Resolved</span>}
              <span>Disclosure</span>
              {!mobile && <span>Elapsed</span>}
              {!mobile && <span>Report</span>}
            </div>

            {/* Rows */}
            <div ref={ledgerRef}>
              {AUDIT_HIGHLIGHTS.filter(a =>
                (!searchQuery.trim() ||
                  a.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  a.finding.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  a.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (a.aliases ?? []).some(al => al.toLowerCase().includes(searchQuery.toLowerCase()))
                ) &&
                (!activeStatus || a.status === activeStatus) &&
                (!activeSev || a.sev === activeSev)
              ).sort((x, y) => {
                const SEV_ORDER: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2 }
                const STATUS_ORDER: Record<string, number> = { RESOLVED: -1, SILENT: 0, ESCALATED: 1, 'CS-DEFLECT': 2, REGULATOR: 2.5, WAITING: 3, ACK: 4, SUBSTANTIVE: 5, ENGAGED: 6, PAID: 7 }
                const resolveTs = (a: typeof x) => { const m = AUDIT_META[a.target]; if (m?.notified) return new Date(m.notified).getTime(); const d = a.finding.match(/(\d{4}-\d{2}-\d{2})/); return d ? new Date(d[1]).getTime() : 0 }
                const notifiedX = resolveTs(x)
                const notifiedY = resolveTs(y)
                const elapsedX = notifiedX ? now - notifiedX : 0
                const elapsedY = notifiedY ? now - notifiedY : 0
                if (sortBy === 'elapsed-desc') return elapsedY - elapsedX
                if (sortBy === 'notified-desc') return notifiedY - notifiedX
                if (sortBy === 'notified-asc') return notifiedX - notifiedY
                if (sortBy === 'sev') return (SEV_ORDER[x.sev] ?? 9) - (SEV_ORDER[y.sev] ?? 9)
                if (sortBy === 'status') return (STATUS_ORDER[x.status] ?? 9) - (STATUS_ORDER[y.status] ?? 9)
                return 0
              }).map((a, i) => {
                const sm = STATUS_META[a.status] ?? STATUS_META['WAITING']
                const meta = AUDIT_META[a.target]
                const disclosureTs = meta ? new Date(meta.disclosure).getTime() : new Date('2026-09-19').getTime()
                const msLeft = Math.max(0, disclosureTs - now)
                const daysLeft = Math.floor(msLeft / 86400000)
                const hLeft  = Math.floor((msLeft % 86400000) / 3600000)
                const mLeft  = Math.floor((msLeft % 3600000) / 60000)
                const sLeft  = Math.floor((msLeft % 60000) / 1000)
                const pad = (n: number) => String(n).padStart(2, '0')
                const cdStr = `${daysLeft}d ${pad(hLeft)}h ${pad(mLeft)}m ${pad(sLeft)}s`
                const cdColor = daysLeft > 60 ? TEAL : daysLeft > 30 ? '#fb923c' : '#f87171'
                const delay = Math.min(i * 30, 1500)
                const resolved = meta?.resolved ?? false
                const notifiedTs = meta?.notified ? new Date(meta.notified).getTime() : (() => { const d = a.finding.match(/(\d{4}-\d{2}-\d{2})/); return d ? new Date(d[1]).getTime() : null })()
                const resolvedTs = meta?.resolvedDate ? new Date(meta.resolvedDate).getTime() : null
                const elapsedEnd = (resolved && resolvedTs) ? resolvedTs : now
                const elapsedMs  = notifiedTs ? Math.max(0, elapsedEnd - notifiedTs) : 0
                const eDays = Math.floor(elapsedMs / 86400000)
                const eH    = Math.floor((elapsedMs % 86400000) / 3600000)
                const eM    = Math.floor((elapsedMs % 3600000)  / 60000)
                const eS    = Math.floor((elapsedMs % 60000)    / 1000)
                const eStr  = `${eDays}d ${pad(eH)}h ${pad(eM)}m ${pad(eS)}s`
                const eColor = resolved ? '#4ade80' : eDays > 60 ? '#f87171' : eDays > 30 ? '#fb923c' : TEAL
                const totalWindowMs = notifiedTs ? disclosureTs - notifiedTs : 90 * 86400000
                const batteryPct = notifiedTs ? Math.max(0, Math.min(1, (disclosureTs - now) / totalWindowMs)) : 1
                const batteryColor = batteryPct > 0.66 ? '#4ade80' : batteryPct > 0.33 ? '#fb923c' : '#f87171'
                return (
                  <div key={i} style={{
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'grid',
                    gridTemplateColumns: mobile
                      ? '1fr 95px 82px'
                      : 'minmax(120px,1.6fr) 82px 100px 72px minmax(160px,4fr) 110px 70px 130px 130px 56px',
                    gap: '0 6px',
                    padding: '9px 14px',
                    alignItems: 'start',
                    borderBottom: '1px solid var(--border2)',
                    background: i % 2 === 0 ? 'var(--bg2)' : 'transparent',
                    opacity: ledgerFired ? undefined : 0,
                    animation: ledgerFired ? `ledgerRowIn 0.38s cubic-bezier(0.22,1,0.36,1) ${delay}ms both` : 'none',
                  }}>
                    {/* Battery bar */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.05)' }}>
                      <div style={{ height: '100%', width: resolved ? '100%' : `${batteryPct * 100}%`, background: resolved ? 'linear-gradient(90deg, rgba(0,245,196,0.55), #00f5c4)' : `linear-gradient(90deg, ${batteryColor}55, ${batteryColor})`, borderRadius: '0 2px 0 0', transition: 'width 1s linear' }} />
                    </div>
                    {/* Organisation */}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text)', lineHeight: 1.4 }}>{a.target}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', marginTop: 2 }}>{a.market}</div>
                    </div>

                    {/* Notified */}
                    {!mobile && (
                      <div style={{ paddingTop: 1 }}>
                        <div style={{ fontFamily: 'monospace', fontSize: 10, color: meta?.notified ? 'var(--text2)' : 'var(--text4)' }}>
                          {meta?.notified ?? '-'}
                        </div>
                        {notifiedTs && (
                          <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'var(--accent-text)', marginTop: 2, letterSpacing: '0.04em' }}>
                            {eDays === 0 ? 'today' : `${eDays}d ago`}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Status */}
                    <div style={{ paddingTop: 1 }}>
                      <span className="site-status-badge" style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3, border: '1px solid var(--border)', background: sm.bg, color: sm.color, letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{sm.label}</span>
                    </div>

                    {/* SEV */}
                    {!mobile && (
                      <div style={{ paddingTop: 1 }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, color: SEV_COLOR[a.sev] ?? TEAL }}>{a.sev}</span>
                      </div>
                    )}

                    {/* Intel */}
                    {!mobile && (
                      <div style={{ color: 'var(--text2)', fontSize: 11, lineHeight: 1.6,
                        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }} title={a.finding}>
                        {a.finding}
                      </div>
                    )}

                    {/* Statutes */}
                    {!mobile && (() => {
                      const statutes = AUDIT_STATUTES[a.target] ?? []
                      const STATUTE_CAP = 3
                      const shown = statutes.slice(0, STATUTE_CAP)
                      const rest = statutes.slice(STATUTE_CAP)
                      return (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, paddingTop: 1, minWidth: 0, overflow: 'hidden' }}>
                          {statutes.length === 0 ? (
                            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text4)' }}>-</span>
                          ) : (
                            <>
                              {shown.map((s, si) => (
                                <span key={si} title={`${s.note} (${s.source})`} style={{
                                  fontFamily: 'monospace', fontSize: 8, fontWeight: 700, padding: '2px 5px',
                                  borderRadius: 3, letterSpacing: '0.04em', whiteSpace: 'nowrap', cursor: 'default',
                                  ...{ background: 'transparent', color: 'var(--text3)', border: '1px solid rgba(150,150,150,0.35)' },
                                }}>
                                  {s.article ? `${s.law} ${s.article}` : s.law}
                                </span>
                              ))}
                              {rest.length > 0 && (
                                <span
                                  title={rest.map(s => `${s.article ? `${s.law} ${s.article}` : s.law}: ${s.note} (${s.source})`).join('\n')}
                                  style={{
                                    fontFamily: 'monospace', fontSize: 8, fontWeight: 700, padding: '2px 5px',
                                    borderRadius: 3, letterSpacing: '0.04em', whiteSpace: 'nowrap', cursor: 'default',
                                    background: 'rgba(255,255,255,0.06)', color: 'var(--text3)', border: '1px solid rgba(150,150,150,0.25)',
                                  }}>
                                  +{rest.length}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      )
                    })()}

                    {/* Resolved */}
                    {!mobile && (
                      <div style={{ paddingTop: 1 }}>
                        <span style={{
                          fontFamily: 'monospace', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                          background: 'var(--surface-sunken)', color: 'var(--text)', letterSpacing: '0.07em',
                        }}>{resolved ? 'YES' : 'NO'}</span>
                      </div>
                    )}

                    {/* Countdown */}
                    <div style={{ paddingTop: 1 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: mobile ? 12 : 16, fontWeight: 900, color: resolved ? '#00f5c4' : cdColor, lineHeight: 1.3, letterSpacing: '0.02em', fontVariantNumeric: 'tabular-nums' }}>
                        {resolved ? 'CLOSED' : cdStr}
                      </div>
                      <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'var(--text4)', marginTop: 2, letterSpacing: '0.06em' }}>
                        DISCLOSURE
                      </div>
                    </div>

                    {/* Elapsed */}
                    {!mobile && (
                      <div style={{ paddingTop: 1 }}>
                        <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 900, color: eColor, lineHeight: 1.3, letterSpacing: '0.02em', fontVariantNumeric: 'tabular-nums' }}>
                          {notifiedTs ? eStr : '-'}
                        </div>
                        <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'var(--text4)', marginTop: 2, letterSpacing: '0.06em' }}>
                          {resolved ? 'RESPONDED' : 'ELAPSED'}
                        </div>
                      </div>
                    )}

                    {/* Report */}
                    {!mobile && (
                      <div style={{ paddingTop: 2 }}>
                        {meta?.reportUrl ? (
                          <button onClick={() => setReportModal(meta.reportUrl!)} style={{
                            background: 'rgba(0,245,196,0.10)', border: '1px solid rgba(0,245,196,0.3)',
                            borderRadius: 4, padding: '4px 8px', cursor: 'pointer', display: 'flex',
                            alignItems: 'center', gap: 4, color: TEAL, fontSize: 10, fontFamily: 'monospace',
                            fontWeight: 700, letterSpacing: '0.06em', transition: 'background 0.15s',
                          }}>
                            <svg width="10" height="12" viewBox="0 0 10 12" fill="none"><path d="M1 1h5l3 3v7H1V1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6 1v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M3 6h4M3 8h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
                            PDF
                          </button>
                        ) : (
                          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text4)' }}>-</span>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <p style={{ marginTop: 12, fontFamily: 'monospace', fontSize: 10, color: 'var(--text4)' }}>
            this ledger is updated in real time as companies respond. silence is public. · <a href="https://github.com/rfi-irfos/android-security-audit-2026" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text3)', textDecoration: 'none' }}>github.com/rfi-irfos/android-security-audit-2026</a>
          </p>
        </div>
      </section>
    </div>
  )
}
