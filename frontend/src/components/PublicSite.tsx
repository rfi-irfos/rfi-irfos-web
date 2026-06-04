import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import type { SiteContent } from '../types/content'

// ── Edit context ─────────────────────────────────────────────────────────────

interface EditCtx {
  editMode: boolean
  onTextChange: (field: string, value: string) => void
  onImageClick: (field: string) => void
  onUpdate: (field: string, value: unknown) => void
  setFocusedEl: (el: HTMLElement | null) => void
}
const Ctx = createContext<EditCtx>({
  editMode: false,
  onTextChange: () => {},
  onImageClick: () => {},
  onUpdate: () => {},
  setFocusedEl: () => {},
})

// ── Floating format toolbar ───────────────────────────────────────────────────

function FormatToolbar({ anchorEl }: { anchorEl: HTMLElement | null }) {
  if (!anchorEl) return null

  const rect = anchorEl.getBoundingClientRect()
  const tbW = 308
  const left = Math.max(8, Math.min(rect.left + rect.width / 2 - tbW / 2, window.innerWidth - tbW - 8))
  const top = rect.top < 56 ? rect.bottom + 6 : rect.top - 46

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val)
    anchorEl.focus()
  }

  return (
    <div
      className="format-toolbar"
      style={{ position: 'fixed', top, left, width: tbW, zIndex: 9999 }}
      onMouseDown={e => e.preventDefault()}
    >
      <button className="fmt-btn fmt-b" title="Bold" onClick={() => exec('bold')}>B</button>
      <button className="fmt-btn fmt-i" title="Italic" onClick={() => exec('italic')}>I</button>
      <button className="fmt-btn fmt-u" title="Underline" onClick={() => exec('underline')}>U</button>
      <div className="fmt-sep" />
      <button className="fmt-btn" title="Align left" onClick={() => exec('justifyLeft')}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
      </button>
      <button className="fmt-btn" title="Center" onClick={() => exec('justifyCenter')}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
      </button>
      <button className="fmt-btn" title="Align right" onClick={() => exec('justifyRight')}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>
      </button>
      <div className="fmt-sep" />
      <button className="fmt-btn fmt-size-s" title="Small" onClick={() => exec('fontSize', '2')}>S</button>
      <button className="fmt-btn" title="Normal" onClick={() => exec('fontSize', '4')}>M</button>
      <button className="fmt-btn fmt-size-l" title="Large" onClick={() => exec('fontSize', '5')}>L</button>
      <button className="fmt-btn fmt-size-xl" title="Extra large" onClick={() => exec('fontSize', '7')}>XL</button>
      <div className="fmt-sep" />
      <label className="fmt-color-btn" title="Text color">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
        <input
          type="color"
          defaultValue="#111111"
          onChange={e => exec('foreColor', e.target.value)}
          onMouseDown={e => e.stopPropagation()}
          className="fmt-color-input"
        />
      </label>
    </div>
  )
}

// ── Inline-edit primitives ────────────────────────────────────────────────────

type TagName = keyof React.JSX.IntrinsicElements

interface EProps {
  field: string
  value: string
  as?: TagName
  className?: string
  style?: React.CSSProperties
  href?: string
}

function E({ field, value, as, className, style, href }: EProps) {
  const { editMode, onTextChange, setFocusedEl } = useContext(Ctx)
  const Tag = (as ?? 'span') as TagName

  if (!editMode) {
    const props: Record<string, unknown> = { className, style, dangerouslySetInnerHTML: { __html: value } }
    if (href) props.href = href
    return <Tag {...props} />
  }

  const editProps: Record<string, unknown> = {
    className: `${className ?? ''} editable-text`,
    style,
    contentEditable: true,
    suppressContentEditableWarning: true,
    dangerouslySetInnerHTML: { __html: value },
    onFocus: (e: React.FocusEvent<HTMLElement>) => setFocusedEl(e.currentTarget),
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      setFocusedEl(null)
      onTextChange(field, e.currentTarget.innerHTML)
    },
  }
  return <Tag {...editProps} />
}

