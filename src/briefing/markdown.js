/* ---------------------------------------------------------------------------
   THE WEEKLY DIGEST — the briefing as Markdown, for a GitHub issue.

   The same briefing object the home page reads (model.js), rendered for the
   weekly issue (plan decision 7): the call, what changed in the last week,
   what is coming, the shortlist, what to build, the next actions and the
   analyst's queue — with links into the site for the five-minute brief.

   English first, then the whole of it again in Chinese inside a <details>
   block, so the issue is bilingual without being twice as long to scan.

   Layering: no DOM, no engine. A pure function of the briefing.
   --------------------------------------------------------------------------- */

import { TIER_LABEL, EVIDENCE_LABEL, CHANGE_CLASS_ORDER, CATALYST_WINDOW_DAYS } from '../governance/briefing.js';
import { TRIGGER_DIRECTION_LABEL } from '../governance/triggers.js';
import { percent, perMW, dateText, marketName } from './sentences.js';

export const SITE_URL = 'https://globalbess.vercel.app';
const DAY = 86_400_000;
const ARROW = { up: '↗', down: '↘', either: '↔' };

/** The Monday of the reader's week, in Perth (UTC+8), where the digest is read. */
export function weekOf(now){
  const perth = new Date(now.getTime() + 8 * 3_600_000);
  const day = perth.getUTCDay();
  const monday = new Date(perth.getTime() - ((day + 6) % 7) * DAY);
  return monday.toISOString().slice(0, 10);
}

const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');

