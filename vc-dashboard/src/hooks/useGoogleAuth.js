import { useState, useEffect } from 'react'

export function useGoogleAuth() {
  const [token, setToken] = useState(() => {
    // Try to get Google token from either location
    return localStorage.getItem('google_access_token') || localStorage.getItem('provider_token')
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Load token from localStorage on mount - check both locations
    const googleToken = localStorage.getItem('google_access_token')
    const providerToken = localStorage.getItem('provider_token')
    const storedToken = googleToken || providerToken
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  const signIn = async () => {
    setLoading(true)
    setError(null)

    try {
      // Open Google OAuth consent screen
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
      if (!clientId) {
        throw new Error('Google Client ID not configured')
      }

      const redirectUri = `${window.location.origin}/auth/google-callback`
      const scope = 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/calendar'
      const responseType = 'code'

      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
      authUrl.searchParams.append('client_id', clientId)
      authUrl.searchParams.append('redirect_uri', redirectUri)
      authUrl.searchParams.append('response_type', responseType)
      authUrl.searchParams.append('scope', scope)
      authUrl.searchParams.append('access_type', 'offline')

      window.location.href = authUrl.toString()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleCallback = async (code) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/exchange-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) {
        throw new Error('Failed to exchange token')
      }

      const data = await response.json()
      // Store under both keys for compatibility
      localStorage.setItem('google_access_token', data.access_token)
      localStorage.setItem('provider_token', data.access_token)
      setToken(data.access_token)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signOut = () => {
    localStorage.removeItem('google_access_token')
    setToken(null)
  }

  return { token, loading, error, signIn, handleCallback, signOut }
}
