/* ---------------------------------------------------------------------------
   THE BRIEFING'S SENTENCES — computed, in both languages.

   Every sentence the briefing writes on its own is made here, from figures the
   model hands it. None is stored: each build writes them again from the data,
   so they cannot go stale the way hand-written commentary does (the same
   argument home/findings.js makes for its readings). The analyst's own words —
   a thesis, a play's line, its next action — come from the view store and are
   never rewritten here.

   They state; they do not hedge. tests/briefing.test.js lints the English
   templates against HEDGE_WORDS in governance/briefing.js.

   Layering: no DOM, no engine. Pure functions of the values passed in.
   --------------------------------------------------------------------------- */

import { LENS_NOUN, TIER } from '../governance/briefing.js';
import { VERDICT_LABEL, ROUTE_LABEL, ARCHETYPE_IDS } from '../governance/investability.js';
import { REVENUE_ROUTE_LABEL } from '../governance/plays.js';

/* ---- names --------------------------------------------------------------------- */

/** How a sentence names a market. Shorter than the registry's names, which are titles. */
export const MARKET_NAME = {
  wa: ['Western Australia', '西澳'], nem: ['the NEM', '澳大利亚国家电力市场'], gb: ['Great Britain', '英国'],
  de: ['Germany', '德国'], it: ['Italy', '意大利'], ie: ['Ireland', '爱尔兰'], ro: ['Romania', '罗马尼亚'],
  pl: ['Poland', '波兰'], jp_tokyo: ['Tokyo', '东京'], jp_kyushu: ['Kyushu', '九州'], jp_hokkaido: ['Hokkaido', '北海道'],
  pjm: ['PJM', 'PJM'], ercot: ['ERCOT', 'ERCOT'], caiso: ['CAISO', 'CAISO'], fi: ['Finland', '芬兰'],
  ca_on: ['Ontario', '安大略'],
};
const JAPAN = ['jp_tokyo', 'jp_kyushu', 'jp_hokkaido'];

export const marketName = (id, fallback = null) => MARKET_NAME[id] || fallback || [id, id];

/** How many names a list reads as: three Japanese areas are one name, Japan. */
export function marketCount(ids){
  const unique = [...new Set(ids)];
  const allJapan = JAPAN.every(id => unique.includes(id));
  return allJapan ? unique.length - JAPAN.length + 1 : unique.length;
}

const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
/** "Nine", not "9", in a sentence about ten things or fewer. */
export const countWord = (n, capital = false) => {
  const word = n <= 10 ? WORDS[n] : String(n);
  return capital ? word.charAt(0).toUpperCase() + word.slice(1) : word;
};

const ZH_WORDS = ['零', '一', '两', '三', '四', '五', '六', '七', '八', '九', '十'];
/** "九个", not "9个". */
export const countZh = (n) => (n <= 10 ? ZH_WORDS[n] : String(n));

/**
 * A name inside a sentence: "Capacity market" reads "capacity market";
 * "Reserve Capacity Mechanism" and "MACSE" keep their capitals.
 */
export function inSentence(name){
  const words = String(name).split(' ');
  const first = words[0].replace(/[^A-Za-z0-9]/g, '');
  const proper = words.slice(1).some(w => /^[A-Z]/.test(w)) || /^[A-Z0-9]{2,}$/.test(first);
  return proper ? name : name.charAt(0).toLowerCase() + name.slice(1);
}

/** "Ireland and Japan", "爱尔兰和日本": the three Japanese areas read as Japan when all three are there. */
export function marketList(ids){
  const unique = [...new Set(ids)];
  const names = [];
  const allJapan = JAPAN.every(id => unique.includes(id));
  for (const id of unique){
    if (allJapan && JAPAN.includes(id)){
      if (id === JAPAN.find(j => unique.includes(j))) names.push(['Japan', '日本']);
      continue;
    }
    names.push(marketName(id));
  }
  const join = (lang) => {
    const words = names.map(n => n[lang]);
    if (words.length <= 1) return words.join('');
    if (lang === 1) return `${words.slice(0, -1).join('、')}和${words[words.length - 1]}`;
    return `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`;
  };
  return [join(0), join(1)];
}

/* ---- numbers -------------------------------------------------------------------- */

export const percent = (x) => (x === null || x === undefined ? '—' : `${x < 0 ? '−' : ''}${Math.abs(100 * x).toFixed(1)}%`);

