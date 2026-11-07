/* Project overlays are loaded only by an interactive map with actual records.
   Clustering, coordinates, legacy labels and zone-price markers retain their rules. */
import { clusterProjects, clusterLabel } from './clusters.js';
import { energyMWh } from './projectValues.js';
import { L } from '../app/i18n.js';
import { h } from '../utils/dom.js';

export function renderProjectMarkers(projectLayer,projects,{projection,view,zoneClusters,svgEl,appendText}){
    /* Screen position: the viewport transform has not been applied to these
       coordinates yet, so the clusterer sees the same pixels the reader will. */
    const toScreen = (p) => {
      const xy = projection([p.lon, p.lat]);
      return xy ? [xy[0] * view.zoom + view.x, xy[1] * view.zoom + view.y] : null;
    };

    // A dated inventory is not projected backwards or into the planned system.
    for (const marker of clusterProjects(projects, toScreen, { zoom:view.zoom })){
      // Back out of screen space: the layer is inside the transformed viewport.
      const cx = (marker.x - view.x) / view.zoom;
      const cy = (marker.y - view.y) / view.zoom;
      const g = svgEl('g', {
        class:`geo-project ${marker.stage}` + (marker.kind === 'cluster' ? ' cluster' : ''),
        'data-project-count':String(marker.count||1),
        'data-project-ids':(marker.projects||[marker.project]).map(p=>p.id).join(' '),
        transform:`translate(${cx} ${cy}) scale(${1 / view.zoom})`,
      });

      if (marker.kind === 'cluster'){
        g.append(svgEl('circle', { class:'geo-project-shape', r:11 }));
        g.append(appendText(svgEl('text', { class:'geo-project-count', y:3.5 }), String(marker.count)));
        g.append(appendText(svgEl('title'), L(clusterLabel(marker))));
      } else {
        const p = marker.project;
        const energy = energyMWh(p);
        g.append(svgEl('circle', { class:'geo-project-shape', r:5.5 }));
        g.append(appendText(svgEl('title'),
          `${p.name} — ${Math.round(p.capacityMW)} MW`
          + (energy != null ? ` / ${Math.round(energy)} MWh` + (p.energyObservation ? ` (${p.energyObservation.reportingPeriod})` : '') : L([' · energy not published', ' · 未公布能量容量']))
          + (p.storageEvidence?.durationHours != null ? L([` · ${p.storageEvidence.reportingYear} discharge hours: ${p.storageEvidence.durationHours.toFixed(2)}`,` · ${p.storageEvidence.reportingYear} 年放电时长：${p.storageEvidence.durationHours.toFixed(2)}`]) : '')
          + (p.operator ? ` — ${p.operator}` : '')));
      }
      projectLayer.append(g);
    }

    /* Italy only: Terna publishes MACSE volume nationally and price by zone, so
       these markers carry a price and deliberately no capacity. They are drawn
       through the same layer but never through the clusterer, which sums. */
    for (const zone of zoneClusters || []){
      const p = projection(zone.coord);
      if (!p) continue;
      const g = svgEl('g', {
        class:'geo-project zone-cluster',
        transform:`translate(${p[0]} ${p[1]}) scale(${1 / view.zoom})`,
      });
      g.append(svgEl('circle', { class:'geo-project-shape', r:10 }));
      g.append(appendText(svgEl('title'), L(zone.label)));
      g.append(appendText(svgEl('text', { class:'geo-project-zone-label', y:-15 }), L(zone.name)));
      projectLayer.append(g);
    }
}

/** Inventory acquisition/controls are absent from the common map bundle. */
export function attachInventory(parent,marketId,options){
  const host=h('div',{class:'eia-inventory-host'});parent.append(host);
  const mount=()=>import('./eiaInventoryView.js').then(module=>{
    if(options.gone())return;host.replaceChildren();module.attachEiaInventory(host,marketId,options);
  }).catch(()=>{
    if(options.gone())return;
    host.replaceChildren(h('p',{},L(['Inventory unavailable.','清单暂不可用。'])),h('button',{type:'button',onclick:mount},L(['Retry inventory','重试清单'])));
  });
  void mount();
}
