// "Integrates with" band under the hero (Simeon 18.11.): one slow row of logos, the line below. Each mark
// is a tool the customer portal really connects (app/api/v1/integrations) and has a freely usable logo;
// the others stay out until their owners' brand files are cleared. Marks are recoloured to the text colour; brands whose
// guidelines forbid recolouring (AWS, Azure, Google Cloud, SAP) appear as plain text names (Simeon 18.11.).
import { useEffect, useRef } from 'react'
import { useLocale } from '../../hooks/useLocale'
import { BRANDS } from './integrationBrandPaths'

const LOGOS: { key: string; name: string; textOnly?: boolean; img?: [string, number] }[] = [
  { key: 'github', name: 'GitHub' },
  { key: 'aws', name: 'AWS', textOnly: true },
  { key: 'gitlab', name: 'GitLab' },
  { key: 'azure', name: 'Microsoft Azure', textOnly: true },
  { key: 'anthropic', name: 'Anthropic' },
  { key: 'gcp', name: 'Google Cloud', textOnly: true },
  { key: 'k8s', name: 'Kubernetes' },
  { key: 'sap', name: 'SAP', textOnly: true },
  { key: 'supabase', name: 'Supabase' },
  { key: 'n8n', name: 'n8n', textOnly: true },
  { key: 'mcp', name: 'MCP' },
  { key: 'wazuh', name: 'Wazuh', textOnly: true },
  { key: 'opensearch', name: 'OpenSearch' },
  { key: 'zeek', name: 'Zeek', textOnly: true },
  { key: 'suricata', name: 'Suricata', img: ['/brands/suricata.png', 468] },
  { key: 'xai', name: 'xAI', textOnly: true },
  { key: 'elevenlabs', name: 'ElevenLabs' },
  { key: 'greenbone', name: 'Greenbone', textOnly: true },
  { key: 'falco', name: 'Falco' },
  { key: 'defectdojo', name: 'DefectDojo', textOnly: true },
  { key: 'crowdsec', name: 'CrowdSec', img: ['/brands/crowdsec.png', 396] },
  { key: 'dependencytrack', name: 'Dependency-Track', textOnly: true },
  { key: 'openai', name: 'OpenAI' },
  { key: 'grafana', name: 'Grafana', textOnly: true },
  { key: 'thehive', name: 'TheHive' },
  { key: 'nuclei', name: 'Nuclei', textOnly: true },
  { key: 'perplexity', name: 'Perplexity' },
  { key: 'zap', name: 'OWASP ZAP', textOnly: true },
  { key: 'trivy', name: 'Trivy' },
  { key: 'entra', name: 'Microsoft Entra ID', textOnly: true },
  { key: 'snowflake', name: 'Snowflake' },
  { key: 'dependabot', name: 'Dependabot', textOnly: true },
  { key: 'pinecone', name: 'Pinecone' },
  { key: 'owasp', name: 'OWASP' },
]

const H = 26
const CSS = `
.rfi-int { padding: 30px 0 0; margin-bottom: -14px; overflow: hidden; position: relative; background: transparent; }
.rfi-int-track { display: flex; width: max-content; align-items: center; animation: rfi-int-left 220s linear infinite;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); }
.rfi-int-wrap { -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); }
.rfi-int-track { -webkit-mask-image: none; }
.rfi-int-logo { flex: none; margin: 0 48px; color: var(--text); display: flex; align-items: center; gap: 9px; pointer-events: none; user-select: none; }
.rfi-int-logo span { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-size: 19px; font-weight: 600; letter-spacing: -0.01em; white-space: nowrap; }
.rfi-int-logo img { display: block; width: auto; }
.rfi-int-logo svg { fill: currentColor; }
.rfi-int-line { text-align: center; margin: 26px 24px 0; font-size: var(--fs-small); font-weight: 600; color: var(--text); opacity: .8; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
@media (max-width: 760px) {
  .rfi-int { padding-top: 22px; }
  .rfi-int-logo { margin: 0 24px; gap: 7px; }
  .rfi-int-logo svg { height: 20px; width: auto; }
  .rfi-int-logo svg.rfi-int-wide { height: 11px; }
  .rfi-int-logo span { font-size: 15px; }
}
/* Desktop-Browser (Simeon 21.11. abends): Logos größer und mittig in den 80px, die der Hero unten frei lässt (Hero.tsx). */
@media (min-width: 761px) {
  .rfi-int { padding-top: 22px; }
  .rfi-int-wrap { zoom: 1.2; }
}
@keyframes rfi-int-left { to { transform: translateX(-33.3333%); } }
/* Installierte App (PWA): schneller als im Browser (Simeon 18.11.). */
@media (display-mode: standalone), (display-mode: fullscreen) { .rfi-int-track { animation-duration: 120s; } }
/* PWA mit Tab-Leiste (Simeon 21.11.): Das Band füllt den ersten Bildschirm bis ganz unten, die Logos sitzen
   mittig zwischen Hero und Tab-Leiste, hinter der halbdurchsichtigen Leiste liegt nur Hintergrund. Die Höhen
   setzt useFillToTabBar als --int-fill und --int-bar. */
.rfi-int[data-fill] { min-height: var(--int-fill); padding-bottom: var(--int-bar); margin-bottom: 0; background: var(--bg);
  display: flex; flex-direction: column; justify-content: center; box-sizing: border-box; }
.rfi-int[data-fill] { padding-top: 0; }
/* Simeon 21.11. abends: in der App ohne die Zeile „Integriert mit“ (der Name steht im aria-label der Section),
   dafür größere Logos direkt über der Tab-Leiste. zoom statt transform, damit Schrift und SVG scharf neu gesetzt werden. */
.rfi-int[data-fill] .rfi-int-line { display: none; }
.rfi-int[data-fill] .rfi-int-wrap { zoom: 1.3; }
@media (prefers-reduced-motion: reduce) {
  .rfi-int-wrap { -webkit-mask-image: none; mask-image: none; }
  .rfi-int-track { animation: none; width: auto; flex-wrap: wrap; justify-content: center; row-gap: 22px; }
  .rfi-int-track [data-dup] { display: none; }
}
`

