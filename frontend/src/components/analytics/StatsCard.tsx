import { LucideIcon } from 'lucide-react'

interface Props {
  label: string
  value: string | number
  icon: LucideIcon
  accent?: boolean
  sub?: string
}

export function StatsCard({ label, value, icon: Icon, accent, sub }: Props) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: accent ? 'var(--accent)' : 'var(--bg-card)',
        border: accent ? 'none' : '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="flex items-start justify-between">
        <p
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: accent ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}
        >
          {label}
        </p>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            background: accent ? 'rgba(255,255,255,0.15)' : 'var(--accent-light)',
          }}
        >
          <Icon
            size={14}
            style={{ color: accent ? '#fff' : 'var(--accent)' }}
            strokeWidth={2}
          />
        </div>
      </div>
      <div>
        <p
          className="text-2xl font-bold leading-none"
          style={{ color: accent ? '#fff' : 'var(--text-primary)' }}
        >
          {value}
        </p>
        {sub && (
          <p
            className="text-xs mt-1.5 truncate"
            style={{ color: accent ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)' }}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  )
}
