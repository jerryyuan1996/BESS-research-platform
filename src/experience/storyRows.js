import { HOME_BRIEFING } from '../briefing/homeData.js';

/** Each cohort keeps its own call. Only the selected row owns the financial case. */
export function storyRowsFor(row, lens = 'infraFund') {
  if (row.id !== 'pl') return [row];
  const rows = HOME_BRIEFING.lenses[lens]?.rows || [];
  return [row, ...rows.filter(r => r.market === row.id && r.play !== row.play?.id).map(r => {
    const play = HOME_BRIEFING.plays[`${r.market}/${r.play}`];
    return { ...r, id: row.id, market: row.market, play, econ: play?.econ || {} };
  })];
}
