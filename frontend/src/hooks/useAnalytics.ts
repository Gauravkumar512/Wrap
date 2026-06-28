import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { getAnalytics, AnalyticsData } from '../lib/api'

export function useAnalytics(slug: string) {
  const { getToken } = useAuth()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetch() {
      try {
        setLoading(true)
        setError(null)
        const result = await getAnalytics(slug, getToken)
        if (mounted) setData(result)
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : 'Failed to fetch analytics')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetch()
    return () => { mounted = false }
  }, [slug, getToken])

  return { data, loading, error }
}
