import { useState, useEffect } from 'react'
import './App.css'
import { useContent } from './hooks/useContent'
import { useAuth } from './hooks/useAuth'
import { useLang } from './hooks/useLang'
import { PublicSite } from './components/PublicSite'
import { AdminPanel } from './components/AdminPanel'
import { LoginPage } from './components/LoginPage'

function isAdminHash(hash: string) {
  return hash === '#admin' || hash.startsWith('#admin/')
}

export default function App() {
  const { lang } = useLang()
  const { content, loading, saving, save, uploadImage } = useContent(lang)
  const { user, login, logout } = useAuth()
  const [admin, setAdmin] = useState(() => isAdminHash(window.location.hash))

  useEffect(() => {
    const onHash = () => setAdmin(isAdminHash(window.location.hash))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    )
  }

  if (!content) {
    return <div className="error-screen">Content could not be loaded.</div>
  }

  if (admin) {
    if (!user) return <LoginPage onLogin={login} />
    return (
      <AdminPanel
        content={content}
        user={user}
        saving={saving}
        onSave={save}
        onUpload={uploadImage}
        onLogout={logout}
      />
    )
  }

  return <PublicSite content={content} />
}
