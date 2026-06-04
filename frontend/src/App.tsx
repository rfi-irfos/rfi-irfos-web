import './App.css'
import { useContent } from './hooks/useContent'
import { useAuth } from './hooks/useAuth'
import { PublicSite } from './components/PublicSite'
import { AdminPanel } from './components/AdminPanel'
import { LoginPage } from './components/LoginPage'

const isAdmin = window.location.pathname.startsWith('/admin')

export default function App() {
  const { content, loading: contentLoading, saving, save, uploadImage } = useContent()
  const { user, loading: authLoading, login, logout } = useAuth()

  if (contentLoading || authLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    )
  }

  if (!content) {
    return <div className="error-screen">Failed to load site content.</div>
  }

  // Admin route: requires login
  if (isAdmin) {
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

  // Public site
  return <PublicSite content={content} />
}
