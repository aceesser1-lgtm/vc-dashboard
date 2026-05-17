import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useRealtime(table, filter = null) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      let query = supabase.from(table).select('*')
      if (filter) query = query.eq(filter.column, filter.value)
      const { data, error } = await query
      if (!error) setData(data)
      setLoading(false)
    }

    fetchData()

    const channel = supabase
      .channel(`${table}-changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, payload => {
        if (payload.eventType === 'INSERT') {
          setData(prev => [...prev, payload.new])
        } else if (payload.eventType === 'UPDATE') {
          setData(prev => prev.map(row => row.id === payload.new.id ? payload.new : row))
        } else if (payload.eventType === 'DELETE') {
          setData(prev => prev.filter(row => row.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, filter])

  return { data, loading }
}