// Nur in der installierten App (standalone/fullscreen) und nur, wenn die Tab-Leiste da ist: misst den Abstand
// vom Bandanfang bis zum unteren Bildschirmrand und den Platz, den die Leiste belegt, bei jeder Größenänderung
// von Fenster oder Hero neu. Im Browser bleibt das Band unverändert.
function useFillToTabBar() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    const pwa = window.matchMedia('(display-mode: standalone), (display-mode: fullscreen)')
    if (!el) return
    let raf = 0
    const measure = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const bar = document.querySelector<HTMLElement>('.rfi-tabbar')
        if (!pwa.matches || !bar || bar.getClientRects().length === 0) {
          el.removeAttribute('data-fill'); return
        }
        const top = el.getBoundingClientRect().top + window.scrollY
        const vh = window.innerHeight
        const barSpace = vh - bar.getBoundingClientRect().top
        if (top >= vh - barSpace) { el.removeAttribute('data-fill'); return }
        // html { zoom: 0.9 } (index.css): Messwerte sind Bildschirmpixel, CSS-Längen gelten vor dem Zoom.
        const z = parseFloat(getComputedStyle(document.documentElement).zoom) || 1
        el.style.setProperty('--int-fill', `${Math.ceil((vh - top) / z)}px`)
        el.style.setProperty('--int-bar', `${Math.round(barSpace / z)}px`)
        el.setAttribute('data-fill', '')
      })
    }
    measure()
    // Oberhalb ändert sich die Höhe noch nach dem ersten Bild (Schriften, Hero-Einflug): Seite beobachten,
    // dazu nach load und einmal verzögert. Gleiche Werte setzen ändert nichts, daher keine Schleife.
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    if (el.previousElementSibling) ro.observe(el.previousElementSibling)
    const late = window.setTimeout(measure, 1500)
    window.addEventListener('load', measure)
    window.addEventListener('resize', measure)
    pwa.addEventListener('change', measure)
    return () => {
      cancelAnimationFrame(raf); clearTimeout(late); ro.disconnect()
      window.removeEventListener('load', measure); window.removeEventListener('resize', measure); pwa.removeEventListener('change', measure)
    }
  }, [])
  return ref
}

export function IntegrationsSection() {
  const { locale } = useLocale()
  const line = locale === 'de' ? 'Integriert mit' : 'Integrates with'
  const ref = useFillToTabBar()
  return (
    <section ref={ref} className="rfi-int" aria-label={line}>
      <style>{CSS}</style>
      <div className="rfi-int-wrap">
        <div className="rfi-int-track">
          {[0, 1, 2].flatMap(copy => LOGOS.map(({ key, name, textOnly, img }) => {
            const b = BRANDS[key]
            const wide = !!b && b.w > 7
            const mark = img ? (
              <img src={img[0]} alt={name} height={img[1] > 420 ? 17 : 19} width={Math.round((img[1] > 420 ? 17 : 19) * img[1] / 64)} className="rfi-int-img" />
            ) : textOnly ? null : (
              <svg role="img" aria-label={name} viewBox={b.vb} height={wide ? 15 : H} width={Math.round((wide ? 15 : H) * b.w)} className={wide ? 'rfi-int-wide' : undefined}
                dangerouslySetInnerHTML={{ __html: `<title>${name}</title>${b.body}` }} />
            )
            // Marks without a wordmark of their own get the name beside them.
            return (
              <div key={`${copy}-${key}`} className="rfi-int-logo" aria-hidden={copy ? true : undefined} {...(copy ? { 'data-dup': '' } : {})}>
                {mark}
                {(textOnly || (b && b.w <= 1.3)) && <span>{name}</span>}
              </div>
            )
          }))}
        </div>
      </div>
      <p className="rfi-int-line">{line}</p>
    </section>
  )
}
