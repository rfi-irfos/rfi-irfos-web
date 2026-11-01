// App-style bottom navigation for phones (Simeon 2026-11-01, replaces the hamburger drawer).
// Four views left and right, Home as the round button in the middle. Real <a href>s so the
// links still work without JS and stay crawlable; clicks go through PublicSite's view router.
import { IconHome, IconUsersGroup, IconWorld, IconFileSearch, IconKey } from '@tabler/icons-react'
import type { ComponentType } from 'react'
import { localeHref } from '../lib/localeHref'

type NavLink = { key: string; label: string; href: string }
type IconType = ComponentType<{ size?: number; stroke?: number; 'aria-hidden'?: boolean }>

const ICONS: Record<string, IconType> = { squad: IconUsersGroup, worldModel: IconWorld, trackRecord: IconFileSearch, pricing: IconKey }

export function MobileTabBar({ view, locale, links, onNavigate }: {
  view: string
  locale: 'en' | 'de'
  links: NavLink[]
  onNavigate: (href: string) => void
}) {
  const tab = (n: NavLink) => {
    const Icon = ICONS[n.key]
    const active = view === n.href.slice(1, -1)
    return (
      <a key={n.key} href={localeHref(n.href, locale)} aria-current={active ? 'page' : undefined}
        onClick={e => { e.preventDefault(); onNavigate(n.href) }}
        style={{
          position: 'relative', flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 4, paddingTop: 8, textDecoration: 'none', fontSize: 'var(--fs-label)', fontWeight: active ? 700 : 500,
          color: active ? 'var(--text)' : 'var(--text2)', whiteSpace: 'nowrap',
        }}>
        {active && <span aria-hidden="true" style={{ position: 'absolute', top: 0, width: 24, height: 2, borderRadius: 999, background: 'var(--accent-text)' }} />}
        <Icon size={22} stroke={1.6} aria-hidden />
        {n.label}
      </a>
    )
  }
  const home = view === 'home'
  return (
    <nav aria-label={locale === 'de' ? 'Hauptnavigation' : 'Main navigation'} style={{
      position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 150,
      display: 'flex', alignItems: 'stretch', height: 'calc(64px + env(safe-area-inset-bottom))',
      paddingBottom: 'env(safe-area-inset-bottom)',
      background: 'color-mix(in srgb, var(--bg) 92%, transparent)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      borderTop: '1px solid var(--border)',
    }}>
      {links.slice(0, 2).map(tab)}
      {/* Home sits inside the bar, vertically centred like the tabs (Simeon 01.11.: the raised,
          ringed FAB looked cut off from the bar). */}
      <div style={{ flex: '0 0 72px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <a href={localeHref('/', locale)} aria-label={locale === 'de' ? 'Startseite' : 'Home'} aria-current={home ? 'page' : undefined}
          onClick={e => { e.preventDefault(); onNavigate('/') }}
          style={{
            width: 46, height: 46, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--accent-text)', color: 'var(--bg)',
          }}>
          <IconHome size={22} stroke={2} aria-hidden />
        </a>
      </div>
      {links.slice(2).map(tab)}
    </nav>
  )
}
