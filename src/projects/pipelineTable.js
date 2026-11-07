/* ---------------------------------------------------------------------------
   The project pipeline, as a table.

   Reads the SAME canonical records the map plots, so the two cannot disagree
   about how many batteries a market has or how big they are. Where the map drops
   a project because it has no coordinates, this table still lists it — a project
   that cannot be plotted is not a project that does not exist, and the pipeline
   section is the honest place for it.

   Totals follow the clustering rules for the same reason: energy is summed only
   when every project in the group publishes one, because a partial sum is a
   smaller number that reads like a complete one.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { fmtN } from '../utils/formatting.js';
import { PROJECT_STAGE, energyMWh, isPlottable } from './projectValues.js';
import { fleetTotals } from './projectTotals.js';

const STAGE_LABEL = {
  [PROJECT_STAGE.OPERATING]: ['Operating', '在运'],
  [PROJECT_STAGE.UNDER_CONSTRUCTION]: ['Under construction', '在建'],
};

function totalsRow(totals, stage){
  const t = totals[stage];
  if (!t?.count) return null;
  const energy = t.energyPeriodsMixed ? L(['energy observation periods differ','能量观测时期不同']) : t.energyMWh != null
    ? fmtN(Math.round(t.energyMWh)) + ' MWh'
    : L(['energy not published for ', '未公布能量容量：']) + (t.count - t.energyKnown) + '/' + t.count;
  return h('div', { class:'pipe-total' },
    h('span', { class:'l' }, L(STAGE_LABEL[stage])),
    h('b', {}, t.count + L([' projects', '个项目'])),
    h('span', {}, fmtN(Math.round(t.powerMW)) + ' MW'),
    h('span', { class:'e' }, energy));
}

/**
 * @param {HTMLElement} parent
 * @param {object} cfg  { projects, licence, caption, sourceNote }
 */
export function renderProjectPipeline(parent, cfg){
  const projects = (cfg.projects || []).filter(p => STAGE_LABEL[p.stage]);
  if (!projects.length) return;

  const totals = fleetTotals(projects);
  const unplottable = projects.filter(p => !isPlottable(p)).length;

  parent.append(h('div', { class:'pipe-totals' },
    totalsRow(totals, PROJECT_STAGE.OPERATING),
    totalsRow(totals, PROJECT_STAGE.UNDER_CONSTRUCTION)));

  const rows = [...projects]
    // Largest first: a pipeline is read for the assets that move the market.
    .sort((a, b) => b.capacityMW - a.capacityMW)
    .map(p => {
      const e = energyMWh(p);
      return h('tr', {},
        h('td', {}, p.name),
        h('td', {}, p.operator || '—'),
        h('td', { class:'num' }, fmtN(Math.round(p.capacityMW)) + ' MW'),
        /* An em dash, never a zero. A battery with no published duration is not
           a battery with no energy. */
        h('td', { class:'num' }, e != null ? fmtN(Math.round(e)) + ' MWh' : '—'),
        h('td', {}, L(STAGE_LABEL[p.stage])),
        h('td', {}, p.expectedCod || '—'));
    });

  parent.append(h('div', { class:'tbl-wrap' }, h('table', { class:'pipe-table' },
    h('thead', {}, h('tr', {},
      h('th', {}, L(['Project', '项目'])),
      h('th', {}, L(['Operator', '运营方'])),
      h('th', { class:'num' }, L(['Power', '功率'])),
      h('th', { class:'num' }, L(['Energy', '能量'])),
      h('th', {}, L(['Status', '状态'])),
      h('th', {}, L(['COD', '投运日期'])))),
    h('tbody', {}, rows))));

  const notes = [];
  if (unplottable){
    notes.push(L([
      `${unplottable} of these carry no published location and are listed here but not mapped.`,
      `其中${unplottable}个未公布位置，仅在此列示、不在地图上呈现。`,
    ]));
  }
  if (cfg.sourceNote) notes.push(L(cfg.sourceNote));
  if (cfg.licence){
    notes.push(`${cfg.licence.attribution} · ${cfg.licence.name}`);
  }
  if (notes.length) parent.append(h('div', { class:'cap' }, notes.join(' ')));
}

/** Italy's zonal variant: awards with a price per zone and no capacity per zone. */
export function renderZoneAwards(parent, cfg){
  const { auction, zones, caption } = cfg;
  if (!auction || !zones?.length) return;

  parent.append(h('div', { class:'pipe-totals' },
    h('div', { class:'pipe-total' },
      h('span', { class:'l' }, L(['Awarded', '已中标'])),
      h('b', {}, auction.projects + L([' projects', '个项目'])),
      h('span', {}, fmtN(Math.round(auction.powerMW)) + ' MW'),
      h('span', { class:'e' }, fmtN(auction.energyMWh) + ' MWh'))));

  parent.append(h('div', { class:'tbl-wrap' }, h('table', { class:'pipe-table' },
    h('thead', {}, h('tr', {},
      h('th', {}, L(['Market zone', '市场分区'])),
      h('th', { class:'num' }, L(['Clearing price', '出清价格'])),
      h('th', {}, L(['Awarded capacity', '中标容量'])))),
    h('tbody', {}, zones.map(z => h('tr', {},
      h('td', {}, L(z.name)),
      h('td', { class:'num' }, '€' + fmtN(z.clearingPriceEurPerMWhYear) + L(['/MWh-yr', '/MWh·年'])),
      /* The point of this table. Terna publishes volume nationally and price by
         zone, so the capacity column says so rather than being left blank —
         a blank cell reads as zero. */
      h('td', { class:'muted' }, L(['not published by zone', '未按分区公布']))))))));

  if (caption) parent.append(h('div', { class:'cap' }, L(caption)));
}
