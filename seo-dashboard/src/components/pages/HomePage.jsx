import { Card } from '../ui/Card';
import { Search, Sparkles, FileText, TrendingUp, ArrowRight } from 'lucide-react';

const modules = [
  {
    id: 'search-visibility',
    icon: Search,
    label: 'Search Visibility',
    desc: 'Track keyword positions, analyze competitors, and manage link building campaigns.',
    color: '#e74c6f',
    bg: '#fdeef2',
    stats: [{ label: 'Keywords', value: '1,053' }, { label: 'Avg Position', value: '86.4' }, { label: 'Top 10', value: '39' }],
  },
  {
    id: 'ai-visibility',
    icon: Sparkles,
    label: 'AI Visibility',
    desc: 'Monitor how your brand appears across AI-powered search engines and chatbots.',
    color: '#d4a017',
    bg: '#fef9e4',
    stats: [{ label: 'AI Score', value: '14/100' }, { label: 'Mentions', value: '6' }, { label: 'Sentiment', value: 'Positive' }],
  },
  {
    id: 'content-engine',
    icon: FileText,
    label: 'Content Engine',
    desc: 'Discover trending topics, build content calendars, and track blog performance.',
    color: '#3b82f6',
    bg: '#dbeafe',
    stats: [{ label: 'Top Blogs', value: '47' }, { label: 'Traffic', value: '2.3K' }, { label: 'Trending', value: '4 topics' }],
  },
];

export default function HomePage({ onNavigate }) {
  return (
    <div style={{ padding: 32, maxWidth: 1100 }}>
      {/* Hero */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Your SEO Workspace</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 12, letterSpacing: '-0.5px' }}>
          Welcome back.<br />Here's what's happening.
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 500, lineHeight: 1.6 }}>
          Your domain <strong style={{ color: 'var(--accent)' }}>cognitute.org</strong> has 1,053 tracked keywords across India · Google. Visibility is slightly down this week — time to act.
        </p>
      </div>

      {/* Alert banner */}
      <div style={{ background: '#fff3cd', border: '1px solid #f59e0b44', borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <TrendingUp size={16} color="#d97706" />
        <span style={{ fontSize: 13, color: '#92400e', fontWeight: 500 }}>
          Visibility dropped 0.45% this week. 103 keywords lost positions — <button onClick={() => onNavigate('search-visibility/position-analysis')} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, textDecoration: 'underline', padding: 0 }}>view Position Analysis →</button>
        </span>
      </div>

      {/* Module cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 28 }}>
        {modules.map(m => (
          <div
            key={m.id}
            onClick={() => onNavigate(m.id)}
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px', cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s', position: 'relative', overflow: 'hidden' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: m.color }} />
            <div style={{ width: 40, height: 40, borderRadius: 10, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <m.icon size={18} color={m.color} />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{m.label}</div>
            <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>{m.desc}</p>
            <div style={{ display: 'flex', gap: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              {m.stats.map(s => (
                <div key={s.label} style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{s.value}</div>
                </div>
              ))}
            </div>
            <div style={{ position: 'absolute', bottom: 16, right: 16 }}>
              <ArrowRight size={14} color={m.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        <Card style={{ padding: '16px 20px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              ['Add keywords to track', 'search-visibility/keywords'],
              ['Run keyword research', 'search-visibility/keyword-research'],
              ['Schedule content', 'content-engine/search/calendar-builder'],
              ['Check AI mentions', 'ai-visibility/overview'],
            ].map(([label, path]) => (
              <button key={label} onClick={() => onNavigate(path)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-light)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-2)'}>
                {label}
                <ArrowRight size={12} color="var(--text-muted)" />
              </button>
            ))}
          </div>
        </Card>
        <Card style={{ padding: '16px 20px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Domain Setup</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>Your current tracked domains and health status</div>
          {[
            { domain: 'cognitute.org', health: 82, status: 'active' },
            { domain: 'chaithanya.com', health: 88, status: 'active' },
          ].map(d => (
            <div key={d.domain} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{d.domain}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 50, height: 4, background: 'var(--border)', borderRadius: 99 }}>
                  <div style={{ width: `${d.health}%`, height: '100%', borderRadius: 99, background: d.health >= 85 ? 'var(--green)' : 'var(--amber)' }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: d.health >= 85 ? 'var(--green)' : 'var(--amber)' }}>{d.health}%</span>
              </div>
            </div>
          ))}
          <button onClick={() => onNavigate('search-visibility/domain-setup')} style={{ marginTop: 12, width: '100%', fontSize: 12.5, fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-light)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '7px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Manage Domains
          </button>
        </Card>
      </div>
    </div>
  );
}
