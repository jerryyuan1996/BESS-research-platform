/* Revenue permission is independent of contractual COD. Months are elapsed
 * from COD, not additional construction months. Zero is an explicit all-ready
 * reference assumption, never an observed country-level waiting time.
 * Revenue is integrated monthly and then passed to the existing annual cash
 * calendar. Asset age, contract expiry, costs and debt clocks never restart. */
import { cisRevenue } from '../economics/revenueSupport.js';
export const READINESS_STREAMS = ['energy', 'services', 'capacity', 'contract'];
const bounded = (v, name, max = 240) => {
  if (!Number.isFinite(v) || v < 0 || v > max) throw new Error(`Invalid revenue readiness ${name}`);
  return v;
};
export function readinessConfig(e = {}, options = {}) {
  const input = options.revenueReadiness ?? e.revenueReadiness ?? {};
  const c = { ...input };
  for (const key of READINESS_STREAMS) {
    c[key + 'Months'] = bounded(input[key + 'Months'] ?? 0, key + 'Months');
    c[key + 'RampMonths'] = bounded(input[key + 'RampMonths'] ?? 0, key + 'RampMonths');
  }
  for (const key of ['permissionExpiryMonths', 'finalApprovalMonths']) {
    if (input[key] != null) c[key] = bounded(input[key], key, 420);
  }
  c.extraCostMonths = bounded(input.extraCostMonths ?? 0, 'extraCostMonths');
  c.extraCostPerMWMonth = bounded(input.extraCostPerMWMonth ?? 0, 'extraCostPerMWMonth', 1e9);
  if (input.reserveSharePct != null) c.reserveSharePct = bounded(input.reserveSharePct, 'reserveSharePct', 100);
  if (input.products != null) {
    if (!Array.isArray(input.products) || !input.products.length) throw new Error('Reserve products must be a nonempty allocation');
    const ids = new Set();
    c.products = input.products.map(p => {
      if (!p.id || ids.has(p.id)) throw new Error('Reserve product ids must be unique');
      ids.add(p.id);
      return { id:p.id, share:bounded(p.share, 'product share', 1),
        months:bounded(p.months ?? c.servicesMonths, 'product months'),
        rampMonths:bounded(p.rampMonths ?? c.servicesRampMonths, 'product ramp') };
    });
    if (Math.abs(c.products.reduce((s,p) => s+p.share,0)-1) > 1e-9) throw new Error('Reserve product revenue shares must sum to one');
  }
  return c;
}

// Integral of a zero -> linear ramp -> full availability gate.
function primitive(t, start, ramp) {
  const x = Math.max(0, t-start);
  return ramp === 0 ? x : x <= ramp ? x*x/(2*ramp) : x-ramp/2;
}
function integral(c, start, ramp, lo, hi) {
  const part=(a,b)=>b>a?primitive(b,start,ramp)-primitive(a,start,ramp):0;
  const expiry=c.permissionExpiryMonths;
  if (expiry == null || c.finalApprovalMonths != null && c.finalApprovalMonths <= expiry) return part(lo,hi);
  // No final approval date means no assumed reinstatement after expiry.
  return part(lo,Math.min(hi,expiry)) + (c.finalApprovalMonths == null ? 0 : part(Math.max(lo,c.finalApprovalMonths),hi));
}
export function readinessFactor(c, stream, month) {
  const lo=month-1, hi=month;
  if(stream==='services' && c.products) return c.products.reduce((sum,p)=>sum+p.share*integral(c,p.months,p.rampMonths,lo,hi),0);
  return integral(c,c[stream+'Months'],c[stream+'RampMonths'],lo,hi);
}
export function readinessYearFactor(c,stream,year) {
  let total=0;for(let m=(year-1)*12+1;m<=year*12;m++)total+=readinessFactor(c,stream,m);
  return total/12;
}
export function readinessExtraCost(c,year) {
  return Math.max(0,Math.min(12,c.extraCostMonths-(year-1)*12))*c.extraCostPerMWMonth;
}
export function splitTradingRevenue(energy,services,c) {
  if(c.reserveSharePct==null)return {energy,services};
  const total=energy+services;
  return {energy:total*(1-c.reserveSharePct/100),services:total*c.reserveSharePct/100};
}
export function hasReadinessAdjustment(c) {
  return READINESS_STREAMS.some(s=>c[s+'Months']>0||c[s+'RampMonths']>0)
    || c.permissionExpiryMonths!=null || c.reserveSharePct!=null || !!c.products
    || c.extraCostMonths*c.extraCostPerMWMonth>0;
}

export function scaledSupport(terms, fraction) {
  return { ...terms, ...Object.fromEntries(['floor','ceiling','paymentCap','repaymentCap']
    .filter(k=>terms[k]!=null).map(k=>[k,terms[k]===Infinity?Infinity:terms[k]*fraction])) };
}

/** Rates are annual amounts, already net of fees and any market allocation.
 * The support split preserves overlap: a floor cannot replace lost revenue in
 * a month before its own conditions precedent are met. */
export function settleReadyYear(c,year,{energy,services,primary=0,primarySecured=0,additional=0,
  primaryStream='capacity',floor=false,cis=null,fx=1}) {
  let secured=0,renewal=0,merchant=0,energyRevenue=0,serviceRevenue=0;
  const supportMonths=[];
  for(let m=(year-1)*12+1;m<=year*12;m++){
    const eg=readinessFactor(c,'energy',m),sg=readinessFactor(c,'services',m);
    const pg=readinessFactor(c,primaryStream,m),cg=readinessFactor(c,'capacity',m);
    const er=energy*eg/12,sr=services*sg/12,eligible=er+sr;
    let s=(primarySecured*pg+additional*cg)/12;
    let a=(primary-primarySecured)*pg/12,mm=eligible;
    if(floor)mm=Math.max(0,eligible-s-a);
    if(cis){
      const settled=pg>0?cisRevenue(eligible/fx,scaledSupport(cis,pg/12)):{total:eligible/fx,secured:0};
      s=settled.secured*fx;a=0;mm=settled.total*fx-s;
    }
    if(floor||cis)supportMonths.push({eligibleRevenue:eligible,contractFraction:pg/12});
    secured+=s;renewal+=a;merchant+=mm;energyRevenue+=er;serviceRevenue+=sr;
  }
  return {secured,renewal,merchant,energyRevenue,serviceRevenue,supportMonths};
}

/** Product dates can come from a dated diligence schedule. The latest required
 * gate wins; unknown gates stay unknown instead of turning into month zero. */
export function revenueStartDate(gates) {
  if(!Array.isArray(gates)||!gates.length||gates.some(g=>!g.date))return null;
  const dates=gates.map(g=>{
    const d=new Date(g.date+'T00:00:00Z');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(g.date)||!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==g.date)throw new Error('Invalid revenue gate date');
    return g.date;
  });
  return dates.sort().at(-1);
}
