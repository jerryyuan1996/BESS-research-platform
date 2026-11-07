/* Per-value locators, loaded only when a reader opens a shot's source
   disclosure (storyPack.js): list the fixed-vintage records that shot binds, each with its document, exact
   locator, unit, calculation and check date. Read from the same records the
   tokens resolve from; withheld and gated records are not listed. The pack
   passes the records in: importing them here would make Rollup export from
   the pack's chunk and drop its name. */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';

export const shotRecords = R => ({
  'ercot-01': [R.dcTies],
  'ercot-02': [R.offerCap, ...['H-ERCOT-01', 'H-ERCOT-03', 'H-ERCOT-04', 'H-ERCOT-06'].map(id => R.history[id])],
  'ercot-03': [R.connection],
  'ercot-04': ['H-ERCOT-02', 'H-ERCOT-05'].map(id => R.history[id]),
  'ercot-06': [R.revenuePerKW2025],
  'ercot-07': [R.ordc2025],
  'ercot-08': ['regUp', 'rrs', 'ecrs', 'nonSpin'].map(k => R.reserveRules[k]),
  'ercot-09': [R.fleetDuration2025],
});

const where = loc => [loc.document, loc.printedPage != null ? `p. ${[].concat(loc.printedPage).join(', ')}` : null, loc.section, loc.table, loc.row, loc.clause].filter(Boolean).join(' · ');
const checked = (ids, R) => [...new Set(ids.map(id => R.sources[id]?.checkedOn).filter(Boolean))].join(', ');

export function recordLines(record, R) {
  if (record.event) return [record.id, `${record.dates.join(' to ')} · ${record.locators.map(where).join('; ')} · ${record.event}`];
  return [record.id, [where(record.locator), record.unit, record.calculation?.formula, record.qualifier, checked(record.sourceIds, R) && `checked ${checked(record.sourceIds, R)}`].filter(Boolean).join(' · ')];
}

/** The locator block for one shot, or null when the shot binds no record. */
export function locatorBlock(shotId, R) {
  const list = shotRecords(R)[shotId];
  if (!list) return null;
  return h('div', { class: 'ercot-provenance' },
    h('h5', {}, L(['Value locators and arithmetic', '逐值出处与计算'])),
    h('dl', {}, list.flatMap(record => { const [id, text] = recordLines(record, R); return [h('dt', {}, id), h('dd', {}, text)]; })));
}
