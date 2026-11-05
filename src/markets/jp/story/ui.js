/* Japan-local composition only. Shared SVG, symbols, controls and shell stay
   unchanged; teaching memory never writes the case, address or history. */
import {h} from '../../../utils/dom.js';
import {L} from '../../../app/i18n.js';
import {fillPair} from '../../../experience/story/contract.js';
import {s,uid} from '../../../experience/story/kit/svg.js';
import {toggleGroup} from '../../../experience/story/kit/controls.js';
import {isoStage} from '../../../experience/story/kit/symbols.js';
import {JP_TEXT,JP_UI} from '../story.js';
import {datePair} from '../storyBindings.js';

export {h,L,s,uid,JP_UI};
export const text=(pair,values={})=>L(fillPair(pair,values));
export const replace=(node,...kids)=>node.replaceChildren(...kids.flat(Infinity).filter(v=>v!==null&&v!==undefined&&v!==false));
export const note=(pair,values={})=>h('p',{class:'jp-readout'},text(pair,values));
export const label=(shot,key,values={})=>text(shot.labels[key],values);
export const legend=()=>{const sides=JP_TEXT.Legend.map(s=>s.split(' · '));return sides[0].map((s,i)=>[s,sides[1][i]]);};
export const tag=kind=>h('span',{class:'jp-tag','data-kind':kind},L(legend()[{schematic:0,observed:1,plan:2,example:3,model:4}[kind]]));
export const panel=(title,...kids)=>h('section',{class:'jp-panel'},title?h('h5',{},Array.isArray(title)?L(title):title):null,...kids);

export function diagram(name,width,height,...kids){
  const id=uid('jp-diagram');
  return s('svg',{class:'jp-drawing k-chart',viewBox:`0 0 ${width} ${height}`,role:'img','aria-labelledby':id},s('title',{id},Array.isArray(name)?L(name):name),...kids);
}

export function hatch(){
  const id=uid('jp-hatch');
  return {id,node:s('defs',{},s('pattern',{id,width:8,height:8,patternUnits:'userSpaceOnUse'},s('path',{d:'M-2,2L2,-2M0,8L8,0M6,10L10,6',class:'jp-hatch-line'})))};
}

export function station(shot,values,{time='day',future=false,lift=true,items=[]}={}){
  return isoStage({viewBox:[600,270],origin:[180,75],sky:false,time,title:fillPair(shot.question,values),desc:fillPair(shot.meaning||shot.copy,values),
    items:[{symbol:'pad',at:[0,0],opts:{w:12,d:7}},{symbol:'battery',at:[1,1],opts:{future},lift:lift?1.2:0},
      {symbol:'pcs',at:[5,1]},{symbol:'transformer',at:[8,1]},{symbol:'controls',at:[4,5]},{symbol:'meter',at:[9,5]},...items]});
}

const memory=new Map();
/** State belongs to one area and shot and survives the shell's language redraw. */
export function interactive(shot,ctx,draw,{options=shot.controls}={}){
  const key=ctx.row.id+'/'+shot.id;
  if(!memory.has(key))memory.set(key,0);
  const body=h('div',{class:'jp-scene-body','aria-live':'polite'});
  const render=()=>{const selected=memory.get(key);body.setAttribute('data-teaching-state',selected);replace(body,draw(selected));};
  const controls=options.length>1?toggleGroup({label:fillPair(shot.question,ctx.values),options:options.map((pair,i)=>({value:i,label:fillPair(pair,ctx.values)})),value:memory.get(key),onChange:value=>{memory.set(key,value);render();}}):null;
  render();
  return h('div',{class:'jp-scene k-scene','data-scene':shot.id},controls,body);
}

export function table(headers,rows,{caption,attrs={}}={}){
  return h('div',{class:'jp-table-wrap',tabindex:0,role:'region','aria-label':caption?(Array.isArray(caption)?L(caption):caption):L(JP_UI.table)},h('table',{class:'jp-table',...attrs},
    caption?h('caption',{},Array.isArray(caption)?L(caption):caption):null,
    h('thead',{},h('tr',{},headers.map(v=>h('th',{scope:'col'},Array.isArray(v)?L(v):v)))),
    h('tbody',{},rows.map(row=>h('tr',{},row.map(v=>h('td',{},Array.isArray(v)?L(v):v)))))));
}

const includes=(path,region,sourceIds,p)=>{
  if(!sourceIds.has(p.sourceRef))return false;
  if(path.startsWith('regional.'))return path.startsWith('regional.'+region+'.');
  if(path.startsWith('history.H-JP-TK'))return region==='tokyo';
  if(path.startsWith('history.H-JP-KY'))return region==='kyushu';
  if(path.startsWith('history.H-JP-HK'))return region==='hokkaido';
  return true;
};
let provenance;
export function attachEvidence(dialog,story,row){
  const attached=new WeakSet(),region=row.id.slice(3);
  const attach=()=>{
    for(const article of dialog.querySelectorAll('[data-shot]')){
      const details=article.querySelector('.ix-story-sources');
      if(!details||attached.has(details))continue;
      attached.add(details);
      details.addEventListener('toggle',async()=>{
        if(!details.open||details.querySelector('.jp-provenance'))return;
        const host=h('div',{class:'jp-provenance'});details.append(host);
        const load=async()=>{
          replace(host,note(JP_TEXT['Loading / retry'].map(s=>s.split(' · ')[0])));
          try{
            provenance||=import('../data/storyEvidenceProvenance.js');
            const {JP_STORY_PROVENANCE:records}=await provenance;
            if(!details.isConnected)return;
            const id=article.getAttribute('data-shot');
            const shot=[story.opening,...story.chapters.flatMap(c=>c.shots)].find(s=>s.id===id);
            const sourceIds=new Set((shot.claims||[]).flatMap(c=>story.claims[c].sources));
            const shown=Object.entries(records).filter(([path,p])=>includes(path,region,sourceIds,p));
            replace(host,...shown.map(([path,p])=>h('section',{class:'jp-record'},
              h('code',{},path),h('p',{},h('a',{href:p.url,target:'_blank',rel:'noopener noreferrer'},p.sourceRef),' · ',p.locator),
              h('p',{},L(JP_UI.checked),' ',L(datePair(p.checkedOn)),' · ',L(JP_UI.units),' ',L(JP_UI.unitNames[p.unit]||[p.unit,p.unit]),' · ',L(JP_UI.statementTypes[p.statementType])))),
              ...(shot.claims||[]).filter(id=>story.claims[id].type==='interpretation').map(id=>h('p',{class:'jp-interpretation'},L(JP_TEXT.Interpretation),' · ',id)));
          }catch{
            provenance=undefined;
            const parts=JP_TEXT['Loading / retry'].map(s=>s.split(' · '));
            replace(host,note([parts[0][1],parts[1][1]]),h('button',{type:'button',class:'ix-button ix-outline',onclick:load},L([parts[0][2],parts[1][2]])));
          }
        };
        await load();
      });
    }
    for(const id of ['jp-02','jp-08']){
      const meaning=dialog.querySelector(`[data-shot="${id}"] .ix-shot-meaning`);
      if(meaning&&!meaning.querySelector('.jp-interpretation'))meaning.prepend(h('span',{class:'jp-interpretation'},L(JP_TEXT.Interpretation),' · '));
    }
  };
  attach();dialog.addEventListener('click',attach);
}
