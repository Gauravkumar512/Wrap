import { SignedIn, SignedOut, SignInButton, useAuth } from '@clerk/clerk-react';
import { ArrowRight, Github, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { ScaledDashboardDemo } from '../components/landing/ScaledDashboardDemo';
import { Reveal } from '../components/common/Reveal';

const steps = [
  {
    num: '01',
    title: 'Redis Cache-Aside',
    description: 'Instant ~7ms redirects powered by a Redis cache-aside architecture. Database misses heal automatically.',
  },
  {
    num: '02',
    title: 'Async BullMQ Workers',
    description: 'We never block the redirect. Analytics are pushed to a Redis queue and processed asynchronously by worker nodes.',
  },
  {
    num: '03',
    title: 'PostgreSQL Aggregations',
    description: 'Deep analytics powered by PostgreSQL composite indexes for instant, real-time country and device aggregations.',
  },
];

const freeTier = {
  name: 'Free',
  price: '$0',
  period: 'forever',
  description: 'Everything you need to get started.',
  features: [
    '25 links per month',
    '30-day analytics retention',
    'Click tracking by country & device',
    'Instant short link generation',
    'Dashboard with live stats',
  ],
  cta: 'Get started free',
  highlighted: false,
};

const proTier = {
  name: 'Pro',
  price: '$9',
  period: '/mo',
  description: 'For teams and power users.',
  badge: 'Coming soon',
  features: [
    'Unlimited links',
    'Lifetime analytics retention',
    'Custom domains',
    'Advanced analytics & exports',
    'API access',
    'Priority support',
  ],
  cta: 'Join waitlist',
  highlighted: true,
};

export default function Landing() {
  const { isLoaded } = useAuth();
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FFFFFF' }}>
      <Navbar />
      <Reveal>
      <section
        className="flex flex-col items-center text-center px-4 sm:px-6 md:px-8 pt-28 sm:pt-36 md:pt-[180px] pb-12 md:pb-20"
      >
        <h1
          style={{
            fontSize: 'clamp(2.25rem, 5.5vw, 4rem)',
            fontWeight: 800,
            letterSpacing: '-0.035em',
            lineHeight: 1.08,
            color: '#0A0A0A',
            maxWidth: '720px',
          }}
        >
          Every link, shortened
          <br />
          and tracked.
        </h1>

        <p
          className="mt-6"
          style={{
            fontSize: '1.125rem',
            lineHeight: 1.6,
            color: '#6B6B6B',
            maxWidth: '480px',
          }}
        >
          Paste a URL. Get a clean short link. Watch every click roll in with country, device, and referrer data.
        </p>

        <div className="flex items-center gap-4 mt-10 flex-wrap justify-center" style={{ minHeight: '52px' }}>
          {!isLoaded ? (
            <>
              <span className="animate-pulse" style={{ width: 168, height: 52, borderRadius: 999, background: '#F0F0F0' }} />
              <span className="animate-pulse" style={{ width: 168, height: 52, borderRadius: 999, background: '#F0F0F0' }} />
            </>
          ) : (
            <>
              <SignedOut>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <button
                    className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-150"
                    style={{ background: '#0A0A0A', color: '#FFFFFF' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#333333')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#0A0A0A')}
                  >
                    Get started free
                    <ArrowRight size={15} />
                  </button>
                </SignInButton>
                <a
                  href="#product"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-150"
                  style={{
                    background: '#FFFFFF',
                    color: '#0A0A0A',
                    border: '1px solid #EAEAEA',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#0A0A0A')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#EAEAEA')}
                >
                  See how it works
                </a>
              </SignedOut>
              <SignedIn>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-150"
                  style={{ background: '#0A0A0A', color: '#FFFFFF' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#333333')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#0A0A0A')}
                >
                  Go to Dashboard
                  <ArrowRight size={15} />
                </Link>
              </SignedIn>
            </>
          )}
        </div>
        

        <div
          className="w-full max-w-5xl mx-auto text-left mt-10 md:mt-20"
          style={{
            border: '1px solid #EAEAEA',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)',
            background: '#FFFFFF',
          }}
        >
          <div
            className="flex items-center gap-2 px-3 sm:px-4 py-3"
            style={{
              background: '#FAFAFA',
              borderBottom: '1px solid #EAEAEA',
            }}
          >
            <div className="flex gap-1.5 flex-shrink-0">
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#E5E5E5' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#E5E5E5' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#E5E5E5' }} />
            </div>
            <div
              className="flex-1 min-w-0 mx-2 sm:mx-4 text-center text-xs font-mono truncate"
              style={{
                color: '#9A9A9A',
                background: '#FFFFFF',
                border: '1px solid #EAEAEA',
                borderRadius: '6px',
                padding: '4px 12px',
              }}
            >
              app.wrap.to/dashboard
            </div>
          </div>

          {/*
            DashboardDemo has fixed-pixel internals (160px sidebar, 140/70/80px
            table columns) that squash unreadably below ~600px. ScaledDashboardDemo
            measures the actual available width and scales the whole 640px design
            down to fill it exactly, instead of guessing a fixed scale factor.
          */}
          <ScaledDashboardDemo />
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section
        id="about"
        style={{
          borderTop: '1px solid #EAEAEA',
          borderBottom: '1px solid #EAEAEA',
        }}
      >
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center pt-16 md:pt-[100px] pb-16 md:pb-[100px]"
        >
          <p
            style={{
              fontSize: '1.125rem',
              lineHeight: 1.8,
              color: '#6B6B6B',
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            Most URL shorteners are slow, brittle, and block the redirect to save analytics. Wrap is built differently. We process every click asynchronously via a Redis cache-aside architecture and BullMQ workers, ensuring sub-10ms redirects while capturing rich, real-time analytics.
          </p>

          <div className="mt-14 mb-14">
            <p
              style={{
                fontSize: 'clamp(2rem, 7vw, 4.5rem)',
                fontWeight: 800,
                letterSpacing: '-0.035em',
                lineHeight: 1.1,
                color: '#0A0A0A',
              }}
            >
              ~7ms redirect latency.
            </p>
            <p
              className="mt-2"
              style={{
                fontSize: 'clamp(1.75rem, 5.5vw, 3.5rem)',
                fontWeight: 800,
                letterSpacing: '-0.035em',
                lineHeight: 1.1,
                color: '#9A9A9A',
              }}
            >
              Zero blocking.
            </p>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto"
            style={{ fontSize: '0.875rem' }}
          >
            <div className="text-left">
              <p style={{ color: '#9A9A9A', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Before
              </p>
              <p
                className="font-mono truncate"
                style={{
                  color: '#9A9A9A',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #EAEAEA',
                  background: '#FAFAFA',
                }}
              >
                https://github.com/facebook/react/releases/tag/v19.0.0
              </p>
            </div>
            <div className="text-left">
              <p style={{ color: '#0A0A0A', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
                After
              </p>
              <p
                className="font-mono"
                style={{
                  color: '#0A0A0A',
                  fontWeight: 600,
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #0A0A0A',
                  background: '#FFFFFF',
                }}
              >
                wrap.to/gh-react
              </p>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section
        id="product"
        className="pt-16 md:pt-[100px] pb-16 md:pb-[100px]"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="mb-16 text-center">
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: '#0A0A0A',
              }}
            >
              Production-grade infrastructure
            </h2>
            <p className="mt-3" style={{ fontSize: '1rem', color: '#6B6B6B' }}>
              Built from the ground up for speed, scale, and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
            <div
              className="hidden md:block absolute h-px"
              style={{
                background: '#EAEAEA',
                top: '28px',
                left: 'calc(16.66% + 24px)',
                right: 'calc(16.66% + 24px)',
              }}
            />

            {steps.map(({ num, title, description }) => (
              <div
                key={num}
                className="flex flex-col items-center text-center px-4 sm:px-6 relative"
                style={{ paddingTop: '0', paddingBottom: '0' }}
              >
                <span
                  style={{
                    fontSize: '3rem',
                    fontWeight: 200,
                    letterSpacing: '-0.02em',
                    color: '#EAEAEA',
                    lineHeight: 1,
                    marginBottom: '20px',
                    position: 'relative',
                    zIndex: 1,
                    background: '#FFFFFF',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                  }}
                >
                  {num}
                </span>

                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#0A0A0A',
                    marginBottom: '8px',
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: '0.875rem',
                    lineHeight: 1.7,
                    color: '#6B6B6B',
                    maxWidth: '240px',
                  }}
                >
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section
        id="pricing"
        className="pt-16 md:pt-[100px] pb-16 md:pb-[100px]"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-14">
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: '#0A0A0A',
              }}
            >
              Simple, honest pricing
            </h2>
            <p className="mt-3" style={{ fontSize: '1rem', color: '#6B6B6B' }}>
              Start free. Upgrade when you're ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div
              className="p-6 md:p-8"
              style={{
                border: '1px solid #EAEAEA',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#0A0A0A',
                  marginBottom: '4px',
                }}
              >
                {freeTier.name}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6B6B6B', marginBottom: '24px' }}>
                {freeTier.description}
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0A0A0A' }}>
                  {freeTier.price}
                </span>
                <span style={{ fontSize: '0.875rem', color: '#9A9A9A' }}>
                  {freeTier.period}
                </span>
              </div>
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {freeTier.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5" style={{ fontSize: '0.875rem', color: '#6B6B6B' }}>
                    <Check size={16} style={{ color: '#0A0A0A', flexShrink: 0, marginTop: '2px' }} />
                    {f}
                  </li>
                ))}
              </ul>
              {!isLoaded ? (
                <span className="w-full animate-pulse block" style={{ height: '44px', borderRadius: 999, background: '#F0F0F0' }} />
              ) : (
                <>
                  <SignedOut>
                    <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                      <button
                        className="w-full py-3 rounded-full text-sm font-semibold transition-all duration-150"
                        style={{
                          background: '#FFFFFF',
                          color: '#0A0A0A',
                          border: '1px solid #EAEAEA',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = '#0A0A0A')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = '#EAEAEA')}
                      >
                        {freeTier.cta}
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <Link
                      to="/dashboard"
                      className="w-full py-3 rounded-full text-sm font-semibold text-center transition-all duration-150 block"
                      style={{
                        background: '#FFFFFF',
                        color: '#0A0A0A',
                        border: '1px solid #EAEAEA',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = '#0A0A0A')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = '#EAEAEA')}
                    >
                      Go to Dashboard
                    </Link>
                  </SignedIn>
                </>
              )}
            </div>

            {/* Pro tier */}
            <div
              className="p-6 md:p-8"
              style={{
                border: '2px solid #0A0A0A',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {/* Badge */}
              <div
                className="flex items-center gap-2 sm:gap-3 mb-4 flex-wrap"
              >
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: '#FFFFFF',
                    background: '#0A0A0A',
                    padding: '3px 10px',
                    borderRadius: '999px',
                  }}
                >
                  Most popular
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: '#9A9A9A',
                    background: '#F5F5F5',
                    padding: '3px 10px',
                    borderRadius: '999px',
                  }}
                >
                  {proTier.badge}
                </span>
              </div>

              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#0A0A0A',
                  marginBottom: '4px',
                }}
              >
                {proTier.name}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6B6B6B', marginBottom: '24px' }}>
                {proTier.description}
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0A0A0A' }}>
                  {proTier.price}
                </span>
                <span style={{ fontSize: '0.875rem', color: '#9A9A9A' }}>
                  {proTier.period}
                </span>
              </div>
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {proTier.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5" style={{ fontSize: '0.875rem', color: '#6B6B6B' }}>
                    <Check size={16} style={{ color: '#0A0A0A', flexShrink: 0, marginTop: '2px' }} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className="w-full py-3 rounded-full text-sm font-semibold transition-all duration-150"
                style={{
                  background: '#0A0A0A',
                  color: '#FFFFFF',
                  border: 'none',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#333333')}
                onMouseLeave={e => (e.currentTarget.style.background = '#0A0A0A')}
              >
                {proTier.cta}
              </button>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section
        style={{
          background: '#0A0A0A',
          paddingTop: '0',
          paddingBottom: '0',
        }}
      >

        {/* Footer */}
        <footer
          className="pt-10 sm:pt-12 pb-8 sm:pb-10"
          style={{
            borderTop: '1px solid #1A1A1A',
          }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-12">
              {/* Brand */}
              <div className="col-span-2">
                <span
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    color: '#FFFFFF',
                  }}
                >
                  Wrap.
                </span>
                <p
                  className="mt-3"
                  style={{ fontSize: '0.875rem', color: '#6B6B6B', maxWidth: '240px', lineHeight: 1.6 }}
                >
                  Shorten links and track every click with real-time analytics.
                </p>
              </div>

              {/* Product */}
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6B6B', marginBottom: '12px' }}>
                  Product
                </p>
                <ul className="flex flex-col gap-2">
                  {['Features', 'Pricing', 'Analytics', 'API'].map(item => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm transition-colors duration-150"
                        style={{ color: '#9A9A9A' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#9A9A9A')}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6B6B', marginBottom: '12px' }}>
                  Company
                </p>
                <ul className="flex flex-col gap-2">
                  {['About', 'Blog', 'Careers', 'Contact'].map(item => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm transition-colors duration-150"
                        style={{ color: '#9A9A9A' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#9A9A9A')}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6B6B', marginBottom: '12px' }}>
                  Legal
                </p>
                <ul className="flex flex-col gap-2">
                  {['Privacy', 'Terms', 'Security'].map(item => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm transition-colors duration-150"
                        style={{ color: '#9A9A9A' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#9A9A9A')}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div
              className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
              style={{ borderTop: '1px solid #1A1A1A' }}
            >
              <p style={{ fontSize: '0.8rem', color: '#6B6B6B' }}>
                © {new Date().getFullYear()} Wrap. All rights reserved.
              </p>
              <a
                href="https://github.com/Gauravkumar512/Wrap"
                target="_blank"
                rel="noopener noreferrer"
                title="View source on GitHub"
                className="transition-colors duration-150"
                style={{ color: '#6B6B6B' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6B6B6B')}
              >
                <Github size={18} />
              </a>
            </div>
          </div>
        </footer>
      </section>
      </Reveal>
    </div>
  );
}
