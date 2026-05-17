import { useAuth } from './hooks/useAuth'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import GoogleCallback from './pages/GoogleCallback'

export default function App() {
  const { user, loading } = useAuth()

  // Handle Google OAuth callback
  if (window.location.pathname === '/auth/google-callback') {
    return <GoogleCallback />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return user ? <Dashboard /> : <Login />
}
