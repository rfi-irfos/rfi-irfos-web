import { useState, useEffect } from 'react'
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
  useEffect(() => {
    const onHash = () => setSlug(getSlug())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  // Legal pages are a separate route — when the hash flips to / from a #p/…
  // route, reset scroll to the top so visitors don't land at the bottom.
  useEffect(() => {
    if (slug) window.scrollTo(0, 0)
  }, [slug])
  if (slug) return <LegalPage slug={slug} />
  return <PublicSite />
}
