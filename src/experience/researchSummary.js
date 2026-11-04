import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
const loaders = import.meta.glob(['../markets/*/dashboard.js', '!../markets/_template/**']);

export function marketResearchSummary(market) {
  const holder = h('div',{class:'ix-research-summary','aria-busy':'true'},
    h('p',{},L(['Loading the house view and one-minute orientation…','正在载入本方观点与一分钟市场定位…'])));
  const path = '../markets/'+(market.manifest.dashboardId||market.manifest.id)+'/dashboard.js';
  async function load(){
    holder.setAttribute('aria-busy','true');
    try {
      const module = await loaders[path]();
      if (!holder.isConnected) return;
      holder.replaceChildren();
      /* Awaited, because a market whose sections load on demand has to fetch
         the two it summarises before it can write them. Awaiting a market that
         returns nothing defers the caption by one microtask and changes no
         pixel: nothing paints between a microtask and the frame it belongs to.
         See docs/p1-sections-pilot.md. */
      await module.researchSummary(holder,{basePath:'/markets/'+market.manifest.slug,region:market.manifest.region});
      holder.append(h('p',{class:'ix-caption'},L(['Extracted directly from the full market research · source vintage: ','直接引用完整市场研究 · 原研究口径：']),
        market.manifest.dataDate||market.manifest.asOf));
    } catch {
      if(!holder.isConnected)return;
      holder.replaceChildren(h('p',{},L(['Research summary could not be loaded.','研究摘要暂未载入。'])),
        h('button',{class:'ix-button ix-outline',type:'button',onclick:load},L(['Retry','重试'])));
    } finally { holder.setAttribute('aria-busy','false'); }
  }
  load();
  return holder;
}