function renderLang(b, lens, days, siteUrl, lang){
  const t = (pair) => (Array.isArray(pair) ? pair[lang] : pair);
  const L = (en, zh) => (lang === 0 ? en : zh);
  const view = b.lenses[lens];
  const now = new Date(b.builtAt);
  const since = new Date(now.getTime() - days * DAY).toISOString();
  const marketLink = (id) => `[${t(marketName(id))}](${siteUrl}/markets/${b.markets[id]?.slug ?? id})`;
  const lines = [];

  lines.push(L('## The call', '## 结论'), '', t(view.call), '');

  const changes = b.changes.filter(c => c.at >= since && (!c.archetype || c.archetype === lens))
    .sort((a, c) => CHANGE_CLASS_ORDER.indexOf(a.cls) - CHANGE_CLASS_ORDER.indexOf(c.cls) || c.at.localeCompare(a.at));
  lines.push(L(`## What changed in the last ${days} days`, `## 过去${days}天的变化`), '');
  if (!changes.length) lines.push(L('Nothing material.', '没有重要变化。'));
  for (const c of changes.slice(0, 12)){
    const day = c.at.slice(0, 10);
    if (c.cls === 'news') lines.push(`- ${day} · ${c.markets.map(m => t(marketName(m))).join(', ')} · [${cell(c.title)}](${c.url}) (${c.publisher})`);
    else lines.push(`- ${day} · ${t(c.text)}`);
  }
  if (changes.length > 12) lines.push(L(`- …and ${changes.length - 12} more on [/changes](${siteUrl}/changes).`, `- ……另有${changes.length - 12}条，见[/changes](${siteUrl}/changes)。`));
  lines.push('');

  const horizon = new Date(now.getTime() + CATALYST_WINDOW_DAYS * DAY).toISOString().slice(0, 10);
  const coming = b.catalysts.map(id => b.triggers[id]).filter(x => (x.expected.length === 7 ? `${x.expected}-01` : x.expected) <= horizon);
  lines.push(L(`## What's coming in ${CATALYST_WINDOW_DAYS} days`, `## 未来${CATALYST_WINDOW_DAYS}天`), '');
  if (!coming.length) lines.push(L('No dated catalyst.', '没有已定日期的触发事件。'));
  for (const x of coming){
    lines.push(`- ${t(dateText(x.expected))} · ${marketLink(x.market)} · ${t(x.label)} ${ARROW[x.direction] || ''} ${t(TRIGGER_DIRECTION_LABEL[x.direction] || ['', ''])}`.trimEnd());
  }
  lines.push('');

  const ret = view.returnField === 'exit' ? L('Exit IRR', '退出IRR') : L('Hold IRR', '持有期IRR');
  lines.push(L('## Where to focus', '## 重点方向'), '',
    `| ${L('Tier', '层级')} | ${L('Play', '方案')} | ${L('Value/MW', '每MW价值')} | ${ret} | ${L('Secured', '锁定收入')} | ${L('Evidence', '证据')} | ${L('Next', '下一事件')} |`,
    '|---|---|---|---|---|---|---|');
  for (const r of view.rows){
    const p = b.plays[`${r.market}/${r.play}`];
    const e = p.econ;
    const value = e.withheld ? L('not priced', '未定价') : !e.eligible ? L('not compliant', '不合规') : t(perMW(e.value));
    const secured = e.secured === null || e.secured === undefined ? '—' : `${percent(e.secured)}${e.securedYears ? ` / ${e.securedYears}${L('y', '年')}` : ''}`;
    const next = r.next ? `${t(b.triggers[r.next].label)} (${t(dateText(b.triggers[r.next].expected))})` : '—';
    const flag = r.flag ? ` ⚑ ${t(r.flagText)}` : '';
    lines.push(`| ${t(TIER_LABEL[r.tier])} | ${marketLink(r.market)} · ${cell(t(p.label))}${r.own ? L(' (own call)', '（独立结论）') : ''}${cell(flag)} | ${value} | ${percent(e[view.returnField])} | ${secured} | ${t(EVIDENCE_LABEL[r.evidence])} | ${cell(next)} |`);
  }
  lines.push('');

  lines.push(L('## What to build', '## 应建什么'), '');
  const rates=Object.values(b.plays).map(p=>p.econ?.valuationRates).find(Boolean);
  if(rates) lines.push(L(
    `Valuation rates: secured ${percent(rates.secured)}, unawarded renewals ${percent(rates.renewal)}, merchant ${percent(rates.merchant)}. Exit is measured from operations.`,
    `估值折现率：锁定收入${percent(rates.secured)}、未中标续约收入${percent(rates.renewal)}、市场化收入${percent(rates.merchant)}。退出年度从投运起算。`),'');
  for (const x of b.build) lines.push(`- ${t(x.line)}`);
  lines.push('');

  lines.push(L('## Your next actions', '## 下一步行动'), '');
  if (!view.actions.length) lines.push(L('None dated.', '暂无。'));
  for (const a of view.actions){
    const p = b.plays[`${a.market}/${a.play}`];
    lines.push(`- ${a.due ? `**${t(dateText(a.due))}** · ` : ''}${marketLink(a.market)} · ${t(p.label)}: ${t(a.text)}`);
  }
  lines.push('');

  const mine = b.queue.filter(q => q.kind !== 'disagreement' || q.archetype === lens);
  const others = b.queue.length - mine.length;
  lines.push(L(`## Analyst queue (${mine.length})`, `## 分析师待办（${mine.length}）`), '');
  for (const q of mine) lines.push(`- ${t(q.text)} \`${q.path}\``);
  if (others) lines.push(L(`- ${others} more for the other investors on [/desk](${siteUrl}/desk).`, `- 其他投资者另有${others}条，见[/desk](${siteUrl}/desk)。`));
  lines.push('');
  return lines;
}

/** The digest as Markdown. */
export function renderDigest(briefing, { lens = briefing.defaultLens, days = 7, siteUrl = SITE_URL } = {}){
  const now = new Date(briefing.builtAt);
  const head = [
    `# Briefing — week of ${weekOf(now)}`, '',
    `Infrastructure-fund lens · built ${briefing.builtAt.slice(0, 16).replace('T', ' ')} UTC · [open the briefing](${siteUrl}/)`, '',
  ];
  return [
    ...head,
    ...renderLang(briefing, lens, days, siteUrl, 0),
    '<details><summary>中文</summary>', '',
    ...renderLang(briefing, lens, days, siteUrl, 1),
    '</details>', '',
  ].join('\n');
}
