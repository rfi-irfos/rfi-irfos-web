import { useState, useRef } from 'react'
import type { SiteContent, FeatureItem, ProductItem, NavLink } from '../types/content'
import type { User } from '../hooks/useAuth'
import { PublicSite } from './PublicSite'

interface Props {
  content: SiteContent
  user: User
  saving: boolean
  onSave: (c: SiteContent) => Promise<boolean>
  onUpload: (f: File) => Promise<string | null>
  onLogout: () => void
}

type Section = 'meta' | 'nav' | 'hero' | 'features' | 'products' | 'contact' | 'footer'
type PreviewMode = 'none' | 'split' | 'modal'

export function AdminPanel({ content, user, saving, onSave, onUpload, onLogout }: Props) {
  const [draft, setDraft] = useState<SiteContent>(content)
  const [active, setActive] = useState<Section>('hero')
  const [saved, setSaved] = useState(false)
  const [preview, setPreview] = useState<PreviewMode>('none')
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploadTarget, setUploadTarget] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const update = (path: string, value: unknown) => {
    const keys = path.split('.')
    setDraft(prev => {
      const next = structuredClone(prev) as Record<string, unknown>
      let cur = next
      for (let i = 0; i < keys.length - 1; i++) {
        cur = cur[keys[i]] as Record<string, unknown>
      }
      cur[keys[keys.length - 1]] = value
      return next as SiteContent
    })
  }

  const handleSave = async () => {
    const ok = await onSave(draft)
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  }

  const triggerUpload = (target: string) => {
    setUploadTarget(target)
    fileRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !uploadTarget) return
    setUploading(true)
    const url = await onUpload(file)
    if (url) update(uploadTarget, url)
    setUploading(false)
    e.target.value = ''
  }

  const navItems: Array<{ id: Section; label: string }> = [
    { id: 'meta', label: 'Site Settings' },
    { id: 'nav', label: 'Navigation' },
    { id: 'hero', label: 'Hero' },
    { id: 'features', label: 'Features' },
    { id: 'products', label: 'Products' },
    { id: 'contact', label: 'Contact' },
    { id: 'footer', label: 'Footer' },
  ]

  return (
    <div className="admin">
      {/* TOP BAR */}
      <div className="admin-topbar">
        <div className="admin-brand">
          <span className="admin-brand-dot" />
          <strong>Admin</strong>
          <span className="admin-brand-sep">·</span>
          <span className="admin-site-name">{draft.nav.brand}</span>
        </div>
        <div className="admin-topbar-right">
          <button
            className={`admin-btn-ghost ${preview === 'split' ? 'active' : ''}`}
            onClick={() => setPreview(p => p === 'split' ? 'none' : 'split')}
            title="Side-by-side live preview"
          >
            {preview === 'split' ? 'Close Split' : 'Split View'}
          </button>
          <button
            className="admin-btn-ghost"
            onClick={() => setPreview(p => p === 'modal' ? 'none' : 'modal')}
            title="Full-screen live preview"
          >
            Preview
          </button>
          <span className="admin-user">{user.name || user.email}</span>
          <button className="admin-btn-ghost" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {/* MODAL PREVIEW */}
      {preview === 'modal' && (
        <div className="preview-modal">
          <div className="preview-modal-bar">
            <div className="preview-modal-label">
              <span className="preview-live-dot" />
              Live Preview
            </div>
            <button className="preview-modal-close" onClick={() => setPreview('none')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Close
            </button>
          </div>
          <div className="preview-modal-body">
            <PublicSite content={draft} />
          </div>
        </div>
      )}

      <div className={`admin-layout ${preview === 'split' ? 'split' : ''}`}>
        {/* SIDEBAR */}
        <aside className="admin-sidebar">
          {navItems.map(n => (
            <button
              key={n.id}
              className={`admin-nav-item ${active === n.id ? 'active' : ''}`}
              onClick={() => setActive(n.id)}
            >
              {n.label}
            </button>
          ))}
          <div className="admin-sidebar-spacer" />
          <button
            className={`admin-save-btn ${saving ? 'loading' : ''} ${saved ? 'done' : ''}`}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </aside>

        {/* MAIN PANEL */}
        <main className="admin-main">
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

          {active === 'meta' && (
            <Section title="Site Settings">
              <Field label="Site Title" value={draft.meta.title} onChange={v => update('meta.title', v)} />
              <Field label="Description" value={draft.meta.description} onChange={v => update('meta.description', v)} />
              <div className="admin-row-2">
                <ColorField label="Primary Color" value={draft.meta.primaryColor} onChange={v => update('meta.primaryColor', v)} />
                <ColorField label="Accent Color" value={draft.meta.accentColor} onChange={v => update('meta.accentColor', v)} />
              </div>
              <div className="admin-field">
                <label>Font</label>
                <select value={draft.meta.font} onChange={e => update('meta.font', e.target.value)}>
                  <option value="system-ui, -apple-system, sans-serif">System (Default)</option>
                  <option value="'Inter', sans-serif">Inter</option>
                  <option value="'Georgia', serif">Georgia (Serif)</option>
                  <option value="'Roboto', sans-serif">Roboto</option>
                  <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica Neue</option>
                </select>
              </div>
            </Section>
          )}

          {active === 'nav' && (
            <Section title="Navigation">
              <Field label="Brand Name" value={draft.nav.brand} onChange={v => update('nav.brand', v)} />
              <ImageField label="Logo Image" value={draft.nav.logo} onUpload={() => triggerUpload('nav.logo')} uploading={uploading} />
              <div className="admin-field">
                <label>Nav Links</label>
                <LinkListEditor
                  links={draft.nav.links}
                  onChange={links => update('nav.links', links)}
                />
              </div>
            </Section>
          )}

          {active === 'hero' && (
            <Section title="Hero Section">
              <Field label="Headline" value={draft.hero.headline} onChange={v => update('hero.headline', v)} large />
              <Field label="Subheadline" value={draft.hero.subheadline} onChange={v => update('hero.subheadline', v)} />
              <div className="admin-row-2">
                <Field label="CTA Button Text" value={draft.hero.ctaLabel} onChange={v => update('hero.ctaLabel', v)} />
                <Field label="CTA Button Link" value={draft.hero.ctaHref} onChange={v => update('hero.ctaHref', v)} placeholder="#products" />
              </div>
              <ImageField label="Hero Background Image" value={draft.hero.image} onUpload={() => triggerUpload('hero.image')} uploading={uploading} />
            </Section>
          )}

          {active === 'features' && (
            <Section title="Features Section">
              <Field label="Section Title" value={draft.features.title} onChange={v => update('features.title', v)} />
              {draft.features.items.map((item, i) => (
                <div key={item.id} className="admin-list-item">
                  <div className="admin-list-index">{i + 1}</div>
                  <div className="admin-list-fields">
                    <Field label="Title" value={item.title} onChange={v => {
                      const items = [...draft.features.items]
                      items[i] = { ...items[i], title: v }
                      update('features.items', items)
                    }} />
                    <Field label="Description" value={item.description} onChange={v => {
                      const items = [...draft.features.items]
                      items[i] = { ...items[i], description: v }
                      update('features.items', items)
                    }} textarea />
                  </div>
                  <button className="admin-remove-btn" onClick={() => {
                    update('features.items', draft.features.items.filter((_, j) => j !== i))
                  }}>×</button>
                </div>
              ))}
              <button className="admin-add-btn" onClick={() => {
                const id = `f${Date.now()}`
                update('features.items', [...draft.features.items, { id, title: 'New Feature', description: '' }])
              }}>+ Add Feature</button>
            </Section>
          )}

          {active === 'products' && (
            <Section title="Products Section">
              <Field label="Section Title" value={draft.products.title} onChange={v => update('products.title', v)} />
              {draft.products.items.map((item, i) => (
                <div key={item.id} className="admin-list-item admin-product-item">
                  <div className="admin-product-img-col">
                    <ImageField
                      label="Image"
                      value={item.image}
                      onUpload={() => triggerUpload(`products.items.${i}.image`)}
                      uploading={uploading}
                      compact
                    />
                  </div>
                  <div className="admin-list-fields">
                    <div className="admin-row-2">
                      <Field label="Name" value={item.name} onChange={v => {
                        const items = [...draft.products.items]
                        items[i] = { ...items[i], name: v }
                        update('products.items', items)
                      }} />
                      <Field label="Price" value={item.price} onChange={v => {
                        const items = [...draft.products.items]
                        items[i] = { ...items[i], price: v }
                        update('products.items', items)
                      }} placeholder="€99" />
                    </div>
                    <Field label="Description" value={item.description} onChange={v => {
                      const items = [...draft.products.items]
                      items[i] = { ...items[i], description: v }
                      update('products.items', items)
                    }} textarea />
                  </div>
                  <button className="admin-remove-btn" onClick={() => {
                    update('products.items', draft.products.items.filter((_, j) => j !== i))
                  }}>×</button>
                </div>
              ))}
              <button className="admin-add-btn" onClick={() => {
                const id = `p${Date.now()}`
                update('products.items', [...draft.products.items, { id, name: 'New Product', description: '', price: '', image: '' }])
              }}>+ Add Product</button>
            </Section>
          )}

          {active === 'contact' && (
            <Section title="Contact Section">
              <Field label="Section Title" value={draft.contact.title} onChange={v => update('contact.title', v)} />
              <Field label="Email" value={draft.contact.email} onChange={v => update('contact.email', v)} placeholder="info@example.at" />
              <Field label="Phone" value={draft.contact.phone} onChange={v => update('contact.phone', v)} placeholder="+43 ..." />
              <Field label="Address" value={draft.contact.address} onChange={v => update('contact.address', v)} textarea />
            </Section>
          )}

          {active === 'footer' && (
            <Section title="Footer">
              <Field label="Brand Name" value={draft.footer.brand} onChange={v => update('footer.brand', v)} />
              <Field label="Tagline" value={draft.footer.tagline} onChange={v => update('footer.tagline', v)} />
              <Field label="Copyright" value={draft.footer.copyright} onChange={v => update('footer.copyright', v)} placeholder="© 2024 My Business" />
              <div className="admin-field">
                <label>Footer Links</label>
                <LinkListEditor links={draft.footer.links} onChange={links => update('footer.links', links)} />
              </div>
            </Section>
          )}
        </main>

        {/* SPLIT PREVIEW PANE */}
        {preview === 'split' && (
          <div className="admin-split-preview">
            <div className="admin-split-bar">
              <span className="preview-live-dot" />
              Live Preview — updates as you edit
            </div>
            <div className="admin-split-body">
              <PublicSite content={draft} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="admin-section">
      <h2 className="admin-section-title">{title}</h2>
      {children}
    </div>
  )
}

interface FieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  textarea?: boolean
  large?: boolean
}

function Field({ label, value, onChange, placeholder, textarea, large }: FieldProps) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      {textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={large ? 'admin-input-large' : ''}
        />
      )}
    </div>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      <div className="admin-color-row">
        <input type="color" value={value} onChange={e => onChange(e.target.value)} />
        <input type="text" value={value} onChange={e => onChange(e.target.value)} />
      </div>
    </div>
  )
}

