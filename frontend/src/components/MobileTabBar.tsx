// App-style bottom navigation for phones (Simeon 2026-11-01, replaces the hamburger drawer).
// A floating glass bar: The Squad, World Model, Home in the middle, Evidence, Access. Real
// <a href>s so the links work without JS and stay crawlable; clicks go through PublicSite's
// view router. The active tab carries the accent: icon, label, a short bar and a soft glow.
import { IconHome, IconTopologyStar3, IconPlanet, IconFileSearch, IconLockOpen } from '@tabler/icons-react'
import type { ComponentType } from 'react'
import { localeHref } from '../lib/localeHref'

type NavLink = { key: string; label: string; href: string }
type IconType = ComponentType<{ size?: number; stroke?: number; 'aria-hidden'?: boolean }>

const ICONS: Record<string, IconType> = { home: IconHome, squad: IconTopologyStar3, worldModel: IconPlanet, trackRecord: IconFileSearch, pricing: IconLockOpen }

export function MobileTabBar({ view, locale, links, onNavigate }: {
  view: string
  locale: 'en' | 'de'
  links: NavLink[]
  onNavigate: (href: string) => void
}) {
  const home: NavLink = { key: 'home', label: locale === 'de' ? 'Start' : 'Home', href: '/' }
  const tabs = [links[0], links[1], home, ...links.slice(2)]
  return (
    <nav aria-label={locale === 'de' ? 'Hauptnavigation' : 'Main navigation'} style={{
      position: 'fixed', left: 10, right: 10, bottom: 'calc(10px + env(safe-area-inset-bottom))', zIndex: 150,
      display: 'flex', alignItems: 'stretch', height: 68, padding: '0 4px', borderRadius: 24, overflow: 'hidden',
      background: 'rgba(22, 24, 34, 0.55)', backdropFilter: 'blur(18px) saturate(140%)', WebkitBackdropFilter: 'blur(18px) saturate(140%)',
      border: '1px solid rgba(255, 255, 255, 0.09)',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 10px 32px rgba(0, 0, 0, 0.5)',
    }}>
      {tabs.map(n => {
        const Icon = ICONS[n.key]
        const active = n.key === 'home' ? view === 'home' : view === n.href.slice(1, -1)
        return (
          <a key={n.key} href={localeHref(n.href, locale)} aria-current={active ? 'page' : undefined}
            onClick={e => { e.preventDefault(); onNavigate(n.href) }}
            style={{
              position: 'relative', flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 5, textDecoration: 'none', fontSize: 'var(--fs-label)', fontWeight: active ? 600 : 500, whiteSpace: 'nowrap',
              color: active ? 'var(--accent-text)' : 'var(--text2)', transition: 'color .2s',
            }}>
            {active && <span aria-hidden="true" style={{ position: 'absolute', inset: '0 12%', background: 'radial-gradient(closest-side, color-mix(in srgb, var(--accent-text) 7%, transparent), transparent)', pointerEvents: 'none' }} />}
            <Icon size={24} stroke={1.5} aria-hidden />
            <span style={{ position: 'relative' }}>{n.label}</span>
            {active && <span aria-hidden="true" style={{ position: 'absolute', bottom: 6, width: 28, height: 2, borderRadius: 999, background: 'var(--accent-text)' }} />}
          </a>
        )
      })}
    </nav>
  )
}
