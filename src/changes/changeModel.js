/* ---------------------------------------------------------------------------
   The changelog, as a page reads it.

   Every change to the view store writes one line: who, when, which record,
   what it held before and after, the reason and the evidence. That line is the
   only marking a change gets — no badge sits on a verdict a rule moved — so
   the page that shows the lines has to answer, for any one of them, WHO did
   this and ON WHAT.

   This module is the reading of a line, with no DOM in it: who the author is
   in words, which fields actually moved between the two records, and the
   filters. Everything it returns is an [en, zh] pair or plain data, so the
   page chooses the language and a test can read the result.
   --------------------------------------------------------------------------- */
import { dimension, TREND_LABEL, VERDICT_LABEL, BASIS_LABEL, ROUTE_LABEL, CONFIDENCE_LABEL } from '../governance/investability.js';
import { ARCHETYPES } from '../governance/archetypes.js';
import { REVENUE_ROUTE_LABEL } from '../governance/plays.js';

export const AUTHOR_KINDS = ['analyst', 'rule', 'agent'];

export const AUTHOR_LABEL = {
  analyst: ['Analyst', '分析师'],
  rule: ['Rule', '规则'],
  agent: ['Agent', '智能体'],
};

export const SECTION_LABEL = {
  grades: ['Grade', '评级'],
  verdicts: ['Verdict', '结论'],
  triggers: ['Trigger', '触发事件'],
  thesis: ['Thesis', '投资论点'],
  plays: ['Play', '投资方案'],
  /* The sections only a scout card has. */
  facts: ['Facts', '事实'],
  returnSignal: ['Return signal', '回报参考信号'],
  checked: ['Spot-check', '抽查'],
};

const FIELD_LABEL = {
  grade: ['Grade', '评级'],
  trend: ['Trend', '趋势'],
  trendCause: ['Cause of the trend', '趋势成因'],
  basis: ['Basis', '依据'],
  evidence: ['Sources', '来源'],
  reason: ['Reason', '理由'],
  metric: ['Figures', '数据'],
  lockedUntil: ['Pinned until', '锁定至'],
  call: ['Call', '结论'],
  route: ['Route', '进入方式'],
  where: ['Where', '区域'],
  because: ['Reasons for', '支持理由'],
  despite: ['Argument against', '反方理由'],
  changesIf: ['Would change if', '改变条件'],
  reviewBy: ['Review by', '复核日期'],
  scoreNote: ['Note on the score', '评分说明'],
  confidence: ['Confidence', '把握程度'],
  publicNote: ['Public note', '公开说明'],
  label: ['What it is', '事件内容'],
  expected: ['Expected', '预计时间'],
  watches: ['Watches', '关注维度'],
  direction: ['Direction', '方向'],
  source: ['Source', '来源'],
  when: ['Tests', '检验条件'],
  effect: ['Change it applies', '触发后的变更'],
  note: ['Reason when it fires', '触发时记录的理由'],
  kind: ['Kind', '类型'],
  /* A play's fields (governance/plays.js) and a trigger's outcome. */
  hours: ['Duration, hours', '时长（小时）'],
  stage: ['Entry stage', '进入阶段'],
  why: ['Why this design', '为何选此方案'],
  action: ['Next action', '下一步行动'],
  calls: ['Calls of its own', '独立结论'],
  play: ['Play', '投资方案'],
  outcome: ['Outcome', '结果'],
};

/* On a play, `route` is the revenue route, not the way in: a different word. */
const PLAY_FIELD_LABEL = { route: ['Revenue route', '收入路径'] };

/** Stamps every write sets; never the substance of a change. */
const STAMPS = new Set(['author', 'asOf', 'dimension', 'archetype', 'id', 'market', 'held']);

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const both = (s) => [String(s), String(s)];

/** { section, key, layer } from a changelog path. */
export function pathParts(path){
  const [section, key = null, layer = null] = String(path).split('.');
  return { section, key, layer };
}

/** A field's value as a short [en, zh] pair, or null when it is too long to show inline. */
function shortValue(field, value, section = null){
  if (value === null || value === undefined) return ['none', '无'];
  if (section === 'plays' && field === 'route') return REVENUE_ROUTE_LABEL[value] || both(value);
  if (field === 'stage') return ROUTE_LABEL[value] || both(value);
  if (field === 'trend') return TREND_LABEL[value] || both(value);
  if (field === 'call') return VERDICT_LABEL[value] || both(value);
  if (field === 'basis') return BASIS_LABEL[value] || both(value);
  if (field === 'route') return ROUTE_LABEL[value] || both(value);
  if (field === 'confidence') return CONFIDENCE_LABEL[value] || both(value);
  if (typeof value === 'number' || typeof value === 'boolean') return both(value);
  if (typeof value === 'string') return value.length <= 40 ? both(value) : null;
  if (field === 'evidence' || field === 'watches' || field === 'changesIf'){
    return Array.isArray(value) && value.every(v => typeof v === 'string') && value.join(', ').length <= 60
      ? both(value.length ? value.join(', ') : '—') : null;
  }
  return null;
}

