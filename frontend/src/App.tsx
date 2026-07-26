import { useState, useEffect, useRef } from 'react'
import { PublicSite } from './components/PublicSite'
import { LegalPage } from './components/LegalPage'
import './App.css'

function getSlug() {
  const h = window.location.hash
  if (h.startsWith('#p/')) return h.slice(3)
  return null
}

export default function App() {
  const [slug, setSlug] = useState(getSlug)
  const homeScrollY = useRef(0)

  useEffect(() => {
    // Take over scroll restoration ourselves so the browser's own (which fires
    // on popstate, i.e. the real back/forward buttons) can't race the manual
    // restore below and snap the page to the wrong spot.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    const onHash = () => setSlug(getSlug())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Track scroll position on the homepage only, so a visit to a legal page
  // and back doesn't strand them at the top having to scroll back down.
  useEffect(() => {
    if (slug) return
    const onScroll = () => { homeScrollY.current = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [slug])

  // Legal pages are a separate route — jump to top when entering one, restore
  // the remembered homepage position when leaving.
  useEffect(() => {
    window.scrollTo(0, slug ? 0 : homeScrollY.current)
  }, [slug])

  if (slug) return <LegalPage slug={slug} />
  return <PublicSite />
}
