// "Integrates with" band under the hero (Simeon 18.11.): one slow row of logos, the line below. Each mark
// is a tool the customer portal really connects (app/api/v1/integrations) and has a freely usable logo;
// the others stay out until their owners' brand files are cleared. Marks are recoloured to the text colour; brands whose
// guidelines forbid recolouring (AWS, Azure, Google Cloud, SAP) appear as plain text names (Simeon 18.11.).
import { useLocale } from '../../hooks/useLocale'
import { BRANDS } from './integrationBrandPaths'

const LOGOS: { key: string; name: string; textOnly?: boolean; pure?: boolean }[] = [
  { key: 'github', name: 'GitHub' },
  { key: 'gitlab', name: 'GitLab' },
  { key: 'anthropic', name: 'Anthropic', pure: true },
  { key: 'gcp', name: 'Google Cloud', textOnly: true },
  { key: 'aws', name: 'AWS', textOnly: true },
  { key: 'azure', name: 'Microsoft Azure', textOnly: true },
  { key: 'k8s', name: 'Kubernetes' },
  { key: 'sap', name: 'SAP', textOnly: true },
  { key: 'supabase', name: 'Supabase' },
  { key: 'n8n', name: 'n8n', textOnly: true },
  { key: 'mcp', name: 'MCP' },
  { key: 'opensearch', name: 'OpenSearch' },
  { key: 'openai', name: 'OpenAI', pure: true },
  { key: 'falco', name: 'Falco' },
  { key: 'trivy', name: 'Trivy' },
  { key: 'owasp', name: 'OWASP' },
]

const H = 26
const CSS = `
.rfi-int { padding: 30px 0 0; margin-bottom: -14px; overflow: hidden; position: relative; background: transparent; }
.rfi-int-track { display: flex; width: max-content; align-items: center; animation: rfi-int-left 120s linear infinite;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); }
.rfi-int-wrap { -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); }
.rfi-int-track { -webkit-mask-image: none; }
.rfi-int-logo { flex: none; margin: 0 48px; color: var(--text); opacity: .8; display: flex; align-items: center; gap: 9px; pointer-events: none; user-select: none; }
.rfi-int-logo span { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-size: 19px; font-weight: 600; letter-spacing: -0.01em; white-space: nowrap; }
.rfi-int-line { text-align: center; margin: 26px 24px 0; font-size: var(--fs-small); font-weight: 600; color: var(--text); opacity: .8; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
@media (max-width: 760px) {
  .rfi-int { padding-top: 22px; }
  .rfi-int-logo { margin: 0 24px; gap: 7px; }
  .rfi-int-logo svg { height: 20px; width: auto; }
  .rfi-int-logo svg.rfi-int-wide { height: 11px; }
  .rfi-int-logo span { font-size: 15px; }
}
@keyframes rfi-int-left { to { transform: translateX(-33.3333%); } }
@media (prefers-reduced-motion: reduce) {
  .rfi-int-wrap { -webkit-mask-image: none; mask-image: none; }
  .rfi-int-track { animation: none; width: auto; flex-wrap: wrap; justify-content: center; row-gap: 22px; }
  .rfi-int-track [data-dup] { display: none; }
}
`

export function IntegrationsSection() {
  const { locale } = useLocale()
  const line = locale === 'de' ? 'Integriert mit' : 'Integrates with'
  return (
    <section className="rfi-int" aria-label={line}>
      <style>{CSS}</style>
      <div className="rfi-int-wrap">
        <div className="rfi-int-track">
          {[0, 1, 2].flatMap(copy => LOGOS.map(({ key, name, textOnly, pure }) => {
            const b = BRANDS[key]
            const mark = (
              <svg role="img" fill="currentColor" aria-label={name} viewBox={b.vb} height={b.w > 7 ? 15 : H} width={Math.round((b.w > 7 ? 15 : H) * b.w)} className={b.w > 7 ? 'rfi-int-wide' : undefined}
                dangerouslySetInnerHTML={{ __html: `<title>${name}</title>${b.body}` }} />
            )
            // Marks without a wordmark of their own get the name beside them.
            return (
              <div key={`${copy}-${key}`} className="rfi-int-logo" style={pure ? { opacity: 1 } : undefined} aria-hidden={copy ? true : undefined} {...(copy ? { 'data-dup': '' } : {})}>
                {!textOnly && mark}
                {(textOnly || b.w <= 1.3) && <span>{name}</span>}
              </div>
            )
          }))}
        </div>
      </div>
      <p className="rfi-int-line">{line}</p>
    </section>
  )
}
