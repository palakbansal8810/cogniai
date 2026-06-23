import { Card, CardHeader, MetricCard, Badge, Table } from '../ui/Card';
import { SparkLine, BarChartComp } from '../ui/MiniChart';
import { visibilityData, trafficData, positionData, topKeywords, summaryAlerts, competitorData, rankingsDistribution } from '../../data/mockData';
import { TrendingUp, TrendingDown, Info, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

const alertIcons = { info: Info, success: CheckCircle, warning: AlertTriangle, tip: Zap };
const alertColors = { info: 'var(--blue)', success: 'var(--green)', warning: 'var(--amber)', tip: 'var(--accent)' };
const alertBgs = { info: 'var(--blue-bg)', success: 'var(--green-bg)', warning: 'var(--amber-bg)', tip: 'var(--accent-light)' };

export default function DashboardPage() {
  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1400 }}>
      {/* Domain header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>India (Google) · English · Updated 24 hours ago</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>www.cognitute.org</h2>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Badge variant="default">Keywords: 1,053</Badge>
          <Badge variant="info">Competitors: 0</Badge>
          <Badge variant="accent">Jun 15–22, 2026</Badge>
        </div>
      </div>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <MetricCard label="Visibility" value="1.44%" change={-0.45} potential="See potential">
          <SparkLine data={visibilityData} color="#5c4af2" />
        </MetricCard>
        <MetricCard label="Estimated Traffic" value="25.87" change={14.08} potential="See potential">
          <SparkLine data={trafficData} color="#16a34a" />
        </MetricCard>
        <MetricCard label="Average Position" value="86.38" change={1.19} potential="See potential">
          <SparkLine data={positionData} color="#d97706" />
        </MetricCard>
      </div>

      {/* Rankings + Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 16 }}>
        {/* Rankings Distribution */}
        <Card>
          <CardHeader title="Rankings Distribution" />
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {rankingsDistribution.map(r => (
              <div key={r.range}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-secondary)' }}>{r.range}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>{r.count}</span>
                </div>
                <div style={{ height: 6, background: 'var(--border)', borderRadius: 99 }}>
                  <div style={{ height: '100%', borderRadius: 99, background: r.color, width: `${(r.count / 214) * 100}%` }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 8, padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Top 3 Keywords</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800 }}>8</span>
                <div style={{ fontSize: 12, textAlign: 'right' }}>
                  <div style={{ color: 'var(--green)' }}>+4 New</div>
                  <div style={{ color: 'var(--red)' }}>−11 Lost</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader title="Summary" subtitle="Jun 15–22, 2026 · cognitute.org" />
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {summaryAlerts.map((alert, i) => {
              const Icon = alertIcons[alert.type];
              return (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: alertBgs[alert.type], borderRadius: 'var(--radius-sm)', border: `1px solid ${alertColors[alert.type]}22` }}>
                  <Icon size={14} color={alertColors[alert.type]} style={{ marginTop: 1, flexShrink: 0 }} />
                  <p style={{ fontSize: 12.5, color: 'var(--text-primary)', lineHeight: 1.5 }}>{alert.message}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Keywords table */}
      <Card>
        <CardHeader title="Keyword Visibility Changes" subtitle="Sorted by most impactful changes" />
        <Table
          headers={['Keyword', 'Position', 'Change', 'Volume']}
          rows={topKeywords.map(k => [
            <span key="kw" style={{ fontWeight: 500 }}>{k.keyword}</span>,
            k.position,
            <span key="chg" style={{ color: k.change > 0 ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>
              {k.change > 0 ? '▲' : '▼'} {Math.abs(k.change)}
            </span>,
            k.volume.toLocaleString(),
          ])}
        />
      </Card>

      {/* Competitor overview */}
      <Card>
        <CardHeader title="Competitor Overview" />
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Domain', 'AI Visibility', 'Mentions', 'Site Health', 'Organic Traffic', 'Keywords', 'Backlinks'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {competitorData.map((c, i) => (
                <tr key={i} style={{ borderBottom: i < competitorData.length - 1 ? '1px solid var(--border)' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 16px' }}>
                    <a href="#" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>{c.name}</a>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{c.aiVisibility}</span>
                    <span style={{ marginLeft: 4, fontSize: 12, color: 'var(--text-muted)' }}>/ 100</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: c.mentions >= 50 ? 'var(--accent)' : 'var(--text-primary)' }}>{c.mentions}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontWeight: 600, color: c.siteHealth >= 85 ? 'var(--green)' : 'var(--amber)' }}>{c.siteHealth}%</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>
                    <div style={{ fontWeight: 700 }}>{c.organicTraffic.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: 'var(--red)' }}>−{c.organicTraffic === 25400 ? '5.79' : '56.85'}%</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{c.keywords.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{c.backlinks >= 1000 ? (c.backlinks / 1000).toFixed(1) + 'K' : c.backlinks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
