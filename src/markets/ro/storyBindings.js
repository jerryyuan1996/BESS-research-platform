/* ---------------------------------------------------------------------------
   Romania story tokens.

   Every value the script prints comes from here: an existing result field on
   the market row, a public model assumption on the row's comparison, or a
   fixed-vintage record in data/storyEvidence.js. Nothing is typed into the
   script, and nothing is computed that the model does not already publish.

   A record whose gate is open resolves to null, and a null token prints as an
   em dash (contract.js). No zeros stand in for a withheld observation.

   The four formatters below are the market card's conventions, mirrored rather
   than imported: a static import of src/experience/model.js would pull that
   module into the story chunk. tests/ro-story-content.test.js holds the mirror
   to the original's output on this market's own figures.
   --------------------------------------------------------------------------- */
import { HOME_BRIEFING } from '../../briefing/homeData.js';
import { playTitle } from '../../governance/playTitle.js';
import { fmtUSD } from '../../utils/formatting.js';
import { MARKERS, tokensIn } from '../../experience/story/contract.js';
import {
  RO_STORY_META, RO_STORY_SOURCES, RO_FLEET, RO_PLAN_2030, RO_BG_END_2025,
  RO_CONNECTION, RO_GRANT_RULES, eligibleFleetPoints, latestFleetPoint,
} from './data/storyEvidence.js';

const finite = (v) => typeof v === 'number' && Number.isFinite(v);
const pair = (v) => [v, v];
const number = (v) => finite(v) ? v.toLocaleString('en-US', { maximumFractionDigits: 2 }) : null;
/* The card's own formats: pct one decimal, share whole percent, money in m/k. */
const pct = (v) => finite(v) ? `${(v * 100).toFixed(1)}%` : '—';
const share = (v) => finite(v) ? `${Math.round(v * 100)}%` : null;
const money = (v, currency = 'EUR') => !finite(v) ? '—'
  : `${currency} ${Math.abs(v) >= 1e6 ? (v / 1e6).toFixed(2) + 'm' : (v / 1e3).toFixed(1) + 'k'}`;

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** An ISO year, month or day as an [en, zh] pair; precision is preserved. */
export function datePair(value){
  if (!value) return null;
  if (/^\d{4}$/.test(value)) return [value, `${value}年`];
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(value);
  if (!m) return null;
  const [, y, mo, d] = m;
  if (!d) return [`early ${MONTHS[Number(mo) - 1]} ${y}`, `${y}年${Number(mo)}月`];
  return [`${Number(d)} ${MONTHS[Number(mo) - 1]} ${y}`, `${y}年${Number(mo)}月${Number(d)}日`];
}

/* ---- the decision panel's figures, enumerated rather than pasted --------- */

/**
 * The ro-00 figures, one row each: the same fields the market page's decision
 * panel prints, in its order and with its formatters. The scene renders these
 * as labelled rows; `cardFigures` is their join, so no figure exists only as a
 * pre-composed string.
 */
export function cardRows(row, ui = {}){
  const i = row?.investment;
  if (!i) return [];
  const margin = typeof ui.marginText === 'function' ? ui.marginText(row) : null;
  const rows = [
    { key: 'baseIrr', label: ['Base all-equity IRR', '基准全股权IRR'], value: [pct(i.holdIRR), pct(i.holdIRR)], note: margin },
    { key: 'bearIrr', label: ['Declared downside IRR', '既定下行IRR'], value: [pct(i.bearHoldIRR), pct(i.bearHoldIRR)] },
    { key: 'peakEquity', label: ['Peak pre-COD equity / project', '投运前峰值股权资金／项目'], value: pair(money(i.peakEquityPerMW * i.powerMW, i.currency)) },
    { key: 'ceiling', label: ['Project-rights price ceiling / MW', '项目权利对价上限／MW'], value: i.maxPricePerMW == null ? ['No supported price', '尚不支持出价'] : pair(money(i.maxPricePerMW, i.currency)) },
    { key: 'operating', label: ['Buying operating', '收购在运资产'], value: operatingPrice(i) },
  ];
  return rows.filter(r => r.value && r.value[0]);
}

/** The page's operating-purchase line, formatted as src/experience/projectFacts.js does. */
export function operatingPrice(project){
  const o = project?.operatingPurchase;
  if (!o) return null;
  return o.maxPricePerMW > 0
    ? [`${money(o.maxPricePerMW, project.currency)}/MW for an operating asset at ${pct(o.targetReturn)}`,
      `按${pct(o.targetReturn)}目标，在运资产最高 ${money(o.maxPricePerMW, project.currency)}/MW`]
    : [`No price for an operating asset meets ${pct(o.targetReturn)}`, `在运资产无任何价格可达${pct(o.targetReturn)}目标`];
}

