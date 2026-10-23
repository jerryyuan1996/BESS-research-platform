/** Annual eligible revenue, in the contract's currency and revenue definition.
 * Floor/ceiling/caps are project inputs, not published Australian market prices. */
export function cisRevenue(revenue,{floor,ceiling,supportShare=.9,sharingShare=.5,paymentCap=Infinity,repaymentCap=Infinity}){
  if(![revenue,floor,ceiling,supportShare,sharingShare,paymentCap,repaymentCap].every(x=>typeof x==='number'&&!Number.isNaN(x)&&x>=0)||ceiling<floor||supportShare>1||sharingShare>1)throw new RangeError('Invalid CIS revenue terms');
  const support=Math.min(paymentCap,supportShare*Math.max(0,floor-revenue));
  const repayment=Math.min(repaymentCap,sharingShare*Math.max(0,revenue-ceiling));
  const total=revenue+support-repayment;
  return {total,support,repayment,secured:Math.min(total,supportShare*floor,paymentCap)};
}
