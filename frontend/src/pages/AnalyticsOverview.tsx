import { Link } from 'react-router-dom'
import { MousePointerClick, Link2, TrendingUp, BarChart2, ArrowRight } from 'lucide-react'
import { Sidebar } from '../components/layout/Sidebar'
import { StatsCard } from '../components/analytics/StatsCard'
import { useLinks } from '../hooks/useLinks'
import { truncateUrl } from '../lib/utils'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function ClickBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div
        className="h-2 rounded-full flex-1 overflow-hidden"
        style={{ background: 'var(--border-light)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: 'var(--accent)' }}
        />
      </div>
      <span
        className="text-xs font-semibold tabular-nums w-10 text-right"
        style={{ color: 'var(--text-primary)' }}
      >
        {value.toLocaleString()}
      </span>
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3.5" style={{ borderBottom: '1px solid var(--border-light)' }}>
      <div className="h-3 w-16 rounded-full animate-pulse" style={{ background: 'var(--border)' }} />
      <div className="h-3 w-48 rounded-full animate-pulse flex-1" style={{ background: 'var(--border)' }} />
      <div className="h-3 w-24 rounded-full animate-pulse" style={{ background: 'var(--border)' }} />
    </div>
  )
}

export default function AnalyticsOverview() {
  const { links, loading, error } = useLinks()

  const totalClicks = links.reduce((sum, l) => sum + l.totalClicks, 0)
  const activeLinks = links.filter(l => l.totalClicks > 0).length
  const maxClicks = links.length > 0 ? Math.max(...links.map(l => l.totalClicks)) : 0
  const sorted = [...links].sort((a, b) => b.totalClicks - a.totalClicks)

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />

      <main className="flex-1 pl-[220px]">
        <div className="max-w-4xl mx-auto px-8 py-8 flex flex-col gap-8">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Analytics
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Performance overview across all your links
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatsCard
              label="Total Clicks"
              value={loading ? '—' : totalClicks.toLocaleString()}
              icon={MousePointerClick}
              accent
            />
            <StatsCard
              label="Total Links"
              value={loading ? '—' : links.length}
              icon={Link2}
            />
            <StatsCard
              label="Links with Clicks"
              value={loading ? '—' : activeLinks}
              sub={links.length > 0 ? `${Math.round((activeLinks / links.length) * 100) || 0}% of total` : undefined}
              icon={TrendingUp}
            />
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

          {/* Top Links */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid var(--border-light)' }}
            >
              <div className="flex items-center gap-2">
                <BarChart2 size={15} style={{ color: 'var(--accent)' }} />
                <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Links by Clicks
                </h2>
              </div>
              {!loading && links.length > 0 && (
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {links.length} link{links.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="px-6 py-2">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
              ) : sorted.length === 0 ? (
                <div className="py-14 text-center">
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    No links yet.{' '}
                    <Link
                      to="/dashboard"
                      className="underline"
                      style={{ color: 'var(--accent)' }}
                    >
                      Create your first one
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                sorted.map((link, i) => (
                  <div
                    key={link.id}
                    className="flex items-center gap-4 py-3.5"
                    style={{
                      borderBottom: i < sorted.length - 1 ? '1px solid var(--border-light)' : 'none',
                    }}
                  >
                    {/* Rank */}
                    <span
                      className="text-xs font-bold tabular-nums w-5 text-right flex-shrink-0"
                      style={{ color: i < 3 ? 'var(--accent)' : 'var(--text-muted)' }}
                    >
                      {i + 1}
                    </span>

                    {/* Slug + URL */}
                    <div className="flex flex-col min-w-0 w-[180px] flex-shrink-0">
                      <span
                        className="font-mono text-xs font-semibold truncate"
                        style={{ color: 'var(--accent)' }}
                      >
                        /{link.slug}
                      </span>
                      <span
                        className="text-xs truncate mt-0.5"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {truncateUrl(link.longUrl, 30)}
                      </span>
                    </div>

                    {/* Bar */}
                    <ClickBar value={link.totalClicks} max={maxClicks} />

                    {/* Detail link */}
                    <Link
                      to={`/analytics/${link.slug}`}
                      title="View detailed analytics"
                      className="flex-shrink-0 flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors duration-150 hover:bg-[var(--border-light)]"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Empty CTA */}
          {!loading && links.length > 0 && totalClicks === 0 && (
            <div
              className="rounded-2xl px-6 py-8 text-center"
              style={{
                background: 'var(--accent-light)',
                border: '1px solid var(--accent-border)',
              }}
            >
              <p className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                Share your short links to start seeing click data here.
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Every visit to{' '}
                <span className="font-mono">
                  {API_URL}/{sorted[0]?.slug}
                </span>{' '}
                is tracked automatically.
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
