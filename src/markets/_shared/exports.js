/* ---------------------------------------------------------------------------
   CSV / JSON export, verbatim from the prototype (GB payload lines 1218-1242).
   Client-side only - a Blob and an object URL, no server involved.
   --------------------------------------------------------------------------- */

/** @param {object} ctx  { MKT, M, state, compute } */
export function createExports(ctx){
  const { MKT, M, state } = ctx;
  const { liveScore } = ctx.compute;function download(name, text, mime){
  const b = new Blob([text], { type: mime });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 500);
}
function exportCsv(){
  const rows = [['metric', 'value', 'unit', 'quality', 'status', 'source']]
    .concat(M.kpiExport.map(r => r.map(x => String(x).replace(/,/g, ';'))));
  download(MKT.ns + '_bess_dashboard_kpis.csv', rows.map(r => r.join(',')).join('\n'), 'text/csv');
}
function exportJson(){
  const o = {
    market: MKT.id, asOf: M.asOf, modelVersion: M.modelVersion, language: state.lang,
    seedTag: MKT.seedTag, currency: MKT.curCode, timezone: MKT.tz,
    official: M.official, calculated: {
      durationNeedIndex: liveScore('durFactors'),
      connectionRiskScore: liveScore('connFactors'),
    },
    pipeline: { stages: M.stages, projects: M.projects },
    peerNamespace: M.peer ? { note: 'context only — never scored', data: M.peer.raw || null } : null,
    disclaimer: 'Seed snapshot only. Illustrative series excluded. Not investment advice.',
  };
  download(MKT.ns + '_bess_dashboard_seed.json', JSON.stringify(o, null, 2), 'application/json');
}
  return { download, exportCsv, exportJson };
}