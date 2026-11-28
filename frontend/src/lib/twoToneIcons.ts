// Two-tone Tabler icons in the glass box (Simeon 23.11.2026: "icons immer zweifarbig", accents the other way
// round). The largest shape of each icon is its base form and gets the light .k2 tone; every other shape keeps
// the area colour as the accent. Tabler's shape order says nothing about size, so this measures getBBox once
// per icon. Runs on load and whenever React adds new nodes (view switches, lazy chunks).
const SEL = '.rfi-ri-box svg.tabler-icon:not([data-2t])'

function tag(svg: SVGSVGElement) {
  const shapes = Array.from(svg.children).filter((c): c is SVGGraphicsElement => c instanceof SVGGraphicsElement)
  if (shapes.length < 2) { svg.setAttribute('data-2t', '1'); return }
  let best: SVGGraphicsElement | null = null, area = -1
  for (const s of shapes) {
    let a = 0
    try { const b = s.getBBox(); a = b.width * b.height } catch { /* not rendered yet */ }
    if (a > area) { area = a; best = s }
  }
  if (area <= 0 || !best) return // not laid out yet, try again on the next mutation
  // Papers and sheets the other way round (Simeon 23.11.2026): the sheet keeps the colour, what is drawn on it
  // turns light. "On it" = fully inside the sheet's box; the folded corner and a clipboard clip touch the edge.
  if (/tabler-icon-(file|clipboard|report|notes|license|certificate)/.test(svg.getAttribute('class') ?? '')) {
    const o = best.getBBox()
    for (const s of shapes) {
      if (s === best) continue
      const b = s.getBBox()
      if (b.x > o.x + 0.4 && b.y > o.y + 0.4 && b.x + b.width < o.x + o.width - 0.4 && b.y + b.height < o.y + o.height - 0.4) s.classList.add('k2')
    }
    // FOUND 2026-11-28 (Simeon, one-tone file-report/file-certificate/file-import): when the drawing on the sheet
    // reaches past its edge, nothing was fully inside and the whole icon stayed in the area colour. Fallback: every
    // shape whose centre sits on the sheet turns light, except the folded corner (touches the top and right edge).
    if (!svg.querySelector('.k2')) for (const s of shapes) {
      if (s === best) continue
      const b = s.getBBox(), cx = b.x + b.width / 2, cy = b.y + b.height / 2
      const corner = b.y <= o.y + 0.4 && b.x + b.width >= o.x + o.width - 0.4
      if (!corner && cx >= o.x && cx <= o.x + o.width && cy >= o.y && cy <= o.y + o.height) s.classList.add('k2')
    }
  } else best.classList.add('k2')
  svg.setAttribute('data-2t', '1')
}

export function startTwoToneIcons() {
  if (typeof window === 'undefined' || typeof MutationObserver === 'undefined') return
  let queued = false
  const run = () => { queued = false; document.querySelectorAll<SVGSVGElement>(SEL).forEach(tag) }
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(run) } }
  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true })
  schedule()
}
