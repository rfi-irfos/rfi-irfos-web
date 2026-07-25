import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
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
import './App.css'

// LegalPage predates the router and takes slug as a prop — adapt the
// /p/:slug URL param to it here rather than rewriting the component.
function LegalPageRoute() {
  const { slug } = useParams<{ slug: string }>()
  return <LegalPage slug={slug ?? ''} />
}

export default function App() {
  return (
    <BrowserRouter>
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
          <Route path="/p/:slug" element={<LegalPageRoute />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
