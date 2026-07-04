import { useEffect, useState, useRef } from 'react';

/* ─────────────── Animated counter hook ─────────────── */
function useCountUp(target: number, duration: number, trigger: boolean) {
  const [value, setValue] = useState(0);
  
  useEffect(() => {
    if (!trigger) return;
    
    let start = 0;
    const step = Math.max(1, Math.floor(target / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { 
        setValue(target); 
        clearInterval(timer); 
      } else {
        setValue(start);
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [target, duration, trigger]);
  
  return value;
}

/* ─────────────── Animated Number Component ─────────────── */
function AnimatedNumber({ target, duration, visible, hasSeenOnce, suffix = '' }: { target: number, duration: number, visible: boolean, hasSeenOnce: boolean, suffix?: string }) {
  const value = useCountUp(target, duration, visible);
  return <>{hasSeenOnce ? target.toLocaleString() : value.toLocaleString()}{suffix}</>;
}

/* ─────────────── Data ─────────────── */
const links = [
  { slug: 'gh-react', url: 'github.com/facebook/react', clicks: 1200 },
  { slug: 'blog-post', url: 'example.com/new-blog-post', clicks: 850 },
  { slug: 'special-offer', url: 'example.com/landing-page', clicks: 520 },
  { slug: 'dev-docs', url: 'docs.example.com/api/v2', clicks: 277 },
];

const countries = [
  { name: 'India', clicks: 2106, pct: 74 },
  { name: 'United States', clicks: 483, pct: 17 },
  { name: 'Germany', clicks: 258, pct: 9 },
];

const devices = [
  { name: 'Desktop', pct: 58 },
  { name: 'Mobile', pct: 34 },
  { name: 'Tablet', pct: 8 },
];

const clickTimeline = [35, 42, 28, 55, 70, 62, 48, 80, 65, 45, 72, 58];

const maxClicks = 1200;

/* ─────────────── Sidebar ─────────────── */
function Sidebar({ activeTab }: { activeTab: 'links' | 'analytics' | null }) {
  return (
    <div
      style={{
        width: '160px',
        flexShrink: 0,
        borderRight: '1px solid #EAEAEA',
        paddingRight: '20px',
        paddingTop: '4px',
      }}
    >
      <div style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '-0.03em', color: '#0A0A0A', marginBottom: '28px' }}>
        Wrap
      </div>
      {[
        { label: 'Links', key: 'links' as const },
        { label: 'Analytics', key: 'analytics' as const },
      ].map(({ label, key }) => (
        <div
          key={key}
          style={{
            fontSize: '13px',
            fontWeight: activeTab === key ? 600 : 400,
            color: activeTab === key ? '#0A0A0A' : '#9A9A9A',
            background: activeTab === key ? '#F5F5F5' : 'transparent',
            borderRadius: '6px',
            padding: '7px 10px',
            marginBottom: '2px',
            transition: 'all 0.25s ease',
          }}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

/* ─────────────── Links View ─────────────── */
function LinksView({ visible, hasSeenOnce }: { visible: boolean; hasSeenOnce: boolean }) {
  const totalLinks = useCountUp(12, 800, visible);
  const totalClicks = useCountUp(2847, 1200, visible);
  const showFinal = hasSeenOnce;

  return (
    <div style={{ flex: 1, paddingLeft: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em' }}>
            Your Links
          </div>
          <div style={{ fontSize: '12px', color: '#9A9A9A', marginTop: '2px' }}>
            {showFinal ? 12 : totalLinks} links total
          </div>
        </div>
        <div
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#FFFFFF',
            background: '#0A0A0A',
            padding: '7px 14px',
            borderRadius: '8px',
          }}
        >
          + Create short link
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'Total Links', value: showFinal ? '12' : totalLinks.toString(), delay: 0 },
          { label: 'Total Clicks', value: showFinal ? '2,847' : totalClicks.toLocaleString(), delay: 0.1 },
          { label: 'Top Link', value: '/gh-react', delay: 0.2 },
          { label: 'This Month', value: '3', delay: 0.3 },
        ].map(({ label, value, delay }) => (
          <div
            key={label}
            style={{
              border: '1px solid #EAEAEA',
              borderRadius: '10px',
              padding: '12px 14px',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(8px)',
              transition: `all 0.5s ease ${delay}s`,
            }}
          >
            <div style={{ fontSize: '10px', color: '#9A9A9A', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              {label}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ border: '1px solid #EAEAEA', borderRadius: '10px', overflow: 'hidden' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '140px 1fr 70px 80px',
            padding: '10px 14px',
            borderBottom: '1px solid #EAEAEA',
            background: '#FAFAFA',
          }}
        >
          {['Short Link', 'Destination', 'Clicks', ''].map(h => (
            <div key={h} style={{ fontSize: '10px', fontWeight: 600, color: '#9A9A9A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {h}
            </div>
          ))}
        </div>
        {links.map(({ slug, url, clicks }, i) => (
          <div
            key={slug}
            style={{
              display: 'grid',
              gridTemplateColumns: '140px 1fr 70px 80px',
              padding: '11px 14px',
              borderBottom: i < links.length - 1 ? '1px solid #F3F3F3' : 'none',
              alignItems: 'center',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(-12px)',
              transition: `all 0.4s ease ${0.3 + i * 0.12}s`,
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#0A0A0A', fontFamily: 'monospace' }}>/{slug}</div>
            <div style={{ fontSize: '12px', color: '#9A9A9A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#0A0A0A', fontVariantNumeric: 'tabular-nums' }}>
              <AnimatedNumber target={clicks} duration={1200} visible={visible} hasSeenOnce={hasSeenOnce} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1, height: '4px', background: '#F3F3F3', borderRadius: '2px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: '#0A0A0A',
                    borderRadius: '2px',
                    width: visible ? `${(clicks / maxClicks) * 100}%` : '0%',
                    transition: `width 1s ease ${0.5 + i * 0.15}s`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────── Analytics View ─────────────── */
function AnalyticsView({ visible, hasSeenOnce }: { visible: boolean; hasSeenOnce: boolean }) {
  const totalClicks = useCountUp(2847, 1000, visible);
  const activeLinks = useCountUp(8, 600, visible);
  const showFinal = hasSeenOnce;

  return (
    <div style={{ flex: 1, paddingLeft: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em' }}>
          Analytics
        </div>
        <div style={{ fontSize: '12px', color: '#9A9A9A', marginTop: '2px' }}>
          Performance overview across all your links
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'Total Clicks', value: showFinal ? '2,847' : totalClicks.toLocaleString(), delay: 0 },
          { label: 'Active Links', value: showFinal ? '8' : activeLinks.toString(), delay: 0.1 },
          { label: 'Avg. CTR', value: '12.4%', delay: 0.2 },
        ].map(({ label, value, delay }) => (
          <div
            key={label}
            style={{
              border: '1px solid #EAEAEA',
              borderRadius: '10px',
              padding: '12px 14px',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(8px)',
              transition: `all 0.5s ease ${delay}s`,
            }}
          >
            <div style={{ fontSize: '10px', color: '#9A9A9A', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              {label}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Two-column layout: Countries + Devices */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        {/* Top Countries */}
        <div style={{ border: '1px solid #EAEAEA', borderRadius: '10px', padding: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#9A9A9A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
            Top Countries
          </div>
          {countries.map(({ name, clicks, pct }, i) => (
            <div
              key={name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: i < countries.length - 1 ? '10px' : 0,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : 'translateX(-8px)',
                transition: `all 0.4s ease ${0.3 + i * 0.1}s`,
              }}
            >
              <span style={{ fontSize: '12px', color: '#6B6B6B', width: '80px', flexShrink: 0 }}>{name}</span>
              <div style={{ flex: 1, height: '6px', background: '#F3F3F3', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: '#0A0A0A',
                    borderRadius: '3px',
                    width: visible ? `${pct}%` : '0%',
                    transition: `width 1s ease ${0.5 + i * 0.15}s`,
                  }}
                />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#0A0A0A', width: '36px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                <AnimatedNumber target={clicks} duration={1000} visible={visible} hasSeenOnce={hasSeenOnce} />
              </span>
            </div>
          ))}
        </div>

        {/* Device Breakdown */}
        <div style={{ border: '1px solid #EAEAEA', borderRadius: '10px', padding: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#9A9A9A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
            Devices
          </div>
          {devices.map(({ name, pct }, i) => (
            <div
              key={name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: i < devices.length - 1 ? '10px' : 0,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : 'translateX(-8px)',
                transition: `all 0.4s ease ${0.35 + i * 0.1}s`,
              }}
            >
              <span style={{ fontSize: '12px', color: '#6B6B6B', width: '60px', flexShrink: 0 }}>{name}</span>
              <div style={{ flex: 1, height: '6px', background: '#F3F3F3', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: i === 0 ? '#0A0A0A' : i === 1 ? '#6B6B6B' : '#BFBFBF',
                    borderRadius: '3px',
                    width: visible ? `${pct}%` : '0%',
                    transition: `width 1s ease ${0.6 + i * 0.15}s`,
                  }}
                />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#0A0A0A', width: '32px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                <AnimatedNumber target={pct} duration={1000} visible={visible} hasSeenOnce={hasSeenOnce} suffix="%" />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Click Timeline (mini bar chart) */}
      <div style={{ border: '1px solid #EAEAEA', borderRadius: '10px', padding: '14px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#9A9A9A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
          Clicks — Last 12 days
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '60px' }}>
          {clickTimeline.map((val, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                background: '#0A0A0A',
                borderRadius: '2px 2px 0 0',
                height: visible ? `${(val / 80) * 100}%` : '0%',
                transition: `height 0.8s ease ${0.4 + i * 0.06}s`,
                opacity: visible ? (i === clickTimeline.length - 1 ? 1 : 0.3 + (i / clickTimeline.length) * 0.7) : 0,
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
          <span style={{ fontSize: '9px', color: '#9A9A9A' }}>12d ago</span>
          <span style={{ fontSize: '9px', color: '#9A9A9A' }}>Today</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Main Component ─────────────── */
export function DashboardDemo() {
  const [visible, setVisible] = useState(false);
  const [screen, setScreen] = useState<'links' | 'analytics' | null>(null);
  const [seenLinks, setSeenLinks] = useState(false);
  const [seenAnalytics, setSeenAnalytics] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 140, y: 250 });
  const [cursorOpacity, setCursorOpacity] = useState(0);
  const [cursorScale, setCursorScale] = useState(1);
  const hasRunCursor = useRef(false);

  /* Mark screen as seen once it becomes visible */
  useEffect(() => {
    if (!visible || !screen) return;
    const timer = setTimeout(() => {
      if (screen === 'links') setSeenLinks(true);
      else if (screen === 'analytics') setSeenAnalytics(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [visible, screen]);

  /* Intersection observer — start animation when scrolled into view */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) setVisible(true);
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible]);

  /* One-time fake cursor animation */
  useEffect(() => {
    if (!visible || hasRunCursor.current) return;
    hasRunCursor.current = true;

    let abort = false;
    const runAnimation = async () => {
      // Start slightly delayed
      await new Promise(r => setTimeout(r, 600));
      if (abort) return;
      
      // Cursor appears
      setCursorPos({ x: 140, y: 250 });
      setCursorOpacity(1);
      
      await new Promise(r => setTimeout(r, 50));
      if (abort) { setCursorOpacity(0); return; }
      
      // 1. Move to Links tab
      setCursorPos({ x: 75, y: 85 });
      
      await new Promise(r => setTimeout(r, 800));
      if (abort) { setCursorOpacity(0); return; }
      
      // Click Links down
      setCursorScale(0.85);
      await new Promise(r => setTimeout(r, 150));
      if (abort) { setCursorOpacity(0); return; }
      
      // Click Links up
      setCursorScale(1);
      if (!abort) setScreen('links');
      
      // Wait for Links view to render and numbers to count up
      await new Promise(r => setTimeout(r, 3500));
      if (abort) return;
      
      // 2. Move to Analytics tab
      setCursorPos({ x: 75, y: 120 });
      
      await new Promise(r => setTimeout(r, 800));
      if (abort) { setCursorOpacity(0); return; }
      
      // Click Analytics down
      setCursorScale(0.85);
      await new Promise(r => setTimeout(r, 150));
      if (abort) { setCursorOpacity(0); return; }
      
      // Click Analytics up & trigger switch
      setCursorScale(1);
      if (!abort) setScreen('analytics');
      
      // Wait for Analytics numbers to count up
      await new Promise(r => setTimeout(r, 3500));
      if (abort) return;
      
      // Move away and fade out
      setCursorPos({ x: 160, y: 180 });
      setCursorOpacity(0);
    };

    runAnimation();
    return () => { abort = true; };
  }, [visible]);

  return (
    <div
      ref={ref}
      style={{
        background: '#FFFFFF',
        fontFamily: "'Inter', sans-serif",
        padding: '24px 28px',
        minHeight: '380px',
        display: 'flex',
        gap: '0',
        overflow: 'hidden',
        pointerEvents: 'none',
        userSelect: 'none',
        position: 'relative',
      }}
    >
      {/* Animated fake cursor */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 50,
          opacity: cursorOpacity,
          transform: `translate(${cursorPos.x}px, ${cursorPos.y}px) scale(${cursorScale})`,
          transition: cursorOpacity > 0 ? 'transform 0.8s cubic-bezier(0.2, 0, 0.2, 1), opacity 0.3s ease' : 'none',
        }}
      >
        <path d="M5.5 3.21V20.8C5.5 21.45 6.27 21.79 6.75 21.36L11.44 17.15H17.5C18.05 17.15 18.5 16.7 18.5 16.15V15.77C18.5 15.53 18.42 15.3 18.27 15.11L5.5 3.21Z" fill="#0A0A0A" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
      <Sidebar activeTab={screen} />

      <div
        style={{
          flex: 1,
          opacity: visible && screen !== null ? 1 : 0,
          transform: visible && screen !== null ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        {screen === 'links' ? (
          <LinksView visible={visible} hasSeenOnce={seenLinks} />
        ) : screen === 'analytics' ? (
          <AnalyticsView visible={visible} hasSeenOnce={seenAnalytics} />
        ) : null}
      </div>
    </div>
  );
}

