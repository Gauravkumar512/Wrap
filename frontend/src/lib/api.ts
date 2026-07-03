const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export type TokenGetter = () => Promise<string | null>

export interface LinkData {
  id: number
  slug: string
  longUrl: string
  createdAt: string
  totalClicks: number
  expiresAt: string
}

export interface ShortenResponse {
  message: string
  shortUrl: string
  slug: string
}

export interface AnalyticsData {
  slug: string
  longUrl: string
  totalClicks: number
  clicksByCountry: { country: string | null; count: number }[]
  clicksByDevice: { device: string | null; count: number }[]
  recentClicks: {
    clickedAt: string
    country: string | null
    userAgent: string | null
    referrer: string | null
    ipAddress: string | null
  }[]
}

async function authFetch(path: string, getToken: TokenGetter, options: RequestInit = {}) {
  const token = await getToken()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })
}

export async function getLinks(getToken: TokenGetter): Promise<LinkData[]> {
  const res = await authFetch('/links', getToken)
  if (!res.ok) throw new Error('Failed to fetch links')
  const data = await res.json()
  return data.links
}

export async function shortenUrl(longUrl: string, getToken: TokenGetter): Promise<ShortenResponse> {
  const res = await authFetch('/shorten', getToken, {
    method: 'POST',
    body: JSON.stringify({ longUrl }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message || 'Failed to shorten URL')
  }
  return res.json()
}

export async function getAnalytics(slug: string, getToken: TokenGetter): Promise<AnalyticsData> {
  const res = await authFetch(`/analytics/${slug}`, getToken)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message || 'Failed to fetch analytics')
  }
  return res.json()
}

export async function deleteLink(slug: string, getToken: TokenGetter): Promise<void> {
  const res = await authFetch(`/urls/${slug}`, getToken, { method: 'DELETE' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message || 'Failed to delete link')
  }
}
