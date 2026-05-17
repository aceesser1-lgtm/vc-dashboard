import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useGoogleAuth } from '../hooks/useGoogleAuth'

export default function GoogleCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { handleCallback } = useGoogleAuth()
  const [error, setError] = useState(null)

  useEffect(() => {
    const code = searchParams.get('code')
    const errorParam = searchParams.get('error')

    if (errorParam) {
      setError(`Authorization failed: ${errorParam}`)
      setTimeout(() => navigate('/dashboard', { replace: true }), 2000)
      return
    }

    if (!code) {
      setError('No authorization code received')
      setTimeout(() => navigate('/dashboard', { replace: true }), 2000)
      return
    }

    const exchange = async () => {
      try {
        await handleCallback(code)
        navigate('/dashboard?tab=email', { replace: true })
      } catch (err) {
        setError(err.message || 'Failed to complete sign in')
        setTimeout(() => navigate('/dashboard', { replace: true }), 2000)
      }
    }

    exchange()
  }, [searchParams, navigate, handleCallback])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {error ? (
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Connecting to Gmail...</p>
        </div>
      )}
    </div>
  )
}
