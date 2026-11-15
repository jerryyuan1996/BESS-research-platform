/** Monthly display buckets preserve every original dated model payment.
 * Zero months are explicit; no monthly revenue seasonality is invented. */
export function monthlyCashSeries(flows,powerMW=1){
  if(!flows.length)return [];
  const last=Math.max(0,...flows.map(f=>Math.floor(f.at*12+1e-6)));
  const months=Array.from({length:last+1},(_,month)=>({month,net:0,cumulative:0,payments:[]}));
  for(const f of flows){
    const month=Math.max(0,Math.floor(f.at*12+1e-6)),payment={month:f.at*12,amount:f.amount*powerMW};
    months[month].net+=payment.amount;months[month].payments.push(payment);
  }
  let cumulative=0;
  for(const m of months){cumulative+=m.net;m.cumulative=cumulative;}
  return months;
}

/** Exact dated, nominal all-equity hold cash. Never interpolate a repayment. */
export function cumulativeEquityCash(flows, powerMW = 1) {
  const dates = new Map([[0, 0]]);
  for (const f of flows) dates.set(f.at, (dates.get(f.at) || 0) + f.amount * powerMW);
  let cumulative = 0, peak = { at:0, cumulative:0 }, payback = null, spent = false;
  const series = [...dates].sort((a,b) => a[0]-b[0]).map(([at, net]) => {
    cumulative += net;
    const point = { at, net, cumulative };
    if (cumulative < peak.cumulative) peak = point;
    if (cumulative < 0) spent = true;
    else if (spent && payback == null) payback = point;
    return point;
  });
  return { series, peakCashAtRisk:-peak.cumulative, peak, payback };
}
