// Anonymous code of the "Put it to the test" demo (D-7K3Q). The demo's Get access link carries it as ?demo=<code>;
// the checkout hands it to Stripe so a purchase can be traced to the demo. Read from the address bar at click time,
// never stored. The backend checks the same shape again.
const DEMO_CODE = /^D-[A-Z0-9]{4}$/

export function demoCodeFromUrl(): string | undefined {
  if (typeof window === 'undefined') return undefined
  const v = new URLSearchParams(window.location.search).get('demo')
  return v && DEMO_CODE.test(v) ? v : undefined
}
