import type { SiteContent } from '../types/content'

interface Props { content: SiteContent }

export function PublicSite({ content }: Props) {
  const { meta, nav, hero, features, products, contact, footer } = content

  const vars = {
    '--primary': meta.primaryColor,
    '--accent': meta.accentColor,
    fontFamily: meta.font,
  } as React.CSSProperties

  return (
    <div style={vars} className="site">
      {/* NAV */}
      <header className="site-nav">
        <div className="site-nav-inner">
          {nav.logo
            ? <img src={nav.logo} alt={nav.brand} className="site-logo-img" />
            : <span className="site-logo-text">{nav.brand}</span>}
          <nav>
            {nav.links.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section
        className="site-hero"
        style={hero.image ? { backgroundImage: `url(${hero.image})` } : {}}
      >
        <div className="site-hero-overlay">
          <h1>{hero.headline}</h1>
          <p>{hero.subheadline}</p>
          <a href={hero.ctaHref} className="site-cta">{hero.ctaLabel}</a>
        </div>
      </section>

      {/* FEATURES */}
      <section className="site-section" id="about">
        <h2 className="site-section-title">{features.title}</h2>
        <div className="site-grid-3">
          {features.items.map(f => (
            <div key={f.id} className="site-card">
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="site-section site-section-alt" id="products">
        <h2 className="site-section-title">{products.title}</h2>
        <div className="site-grid-3">
          {products.items.map(p => (
            <div key={p.id} className="site-product-card">
              {p.image && <img src={p.image} alt={p.name} />}
              <div className="site-product-body">
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <div className="site-product-price">{p.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="site-contact" id="contact">
        <h2>{contact.title}</h2>
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
            <strong>{footer.brand}</strong>
            {footer.tagline && <span> — {footer.tagline}</span>}
          </div>
          <div className="site-footer-links">
            {footer.links.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
          </div>
          <div className="site-footer-copy">{footer.copyright}</div>
        </div>
      </footer>
    </div>
  )
}
