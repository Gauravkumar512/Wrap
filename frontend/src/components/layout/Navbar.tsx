import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { isLoaded } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 transition-all duration-200"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #EAEAEA' : '1px solid transparent',
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-8 py-4">
        <Link to="/" className="flex-shrink-0">
          <span
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#0A0A0A',
            }}
          >
            Wrap.
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'Product', href: '#product' },
            { label: 'Pricing', href: '#pricing' },
            { label: 'About', href: '#about' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm transition-colors duration-150"
              style={{ color: '#6B6B6B', fontWeight: 500 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#0A0A0A')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6B6B6B')}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3" style={{ minWidth: '128px', minHeight: '36px' }}>
          {!isLoaded ? (
            <>
              <span
                className="animate-pulse"
                style={{ width: 46, height: 16, borderRadius: 4, background: '#EFEFEF' }}
              />
              <span
                className="animate-pulse"
                style={{ width: 96, height: 36, borderRadius: 999, background: '#EFEFEF' }}
              />
            </>
          ) : (
            <>
              <SignedIn>
                <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    className="text-sm font-medium transition-colors duration-150"
                    style={{ color: '#6B6B6B', background: 'none', border: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#0A0A0A')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6B6B6B')}
                  >
                    Sign in
                  </button>
                </SignInButton>
                <SignInButton mode="modal">
                  <button
                    className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-150"
                    style={{
                      background: '#0A0A0A',
                      color: '#FFFFFF',
                      border: 'none',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#333333')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#0A0A0A')}
                  >
                    Get Started
                  </button>
                </SignInButton>
              </SignedOut>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
