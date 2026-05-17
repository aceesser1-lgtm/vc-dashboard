import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import GoogleCallback from './pages/GoogleCallback'
import AuthCallback from './pages/AuthCallback'

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function ProtectedRoute({ children, isAuthenticated, isLoading }) {
  if (isLoading) return <LoadingScreen />
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  const { user, loading } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        {/* OAuth Callbacks - no auth required */}
        <Route path="/auth/google-callback" element={<GoogleCallback />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Login - redirect to dashboard if already logged in */}
        <Route
          path="/login"
          element={loading ? <LoadingScreen /> : user ? <Navigate to="/dashboard" replace /> : <Login />}
        />

        {/* Dashboard - protected route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={!!user} isLoading={loading}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Root path - redirect based on auth status */}
        <Route
          path="/"
          element={loading ? <LoadingScreen /> : user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />

        {/* Catch-all - redirect to login or dashboard */}
        <Route
          path="*"
          element={loading ? <LoadingScreen /> : user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}
