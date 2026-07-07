import { supabase } from './supabaseClient';

export function slugify(name) {
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function timeAgo(isoString) {
  if (!isoString) return '';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const PLATFORM_LABELS = { ai_mode: 'AI Mode', ai_overview: 'AI Overview', google: 'Google', chatgpt: 'ChatGPT', gemini: 'Gemini' };

function iconForPlatforms(platformLabels) {
  const platforms = platformLabels || [];
  if (platforms.includes('Google')) return 'google';
  if (platforms.includes('AI Mode') || platforms.includes('AI Overview')) return 'ai';
  return 'desktop';
}

function domainRowToProject(row) {
  const targetPlatforms = row.platforms || [];
  return {
    id: row.id,
    slug: row.project_slug,
    name: row.project_name,
    domain: row.domain,
    locationIcon: iconForPlatforms(targetPlatforms),
    location: row.target_regions?.[0] || 'Global',
    traffic: Number(row.traffic) || 0,
    trafficDir: null,
    da: row.domain_authority,
    keywords: Number(row.keywords_count) || 0,
    keywordsDir: null,
    targetPages: Number(row.target_pages_count) || 0,
    targetDir: null,
    blogPages: Number(row.blog_pages_count) || 0,
    updated: timeAgo(row.updated_at),
    targetPlatforms,
  };
}

// ─── Domain tab ─────────────────────────────────────────────────────────────

export async function fetchDomainRows() {
  const { data, error } = await supabase.from('domains').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(domainRowToProject);
}

export async function createProject({ name, domain, regions, platforms, da, users }) {
  const slug = slugify(name);
  const { error: projectError } = await supabase
    .from('projects')
    .upsert({ name, slug }, { onConflict: 'slug', ignoreDuplicates: true });
  if (projectError) throw projectError;

  const { data, error } = await supabase
    .from('domains')
    .insert({
      domain,
      project_name: name,
      project_slug: slug,
      target_regions: regions || [],
      platforms: (platforms || []).map(v => PLATFORM_LABELS[v] || v),
      domain_authority: da != null ? String(da) : null,
      users: users || [],
      traffic: '0',
      keywords_count: '0',
      target_pages_count: '0',
      blog_pages_count: '0',
    })
    .select()
    .single();
  if (error) throw error;
  return domainRowToProject(data);
}

export async function updateDomainRow(id, updates) {
  const dbUpdates = { updated_at: new Date().toISOString() };
  if ('name' in updates) dbUpdates.project_name = updates.name;
  if ('location' in updates) dbUpdates.target_regions = updates.location ? [updates.location] : [];
  if ('targetPlatforms' in updates) dbUpdates.platforms = updates.targetPlatforms;
  if ('da' in updates) dbUpdates.domain_authority = updates.da != null ? String(updates.da) : null;
  if ('traffic' in updates) dbUpdates.traffic = String(updates.traffic);
  if ('keywords' in updates) dbUpdates.keywords_count = String(updates.keywords);
  if ('targetPages' in updates) dbUpdates.target_pages_count = String(updates.targetPages);
  if ('blogPages' in updates) dbUpdates.blog_pages_count = String(updates.blogPages);

  const { data, error } = await supabase.from('domains').update(dbUpdates).eq('id', id).select().single();
  if (error) throw error;
  return domainRowToProject(data);
}

export async function deleteDomainRow(id) {
  const { error } = await supabase.from('domains').delete().eq('id', id);
  if (error) throw error;
}

// ─── KW Cluster tab ─────────────────────────────────────────────────────────

export async function fetchKwProjects() {
  const [{ data: projects, error: projectsError }, { data: domains, error: domainsError }, { data: kwRows, error: kwError }] = await Promise.all([
    supabase.from('projects').select('*'),
    supabase.from('domains').select('*'),
    supabase.from('keyword_categories').select('project_name, target_subtype'),
  ]);
  if (projectsError) throw projectsError;
  if (domainsError) throw domainsError;
  if (kwError) throw kwError;

  const domainBySlug = new Map();
  (domains || []).forEach(d => { if (!domainBySlug.has(d.project_slug)) domainBySlug.set(d.project_slug, d); });

  const counts = new Map();
  (kwRows || []).forEach(r => {
    const c = counts.get(r.project_name) || { total: 0, commercial: 0 };
    c.total += 1;
    if (r.target_subtype === 'Commercial') c.commercial += 1;
    counts.set(r.project_name, c);
  });

  return (projects || []).map(p => {
    const domainRow = domainBySlug.get(p.slug);
    const c = counts.get(p.slug) || { total: 0, commercial: 0 };
    return {
      slug: p.slug,
      name: p.name,
      domain: domainRow?.domain || '',
      locationIcon: iconForPlatforms(domainRow?.platforms),
      location: domainRow?.target_regions?.[0] || 'Global',
      totalPages: c.total,
      commercialPct: `${c.commercial}/${c.total}`,
      blogPages: 0,
      blogDir: null,
      keywords: c.total,
      keywordsDir: null,
      updated: timeAgo(domainRow?.updated_at || p.created_at),
    };
  });
}

function kwRowToUi(row) {
  return {
    id: row.id,
    kw: row.keyword,
    sv: row.sv,
    kwDiff: row.kw_diff,
    cluster: row.cluster,
    category: row.category,
    type: row.type,
    targetType: row.target_type,
    targetSubtype: row.target_subtype,
    targetGeo: row.target_geo,
    priority: row.priority,
    landingPage: row.landing_page_url,
  };
}

export async function fetchKeywordRows(projectSlug) {
  const { data, error } = await supabase
    .from('keyword_categories')
    .select('*')
    .eq('project_name', projectSlug)
    .order('id');
  if (error) throw error;
  return (data || []).map(kwRowToUi);
}

const KW_FIELD_TO_COLUMN = {
  kw: 'keyword',
  sv: 'sv',
  kwDiff: 'kw_diff',
  cluster: 'cluster',
  category: 'category',
  type: 'type',
  targetType: 'target_type',
  targetSubtype: 'target_subtype',
  targetGeo: 'target_geo',
  priority: 'priority',
  landingPage: 'landing_page_url',
};

function kwUpdatesToDb(updates) {
  const dbUpdates = {};
  Object.entries(updates).forEach(([field, value]) => {
    const column = KW_FIELD_TO_COLUMN[field];
    if (column) dbUpdates[column] = value;
  });
  return dbUpdates;
}

export async function updateKeywordRow(id, updates) {
  const { error } = await supabase.from('keyword_categories').update(kwUpdatesToDb(updates)).eq('id', id);
  if (error) throw error;
}

export async function bulkUpdateKeywordRows(ids, field, value) {
  const { error } = await supabase.from('keyword_categories').update(kwUpdatesToDb({ [field]: value })).in('id', ids);
  if (error) throw error;
}

export async function deleteKeywordRow(id) {
  const { error } = await supabase.from('keyword_categories').delete().eq('id', id);
  if (error) throw error;
}

export async function bulkDeleteKeywordRows(ids) {
  const { error } = await supabase.from('keyword_categories').delete().in('id', ids);
  if (error) throw error;
}
