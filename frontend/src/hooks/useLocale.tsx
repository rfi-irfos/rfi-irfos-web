import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { EN, type Content } from '../content/en'
import { DE } from '../content/de'

// EN/DE homepage content switch. Modeled on useTheme.ts's localStorage pattern:
// a saved choice always wins, otherwise default to English (this is not
// language-detection-critical - see the i18n task's own instruction to keep
// it simple).
export type Locale = 'en' | 'de'
export const LOCALES: Locale[] = ['en', 'de']

const KEY = 'rfi-locale'

const CONTENT: Record<Locale, Content> = { en: EN, de: DE }

const LocaleContext = createContext<{
  locale: Locale
  setLocale: (l: Locale) => void
  t: Content
} | null>(null)

export function LocaleProvider({ children, initialLocale }: { children: ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    // A /de/ URL landing (App.tsx) outranks the saved preference: the URL itself
    // names the requested language, and the prerendered German snapshot a crawler
    // indexed for that URL must match what a visitor then sees on it.
    if (initialLocale) return initialLocale
    if (typeof localStorage === 'undefined') return 'en'
    const saved = localStorage.getItem(KEY) as Locale | null
    return saved && LOCALES.includes(saved) ? saved : 'en'
  })

  useEffect(() => {
    try { localStorage.setItem(KEY, locale) } catch { /* private mode */ }
  }, [locale])

  // Kept in sync with the active locale (was hardcoded "en" in index.html and
  // never touched again, added 2026-09-01) - CSS hyphens: auto picks its
  // hyphenation dictionary from the nearest lang attribute, so German
  // compounds never got a real dictionary break, only <html lang="en">'s
  // (nonexistent) rules for them.
  useEffect(() => { document.documentElement.lang = locale }, [locale])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    // Keep the /de URL prefix in step with an explicit toggle (replaceState: a
    // language switch is a representation change of the same page, not a new
    // history entry). Initial-load locale resolution deliberately never does
    // this - only a real user action rewrites the URL.
    if (typeof window === 'undefined') return
    const { pathname, search, hash } = window.location
    const isDe = /^\/de(\/|$)/.test(pathname)
    if (l === 'de' && !isDe) history.replaceState(null, '', `/de${pathname === '/' ? '' : pathname}${search}${hash}`)
    else if (l === 'en' && isDe) history.replaceState(null, '', `${pathname.replace(/^\/de(?=\/|$)/, '') || '/'}${search}${hash}`)
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: CONTENT[locale] }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider')
  return ctx
}
