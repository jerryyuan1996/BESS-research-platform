/* Resolve the NEM story's tokens from existing case fields and the approved,
   fixed-vintage evidence only. No teaching control reaches these values. */
import { HOME_BRIEFING } from '../../briefing/homeData.js';
import { playTitle, STAGE_WORD } from '../../governance/playTitle.js';
import { tokensIn } from '../../experience/story/contract.js';
import { NEM_STORY_VALUES as E } from './data/storyEvidenceValues.js';
import { FIELD_BINDINGS } from './story.js';

const finite = v => typeof v === 'number' && Number.isFinite(v);
const get = (object, path) => path.reduce((v, key) => v?.[key], object);
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export function datePair(value) {
  if (!value) return null;
  const [y, m, d] = String(value).split('-');
  return d ? [`${Number(d)} ${MONTHS[Number(m)-1]} ${y}`, `${y}年${Number(m)}月${Number(d)}日`]
    : m ? [`${MONTHS[Number(m)-1]} ${y}`, `${y}年${Number(m)}月`] : [y, `${y}年`];
}
const money = v => finite(v) ? `AUD ${v >= 1e6 ? (v/1e6).toFixed(2)+'m' : (v/1e3).toFixed(1)+'k'}/MW` : null;
const spread = v => finite(v) ? [`$${Math.round(v)}/MWh`, `${Math.round(v)}澳元/MWh`] : null;

/** The trigger the call watches, read from the briefing; never typed. */
export const watchedTrigger = row => HOME_BRIEFING.triggers?.[row?.next] ?? null;

/** Design cells shown in nem-08: displayed, never repriced by a control. */
export function designCells() {
  const grid = HOME_BRIEFING.grids.nem;
  return (grid?.cells || []).map(cell => ({ ...cell,
    valueText: finite(cell.value) ? [`${cell.value<0?'−':'+'}$${Math.round(Math.abs(cell.value)/1000)}k/MW`, `每MW ${cell.value<0?'−':'+'}${(Math.abs(cell.value)/10000).toFixed(1)}万美元`] : null,
  }));
}

export function storyValues(row, ui = {}, evidence = E) {
  const values = {};
  for (const [token, { path, format }] of Object.entries(FIELD_BINDINGS)) {
    const [owner, ...parts] = path.split('.');
    let value = owner === 'R' ? get(row, parts)
      : owner === 'E' ? get(evidence, parts)
      : path === 'B.build.nem.line' ? HOME_BRIEFING.build.find(x => x.market === 'nem')?.line
      : format === 'trigger' ? watchedTrigger(row)
      : get(HOME_BRIEFING, parts);
    if (value === null || value === undefined) { values[token] = null; continue; }
    values[token] = format === 'call' ? ui.CALLS?.[value] ?? null
      : format === 'play' ? (ui.playTitle || playTitle)(value, row.stage)
      : format === 'stage' ? STAGE_WORD[value] ?? null
      : format === 'marker' ? String(value)
      : format === 'share' ? (finite(value) ? `${Math.round(value*100)}%` : null)
      : format === 'share1' ? (finite(value) ? `${(value*100).toFixed(1)}%` : null)
      : format === 'return' ? (ui.returnPct ? ui.returnPct(value) : finite(value) ? `${(value*100).toFixed(1)}%` : null)
      : format === 'money' ? money(value)
      : format === 'gwh' ? (finite(value) ? `${value.toFixed(1)} GWh` : null)
      : format === 'mwFirst' ? (finite(value[0]) ? `${Math.round(value[0])} MW` : null)
      : format === 'mwLast' ? (finite(value.at(-1)) ? `${Math.round(value.at(-1))} MW` : null)
      : format === 'spread' ? spread(value)
      : format === 'spreadFirst' ? spread(value[0])
      : format === 'spreadLast' ? spread(value.at(-1))
      : format === 'date' ? datePair(value)
      : format === 'trigger' ? [`${value.label[0]} · ${datePair(value.expected)[0]}`, `${value.label[1]} · ${datePair(value.expected)[1]}`]
      /* Zero in words; the Chinese carries its own verb (尚无一份 / 有N份) so the
         sentence reads in both cases. Analyst decision 4, 5 November 2026. */
      : format === 'countWords' ? (value === 0 ? ['none', '尚无一份'] : [String(value), `有${value}份`])
      : format === 'clause' ? value.map(s => s.replace(/[.。]\s*$/, ''))
      : format === 'list' ? value.join(' / ')
      : format === 'pair' ? value
      : String(value);
  }
  return values;
}

export function storyMatches(story, row, lens = 'infraFund') {
  return lens === 'infraFund' && row?.market?.manifest?.id === 'nem'
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
    copy: withoutMissing(shot.copy, values, ['Current evidence unavailable; read the research context.', '当前证据暂不可用；请阅读研究背景。']),
    question: withoutMissing(shot.question, values, ['How does this mechanism work?', '这一机制如何运作？']),
    meaning: withoutMissing(shot.meaning, values, null),
    labels: Object.fromEntries(Object.entries(shot.labels || {}).filter(([, p]) => !p.some(s => missingIn(s, values)))),
  });
  return { ...story, opening: adapt(story.opening), chapters: story.chapters.map(c => ({ ...c, shots: c.shots.map(adapt) })) };
}
