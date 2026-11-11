/* Manual research-review contract. Pure: no transport, disk or writer. */
export const REVIEW_CLASSES = Object.freeze(['Maintain', 'Further evidence', 'Consider adjustment', 'Material review']);
export const REVIEW_SECTIONS = Object.freeze(['A', 'B', 'C', 'D', 'E']);
export const REVIEW_STATUSES = Object.freeze(['observations available', 'analysis not started', 'analysis complete', 'awaiting decision', 'approved', 'rejected', 'deferred', 'applied', 'released']);
export const REVIEW_ID = /^review-[a-z0-9][a-z0-9-]{0,110}$/;
const text = v => typeof v === 'string' && v.trim().length > 0;
export function reviewProblems(review, packet){
  const problems = [];
  if (!review || review.schemaVersion !== 1) return ['review schemaVersion must be 1'];
  if (review.id !== packet.id || review.packetHash !== packet.packetHash) problems.push('review must identify the exact packet');
  if (JSON.stringify(review.markets)!==JSON.stringify(packet.markets) || review.dataCommit!==packet.dataCommit || review.asOf!==packet.asOf) problems.push('review snapshot metadata must match packet');
  for (const key of REVIEW_SECTIONS) if (!text(review.sections?.[key])) problems.push(`section ${key} is required`);
  if (!Array.isArray(review.proposals)) return [...problems, 'proposals must be an array'];
  const evidence = new Set(packet.evidence.map(e => e.id));
  const ids = new Set();
  for (const p of review.proposals){
    if(!p || typeof p!=='object' || Array.isArray(p)){problems.push('proposal must be an object');continue;}
    if(p.changes!==undefined&&!Array.isArray(p.changes)){problems.push('changes must be an array');continue;}
    if (!/^[a-z][a-z0-9-]{0,63}$/.test(p.id ?? '') || ids.has(p.id)) problems.push('proposal ids must be unique safe identifiers');
    ids.add(p.id);
    if (!packet.markets.includes(p.market)) problems.push(`${p.id}: market is not in packet`);
    if (!REVIEW_CLASSES.includes(p.classification)) problems.push(`${p.id}: invalid classification`);
    if (!text(p.rationale) || !text(p.reconsiderWhen)) problems.push(`${p.id}: rationale and reconsiderWhen are required`);
    if (!Array.isArray(p.evidence) || !p.evidence.length || p.evidence.some(e => !evidence.has(e))) problems.push(`${p.id}: every evidence reference must resolve to this packet`);
    if (!['view', 'assumption', 'none'].includes(p.kind)) problems.push(`${p.id}: kind must be view, assumption or none`);
    if (['Maintain', 'Further evidence'].includes(p.classification) && p.kind !== 'none') problems.push(`${p.id}: this class cannot carry an apply action`);
    if (p.kind === 'view' && (!Array.isArray(p.changes) || !p.changes.length)) problems.push(`${p.id}: view proposal requires changes`);
    if (p.kind !== 'view' && p.changes?.length) problems.push(`${p.id}: only view proposals can carry changes`);
    for (const c of p.changes ?? []){
      if(!c || typeof c!=='object'){problems.push('change must be an object');continue;}
      if (c.market !== p.market || c.author?.kind !== 'analyst') problems.push(`${p.id}: changes must be analyst changes for the proposal market`);
      if (!Array.isArray(c.reason) || c.reason.length !== 2 || !c.reason.every(text)) problems.push(`${p.id}: change requires bilingual reason`);
    }
  }
  return problems;
}
const timestamp = value => Number.isFinite(Date.parse(value)) ? Date.parse(value) : -Infinity;
const chronological = (a,b) => timestamp(a)-timestamp(b) || String(a ?? '').localeCompare(String(b ?? ''));
export function statusForMarket({ market, summaries = {}, changelog = [], reviews = [], viewHash = null }){
  const observations = Object.values(summaries).filter(s => !s.marketId || s.marketId === market)
    .map(s => s.fetchedAt || s.coverage?.to).filter(Boolean).sort(chronological);
  const approved = changelog.filter(e => e.market === market && e.author?.kind === 'analyst').sort((a,b) => chronological(a.at,b.at)).at(-1);
  const relevant = reviews.filter(r => r.markets?.includes(market)).sort((a,b) => chronological(a.asOf,b.asOf));
  const review = relevant.at(-1);
  const analysed = relevant.filter(r => r.checked).at(-1);
  return { market, latestObservation: observations.at(-1) ?? null,
    lastAnalysedSnapshot: analysed?.dataCommit ?? null,
    approvedStrategyVersion: approved?.id ?? viewHash,
    lastApprovedChange: approved?.at ?? null,
    status: review?.status ?? (observations.length ? 'observations available' : 'analysis not started') };
}
