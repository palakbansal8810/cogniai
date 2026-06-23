import { useState } from 'react';
import { Card, CardHeader, Badge, Table } from '../ui/Card';
import { SparkLine } from '../ui/MiniChart';
import { topKeywords, visibilityData } from '../../data/mockData';
import { Search, Plus, Filter, Download } from 'lucide-react';

export default function KeywordsPage() {
  const [search, setSearch] = useState('');
  const filtered = topKeywords.filter(k => k.keyword.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Keywords', value: '1,053', badge: null },
          { label: 'Top 3', value: '8', badge: { text: '+4 new', variant: 'success' } },
          { label: 'Top 10', value: '39', badge: { text: '+22 new', variant: 'success' } },
          { label: 'Top 100', value: '300', badge: { text: '−12 lost', variant: 'danger' } },
        ].map(s => (
          <Card key={s.label} style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500 }}>{s.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800 }}>{s.value}</span>
              {s.badge && <Badge variant={s.badge.variant}>{s.badge.text}</Badge>}
            </div>
          </Card>
        ))}
      </div>

      {/* Keywords table */}
      <Card>
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', gap: 12 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700 }}>All Keywords</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1, maxWidth: 400 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '6px 12px' }}>
              <Search size={13} color="var(--text-muted)" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search keywords..."
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, fontFamily: 'var(--font-body)', flex: 1 }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, color: '#fff', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '6px 14px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              <Plus size={13} /> Add Keywords
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 500, color: 'var(--text-secondary)', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              <Download size={12} />
            </button>
          </div>
        </div>
        <Table
          headers={['Keyword', 'Intent', 'Position', '7d Change', 'Volume', 'Difficulty', 'Trend']}
          rows={filtered.map(k => {
            const intents = ['Informational', 'Commercial', 'Navigational', 'Transactional'];
            const intent = intents[Math.floor(Math.random() * intents.length)];
            const intentColors = { Informational: 'info', Commercial: 'accent', Navigational: 'default', Transactional: 'success' };
            const diff = Math.floor(Math.random() * 80) + 10;
            return [
              <span key="kw" style={{ fontWeight: 500 }}>{k.keyword}</span>,
              <Badge key="intent" variant={intentColors[intent]}>{intent}</Badge>,
              <span key="pos" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{k.position}</span>,
              <span key="chg" style={{ color: k.change > 0 ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>
                {k.change > 0 ? '▲' : '▼'} {Math.abs(k.change)}
              </span>,
              k.volume.toLocaleString(),
              <div key="diff" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 40, height: 4, background: 'var(--border)', borderRadius: 99 }}>
                  <div style={{ height: '100%', borderRadius: 99, width: `${diff}%`, background: diff > 70 ? 'var(--red)' : diff > 40 ? 'var(--amber)' : 'var(--green)' }} />
                </div>
                <span style={{ fontSize: 12 }}>{diff}</span>
              </div>,
              <div key="trend" style={{ width: 70, display: 'inline-block' }}>
                <SparkLine data={visibilityData} color={k.change > 0 ? 'var(--green)' : 'var(--red)'} height={28} />
              </div>,
            ];
          })}
        />
      </Card>
    </div>
  );
}
