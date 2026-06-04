import { useState, useRef } from 'react'
import type { SiteContent, NavLink } from '../types/content'
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

type Section = 'style' | 'nav' | 'hero' | 'features' | 'products' | 'contact' | 'footer'

export function AdminPanel({ content, user, saving, onSave, onUpload, onLogout }: Props) {
  const [draft, setDraft] = useState<SiteContent>(content)
  const [active, setActive] = useState<Section>('style')
  const [saved, setSaved] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
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
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500) }
  }

  const handleImageClick = (field: string) => {
    setUploadTarget(field)
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

  const sections: Array<{ id: Section; label: string }> = [
    { id: 'style',    label: 'Style'    },
    { id: 'nav',      label: 'Nav'      },
    { id: 'hero',     label: 'Hero'     },
    { id: 'features', label: 'Features' },
    { id: 'products', label: 'Products' },
    { id: 'contact',  label: 'Contact'  },
    { id: 'footer',   label: 'Footer'   },
  ]

  return (
    <div className="builder">
      {/* TOP BAR */}
      <div className="builder-topbar">
        <div className="builder-brand">
          <span className="builder-brand-dot" />
          <strong>{draft.nav.brand || 'My Site'}</strong>
        </div>
        <div className="builder-topbar-hint">Click any text or image to edit it directly</div>
        <div className="builder-topbar-right">
          <button className="builder-btn-ghost" onClick={() => setPreviewOpen(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 5}}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Preview
          </button>
          <span className="builder-user">{user.name || user.email}</span>
          <button className="builder-btn-ghost" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {previewOpen && (
        <div className="preview-modal">
          <div className="preview-modal-bar">
            <div className="preview-modal-label">
              <span className="preview-live-dot" />
              Live Preview
            </div>
            <button className="preview-modal-close" onClick={() => setPreviewOpen(false)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Close
            </button>
          </div>
          <div className="preview-modal-body">
            <PublicSite content={draft} />
          </div>
        </div>
      )}

      {/* BODY */}
      <div className="builder-body">

        {/* LEFT: live editable preview */}
        <div className="builder-preview">
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
          <PublicSite
            content={draft}
            editMode={true}
            onTextChange={(field, value) => update(field, value)}
            onImageClick={handleImageClick}
          />
        </div>

        {/* RIGHT: settings panel */}
        <aside className="builder-panel">
          {/* Section tabs */}
          <div className="builder-tabs">
            {sections.map(s => (
              <button
                key={s.id}
                className={`builder-tab ${active === s.id ? 'active' : ''}`}
                onClick={() => setActive(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Settings content */}
          <div className="builder-panel-body">

            {active === 'style' && <>
              <PanelSection title="Colors">
                <ColorField label="Primary" value={draft.meta.primaryColor} onChange={v => update('meta.primaryColor', v)} />
                <ColorField label="Accent" value={draft.meta.accentColor} onChange={v => update('meta.accentColor', v)} />
              </PanelSection>
              <PanelSection title="Font">
                <div className="panel-field">
                  <select value={draft.meta.font} onChange={e => update('meta.font', e.target.value)}>
                    <option value="system-ui, -apple-system, sans-serif">System Default</option>
                    <option value="'Inter', sans-serif">Inter</option>
                    <option value="'Georgia', serif">Georgia</option>
                    <option value="'Roboto', sans-serif">Roboto</option>
                    <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica Neue</option>
                  </select>
                </div>
              </PanelSection>
              <PanelSection title="Site Meta">
                <TextField label="Title" value={draft.meta.title} onChange={v => update('meta.title', v)} />
                <TextField label="Description" value={draft.meta.description} onChange={v => update('meta.description', v)} />
              </PanelSection>
            </>}

            {active === 'nav' && <>
              <PanelSection title="Logo">
                <UploadRow
                  src={draft.nav.logo}
                  onUpload={() => handleImageClick('nav.logo')}
                  uploading={uploading && uploadTarget === 'nav.logo'}
                />
              </PanelSection>
              <PanelSection title="Nav Links">
                <LinkListEditor links={draft.nav.links} onChange={links => update('nav.links', links)} />
              </PanelSection>
            </>}

            {active === 'hero' && <>
              <PanelSection title="Call to Action">
                <TextField label="Button text" value={draft.hero.ctaLabel} onChange={v => update('hero.ctaLabel', v)} />
                <TextField label="Button link" value={draft.hero.ctaHref} onChange={v => update('hero.ctaHref', v)} placeholder="#products" />
              </PanelSection>
              <PanelSection title="Background">
                <UploadRow
                  src={draft.hero.image}
                  onUpload={() => handleImageClick('hero.image')}
                  uploading={uploading && uploadTarget === 'hero.image'}
                />
              </PanelSection>
            </>}

            {active === 'features' && <>
              <PanelSection title="Features">
                <TextField label="Section heading" value={draft.features.title} onChange={v => update('features.title', v)} />
                <div className="panel-item-list">
                  {draft.features.items.map((item, i) => (
                    <div key={item.id} className="panel-item-row">
                      <span className="panel-item-label">{item.title || `Feature ${i + 1}`}</span>
                      <button className="panel-item-remove" onClick={() =>
                        update('features.items', draft.features.items.filter((_, j) => j !== i))
                      }>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
                <button className="panel-add-btn" onClick={() => {
                  const id = `f${Date.now()}`
                  update('features.items', [...draft.features.items, { id, title: 'New Feature', description: '' }])
                }}>+ Add Feature</button>
              </PanelSection>
            </>}

            {active === 'products' && <>
              <PanelSection title="Products">
                <TextField label="Section heading" value={draft.products.title} onChange={v => update('products.title', v)} />
                <div className="panel-item-list">
                  {draft.products.items.map((item, i) => (
                    <div key={item.id} className="panel-item-row">
                      <span className="panel-item-label">{item.name || `Product ${i + 1}`}</span>
                      <button className="panel-item-remove" onClick={() =>
                        update('products.items', draft.products.items.filter((_, j) => j !== i))
                      }>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
                <button className="panel-add-btn" onClick={() => {
                  const id = `p${Date.now()}`
                  update('products.items', [...draft.products.items, { id, name: 'New Product', description: '', price: '', image: '' }])
                }}>+ Add Product</button>
              </PanelSection>
            </>}

            {active === 'contact' && <>
              <PanelSection title="Contact Info">
                <TextField label="Heading" value={draft.contact.title} onChange={v => update('contact.title', v)} />
                <TextField label="Email" value={draft.contact.email} onChange={v => update('contact.email', v)} placeholder="info@example.com" />
                <TextField label="Phone" value={draft.contact.phone} onChange={v => update('contact.phone', v)} placeholder="+43 ..." />
                <TextField label="Address" value={draft.contact.address} onChange={v => update('contact.address', v)} textarea />
              </PanelSection>
            </>}

            {active === 'footer' && <>
              <PanelSection title="Footer">
                <TextField label="Tagline" value={draft.footer.tagline} onChange={v => update('footer.tagline', v)} />
                <TextField label="Copyright" value={draft.footer.copyright} onChange={v => update('footer.copyright', v)} placeholder="© 2024 My Business" />
                <div className="panel-field">
                  <label>Links</label>
                  <LinkListEditor links={draft.footer.links} onChange={links => update('footer.links', links)} />
                </div>
              </PanelSection>
            </>}

          </div>

          {/* Save */}
          <div className="builder-panel-foot">
            <button
              className={`builder-save-btn ${saving ? 'loading' : ''} ${saved ? 'done' : ''}`}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving…' : saved ? 'Saved' : 'Save'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="panel-section">
      <div className="panel-section-title">{title}</div>
      {children}
    </div>
  )
}

interface TextFieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  textarea?: boolean
}

function TextField({ label, value, onChange, placeholder, textarea }: TextFieldProps) {
  return (
    <div className="panel-field">
      <label>{label}</label>
      {textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={2} />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="panel-color-row">
      <input type="color" value={value} onChange={e => onChange(e.target.value)} title={label} />
      <span className="panel-color-label">{label}</span>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} className="panel-color-hex" />
    </div>
  )
}

function UploadRow({ src, onUpload, uploading }: { src: string; onUpload: () => void; uploading: boolean }) {
  return (
    <div className="panel-upload-row">
      {src && <img src={src} alt="" className="panel-upload-thumb" />}
      <button className="panel-upload-btn" onClick={onUpload} disabled={uploading}>
        {uploading ? 'Uploading…' : src ? 'Change' : 'Upload'}
      </button>
    </div>
  )
}

function LinkListEditor({ links, onChange }: { links: NavLink[]; onChange: (l: NavLink[]) => void }) {
  return (
    <div className="panel-link-list">
      {links.map((l, i) => (
        <div key={i} className="panel-link-row">
          <input
            type="text"
            value={l.label}
            placeholder="Label"
            onChange={e => { const n = [...links]; n[i] = { ...n[i], label: e.target.value }; onChange(n) }}
          />
          <input
            type="text"
            value={l.href}
            placeholder="/path"
            onChange={e => { const n = [...links]; n[i] = { ...n[i], href: e.target.value }; onChange(n) }}
          />
          <button onClick={() => onChange(links.filter((_, j) => j !== i))}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      ))}
      <button className="panel-add-link-btn" onClick={() => onChange([...links, { label: '', href: '' }])}>+ Add link</button>
    </div>
  )
}
