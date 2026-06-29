import { useState, useEffect } from 'react';
import { Search, Plus, X, ChevronDown, Edit2, HelpCircle, Upload, Check, Monitor, Globe, ArrowLeft, Trash2 } from 'lucide-react';
import { Badge } from '../ui/Card';
import { derivedPages, projectSetupData, competitorData, brandMentionKeywords } from '../../data/mockData';

// ─── shared tiny components ────────────────────────────────────────────────

function Input({ label, hint, placeholder, required, value, onChange, type = 'text' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
          {hint && <HelpCircle size={13} color="var(--text-muted)" />}
        </div>
      )}
      {hint === 'domain' && (
        <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: -2 }}>Enter a domain or subdomain. Subfolders not supported.</span>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', border: '1.5px solid #5c4af2', borderRadius: 8,
          padding: '10px 14px', fontSize: 14, outline: 'none',
          fontFamily: 'var(--font-body)', color: 'var(--text-primary)',
          background: '#fff', transition: 'border-color 0.15s',
        }}
        onFocus={e => e.target.style.borderColor = '#5c4af2'}
        onBlur={e => e.target.style.borderColor = '#d1d5db'}
      />
    </div>
  );
}

function Select({ label, options, value, onChange, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>}
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={e => onChange?.(e.target.value)}
          style={{
            width: '100%', appearance: 'none', border: '1.5px solid #d1d5db',
            borderRadius: 8, padding: '10px 36px 10px 14px', fontSize: 13,
            fontFamily: 'var(--font-body)', color: value ? 'var(--text-primary)' : 'var(--text-muted)',
            background: '#fff', cursor: 'pointer', outline: 'none',
          }}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
        </select>
        <ChevronDown size={14} color="var(--text-muted)" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
  'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
  'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
  'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon',
  'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
  'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
  'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos',
  'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi',
  'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova',
  'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands',
  'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau',
  'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania',
  'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal',
  'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea',
  'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan',
  'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
  'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela',
  'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
];

