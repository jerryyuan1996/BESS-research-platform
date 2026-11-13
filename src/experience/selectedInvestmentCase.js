import { investmentRowsFor } from './storyRows.js';
import { referenceInvestment, investmentMetrics } from '../opportunities/investment.js';
import { SPECIAL_OPPORTUNITIES } from '../opportunities/catalog.js';
import { marketForPlay } from '../acquisition/play.js';
import { runScenarioSet } from '../comparison/refinement.js';

const cache = new Map();
/** Reprice the selected analyst play on the same RTB, nominal, after-tax basis
 * as the published reference. Never borrow another play's return or debt. */
export function selectedInvestmentCase(row, investor, requested, supply = null) {
  if (row.market.comparison.engineReady === false) return row;
  const choices = investmentRowsFor(row,investor);
  const selected = choices.find(r => r.play?.id === (requested||row.play?.id) && (!r.supplyCase || r.supplyCase===(supply==='chinese'?'chinese':'non-feoc'))) || row;
  const key = `${row.id}/${investor}/${selected.play?.id||'base'}/${selected.supplyCase||''}`;
  if (!cache.has(key)) {
    const values = {...SPECIAL_OPPORTUNITIES.find(o => o.market === row.id)?.screeningByInvestor?.[investor],
      ...(selected.supplyCase?{usSupply:selected.supplyCase}:{})};
    const reference = referenceInvestment(row.market, investor, selected.play, values);
    const investment = investmentMetrics(reference?.result, { debtBreakdown:true });
    if (!investment) return {...selected,investment:null,econ:{...selected.econ,hold:null,levered:null,test:null}};
    const variant = marketForPlay(row.market, selected.play);
    const chosen = reference.play;
    const bear = runScenarioSet(variant, chosen.route, 5, chosen.econ?.runOptions || {}).bear;
    const stressed = investmentMetrics(referenceInvestment(row.market, investor, chosen,
      {...values,economicOverrides:bear.overrides})?.result);
    Object.assign(investment, {bearIRR:stressed?.irr??null,bearHoldIRR:stressed?.holdIRR??null,bearNetUSD:stressed?.bridge.net??null});
    cache.set(key, investment);
  }
  const primary = selected.play?.id === row.play?.id && (!selected.supplyCase||selected.supplyCase===(row.investment?.usSupply||'non-feoc'));
  const investment = {...(primary?row.investment:{}),...cache.get(key)}, legacyEcon = selected.play?.econ || row.legacyEcon || row.econ;
  return {...selected, region:row.region, investment, legacyEcon,
    econ:{...legacyEcon,hold:investment.holdIRR,lowerOf:investment.irr,levered:investment.leveredIRR,
      test:investment.test,secured:investment.secured}};
}
