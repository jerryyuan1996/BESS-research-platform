/* ---------------------------------------------------------------------------
   The duration card, read from the engine — decision 2 of
   docs/duration-and-route-fit-plan.md (approved 2026-10-15).

   The card used to run the prototype's own model (lab.js, `labModel`) over
   the dashboard's seed curves. On 2026-10-15 that model picked a different
   duration from the archetype in six of eleven markets, and several of its
   curves had gone stale while the engine's had not. This block draws the
   design-fit sweep instead (src/comparison/designFit.js): every route the
   market supports, at every duration it declares, priced by the comparison
   engine the league table uses. At the archetype it IS the league table's case.

   `labModel` stays where it still does work nothing else does — the project
   dossier and the portfolio screening — and is no longer asked about duration.

   Values are shown per MW in the market's own currency, converted back from
   the engine's USD at the rate the engine used.
   --------------------------------------------------------------------------- */
import { h } from '../../utils/dom.js';
import { L } from '../../app/i18n.js';
import { byId } from '../registry.js';
import { strategyById } from '../../comparison/strategies.js';
import { sweepDesign, fitOf } from '../../comparison/designFit.js';

const T = {
  duration: ['Duration', '时长'],
  value: ['Reference design net value / MW · hold return', '参考方案净增值／MW · 持有回报'],
  best: ['best', '最佳'],
  band: ['band', '区间内'],
  modelled: ['modelled', '当前模型'],
  none: ['No design-fit sweep is declared for this market.', '本市场未声明时长与路径扫描。'],
};

/** @param {object} ctx  the shared engine context ({ MKT, state, fmt }) */
export function createDesignFitBlock(ctx){
  const { MKT, state } = ctx;
  const { fmtCk, fmtIRR } = ctx.fmt;

  /* The Japan dashboard serves three allocation markets through one lens. */
  const marketId = () => (MKT.id === 'jp'
    ? 'jp_' + (state.region && state.region !== 'compare' ? state.region : 'tokyo')
    : MKT.id);

  const routeName = (id) => L(strategyById(id)?.n || [id, id]);
  const native = (p) => p.value / (p.fxRate || 1);
  const same = (a, b) => a && b && a.route === b.route && a.hours === b.hours;

  function blkDesignFit(parent){
    const market = byId(marketId());
    const sweep = market ? sweepDesign(market) : null;
    if (!sweep || sweep.na){
      parent.append(h('div', { class: 'note' }, L(sweep?.na || T.none)));
      return;
    }
    const fit = fitOf(market, { sweep });
    const fx = sweep.points.find(p => p.priced)?.fxRate || 1;
    const inBand = (p) => fit.band.some(b => same(b, p));
    const reasons = new Map();

    const cell = (p) => {
      if (!p.priced){
        if (p.reason) reasons.set(L(p.reason), true);
        return h('td', { class: 'num' }, '—');
      }
      if (!p.eligible && p.reason) reasons.set(L(p.reason), true);
      const tags = [];
      if (same(fit.best, p)) tags.push(L(T.best));
      else if (inBand(p)) tags.push(L(T.band));
      if (p.archetype && p.route === sweep.baseRoute) tags.push(L(T.modelled));
      const label = fmtCk(native(p)) + (p.eligible ? '' : ' ✕');
      return h('td', { class: 'num' },
        same(fit.best, p) ? h('b', {}, label) : label,
        h('small', {}, ' · ' + fmtIRR(p.irrHold) + (tags.length ? ' · ' + tags.join(' · ') : '')));
    };

    parent.append(h('div', { class: 'tbl-wrap' }, h('table', {},
      h('thead', {}, h('tr', {},
        h('th', {}, L(T.duration)),
        ...sweep.routes.map(r => h('th', { class: 'num' }, routeName(r), h('br'), h('small', {}, L(T.value)))))),
      h('tbody', {}, sweep.hours.map(hh => h('tr', {},
        h('td', {}, h('b', {}, hh + 'h')),
        ...sweep.routes.map(r => cell(sweep.points.find(p => p.route === r && p.hours === hh)))))))));

    if (reasons.size){
      parent.append(h('div', { class: 'cap' }, '✕ / — ' + [...reasons.keys()].join(' · ')));
    }

    /* The reading, computed rather than written, so it cannot drift from the table. */
    const a = fit.archetype;
    const en = [], zh = [];
    if (fit.best){
      en.push('Best design: ' + routeName(fit.best.route) + ' at ' + fit.best.hours + 'h, ' + fmtCk(fit.best.value / fx) + '/MW.');
      zh.push('最佳设计：' + routeName(fit.best.route) + '，' + fit.best.hours + '小时，' + fmtCk(fit.best.value / fx) + '/MW。');
    }
    if (a){
      if (!a.eligible){
        en.push('The modelled design does not hold its duration floor for the term.');
        zh.push('当前模型的设计无法在整个期限内维持其时长下限。');
      } else if (a.inBand){
        en.push('The modelled design (' + routeName(a.route) + ', ' + a.hours + 'h) is inside the band.');
        zh.push('当前模型的设计（' + routeName(a.route) + '，' + a.hours + '小时）位于区间之内。');
      } else {
        en.push('The modelled design (' + routeName(a.route) + ', ' + a.hours + 'h) gives up ' + fmtCk(a.valueGivenUp / fx) + '/MW.');
        zh.push('当前模型的设计（' + routeName(a.route) + '，' + a.hours + '小时）较最佳设计少' + fmtCk(a.valueGivenUp / fx) + '/MW。');
      }
    }
    if (fit.restsOnWeakInput?.length){
      en.push('The best design rests on a seed curve: ' + fit.restsOnWeakInput.map(w => w.line).join(', ') + '.');
      zh.push('最佳设计依赖种子曲线：' + fit.restsOnWeakInput.map(w => w.line === 'capture' ? '捕获曲线' : '容量曲线').join('、') + '。');
    }
    if (en.length) parent.append(h('div', { class: 'note' }, L([en.join(' '), zh.join('')])));
  }

  return { blkDesignFit };
}
