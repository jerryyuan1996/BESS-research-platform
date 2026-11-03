/* ---------------------------------------------------------------------------
   Poland story tokens.

   Every value the script prints comes from here: an existing result field on
   the market row, the briefing row the market verdict names, or a fixed-vintage
   record in data/capacityAuctions.js. Nothing is typed into the script, and
   nothing is computed that the model does not already publish.

   TWO CARDS, TWO OWNERS. `row` is the grant row the page passes; `v` is the
   same-lens ordinary-capacity row that storyRowsFor builds from the briefing.
   They keep their own call, title, action and evidence, and the capacity row
   carries no investment object at all — which is what stops the grant's
   financial case appearing on it.

   A record whose gate is open resolves to null, and the page replaces the
   sentence that would have printed it (storyForPage) rather than printing a
   zero or an em dash inside prose.
   --------------------------------------------------------------------------- */
import { HOME_BRIEFING } from '../../briefing/homeData.js';
import { playTitle } from '../../governance/playTitle.js';
import { fmtUSD } from '../../utils/formatting.js';
import { storyRowsFor } from '../../experience/storyRows.js';
import { story } from './story.js';
import { MARKERS, isStale, tokensIn } from '../../experience/story/contract.js';
import {
  PL_STORY_META, PL_STORY_SOURCES, PL_AUCTIONS, PL_RULES, PL_HISTORY,
  PL_GRANT, PL_SUCCESSOR, PL_CHART, auctionSeries,
} from './data/capacityAuctions.js';

const finite = (v) => typeof v === 'number' && Number.isFinite(v);
const pair = (v) => [v, v];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** An ISO year, month or day as an [en, zh] pair; precision is preserved. */
export function datePair(value){
  if (!value) return null;
  if (/^\d{4}$/.test(value)) return [value, `${value}年`];
  const m = /^(\d{4})-(\d{2})$/.exec(value);
  if (m) return [`${MONTHS[Number(m[2]) - 1]} ${m[1]}`, `${m[1]}年${Number(m[2])}月`];
  const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!d) return null;
  return [`${Number(d[3])} ${MONTHS[Number(d[2]) - 1]} ${d[1]}`, `${d[1]}年${Number(d[2])}月${Number(d[3])}日`];
}

/* The card's own formats, mirrored from the market page rather than imported:
   a static import of src/experience/model.js would pull it into the story
   chunk. tests/pl-story-content.test.js holds the mirror to the original's
   output on this row. */
const pct = (v) => finite(v) ? `${(v * 100).toFixed(1)}%` : '—';
const year = (iso) => (iso ? Number(String(iso).slice(0, 4)) : null);
const mw = (v) => finite(v) ? `${Math.round(v).toLocaleString('en-US')} MW` : null;
const factorPct = (v) => finite(v) ? `${v.toFixed(2)}%` : null;

const auctionById = (id) => PL_AUCTIONS.find(row => row.id === id) || null;
const a27 = auctionById('main-2027');
const a28 = auctionById('main-2028');
const a30 = auctionById('main-2030');

/* ---- the opening's two cards -------------------------------------------- */

/**
 * The shared card's own metric: base all-equity IRR and its margin. The other
 * two metrics in the script's `card figures` stay in the decision panel, which
 * is the placement the decision record settles (B-PL-COPY-SCOPE, pl-00).
 */
export function cardFigures(row, ui = {}){
  const i = row?.investment;
  if (!i || !finite(i.holdIRR)) return null;
  const margin = typeof ui.marginText === 'function' ? ui.marginText(row) : null;
  return margin
    ? [`${pct(i.holdIRR)} (${margin[0]})`, `${pct(i.holdIRR)}（${margin[1]}）`]
    : [pct(i.holdIRR), pct(i.holdIRR)];
}

/** Both rows, in the order the page passes them: grant first, capacity second. */
export function storyRows(row, lens = 'infraFund'){
  const rows = storyRowsFor(row, lens);
  const grant = rows.find(r => r.play?.id === row?.play?.id) || row;
  const capacity = rows.find(r => r.play?.id !== row?.play?.id) || null;
  return { grant, capacity };
}

