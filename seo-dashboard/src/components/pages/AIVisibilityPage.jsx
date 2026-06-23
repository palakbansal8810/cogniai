import { Card, CardHeader, MetricCard, Badge } from '../ui/Card';
import { SparkLine, BarChartComp } from '../ui/MiniChart';
import { aiVisibilityData, competitorData } from '../../data/mockData';
import { Sparkles, Brain, TrendingUp, MessageSquare } from 'lucide-react';

const aiSources = [
  { name: 'ChatGPT', mentions: 4, share: 67, color: '#10b981' },
  { name: 'Perplexity', mentions: 1, share: 17, color: '#6366f1' },
  { name: 'Claude', mentions: 1, share: 17, color: '#f59e0b' },
  { name: 'Gemini', mentions: 0, share: 0, color: '#3b82f6' },
];

export default function AIVisibilityPage() {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Score card */}
      <div style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)', borderRadius: 'var(--radius)', padding: '24px 28px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6, fontWeight: 500 }}>AI Visibility Score</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 800, lineHeight: 1 }}>14</div>
          <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>out of 100 · 6 AI Mentions tracked</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius)', padding: '12px 20px', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Competitor Avg.</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700 }}>25</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>chaithanya.com</div>
          </div>
        </div>
      </div>

      {/* AI metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        <MetricCard label="Total AI Mentions" value="6" change={2}>
          <SparkLine data={aiVisibilityData} color="var(--accent)" />
        </MetricCard>
        <MetricCard label="Brand Sentiment" value="Positive" change={undefined}>
          <div style={{ marginTop: 6 }}>
            <Badge variant="success">Mostly Positive</Badge>
          </div>
        </MetricCard>
        <MetricCard label="Prompt Coverage" value="14%" change={3}>
          <SparkLine data={aiVisibilityData.map(d => ({ ...d, value: d.value * 1.1 }))} color="var(--green)" />
        </MetricCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* AI Source breakdown */}
        <Card>
          <CardHeader title="Mentions by AI Source" />
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {aiSources.map(s => (
              <div key={s.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.mentions} mentions</span>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{s.share}%</span>
                  </div>
                </div>
                <div style={{ height: 6, background: 'var(--border)', borderRadius: 99 }}>
                  <div style={{ height: '100%', borderRadius: 99, background: s.color, width: `${s.share}%`, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Brand Performance */}
        <Card>
          <CardHeader title="Brand Performance" subtitle="Cognitute.org in AI responses" />
          <div style={{ padding: '16px 20px' }}>
            <BarChartComp data={aiVisibilityData} color="var(--accent)" height={140} />
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Strategy consulting', 'AI services', 'Business transformation'].map((topic, i) => (
                <div key={topic} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{topic}</span>
                  <Badge variant={i === 0 ? 'accent' : i === 1 ? 'success' : 'default'}>{['Cited', 'Mentioned', 'Partial'][i]}</Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Competitor Insights */}
      <Card>
        <CardHeader title="Competitor AI Insights" subtitle="How competitors appear in AI responses" />
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Domain', 'AI Score', 'Mentions', 'Top Topics', 'vs You'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {competitorData.map((c, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--accent)' }}>{c.name}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 40, height: 4, background: 'var(--border)', borderRadius: 99 }}>
                        <div style={{ width: `${c.aiVisibility}%`, height: '100%', borderRadius: 99, background: c.aiVisibility >= 20 ? 'var(--accent)' : 'var(--amber)' }} />
                      </div>
                      <span style={{ fontWeight: 700 }}>{c.aiVisibility}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700 }}>{c.mentions}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12.5, color: 'var(--text-muted)' }}>Consulting, Strategy, AI</td>
                  <td style={{ padding: '12px 16px' }}>
                    <Badge variant={c.aiVisibility > 14 ? 'danger' : 'success'}>{c.aiVisibility > 14 ? `+${c.aiVisibility - 14} ahead` : 'Behind you'}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
