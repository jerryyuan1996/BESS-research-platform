import test from 'node:test';
import assert from 'node:assert/strict';
class El {
 constructor(tag){this.tag=tag;this.nodeType=1;this.attrs=new Map();this.children=[];this.listeners={};}
 setAttribute(k,v){this.attrs.set(k,String(v));} getAttribute(k){return this.attrs.get(k)??null;}
 set className(v){this.setAttribute('class',v);} get className(){return this.getAttribute('class')??'';}
 set value(v){this._value=String(v);} get value(){return this._value??this.getAttribute('value')??'';}
 append(...kids){for(let kid of kids){if(kid==null)continue;if(!kid.nodeType)kid={nodeType:3,text:String(kid)};kid.parentNode=this;this.children.push(kid);}}
 replaceChildren(...kids){this.children=[];this.append(...kids);} get firstChild(){return this.children[0]??null;}
 set textContent(v){this.replaceChildren({nodeType:3,text:String(v)});} get textContent(){return content(this);}
 addEventListener(type,fn){(this.listeners[type]??=[]).push(fn);} click(){for(const fn of this.listeners.click??[])fn({target:this,preventDefault(){}});}
}
const all=node=>[node,...(node.children??[]).flatMap(all)];
const content=node=>all(node).filter(n=>n.nodeType===3).map(n=>n.text).join(' ');
globalThis.document={createElement:tag=>new El(tag),createElementNS:(_,tag)=>new El(tag),createTextNode:text=>({nodeType:3,text:String(text)})};
const {scenes}=await import('../src/markets/caiso/story/scenes.js');
const {story}=await import('../src/markets/caiso/story.js');
const {storyValues}=await import('../src/markets/caiso/storyBindings.js');
const {CAISO_TEACHING}=await import('../src/markets/caiso/story/teaching.js');
const {MAP}=await import('../src/markets/caiso/story/geo.js');
const {LABELS,HISTORY_TEXT}=await import('../src/markets/caiso/story/labels.js');
const {fillPair}=await import('../src/experience/story/contract.js');
const {app}=await import('../src/app/state.js');
const {opportunities,CALLS}=await import('../src/experience/model.js');
const row=opportunities('infraFund').find(r=>r.id==='caiso'),teaching=CAISO_TEACHING(row),values=storyValues(row,{CALLS},teaching);
const shots=story.chapters.flatMap(c=>c.shots),build=shot=>scenes[shot.id](shot,{row,values});

test('all thirteen non-opening CAISO scenes render bilingually through the unchanged kit',()=>{
 assert.deepEqual(Object.keys(scenes),shots.map(s=>s.id));
 for(const lang of ['en','zh']){app.lang=lang;for(const shot of shots){const node=build(shot);assert.ok(all(node).length<1500,shot.id);assert.ok(!/NaN|undefined|\[object|\{[A-Za-z]/.test(content(node)),shot.id);assert.match(content(node),lang==='en'?/[A-Za-z]/:/[一-鿿]/);for(const svg of all(node).filter(n=>n.tag==='svg')){assert.equal(svg.getAttribute('role'),'img');assert.ok(svg.getAttribute('aria-labelledby'));assert.ok(all(svg).some(n=>n.tag==='title'&&content(n)));}}}
});

test('CAISO controls change only local teaching state, never underwriting or bindings',()=>{
 const before=JSON.stringify(row),boundBefore=JSON.stringify(values);
 for(const shot of shots){const node=build(shot);for(const button of all(node).filter(n=>n.tag==='button'))button.click();}
 assert.equal(JSON.stringify(row),before);assert.equal(JSON.stringify(values),boundBefore);
 assert.deepEqual(teaching.energyMWh,teaching.durationHours.map(h=>h*teaching.powerMW));
 assert.equal(teaching.afterFoldbackCreditedMW,null);assert.equal(teaching.projectFeasibility,null);
});

test('the evening Example has no measured eras, numeric axes, quantitative tooltip or observed curve',()=>{
 app.lang='en';const node=build(shots.find(s=>s.id==='caiso-05'));assert.match(content(node),/Example/);assert.match(content(node),/awaiting registration/);
 assert.ok(!/2020|2025|\d[,.\d]*\s*MW\b/.test(content(node)));
 for(const n of all(node))assert.ok(!/axis|tick|tooltip|observed-curve/.test(n.getAttribute?.('class')??''));
});

test('CAISO approximate BA geometry and six history records retain their source boundary',()=>{
 assert.equal(MAP.scope,'CAISO balancing area');assert.equal(MAP.precision,'approximate');assert.match(MAP.locator,/page 9/);assert.ok((MAP.balancingArea.match(/M/g)??[]).length>1,'excluded areas remain holes');
 assert.equal(HISTORY_TEXT.length,6);assert.match(HISTORY_TEXT[1].fields.Choice[0],/effective for the \{qcEffectiveYear\} RA year/);
 for(const pairs of Object.values(LABELS))for(const pair of pairs)for(const text of fillPair(pair,{...values,examplePower:teaching.powerMW,sodHours:24,ldesThreshold:8}))assert.ok(!/\{[A-Za-z]/.test(text));
});