/**
 * What moved between `from` and `to`.
 *
 *   kind     created · removed · changed
 *   fields   for a change: [{ field, label, from, to }], where from/to are
 *            short [en, zh] values or null when the field is prose
 *
 * A thesis is one value, so it has no fields; a created or removed record is
 * described by its headline alone.
 */
export function describeChange(entry){
  const { from, to } = entry;
  if (from === null || from === undefined) return { kind: 'created', fields: [], headline: headline(entry, to) };
  if (to === null || to === undefined) return { kind: 'removed', fields: [], headline: headline(entry, from) };
  if (typeof from !== 'object' || Array.isArray(from) || typeof to !== 'object' || Array.isArray(to)){
    return { kind: 'changed', fields: [], headline: null };
  }
  const { section } = pathParts(entry.path);
  const keys = [...new Set([...Object.keys(from), ...Object.keys(to)])].filter(k => !STAMPS.has(k));
  const fields = keys.filter(k => !same(from[k], to[k])).map(field => ({
    field,
    label: (section === 'plays' && PLAY_FIELD_LABEL[field]) || FIELD_LABEL[field] || both(field),
    from: shortValue(field, from[field], section),
    to: shortValue(field, to[field], section),
  }));
  return { kind: 'changed', fields, headline: null };
}

/* The one-line reading of a record that was created or removed. */
function headline(entry, record){
  const { section, layer } = pathParts(entry.path);
  if (!record || typeof record !== 'object' || Array.isArray(record)) return null;
  if (layer === 'held') return [`Practitioner view: grade ${record.grade}`, `从业者观点：评级${record.grade}`];
  if (section === 'grades') return [`Grade ${record.grade}, ${(TREND_LABEL[record.trend] || both(record.trend))[0].toLowerCase()}`, `评级${record.grade}，${(TREND_LABEL[record.trend] || both(record.trend))[1]}`];
  if (section === 'verdicts') return VERDICT_LABEL[record.call] || both(record.call);
  /* A play is named by its own label: route, hours and stage in one line. */
  if (section === 'plays') return Array.isArray(record.label) ? record.label : null;
  /* A trigger is already named by its label in the record line. What is worth
     saying here is whether it is a rule. */
  if (section === 'triggers') return Array.isArray(record.effect) && record.effect.length
    ? ['A rule: it carries a change that applies itself when its line is crossed.', '这是一条规则：越过阈值时，它所附的变更会自动执行。'] : null;
  return null;
}

/**
 * Who made a change, in words. A rule is named, because "a rule" is not an
 * answer to "who": the reader needs to know which of the analyst's rules.
 */
export function authorLine(entry, triggerLabel = null){
  const kind = entry.author?.kind;
  if (kind === 'rule'){
    const name = triggerLabel || both(entry.author.rule || entry.trigger || '?');
    return [`Rule: ${name[0]}`, `规则：${name[1]}`];
  }
  if (kind === 'agent'){
    const run = String(entry.author.run || entry.at).slice(0, 16).replace('T', ' ');
    return [`Agent run of ${run} UTC (${entry.author.model}, prompt ${entry.author.prompt})`,
            `智能体于 ${run} UTC 的运行（${entry.author.model}，提示词版本 ${entry.author.prompt}）`];
  }
  return AUTHOR_LABEL[kind] || ['Unknown author', '作者不详'];
}

/** The record a path names, in words: "Grade · Capital at risk · practitioner view". */
export function recordLabel(path, triggerLabel = null){
  const { section, key, layer } = pathParts(path);
  const parts = [SECTION_LABEL[section] || both(section)];
  if (section === 'grades' && key) parts.push(dimension(key)?.label || both(key));
  else if (section === 'verdicts' && key) parts.push(ARCHETYPES[key]?.label || both(key));
  else if (section === 'triggers' && key) parts.push(triggerLabel || both(key));
  else if (section === 'plays' && key) parts.push(triggerLabel || both(key));
  if (layer === 'held') parts.push(['practitioner view', '从业者观点']);
  return [parts.map(p => p[0]).join(' · '), parts.map(p => p[1]).join(' · ')];
}

/** Newest first, narrowed by market and by kind of author. Unknown filter values match nothing. */
export function filterChanges(entries, { market = null, author = null } = {}){
  return [...entries]
    .filter(e => (!market || e.market === market) && (!author || e.author?.kind === author))
    .sort((a, b) => String(b.at).localeCompare(String(a.at)));
}

/** The markets and author kinds that appear, with counts, for the filter controls. */
export function filterOptions(entries){
  const markets = new Map(), authors = new Map();
  for (const e of entries){
    markets.set(e.market, (markets.get(e.market) || 0) + 1);
    authors.set(e.author?.kind, (authors.get(e.author?.kind) || 0) + 1);
  }
  return {
    markets: [...markets].sort((a, b) => a[0].localeCompare(b[0])).map(([id, count]) => ({ id, count })),
    authors: AUTHOR_KINDS.map(id => ({ id, count: authors.get(id) || 0 })),
  };
}

/** The address of a filtered view. Filters live in the URL so a view can be linked. */
export function changesHref({ market = null, author = null } = {}){
  const params = new URLSearchParams();
  if (market) params.set('market', market);
  if (author) params.set('author', author);
  const query = params.toString();
  return '/changes' + (query ? `?${query}` : '');
}
