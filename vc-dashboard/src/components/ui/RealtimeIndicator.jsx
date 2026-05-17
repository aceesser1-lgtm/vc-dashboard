import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function RealtimeIndicator() {
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    const handleConnect = () => setIsConnected(true)
    const handleDisconnect = () => setIsConnected(false)

    const channel = supabase.channel('connection-monitor')

    channel.on('*', () => {
      setIsConnected(true)
    }).subscribe()

    // Fallback: check connection every 5 seconds
    const interval = setInterval(() => {
      supabase.realtime.getChannels().then(() => {
        setIsConnected(true)
      }).catch(() => {
        setIsConnected(false)
      })
    }, 5000)

    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {isConnected ? 'Live' : 'Offline'}
      </span>
    </div>
  )
}
