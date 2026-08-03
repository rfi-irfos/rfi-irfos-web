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

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof localStorage === 'undefined') return 'en'
    const saved = localStorage.getItem(KEY) as Locale | null
    return saved && LOCALES.includes(saved) ? saved : 'en'
  })

  useEffect(() => {
    try { localStorage.setItem(KEY, locale) } catch { /* private mode */ }
  }, [locale])

  const setLocale = (l: Locale) => setLocaleState(l)

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
