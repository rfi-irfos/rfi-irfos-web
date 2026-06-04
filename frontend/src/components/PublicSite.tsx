import React, { createContext, useContext } from 'react'
import type { SiteContent } from '../types/content'

// ── Edit context ─────────────────────────────────────────────────────────────

interface EditCtx {
  editMode: boolean
  onTextChange: (field: string, value: string) => void
  onImageClick: (field: string) => void
}
const Ctx = createContext<EditCtx>({
  editMode: false,
  onTextChange: () => {},
  onImageClick: () => {},
})

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
  const { editMode, onTextChange } = useContext(Ctx)
  const Tag = (as ?? 'span') as TagName

  if (!editMode) {
    const props: Record<string, unknown> = { className, style }
    if (href) props.href = href
    return <Tag {...props}>{value}</Tag>
  }

  return (
    <Tag
      className={`${className ?? ''} editable-text`}
      style={style}
      contentEditable
      suppressContentEditableWarning
      onBlur={e => onTextChange(field, (e.currentTarget as HTMLElement).innerText.trim())}
    >
      {value}
    </Tag>
  )
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
    <div
      className="editable-img-wrap"
      style={{ display: 'contents' }}
      onClick={() => onImageClick(field)}
    >
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
}

export function PublicSite({ content, editMode = false, onTextChange, onImageClick }: Props) {
  const { meta, nav, hero, features, products, contact, footer } = content

  const vars = {
    '--primary': meta.primaryColor,
    '--accent': meta.accentColor,
    fontFamily: meta.font,
  } as React.CSSProperties

  const ctx: EditCtx = {
    editMode,
    onTextChange: onTextChange ?? (() => {}),
    onImageClick: onImageClick ?? (() => {}),
  }

  return (
    <Ctx.Provider value={ctx}>
      <div style={vars} className="site">

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
          style={hero.image ? { backgroundImage: `url(${hero.image})` } : {}}
        >
          {editMode && (
            <button className="site-hero-swap-btn" onClick={() => onImageClick?.('hero.image')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Background
            </button>
          )}
          <div className="site-hero-overlay">
            <E field="hero.headline" value={hero.headline} as="h1" />
            <E field="hero.subheadline" value={hero.subheadline} as="p" />
            <E field="hero.ctaLabel" value={hero.ctaLabel} as="a" href={hero.ctaHref} className="site-cta" />
          </div>
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
