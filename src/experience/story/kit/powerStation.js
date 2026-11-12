/* Original cutaway equipment, in the existing 2:1 projection. These are teaching
   symbols, not an engineering drawing or a vendor specification.

   Every option is opt-in: a symbol called with a position and nothing else
   draws exactly what it drew before the options existed.

     batteryCutaway   soc 0..1 fills the modules from the bottom and draws a
                      state-of-charge gauge; climate adds the cooling unit and
                      the fire-suppression cabinet; shadow grounds the enclosure
     detailedPCS,
     detailedTransformer   lamp: 'ok' | 'limited' | 'off', a status lamp
     disconnector     the switch between the busbar and the grid, open or closed */
import {s} from './svg.js';
import {box,plane,isoLine,at,points} from './iso.js';
const group=(id,...children)=>s('g',{'data-component':id,class:'public-equipment'},...children);
const lamp=(state,x,y,z)=>{const [cx,cy]=at(x,y,z);return s('circle',{class:'public-lamp is-'+state,cx,cy,r:3.2});};
const shade=(x,y,w,d,reach)=>s('polygon',{class:'public-shadow',points:points([[x+w,y,.01],[x+w+reach,y+reach*.35,.01],[x+w+reach,y+d+reach*.35,.01],[x+w,y+d,.01]])});

export function batteryCutaway(x,y,{soc=null,climate=false,shadow=false}={}){
  const racks=[];
  /* Whole rows of modules read as charged, from the bottom, like a level. */
  const charged=soc==null?null:Math.round(Math.min(1,Math.max(0,soc))*5);
  for(let col=0;col<5;col++){
    racks.push(box(x+.45+col*1.05,y+.35,.45,.88,2.35,2.15,{cls:'public-rack-frame'}));
    for(let row=0;row<5;row++){
      racks.push(box(x+.52+col*1.05,y+2.4,.58+row*.36,.72,.22,.27,{cls:'public-cell-module'+(charged==null?'':row<charged?' is-charged':' is-empty')}));
      racks.push(isoLine([[x+.6+col*1.05,y+2.64,.68+row*.36],[x+1.05+col*1.05,y+2.64,.68+row*.36]],{cls:'public-module-detail'}));
    }
  }
  const extras=[];
  if(soc!=null){
    const level=Math.min(1,Math.max(0,soc))*2.1;
    extras.push(box(x-.02,y+3.3,.5,.2,.06,2.1,{cls:'public-gauge'}));
    if(level>0)extras.push(box(x-.02,y+3.31,.5,.2,.06,level,{cls:'public-gauge-fill'}));
  }
  if(climate){
    const [fx,fy]=at(x-.45,y+2.02,1.05);
    extras.push(s('g',{class:'public-climate'},
      box(x-.9,y+.5,.12,.86,1.5,1.55,{cls:'public-hvac'}),
      s('ellipse',{class:'public-fan',cx:fx,cy:fy,rx:7,ry:8}),
      s('path',{class:'public-fan',d:`M${fx-5},${fy-4} L${fx+5},${fy+4} M${fx-5},${fy+4} L${fx+5},${fy-4}`}),
      box(x+5.9,y+2.05,.5,.5,.5,1.05,{cls:'public-fire-cabinet'})));
  }
  return group('battery',shadow?shade(x,y,6,3.3,1.4):null,plane(x-.3,y-.3,.02,6.6,3.9,{cls:'public-pad'}),
    box(x,y,.12,6,3.3,.28,{cls:'public-station-base'}),
    box(x,y,.4,6,.16,2.65,{cls:'public-station-shell'}),
    box(x,y,.4,.18,3.3,2.65,{cls:'public-station-shell'}),
    ...racks,
    // The front is cut away; the partial roof keeps the structure legible.
    box(x-.08,y-.08,3.05,6.16,.95,.18,{cls:'public-station-roof'}),
    box(x+5.83,y,.4,.17,3.3,2.65,{cls:'public-station-shell'}),
    ...Array.from({length:5},(_,i)=>isoLine([[x+5.84,y+.5+i*.45,1],[x+5.84,y+.5+i*.45,2.4]],{cls:'public-vent'})),
    isoLine([[x+.3,y+3.38,.7],[x+5.7,y+3.38,.7]],{cls:'public-dc-bus'}),
    box(x+5.9,y+2.8,.5,.5,.5,1.35,{cls:'public-safety-panel'}),
    ...extras);
}
export function detailedPCS(x,y,{lamp:state=null,shadow=false}={}){
  const nodes=[shadow?shade(x,y,2.15,1.6,1):null,plane(x-.2,y-.2,.02,2.7,2.2,{cls:'public-pad'})];
  for(let i=0;i<2;i++){
    nodes.push(box(x+i*1.15,y,.15,1,1.6,2.05,{cls:'public-pcs-cabinet'}));
    nodes.push(box(x+.2+i*1.15,y+1.61,1.4,.5,.04,.45,{cls:'public-control-screen'}));
    for(let j=0;j<5;j++)nodes.push(isoLine([[x+.15+i*1.15,y+1.64,.4+j*.13],[x+.85+i*1.15,y+1.64,.4+j*.13]],{cls:'public-vent'}));
    if(state)nodes.push(lamp(state,x+.82+i*1.15,y+1.64,1.98));
  }
  return group('pcs',...nodes);
}
export function detailedTransformer(x,y,{lamp:state=null,shadow=false}={}){
  return group('transformer',shadow?shade(x+.4,y+.3,1.7,1.55,1.1):null,plane(x-.35,y-.25,.02,3.3,2.6,{cls:'public-pad'}),
    box(x+.4,y+.3,.2,1.7,1.55,1.65,{cls:'public-transformer-tank'}),
    ...Array.from({length:7},(_,i)=>box(x+.35+i*.27,y+1.85,.4,.12,.34,1.2,{cls:'public-cooling-fin'})),
    ...Array.from({length:3},(_,i)=>s('g',{},
      box(x+.65+i*.5,y+.8,1.85,.17,.17,.7,{cls:'public-insulator'}),
      ...Array.from({length:4},(_,j)=>box(x+.61+i*.5,y+.76,1.95+j*.13,.25,.25,.045,{cls:'public-insulator'})))),
    isoLine([[x+.74,y+.89,2.55],[x+1.74,y+.89,2.55]],{cls:'public-hv-wire'}),
    state?lamp(state,x+.62,y+1.86,1.7):null);
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
/** The switch between the busbar and the grid: two posts and a blade, shut or
 *  raised. Open means the plant can neither charge nor discharge. */
export function disconnector(x,y,{open=false}={}){
  return s('g',{class:'public-disconnector '+(open?'is-open':'is-closed'),'aria-hidden':'true'},
    box(x,y,.1,.14,.14,1.9,{cls:'public-insulator'}),box(x+.9,y,.1,.14,.14,1.9,{cls:'public-insulator'}),
    isoLine(open?[[x+.07,y+.07,2],[x+.62,y+.07,2.62]]:[[x+.07,y+.07,2],[x+.97,y+.07,2]],{cls:'public-blade'}));
}
