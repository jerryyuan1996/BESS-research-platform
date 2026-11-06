/* Built-public evidence only. No dev server, model execution or private inputs. */
import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
import {mkdir,writeFile,readFile,readdir} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import {PUBLIC_MARKET_IDS} from '../src/experience/story/public/catalog.js';
const baseline=process.argv.includes('--baseline');
const out=process.env.PUBLIC_EVIDENCE_DIR||`../evidence/${baseline?'baseline':'public'}`;
const port=baseline?43158:43159, origin=`http://127.0.0.1:${port}`;
const build=baseline?'../baseline-dist':'dist';
const slugs={wa:'western-australia',nem:'nem',gb:'great-britain',de:'germany',it:'italy',ie:'ireland',ro:'romania',pl:'poland',jp_tokyo:'japan-tokyo',jp_kyushu:'japan-kyushu',jp_hokkaido:'japan-hokkaido',pjm:'pjm',ercot:'ercot',caiso:'caiso',fi:'finland'};
await mkdir(out,{recursive:true});
const preview=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--outDir',build,'--host','127.0.0.1','--port',String(port),'--strictPort'],{windowsHide:true,stdio:['ignore','pipe','pipe']});
await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Preview start timed out')),30000);preview.stdout.on('data',d=>{if(String(d).includes('Local:')){clearTimeout(timer);resolve();}});preview.on('exit',code=>reject(new Error('Preview exited: '+code)));preview.stderr.on('data',d=>process.stderr.write(d));});
const browser=await chromium.launch({channel:'chromium',headless:true});
const records=[];
const screens=baseline?[['desktop',1440,900]]:[['desktop',1440,900],['ipad',820,1180],['phone',390,844]];
try{
  for(const [device,width,height] of screens)for(const id of (baseline?['nem','jp_tokyo','wa']:PUBLIC_MARKET_IDS)){
    const context=await browser.newContext({viewport:{width,height},hasTouch:device!=='desktop',reducedMotion:'reduce'});
    await context.addInitScript(()=>{localStorage.setItem('hub_lang','en');localStorage.setItem('hub_lens','infraFund');});
    const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const activate=locator=>device==='desktop'?locator.click():locator.tap();
    await page.route(/^https:\/\//,r=>r.abort());
    const start=performance.now();await page.goto(origin+'/markets/'+slugs[id],{waitUntil:'domcontentloaded'});
    const trigger=page.locator(baseline?'.ix-full-research':'.public-story-trigger');await trigger.waitFor();
    const firstMs=performance.now()-start;
    const bounds=await trigger.boundingBox();
    const overview=await page.locator('#overview').boundingBox();
    const initial=await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>({name:new URL(r.name).pathname,bytes:r.decodedBodySize,transfer:r.transferSize})));
    if(!baseline){
      if(!bounds||bounds.y+bounds.height>height||!overview||overview.y>=height)throw new Error(`${id}/${device}: overview action below first screen`);
      await page.screenshot({path:`${out}/${id}-${device}-overview.png`});
    }
    const firstOpen=performance.now();await activate(trigger);const dialog=page.locator(baseline?'.ix-story-dialog':'.public-story-dialog');await dialog.waitFor();
    if(!baseline)await dialog.locator('.public-chapter[data-chapter=history]').waitFor();
    const openMs=performance.now()-firstOpen;
    const opened=await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>({name:new URL(r.name).pathname,bytes:r.decodedBodySize})));
    let chapterMs=null,cachedMs=null,cacheDelta=[],backgroundCompletions=[];
    if(!baseline){
      const time=performance.now();await activate(dialog.locator('.public-story-nav button[data-chapter=mechanism]'));await dialog.locator('.public-power-scene').waitFor();chapterMs=performance.now()-time;
      await dialog.locator('.public-scene-viewport').scrollIntoViewIfNeeded();
      await page.screenshot({path:`${out}/${id}-${device}-mechanism.png`});
      await activate(dialog.locator('[data-part=transformer]'));
      if(!await dialog.locator('.public-equipment.is-selected[data-component=transformer]').count())throw new Error('Touch layer selection failed');
      await activate(dialog.locator('[data-flow=charge]'));
      await activate(dialog.locator('[data-part=transformer]'));
      await activate(dialog.locator('.public-scene-modes button').nth(1));
      if(['nem','jp_tokyo','jp_kyushu','jp_hokkaido'].includes(id)){await dialog.locator('.public-scene-viewport').scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/${id}-${device}-cutaway.png`});}
      // Performance entries arrive when a response finishes. Settle unrelated
      // first-page work before asserting zero requests for a cached transition.
      const unsettled=await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>r.name));
      await page.waitForLoadState('networkidle');
      const before=await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>r.name));
      backgroundCompletions=before.filter(n=>!unsettled.includes(n)).map(n=>new URL(n).pathname);
      const t=performance.now();
      await activate(dialog.locator('.public-story-nav button[data-chapter=storage]'));await dialog.locator('.public-power-scene').waitFor();cachedMs=performance.now()-t;
      await page.waitForLoadState('networkidle');
      const after=await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>r.name));
      const counts=new Map();for(const n of before)counts.set(n,(counts.get(n)||0)+1);
      cacheDelta=after.filter(n=>{const left=counts.get(n)||0;if(left){counts.set(n,left-1);return false;}return true;}).map(n=>new URL(n).pathname);
      if(after.length!==before.length)throw new Error('Cached chapter requested additional resources: '+cacheDelta.join(', '));
      await page.keyboard.press('Escape');await dialog.waitFor({state:'detached'});
      const focused=await trigger.evaluate(el=>el===document.activeElement);if(!focused)throw new Error('Trigger focus not restored');
    }
    const all=await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>({name:new URL(r.name).pathname,bytes:r.decodedBodySize})));
    records.push({id,device,input:device==='desktop'?'mouse':'touch',viewport:{width,height},firstMs,openMs,chapterMs,cachedMs,cacheDelta,backgroundCompletions,firstBytes:initial.reduce((a,r)=>a+r.bytes,0),openBytes:opened.filter(r=>!initial.some(x=>x.name===r.name)).reduce((a,r)=>a+r.bytes,0),sceneBytes:all.filter(r=>!opened.some(x=>x.name===r.name)).reduce((a,r)=>a+r.bytes,0),button:bounds,overview,errors,initialResources:initial.map(r=>r.name)});
    if(errors.length)throw new Error(errors.join('; '));
    console.log(`${id}/${device}: first ${Math.round(firstMs)}ms; open ${Math.round(openMs)}ms; scene ${Math.round(chapterMs||0)}ms`);
    await writeFile(`${out}/performance.json`,JSON.stringify({recordedAt:new Date().toISOString(),baseline,records},null,2));
    await context.close();
  }
  const chunks=[];for(const file of await readdir(build+'/assets'))if(file.endsWith('.js')||file.endsWith('.css')){const b=await readFile(build+'/assets/'+file);chunks.push({file,raw:b.length,gzip:gzipSync(b).length});}
  await writeFile(`${out}/chunks.json`,JSON.stringify(chunks,null,2));
}finally{await browser.close();preview.kill();}