/** "+$295k" per MW, "每MW +29.5万美元". */
export function perMW(value){
  if (value === null || value === undefined) return ['—', '—'];
  const sign = value >= 0 ? '+' : '−';
  const k = Math.round(Math.abs(value) / 1000);
  return [`${sign}$${k}k/MW`, `每MW ${sign}${(Math.abs(value) / 10000).toFixed(1)}万美元`];
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** "24 November 2026" / "2026年11月24日"; a bare month reads as the month. */
export function dateText(when){
  if (!when) return ['undated', '未定日期'];
  const [y, m, d] = when.split('-').map(Number);
  if (!d) return [`${MONTHS[m - 1]} ${y}`, `${y}年${m}月`];
  return [`${d} ${MONTHS[m - 1]} ${y}`, `${y}年${m}月${d}日`];
}

/** A play as a sentence names it: "Italy · Capacity market · 4h · ready-to-build". */
export const playName = (marketId, play) => [
  `${marketName(marketId)[0]} · ${play.label[0]}`,
  `${marketName(marketId)[1]} · ${play.label[1]}`,
];

/* ---- the call ------------------------------------------------------------------ */

/**
 * The opening of the briefing: what an investor should do across the
 * platform, in at most five sentences.
 *
 * @param rows      the ordered shortlist, each with `econ` and `play` attached
 * @param archetype the lens
 * @param next      the next decisive trigger { label, expected } or null
 */
export function callSentence(rows, archetype, next, returnField){
  const noun = LENS_NOUN[archetype] || LENS_NOUN.infraFund;
  const by = (tier) => rows.filter(r => r.tier === tier);
  const en = [], zh = [];
  const ret = (r) => percent(r.econ[returnField]);
  const retName = returnField === 'exit' ? ['exit IRR', '退出IRR'] : ['hold IRR', '持有期IRR'];

  const pursue = by(TIER.PURSUE);
  if (pursue.length === 1){
    const r = pursue[0], name = playName(r.market, r.play), v = perMW(r.econ.value);
    en.push(`One play clears ${noun[0]}'s bar today: ${name[0]}, at ${ret(r)} ${retName[0]} and ${v[0]}.`);
    zh.push(`今天有一个方案达到${noun[1]}的门槛：${name[1]}，${retName[1]} ${ret(r)}，${v[1]}。`);
  } else if (pursue.length > 1){
    const r = pursue[0], name = playName(r.market, r.play);
    en.push(`${countWord(pursue.length, true)} plays clear ${noun[0]}'s bar today, led by ${name[0]} at ${ret(r)} ${retName[0]}.`);
    zh.push(`今天有${countZh(pursue.length)}个方案达到${noun[1]}的门槛，以${name[1]}为首，${retName[1]} ${ret(r)}。`);
  } else {
    en.push(`No play clears ${noun[0]}'s bar today.`);
    zh.push(`今天没有方案达到${noun[1]}的门槛。`);
  }

  const prepare = by(TIER.PREPARE);
  if (prepare.length){
    const waiting = prepare.filter(r => r.flag);
    const ready = marketList(prepare.map(r => r.market));
    if (waiting.length){
      const late = marketList(waiting.map(r => r.market));
      const notPriced = waiting.some(r => !r.econ.priced || r.econ.eligible === false);
      const why = notPriced ? ['a design that holds its floor', '满足下限的设计'] : ['economics that support the call', '支持该结论的经济性'];
      en.push(`Prepare in ${ready[0]}; ${late[0]} ${marketCount(waiting.map(r => r.market)) === 1 ? 'waits' : 'wait'} on ${why[0]}.`);
      zh.push(`在${ready[1]}提前布局；${late[1]}尚待${why[1]}。`);
    } else {
      en.push(`Prepare in ${ready[0]}.`);
      zh.push(`在${ready[1]}提前布局。`);
    }
  }

  const situational = by(TIER.SITUATIONAL);
  if (situational.length){
    const leaders = situational.filter(r => r.econ.priced && r.econ.eligible && r.econ.value > 0).slice(0, 3);
    const lead = leaders.length ? marketList(leaders.map(r => r.market)) : null;
    const leadVerb = lead && marketCount(leaders.map(r => r.market)) === 1 ? 'leads' : 'lead';
    en.push(`${situational.length === 1 ? 'One play is' : `${countWord(situational.length, true)} plays are`} situational: act only on a named asset or seller${lead ? `; ${lead[0]} ${leadVerb} on value` : ''}.`);
    zh.push(`${countZh(situational.length)}个方案属择机而动：只针对指定的资产或卖方行动${lead ? `；${lead[1]}价值领先` : ''}。`);
  }

  const watch = by(TIER.WATCH);
  if (watch.length){
    const list = marketList(watch.map(r => r.market));
    en.push(`Watch ${list[0]}.`);
    zh.push(`观望${list[1]}。`);
  }

  const park = by(TIER.PARK);
  if (park.length){
    const list = marketList(park.map(r => r.market));
    en.push(`${list[0]} ${marketCount(park.map(r => r.market)) === 1 ? 'is' : 'are'} closed to ${noun[0]}.`);
    zh.push(`${list[1]}对${noun[1]}不开放。`);
  }

  if (next){
    const d = dateText(next.expected);
    en.push(`Next decisive date: ${d[0]}. ${next.label[0]}.`);
    zh.push(`下一个关键日期：${d[1]}，${next.label[1]}。`);
  }
  return [en.join(' '), zh.join('')];
}

/* ---- what to build ------------------------------------------------------------- */

/** A market's name for each route: the first part of a play's label where one is written, else the generic name. */
export function routeNames(plays){
  const names = { ...REVENUE_ROUTE_LABEL };
  for (const p of plays){
    if (p.implicit) continue;
    names[p.route] = [p.label[0].split(' · ')[0], p.label[1].split(' · ')[0]];
  }
  return names;
}

/**
 * One line on what to build in a market: the best design and its band, and
 * what the modelled design gives up. When nothing clears the platform's yields
 * it says so, and names the design that comes closest; when the market's own
 * route fails its duration floor it says what would hold it. The why is the
 * play's own line.
 *
 * @param baseRoute  the route the market is priced on by default
 */
export function buildLine(marketId, fit, withheld, names, baseRoute = null){
  const name = marketName(marketId);
  if (withheld) return [`${name[0]}: not priced; the engine withholds this market.`, `${name[1]}：未定价，引擎暂不对该市场估值。`];
  const nameOf = (route) => names[route] || [route, route];

  /* The market's own route cannot be built as modelled: say what would hold its floor. */
  const base = baseRoute ? fit?.byRoute?.[baseRoute] : null;
  if (base && !base.best && base.requiredHours){
    const r = nameOf(baseRoute), req = base.requiredHours.toFixed(1);
    return [
      `${name[0]}: no compliant ${inSentence(r[0])} design is priced; about ${req}h installed would hold the floor to the end of the term.`,
      `${name[1]}：尚无合规的${r[1]}设计被定价；约${req}小时装机方可在整个合同期内维持下限。`,
    ];
  }
  if (!fit?.best){
    return [`${name[0]}: no compliant design is priced.`, `${name[1]}：尚无合规设计被定价。`];
  }

  const route = nameOf(fit.best.route);
  const bandHours = fit.byRoute?.[fit.best.route]?.band || [];
  const band = bandHours.length > 1 ? [` (band ${Math.min(...bandHours)}–${Math.max(...bandHours)}h)`, `（区间${Math.min(...bandHours)}–${Math.max(...bandHours)}小时）`] : ['', ''];
  const value = perMW(fit.best.value);
  if (fit.best.value < 0){
    return [
      `${name[0]}: nothing clears the platform's yields; ${inSentence(route[0])} at ${fit.best.hours}h comes closest, at ${value[0]}.`,
      `${name[1]}：没有设计能达到平台收益率；${route[1]}${fit.best.hours}小时最为接近，${value[1]}。`,
    ];
  }
  const a = fit.archetype;
  let extra = ['', ''];
  if (a && a.inBand === false && a.valueGivenUp > 0){
    const archRoute = nameOf(a.route);
    const given = perMW(a.valueGivenUp);
    extra = [`; the modelled ${inSentence(archRoute[0])} ${a.hours}h gives up ${given[0].replace('+', '')}`,
      `；模型中的${archRoute[1]}${a.hours}小时设计每MW少赚${(a.valueGivenUp / 10000).toFixed(1)}万美元`];
  }
  return [
    `${name[0]}: ${route[0]} at ${fit.best.hours}h${band[0]}, ${value[0]}${extra[0]}.`,
    `${name[1]}：${route[1]}${fit.best.hours}小时${band[1]}，${value[1]}${extra[1]}。`,
  ];
}

/* ---- changes, flags and the queue ------------------------------------------------ */

const lensLabel = (archetype) => ({
  infraFund: ['fund', '基金'], strategic: ['strategic', '战略投资者'],
  foreignFirstTimer: ['first-time foreign', '首次进入的外国投资者'], developer: ['developer', '开发商'],
}[archetype] || [archetype, archetype]);

const callLabel = (call) => VERDICT_LABEL[call] || [call, call];

export const changeText = {
  callMoved: (market, archetype, from, to) => {
    const m = marketName(market), l = lensLabel(archetype), a = callLabel(from), b = callLabel(to);
    return [`${m[0]}, ${l[0]} call: ${a[0]} → ${b[0]}.`, `${m[1]}，${l[1]}结论：${a[1]} → ${b[1]}。`];
  },
  callNew: (market, archetype, to) => {
    const m = marketName(market), l = lensLabel(archetype), b = callLabel(to);
    return [`${m[0]}, ${l[0]} call set: ${b[0]}.`, `${m[1]}，${l[1]}结论设定为：${b[1]}。`];
  },
  callWithdrawn: (market, archetype) => {
    const m = marketName(market), l = lensLabel(archetype);
    return [`${m[0]}, ${l[0]} call withdrawn.`, `${m[1]}，${l[1]}结论撤回。`];
  },
  wayIn: (market, archetype, from, to) => {
    const m = marketName(market), l = lensLabel(archetype), a = ROUTE_LABEL[from] || [from, from], b = ROUTE_LABEL[to] || [to, to];
    return [`${m[0]}, ${l[0]}: enters ${b[0].toLowerCase()}, not ${a[0].toLowerCase()}.`, `${m[1]}，${l[1]}：改为以${b[1]}方式进入，而非${a[1]}。`];
  },
  playSwitched: (market, archetype, label) => {
    const m = marketName(market), l = lensLabel(archetype);
    return [`${m[0]}, ${l[0]} call now on ${label[0]}.`, `${m[1]}，${l[1]}结论现针对${label[1]}。`];
  },
  playAdded: (market, label) => [`${marketName(market)[0]}: new play, ${label[0]}.`, `${marketName(market)[1]}：新增方案，${label[1]}。`],
  playDropped: (market, label) => [`${marketName(market)[0]}: play dropped, ${label[0]}.`, `${marketName(market)[1]}：方案撤销，${label[1]}。`],
  playRedesigned: (market, from, to) => [`${marketName(market)[0]}: play redesigned, ${from[0]} → ${to[0]}.`, `${marketName(market)[1]}：方案调整，${from[1]} → ${to[1]}。`],
  thesis: (market) => [`${marketName(market)[0]}: thesis rewritten.`, `${marketName(market)[1]}：投资论点已更新。`],
  catalystAdded: (market, label, expected) => {
    const d = dateText(expected);
    return [`${marketName(market)[0]}: new catalyst, ${label[0]} (${d[0]}).`, `${marketName(market)[1]}：新增触发事件，${label[1]}（${d[1]}）。`];
  },
  catalystMoved: (market, label, expected) => {
    const d = dateText(expected);
    return [`${marketName(market)[0]}: ${label[0]} now expected ${d[0]}.`, `${marketName(market)[1]}：${label[1]}，现预计${d[1]}。`];
  },
  catalystHappened: (market, label, text) => [`${marketName(market)[0]}: ${label[0]}. ${text[0]}`, `${marketName(market)[1]}：${label[1]}。${text[1]}`],
  catalystDropped: (market, label) => [`${marketName(market)[0]}: catalyst dropped, ${label[0]}.`, `${marketName(market)[1]}：触发事件撤销，${label[1]}。`],
  catalystDue: (market, label, expected) => {
    const d = dateText(expected);
    return [`${marketName(market)[0]}: ${label[0]} was due ${d[0]}; its outcome is not recorded yet.`, `${marketName(market)[1]}：${label[1]}原定${d[1]}，结果尚未录入。`];
  },
  spreadMoved: (market, share, recent, average, unit, lastDay) => {
    const dir = share > 0 ? ['up', '上升'] : ['down', '下降'];
    const pct = Math.round(Math.abs(share) * 100);
    const d = dateText(lastDay);
    return [
      `${marketName(market)[0]}: the daily price spread was ${dir[0]} ${pct}% in the week to ${d[0]}, at ${recent} against a 90-day average of ${average} ${unit}.`,
      `${marketName(market)[1]}：截至${d[1]}的一周，日内价差${dir[1]}${pct}%，为${recent}，90日均值为${average} ${unit}。`,
    ];
  },
};

export const flagText = {
  ahead: (econ) => (!econ.priced || econ.eligible === false
    ? ['No compliant design is priced, so the call runs ahead of the economics.', '尚无合规设计被定价，结论领先于经济性。']
    : ['The design destroys value at the platform\'s yields, so the call runs ahead of the economics.', '按平台收益率该设计损毁价值，结论领先于经济性。']),
  behind: () => ['The design is in the top third by value, so the call runs behind the economics.', '该设计价值位列前三分之一，结论落后于经济性。'],
};

export const queueText = {
  overdue: (market, label, expected) => {
    const d = dateText(expected);
    return [`Record what happened: ${marketName(market)[0]}, ${label[0]} (due ${d[0]}).`, `录入结果：${marketName(market)[1]}，${label[1]}（原定${d[1]}）。`];
  },
  soon: (market, label, expected) => {
    const d = dateText(expected);
    return [`Due ${d[0]}: ${marketName(market)[0]}, ${label[0]}. Be ready to record its outcome.`, `${d[1]}到期：${marketName(market)[1]}，${label[1]}。请准备录入结果。`];
  },
  review: (market, archetype, reviewBy, playLabel = null) => {
    const d = dateText(reviewBy), l = lensLabel(archetype);
    const on = playLabel ? [` on ${playLabel[0]}`, `（${playLabel[1]}）`] : ['', ''];
    return [`Review the ${l[0]} call in ${marketName(market)[0]}${on[0]} by ${d[0]}.`, `请于${d[1]}前复核${marketName(market)[1]}的${l[1]}结论${on[1]}。`];
  },
  heldReview: (market, dimension, reviewBy) => {
    const d = dateText(reviewBy);
    return [`Review the held view on ${dimension[0]} in ${marketName(market)[0]} by ${d[0]}.`, `请于${d[1]}前复核${marketName(market)[1]}关于${dimension[1]}的持有观点。`];
  },
  disagreement: (market, archetype, flag, playLabel) => {
    const l = lensLabel(archetype);
    const what = flag === 'ahead' ? ['runs ahead of', '领先于'] : ['runs behind', '落后于'];
    return [`${marketName(market)[0]}: the ${l[0]} call on ${playLabel[0]} ${what[0]} the economics.`, `${marketName(market)[1]}：${l[1]}对${playLabel[1]}的结论${what[1]}经济性。`];
  },
  ruleNear: (market, label, observed, threshold, crossed) => (crossed
    ? [`${marketName(market)[0]}: ${label[0]}: the tested figure reads ${observed} against a line of ${threshold}; the rule fires on the next refresh.`,
       `${marketName(market)[1]}：${label[1]}：检验值为${observed}，阈值为${threshold}；该规则将在下次刷新时触发。`]
    : [`${marketName(market)[0]}: ${label[0]}: the tested figure reads ${observed}, within 10% of its line of ${threshold}.`,
       `${marketName(market)[1]}：${label[1]}：检验值为${observed}，距阈值${threshold}不足10%。`]),
  staleFeed: (dataset, label) => [`Feed ${dataset} is stale: ${label[0]}.`, `数据源${dataset}已过期：${label[1]}。`],
  actionOverdue: (market, playLabel, text, due) => {
    const d = dateText(due);
    return [`Overdue since ${d[0]}: ${marketName(market)[0]} · ${playLabel[0]}: ${text[0]}`, `自${d[1]}起逾期：${marketName(market)[1]} · ${playLabel[1]}：${text[1]}`];
  },
  staleReason: (market, dimension, quoted, engine) => [
    `${marketName(market)[0]}: the ${dimension[0]} grade's reason quotes ${quoted}; the engine now gives ${engine}.`,
    `${marketName(market)[1]}：${dimension[1]}评级理由引用${quoted}；引擎目前为${engine}。`,
  ],
};

export { ARCHETYPE_IDS };