function CountryTagInput({ label, tags, onAdd, onRemove, placeholder }) {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(0);
  const wrapperRef = useState(null);

  const filtered = input.trim()
    ? COUNTRIES.filter(c => c.toLowerCase().includes(input.toLowerCase()) && !tags.includes(c))
    : COUNTRIES.filter(c => !tags.includes(c));

  const select = (country) => {
    onAdd(country);
    setInput('');
    setHighlightIdx(0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setHighlightIdx(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (open && filtered[highlightIdx]) select(filtered[highlightIdx]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
      {label && <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>}
      <div
        style={{ border: '1.5px solid #d1d5db', borderRadius: 8, padding: '8px 10px', minHeight: 42, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', background: '#fff' }}
        onClick={() => setOpen(true)}
      >
        {tags.map(t => (
          <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--accent-light)', color: 'var(--accent)', borderRadius: 99, padding: '2px 10px', fontSize: 12, fontWeight: 500 }}>
            {t}
            <button onClick={(e) => { e.stopPropagation(); onRemove(t); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--accent)', padding: 0, lineHeight: 1, fontSize: 14 }}>×</button>
          </span>
        ))}
        <input
          value={input}
          onChange={e => { setInput(e.target.value); setOpen(true); setHighlightIdx(0); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : 'Type to search...'}
          style={{ border: 'none', outline: 'none', fontSize: 13, fontFamily: 'var(--font-body)', minWidth: 100, flex: 1, background: 'transparent' }}
        />
        <ChevronDown size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
      </div>
      {open && filtered.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, zIndex: 50,
          background: '#fff', border: '1.5px solid var(--border)', borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', maxHeight: 200, overflowY: 'auto',
        }}>
          {filtered.slice(0, 50).map((c, i) => (
            <div
              key={c}
              onMouseDown={(e) => { e.preventDefault(); select(c); }}
              onMouseEnter={() => setHighlightIdx(i)}
              style={{
                padding: '8px 14px', fontSize: 13, cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                background: i === highlightIdx ? 'var(--accent-light)' : 'transparent',
                color: i === highlightIdx ? 'var(--accent)' : 'var(--text-primary)',
                fontWeight: i === highlightIdx ? 600 : 400,
              }}
            >
              {c}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MultiSelect({ label, options, selected, onToggle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map(o => {
          const active = selected.includes(o.value);
          return (
            <button
              key={o.value}
              onClick={() => onToggle(o.value)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 99, fontSize: 12.5, fontWeight: 500,
                border: active ? '1.5px solid var(--accent)' : '1.5px solid #d1d5db',
                background: active ? 'var(--accent-light)' : '#fff',
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s',
              }}
            >
              {active && <Check size={11} />}
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 18, height: 18, borderRadius: 4, border: checked ? '2px solid var(--accent)' : '2px solid #d1d5db',
          background: checked ? 'var(--accent)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s', cursor: 'pointer',
        }}
      >
        {checked && <Check size={11} color="#fff" strokeWidth={3} />}
      </div>
      <span style={{ fontSize: 13.5, color: 'var(--text-primary)' }}>{label}</span>
    </label>
  );
}

// ─── Modal wrapper ──────────────────────────────────────────────────────────

function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px 16px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>{title}</h2>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 6, display: 'flex' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: '0 28px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {children}
        </div>
        {footer && (
          <div style={{ padding: '16px 28px 24px', display: 'flex', gap: 12 }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

function Btn({ children, variant = 'primary', onClick, style = {} }) {
  const styles = {
    primary: { background: '#0f1523', color: '#fff', border: 'none' },
    outline: { background: '#fff', color: '#0f1523', border: '1.5px solid #d1d5db' },
    accent: { background: 'var(--accent)', color: '#fff', border: 'none' },
  };
  return (
    <button onClick={onClick} style={{
      ...styles[variant], borderRadius: 10, padding: '10px 22px',
      fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)',
      flex: variant === 'primary' || variant === 'accent' ? 1 : 'none',
      transition: 'opacity 0.15s', ...style,
    }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
      {children}
    </button>
  );
}

// ─── Create Project Modal ────────────────────────────────────────────────────

function CreateProjectModal({ open, onClose, onCreateProject }) {
  const [domain, setDomain] = useState('');
  const [name, setName] = useState('');
  const [share, setShare] = useState(false);
  const [regions, setRegions] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [da, setDa] = useState('');
  const [userType, setUserType] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [users, setUsers] = useState([]);

  const platformOptions = [
    { value: 'ai_mode', label: 'AI Mode' },
    { value: 'ai_overview', label: 'AI Overview' },
    { value: 'google', label: 'Google' },
    { value: 'chatgpt', label: 'ChatGPT' },
    { value: 'gemini', label: 'Gemini' },
  ];

  const userTypeLabels = { agency: 'Agency', cxo: 'CXO', project_head: 'Project Head', team_member: 'Team Member' };

  const togglePlatform = (v) => setPlatforms(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  const addUser = () => {
    if (userType && userEmail.trim()) {
      setUsers(prev => [...prev, { type: userType, email: userEmail.trim() }]);
      setUserType('');
      setUserEmail('');
    }
  };

  const removeUser = (index) => setUsers(prev => prev.filter((_, i) => i !== index));

  const resetForm = () => {
    setDomain(''); setName(''); setShare(false); setRegions([]);
    setPlatforms([]); setDa(''); setUserType(''); setUserEmail(''); setUsers([]);
  };

  const handleCreate = () => {
    if (!domain.trim()) return;
    onCreateProject({
      domain: domain.trim(),
      name: name.trim() || domain.trim(),
      regions,
      platforms,
      da: da || null,
      users,
      share,
    });
    resetForm();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Create project"
      footer={<><Btn variant="primary" onClick={handleCreate}>Create SEO project</Btn><Btn variant="outline" onClick={onClose} style={{ flex: 'none', padding: '10px 28px' }}>Cancel</Btn></>}
    >
      <Input label="Domain" hint="domain" placeholder="domain.com" value={domain} onChange={setDomain} />
      <Input label="Project Name" placeholder="Auto-generated if left blank" value={name} onChange={setName} />
      <div style={{ height: 1, background: 'var(--border)' }} />

      <CountryTagInput
        label="Target Regions"
        tags={regions}
        onAdd={r => setRegions(p => [...p, r])}
        onRemove={r => setRegions(p => p.filter(x => x !== r))}
        placeholder="e.g. India, Singapore, USA"
      />

      <MultiSelect
        label="Platforms"
        options={platformOptions}
        selected={platforms}
        onToggle={togglePlatform}
      />

      <Input label="Domain Authority" placeholder="e.g. 42" value={da} onChange={setDa} type="number" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Add Users</span>

        {users.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {users.map((u, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--surface-2)', borderRadius: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-light)', borderRadius: 99, padding: '2px 8px' }}>
                  {userTypeLabels[u.type] || u.type}
                </span>
                <span style={{ fontSize: 13, color: 'var(--text-primary)', flex: 1 }}>{u.email}</span>
                <button onClick={() => removeUser(idx)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2, lineHeight: 1, fontSize: 16 }}>×</button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Select
            placeholder="Type"
            value={userType}
            onChange={setUserType}
            options={[
              { value: 'agency', label: 'Agency' },
              { value: 'cxo', label: 'CXO' },
              { value: 'project_head', label: 'Project Head' },
              { value: 'team_member', label: 'Team Member' },
            ]}
          />
          <Input placeholder="User (Email ID)" value={userEmail} onChange={setUserEmail} type="email" />
        </div>
        <button onClick={addUser} style={{ alignSelf: 'flex-start', fontSize: 12.5, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, padding: '2px 0' }}>
          + Add another user
        </button>
      </div>

    </Modal>
  );
}

// ─── Add Pages Modal ─────────────────────────────────────────────────────────

function AddPagesModal({ open, onClose, projects, onImportPages }) {
  const [clustered, setClustered] = useState(false);
  const [project, setProject] = useState('');
  const [share, setShare] = useState(false);
  const [csvRows, setCsvRows] = useState([]);
  const [fileName, setFileName] = useState('');

  const projectOptions = projects
    .filter(p => p.name)
    .map(p => ({ value: p.domain, label: p.name }));

  const parseDelimited = (text, delimiter) => {
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length < 2) return [];
    return lines.slice(1).map(line => {
      const cols = line.split(delimiter).map(c => c.trim().replace(/^"|"$/g, ''));
      return { pageName: cols[0] || '', url: cols[1] || '', cluster: cols[2] || '', category: cols[3] || '' };
    }).filter(r => r.pageName || r.url);
  };

  const parseExcel = (buffer) => {
    const view = new Uint8Array(buffer);
    const text = new TextDecoder().decode(view);
    return parseDelimited(text, ',');
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    setFileName(file.name);
    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === 'xlsx' || ext === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rows = parseExcel(e.target.result);
        setCsvRows(rows);
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const delimiter = ext === 'tsv' ? '\t' : ',';
        const rows = parseDelimited(e.target.result, delimiter);
        setCsvRows(rows);
      };
      reader.readAsText(file);
    }
  };

  const resetForm = () => {
    setClustered(false); setProject('');
    setShare(false); setCsvRows([]); setFileName('');
  };

  const handleImport = () => {
    if (!project && csvRows.length === 0) return;
    const matchedProject = projects.find(p => p.domain === project);
    onImportPages({
      domain: project,
      name: matchedProject?.name || project,
      project,
      clustered,
      pages: csvRows,
      share,
    });
    resetForm();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Pages"
      footer={<><Btn variant="primary" onClick={handleImport}>Import Pages</Btn><Btn variant="outline" onClick={onClose} style={{ flex: 'none', padding: '10px 28px' }}>Cancel</Btn></>}
    >
      <Select
        label="Choose Project"
        placeholder="Select a project"
        value={project}
        onChange={setProject}
        options={projectOptions}
      />


      <Checkbox label="Clustered" checked={clustered} onChange={setClustered} />
      <div style={{ height: 1, background: 'var(--border)' }} />

      {/* Import Pages section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Import Pages</span>
        <input
          type="file"
          accept=".csv,.tsv,.xls,.xlsx"
          id="csv-upload"
          style={{ display: 'none' }}
          onChange={e => { handleFileUpload(e.target.files[0]); e.target.value = ''; }}
        />
        <div
          style={{ border: `2px dashed ${fileName ? 'var(--accent)' : '#d1d5db'}`, borderRadius: 10, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: fileName ? 'var(--accent-light)' : 'var(--surface-2)', cursor: 'pointer' }}
          onClick={() => document.getElementById('csv-upload').click()}
          onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--accent)'; }}
          onDragLeave={e => { e.currentTarget.style.borderColor = fileName ? 'var(--accent)' : '#d1d5db'; }}
          onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--accent)'; handleFileUpload(e.dataTransfer.files[0]); }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
          onMouseLeave={e => { if (!fileName) e.currentTarget.style.borderColor = '#d1d5db'; }}
        >
          {fileName ? (
            <>
              <Check size={20} color="var(--accent)" />
              <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>{fileName}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{csvRows.length} page{csvRows.length !== 1 ? 's' : ''} found</span>
            </>
          ) : (
            <>
              <Upload size={20} color="var(--text-muted)" />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>Click to upload or drag a file</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>CSV, TSV, Excel · Columns: Page Name, URL, Cluster, Category</span>
            </>
          )}
        </div>
      </div>

    </Modal>
  );
}

// ─── Add Competitors Modal ───────────────────────────────────────────────────

function AddCompetitorsModal({ open, onClose }) {
  const [domain, setDomain] = useState('');
  const [name, setName] = useState('');
  const [regions, setRegions] = useState([]);
  const [share, setShare] = useState(false);

  return (
    <Modal open={open} onClose={onClose} title="Add Competitors"
      footer={<><Btn variant="primary">Add Competitor</Btn><Btn variant="outline" onClick={onClose} style={{ flex: 'none', padding: '10px 28px' }}>Cancel</Btn></>}
    >
      <Input label="Domain" hint="domain" placeholder="domain.com" value={domain} onChange={setDomain} />
      <Input label="Name" placeholder="Auto-generated if left blank" value={name} onChange={setName} />

      <div style={{ height: 1, background: 'var(--border)' }} />

      <CountryTagInput
        label="Regions to Track"
        tags={regions}
        onAdd={r => setRegions(p => [...p, r])}
        onRemove={r => setRegions(p => p.filter(x => x !== r))}
        placeholder="e.g. India, Singapore"
      />
    </Modal>
  );
}

// ─── Table rows data ─────────────────────────────────────────────────────────

const targetPageCount = derivedPages.filter(p => p.targetCategory === 'Landing Page').length;
const blogPageCount = derivedPages.filter(p => p.targetCategory === 'Topical Blog').length;

const INITIAL_PROJECTS = [
  { name: 'OWIS Singapore', domain: 'owis.org', device: 'desktop', location: 'Singapore', locationIcon: 'desktop', traffic: '44.29%', trafficDir: null, da: null, keywords: projectSetupData.totalKeywords, keywordsDir: 'up', targetPages: targetPageCount, targetDir: 'up', blogPages: blogPageCount, updated: '20h ago' },
  { name: 'owis.org', domain: 'owis.org', device: 'ai', location: 'Singapore', locationIcon: 'ai', traffic: '2.40%', trafficDir: 'up', da: null, keywords: brandMentionKeywords.length, keywordsDir: 'up', targetPages: 0, targetDir: null, blogPages: projectSetupData.aiMentionCount, updated: '19h ago' },
  { name: 'Cogni', domain: 'cogni.org', device: 'google', location: 'Singapore', locationIcon: 'google', traffic: '10.44%', trafficDir: 'up', da: null, keywords: competitorData.length, keywordsDir: 'up', targetPages: 0, targetDir: null, blogPages: 3, updated: '18h ago' },
];

const DeviceIcon = ({ type }) => {
  if (type === 'desktop') return <Monitor size={14} color="#5a6478" />;
  if (type === 'ai') return <span style={{ fontSize: 13 }}>✦</span>;
  if (type === 'google') return <span style={{ fontSize: 13, color: '#4285F4', fontWeight: 700 }}>G</span>;
  return <Globe size={14} color="#5a6478" />;
};

// ─── Tab configurations ───────────────────────────────────────────────────────

const TABS = ['Domain', 'Pages', 'Competitors', 'Outreach', 'Connectors'];

function DomainTab({ projects }) {
  return (
    <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
      <thead>
        <tr style={{ background: '#f8f9fb', borderBottom: '1px solid var(--border)' }}>
          {['Project', 'Location', 'DA', 'Traffic', 'Keywords', 'Target Pages', 'Blog Pages', 'Updated', ''].map((h, i) => (
            <th key={i} style={{ padding: '10px 16px', textAlign: i <= 1 ? 'left' : 'right', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap', letterSpacing: '0.3px' }}>
              {h === 'Project' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Project <span style={{ fontSize: 10 }}>⇅</span></div>
              ) : h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {projects.map((p, i) => (
          <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}
            onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <td style={{ padding: '14px 16px' }}>
              {p.name && <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--accent)', marginBottom: 2 }}>{p.name}</div>}
              {p.domain && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.domain}</div>}
              {p.name && <div style={{ marginTop: 4 }}><span style={{ fontSize: 18, color: 'var(--border)' }}></span></div>}
            </td>
            <td style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 13, fontWeight: 500 }}>
                <DeviceIcon type={p.locationIcon} />
                {p.location}
              </div>
            </td>
            <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 13, color: 'var(--text-muted)' }}>—</td>
            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--accent)' }}>{p.traffic}</span>
            </td>
            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: p.keywordsDir === 'up' ? 'var(--green)' : 'var(--red)' }}>
                {p.keywordsDir === 'up' ? '↑' : '↓'}{p.keywords}
              </span>
            </td>
            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: p.targetDir === 'down' ? 'var(--red)' : p.targetDir === 'up' ? 'var(--green)' : 'var(--text-muted)' }}>
                {p.targetDir === 'down' ? '↓' : p.targetDir === 'up' ? '↑' : ''}{p.targetPages}
              </span>
            </td>
            <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{p.blogPages}</td>
            <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{p.updated}</td>
            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 6 }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                <Edit2 size={14} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}
const commercialPages = derivedPages.filter(p => p.targetType.toLowerCase().includes('commercial')).length;
const commercialPct = derivedPages.length > 0 ? Math.round((commercialPages / derivedPages.length) * 100) : 0;

const INITIAL_PAGES = [
  {
    name: 'OWIS Singapore',
    domain: 'owis.org',
    locationIcon: 'desktop',
    location: 'Singapore',
    totalPages: derivedPages.length,
    commercialPct: `${commercialPct}%`,
    blogPages: blogPageCount,
    blogDir: 'up',
    keywords: projectSetupData.totalKeywords,
    keywordsDir: 'up',
    updated: '20h ago',
    detailPages: derivedPages.map(p => ({
      pageName: p.pageName,
      url: p.url,
      cluster: p.cluster,
      category: p.category,
      targetCategory: p.targetCategory,
      targetType: p.targetType,
    })),
  },
  {
    name: 'owis.org (AI)',
    domain: 'owis.org',
    locationIcon: 'ai',
    location: 'Singapore',
    totalPages: brandMentionKeywords.length,
    commercialPct: '—',
    blogPages: projectSetupData.aiMentionCount,
    blogDir: 'up',
    keywords: brandMentionKeywords.length,
    keywordsDir: 'up',
    updated: '19h ago',
    detailPages: brandMentionKeywords.map(kw => ({
      pageName: kw,
      url: '/' + kw.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      cluster: 'Brand Mention',
      category: 'AI Visibility',
      targetCategory: '',
      targetType: 'commercial',
    })),
  },
];

function PagesTab({ pages, onSelectProject }) {
  return (
    <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--border)' }}>
          {[
            { label: 'Project', align: 'left' },
            { label: 'Location', align: 'left' },
            { label: 'Total  Pages', align: 'right' },
            { label: 'Commercial vs Others', align: 'right' },
            { label: 'Blog Pages', align: 'right' },
            { label: 'Keywords', align: 'right' },
            { label: 'Updated', align: 'right' },
            { label: '', align: 'right' },
          ].map((h, i) => (
            <th key={i} style={{ padding: '10px 16px', textAlign: h.align, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap', letterSpacing: '0.3px' }}>
              {h.label === 'Project'
                ? <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Project <span style={{ fontSize: 10 }}>⇅</span></div>
                : h.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {pages.map((p, i) => (
          <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}
            onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

            <td style={{ padding: '14px 16px' }}>
              {p.name && (
                <div
                  onClick={() => onSelectProject(i)}
                  style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--accent)', marginBottom: 2, cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                >{p.name}</div>
              )}
              {p.domain && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.domain}</div>}
              {p.name && <div style={{ marginTop: 4, fontSize: 16, color: 'var(--border)' }}></div>}
            </td>

            <td style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 13, fontWeight: 500 }}>
                <DeviceIcon type={p.locationIcon} />
                {p.location}
              </div>
            </td>

            <td style={{ padding: '14px 16px', textAlign: 'right', color: 'var(--text-muted)', fontSize: 13 }}>
              {p.totalPages ?? ''}
            </td>

            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--accent)' }}>
                {p.commercialPct}
              </span>
            </td>

            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: p.blogDir === 'up' ? 'var(--green)' : 'var(--text-muted)' }}>
                {p.blogDir === 'up' ? '↑' : ''}{p.blogPages}
              </span>
            </td>

            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: p.keywordsDir === 'down' ? 'var(--red)' : 'var(--text-muted)' }}>
                {p.keywordsDir === 'down' ? `↓${p.keywords}` : p.keywords}
              </span>
            </td>

            <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {p.updated}
            </td>

            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 6 }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                <Edit2 size={14} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}
function BulkEditModal({ open, onClose, count, onApply }) {
  const [field, setField] = useState('');
  const [value, setValue] = useState('');

  const FIELDS = [
    { value: 'cluster', label: 'Cluster', type: 'text' },
    { value: 'category', label: 'Category', type: 'text' },
    { value: 'targetCategory', label: 'Target Category', type: 'select', options: ['Landing Page', 'Topical Blog'] },
    { value: 'targetType', label: 'Target Type', type: 'select', options: ['Commercial', 'Informational', 'Informational/Commercial', 'Transactional', 'Navigational'] },
  ];

  const selectedField = FIELDS.find(f => f.value === field);

  const handleApply = () => {
    if (!field || !value) return;
    onApply(field, value);
    setField('');
    setValue('');
    onClose();
  };

  return (
    <Modal open={open} onClose={() => { onClose(); setField(''); setValue(''); }} title="Bulk Edit"
      footer={<><Btn variant="primary" onClick={handleApply}>Apply to {count} page{count !== 1 ? 's' : ''}</Btn><Btn variant="outline" onClick={() => { onClose(); setField(''); setValue(''); }} style={{ flex: 'none', padding: '10px 28px' }}>Cancel</Btn></>}
    >
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>
        Editing <strong>{count}</strong> selected page{count !== 1 ? 's' : ''}
      </div>

      <Select
        label="Field to edit"
        placeholder="Choose a field"
        value={field}
        onChange={v => { setField(v); setValue(''); }}
        options={FIELDS.map(f => ({ value: f.value, label: f.label }))}
      />

      {field && selectedField?.type === 'text' && (
        <Input label="New value" placeholder={`Enter new ${selectedField.label.toLowerCase()}`} value={value} onChange={setValue} />
      )}

      {field && selectedField?.type === 'select' && (
        <Select
          label="New value"
          placeholder={`Choose ${selectedField.label.toLowerCase()}`}
          value={value}
          onChange={setValue}
          options={selectedField.options.map(o => ({ value: o, label: o }))}
        />
      )}
    </Modal>
  );
}

function BulkDeleteModal({ open, onClose, count, onConfirm }) {
  return (
    <Modal open={open} onClose={onClose} title="Confirm Delete"
      footer={<><Btn variant="primary" onClick={() => { onConfirm(); onClose(); }} style={{ background: 'var(--red)' }}>Delete {count} page{count !== 1 ? 's' : ''}</Btn><Btn variant="outline" onClick={onClose} style={{ flex: 'none', padding: '10px 28px' }}>Cancel</Btn></>}
    >
      <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        Are you sure you want to delete <strong>{count}</strong> selected page{count !== 1 ? 's' : ''}? This action cannot be undone.
      </div>
    </Modal>
  );
}

function ActionsDropdown({ selectedCount, onBulkEdit, onBulkDelete }) {
  const [open, setOpen] = useState(false);

  if (selectedCount === 0) return null;

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: '#0f1523', color: '#fff', border: 'none', borderRadius: 8,
          padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'var(--font-body)', transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        Actions ({selectedCount})
        <ChevronDown size={13} />
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: '100%', right: 0, marginTop: 4, zIndex: 50,
            background: '#fff', border: '1px solid var(--border)', borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 160, overflow: 'hidden',
          }}>
            <button
              onClick={() => { setOpen(false); onBulkEdit(); }}
              style={{ width: '100%', padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Edit2 size={14} color="var(--text-muted)" /> Bulk Edit
            </button>
            <div style={{ height: 1, background: 'var(--border)' }} />
            <button
              onClick={() => { setOpen(false); onBulkDelete(); }}
              style={{ width: '100%', padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--red)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Trash2 size={14} /> Bulk Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function PageDetailView({ project, onBack, onUpdatePages }) {
  const [rows, setRows] = useState(project.detailPages || []);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [showBulkDelete, setShowBulkDelete] = useState(false);

  const allSelected = rows.length > 0 && selectedRows.size === rows.length;
  const someSelected = selectedRows.size > 0 && selectedRows.size < rows.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(rows.map((_, i) => i)));
    }
  };

  const toggleRow = (idx) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const updateRow = (idx, field, value) => {
    setRows(prev => {
      const updated = prev.map((r, i) => i === idx ? { ...r, [field]: value } : r);
      onUpdatePages(updated);
      return updated;
    });
  };

  const deleteRow = (idx) => {
    setRows(prev => {
      const updated = prev.filter((_, i) => i !== idx);
      onUpdatePages(updated);
      return updated;
    });
  };

  const bulkUpdate = (field, value) => {
    setRows(prev => {
      const updated = prev.map(r => ({ ...r, [field]: value }));
      onUpdatePages(updated);
      return updated;
    });
  };

  const handleBulkEditApply = (field, value) => {
    setRows(prev => {
      const updated = prev.map((r, i) => selectedRows.has(i) ? { ...r, [field]: value } : r);
      onUpdatePages(updated);
      return updated;
    });
    setSelectedRows(new Set());
  };

  const handleBulkDelete = () => {
    setRows(prev => {
      const updated = prev.filter((_, i) => !selectedRows.has(i));
      onUpdatePages(updated);
      return updated;
    });
    setSelectedRows(new Set());
  };

  return (
    <div>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px 0', fontFamily: 'var(--font-body)', fontSize: 13 }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ height: 20, width: 1, background: 'var(--border)' }} />
        <div>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{project.name}</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>{project.domain}</span>
        </div>
        <div style={{ flex: 1 }} />
        <ActionsDropdown
          selectedCount={selectedRows.size}
          onBulkEdit={() => setShowBulkEdit(true)}
          onBulkDelete={() => setShowBulkDelete(true)}
        />
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{rows.length} page{rows.length !== 1 ? 's' : ''}</span>
      </div>

      <BulkEditModal open={showBulkEdit} onClose={() => setShowBulkEdit(false)} count={selectedRows.size} onApply={handleBulkEditApply} />
      <BulkDeleteModal open={showBulkDelete} onClose={() => setShowBulkDelete(false)} count={selectedRows.size} onConfirm={handleBulkDelete} />

      <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
        <thead>
          <tr style={{ background: '#f8f9fb', borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: '10px 12px 10px 16px', width: 36 }}>
              <div
                onClick={toggleAll}
                style={{
                  width: 18, height: 18, borderRadius: 4,
                  border: allSelected || someSelected ? '2px solid var(--accent)' : '2px solid #d1d5db',
                  background: allSelected ? 'var(--accent)' : someSelected ? 'var(--accent)' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
                }}
              >
                {allSelected && <Check size={11} color="#fff" strokeWidth={3} />}
                {someSelected && <span style={{ width: 8, height: 2, background: '#fff', borderRadius: 1, display: 'block' }} />}
              </div>
            </th>
            {['Page Name', 'URL', 'Cluster', 'Category'].map((h, i) => (
              <th key={i} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap', letterSpacing: '0.3px' }}>{h}</th>
            ))}
            <th style={{ padding: '6px 16px', textAlign: 'left' }}>
              <select value="" onChange={e => { if (e.target.value) bulkUpdate('targetCategory', e.target.value); }}
                style={{ appearance: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '5px 28px 5px 10px', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-body)', color: 'var(--text-muted)', background: `#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 8px center`, cursor: 'pointer', outline: 'none', minWidth: 130, letterSpacing: '0.3px' }}>
                <option value="">Target Category</option>
                <option value="Landing Page">Landing Page</option>
                <option value="Topical Blog">Topical Blog</option>
              </select>
            </th>
            <th style={{ padding: '6px 16px', textAlign: 'left' }}>
              <select value="" onChange={e => { if (e.target.value) bulkUpdate('targetType', e.target.value); }}
                style={{ appearance: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '5px 28px 5px 10px', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-body)', color: 'var(--text-muted)', background: `#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 8px center`, cursor: 'pointer', outline: 'none', minWidth: 130, letterSpacing: '0.3px' }}>
                <option value="">Target Type</option>
                <option value="Commercial">Commercial</option>
                <option value="Informational">Informational</option>
                <option value="Informational/Commercial">Info/Commercial</option>
                <option value="Transactional">Transactional</option>
                <option value="Navigational">Navigational</option>
              </select>
            </th>
            <th style={{ padding: '10px 16px' }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={8} style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No pages added yet. Use Add Pages to import.</td></tr>
          ) : rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <td style={{ padding: '10px 12px 10px 16px', width: 36 }}>
                <div
                  onClick={() => toggleRow(i)}
                  style={{
                    width: 18, height: 18, borderRadius: 4,
                    border: selectedRows.has(i) ? '2px solid var(--accent)' : '2px solid #d1d5db',
                    background: selectedRows.has(i) ? 'var(--accent)' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
                  }}
                >
                  {selectedRows.has(i) && <Check size={11} color="#fff" strokeWidth={3} />}
                </div>
              </td>
              <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', maxWidth: 200 }}>{r.pageName}</td>
              <td style={{ padding: '10px 16px', fontSize: 13, color: 'var(--accent)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.url}</td>
              <td style={{ padding: '10px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{r.cluster}</td>
              <td style={{ padding: '10px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{r.category}</td>
              <td style={{ padding: '10px 16px', fontSize: 13, color: r.targetCategory ? 'var(--text-primary)' : 'var(--text-muted)' }}>{r.targetCategory || '—'}</td>
              <td style={{ padding: '10px 16px', fontSize: 13, color: r.targetType ? 'var(--text-primary)' : 'var(--text-muted)' }}>{r.targetType || '—'}</td>
              <td style={{ padding: '10px 16px' }}>
                <button onClick={() => deleteRow(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 6 }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = 'var(--red)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

const COMPETITOR_ROWS = [
  {
    name: 'OWIS Singapore', domain: 'owis.org', device: 'desktop', location: 'Singapore', da: null, commonKw: 44.29, commonKwChange: -0.47, totalKw: 139, totalKwChange: 139, aiCompLevel: 137, aiCompChange: -137, serpCompLevel: 757, dated: '20h ago',
    details: [
      { domain: 'owis.org', name: 'OWIS Main Site', regions: ['Singapore', 'India'], da: 42, rankingKeywords: 139, device: 'desktop', location: 'Singapore', commonKw: 38.12, totalKw: 139, aiCompLevel: 95, serpCompLevel: 520, dated: '20h ago' },
      { domain: 'owis.org/admissions', name: 'OWIS Admissions', regions: ['Singapore'], da: 42, rankingKeywords: 47, device: 'desktop', location: 'Singapore', commonKw: 4.80, totalKw: 47, aiCompLevel: 28, serpCompLevel: 152, dated: '20h ago' },
      { domain: 'owis.org/blog', name: 'OWIS Blog', regions: ['Singapore', 'Malaysia'], da: 42, rankingKeywords: 68, device: 'web', location: 'Singapore', commonKw: 1.37, totalKw: 68, aiCompLevel: 14, serpCompLevel: 85, dated: '20h ago' },
    ],
  },
  {
    name: 'owis.org', domain: 'owis.org', device: 'web', location: 'Singapore', da: null, commonKw: 2.40, commonKwChange: 2.40, totalKw: 1, totalKwChange: 1, aiCompLevel: 0, aiCompChange: 0, serpCompLevel: 4, dated: '19h ago',
    details: [
      { domain: 'owis.org', name: 'OWIS AI Presence', regions: ['Singapore'], da: 42, rankingKeywords: 1, device: 'web', location: 'Singapore', commonKw: 2.40, totalKw: 1, aiCompLevel: 0, serpCompLevel: 4, dated: '19h ago' },
    ],
  },
  {
    name: null, domain: null, device: 'google', location: 'Singapore', da: null, commonKw: 10.44, commonKwChange: 10.44, totalKw: 3, totalKwChange: 3, aiCompLevel: 0, aiCompChange: 0, serpCompLevel: 3, dated: '18h ago',
    details: [
      { domain: 'google.com', name: 'Google Search', regions: ['Singapore'], da: 98, rankingKeywords: 3, device: 'google', location: 'Singapore', commonKw: 10.44, totalKw: 3, aiCompLevel: 0, serpCompLevel: 3, dated: '18h ago' },
    ],
  },
];

const GoogleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const CompDeviceIcon = ({ type }) => {
  if (type === 'desktop') return <Monitor size={14} color="#5a6478" />;
  if (type === 'web') return <Globe size={14} color="#5a6478" />;
  if (type === 'google') return <GoogleIcon />;
  return <Globe size={14} color="#5a6478" />;
};

function RegionTags({ regions }) {
  const [expanded, setExpanded] = useState(false);
  if (!regions || regions.length === 0) return <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>;

  const first = regions[0];
  const rest = regions.length - 1;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
      <span style={{ fontSize: 11, fontWeight: 500, background: 'var(--accent-light)', color: 'var(--accent)', borderRadius: 99, padding: '2px 10px' }}>{first}</span>
      {rest > 0 && !expanded && (
        <span
          onClick={e => { e.stopPropagation(); setExpanded(true); }}
          style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-light)', borderRadius: 99, padding: '2px 8px', cursor: 'pointer' }}
        >
          +{rest}
        </span>
      )}
      {expanded && regions.slice(1).map(r => (
        <span key={r} style={{ fontSize: 11, fontWeight: 500, background: 'var(--accent-light)', color: 'var(--accent)', borderRadius: 99, padding: '2px 10px' }}>{r}</span>
      ))}
      {expanded && (
        <span
          onClick={e => { e.stopPropagation(); setExpanded(false); }}
          style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer', padding: '2px 4px' }}
        >
          ×
        </span>
      )}
    </div>
  );
}

function CompetitorDetailView({ competitor, onBack }) {
  const details = competitor.details || [];
  const title = competitor.name || competitor.domain || 'Competitor';

  return (
    <div>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px 0', fontFamily: 'var(--font-body)', fontSize: 13 }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ height: 20, width: 1, background: 'var(--border)' }} />
        <div>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</span>
          {competitor.domain && competitor.name && <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>{competitor.domain}</span>}
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{details.length} entr{details.length !== 1 ? 'ies' : 'y'}</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1200 }}>
          <thead>
            <tr style={{ background: '#f8f9fb', borderBottom: '1px solid var(--border)' }}>
              {[
                { label: 'Domain', align: 'left' },
                { label: 'Name', align: 'left' },
                { label: 'Regions To Track', align: 'left' },
                { label: 'DA', align: 'right' },
                { label: 'Ranking Keywords', align: 'right' },
                { label: 'Location', align: 'left' },
                { label: "Common KW's", align: 'right' },
                { label: "Tot. KW's", align: 'right' },
                { label: 'AI Comp. Level', align: 'right' },
                { label: 'SERP Comp Level', align: 'right' },
                { label: 'dated', align: 'right' },
              ].map((h, i) => (
                <th key={i} style={{ padding: '10px 16px', textAlign: h.align, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap', letterSpacing: '0.3px' }}>{h.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {details.length === 0 ? (
              <tr><td colSpan={11} style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No detail entries yet.</td></tr>
            ) : details.map((d, i) => (
              <tr key={i} style={{ borderBottom: i < details.length - 1 ? '1px solid var(--border)' : 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: 'var(--accent)' }}>{d.domain}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-primary)' }}>{d.name}</td>
                <td style={{ padding: '12px 16px' }}>
                  <RegionTags regions={d.regions} />
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>{d.da ?? '—'}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>{d.rankingKeywords}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <CompDeviceIcon type={d.device} />
                    {d.location}
                  </div>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-primary)' }}>{d.commonKw?.toFixed(2)}%</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: d.totalKw > 0 ? 'var(--green)' : 'var(--text-muted)' }}>
                  {d.totalKw > 0 ? '↑' : ''}{d.totalKw}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: d.aiCompLevel > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>{d.aiCompLevel}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>{d.serpCompLevel}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{d.dated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CompetitorsTab({ onSelectCompetitor }) {
  return (
    <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--border)' }}>
          <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap', letterSpacing: '0.3px' }}>Competitors</th>
          <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap', letterSpacing: '0.3px' }}>Location</th>
          <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap', letterSpacing: '0.3px' }}>DA</th>
          <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap', letterSpacing: '0.3px' }}>Common KW's</th>
          <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap', letterSpacing: '0.3px' }}>Tot. KW's</th>
          <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap', letterSpacing: '0.3px' }}>AI Comp. Level</th>
          <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap', letterSpacing: '0.3px' }}>SERP Comp Level</th>
          <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap', letterSpacing: '0.3px' }}>dated</th>
          <th style={{ padding: '10px 16px' }}></th>
        </tr>
      </thead>
      <tbody>
        {COMPETITOR_ROWS.map((c, i) => (
          <tr key={i} style={{ borderBottom: i < COMPETITOR_ROWS.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            onClick={() => onSelectCompetitor(i)}>
            {/* Competitor name & domain */}
            <td style={{ padding: '14px 16px' }}>
              {c.name && (
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--accent)' }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
                  {c.name}
                </div>
              )}
              {c.domain && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{c.domain}</div>}
              {c.name && <div style={{ marginTop: 4, fontSize: 16, color: 'var(--border)' }}></div>}
            </td>
            {/* Location */}
            <td style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                <CompDeviceIcon type={c.device} />
                {c.location}
              </div>
            </td>
            {/* DA */}
            <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
              {c.da ?? ''}
            </td>
            {/* Common KW's % */}
            <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-primary)' }}>
              {c.commonKw.toFixed(2)}%
            </td>
            {/* Tot. KW's */}
            <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: c.totalKwChange > 0 ? 'var(--green)' : c.totalKwChange < 0 ? 'var(--red)' : 'var(--text-muted)' }}>
              {c.totalKwChange > 0 ? '↑' : c.totalKwChange < 0 ? '↓' : ''}{Math.abs(c.totalKwChange)}
            </td>
            {/* AI Comp. Level */}
            <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: c.aiCompChange > 0 ? 'var(--green)' : c.aiCompChange < 0 ? 'var(--red)' : 'var(--text-muted)' }}>
              {c.aiCompChange > 0 ? '↑' : c.aiCompChange < 0 ? '↓' : ''}{Math.abs(c.aiCompChange)}
            </td>
            {/* SERP Comp Level */}
            <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
              {c.serpCompLevel}
            </td>
            {/* Dated */}
            <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {c.dated}
            </td>
            {/* Edit */}
            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
              <button onClick={e => e.stopPropagation()} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                <Edit2 size={13} color="var(--text-muted)" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ProjectSetupPage({ tab }) {
  const [activeTab, setActiveTab] = useState(tab || 'Domain');
  useEffect(() => { if (tab) { setActiveTab(tab); setSelectedPageProject(null); setSelectedCompetitor(null); } }, [tab]);
  const [filter, setFilter] = useState('All targets');
  const [search, setSearch] = useState('');
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [pages, setPages] = useState(INITIAL_PAGES);
  const [selectedPageProject, setSelectedPageProject] = useState(null);
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showAddPages, setShowAddPages] = useState(false);
  const [showAddCompetitors, setShowAddCompetitors] = useState(false);

  const handleCreateProject = (data) => {
    const location = data.regions[0] || 'Global';
    const locationIcon = data.platforms.includes('google') ? 'google'
      : data.platforms.includes('ai_mode') || data.platforms.includes('ai_overview') ? 'ai'
      : 'desktop';

    setProjects(prev => [...prev, {
      name: data.name,
      domain: data.domain,
      device: locationIcon,
      location,
      locationIcon,
      traffic: '0%',
      trafficDir: null,
      da: data.da,
      keywords: 0,
      keywordsDir: null,
      targetPages: 0,
      targetDir: null,
      blogPages: 0,
      updated: 'Just now',
    }]);

    setPages(prev => [...prev, {
      name: data.name,
      domain: data.domain,
      locationIcon,
      location,
      totalPages: 0,
      commercialPct: '0%',
      blogPages: 0,
      blogDir: null,
      keywords: 0,
      keywordsDir: null,
      updated: 'Just now',
    }]);
  };

  const handleImportPages = (data) => {
    const pageCount = data.pages.length || 1;
    const matchedProject = projects.find(p => p.domain === data.project);
    const location = matchedProject?.location || 'Global';
    const locationIcon = matchedProject?.locationIcon || 'desktop';

    setPages(prev => [...prev, {
      name: data.name,
      domain: data.domain,
      locationIcon,
      location,
      totalPages: pageCount,
      commercialPct: '0%',
      blogPages: 0,
      blogDir: 'up',
      keywords: 0,
      keywordsDir: null,
      updated: 'Just now',
    }]);
  };

  const filterTabs = ['All targets', 'AI Search', 'SEO'];

  const ctaByTab = {
    Domain: { label: 'Create project', onClick: () => setShowCreate(true) },
    Pages: { label: 'Add Pages', onClick: () => setShowAddPages(true) },
    Competitors: { label: 'Add Competitors', onClick: () => setShowAddCompetitors(true) },
    Outreach: { label: 'Add Outreach', onClick: () => {} },
    Connectors: { label: 'Connect', onClick: () => {} },
  };

  const cta = ctaByTab[activeTab];

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>Home</span><span>›</span><span>SEO</span><span>›</span><span style={{ color: 'var(--text-primary)' }}>Position Tracking</span>
      </div>

      {/* Page title */}
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20 }}>
        Project Setup
      </h1>

      {/* Horizontal tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid var(--border)', marginBottom: 20 }}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => { setActiveTab(t); setSelectedPageProject(null); setSelectedCompetitor(null); }}
            style={{
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: activeTab === t ? 600 : 500,
              color: activeTab === t ? 'var(--text-primary)' : 'var(--text-muted)',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === t ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: -2,
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => { if (activeTab !== t) e.currentTarget.style.color = 'var(--text-secondary)'; }}
            onMouseLeave={e => { if (activeTab !== t) e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Main card */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, boxShadow: 'var(--shadow)', overflow: 'hidden' }}>

        {/* Toolbar */}
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)' }}>
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 14px', flex: '0 0 260px' }}>
            <Search size={13} color="var(--text-muted)" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Project name or domain"
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', width: '100%' }}
            />
          </div>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: 0, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            {filterTabs.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '7px 16px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                fontFamily: 'var(--font-body)', transition: 'all 0.15s',
                background: filter === f ? '#0f1523' : '#fff',
                color: filter === f ? '#fff' : 'var(--text-secondary)',
                borderRight: f !== 'SEO' ? '1px solid var(--border)' : 'none',
              }}>{f}</button>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          {/* CTA */}
          <button
            onClick={cta.onClick}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#0f1523', color: '#fff', border: 'none', borderRadius: 8,
              padding: '8px 18px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'var(--font-body)', transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <Plus size={15} />
            {cta.label}
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          {activeTab === 'Domain' && <DomainTab projects={projects} />}
          {activeTab === 'Pages' && selectedPageProject !== null ? (
            <PageDetailView
              project={pages[selectedPageProject]}
              onBack={() => setSelectedPageProject(null)}
              onUpdatePages={(updated) => setPages(prev => prev.map((p, i) => i === selectedPageProject ? { ...p, detailPages: updated } : p))}
            />
          ) : activeTab === 'Pages' && <PagesTab pages={pages} onSelectProject={setSelectedPageProject} />}
          {activeTab === 'Competitors' && selectedCompetitor !== null ? (
            <CompetitorDetailView
              competitor={COMPETITOR_ROWS[selectedCompetitor]}
              onBack={() => setSelectedCompetitor(null)}
            />
          ) : activeTab === 'Competitors' && <CompetitorsTab onSelectCompetitor={setSelectedCompetitor} />}
          {(activeTab === 'Outreach' || activeTab === 'Connectors') && (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
              No {activeTab.toLowerCase()} configured yet. Click <strong>+ {cta.label}</strong> to get started.
            </div>
          )}
        </div>

        {/* Pagination */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
            Page:
            <input defaultValue="1" style={{ width: 36, border: '1px solid var(--border)', borderRadius: 4, padding: '2px 6px', textAlign: 'center', fontSize: 13, fontFamily: 'var(--font-body)', outline: 'none' }} />
            of 1
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
          </div>
        </div>

      </div>

      {/* Help button */}
      <div style={{ position: 'fixed', bottom: 28, right: 28 }}>
        <button style={{ width: 44, height: 44, borderRadius: '50%', background: '#0f1523', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.25)' }}>
          <HelpCircle size={20} color="#fff" />
        </button>
      </div>

      {/* Modals */}
      <CreateProjectModal open={showCreate} onClose={() => setShowCreate(false)} onCreateProject={handleCreateProject} />
      <AddPagesModal open={showAddPages} onClose={() => setShowAddPages(false)} projects={projects} onImportPages={handleImportPages} />
      <AddCompetitorsModal open={showAddCompetitors} onClose={() => setShowAddCompetitors(false)} />
    </div>
  );
}
