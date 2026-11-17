// Related-pages tile grid shared by the landing pages and the legal/team pages (Simeon 17.11.2026:
// pages carry the quicklink pills at the top and the same set again as tiles at the bottom).
// Every tile stays a real <a href> so middle-click, SEO and no-JS keep working.
import React from 'react'
import { IconArrowRight } from '@tabler/icons-react'

export type RelatedItem = { href: string; label: string; Icon: typeof IconArrowRight }

const H2: React.CSSProperties = { fontSize: 'var(--fs-small)', fontWeight: 700, marginTop: 36, marginBottom: 10, color: 'var(--accent-text)' }

export function RelatedTiles({ items, title, navigate }: {
  items: RelatedItem[]
  title: string
  navigate: (e: React.MouseEvent, href: string) => void
}) {
  return (
    <section>
      <h2 style={H2}>{title}</h2>
      <nav aria-label={title} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 10, marginTop: 14 }}>
        {items.map(({ href, label, Icon }) => (
          <a key={href} href={href} onClick={e => navigate(e, href)} className="rfi-related-tile"
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.04)', color: '#e8e8f0', fontSize: 'var(--fs-small)', fontWeight: 600, lineHeight: 'var(--lh-tight)', textDecoration: 'none' }}>
            <Icon size={18} stroke={1.8} color="var(--accent-text)" aria-hidden style={{ flexShrink: 0 }} />
            <span style={{ flex: '1 1 auto' }}>{label}</span>
            <IconArrowRight size={15} stroke={1.8} color="#8a8aa0" aria-hidden style={{ flexShrink: 0 }} />
          </a>
        ))}
      </nav>
    </section>
  )
}
