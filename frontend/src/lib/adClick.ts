// Google Ads click id, carried without cookies or web storage (2026-11-21, Simeon).
//
// A Google Ads click lands with ?gclid=… (gbraid/wbraid would need their own import
// columns; desktop B2B search almost always carries gclid, so only gclid is used). We read it from the
// address bar into a plain module variable, never into a cookie, localStorage or
// sessionStorage, so nothing is stored on the visitor's device (TKG § 165 / ePrivacy
// Art. 5(3) stay untriggered). The forms send it along; the backend writes it to
// ad_conversions.jsonl, which we upload to Google Ads as offline conversions.
//
// Most internal navigation is SPA (memory survives), but some links are full page loads.
// For those, a capturing click listener appends the id to same-origin links at click time,
// so the next page reads it from its own URL again. Without an ad click nothing happens.

const PARAMS = ['gclid'] as const
const VALID = /^[A-Za-z0-9_-]{10,200}$/

let clickId: string | null = null
let clickParam: (typeof PARAMS)[number] | null = null

function readFromUrl() {
  if (typeof window === 'undefined') return
  const q = new URLSearchParams(window.location.search)
  for (const p of PARAMS) {
    const v = q.get(p)
    if (v && VALID.test(v)) { clickId = v; clickParam = p; return }
  }
}

/** The ad click id of this visit, or undefined (sent as an absent JSON field). */
export function adClickId(): string | undefined {
  return clickId ?? undefined
}

export function installAdClickCarry() {
  readFromUrl()
  if (!clickId || typeof document === 'undefined') return
  document.addEventListener('click', e => {
    if (!clickId || !clickParam) return
    const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
    if (!a || a.origin !== window.location.origin) return
    const url = new URL(a.href)
    if (url.searchParams.has(clickParam)) return
    url.searchParams.set(clickParam, clickId)
    a.href = url.toString()
  }, true)
}
