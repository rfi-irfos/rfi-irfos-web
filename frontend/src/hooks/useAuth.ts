import { useState, useEffect } from 'react'

export interface User {
  email: string
  name: string
  picture: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = () => { window.location.href = '/auth/google' }

  const logout = async () => {
    await fetch('/auth/logout', { method: 'POST' })
    setUser(null)
    window.location.href = '/'
  }

  return { user, loading, login, logout }
}
