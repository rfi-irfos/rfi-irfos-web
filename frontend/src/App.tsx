import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { PublicSite } from './components/PublicSite'
import { LocaleProvider } from './hooks/useLocale'
import './App.css'

// Lazy-loaded: legal pages are a secondary route homepage visitors never hit, so there's
// no reason to make them download this bundle too. PublicSite stays a direct import since
// it's what the overwhelming majority of visits actually need - no extra round-trip for
// the common case.
const LegalPage = lazy(() => import('./components/LegalPage').then(m => ({ default: m.LegalPage })))

const LEGAL_SLUGS = ['impressum', 'datenschutz', 'agb', 'security', 'standards', 'team', 'methodology']
// View ids that also get a real, crawlable URL in addition to their homepage hash.
// The legacy section slugs remain accepted so existing links do not break while
// the public shell is reorganised into Home / Systems / Evidence / Access views.
const SECTION_SLUGS = ['systems', 'evidence', 'access', 'submit', 'research', 'projects', 'track-record', 'pricing']

function pathSlug() {
  return window.location.pathname.replace(/^\/|\/$/g, '')
}

function getSlug() {
  const h = window.location.hash
  if (h.startsWith('#p/')) return h.slice(3)
  const p = pathSlug()
  return LEGAL_SLUGS.includes(p) ? p : null
}

function getSectionFocus() {
  const p = pathSlug()
  return SECTION_SLUGS.includes(p) ? p : null
}

export default function App() {
  const [slug, setSlug] = useState(getSlug)
  // Read once on mount, not reactive to hashchange - a direct-path landing like
  // /pricing decides the initial scroll target and meta tags, the homepage's own
  // #hash nav clicks are unrelated native browser scrolling, not a slug change.
  const [sectionFocus] = useState(getSectionFocus)

  useEffect(() => {
    // Take over scroll restoration ourselves so the browser's own (which fires
    // on popstate, i.e. the real back/forward buttons) can't race the manual
    // restore below and snap the page to the wrong spot.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    const onNav = () => setSlug(getSlug())
    window.addEventListener('hashchange', onNav)
    // popstate also covers the real back/forward buttons AND the manual
    // `history.pushState` + dispatched PopStateEvent that LegalPage's
    // quicklinks/back-link now use (2026-08-19, live feedback: clicking a
    // legal-page link was a full browser reload, "das ist nicht clean, das
    // ist increment" - pushState changes the URL without a reload, this
    // listener is what turns that URL change into an actual slug update).
    window.addEventListener('popstate', onNav)
    return () => {
      window.removeEventListener('hashchange', onNav)
      window.removeEventListener('popstate', onNav)
    }
  }, [])

  // Legal pages are a separate route — jump to top when entering one. Leaving
  // one always lands at the BOTTOM of the homepage (2026-08-19, live feedback:
  // "anywhere nav back out back at the BOTTOM"), not wherever the visitor
  // happened to be scrolled to before - every legal-page link lives in the
  // footer, so landing back at the footer is the natural round trip
  // regardless of whether this page load ever had a homepage scroll position
  // to remember in the first place (a direct /impressum bookmark never did).
  //
  // CRITICAL BUG FIXED same day: this effect depends on [slug] and `slug`
  // starts out null on a completely fresh homepage load - with no guard, that
  // counted as "leaving a legal page" on EVERY first visit, and every visitor
  // landed at the bottom of the page instead of the top, skipping the cookie
  // banner and everything else along the way ("jeder der auf die startseite
  // kommt landet sofort unten"). A ref remembers the previous slug so the
  // bottom-scroll only fires on a genuine truthy -> null transition, never on
  // initial mount (where there is no previous slug to have left).
  const prevSlug = useRef(slug)
  useEffect(() => {
    if (slug) { window.scrollTo(0, 0); prevSlug.current = slug; return }
    if (prevSlug.current) {
      // requestAnimationFrame so this runs after PublicSite has actually
      // painted - document.body.scrollHeight read on the same tick as mount
      // can still reflect the previous (or empty) DOM.
      requestAnimationFrame(() => window.scrollTo(0, document.body.scrollHeight))
    }
    prevSlug.current = slug
  }, [slug])

  // LegalPage now shares the same LocaleProvider/localStorage key as PublicSite
  // (2026-08-18) - every legal/reference page got a real German translation
  // except Team (2026-08-19: Security/Standards/Methodology closed the gap
  // Impressum/Datenschutz/AGB left open) - the DE/EN toggle reaches this
  // route the same way it reaches the homepage.
  if (slug) return <LocaleProvider><Suspense fallback={null}><LegalPage slug={slug} /></Suspense></LocaleProvider>
  return <LocaleProvider><PublicSite initialSection={sectionFocus} /></LocaleProvider>
}
