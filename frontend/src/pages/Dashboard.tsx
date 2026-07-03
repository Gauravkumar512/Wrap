import { useState } from 'react'
import { Link2, MousePointerClick, TrendingUp, Calendar, Plus } from 'lucide-react'
import { Sidebar } from '../components/layout/Sidebar'
import { LinksTable } from '../components/links/LinksTable'
import { CreateLinkModal } from '../components/links/CreateLinkModal'
import { StatsCard } from '../components/analytics/StatsCard'
import { useLinks } from '../hooks/useLinks'


function startOfMonth() {
  const d = new Date()
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

export default function Dashboard() {
  const { links, loading, error, createLink, removeLink } = useLinks()
  const [showModal, setShowModal] = useState(false)

  const totalClicks = links.reduce((sum, l) => sum + l.totalClicks, 0)
  const topLink = links.reduce<typeof links[number] | null>(
    (max, l) => (!max || l.totalClicks > max.totalClicks ? l : max),
    null,
  )
  const thisMonth = links.filter(l => new Date(l.createdAt) >= startOfMonth()).length

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />

      <main className="flex-1 pl-[220px]">
        <div className="max-w-6xl mx-auto px-8 py-8 flex flex-col gap-8">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Your Links
              </h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {loading
                  ? 'Loading…'
                  : `${links.length} link${links.length !== 1 ? 's' : ''} total`}
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150"
              style={{ background: 'var(--accent)', color: '#fff' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
            >
              <Plus size={15} />
              Create short link
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              label="Total Links"
              value={loading ? '—' : links.length}
              icon={Link2}
              accent
            />
            <StatsCard
              label="Total Clicks"
              value={loading ? '—' : totalClicks.toLocaleString()}
              icon={MousePointerClick}
            />
            <StatsCard
              label="Top Link"
              value={loading ? '—' : topLink ? `/${topLink.slug}` : '—'}
              sub={topLink ? `${topLink.totalClicks.toLocaleString()} clicks` : undefined}
              icon={TrendingUp}
            />
            <StatsCard
              label="This Month"
              value={loading ? '—' : thisMonth}
              sub={loading ? undefined : `link${thisMonth !== 1 ? 's' : ''} created`}
              icon={Calendar}
            />
          </div>

          {error && (
            <div
              className="px-4 py-3 rounded-xl text-sm"
              style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
            >
              {error}
            </div>
          )}

          <LinksTable links={links} loading={loading} onDelete={removeLink} />

        </div>
      </main>

      {showModal && (
        <CreateLinkModal
          onClose={() => setShowModal(false)}
          onCreate={async url => {
            const res = await createLink(url)
            return res
          }}
        />
      )}
    </div>
  )
}
