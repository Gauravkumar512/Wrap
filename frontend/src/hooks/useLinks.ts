import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { getLinks, shortenUrl, deleteLink, LinkData, ShortenResponse } from '../lib/api'

export function useLinks() {
  const { getToken } = useAuth()
  const [links, setLinks] = useState<LinkData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getLinks(getToken)
      setLinks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch links')
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  const createLink = useCallback(
    async (longUrl: string): Promise<ShortenResponse> => {
      const result = await shortenUrl(longUrl, getToken)
      await fetchLinks()
      return result
    },
    [getToken, fetchLinks],
  )

  const removeLink = useCallback(
    async (slug: string) => {
      await deleteLink(slug, getToken)
      setLinks(prev => prev.filter(l => l.slug !== slug))
    },
    [getToken],
  )

  return { links, loading, error, createLink, removeLink }
}
