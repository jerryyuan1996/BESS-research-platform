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
