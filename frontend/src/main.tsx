import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { installAdClickCarry } from './lib/adClick'
import { startTwoToneIcons } from './lib/twoToneIcons'

installAdClickCarry()

// After a deploy, a tab that was already open still holds the old entry bundle, whose lazy chunks
// (LandingBody, LegalPage) no longer exist on the server. Clicking a service page then fails to load
// silently and only a manual refresh helped (Simeon 22.11.2026). Vite fires vite:preloadError for
// exactly this case: reload once to fetch the fresh build. The timestamp guard stops a reload loop
// if the chunk is broken for another reason.
window.addEventListener('vite:preloadError', (event) => {
  const KEY = 'rfi-chunk-reload'
  const last = Number(sessionStorage.getItem(KEY) || 0)
  if (Date.now() - last < 10_000) return
  sessionStorage.setItem(KEY, String(Date.now()))
  event.preventDefault()
  window.location.reload()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

startTwoToneIcons()
