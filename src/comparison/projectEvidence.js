/** Project-specific evidence. Absence is unresolved, never a neutral score. */
export const PROJECT_EVIDENCE_GATES = [
  ['connection',['Connection rights, capacity and timing','并网权利、容量与时间']],
  ['permits',['Permits and conditions','许可及附带条件']],
  ['land',['Land tenure through the investment period','覆盖投资期的土地权利']],
  ['epc',['EPC scope, exclusions and contingency','EPC范围、除外事项与预备费']],
  ['remedies',['Performance guarantees and remedies','性能保证及违约补救']],
  ['warranty',['Warranty and service conditions','质保与服务条件']],
  ['offtake',['Offtake / floor exclusions and expiry','承购或保底的除外事项及到期日']],
  ['credit',['Counterparty credit and security','对手方信用及担保']],
  ['finance',['Lender terms, tax, fees, reserves and cash traps','银行条款、税费、储备金与现金锁定']],
  ['supplier',['Quote validity, delivered cost and publication rights','报价有效期、交付成本与发布权利']],
].map(([id,label])=>({id,label}));

export function projectEvidenceStatus(evidence = {}){
  return PROJECT_EVIDENCE_GATES.map(gate=>{
    const input=evidence[gate.id] || {};
    const sourceRef=typeof input.sourceRef==='string'?input.sourceRef.trim():'';
    const status=sourceRef && ['provided','not-applicable'].includes(input.status)?input.status:'unresolved';
    return {...gate,status,sourceRef};
  });
}
