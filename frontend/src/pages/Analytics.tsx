import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  MousePointerClick,
  Globe,
  Monitor,
  Clock,
  Copy,
  CheckCheck,
  ExternalLink,
} from 'lucide-react'
import { Sidebar } from '../components/layout/Sidebar'
import { StatsCard } from '../components/analytics/StatsCard'
import { DeviceChart } from '../components/analytics/DeviceChart'
import { CountryChart } from '../components/analytics/CountryChart'
import { RecentClicksTable } from '../components/analytics/RecentClicksTable'
import { useAnalytics } from '../hooks/useAnalytics'
import { copyToClipboard, truncateUrl } from '../lib/utils'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <div className="h-3 w-20 rounded-full animate-pulse" style={{ background: 'var(--border)' }} />
      <div className="h-7 w-16 rounded-lg animate-pulse" style={{ background: 'var(--border)' }} />
    </div>
  )
}

export default function Analytics() {
  const { slug } = useParams<{ slug: string }>()
  const { data, loading, error } = useAnalytics(slug ?? '')
  const [copied, setCopied] = useState(false)

  const shortUrl = `${API_URL}/${slug}`

  async function handleCopy() {
    const ok = await copyToClipboard(shortUrl)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const topCountry = data?.clicksByCountry[0]
  const topDevice = data?.clicksByDevice.reduce<typeof data.clicksByDevice[number] | null>(
    (max, d) => (!max || d.count > max.count ? d : max),
    null,
  )

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />

      <main className="flex-1 md:pl-[220px] pt-14 md:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 flex flex-col gap-6 md:gap-8">

          {/* Back */}
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium w-fit transition-colors duration-150"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </Link>

          {/* Header */}
          <div
            className="rounded-2xl p-4 sm:p-6 flex flex-col gap-3"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="font-mono text-xl font-bold truncate"
                    style={{ color: 'var(--accent)' }}
                  >
                    /{slug}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex-shrink-0 flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors duration-150"
                    style={{
                      background: copied ? 'var(--accent-light)' : 'var(--bg-primary)',
                      color: copied ? 'var(--accent)' : 'var(--text-muted)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {copied ? <><CheckCheck size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                  </button>
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 p-1.5 rounded-lg transition-colors duration-150"
                    style={{ color: 'var(--text-muted)', background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
                {loading ? (
                  <div className="h-3 w-64 rounded-full animate-pulse" style={{ background: 'var(--border)' }} />
                ) : (
                  <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                    {data ? truncateUrl(data.longUrl, 80) : '—'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="px-4 py-3 rounded-xl text-sm"
              style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
            >
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              <>
                <StatsCard
                  label="Total Clicks"
                  value={data ? data.totalClicks.toLocaleString() : '0'}
                  icon={MousePointerClick}
                  accent
                />
                <StatsCard
                  label="Countries"
                  value={data ? data.clicksByCountry.length : '0'}
                  icon={Globe}
                  sub={topCountry ? `Top: ${topCountry.country ?? 'Unknown'}` : undefined}
                />
                <StatsCard
                  label="Top Device"
                  value={topDevice ? (topDevice.device ?? 'Unknown').slice(0, 10) : '—'}
                  icon={Monitor}
                  sub={topDevice ? `${topDevice.count} clicks` : undefined}
                />
                <StatsCard
                  label="Recent Clicks"
                  value={data ? data.recentClicks.length : '0'}
                  icon={Clock}
                  sub="last 10 recorded"
                />
              </>
            )}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              className="rounded-2xl p-4 sm:p-6 flex flex-col gap-4"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Device Breakdown
              </h2>
              {loading ? (
                <div className="h-[220px] flex items-center justify-center">
                  <div
                    className="w-5 h-5 rounded-full border-2 animate-spin"
                    style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }}
                  />
                </div>
              ) : (
                <DeviceChart data={data?.clicksByDevice ?? []} />
              )}
            </div>

            <div
              className="rounded-2xl p-4 sm:p-6 flex flex-col gap-4"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Top Countries
              </h2>
              {loading ? (
                <div className="h-[220px] flex items-center justify-center">
                  <div
                    className="w-5 h-5 rounded-full border-2 animate-spin"
                    style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }}
                  />
                </div>
              ) : (
                <CountryChart data={data?.clicksByCountry ?? []} />
              )}
            </div>
          </div>

          {/* Recent Clicks */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              className="px-4 sm:px-6 py-4"
              style={{ borderBottom: '1px solid var(--border-light)' }}
            >
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Recent Clicks
              </h2>
            </div>
            {loading ? (
              <div className="py-12 flex items-center justify-center">
                <div
                  className="w-5 h-5 rounded-full border-2 animate-spin"
                  style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }}
                />
              </div>
            ) : (
              <RecentClicksTable clicks={data?.recentClicks ?? []} />
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
