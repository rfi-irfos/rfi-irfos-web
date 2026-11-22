// Share menu for research documents and evidence reports (one component since 2026-11-22; ResearchLibrary
// and TrackRecord each carried their own copy). Simeon 2026-11-22: every entry leads with its icon, a
// click shows a short green check at the right end of that row ("Link kopiert"), and the menu fades in
// and out instead of popping (house rule: nothing opens or closes abruptly).
import { useEffect, useRef, useState } from 'react'
import { IconShare, IconLink, IconBrandLinkedin, IconBrandX, IconBrandBluesky, IconBrandWhatsapp, IconBrandReddit, IconMail, IconCheck } from '@tabler/icons-react'
import type { Icon as TablerIcon } from '@tabler/icons-react'

const FADE_MS = 180

export function ShareMenu({ url, title, label, locale }: { url: string; title: string; label: string; locale: 'en' | 'de' }) {
  const de = locale === 'de'
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState(false)
  const [done, setDone] = useState<string | null>(null)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const timers = useRef<number[]>([])

  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)) }
  useEffect(() => () => timers.current.forEach(t => window.clearTimeout(t)), [])

  const openMenu = () => { setOpen(true); requestAnimationFrame(() => requestAnimationFrame(() => setShown(true))) }
  const closeMenu = (focusBtn = false) => {
    setShown(false)
    later(() => { setOpen(false); setDone(null) }, FADE_MS)
    if (focusBtn) btnRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.stopPropagation(); e.preventDefault(); closeMenu(true)
    }
    const onDown = (e: MouseEvent) => { if (!wrapRef.current?.contains(e.target as Node)) closeMenu() }
    document.addEventListener('keydown', onKey, true)
    document.addEventListener('mousedown', onDown)
    return () => { document.removeEventListener('keydown', onKey, true); document.removeEventListener('mousedown', onDown) }
  })

  const u = encodeURIComponent(url), ti = encodeURIComponent(title), both = encodeURIComponent(`${title} ${url}`)
  const links: { key: string; label: string; href: string; Icon: TablerIcon }[] = [
    { key: 'linkedin', label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, Icon: IconBrandLinkedin },
    { key: 'x', label: 'X', href: `https://x.com/intent/post?url=${u}&text=${ti}`, Icon: IconBrandX },
    { key: 'bluesky', label: 'Bluesky', href: `https://bsky.app/intent/compose?text=${both}`, Icon: IconBrandBluesky },
    { key: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/?text=${both}`, Icon: IconBrandWhatsapp },
    { key: 'reddit', label: 'Reddit', href: `https://www.reddit.com/submit?url=${u}&title=${ti}`, Icon: IconBrandReddit },
    { key: 'mail', label: de ? 'E-Mail' : 'Email', href: `mailto:?subject=${ti}&body=${both}`, Icon: IconMail },
  ]

  const onClick = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try { await navigator.share({ title, url }) } catch { /* cancelled */ }
      return
    }
    if (open) closeMenu(); else openMenu()
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setDone('copy')
      later(() => setDone(d => (d === 'copy' ? null : d)), 1800)
    } catch { window.prompt(label, url) }
  }
  // A share target opens in a new tab: confirm the row, then let the menu fade out.
  const shared = (key: string) => { setDone(key); later(() => closeMenu(), 650) }

  const row = (key: string, Icon: TablerIcon, text: string) => <>
    <Icon size={16} stroke={1.8} aria-hidden="true" className="share-menu-icon" />
    <span className="share-menu-label">{text}</span>
    <span className={`share-menu-check${done === key ? ' is-on' : ''}`} aria-hidden="true"><IconCheck size={15} stroke={2.4} /></span>
  </>

  return (
    <span ref={wrapRef} className="share-menu-wrap">
      <button ref={btnRef} type="button" onClick={onClick} aria-label={label} title={label} aria-haspopup="menu" aria-expanded={open} className="share-menu-btn">
        <IconShare size={18} stroke={1.8} aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" aria-label={label} className={`share-menu${shown ? ' is-shown' : ''}`}>
          <button role="menuitem" type="button" onClick={copy} className="share-menu-item" autoFocus>
            {row('copy', IconLink, done === 'copy' ? (de ? 'Link kopiert' : 'Link copied') : (de ? 'Link kopieren' : 'Copy link'))}
          </button>
          {links.map(l => (
            <a key={l.key} role="menuitem" href={l.href} target="_blank" rel="noopener noreferrer" onClick={() => shared(l.key)} className="share-menu-item">
              {row(l.key, l.Icon, l.label)}
            </a>
          ))}
          <span className="data-sr-only" role="status" aria-live="polite">{done === 'copy' ? (de ? 'Link kopiert' : 'Link copied') : ''}</span>
        </div>
      )}
    </span>
  )
}
