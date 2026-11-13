import { HOME_BRIEFING } from '../briefing/homeData.js';

/** Each cohort keeps its own call. Only the selected row owns the financial case. */
export function storyRowsFor(row, lens = 'infraFund') {
  if(!['it','pl'].includes(row.id))return [row];
  const rows = HOME_BRIEFING.lenses[lens]?.rows || [];
  const own=rows.filter(r=>r.market===row.id);
  const project=r=>{
    if(r.play===row.play?.id)return row;
    const play=HOME_BRIEFING.plays[`${row.id}/${r.play}`];
    return {...r,id:row.id,market:row.market,play,econ:play?.econ||{}};
  };
  return row.id==='it'?own.map(project):[row,...own.filter(r=>r.play!==row.play?.id).map(project)];
}

/** Governed route definitions are selectable as references even when another
 * investor's lens owns the recommendation; no call is borrowed across lenses. */
export function investmentRowsFor(row, lens='infraFund') {
  const calls=HOME_BRIEFING.lenses[lens]?.rows||[];
  const plays=Object.values(HOME_BRIEFING.plays).filter(p=>p.market===row.id);
  const rows=plays.length?plays.map(play=>{
    if(play.id===row.play?.id)return row;
    const call=calls.find(r=>r.market===row.id&&r.play===play.id);
    return {...call,id:row.id,market:row.market,play,econ:play.econ||{},
      stage:call?.stage||'ready-to-build',call:call?.call||'reference',referenceOnly:!call};
  }):[row];
  if(!['pjm','ercot','caiso'].includes(row.id))return rows;
  return rows.flatMap(r=>['non-feoc','chinese'].map(supplyCase=>({...r,supplyCase,
    caseLabel:supplyCase==='chinese'?['Chinese DC block · no credit','中国电池舱 · 无抵免']:['Non-FEOC DC block · model tax credit','非 FEOC 电池舱 · 模型抵免']})));
}
