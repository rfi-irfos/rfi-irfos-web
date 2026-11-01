// "Install RFI-IRFOS as an app" card for phones (Simeon 2026-11-01). Chrome/Android hands us a
// beforeinstallprompt event once the manifest qualifies; we hold it and offer our own glass card
// above the tab bar instead of the browser's mini-infobar. iOS Safari has no such event, so it
// gets a one-line hint (Share, then Add to Home Screen). Hidden when already installed, and a
// "Later" keeps it away for 30 days.
import { useEffect, useState } from 'react'
import { IconDeviceMobileDown, IconX } from '@tabler/icons-react'

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> }

const KEY = 'rfi-install-dismissed'
const SNOOZE_MS = 30 * 24 * 3600 * 1000
const snoozed = () => { try { return Date.now() - Number(localStorage.getItem(KEY) || 0) < SNOOZE_MS } catch { return false } }
const standalone = () => window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true
const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent) && !/crios|fxios/i.test(navigator.userAgent)

export function InstallPrompt({ locale, blocked }: { locale: 'en' | 'de'; blocked: boolean }) {
  const [evt, setEvt] = useState<BIPEvent | null>(null)
  const [ios, setIos] = useState(false)
  const [ready, setReady] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    if (standalone() || snoozed()) return
    const onPrompt = (e: Event) => { e.preventDefault(); setEvt(e as BIPEvent) }
    const onInstalled = () => setGone(true)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    if (isIos()) setIos(true)
    // Give the visitor a moment with the page before asking.
    const id = window.setTimeout(() => setReady(true), 12000)
    return () => { window.removeEventListener('beforeinstallprompt', onPrompt); window.removeEventListener('appinstalled', onInstalled); window.clearTimeout(id) }
  }, [])

  if (gone || blocked || !ready || (!evt && !ios)) return null
  const later = () => { try { localStorage.setItem(KEY, String(Date.now())) } catch { /* private mode */ } setGone(true) }
  const install = async () => { if (!evt) return; await evt.prompt(); const c = await evt.userChoice; if (c.outcome === 'dismissed') later(); else setGone(true) }
  const de = locale === 'de'

  return (
    <div role="dialog" aria-label={de ? 'Als App installieren' : 'Install as app'} style={{
      position: 'fixed', left: 10, right: 10, bottom: 'calc(88px + env(safe-area-inset-bottom))', zIndex: 160,
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 12px 12px 14px', borderRadius: 20,
      background: 'rgba(22, 24, 34, 0.72)', backdropFilter: 'blur(18px) saturate(140%)', WebkitBackdropFilter: 'blur(18px) saturate(140%)',
      border: '1px solid rgba(255, 255, 255, 0.09)', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 10px 32px rgba(0, 0, 0, 0.5)',
    }}>
      <img src="/pwa-192.png" alt="" width={40} height={40} style={{ borderRadius: 10, flexShrink: 0 }} />
      <div style={{ flex: '1 1 auto', minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 'var(--fs-small)', fontWeight: 600, color: 'var(--text)' }}>{de ? 'RFI-IRFOS als App' : 'RFI-IRFOS as an app'}</p>
        <p style={{ margin: '2px 0 0', fontSize: 'var(--fs-label)', color: 'var(--text2)', lineHeight: 1.4 }}>
          {evt ? (de ? 'Auf den Startbildschirm legen, ohne Browserleiste.' : 'Add it to your home screen, no browser bar.')
            : (de ? 'Tippen Sie auf Teilen, dann „Zum Home-Bildschirm“.' : 'Tap Share, then “Add to Home Screen”.')}
        </p>
      </div>
      {evt && <button onClick={install} style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 999, border: 'none', background: 'var(--accent-text)', color: 'var(--bg)', fontWeight: 600, fontSize: 'var(--fs-small)', cursor: 'pointer' }}>
        <IconDeviceMobileDown size={16} stroke={2} aria-hidden />{de ? 'Installieren' : 'Install'}
      </button>}
      <button onClick={later} aria-label={de ? 'Später' : 'Later'} style={{ flexShrink: 0, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999, border: 'none', background: 'transparent', color: 'var(--text2)', cursor: 'pointer' }}>
        <IconX size={18} stroke={1.8} aria-hidden />
      </button>
    </div>
  )
}
