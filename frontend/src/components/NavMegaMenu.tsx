import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { Content } from '../content/en'

// Shared glass-panel mega menu that lives under the whole nav row (not one
// panel per link) so switching between nav items while the mouse stays
// inside the menu zone crossfades/morphs the content instead of popping a
// fresh panel per item - the effect requested 2026-10-02 ("kipp und switch
// und blenden effekt wenn man die maus auf andere seite gibt"), modeled on
// a reference mega-menu (About Us/Jobs/Contact style card, icon + label
// rows, one shared floating panel).

export type MegaMenuKey = 'worldModel' | 'squad' | 'dataSolutions' | 'trackRecord' | 'pricing'

type MegaMenuItem = { icon: JSX.Element; label: string; href: string; external?: boolean }

const ICON_PROPS = { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

const Icons = {
  grid: <svg {...ICON_PROPS}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>,
  list: <svg {...ICON_PROPS}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>,
  book: <svg {...ICON_PROPS}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>,
  users: <svg {...ICON_PROPS}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  mail: <svg {...ICON_PROPS}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>,
  database: <svg {...ICON_PROPS}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" /><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" /></svg>,
  flask: <svg {...ICON_PROPS}><path d="M9 2v7.5L4 18a2 2 0 0 0 1.8 3h12.4a2 2 0 0 0 1.8-3l-5-8.5V2" /><path d="M9 2h6" /><path d="M7.5 15h9" /></svg>,
  github: <svg {...ICON_PROPS} fill="currentColor" stroke="none"><path d="M12 1.5a10.5 10.5 0 0 0-3.32 20.47c.53.1.72-.23.72-.5v-1.95c-2.93.64-3.55-1.23-3.55-1.23-.48-1.22-1.17-1.54-1.17-1.54-.96-.65.07-.64.07-.64 1.06.07 1.62 1.09 1.62 1.09.94 1.62 2.47 1.15 3.07.88.1-.68.37-1.15.67-1.42-2.34-.27-4.8-1.17-4.8-5.2 0-1.15.41-2.09 1.08-2.82-.11-.27-.47-1.35.1-2.8 0 0 .88-.28 2.88 1.08a9.98 9.98 0 0 1 5.24 0c2-1.36 2.88-1.08 2.88-1.08.57 1.45.21 2.53.1 2.8.67.73 1.08 1.67 1.08 2.82 0 4.04-2.47 4.93-4.82 5.19.38.33.72.97.72 1.96v2.9c0 .27.18.61.73.5A10.5 10.5 0 0 0 12 1.5z" /></svg>,
  tag: <svg {...ICON_PROPS}><path d="M20.59 13.41L13.42 20.58a2 2 0 0 1-2.83 0L2.83 12.83a2 2 0 0 1 0-2.83L10 2.83A2 2 0 0 1 11.41 2.24L20.59 2.24a2 2 0 0 1 2 2v9.17a2 2 0 0 1-.59 1.41z" /><circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" /></svg>,
  key: <svg {...ICON_PROPS}><path d="M21 2l-9.6 9.6" /><circle cx="7.5" cy="16.5" r="5.5" /><path d="M15.5 7.5l3 3" /><path d="M19 4l1 1" /></svg>,
}

function buildItems(t: Content, key: MegaMenuKey): MegaMenuItem[] {
  const m = t.nav.megaMenu
  switch (key) {
    case 'worldModel':
      return [
        { icon: Icons.grid, label: m.worldModel.differs, href: '/world-model/#wm-comparison' },
        { icon: Icons.flask, label: m.worldModel.practice, href: '/world-model/#wm-reasoning' },
        { icon: Icons.list, label: m.worldModel.applications, href: '/world-model/#wm-usecases' },
      ]
    case 'squad':
      return [
        { icon: Icons.users, label: m.squad.lineup, href: '/squad/#squad-overview' },
        { icon: Icons.grid, label: m.squad.integration, href: '/squad/#sq-connects' },
        { icon: Icons.mail, label: m.squad.faq, href: '/squad/#sq-need-to-know' },
      ]
    case 'dataSolutions':
      return [
        { icon: Icons.database, label: m.dataSolutions.datasets, href: '/data-solutions/#data-datasets' },
        { icon: Icons.list, label: m.dataSolutions.deliver, href: '/data-solutions/#data-deliver' },
        { icon: Icons.flask, label: m.dataSolutions.pipeline, href: '/data-solutions/#data-pipeline' },
      ]
    case 'trackRecord':
      return [
        { icon: Icons.list, label: m.trackRecord.overview, href: '/evidence/#track-record-reports' },
        { icon: Icons.flask, label: m.trackRecord.research, href: '/evidence/#proof' },
      ]
    case 'pricing':
      return [
        { icon: Icons.key, label: m.pricing.overview, href: '/access/' },
        { icon: Icons.tag, label: m.pricing.offer, href: '/access/#pricing-offer' },
        { icon: Icons.mail, label: m.pricing.contact, href: '#submit' },
      ]
  }
}

export function NavMegaMenu({ activeKey, anchorX, t, onNavigate, mobile }: {
  activeKey: MegaMenuKey | null
  anchorX: number | null
  t: Content
  onNavigate: (href: string) => void
  mobile: boolean
}) {
  if (mobile) return null
  // Access/pricing has no sub-sections worth a dropdown (confirmed by the user
  // 2026-10-02: "nur access braucht kein dropdown") - it stays a plain nav link.
  const openKey = activeKey === 'pricing' ? null : activeKey
  const items = openKey ? buildItems(t, openKey) : []

  return createPortal(
    <AnimatePresence>
      {openKey && (
        <motion.div
          key="nav-mega-menu"
          // x as a motion value (not a plain style.transform) because framer-motion
          // owns the transform CSS property on an animated motion.div - a manual
          // style.transform here gets silently overwritten by the y animation's
          // own transform, which is why the panel used to render with no -50%
          // centering applied at all once a y-animation was running.
          initial={{ opacity: 0, y: -6, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -6, x: '-50%' }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          style={{
            position: 'fixed', top: 68,
            // Centered under the actually-hovered nav link (anchorX is that
            // link's own horizontal midpoint), not under the nav row as a
            // whole - clamped 16px from the viewport edges so it can't run
            // off-screen for World Model/Access at the far ends of the row.
            // Portaled to document.body (live bug 2026-10-02: the panel rendered
            // far right of the hovered link) - <main className="rfi-view-stage">
            // carries a framer-motion identity transform, which per spec makes it
            // the containing block for any position:fixed descendant instead of
            // the viewport, the same issue ResearchAreaModal below works around
            // with its own createPortal call.
            left: anchorX == null ? '50%' : Math.min(Math.max(anchorX, 134), window.innerWidth - 134),
            zIndex: 39, minWidth: 236,
            background: 'rgba(10,11,18,0.94)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14,
            boxShadow: '0 20px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
            padding: 8,
          }}
        >
          {/* layout + key=activeKey makes AnimatePresence/motion treat this as the
              same floating box morphing content, not a new box every hover -
              the "kipp und switch" crossfade the reference GIF shows. */}
          <motion.div key={openKey} layout
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.14 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map(item => (
              <a key={item.label} href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                onClick={e => {
                  if (item.external) return
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
                  e.preventDefault()
                  onNavigate(item.href)
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 10px', borderRadius: 9,
                  color: '#d8d8ea', textDecoration: 'none', fontSize: 13.5, fontWeight: 500,
                  transition: 'background 0.14s, color 0.14s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,245,196,0.10)'; e.currentTarget.style.color = '#f0f0fa' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d8d8ea' }}
              >
                <span style={{ display: 'flex', color: 'var(--accent, #00f5c4)', flexShrink: 0 }}>{item.icon}</span>
                {item.label}
                {item.external && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ marginLeft: 'auto', opacity: 0.6 }}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                )}
              </a>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
