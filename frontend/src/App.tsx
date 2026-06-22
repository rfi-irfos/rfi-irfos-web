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
  if (slug) return <LegalPage slug={slug} />
  return <PublicSite />
}
