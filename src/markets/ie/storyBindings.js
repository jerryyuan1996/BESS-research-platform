/* Ireland story tokens: the current market-card fields, plus the dated primary
   records registered for this build. No model calculation, return-basis
   substitution, price-to-revenue bridge or inferred quantity.                */
import { HOME_BRIEFING } from '../../briefing/homeData.js';
import { playTitle } from '../../governance/playTitle.js';
import { tokensIn } from '../../experience/story/contract.js';
import { IE_STORY_EVIDENCE as ev } from './data/storyEvidence.js';
import { IE_CRM_AUCTIONS as crm } from './data/crmAuctions.js';

const finite = (v) => typeof v === 'number' && Number.isFinite(v);
const text = (v) => (finite(v) ? String(v) : null);
const pair = (v) => (v === null || v === undefined ? null : [String(v), String(v)]);
const percent = (v) => (finite(v) ? Math.round(v * 100) + '%' : null);

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** An event date in both languages, at the precision the record stores. */
export function datePair(value, precision = 'day') {
  if (!value) return null;
  const [y, m, d] = String(value).split('-');
  if (precision === 'year' || !m) return [y, `${y}年`];
  const month = MONTHS[Number(m) - 1];
  if (precision === 'month' || !d) return [`${month} ${y}`, `${y}年${Number(m)}月`];
  return [`${Number(d)} ${month} ${y}`, `${y}年${Number(m)}月${Number(d)}日`];
}

/* The briefing's own "+$295k/MW" convention, repeated here rather than
   imported: the story chunk must not pull the briefing's sentence layer. */
const perMW = (value) => (finite(value)
  ? [`${value >= 0 ? '+' : '−'}$${Math.round(Math.abs(value) / 1000)}k/MW`, `每MW ${value >= 0 ? '+' : '−'}${(Math.abs(value) / 10000).toFixed(1)}万美元`]
  : null);

const money = (value, currency = 'EUR') => (finite(value) ? `${currency} ${Math.abs(value) >= 1e6 ? (value / 1e6).toFixed(2) + 'm' : (value / 1e3).toFixed(1) + 'k'}` : null);

/** The fixed four-hour context and its size band, as the chart labels print them. */
export const crmContext = () => {
  const lo = crm.initialCapacityBand.lowerExclusiveMW.value;
  const hi = crm.initialCapacityBand.upperInclusiveMW.value;
  return { hours: crm.contextHours.value, band: [`${lo} < IC ≤ ${hi} MW`, `${lo} < IC ≤ ${hi} MW`] };
};

/** The dated history nodes a scene draws, with their signed sentences. */
export const historyNodes = Object.entries(ev.history).map(([id, node]) => ({
  id,
  when: node.eventDate.value,
  precision: node.precision,
  label: node.label,
  date: datePair(node.eventDate.value, node.precision),
  sources: node.sources,
}));

/** A source record's check date, for the evidence drawer's label. */
export const sourceValues = (source) => ({ sourceCheckedDate: datePair(source?.checkedOn ?? ev.vintage) });

/**
 * Token values. `ui` carries the market page's own formatters; the page hands
 * them over so the card and the story read the same figures the same way.
 */
