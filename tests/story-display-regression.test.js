import test from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/app/state.js';
import { openStory } from '../src/experience/story/shell.js';
import { story } from '../src/markets/nem/story.js';
import { storyValues } from '../src/markets/nem/storyBindings.js';
import { opportunities, CALLS, returnPct } from '../src/experience/model.js';
import { executionTimelines } from '../src/opportunities/deliveryUI.js';
import { referenceInvestment } from '../src/opportunities/investment.js';

// Native append/replaceChildren stringify null and undefined. Do not silently
// discard them here: that would conceal the execution panel's regression.
class Element {
  constructor(tag){this.tag=tag;this.nodeType=1;this.children=[];this.attrs={};this.style={};this.listeners={};}
  setAttribute(k,v){this.attrs[k]=String(v);}
  getAttribute(k){return this.attrs[k]??null;}
  removeAttribute(k){delete this.attrs[k];}
  addEventListener(k,fn){this.listeners[k]=fn;}
  append(...kids){this.children.push(...kids.map(k=>k?.nodeType?k:{nodeType:3,textContent:String(k)}));}
  replaceChildren(...kids){this.children=[];this.append(...kids);}
  querySelectorAll(selector){return descendants(this).filter(n=>selector==='button[data-chapter]'?n.tag==='button'&&n.attrs['data-chapter']:false);}
  querySelector(){return null;}
  get dataset(){return {chapter:this.attrs['data-chapter']};}
  get textContent(){return this.children.map(n=>n.textContent).join('');}
  showModal(){this.open=true;}
  close(){this.open=false;}
  remove(){}
  focus(){}
}
const descendants=n=>[n,...(n.children||[]).flatMap(descendants)];
function withDom(fn){
  const previous=globalThis.document,lang=app.lang;
  globalThis.document={createElement:tag=>new Element(tag),createElementNS:(_,tag)=>new Element(tag),createTextNode:text=>({nodeType:3,textContent:String(text)}),body:new Element('body'),querySelector:()=>null};
  try{fn();}finally{globalThis.document=previous;app.lang=lang;}
}
const row=opportunities('infraFund').find(r=>r.id==='nem');

test('the real story shell resolves factor tokens using the unchanged live counterpoint in EN and ZH',()=>withDom(()=>{
  const values=storyValues(row,{CALLS,returnPct}),before=JSON.stringify(row);
  for(const [index,lang]of ['en','zh'].entries()){
    app.lang=lang;
    const dialog=openStory({story,values,row,name:['NEM','NEM'],ui:{CALLS,returnPct,marginText:()=>'',metric:()=>'',playTitle:()=>''}});
    assert.ok(dialog);
    const factors=descendants(dialog).find(n=>n.className==='ix-story-factors');
    assert.ok(factors.textContent.includes(row.decision.counterpoint[index]));
    assert.doesNotMatch(factors.textContent,/\{[A-Za-z][A-Za-z0-9]*\}|\bnull\b|undefined|NaN/);
    dialog.listeners.close();
  }
  assert.equal(JSON.stringify(row),before,'rendering changes no investment judgement');
}));

test('execution with one or two plans and with or without later cash never prints optional null nodes',()=>withDom(()=>{
  const reference=referenceInvestment(row.market,'infraFund',row.play).result;
  for(const lang of ['en','zh'])for(const plans of [1,2])for(const laterCash of [true,false]){
    app.lang=lang;
    const r=laterCash?reference:{...reference,qualifiedMonths:10000};
    const comparison={standard:r,stage:'ready-to-build',...(plans===2?{alternative:r}:{})};
    const before=JSON.stringify(comparison),panel=executionTimelines(comparison,row,'infraFund');
    assert.doesNotMatch(panel.textContent,/\bnull\b|undefined|NaN/);
    assert.equal(descendants(panel).filter(n=>n.className==='ix-plan-switch').length,plans===2?1:0);
    assert.equal(descendants(panel).filter(n=>n.className==='ix-details ix-later-cash').length,laterCash?1:0);
    assert.equal(JSON.stringify(comparison),before,'rendering preserves cash-flow inputs');
  }
}));
