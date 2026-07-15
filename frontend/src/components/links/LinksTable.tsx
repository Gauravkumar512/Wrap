import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Copy, CheckCheck, BarChart2, Trash2, ExternalLink } from 'lucide-react'
import { LinkData } from '../../lib/api'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import { truncateUrl, formatRelativeTime, copyToClipboard } from '../../lib/utils'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface Props {
  links: LinkData[]
  loading: boolean
  onDelete: (slug: string) => Promise<void>
}

function SkeletonRow() {
  return (
    <tr>
      {[40, 64, 16, 20, 24].map((w, i) => (
        <td key={i} className="px-3 sm:px-5 py-3.5">
          <div
            className={`h-3.5 rounded-full animate-pulse w-${w}`}
            style={{ background: 'var(--border)', width: `${w * 4}px` }}
          />
        </td>
      ))}
    </tr>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handle() {
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handle}
      title="Copy short URL"
      className="p-1 rounded-md transition-colors duration-150 hover:bg-[var(--border-light)]"
      style={{ color: copied ? 'var(--accent)' : 'var(--text-muted)' }}
    >
      {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
    </button>
  )
}

export function LinksTable({ links, loading, onDelete }: Props) {
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  async function handleDeleteConfirm() {
    if (!deletingSlug) return
    setDeleteLoading(true)
    try {
      await onDelete(deletingSlug)
    } finally {
      setDeleteLoading(false)
      setDeletingSlug(null)
    }
  }

  return (
    <>
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                {['Short URL', 'Destination', 'Clicks', 'Created', ''].map((h, i) => (
                  <th
                    key={i}
                    className="px-3 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
              ) : links.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      No links yet. Create your first one!
                    </p>
                  </td>
                </tr>
              ) : (
                links.map(link => (
                  <tr
                    key={link.id}
                    className="transition-colors duration-100 hover:bg-[var(--bg-primary)]"
                    style={{ borderBottom: '1px solid var(--border-light)' }}
                  >
                    <td className="px-3 sm:px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="font-mono text-xs font-semibold"
                          style={{ color: 'var(--accent)' }}
                        >
                          /{link.slug}
                        </span>
                        <CopyButton text={`${API_URL}/${link.slug}`} />
                        <a
                          href={`${API_URL}/${link.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-md transition-colors duration-150 hover:bg-[var(--border-light)]"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </td>
                    <td className="px-3 sm:px-5 py-3.5 max-w-[180px] sm:max-w-[260px]">
                      <span className="text-xs truncate block" style={{ color: 'var(--text-secondary)' }}>
                        {truncateUrl(link.longUrl, 55)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-5 py-3.5">
                      <span
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: link.totalClicks > 0 ? 'var(--accent-light)' : 'var(--bg-primary)',
                          color: link.totalClicks > 0 ? 'var(--accent)' : 'var(--text-muted)',
                        }}
                      >
                        {link.totalClicks.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 sm:px-5 py-3.5">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {formatRelativeTime(link.createdAt)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/analytics/${link.slug}`}
                          title="View analytics"
                          className="p-1.5 rounded-lg transition-colors duration-150 hover:bg-[var(--border-light)]"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <BarChart2 size={14} />
                        </Link>
                        <button
                          onClick={() => setDeletingSlug(link.slug)}
                          title="Delete link"
                          className="p-1.5 rounded-lg transition-colors duration-150 hover:bg-[#FEF2F2]"
                          style={{ color: 'var(--text-muted)' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#DC2626')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deletingSlug && (
        <DeleteConfirmDialog
          slug={deletingSlug}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingSlug(null)}
          loading={deleteLoading}
        />
      )}
    </>
  )
}
