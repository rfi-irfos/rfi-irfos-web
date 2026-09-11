// Real, standalone usage-dashboard component for the DINGIR API developer
// portal (Phase 3 of the DINGIR shipping-readiness plan). DELIBERATELY NOT
// wired into any live route yet -- placement (extend the existing Access/
// Pricing section vs. a new page) was explicitly left undecided pending a
// real product-placement decision (per project notes, 2026-08-29: "not yet
// decided between the two placements... discuss placement/scope before
// building anything on rfi-irfos-web"). This component is built and tested
// in isolation so it's ready to import into whichever real route gets
// chosen, without that decision blocking the component's own correctness.
//
// Calls the real, live GET /billing/usage endpoint (bi_api.py) -- reads the
// authenticated caller's own real usage_rollups, the same shared source
// both billing paths (Stripe metered, enterprise export) read from. No
// session/login system exists on this site; the visitor supplies their own
// real API key directly, client-side, sent only to the configured DINGIR
// API origin (never persisted, never sent anywhere else).
import { useState } from 'react'
import { useLocale } from '../../hooks/useLocale'

const DINGIR_API_BASE =
  (import.meta.env.VITE_DINGIR_API_URL as string | undefined) || 'http://localhost:8080'

type UsageRollup = {
  period: string
  request_count: number
  error_count: number
  total_elapsed_ms: number
}

type UsageResponse = {
  tenant_id: string
  rollups: UsageRollup[]
  totals: { request_count: number; error_count: number }
}

const COPY = {
  en: {
    title: 'API usage',
    intro: 'Enter your DINGIR API key to see your own real usage -- nothing is stored, the key is sent only to the DINGIR API for this one request.',
    apiKeyLabel: 'API key', apiKeyPlaceholder: 'Your X-API-Key',
    fetchButton: 'View usage', fetchingButton: 'Loading…',
    tableHeaders: { period: 'Day', requests: 'Requests', errors: 'Errors' },
    totalsLabel: 'Total', noUsageYet: 'No usage recorded yet for this key.',
    errorInvalidKey: 'That API key was not recognized.',
    errorGeneric: 'Could not reach the usage service. Try again shortly.',
  },
  de: {
    title: 'API-Nutzung',
    intro: 'Gib deinen DINGIR-API-Key ein, um deine echte Nutzung zu sehen -- nichts wird gespeichert, der Key wird nur für diese eine Anfrage an die DINGIR-API gesendet.',
    apiKeyLabel: 'API-Key', apiKeyPlaceholder: 'Dein X-API-Key',
    fetchButton: 'Nutzung anzeigen', fetchingButton: 'Lädt…',
    tableHeaders: { period: 'Tag', requests: 'Anfragen', errors: 'Fehler' },
    totalsLabel: 'Gesamt', noUsageYet: 'Für diesen Key wurde noch keine Nutzung erfasst.',
    errorInvalidKey: 'Dieser API-Key wurde nicht erkannt.',
    errorGeneric: 'Der Nutzungs-Service ist gerade nicht erreichbar. Bitte kurz erneut versuchen.',
  },
} as const

type FetchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: UsageResponse }

export async function fetchUsage(apiKey: string, apiBase: string = DINGIR_API_BASE): Promise<UsageResponse> {
  const resp = await fetch(`${apiBase}/billing/usage`, {
    headers: { 'X-API-Key': apiKey },
  })
  if (resp.status === 401) {
    throw new Error('invalid_key')
  }
  if (!resp.ok) {
    throw new Error('unreachable')
  }
  return resp.json() as Promise<UsageResponse>
}

export function DeveloperPortalUsage() {
  const { locale } = useLocale()
  const t = COPY[locale]
  const [apiKey, setApiKey] = useState('')
  const [state, setState] = useState<FetchState>({ status: 'idle' })

  const handleFetch = async () => {
    if (!apiKey.trim()) return
    setState({ status: 'loading' })
    try {
      const data = await fetchUsage(apiKey.trim())
      setState({ status: 'success', data })
    } catch (err) {
      const message = err instanceof Error && err.message === 'invalid_key'
        ? t.errorInvalidKey
        : t.errorGeneric
      setState({ status: 'error', message })
    }
  }

  return (
    <div className="developer-portal-usage">
      <h3>{t.title}</h3>
      <p>{t.intro}</p>
      <div className="developer-portal-usage__form">
        <label htmlFor="dingir-api-key">{t.apiKeyLabel}</label>
        <input
          id="dingir-api-key"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={t.apiKeyPlaceholder}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={handleFetch}
          disabled={state.status === 'loading' || !apiKey.trim()}
        >
          {state.status === 'loading' ? t.fetchingButton : t.fetchButton}
        </button>
      </div>

      {state.status === 'error' && (
        <p role="alert" className="developer-portal-usage__error">{state.message}</p>
      )}

      {state.status === 'success' && (
        <div className="developer-portal-usage__result">
          {state.data.rollups.length === 0 ? (
            <p>{t.noUsageYet}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>{t.tableHeaders.period}</th>
                  <th>{t.tableHeaders.requests}</th>
                  <th>{t.tableHeaders.errors}</th>
                </tr>
              </thead>
              <tbody>
                {state.data.rollups.map((r) => (
                  <tr key={r.period}>
                    <td>{r.period}</td>
                    <td>{r.request_count}</td>
                    <td>{r.error_count}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>{t.totalsLabel}</td>
                  <td>{state.data.totals.request_count}</td>
                  <td>{state.data.totals.error_count}</td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
