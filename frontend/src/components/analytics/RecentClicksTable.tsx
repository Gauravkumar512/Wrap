import { formatDateTime } from '../../lib/utils'

interface Click {
  clickedAt: string
  country: string | null
  userAgent: string | null
  referrer: string | null
  ipAddress: string | null
}

interface Props {
  clicks: Click[]
}

function parseDevice(ua: string | null) {
  if (!ua) return '—'
  const u = ua.toLowerCase()
  if (u.includes('mobile') || u.includes('android') || u.includes('iphone')) return 'Mobile'
  if (u.includes('tablet') || u.includes('ipad')) return 'Tablet'
  if (u.includes('windows')) return 'Windows'
  if (u.includes('mac')) return 'macOS'
  if (u.includes('linux')) return 'Linux'
  return 'Desktop'
}

function parseReferrer(ref: string | null) {
  if (!ref) return 'Direct'
  try {
    const url = new URL(ref)
    return url.hostname.replace('www.', '')
  } catch {
    return ref.slice(0, 20)
  }
}

export function RecentClicksTable({ clicks }: Props) {
  if (clicks.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No clicks recorded yet.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
            {['Time', 'Country', 'Device', 'Referrer', 'IP Address'].map(h => (
              <th
                key={h}
                className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                style={{ color: 'var(--text-muted)' }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {clicks.map((click, i) => (
            <tr
              key={i}
              className="transition-colors duration-100 hover:bg-[var(--bg-primary)]"
              style={{ borderBottom: '1px solid var(--border-light)' }}
            >
              <td className="px-5 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                {formatDateTime(click.clickedAt)}
              </td>
              <td className="px-5 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                {click.country || '—'}
              </td>
              <td className="px-5 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                {parseDevice(click.userAgent)}
              </td>
              <td className="px-5 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                {parseReferrer(click.referrer)}
              </td>
              <td className="px-5 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                {click.ipAddress || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