export function storyValues(row, ui = {}) {
  const i = row?.investment;
  const grid = HOME_BRIEFING.grids?.ie;
  const hours = finite(row?.play?.hours) ? row.play.hours : row?.market?.comparison?.archetype?.durationHours;
  const shareText = percent(i?.secured);
  const tenor = text(i?.securedYears);
  const hold = finite(i?.holdIRR) && ui.returnPct ? ui.returnPct(i.holdIRR) : null;
  const cell = (grid?.cells || []).find((c) => c.route === 'cap' && c.hours === hours);
  const band = crmContext();
  const lastStep = ev.snsp.steps.at(-1);
  const offered = crm.participation.offeredNewShare.value;

  return {
    /* live card fields */
    call: ui.CALLS?.[row?.call] ?? null,
    playName: row?.play ? (ui.playTitle || playTitle)(row.play, row.stage) : null,
    cardFigures: hold && shareText && tenor
      ? [`${hold} · ${shareText} / ${tenor} years`, `${hold} · ${shareText} / ${tenor}年`]
      : null,
    nextAction: row?.play?.action?.text ?? null,
    playDuration: text(hours),
    securedShare: shareText,
    securedTenor: tenor,

    /* dated evidence, each from its registered field */
    semGoLive: datePair(ev.history['H-IE-01'].eventDate.value, ev.history['H-IE-01'].precision),
    isemGoLive: datePair(ev.history['H-IE-03'].eventDate.value, ev.history['H-IE-03'].precision),
    ds3Start: datePair(ev.history['H-IE-02'].eventDate.value, ev.history['H-IE-02'].precision),
    vcAward: datePair(ev.history['H-IE-04'].eventDate.value, ev.history['H-IE-04'].precision),
    snspDate: datePair(ev.history['H-IE-05'].eventDate.value, ev.history['H-IE-05'].precision),
    snspLimit: percent(lastStep.limitShare.value),
    vcServicesWord: ['five', '五项'],
    longStop: datePair(ev.ds3.longStopDate.value),
    roMaxYears: text(ev.ro.maxYears.value),
    dataCentreShare: percent(ev.dataCentres.share.value),
    dataCentreYear: finite(ev.dataCentres.year.value) ? [String(ev.dataCentres.year.value), `${ev.dataCentres.year.value}年`] : null,
    crmContextDuration: text(band.hours),
    crmBand: band.band,
    /* Withheld under B-IE-RIGHTS: the shot's copy falls back rather than print
       an em dash. A cleared build fills the field and the sentence returns. */
    newBatteryOfferedShare: percent(offered),
    sourceCheckedDate: datePair(ev.vintage),

    /* identifiers, not measurements; tokenised because they carry digits */
    ds3Name: ['DS3', 'DS3'],
    tor1: ['TOR1', 'TOR1'],
    tor2: ['TOR2', 'TOR2'],

    /* figures a scene prints, never a typed one */
    holdIrr: hold,
    lifeYears: text(i?.lifeYears),
    capitalRequired: money(i?.capexTotal, i?.currency || 'EUR'),
    valuePerMW: cell ? perMW(cell.value) : null,
    powerMW: text(i?.powerMW),
    vcAwardedMW: finite(ev.vc.awardedMW.value) ? [`${ev.vc.awardedMW.value.toLocaleString('en-US')} MW`, `${ev.vc.awardedMW.value}MW`] : null,
    vcWinners: text(ev.vc.winnerCount.value),
    serviceCodes: ev.vc.serviceCodes,
    teachingHours: Array.isArray(grid?.hours) ? grid.hours : [],
    durationGrid: Array.isArray(grid?.hours) ? [grid.hours.join(' · '), grid.hours.join(' · ')] : null,
    historyNodes,
    snspSteps: ev.snsp.steps.map((step) => ({
      date: datePair(step.date, step.precision),
      limit: percent(step.limitShare.value),
      qualifier: step.qualifier,
    })),
    crmRows: crm.rows,
    chartExample: crm.chart,
    securedYearsLabel: pair(tenor),
    redesign: {
      main: text(ev.crmRedesign.mainLeadYears.value),
      topUp: text(ev.crmRedesign.topUpLeadYears.value),
      status: ev.crmRedesign.status,
    },
  };
}

/**
 * The approved figure-free state. A shot whose copy needs a withheld value
 * uses the same sentences without that clause; a missing financial field falls
 * back to the signed sentence instead. Nothing renders as an em dash or zero.
 */
export function storyWithAvailableValues(story, values) {
  const missing = new Set(story.tokens.filter((t) => values[t] === null || values[t] === undefined));
  const needs = (p) => Array.isArray(p) && p.some((s) => tokensIn(s).some((t) => missing.has(t)));
  const adapt = (shot) => {
    const out = { ...shot };
    if (needs(shot.copy)) {
      out.copy = shot.copyWhenWithheld && !needs(shot.copyWhenWithheld)
        ? shot.copyWhenWithheld
        : story.text['Missing financial binding'];
    }
    if (shot.labels) {
      const kept = Object.entries(shot.labels).filter(([, p]) => !needs(p));
      if (kept.length !== Object.keys(shot.labels).length) out.labels = Object.fromEntries(kept);
    }
    return out;
  };
  return {
    ...story,
    opening: adapt(story.opening),
    chapters: story.chapters.map((c) => ({ ...c, shots: c.shots.map(adapt) })),
    missingBindings: [...missing],
  };
}

/**
 * The tuple the story was signed against: play, duration, call and lens. The
 * shared isStale() does not check the lens, so the pack checks it here and
 * returns to research when the reader is looking at another investor.
 */
export function storyMatches(story, row, lens) {
  const ra = story.reviewedAgainst;
  return lens === ra.lens
    && row?.play?.id === story.playRef
    && row.play.hours === ra.hours
    && row.call === ra.call;
}