/* ---- the model path, from the four public owners ------------------------- */

/**
 * CALC-RO-PATH: basis 100 at the merchant-evidence year, multiplied by the
 * restate factor and each curve step from the model's first operating year,
 * held flat after the last step. No point is drawn between the basis year and
 * that year, because the model publishes no intermediate factor, and no euro
 * level is derived: the basis level came from a private-use mirror (MR-4).
 */
export function indexPath(comparison){
  const ev = comparison?.merchantEvidence;
  const economics = comparison?.economics;
  const curve = economics?.merchantCurve;
  const yearOne = economics?.merchantCurveBasis?.yearOne;
  if (!finite(ev?.year) || !finite(ev?.restateFactor) || !Array.isArray(curve) || !curve.length || !finite(yearOne)) return null;
  const base = 100;
  const points = [{ year: ev.year, value: base, kind: 'basis' }];
  for (let y = ev.year + 1; y < yearOne; y++) points.push({ year: y, value: null, kind: 'gap' });
  let last = null;
  curve.forEach((factor, k) => {
    last = base * ev.restateFactor * factor;
    points.push({ year: yearOne + k, value: last, kind: k ? 'model' : 'transition' });
  });
  const end = 2030;
  for (let y = yearOne + curve.length; y <= end; y++) points.push({ year: y, value: last, kind: 'tail' });
  return points;
}

/* ---- the source drawer --------------------------------------------------- */

const locatorText = (l) => {
  if (!l) return null;
  const parts = [];
  if (l.document) parts.push(l.document);
  if (l.pdfPage) parts.push('p. ' + [].concat(l.pdfPage).join(', '));
  if (l.table) parts.push(l.table);
  if (l.row) parts.push('row ' + l.row);
  if (l.column) parts.push('column ' + l.column);
  if (l.clause) parts.push(l.clause);
  return parts.join(' · ') || null;
};

/* Two records are repository files rather than documents a reader can open,
   and one announcement is linked from this market's own source register. The
   story links only what a reader can reach; SRC-RO-02 has no locatable URL and
   is therefore not a drawer entry (every value it supports is null). */
const DRAWER_OVERLAY = {
  'REPO-RO-LIVE': {
    title: 'This market page: decision panel, play card and design grid',
    url: '/markets/romania#bankable',
    locator: 'the selected infraFund row and its design grid, read at this build',
    checkedOn: RO_STORY_META.checkedOn,
  },
  'REPO-RO-MODEL': {
    title: "This platform's Romania model: merchant curve, duration response and cost stack",
    url: '/markets/romania#revenue',
    locator: 'the public assumption fields this story reads, not a market observation',
    checkedOn: RO_STORY_META.checkedOn,
  },
  'SRC-RO-17': {
    title: "Counterparty announcement of an optimiser's minimum-revenue guarantee",
    url: 'https://www.gen-igroup.com/news/gen-i-and-rpower-sign-long-term-optimisation-agreement-for-one-of-romania-s-largest-battery-energy-storage-projects/',
    locator: '4 February 2026; opening paragraphs. The story names no party, project or term',
    checkedOn: RO_STORY_META.checkedOn,
  },
};

/** The drawer's map: title, link, locator and check date, per cited source. */
export function storySources(){
  const out = { ...DRAWER_OVERLAY };
  for (const [id, source] of Object.entries(RO_STORY_SOURCES)){
    if (out[id]) continue;
    if (!source.url) continue;
    out[id] = {
      title: source.title,
      url: source.url,
      locator: locatorText(source.locator) || source.access,
      checkedOn: source.checkedOn,
    };
  }
  return out;
}

/** The selected source's own check date, for the drawer's "Checked on" line. */
export const sourceValues = (source) => ({ sourceCheckedDate: datePair(source?.checkedOn) });

/* ---- history ------------------------------------------------------------- */

export function historyValues(record){
  const dates = record.dates.map(d => datePair(d));
  return { historyNode: [dates.map(d => d[0]).join(' · '), dates.map(d => d[1]).join(' · ')] };
}

/* ---- the token map ------------------------------------------------------- */