interface ImageFieldProps {
  label: string
  value: string
  onUpload: () => void
  uploading: boolean
  compact?: boolean
}

function ImageField({ label, value, onUpload, uploading, compact }: ImageFieldProps) {
  return (
    <div className={`admin-field ${compact ? 'admin-field-compact' : ''}`}>
      {!compact && <label>{label}</label>}
      <div className="admin-image-row">
        {value && <img src={value} alt="current" className="admin-image-preview" />}
        <button className="admin-upload-btn" onClick={onUpload} disabled={uploading}>
          {uploading ? 'Uploading…' : value ? 'Change Image' : 'Upload Image'}
        </button>
      </div>
    </div>
  )
}

function LinkListEditor({ links, onChange }: { links: NavLink[]; onChange: (l: NavLink[]) => void }) {
  return (
    <div className="admin-link-list">
      {links.map((l, i) => (
        <div key={i} className="admin-link-row">
          <input
            type="text"
            value={l.label}
            placeholder="Label"
            onChange={e => { const n = [...links]; n[i] = { ...n[i], label: e.target.value }; onChange(n) }}
          />
          <input
            type="text"
            value={l.href}
            placeholder="/link or #anchor"
            onChange={e => { const n = [...links]; n[i] = { ...n[i], href: e.target.value }; onChange(n) }}
          />
          <button onClick={() => onChange(links.filter((_, j) => j !== i))}>×</button>
        </div>
      ))}
      <button className="admin-add-link-btn" onClick={() => onChange([...links, { label: '', href: '' }])}>+ Add Link</button>
    </div>
  )
}
