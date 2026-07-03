import { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useUser, useClerk } from '@clerk/clerk-react'
import { LayoutDashboard, BarChart2, User, LogOut, ChevronUp } from 'lucide-react'

export function Sidebar() {
  const { user } = useUser()
  const { signOut, openUserProfile } = useClerk()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[220px] flex flex-col z-20 select-none"
      style={{
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
      }}
    >
      <div
        className="px-6 py-5 flex items-center"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <span
          className="text-2xl leading-none"
          style={{
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
          }}
        >
          Wrap.
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
              isActive ? '' : 'hover:bg-[var(--border-light)]'
            }`
          }
          style={({ isActive }) => ({
            background: isActive ? 'var(--accent-light)' : undefined,
            color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
          })}
        >
          <LayoutDashboard size={15} strokeWidth={2} />
          Dashboard
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
              isActive ? '' : 'hover:bg-[var(--border-light)]'
            }`
          }
          style={({ isActive }) => ({
            background: isActive ? 'var(--accent-light)' : undefined,
            color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
          })}
        >
          <BarChart2 size={15} strokeWidth={2} />
          Analytics
        </NavLink>
      </nav>

      <div ref={profileRef} style={{ borderTop: '1px solid var(--border)', position: 'relative' }}>
        {profileOpen && (
          <div
            className="absolute bottom-full left-2 right-2 mb-1 rounded-lg overflow-hidden shadow-lg"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          >
            <button
              onClick={() => { openUserProfile(); setProfileOpen(false) }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--border-light)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              <User size={14} />
              Account
            </button>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--border-light)]"
              style={{ color: '#ef4444' }}
            >
              <LogOut size={14} />
              Log out
            </button>
          </div>
        )}

        <button
          onClick={() => setProfileOpen(prev => !prev)}
          className="w-full px-4 py-4 flex items-center gap-3 transition-colors hover:bg-[var(--border-light)]"
        >
          <div
            className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
            style={{ background: 'var(--accent)' }}
          >
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-xs font-semibold">
                {(user?.fullName || user?.username || 'U').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          {user && (
            <div className="flex flex-col min-w-0 flex-1 text-left">
              <span
                className="text-xs font-semibold truncate leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                {user.fullName || user.username || 'User'}
              </span>
              <span
                className="text-xs truncate leading-tight"
                style={{ color: 'var(--text-muted)' }}
              >
                {user.primaryEmailAddress?.emailAddress}
              </span>
            </div>
          )}
          <ChevronUp
            size={14}
            className={`flex-shrink-0 transition-transform ${profileOpen ? '' : 'rotate-180'}`}
            style={{ color: 'var(--text-muted)' }}
          />
        </button>
      </div>
    </aside>
  )
}
