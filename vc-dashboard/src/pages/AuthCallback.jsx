import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          throw new Error('No session found')
        }

        // Check if this is a Google OAuth user
        if (session.user?.app_metadata?.provider === 'google') {
          // Try to get provider_token from Supabase
          if (session.provider_token) {
            localStorage.setItem('provider_token', session.provider_token)
          } else {
            // If provider_token not available, we'll use mock emails as fallback
            console.warn('provider_token not available from Supabase')
          }
        }

        // Redirect to dashboard
        navigate('/dashboard', { replace: true })
      } catch (err) {
        console.error('Auth callback error:', err)
        setError(err.message)
        setTimeout(() => navigate('/login', { replace: true }), 2000)
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {error ? (
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Completing sign in...</p>
        </div>
      )}
    </div>
  )
}
