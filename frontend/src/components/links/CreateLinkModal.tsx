import { useState, useEffect, useRef } from 'react'
import { X, Link2, Copy, CheckCheck, ExternalLink } from 'lucide-react'
import { ShortenResponse } from '../../lib/api'
import { copyToClipboard } from '../../lib/utils'

interface Props {
  onClose: () => void
  onCreate: (url: string) => Promise<ShortenResponse>
}

export function CreateLinkModal({ onClose, onCreate }: Props) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ShortenResponse | null>(null)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    try {
      setLoading(true)
      setError(null)
      const res = await onCreate(url.trim())
      setResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!result) return
    const ok = await copyToClipboard(result.shortUrl)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(17,24,39,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl animate-scale-in"
        style={{
          background: 'var(--bg-card)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div
          className="flex items-center justify-between px-4 sm:px-6 py-5"
          style={{ borderBottom: '1px solid var(--border-light)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--accent-light)' }}
            >
              <Link2 size={14} style={{ color: 'var(--accent)' }} />
            </div>
            <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Create short link
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-150 hover:bg-[var(--border-light)]"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={15} />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-5">
          {!result ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-medium uppercase tracking-wide"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Destination URL
                </label>
                <input
                  ref={inputRef}
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://example.com/very-long-url"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all duration-150"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1.5px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
              </div>

              {error && (
                <p className="text-xs px-3 py-2 rounded-lg" style={{ background: '#FEF2F2', color: '#DC2626' }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: loading || !url.trim() ? 'var(--text-muted)' : 'var(--accent)',
                  color: '#fff',
                }}
                onMouseEnter={e => {
                  if (!loading && url.trim())
                    e.currentTarget.style.background = 'var(--accent-hover)'
                }}
                onMouseLeave={e => {
                  if (!loading && url.trim())
                    e.currentTarget.style.background = 'var(--accent)'
                }}
              >
                {loading ? 'Shortening…' : 'Shorten URL'}
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-4 animate-fade-in">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                  Your short link
                </p>
                <div
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
                  style={{ background: 'var(--accent-light)', border: '1.5px solid var(--accent)' }}
                >
                  <span className="flex-1 text-sm font-semibold truncate" style={{ color: 'var(--accent)' }}>
                    {result.shortUrl}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg transition-colors duration-150"
                    style={{
                      background: copied ? 'var(--accent)' : 'transparent',
                      color: copied ? '#fff' : 'var(--accent)',
                    }}
                  >
                    {copied ? (
                      <><CheckCheck size={13} /> Copied</>
                    ) : (
                      <><Copy size={13} /> Copy</>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                → {result.shortUrl.replace(window.location.origin, '').replace(':3000', '')}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2 rounded-xl text-sm font-medium transition-colors duration-150"
                  style={{
                    background: 'var(--bg-primary)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  Done
                </button>
                <a
                  href={result.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                >
                  <ExternalLink size={13} />
                  Test
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
