import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for token in URL hash (from OAuth callback)
    const hash = window.location.hash
    if (hash.includes('provider_token=')) {
      const params = new URLSearchParams(hash.slice(1))
      const token = params.get('provider_token')
      if (token) {
        localStorage.setItem('provider_token', token)
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      const userData = session?.user ?? null
      setUser(userData)
      setSession(session)
      if (userData?.email) {
        console.log('User session email:', userData.email)
        localStorage.setItem('user_email', userData.email)
      } else if (userData) {
        console.log('No email found in user object:', userData)
      }
      // Try to get provider_token from session (some versions of Supabase include it)
      if (session?.provider_token) {
        localStorage.setItem('provider_token', session.provider_token)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const userData = session?.user ?? null
      setUser(userData)
      setSession(session)
      if (userData?.email) {
        console.log('Auth state change email:', userData.email)
        localStorage.setItem('user_email', userData.email)
      }
      if (session?.provider_token) {
        localStorage.setItem('provider_token', session.provider_token)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })

  const signInWithEmail = (email, password) => {
    localStorage.setItem('user_email', email)
    return supabase.auth.signInWithPassword({ email, password })
  }

  const signUpWithEmail = (email, password) => {
    localStorage.setItem('user_email', email)
    return supabase.auth.signUp({ email, password })
  }

  const signOut = () => {
    localStorage.removeItem('provider_token')
    localStorage.removeItem('user_email')
    return supabase.auth.signOut()
  }

  const providerToken = session?.provider_token || localStorage.getItem('provider_token')

  return { user, loading, providerToken, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }
}
