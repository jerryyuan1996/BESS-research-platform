/* Germany — reads the same briefing cells and case result as the market page.
 * The page supplies its existing caseFor helper; importing the page chunk
 * here would disturb lazy splitting. No underwriting input is changed. */
import { HOME_BRIEFING } from '../../briefing/homeData.js';
import { HISTORY, REVIEW_DATE, PRICE_REUSE_LICENCE } from './story/history.js';

const finite = Number.isFinite;
const number = v => finite(v) ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(v) : null;
const year = value => [value, value + '年'];
const date = value => ['en-GB', 'zh-CN'].map(locale => new Intl.DateTimeFormat(locale, { timeZone: 'UTC', dateStyle: 'long' }).format(new Date(value + 'T12:00:00Z')));

export function storyBindings(row, ui = {}) {
  const result = ui.caseFor?.(row);
  const base = result?.base;
  const grid = HOME_BRIEFING.grids?.[row?.id];
  const preferred = grid?.cells?.find(c => c.route === 'mer' && c.best && c.priced);
  const longerHours = grid?.hours?.find(h => h > (preferred?.hours ?? row?.play?.hours));
  const longer = grid?.cells?.find(c => c.route === 'mer' && c.hours === longerHours && c.priced);
  const fee = finite(base?.secY?.[0]) ? base.secY[0] : null;
  const tenor = finite(base?.securedYears) ? base.securedYears : null;
  const expiry = finite(base?.codOffset) && tenor !== null ? base.codOffset + tenor : null;
  const expiryMonth = expiry === null ? null : Math.round(expiry * 12);
  const values = {
    priceReuseLicence: PRICE_REUSE_LICENCE,
    call: ui.CALLS?.[row?.call] || null,
    playDuration: finite(row?.play?.hours) ? String(row.play.hours) : null,
    preferredDuration: finite(preferred?.hours) ? String(preferred.hours) : null,
    longerDuration: finite(longer?.hours) ? String(longer.hours) : null,
    merchantValue: number(preferred?.value),
    annualFeeLabel: number(fee),
    securedYears: tenor === null ? null : String(tenor),
    contractExpiryLabel: expiryMonth === null ? null : ['T+' + expiryMonth + 'm', 'T+' + expiryMonth + '月'],
    openingYear: year(HISTORY['H-DE-01'].opening),
    policyYear: year(HISTORY['H-DE-01'].policy.slice(0, 4)),
    supportDate: date(HISTORY['H-DE-02'].support),
    buildYear: year(HISTORY['H-DE-02'].build),
    nuclearDecision: date(HISTORY['H-DE-03'].decision),
    nuclearCompletion: date(HISTORY['H-DE-03'].completion),
    lineOriginalTarget: year(HISTORY['H-DE-04'].original),
    lineCurrentTarget: ['end-' + HISTORY['H-DE-04'].target, HISTORY['H-DE-04'].target + '年底'],
    capacityEffective: date(HISTORY['H-DE-05'].effective),
    gridFeeDraft: date(HISTORY['H-DE-06'].draft),
    researchDate: date(REVIEW_DATE),
    spreadChartLabels: null, observedRange: null, observedInterval: null,
  };
  return { values, chart: { fee, tenor, expiry, codOffset: base?.codOffset ?? null }, duration: { preferred: preferred?.hours ?? null, longer: longer?.hours ?? null, value: preferred?.value ?? null, cells: (grid?.cells || []).filter(c => c.route === 'mer' && c.priced).map(c => ({ hours: c.hours, value: c.value, label: number(c.value) })) } };
}

export const storyValues = (row, ui) => storyBindings(row, ui).values;
