/* Original cutaway equipment, in the existing 2:1 projection. These are teaching
   symbols, not an engineering drawing or a vendor specification. */
import {s} from './svg.js';
import {box,plane,isoLine,at} from './iso.js';
const group=(id,...children)=>s('g',{'data-component':id,class:'public-equipment'},...children);

export function batteryCutaway(x,y){
  const racks=[];
  for(let col=0;col<5;col++){
    racks.push(box(x+.45+col*1.05,y+.35,.45,.88,2.35,2.15,{cls:'public-rack-frame'}));
    for(let row=0;row<5;row++){
      racks.push(box(x+.52+col*1.05,y+2.4,.58+row*.36,.72,.22,.27,{cls:'public-cell-module'}));
      racks.push(isoLine([[x+.6+col*1.05,y+2.64,.68+row*.36],[x+1.05+col*1.05,y+2.64,.68+row*.36]],{cls:'public-module-detail'}));
    }
  }
  return group('battery',plane(x-.3,y-.3,.02,6.6,3.9,{cls:'public-pad'}),
    box(x,y,.12,6,3.3,.28,{cls:'public-station-base'}),
    box(x,y,.4,6,.16,2.65,{cls:'public-station-shell'}),
    box(x,y,.4,.18,3.3,2.65,{cls:'public-station-shell'}),
    ...racks,
    // The front is cut away; the partial roof keeps the structure legible.
    box(x-.08,y-.08,3.05,6.16,.95,.18,{cls:'public-station-roof'}),
    box(x+5.83,y,.4,.17,3.3,2.65,{cls:'public-station-shell'}),
    ...Array.from({length:5},(_,i)=>isoLine([[x+5.84,y+.5+i*.45,1],[x+5.84,y+.5+i*.45,2.4]],{cls:'public-vent'})),
    isoLine([[x+.3,y+3.38,.7],[x+5.7,y+3.38,.7]],{cls:'public-dc-bus'}),
    box(x+5.9,y+2.8,.5,.5,.5,1.35,{cls:'public-safety-panel'}));
}
export function detailedPCS(x,y){
  const nodes=[plane(x-.2,y-.2,.02,2.7,2.2,{cls:'public-pad'})];
  for(let i=0;i<2;i++){
    nodes.push(box(x+i*1.15,y,.15,1,1.6,2.05,{cls:'public-pcs-cabinet'}));
    nodes.push(box(x+.2+i*1.15,y+1.61,1.4,.5,.04,.45,{cls:'public-control-screen'}));
    for(let j=0;j<5;j++)nodes.push(isoLine([[x+.15+i*1.15,y+1.64,.4+j*.13],[x+.85+i*1.15,y+1.64,.4+j*.13]],{cls:'public-vent'}));
  }
  return group('pcs',...nodes);
}
export function detailedTransformer(x,y){
  return group('transformer',plane(x-.35,y-.25,.02,3.3,2.6,{cls:'public-pad'}),
    box(x+.4,y+.3,.2,1.7,1.55,1.65,{cls:'public-transformer-tank'}),
    ...Array.from({length:7},(_,i)=>box(x+.35+i*.27,y+1.85,.4,.12,.34,1.2,{cls:'public-cooling-fin'})),
    ...Array.from({length:3},(_,i)=>s('g',{},
      box(x+.65+i*.5,y+.8,1.85,.17,.17,.7,{cls:'public-insulator'}),
      ...Array.from({length:4},(_,j)=>box(x+.61+i*.5,y+.76,1.95+j*.13,.25,.25,.045,{cls:'public-insulator'})))),
    isoLine([[x+.74,y+.89,2.55],[x+1.74,y+.89,2.55]],{cls:'public-hv-wire'}));
}
export function detailedBusbar(x,y){
  return group('busbar',plane(x-.3,y-.3,.02,3,3.7,{cls:'public-pad'}),
    box(x,y,.1,.25,.25,3.2,{cls:'public-bus-frame'}),box(x,y+2.8,.1,.25,.25,3.2,{cls:'public-bus-frame'}),
    box(x-.08,y-.1,3.25,.4,3.25,.25,{cls:'public-bus-frame'}),
    ...Array.from({length:3},(_,i)=>s('g',{},
      box(x+.5+i*.62,y+1,.15,.16,.16,1.85,{cls:'public-insulator'}),
      isoLine([[x+.58+i*.62,y+.2,2],[x+.58+i*.62,y+2.7,2]],{cls:'public-hv-wire'}))));
}
export function meterPoint(x,y){
  const p=at(x+.5,y+.5,2);
  return group('connection',plane(x-.2,y-.2,.02,1.7,1.4,{cls:'public-pad'}),
    box(x,y,.1,1.2,.9,1.7,{cls:'public-pcs-cabinet'}),
    box(x+.22,y+.91,1,.65,.04,.4,{cls:'public-control-screen'}),
    s('circle',{cx:p[0],cy:p[1],r:6,class:'public-poc-ring'}));
}
