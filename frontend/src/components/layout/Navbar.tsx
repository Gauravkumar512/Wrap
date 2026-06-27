import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { ArrowRight } from 'lucide-react'

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-8 py-5">
      <Link to="/">
        <span
          className="text-2xl leading-none"
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}
        >
          Wrap.
        </span>
      </Link>

      <nav className="flex items-center gap-3">
        <SignedIn>
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors duration-150"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Dashboard
            <ArrowRight size={14} />
          </Link>
          <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <button
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150"
              style={{
                background: 'var(--text-primary)',
                color: 'var(--bg-primary)',
              }}
              onMouseEnter={e =>
                (e.currentTarget.style.background = 'var(--text-secondary)')
              }
              onMouseLeave={e =>
                (e.currentTarget.style.background = 'var(--text-primary)')
              }
            >
              Sign in
            </button>
          </SignInButton>
        </SignedOut>
      </nav>
    </header>
  )
}
