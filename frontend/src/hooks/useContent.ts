import { useState, useEffect, useCallback } from 'react'
import type { SiteContent } from '../types/content'

export function useContent() {
  const [content, setContent] = useState<SiteContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/content')
      if (!res.ok) throw new Error('Failed to load content')
      setContent(await res.json())
      setError(null)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const save = useCallback(async (updated: SiteContent): Promise<boolean> => {
    setSaving(true)
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      if (res.ok) {
        setContent(updated)
        return true
      }
      return false
    } finally {
      setSaving(false)
    }
  }, [])

  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: form })
    if (!res.ok) return null
    const { url } = await res.json()
    return url
  }, [])

  return { content, loading, error, saving, save, uploadImage, reload: load }
}
