import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import type { SiteContent, SectionId, CanvasPos } from '../types/content'
import { DEFAULT_SECTION_ORDER } from '../types/content'

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
  const exec = (cmd: string, val?: string) => { document.execCommand(cmd, false, val); anchorEl.focus() }
  return (
    <div className="format-toolbar" style={{ position: 'fixed', top, left, width: tbW, zIndex: 9999 }} onMouseDown={e => e.preventDefault()}>
      <button className="fmt-btn fmt-b" title="Bold" onClick={() => exec('bold')}>B</button>
      <button className="fmt-btn fmt-i" title="Italic" onClick={() => exec('italic')}>I</button>
      <button className="fmt-btn fmt-u" title="Underline" onClick={() => exec('underline')}>U</button>
      <div className="fmt-sep" />
      <button className="fmt-btn" title="Align left" onClick={() => exec('justifyLeft')}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg></button>
      <button className="fmt-btn" title="Center" onClick={() => exec('justifyCenter')}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg></button>
      <button className="fmt-btn" title="Align right" onClick={() => exec('justifyRight')}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg></button>
      <div className="fmt-sep" />
      <button className="fmt-btn fmt-size-s" title="Small" onClick={() => exec('fontSize', '2')}>S</button>
      <button className="fmt-btn" title="Normal" onClick={() => exec('fontSize', '4')}>M</button>
      <button className="fmt-btn fmt-size-l" title="Large" onClick={() => exec('fontSize', '5')}>L</button>
      <button className="fmt-btn fmt-size-xl" title="Extra large" onClick={() => exec('fontSize', '7')}>XL</button>
      <div className="fmt-sep" />
      <label className="fmt-color-btn" title="Text color">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
        <input type="color" defaultValue="#111111" onChange={e => exec('foreColor', e.target.value)} onMouseDown={e => e.stopPropagation()} className="fmt-color-input" />
      </label>
    </div>
  )
}

// ── Canvas element (drag wrapper) ─────────────────────────────────────────────

interface CanvasElProps {
  id: string
  pos: CanvasPos
  onMove: (p: CanvasPos) => void
  children: React.ReactNode
  minWidth?: number
  noPad?: boolean
}

