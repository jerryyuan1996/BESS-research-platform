/* Existing market-row results only. No story control can mutate an investment case.
   Binding owners: caiso-build-evidence.md §4. Null observations remain unavailable. */
import { HOME_BRIEFING } from '../../briefing/homeData.js';
import { playTitle, STAGE_WORD } from '../../governance/playTitle.js';
import { CAISO_EVIDENCE as E, CAISO_HISTORY as H, CAISO_SOURCES as S } from './data/storyEvidence.js';
const finite = v => typeof v === 'number' && Number.isFinite(v);
const number = v => finite(v) ? v.toLocaleString('en-US') : null;
const pct = v => finite(v) ? `${(v * 100).toFixed(1)}%` : null;
const share = v => finite(v) ? `${Math.round(v * 100)}%` : null;
const money = v => !finite(v) ? null : `USD ${Math.abs(v)>=1e6?(v/1e6).toFixed(2)+'m':(v/1e3).toFixed(1)+'k'}/MW`;

export function storyValues(row, ui = {}, teaching = {}) {
  const p=row?.play, e=row?.econ, i=row?.investment;
  return {
    crisisPeriod:S['SRC-CAISO-01'].scopeRecord.match(/2000-2001/)?.[0].replace('-200','–0')??null,
    outageDates:[`${H['H-CAISO-03'].outages.map(d=>Number(d.slice(-2))).join(' and ')} August`,`${Number(H['H-CAISO-03'].outages[0].slice(5,7))}月${H['H-CAISO-03'].outages.map(d=>Number(d.slice(-2))).join('日和')}日`],
    call:ui.CALLS?.[row?.call]??null,
    play:p?playTitle(p,row.stage??p.stage):null,
    cardFigures:[pct(e?.hold),pct(e?.levered),share(e?.secured),number(e?.securedYears)].filter(Boolean).join(' · '),
    nextAction:p?.action?.text??null,
    playDuration:number(p?.hours),
    qcBasisHours:number(E.qcBasisHours),
    qcDecisionYear:H['H-CAISO-02'].qcDecision.slice(0,4),
    qcEffectiveYear:H['H-CAISO-02'].qcEffectiveRaYear,
    mtrNqc:number(E.mtrNqcMW),mtrMinTerm:number(E.mtrMinContractYears),
    fleet2020:number(E.fleet2020MW),fleetDec2024:number(E.fleetDec2024MW),fleetLatest:number(E.fleetEnd2025LowerBoundMW),
    bestDuration:number(HOME_BRIEFING.grids.caiso?.byRoute?.cap?.best),
    buildLine:HOME_BRIEFING.build.find(x=>x.market==='caiso')?.line??null,
    entryRoute:STAGE_WORD[row?.stage??p?.stage]??null,
    securedShare:share(e?.secured),securedTenor:number(e?.securedYears),
    holdReturn:pct(e?.hold),targetReturn:pct(e?.test?.target??i?.targetReturn),
    operatingTarget:pct(i?.operatingPurchase?.targetReturn),operatingPriceCeiling:money(i?.operatingPurchase?.maxPricePerMW),buildCapex:money(i?.capexPerMW),
    shortHours:number(teaching.durationHours?.[0]),longHours:number(teaching.durationHours?.[2]),
  };
}
