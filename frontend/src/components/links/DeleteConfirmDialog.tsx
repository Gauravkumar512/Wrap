import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  slug: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export function DeleteConfirmDialog({ slug, onConfirm, onCancel, loading }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(17,24,39,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onCancel()}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-5 animate-scale-in"
        style={{
          background: 'var(--bg-card)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div className="flex items-start gap-3.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#FEF2F2' }}
          >
            <AlertTriangle size={16} color="#DC2626" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Delete link?
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <span className="font-mono font-medium" style={{ color: 'var(--text-primary)' }}>
                /{slug}
              </span>{' '}
              and all its analytics will be permanently deleted.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2 rounded-xl text-sm font-medium transition-colors duration-150"
            style={{
              background: 'var(--bg-primary)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 rounded-xl text-sm font-semibold transition-colors duration-150 disabled:opacity-60"
            style={{ background: '#DC2626', color: '#fff' }}
          >
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