interface EImgProps {
  field: string
  src: string
  alt?: string
  className?: string
  style?: React.CSSProperties
}

function EImg({ field, src, alt = '', className, style }: EImgProps) {
  const { editMode, onImageClick } = useContext(Ctx)
  if (!src && !editMode) return null
  if (!editMode) return <img src={src} alt={alt} className={className} style={style} />
  return (
    <div className="editable-img-wrap" style={{ display: 'contents' }} onClick={() => onImageClick(field)}>
      {src
        ? <img src={src} alt={alt} className={`${className ?? ''} editable-img`} style={style} />
        : <div className={`editable-img-placeholder ${className ?? ''}`} style={style}>Click to upload image</div>}
      <div className="editable-img-badge">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
      </div>
    </div>
  )
}

// ── Public Site ───────────────────────────────────────────────────────────────

interface Props {
  content: SiteContent
  editMode?: boolean
  onTextChange?: (field: string, value: string) => void
  onImageClick?: (field: string) => void
  onUpdate?: (field: string, value: unknown) => void
}

export function PublicSite({ content, editMode = false, onTextChange, onImageClick, onUpdate }: Props) {
  const { meta, nav, hero, features, products, contact, footer } = content

  const [focusedEl, setFocusedEl] = useState<HTMLElement | null>(null)
  const [bgMoveMode, setBgMoveMode] = useState(false)
  const [heroBgPos, setHeroBgPos] = useState({ x: hero.bgX ?? 50, y: hero.bgY ?? 50 })
  const [heroHeight, setHeroHeight] = useState(hero.minHeight ?? 520)
  const dragRef = useRef<{ startX: number; startY: number; startBgX: number; startBgY: number } | null>(null)
  const heightDragRef = useRef<{ startY: number; startH: number } | null>(null)
  const heroRef = useRef<HTMLElement | null>(null)

  const vars = {
    '--primary': meta.primaryColor,
    '--accent': meta.accentColor,
    fontFamily: meta.font,
  } as React.CSSProperties

  const ctx: EditCtx = {
    editMode,
    onTextChange: onTextChange ?? (() => {}),
    onImageClick: onImageClick ?? (() => {}),
    onUpdate: onUpdate ?? (() => {}),
    setFocusedEl,
  }

  // Hero background drag
  useEffect(() => {
    if (!bgMoveMode) return
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current || !heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      const dx = (e.clientX - dragRef.current.startX) / rect.width * 100
      const dy = (e.clientY - dragRef.current.startY) / rect.height * 100
      setHeroBgPos({
        x: Math.max(0, Math.min(100, dragRef.current.startBgX - dx)),
        y: Math.max(0, Math.min(100, dragRef.current.startBgY - dy)),
      })
    }
    const onUp = () => {
      dragRef.current = null
      setBgMoveMode(false)
      setHeroBgPos(pos => {
        onUpdate?.('hero.bgX', pos.x)
        onUpdate?.('hero.bgY', pos.y)
        return pos
      })
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
  }, [bgMoveMode, onUpdate])

  // Hero height resize drag
  useEffect(() => {
    if (!heightDragRef.current) return
    const onMove = (e: MouseEvent) => {
      if (!heightDragRef.current) return
      const delta = e.clientY - heightDragRef.current.startY
      setHeroHeight(Math.max(200, heightDragRef.current.startH + delta))
    }
    const onUp = () => {
      heightDragRef.current = null
      setHeroHeight(h => {
        onUpdate?.('hero.minHeight', h)
        return h
      })
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
  })

  const heroStyle: React.CSSProperties = {
    minHeight: heroHeight,
    ...(hero.image ? {
      backgroundImage: `url(${hero.image})`,
      backgroundPosition: `${heroBgPos.x}% ${heroBgPos.y}%`,
    } : {}),
    ...(bgMoveMode ? { cursor: 'grab' } : {}),
  }

  return (
    <Ctx.Provider value={ctx}>
      <div style={vars} className="site">

        {/* Format toolbar — rendered globally above everything */}
        {editMode && <FormatToolbar anchorEl={focusedEl} />}

        {/* NAV */}
        <header className="site-nav">
          <div className="site-nav-inner">
            {nav.logo
              ? <EImg field="nav.logo" src={nav.logo} alt={nav.brand} className="site-logo-img" />
              : <E field="nav.brand" value={nav.brand} as="span" className="site-logo-text" />
            }
            <nav>
              {nav.links.map((l, i) => (
                <E key={i} field={`nav.links.${i}.label`} value={l.label} as="a" href={l.href} />
              ))}
            </nav>
          </div>
        </header>

        {/* HERO */}
        <section
          className={`site-hero${bgMoveMode ? ' hero-move-mode' : ''}`}
          style={heroStyle}
          ref={heroRef as React.RefObject<HTMLElement>}
          onMouseDown={bgMoveMode ? (e) => {
            e.preventDefault()
            dragRef.current = { startX: e.clientX, startY: e.clientY, startBgX: heroBgPos.x, startBgY: heroBgPos.y }
          } : undefined}
        >
          {editMode && (
            <div className="site-hero-controls">
              <button className="site-hero-swap-btn" onClick={() => onImageClick?.('hero.image')}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Image
              </button>
              {hero.image && (
                <button
                  className={`site-hero-swap-btn${bgMoveMode ? ' active' : ''}`}
                  onClick={() => setBgMoveMode(m => !m)}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>
                  {bgMoveMode ? 'Done' : 'Move'}
                </button>
              )}
            </div>
          )}
          <div className={`site-hero-overlay${bgMoveMode ? ' no-pointer' : ''}`}>
            <E field="hero.headline" value={hero.headline} as="h1" />
            <E field="hero.subheadline" value={hero.subheadline} as="p" />
            <E field="hero.ctaLabel" value={hero.ctaLabel} as="a" href={hero.ctaHref} className="site-cta" />
          </div>
          {/* Height resize handle */}
          {editMode && (
            <div
              className="hero-resize-handle"
              onMouseDown={e => {
                e.preventDefault()
                heightDragRef.current = { startY: e.clientY, startH: heroHeight }
              }}
            />
          )}
        </section>

        {/* FEATURES */}
        <section className="site-section" id="about">
          <E field="features.title" value={features.title} as="h2" className="site-section-title" />
          <div className="site-grid-3">
            {features.items.map((f, i) => (
              <div key={f.id} className="site-card">
                <E field={`features.items.${i}.title`} value={f.title} as="h3" />
                <E field={`features.items.${i}.description`} value={f.description} as="p" />
              </div>
            ))}
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="site-section site-section-alt" id="products">
          <E field="products.title" value={products.title} as="h2" className="site-section-title" />
          <div className="site-grid-3">
            {products.items.map((p, i) => (
              <div key={p.id} className="site-product-card">
                <EImg field={`products.items.${i}.image`} src={p.image} alt={p.name} />
                <div className="site-product-body">
                  <E field={`products.items.${i}.name`} value={p.name} as="h3" />
                  <E field={`products.items.${i}.description`} value={p.description} as="p" />
                  <E field={`products.items.${i}.price`} value={p.price} as="div" className="site-product-price" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section className="site-contact" id="contact">
          <E field="contact.title" value={contact.title} as="h2" />
          <div className="site-contact-info">
            {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
            {contact.phone && <span>{contact.phone}</span>}
            {contact.address && <span>{contact.address}</span>}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="site-footer">
          <div className="site-footer-inner">
            <div>
              <E field="footer.brand" value={footer.brand} as="strong" />
              {footer.tagline && <> — <E field="footer.tagline" value={footer.tagline} as="span" /></>}
            </div>
            <div className="site-footer-links">
              {footer.links.map((l, i) => (
                <E key={i} field={`footer.links.${i}.label`} value={l.label} as="a" href={l.href} />
              ))}
            </div>
            <E field="footer.copyright" value={footer.copyright} as="div" className="site-footer-copy" />
          </div>
        </footer>

      </div>
    </Ctx.Provider>
  )
}