function CanvasEl({ id, pos, onMove, children, minWidth = 160, noPad }: CanvasElProps) {
  const elRef = useRef<HTMLDivElement>(null)
  const dragState = useRef<{ mx: number; my: number; sx: number; sy: number } | null>(null)

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragState.current = { mx: e.clientX, my: e.clientY, sx: pos.x, sy: pos.y }

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragState.current || !elRef.current) return
      elRef.current.style.left = `${dragState.current.sx + ev.clientX - dragState.current.mx}px`
      elRef.current.style.top  = `${dragState.current.sy + ev.clientY - dragState.current.my}px`
    }
    const onMouseUp = (ev: MouseEvent) => {
      if (!dragState.current) return
      const nx = dragState.current.sx + ev.clientX - dragState.current.mx
      const ny = dragState.current.sy + ev.clientY - dragState.current.my
      dragState.current = null
      onMove({ x: nx, y: ny })
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div
      ref={elRef}
      data-cid={id}
      className={`canvas-el${noPad ? ' canvas-el-nopad' : ''}`}
      style={{ position: 'absolute', left: pos.x, top: pos.y, minWidth }}
    >
      <div className="canvas-el-grip" onMouseDown={startDrag} title="Drag to move">
        <svg width="10" height="16" viewBox="0 0 10 24" fill="currentColor">
          <circle cx="3" cy="4"  r="1.8"/><circle cx="7" cy="4"  r="1.8"/>
          <circle cx="3" cy="12" r="1.8"/><circle cx="7" cy="12" r="1.8"/>
          <circle cx="3" cy="20" r="1.8"/><circle cx="7" cy="20" r="1.8"/>
        </svg>
      </div>
      {children}
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
    const props: Record<string, unknown> = { className, style, dangerouslySetInnerHTML: { __html: value }, 'data-cid': field }
    if (href) props.href = href
    return <Tag {...props} />
  }

  const editProps: Record<string, unknown> = {
    className: `${className ?? ''} editable-text`,
    style,
    'data-cid': field,
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
  if (!editMode) return <img src={src} alt={alt} className={className} style={style} data-cid={field} />
  return (
    <div className="editable-img-wrap" style={{ display: 'contents' }} onClick={() => onImageClick(field)} data-cid={field}>
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
  rearrangeMode?: boolean
  initPositions?: Record<string, CanvasPos>
  onTextChange?: (field: string, value: string) => void
  onImageClick?: (field: string) => void
  onUpdate?: (field: string, value: unknown) => void
  onSectionReorder?: (order: SectionId[]) => void
}

export function PublicSite({
  content, editMode = false, rearrangeMode = false, initPositions = {},
  onTextChange, onImageClick, onUpdate, onSectionReorder,
}: Props) {
  const { meta, nav, hero, features, products, contact, footer } = content

  const [focusedEl, setFocusedEl]  = useState<HTMLElement | null>(null)
  const [sectionOrder, setSectionOrder] = useState<SectionId[]>(content.sectionOrder ?? DEFAULT_SECTION_ORDER)
  const [dragSection, setDragSection]   = useState<SectionId | null>(null)
  const [heroBgPos, setHeroBgPos]   = useState({ x: hero.bgX ?? 50, y: hero.bgY ?? 50 })
  const [heroHeight, setHeroHeight] = useState(hero.minHeight ?? 520)
  const heroDragRef  = useRef<{ startX: number; startY: number; startBgX: number; startBgY: number } | null>(null)
  const heightDragRef = useRef<{ startY: number; startH: number } | null>(null)
  const heroRef = useRef<HTMLElement | null>(null)

  const vars = { '--primary': meta.primaryColor, '--accent': meta.accentColor, fontFamily: meta.font } as React.CSSProperties

  const ctx: EditCtx = {
    editMode,
    onTextChange: onTextChange ?? (() => {}),
    onImageClick: onImageClick ?? (() => {}),
    onUpdate:     onUpdate     ?? (() => {}),
    setFocusedEl,
  }

  // Hero bg drag (non-canvas mode)
  useEffect(() => {
    if (rearrangeMode) return
    const onMove = (e: MouseEvent) => {
      if (!heroDragRef.current || !heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      setHeroBgPos({
        x: Math.max(0, Math.min(100, heroDragRef.current.startBgX - (e.clientX - heroDragRef.current.startX) / rect.width * 100)),
        y: Math.max(0, Math.min(100, heroDragRef.current.startBgY - (e.clientY - heroDragRef.current.startY) / rect.height * 100)),
      })
    }
    const onUp = () => {
      heroDragRef.current = null
      setHeroBgPos(p => { onUpdate?.('hero.bgX', p.x); onUpdate?.('hero.bgY', p.y); return p })
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  }, [rearrangeMode, onUpdate])

  // Hero height drag
  useEffect(() => {
    if (!heightDragRef.current) return
    const onMove = (e: MouseEvent) => {
      if (!heightDragRef.current) return
      setHeroHeight(Math.max(200, heightDragRef.current.startH + e.clientY - heightDragRef.current.startY))
    }
    const onUp = () => {
      heightDragRef.current = null
      setHeroHeight(h => { onUpdate?.('hero.minHeight', h); return h })
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  })

  // ── Canvas position helpers ─────────────────────────────────────────────────

  const savedPos = (content.positions ?? {}) as Record<string, CanvasPos>

  const pos = (id: string, fallback: CanvasPos): CanvasPos =>
    savedPos[id] ?? initPositions[id] ?? fallback

  const moveEl = (id: string, p: CanvasPos) => {
    onUpdate?.('positions', { ...savedPos, [id]: p })
  }

  // ── Canvas render ────────────────────────────────────────────────────────────

  if (rearrangeMode) {
    const canvasBg: React.CSSProperties = {
      position: 'absolute', inset: 0, top: 0, left: 0, right: 0,
      height: heroHeight,
      background: hero.image
        ? `url(${hero.image}) ${heroBgPos.x}% ${heroBgPos.y}% / cover no-repeat`
        : meta.primaryColor,
      zIndex: 0,
    }

    return (
      <div style={vars} className="site-canvas">
        {/* Hero background band — drag bg position */}
        <div
          className="canvas-bg-band"
          style={canvasBg}
          onMouseDown={e => {
            if (!heroRef.current) return
            e.preventDefault()
            heroDragRef.current = { startX: e.clientX, startY: e.clientY, startBgX: heroBgPos.x, startBgY: heroBgPos.y }
          }}
        >
          <div className="canvas-bg-hint">Drag to reposition background</div>
        </div>

        {/* ── Free elements ─────────────────────────────────────────── */}

        <CanvasEl id="hero.headline"    pos={pos('hero.headline',    { x: 160, y: 160 })} onMove={p => moveEl('hero.headline', p)} minWidth={300} noPad>
          <h1 className="site-hero h1 canvas-text-hero-h1" dangerouslySetInnerHTML={{ __html: hero.headline }} />
        </CanvasEl>

        <CanvasEl id="hero.subheadline" pos={pos('hero.subheadline', { x: 160, y: 260 })} onMove={p => moveEl('hero.subheadline', p)} minWidth={300} noPad>
          <p className="canvas-text-hero-sub" dangerouslySetInnerHTML={{ __html: hero.subheadline }} />
        </CanvasEl>

        <CanvasEl id="hero.ctaLabel"    pos={pos('hero.ctaLabel',    { x: 220, y: 340 })} onMove={p => moveEl('hero.ctaLabel', p)}>
          <a className="site-cta" dangerouslySetInnerHTML={{ __html: hero.ctaLabel }} />
        </CanvasEl>

        <CanvasEl id="features.title"   pos={pos('features.title',   { x: 160, y: 600 })} onMove={p => moveEl('features.title', p)} minWidth={300} noPad>
          <h2 className="site-section-title canvas-section-h2" dangerouslySetInnerHTML={{ __html: features.title }} />
        </CanvasEl>

        {features.items.map((f, i) => (
          <CanvasEl key={f.id} id={`features.items.${i}`} pos={pos(`features.items.${i}`, { x: 40 + i * 330, y: 680 })} onMove={p => moveEl(`features.items.${i}`, p)} minWidth={280}>
            <div className="site-card">
              <h3 dangerouslySetInnerHTML={{ __html: f.title }} />
              <p dangerouslySetInnerHTML={{ __html: f.description }} />
            </div>
          </CanvasEl>
        ))}

        <CanvasEl id="products.title" pos={pos('products.title', { x: 160, y: 1040 })} onMove={p => moveEl('products.title', p)} minWidth={300} noPad>
          <h2 className="site-section-title canvas-section-h2" dangerouslySetInnerHTML={{ __html: products.title }} />
        </CanvasEl>

        {products.items.map((p, i) => (
          <CanvasEl key={p.id} id={`products.items.${i}`} pos={pos(`products.items.${i}`, { x: 40 + i * 330, y: 1120 })} onMove={pp => moveEl(`products.items.${i}`, pp)} minWidth={280}>
            <div className="site-product-card">
              {p.image && <img src={p.image} alt={p.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />}
              <div className="site-product-body">
                <h3 dangerouslySetInnerHTML={{ __html: p.name }} />
                <p dangerouslySetInnerHTML={{ __html: p.description }} />
                <div className="site-product-price" dangerouslySetInnerHTML={{ __html: p.price }} />
              </div>
            </div>
          </CanvasEl>
        ))}

        <CanvasEl id="contact.block" pos={pos('contact.block', { x: 160, y: 1580 })} onMove={p => moveEl('contact.block', p)} minWidth={400}>
          <div className="canvas-contact-block">
            <h2 dangerouslySetInnerHTML={{ __html: contact.title }} />
            {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
            {contact.phone && <span>{contact.phone}</span>}
            {contact.address && <span>{contact.address}</span>}
          </div>
        </CanvasEl>

        <CanvasEl id="footer.block" pos={pos('footer.block', { x: 0, y: 1780 })} onMove={p => moveEl('footer.block', p)} minWidth={800} noPad>
          <footer className="site-footer" style={{ position: 'static' }}>
            <div className="site-footer-inner">
              <div>
                <strong dangerouslySetInnerHTML={{ __html: footer.brand }} />
                {footer.tagline && <> — <span dangerouslySetInnerHTML={{ __html: footer.tagline }} /></>}
              </div>
              <div className="site-footer-links">
                {footer.links.map((l, i) => <a key={i} href={l.href}>{l.label}</a>)}
              </div>
              <div className="site-footer-copy" dangerouslySetInnerHTML={{ __html: footer.copyright }} />
            </div>
          </footer>
        </CanvasEl>

        {/* NAV — always on top in canvas */}
        <header className="site-nav" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
          <div className="site-nav-inner">
            {nav.logo
              ? <img src={nav.logo} alt={nav.brand} className="site-logo-img" />
              : <span className="site-logo-text">{nav.brand}</span>
            }
            <nav>{nav.links.map((l, i) => <a key={i} href={l.href}>{l.label}</a>)}</nav>
          </div>
        </header>
      </div>
    )
  }

  // ── Normal render ────────────────────────────────────────────────────────────

  const heroStyle: React.CSSProperties = {
    minHeight: heroHeight,
    ...(hero.image ? { backgroundImage: `url(${hero.image})`, backgroundPosition: `${heroBgPos.x}% ${heroBgPos.y}%` } : {}),
  }

  return (
    <Ctx.Provider value={ctx}>
      <div style={vars} className="site">
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
          className="site-hero"
          style={heroStyle}
          ref={heroRef as React.RefObject<HTMLElement>}
          onMouseDown={e => {
            if (!editMode) return
            heroDragRef.current = { startX: e.clientX, startY: e.clientY, startBgX: heroBgPos.x, startBgY: heroBgPos.y }
          }}
        >
          {editMode && (
            <div className="site-hero-controls">
              <button className="site-hero-swap-btn" onClick={() => onImageClick?.('hero.image')}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Image
              </button>
            </div>
          )}
          <div className="site-hero-overlay">
            <E field="hero.headline"    value={hero.headline}    as="h1" />
            <E field="hero.subheadline" value={hero.subheadline} as="p" />
            <E field="hero.ctaLabel"    value={hero.ctaLabel}    as="a" href={hero.ctaHref} className="site-cta" />
          </div>
          {editMode && (
            <div className="hero-resize-handle" onMouseDown={e => { e.preventDefault(); heightDragRef.current = { startY: e.clientY, startH: heroHeight } }} />
          )}
        </section>

        {/* ORDERED SECTIONS */}
        {sectionOrder.filter(id => id !== 'hero').map(sectionId => {
          const isDragging = dragSection === sectionId
          const wrapSection = (id: SectionId, el: React.ReactNode) => (
            <React.Fragment key={id}>{el}</React.Fragment>
          )

          if (sectionId === 'about') return wrapSection('about', (
            <section className="site-section" id="about">
              <E field="features.title" value={features.title} as="h2" className="site-section-title" />
              <div className="site-grid-3">
                {features.items.map((f, i) => (
                  <div key={f.id} className="site-card">
                    <E field={`features.items.${i}.title`}       value={f.title}       as="h3" />
                    <E field={`features.items.${i}.description`} value={f.description} as="p" />
                  </div>
                ))}
              </div>
            </section>
          ))
          if (sectionId === 'products') return wrapSection('products', (
            <section className="site-section site-section-alt" id="products">
              <E field="products.title" value={products.title} as="h2" className="site-section-title" />
              <div className="site-grid-3">
                {products.items.map((p, i) => (
                  <div key={p.id} className="site-product-card">
                    <EImg field={`products.items.${i}.image`} src={p.image} alt={p.name} />
                    <div className="site-product-body">
                      <E field={`products.items.${i}.name`}        value={p.name}        as="h3" />
                      <E field={`products.items.${i}.description`} value={p.description} as="p" />
                      <E field={`products.items.${i}.price`}       value={p.price}       as="div" className="site-product-price" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
          if (sectionId === 'contact') return wrapSection('contact', (
            <section className="site-contact" id="contact">
              <E field="contact.title" value={contact.title} as="h2" />
              <div className="site-contact-info">
                {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
                {contact.phone && <span>{contact.phone}</span>}
                {contact.address && <span>{contact.address}</span>}
              </div>
            </section>
          ))
          return null
        })}

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
