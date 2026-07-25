import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'
import { LegalPage } from './components/LegalPage'
import Home from './components/routes/Home'
import Research from './components/routes/Research'
import Projects from './components/routes/Projects'
import TrackRecord from './components/routes/TrackRecord'
import Submit from './components/routes/Submit'
import Standards from './components/routes/Standards'
import Pricing from './components/routes/Pricing'
import Team from './components/routes/Team'
import Coop from './components/routes/Coop'
import Contact from './components/routes/Contact'
import './App.css'

// Legacy hash routes (#p/security, #research, etc.) → clean paths. The Fly.io
// backend already serves index.html for unknown paths, so deep links work; this
// only rewrites the old hash-style URLs still indexed by search engines.
function HashRedirect() {
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.length > 1) {
      const path = hash.slice(1) // strip leading '#'
      if (path.startsWith('p/') || path.startsWith('/p/')) {
        navigate('/' + path.replace(/^\//, ''), { replace: true })
      } else if (path.startsWith('/')) {
        navigate(path, { replace: true })
      } else {
        navigate('/' + path, { replace: true })
      }
    }
  }, [navigate, location])
  return null
}

function LegalPageRoute() {
  const { slug } = useParams<{ slug: string }>()
  return <LegalPage slug={slug ?? ''} />
}

export default function App() {
  return (
    <BrowserRouter>
      <HashRedirect />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/research" element={<Research />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/track-record" element={<TrackRecord />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/standards" element={<Standards />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/team" element={<Team />} />
          <Route path="/coop" element={<Coop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/p/:slug" element={<LegalPageRoute />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
