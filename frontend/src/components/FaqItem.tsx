// FAQ row shared by the service pages and the price list on Access. Moved out of LandingPage.tsx
// (28.11.2026) so Pricing can use it without pulling the lazily loaded landing bundle.
import React, { useState } from 'react'
import { IconPlus } from '@tabler/icons-react'
import { FAQ_LINK } from '../lib/faqText'

const LINK: React.CSSProperties = { color: 'var(--accent-text)', textDecoration: 'none', fontWeight: 600 }

// FAQ answers may carry internal links as [text](/path/). The page renders them as links, the
// FAQPage JSON-LD gets the same sentence as plain text, so markup and visible text stay identical.
function faqRich(a: string): React.ReactNode[] {
  const out: React.ReactNode[] = []; let last = 0
  for (const m of a.matchAll(FAQ_LINK)) {
    out.push(a.slice(last, m.index)); out.push(<a key={m.index} href={m[2]} style={LINK}>{m[1]}</a>); last = m.index! + m[0].length
  }
  out.push(a.slice(last)); return out
}

// One FAQ row (Simeon 2026-11-22: "ALLES ist immer smooth animiert"): opens and closes with the house
// .fx-expand transition (grid rows 0fr -> 1fr plus fade). The answer stays in the DOM for search engines.
export function FaqItem({ q, a, id }: { q: string; a: string; id: string }) {
  const [open, setOpen] = useState(false)
  return <div className={`svc-faq-item rfi-glass-flat rfi-glass-solid${open ? ' is-open' : ''}`}>
    <h3><button type="button" className="svc-faq-q" aria-expanded={open} aria-controls={id} onClick={() => setOpen(o => !o)}>
      <span>{q}</span><span className="svc-faq-toggle" aria-hidden="true"><IconPlus size={16} stroke={2} /></span>
    </button></h3>
    <div id={id} className={`fx-expand svc-faq-panel${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div style={{ overflow: 'hidden', minHeight: 0 }}><p>{faqRich(a)}</p></div>
    </div>
  </div>
}
