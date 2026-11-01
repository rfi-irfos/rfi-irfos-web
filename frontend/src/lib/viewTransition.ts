import { flushSync } from 'react-dom'

// Language and theme toggles used to swap the whole page in one frame (Simeon 01.11.:
// "it does not switch the page smooth"). The View Transitions API snapshots the old page,
// applies the update synchronously, and cross-fades to the new one. Browsers without it,
// and visitors who ask for reduced motion, keep the instant switch.
export function withViewTransition(update: () => void) {
  const doc = typeof document === 'undefined' ? undefined : document as Document & { startViewTransition?: (cb: () => void) => unknown }
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (!doc?.startViewTransition || reduced) { update(); return }
  doc.startViewTransition(() => flushSync(update))
}
