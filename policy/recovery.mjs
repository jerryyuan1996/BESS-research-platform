/** Only the committed, hash-verified policy snapshot acknowledges a document.
 * Older ledger documentHashes describe attempts, not successful publication. */
export function pendingDocuments(records,snapshot){
  return (records||[]).filter(record=>{
    const current=record.lastKnownGood;
    if(!['changed','unchanged'].includes(record.status)||!current?.url||!current.contentHash)return false;
    const prior=[...(snapshot?.sources||[])].reverse().find(source=>source.url===current.url);
    return !prior||prior.contentHash!==current.contentHash;
  });
}