export function storyValues(row, ui = {}){
  const i = row?.investment;
  const c = row?.market?.comparison;
  const hours = finite(row?.play?.hours) ? row.play.hours : null;
  const grid = HOME_BRIEFING.grids?.ro;
  const best = grid?.byRoute?.mer?.best;
  const bestCell = (grid?.cells || []).find(cell => cell.route === 'mer' && cell.hours === best);
  const longer = (grid?.cells || []).filter(cell => cell.route === 'mer' && finite(cell.hours) && cell.hours > (hours ?? 0))
    .sort((a, b) => a.hours - b.hours)[0];
  const rows = cardRows(row, ui);
  const latest = latestFleetPoint();
  const plan = RO_PLAN_2030;
  const bg = RO_BG_END_2025;
  const trigger = HOME_BRIEFING.triggers?.[row?.next];
  const triggerDate = datePair(trigger?.expected);

  return {
    call: ui.CALLS?.[row?.call] || null,
    playName: row?.play ? (ui.playTitle || playTitle)(row.play, row.stage) : null,
    cardFigures: rows.length ? [
      rows.map(r => r.value[0] + (r.note ? ` (${r.note[0]})` : '')).join(' · '),
      rows.map(r => r.value[1] + (r.note ? `（${r.note[1]}）` : '')).join(' · '),
    ] : null,
    nextAction: row?.play?.action?.text || null,
    playEvidence: MARKERS[row?.evidence] || null,
    securedShare: share(i?.secured),
    playDuration: finite(hours) ? String(hours) : null,
    bestMerchantDuration: finite(best) ? String(best) : null,
    longerMerchantDuration: finite(longer?.hours) ? String(longer.hours) : null,
    merchantValueBest: finite(bestCell?.value) ? fmtUSD(bestCell.value) : null,
    merchantValueLonger: finite(longer?.value) ? fmtUSD(longer.value) : null,
    valueIndexPath: indexPath(c),
    curveFirstYear: finite(c?.economics?.merchantCurveBasis?.yearOne) ? String(c.economics.merchantCurveBasis.yearOne) : null,
    optimiserFee: finite(c?.economics?.feePct) ? `${c.economics.feePct}%` : null,
    grantNote: c?.economics?.grantNote || null,
    nextTrigger: trigger ? [trigger.label[0] + (triggerDate ? ` · ${triggerDate[0]}` : ''), trigger.label[1] + (triggerDate ? ` · ${triggerDate[1]}` : '')] : null,
    fleetCount: finite(latest?.mw) ? `${number(latest.mw)} MW` : null,
    fleetCountDate: latest ? datePair(latest.date) : null,
    fleetObservations: eligibleFleetPoints(),
    fleetYearEndAdditions: finite(RO_FLEET.yearEnd.additionsMW) ? `${number(RO_FLEET.yearEnd.additionsMW)} MW` : null,
    plan2030Level: finite(plan.mw) ? [`${number(plan.mw)} MW / ${number(plan.mwh)} MWh · ${plan.year}`, `${number(plan.mw)}MW / ${number(plan.mwh)}MWh · ${plan.year}年`] : null,
    bgFleetEnd2025: finite(bg.mw) ? [`${number(bg.mw)} MW · end-${bg.year}`, `${number(bg.mw)}MW · ${bg.year}年末`] : null,
    auctionThreshold: finite(RO_CONNECTION.auctionThresholdMW) ? `${number(RO_CONNECTION.auctionThresholdMW)} MW` : null,
    grantBuildDeadline: finite(RO_GRANT_RULES.commissionWithinMonths) ? String(RO_GRANT_RULES.commissionWithinMonths) : null,
    grantOperationYears: finite(RO_GRANT_RULES.operateAtLeastYears) ? String(RO_GRANT_RULES.operateAtLeastYears) : null,
    researchCheckDate: datePair(RO_STORY_META.checkedOn),
    sourceCheckedDate: datePair(RO_STORY_META.checkedOn),
  };
}

/**
 * The signed-off figure-free fallback from the storyboard's shared vocabulary,
 * used when a financial binding is missing: the shot keeps its question and
 * its scene, and its prose says the case is unavailable rather than printing a
 * half-filled sentence.
 */
export function storyWithAvailableValues(story, values){
  const financial = new Set(['call', 'playName', 'cardFigures', 'nextAction', 'playDuration', 'securedShare']);
  const missing = [...financial].filter(k => values[k] === null || values[k] === undefined);
  if (!missing.length) return story;
  const set = new Set(missing);
  const fallback = story.text['Missing financial binding'];
  const adapt = (shot) => {
    const out = { ...shot };
    for (const key of ['question', 'copy', 'meaning']){
      if (shot[key]?.some(text => tokensIn(text).some(t => set.has(t)))) out[key] = fallback;
    }
    return out;
  };
  return {
    ...story,
    opening: adapt(story.opening),
    chapters: story.chapters.map(chapter => ({ ...chapter, shots: chapter.shots.map(adapt) })),
    missingBindings: missing,
  };
}
