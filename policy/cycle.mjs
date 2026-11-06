/** The orchestration contract is tested independently of GitHub/Vercel. Test
 * callbacks prove call counts, never a simulated production deployment. */
export function prepareCycle({cycle,expectedMain,market,policy,existingMarketValid}){
  const marketChanged=market.status==='validated'&&market.changed===true;
  const policyChanged=policy.status==='independently_verified'&&policy.changed===true&&existingMarketValid===true;
  return {cycle,expectedMain,changed:marketChanged||policyChanged,streams:{market:marketChanged,policy:policyChanged},retainedPolicy:!policyChanged,retainMarket:!marketChanged};
}
export async function publishCycleOnce(prepared,{currentMain,commit,push,runCI}){
  if(!prepared.changed)return {published:false,reason:'unchanged',ciInvocations:0};
  if(await currentMain()!==prepared.expectedMain)throw new Error('Concurrent main update; revalidate the cycle');
  const sha=await commit(prepared);await push(sha);await runCI(sha);
  return {published:true,sha,ciInvocations:1};
}
