import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { ArrowRight, BarChart2, FolderOpen, Github, Globe, Link2, MousePointerClick, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';

const features = [
  {
    icon: Zap,
    title: 'Instant Short Links',
    description: 'Paste a URL, get a 6-character slug in milliseconds. Redis caching keeps every redirect under 10ms.',
  },
  {
    icon: BarChart2,
    title: 'Deep Click Analytics',
    description: 'Every click tracked — country, device type, referrer, and exact timestamp. No sampling.',
  },
  {
    icon: FolderOpen,
    title: 'Your Links, Organised',
    description: 'All your shortened URLs in one dashboard with live click counts, expiry dates, and one-click delete.',
  },
];

const steps = [
  {
    num: '01',
    title: 'Paste any URL',
    description: 'Drop in a long link — blog post, product page, doc, or anything else.',
  },
  {
    num: '02',
    title: 'Share your short link',
    description: 'Get a clean slug in seconds. Copy and share anywhere.',
  },
  {
    num: '03',
    title: 'Watch analytics roll in',
    description: 'Every click appears in your dashboard with country, device, and referrer data.',
  },
];

const benefits = [
  { icon: Zap, label: 'Sub-10ms redirects' },
  { icon: BarChart2, label: 'Real-time analytics' },
  { icon: Shield, label: 'Auth-protected links' },
  { icon: Globe, label: 'Global click tracking' },
];

function HeroVisual() {
  return (
    <div className="relative flex flex-col items-end gap-4 select-none">
      {/* Link card */}
      <div
        className="rounded-2xl p-5 w-[300px]"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          transform: 'rotate(1.5deg)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent-light)' }}
          >
            <Link2 size={13} style={{ color: 'var(--accent)' }} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Short Link
          </span>
        </div>
        <p className="font-mono text-sm font-bold mb-0.5" style={{ color: 'var(--accent)' }}>
          wrap.to/gh-react
        </p>
        <p className="text-xs mb-4 truncate" style={{ color: 'var(--text-muted)' }}>
          github.com/facebook/react/releases/tag/v19
        </p>
        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border-light)' }}>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
          >
            <MousePointerClick size={11} className="inline mr-1" />
            2,847 clicks
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            30d expiry
          </span>
        </div>
      </div>

      {/* Analytics mini card */}
      <div
        className="rounded-2xl p-4 w-[260px]"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          transform: 'rotate(-1deg)',
        }}
      >
        <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>
          TOP COUNTRIES
        </p>
        {[
          { country: 'India', pct: 74, count: '2,106' },
          { country: 'United States', pct: 17, count: '483' },
          { country: 'Germany', pct: 9, count: '258' },
        ].map(({ country, pct, count }) => (
          <div key={country} className="flex items-center gap-2 mb-2">
            <span className="text-xs w-[90px] truncate" style={{ color: 'var(--text-secondary)' }}>
              {country}
            </span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-light)' }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
            </div>
            <span className="text-xs tabular-nums w-10 text-right" style={{ color: 'var(--text-muted)' }}>
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CtaButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-150"
      style={{ background: 'var(--accent)', color: '#fff', boxShadow: '0 4px 14px rgba(194,65,12,0.35)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--accent-hover)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(194,65,12,0.45)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--accent)';
        e.currentTarget.style.boxShadow = '0 4px 14px rgba(194,65,12,0.35)';
      }}
    >
      {children}
    </button>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <Navbar />

      {/* ─── Hero ─── */}
      <section className="flex items-center pt-28 pb-20 px-8 max-w-6xl mx-auto w-full gap-16">
        <div className="flex-1 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium w-fit"
              style={{
                background: 'var(--accent-light)',
                color: 'var(--accent)',
                border: '1px solid var(--accent-border)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent)' }} />
              URL shortener with analytics
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Shorten links,{' '}
              <span
                className="block"
                style={{
                  fontStyle: 'italic',
                  fontFamily: '"Playfair Display", Georgia, serif',
                  color: 'var(--accent)',
                }}
              >
                track everything.
              </span>
            </h1>
          </div>

          <p className="text-lg leading-relaxed max-w-md" style={{ color: 'var(--text-secondary)' }}>
            Paste a URL. Get a short link. Watch every click roll in — by country, device, and referrer.
          </p>

          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <CtaButton>
                  Get started free <ArrowRight size={15} />
                </CtaButton>
              </SignInButton>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                No credit card required
              </span>
            </SignedOut>
            <SignedIn>
              <Link to="/dashboard">
                <CtaButton>
                  Go to Dashboard <ArrowRight size={15} />
                </CtaButton>
              </Link>
            </SignedIn>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center flex-shrink-0">
          <HeroVisual />
        </div>
      </section>

      {/* ─── Benefits strip ─── */}
      <section style={{ borderTop: '1px solid #EDE8DC', borderBottom: '1px solid #EDE8DC', background: '#FEFDF5' }}>
        <div className="max-w-6xl mx-auto px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {benefits.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--accent-light)' }}
              >
                <Icon size={13} style={{ color: 'var(--accent)' }} />
              </div>
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              Everything you need, nothing you don't
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Built around three core ideas — speed, insight, and simplicity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl p-6 flex flex-col gap-4 transition-shadow duration-200 hover:shadow-md"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--accent-light)' }}
                >
                  <Icon size={18} style={{ color: 'var(--accent)' }} strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section
        className="py-20 px-8"
        style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              How it works
            </h2>
            <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
              Three steps from long URL to live analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop only) */}
            <div
              className="hidden md:block absolute top-6 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px"
              style={{ background: 'var(--border)' }}
            />

            {steps.map(({ num, title, description }) => (
              <div key={num} className="flex flex-col items-center text-center gap-4 relative">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold z-10"
                  style={{ background: 'var(--accent)', color: '#fff', boxShadow: '0 4px 12px rgba(194,65,12,0.3)' }}
                >
                  {num}
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="py-24 px-8" style={{ background: '#FFFCF4' }}>
        <div
          className="max-w-2xl mx-auto rounded-3xl p-12 text-center flex flex-col items-center gap-6"
          style={{
            background: '#C2410C',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <h2 className="text-3xl font-bold leading-tight" style={{ color: '#FFFFFF' }}>
            Ready to shorten your first link?
          </h2>
          <p style={{ color: '#FED7AA', fontSize: '1rem' }}>Free forever. No setup, no credit card, no nonsense.</p>
          <SignedOut>
            <SignInButton mode="modal">
              <button
                className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-150"
                style={{ background: '#FFFCF4', color: '#C2410C', boxShadow: '0 4px 14px rgba(194,65,12,0.3)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent)')}
              >
                Get started free <ArrowRight size={15} />
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold"
              style={{ background: '#FFFCF4', color: '#C2410C', boxShadow: '0 4px 14px rgba(194,65,12,0.3)' }}
            >
              Go to Dashboard <ArrowRight size={15} />
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-8 px-8" style={{ borderTop: '1px solid #EDE8DC', background: '#F6F0E9' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo → GitHub */}
          <a
            href="https://github.com/Gauravkumar512/Wrap"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group"
          >
            <span
              className="text-xl transition-colors duration-150 group-hover:opacity-75"
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              Wrap.
            </span>
          </a>

          {/* Centre: stack */}
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>Node.js</span>
            <span>·</span>
            <span>Express</span>
            <span>·</span>
            <span>PostgreSQL</span>
            <span>·</span>
            <span>Redis</span>
            <span>·</span>
            <span>React</span>
          </div>

          {/* Right: GitHub icon link */}
          <a
            href="https://github.com/Gauravkumar512/Wrap"
            target="_blank"
            rel="noopener noreferrer"
            title="View source on GitHub"
            className="transition-colors duration-150"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <Github size={18} />
          </a>
        </div>
      </footer>
    </div>
  );
}
