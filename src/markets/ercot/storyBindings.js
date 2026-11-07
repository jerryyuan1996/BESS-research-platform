/* Resolve the ERCOT story's tokens from existing case fields and the approved,
   fixed-vintage evidence records only (data/storyEvidence.js). No teaching
   control reaches these values, and no toll price is read or formatted here.
   Binding owners: ercot-build-evidence.md §4. */
import { HOME_BRIEFING } from '../../briefing/homeData.js';
import { playTitle } from '../../governance/playTitle.js';
import { tokensIn } from '../../experience/story/contract.js';
import { ERCOT_STORY_RECORDS } from './data/storyEvidence.js';
import { FIELD_BINDINGS } from './story.js';
import { ERCOT_TEACHING } from './story/teaching.js';

const finite = v => typeof v === 'number' && Number.isFinite(v);
const get = (object, path) => path.reduce((v, key) => v?.[key], object);
const num = v => v.toLocaleString('en-US');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function datePair(value) {
  if (!value) return null;
  const [y, m, d] = String(value).split('-');
  return d ? [`${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`, `${y}年${Number(m)}月${Number(d)}日`]
    : m ? [`${MONTHS[Number(m) - 1]} ${y}`, `${y}年${Number(m)}月`] : [y, `${y}年`];
}

/** A history record's date in both languages, at the precision it was recorded. */
export function historyWhen(id, records = ERCOT_STORY_RECORDS) {
  const r = records.history?.[id];
  if (!r) return null;
  const month = d => datePair(String(d).slice(0, 7));
  if (r.kind === 'closed-branch') {
    const [a, b] = [month(r.adoptedOn), datePair(r.closedOn)];
    return [`${a[0]} – ${b[0]}`, `${a[1]}至${b[1]}`];
  }
  if (r.datePrecision === 'year') return datePair(r.dates[0]);
  if (r.kind === 'event-range' || /adoption day/.test(r.datePrecision)) return month(r.dates[0]);
  return datePair(r.dates[0]);
}

const minutes = m => m < 60 ? [`${m} minutes`, `${m}分钟`]
  : [`${m / 60} hour${m === 60 ? '' : 's'}`, `${m / 60}小时`];
const PRODUCT = { regUp: ['Reg-Up', '上调调频'], rrs: ['Responsive Reserve', '响应备用'], ecrs: ['ECRS', 'ECRS'], nonSpin: ['Non-Spin', '非旋转备用'] };

/* Upward products only: Reg-Down has no accepted duration row and is never
   inferred from Reg-Up. Products sharing a duration are named together. */
export function durationRules(rules) {
  const rows = ['regUp', 'rrs', 'ecrs', 'nonSpin'].map(id => [id, rules?.[id]?.durationMinutes]);
  if (rows.some(([, m]) => !finite(m))) return null;
  const groups = [];
  for (const [id, m] of rows) {
    const g = groups.find(x => x.m === m);
    if (g) g.ids.push(id); else groups.push({ m, ids: [id] });
  }
  const join = (ids, i) => ids.map(id => PRODUCT[id][i]).join(i ? '与' : ' and ');
  return [
    groups.map(g => `${join(g.ids, 0)}, ${minutes(g.m)[0]}`).join('; '),
    groups.map(g => { const n = join(g.ids, 1); return `${n}${/[A-Za-z]$/.test(n) ? ' ' : ''}${minutes(g.m)[1]}`; }).join('；'),
  ];
}

/** Design cells shown in ercot-09: displayed, never repriced by a control. */
export function designCells(grid = HOME_BRIEFING.grids.ercot) {
  return (grid?.cells || []).map(cell => ({ ...cell,
    valueText: finite(cell.value) ? [`${cell.value < 0 ? '−' : '+'}$${Math.round(Math.abs(cell.value) / 1000)}k/MW`, `每MW ${cell.value < 0 ? '−' : '+'}${(Math.abs(cell.value) / 10000).toFixed(1)}万美元`] : null,
  }));
}