/* ---- the source drawer --------------------------------------------------- */

const locatorText = (l) => {
  if (!l) return null;
  const parts = [];
  if (l.document) parts.push(l.document);
  if (l.printedPage) parts.push('p. ' + [].concat(l.printedPage).join(', '));
  if (l.table) parts.push(l.table);
  if (l.row) parts.push('row ' + l.row);
  if (l.column) parts.push('column ' + l.column);
  if (l.clause) parts.push(l.clause);
  return parts.join(' · ') || null;
};

/* Sources the script cites but does not store a number from: they belong to the
   claim register, so the drawer carries their identity rather than a record. */
const DRAWER_EXTRA = {
  'SRC-PL-04': {
    title: 'Sejm ELI act record: amending acts, implementing acts and consolidated texts',
    url: 'https://api.sejm.gov.pl/eli/acts/DU/2018/9',
    locator: 'the act record read at the legal check; no successor act and no catch-up regulation for 2030 delivery',
  },
  'SRC-PL-13': {
    title: 'Minister of Energy: parameters of the supplementary auction for 2027 delivery',
    url: 'https://api.sejm.gov.pl/eli/acts/DU/2026/542/text.pdf',
    locator: 'M.P. 2026 poz. 542, items 1-8 (battery factor item 8(i))',
  },
  'SRC-PL-14': {
    title: 'URE: Informacja nr 43/2026, final results of the supplementary auction for 2027 delivery',
    url: 'https://www.ure.gov.pl/download/9/16483/Informacjanr43-2026.pdf',
    locator: 'points 3-5; auction of 3 September 2026',
  },
  'SRC-PL-20': {
    title: 'NFOŚiGW: programme text for storage with infrastructure',
    url: 'https://www.gov.pl/attachment/e8a27407-5de8-4b60-897b-6f494d0000ea',
    locator: 'aims, budget, period, intensity and durability sections',
  },
  'SRC-PL-23': {
    title: 'URE: summary of URE activities in 2024, connection section and its caveat',
    url: 'https://ure.gov.pl/en/communication/news/436%2CSummary-of-URE-activities-in-2024-deregulation-demands-and-new-competences-of-th.html',
    locator: 'the connection section; refusals are counted per application, and applicants resubmit',
  },
  'REPO-PL-LIVE': {
    title: 'This market page: the decision panel, the two play cards and the design grid',
    url: '/markets/poland#bankable',
    locator: 'the selected infraFund row and its design grid, read at this build',
  },
};

/** The drawer's map: title, link, locator and check date, per cited source. */
export function storySources(){
  const out = {};
  for (const [id, extra] of Object.entries(DRAWER_EXTRA)){
    out[id] = { ...extra, checkedOn: PL_STORY_META.reviewedOn };
  }
  for (const [id, source] of Object.entries(PL_STORY_SOURCES)){
    if (out[id]) continue;
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

/* ---- the token map ------------------------------------------------------- */

export function storyValues(row, ui = {}, lens = 'infraFund'){
  const { grant, capacity } = storyRows(row, lens);
  const v = capacity || grant;
  const grid = HOME_BRIEFING.grids?.pl;
  const hours = finite(grant?.play?.hours) ? grant.play.hours : null;
  const merchant = (grid?.cells || []).find(cell => cell.route === 'mer' && cell.hours === hours);
  const bestHours = grid?.byRoute?.mer?.best;
  const best = (grid?.cells || []).find(cell => cell.route === 'mer' && cell.hours === bestHours && cell.best)
    || (grid?.cells || []).find(cell => cell.best);
  const trigger = HOME_BRIEFING.triggers?.[v?.next];
  const triggerDate = datePair(trigger?.expected);
  const band = grid?.byRoute?.mer?.band || [];
  const listDate = datePair(PL_GRANT.listUpdatedOn);
  const checked = datePair(PL_STORY_META.legalCheckedOn);

  return {
    call: ui.CALLS?.[grant?.call] || null,
    playName: grant?.play ? (ui.playTitle || playTitle)(grant.play, grant.stage) : null,
    cardFigures: cardFigures(grant, ui),
    nextAction: grant?.play?.action?.text || null,
    playEvidence: MARKERS[grant?.evidence] || null,
    marketCall: ui.CALLS?.[v?.call] || null,
    marketPlayName: v?.play ? (ui.playTitle || playTitle)(v.play, v.stage) : null,
    marketNextAction: v?.play?.action?.text || null,
    marketEvidence: MARKERS[v?.evidence] || null,
    watchedEvent: trigger
      ? [trigger.label[0] + (triggerDate ? ` · ${triggerDate[0]}` : ''), trigger.label[1] + (triggerDate ? ` · ${triggerDate[1]}` : '')]
      : null,
    ungrantedMerchantValue: finite(merchant?.value) ? fmtUSD(merchant.value) : null,
    ungrantedBestValue: finite(best?.value) ? fmtUSD(best.value) : null,
    grantPlayValue: finite(HOME_BRIEFING.plays?.[`pl/${grant?.play?.id}`]?.econ?.value)
      ? fmtUSD(HOME_BRIEFING.plays[`pl/${grant?.play?.id}`].econ.value) : null,
    merchantBand: band.length === 2
      ? [`${band[0]} and ${band[1]}`, `${band[0]}和${band[1]}`] : null,
    h01Year: finite(PL_HISTORY.h01Year) ? String(PL_HISTORY.h01Year) : null,
    h02ActYear: year(PL_HISTORY.h02ActOn) ? String(year(PL_HISTORY.h02ActOn)) : null,
    existingTerm: finite(PL_RULES.existingMaxYears) ? String(PL_RULES.existingMaxYears) : null,
    modernisedTerm: finite(PL_RULES.modernisedMaxYears) ? String(PL_RULES.modernisedMaxYears) : null,
    newBuildTerm: finite(PL_RULES.newMaxYears) ? String(PL_RULES.newMaxYears) : null,
    firstBatteryDeliveryYear: finite(a27?.deliveryYear) ? String(a27.deliveryYear) : null,
    secondBatteryDeliveryYear: finite(a28?.deliveryYear) ? String(a28.deliveryYear) : null,
    earlyBatteryFactor: factorPct(a27?.batteryFactorPct),
    firstBatteryObligation: mw(a27?.batteryObligationMW),
    secondBatteryObligation: mw(a28?.batteryObligationMW),
    secondBatteryUnits: finite(a28?.batteryUnits) ? String(a28.batteryUnits) : null,
    lastMainAuctionYear: year(a30?.auctionOn) ? String(year(a30.auctionOn)) : null,
    lastMainDeliveryYear: finite(a30?.deliveryYear) ? String(a30.deliveryYear) : null,
    supplementaryEndYear: year(PL_RULES.supplementaryEndsOn) ? String(year(PL_RULES.supplementaryEndsOn)) : null,
    lastMainBatteryFactor: factorPct(a30?.batteryFactorPct),
    firstContractValue: finite(a27?.contractPLNPerCertifiedKWYear) ? `PLN ${a27.contractPLNPerCertifiedKWYear.toFixed(2)}` : null,
    lastContractValue: finite(a30?.contractPLNPerCertifiedKWYear) ? `PLN ${a30.contractPLNPerCertifiedKWYear.toFixed(2)}` : null,
    certificationHours: finite(PL_RULES.certificationHours) ? String(PL_RULES.certificationHours) : null,
    milestoneDeliveryYear: finite(PL_RULES.milestoneDeliveryYear) ? String(PL_RULES.milestoneDeliveryYear) : null,
    cohortListDate: listDate,
    cohortSignedGrants: finite(PL_GRANT.signedGrants) ? String(PL_GRANT.signedGrants) : null,
    researchCheckDate: checked,
    sourceCheckedDate: datePair(PL_STORY_META.reviewedOn),
    grantShare: finite(grant?.play?.grantPct) ? `${grant.play.grantPct.toFixed(1)}%` : null,
    playDuration: finite(hours) ? String(hours) : null,
    auctionSeries: PL_AUCTIONS.length
      ? [`${PL_AUCTIONS.length} notices, delivery ${PL_AUCTIONS[0].deliveryYear}-${PL_AUCTIONS[PL_AUCTIONS.length - 1].deliveryYear}`,
        `${PL_AUCTIONS.length}份公告，交付年${PL_AUCTIONS[0].deliveryYear}—${PL_AUCTIONS[PL_AUCTIONS.length - 1].deliveryYear}年`]
      : null,
  };
}

/**
 * The reviewed tuple (rule 11) resolved to the values the page will print, or
 * null when the market page must keep the research dialog. Pure, so a test can
 * hold the guards without a browser: the pack supplies the lens.
 */
export function reviewed({ row, lens = 'infraFund', ui = {} } = {}){
  if (row?.id !== 'pl') return null;
  if (lens !== story.reviewedAgainst.lens) return null;
  if (isStale(story, row)) return null;
  if (!storyMatches(story, row, lens)) return null;
  const values = storyValues(row, ui, lens);
  if (Number(values.playDuration) !== story.reviewedAgainst.hours) return null;
  return { values, route: storyRows(row, lens) };
}

/** One marker per opening card, from that card's own row. */
export function cardMarkers(rows){
  return (rows || []).map(row => ({
    play: row?.play?.id || null,
    level: row?.evidence || null,
    label: MARKERS[row?.evidence] || null,
  })).filter(entry => entry.label);
}

/**
 * The reviewed tuple (rule 11): the same lens, play, duration and call the
 * script was signed against. Anything else returns the reader to research.
 */
export function storyMatches(story, row, lens = 'infraFund'){
  const ra = story.reviewedAgainst;
  return lens === ra.lens
    && row?.play?.id === story.playRef
    && row.play.hours === ra.hours
    && row.call === ra.call;
}

/**
 * The chart's gate, applied to the words: while the quantitative rendering is
 * unaccepted, pl-05 shows its figure-free Example sentence instead of the
 * numeric continuation (pl-build-evidence.md §5).
 */
export function storyWithGate(story, quantitativeReady = PL_CHART.quantitativeReady){
  if (quantitativeReady) return story;
  const swap = (shot) => (shot.exampleCopy ? { ...shot, copy: shot.exampleCopy } : shot);
  return {
    ...story,
    opening: swap(story.opening),
    chapters: story.chapters.map(chapter => ({ ...chapter, shots: chapter.shots.map(swap) })),
    quantitativeReady,
  };
}

const FINANCIAL = new Set(['call', 'playName', 'cardFigures', 'nextAction', 'playDuration', 'grantShare',
  'ungrantedMerchantValue', 'ungrantedBestValue', 'grantPlayValue', 'marketCall', 'marketPlayName', 'marketNextAction']);

/**
 * A missing binding replaces the sentence that would have printed it, in the
 * signed-off figure-free wording, and only for the shots that use it. A
 * financial gap and an unchecked record say different things.
 */
export function storyWithAvailableValues(story, values){
  const missing = Object.entries(values).filter(([, value]) => value === null || value === undefined).map(([key]) => key);
  if (!missing.length) return story;
  const set = new Set(missing);
  const adapt = (shot) => {
    const used = ['question', 'copy', 'meaning']
      .flatMap(key => (shot[key] ? tokensIn(shot[key][0]) : []));
    if (!used.some(token => set.has(token))) return shot;
    const financial = used.some(token => FINANCIAL.has(token));
    const out = { ...shot };
    for (const key of ['question', 'copy', 'meaning']){
      if (shot[key]?.some(text => tokensIn(text).some(token => set.has(token)))){
        out[key] = financial ? story.text['Missing financial binding'] : story.text['Missing evidence binding'];
      }
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

/* The scene reads the records themselves for its bars and markers, so the
   ordering and the plotted rows stay in one place. */
export { auctionSeries, PL_AUCTIONS, PL_RULES, PL_GRANT, PL_SUCCESSOR, PL_CHART };