export function storyValues(row, ui = {}, evidence = ERCOT_STORY_RECORDS, teaching = ERCOT_TEACHING) {
  const values = {};
  for (const [token, { path, format }] of Object.entries(FIELD_BINDINGS)) {
    const [owner, ...parts] = path.split('.');
    const value = owner === 'R' ? get(row, parts)
      : owner === 'I' ? get(row?.investment, parts)
      : owner === 'E' ? get(evidence, parts)
      : owner === 'T' ? get(teaching, parts)
      : get(HOME_BRIEFING, parts);
    if (value === null || value === undefined) { values[token] = null; continue; }
    values[token] = format === 'call' ? ui.CALLS?.[value] ?? null
      : format === 'play' ? (ui.playTitle || playTitle)(value, row.stage)
      : format === 'return' ? (ui.returnPct && finite(value) ? ui.returnPct(value) : null)
      : format === 'margin' ? (ui.marginText ? ui.marginText(row) : null)
      : format === 'cardFigures' ? (ui.returnPct && ui.marginText && finite(value)
        ? [`Base all-equity IRR ${ui.returnPct(value)} · ${ui.marginText(row)[0]}`, `基准全股权IRR ${ui.returnPct(value)} · ${ui.marginText(row)[1]}`] : null)
      : format === 'share' ? (finite(value) ? `${Math.round(value * 100)}%` : null)
      : format === 'date' ? datePair(value)
      : format === 'mw' ? (finite(value) ? `${num(value)} MW` : null)
      : format === 'usdPerMWh' ? (finite(value) ? [`$${num(value)}/MWh`, `${num(value)}美元/MWh`] : null)
      : format === 'months' ? (finite(value) ? [`${value} months`, `${value}个月`] : null)
      : format === 'hours' ? (finite(value) ? [`${value} hours`, `${value}小时`] : null)
      /* "almost 37%": the monitor's qualifier stays with its figure. */
      : format === 'qualifiedPct' ? (finite(value.declineMagnitudePct) && value.qualifier === 'almost'
        ? [`almost ${value.declineMagnitudePct}%`, `近${value.declineMagnitudePct}%`] : null)
      /* "less than $0.02/MWh": a bound, never an exact value or zero. */
      : format === 'adderBound' ? (finite(value.averagePriceAdderUpperBoundUSDPerMWh) && value.comparator === 'lt'
        ? [`less than $${value.averagePriceAdderUpperBoundUSDPerMWh}/MWh`, `不到${value.averagePriceAdderUpperBoundUSDPerMWh}美元/MWh`] : null)
      : format === 'durationRules' ? durationRules(value)
      : format === 'clause' ? value.map(s => s.replace(/[.。]\s*$/, ''))
      : format === 'pair' ? value
      : String(value);
  }
  return values;
}

/** The story opens only for the fund lens and the reviewed call, play and duration. */
export function storyMatches(story, row, lens = 'infraFund') {
  return lens === 'infraFund' && row?.market?.manifest?.id === 'ercot'
    && row.play?.id === story.reviewedAgainst.playRef && row.play.hours === story.reviewedAgainst.hours
    && row.call === story.reviewedAgainst.call;
}

const missingIn = (text, values) => tokensIn(text).some(t => values[t] === null || values[t] === undefined);
const SPLIT = [/(?<=[.!?]["”]?)\s+/, /(?<=。)/];

/* A missing value hides the sentence that would print it, in both languages;
   it never prints zero, a dash or an old value. A string left with nothing to
   say falls back to a figure-free line. */
export function withoutMissing(pair, values, fallback = null) {
  if (!pair) return pair;
  const out = pair.map((text, i) => missingIn(text, values)
    ? text.split(SPLIT[i]).filter(s => !missingIn(s, values)).join(i ? '' : ' ').trim() : text);
  return out.some(s => !s) ? fallback : out;
}

export function storyWithAvailableValues(story, values) {
  const adapt = shot => ({ ...shot,
    copy: withoutMissing(shot.copy, values, ['Current case unavailable; review the market case.', '当前情景暂不可用；请查看市场方案。']),
    question: withoutMissing(shot.question, values, ['How does this mechanism work?', '这一机制如何运作？']),
    meaning: withoutMissing(shot.meaning, values, null),
    marker: shot.marker.change ? { ...shot.marker, change: withoutMissing(shot.marker.change, values, ['the next published evidence for this shot.', '本节下一份公开证据。']) } : shot.marker,
    labels: Object.fromEntries(Object.entries(shot.labels || {}).filter(([, p]) => !p.some(s => missingIn(s, values)))),
  });
  return { ...story, opening: adapt(story.opening), chapters: story.chapters.map(c => ({ ...c, shots: c.shots.map(adapt) })) };
}
