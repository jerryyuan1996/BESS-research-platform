/* Measurements and clean screenshots from a compiled preview only. */
import {chromium,expect} from '@playwright/test';
import {mkdir,readFile,readdir,writeFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {historySlugs,expectCompleteHistory} from '../e2e/helpers/research-history.js';
import {PUBLIC_VERSION} from '../src/experience/story/public/catalog.js';
const origin=process.env.PLATFORM_TEST_BASE_URL||'http://127.0.0.1:43161';
if(!/^http:\/\/127\.0\.0\.1:\d+$/.test(origin))throw new Error('Diagnostics require a local built preview');
const out=process.env.HISTORY_EVIDENCE_DIR||'../evidence/history';
await mkdir(out,{recursive:true});
const assets=[];
for(const name of await readdir('dist/assets')){
  const bytes=await readFile('dist/assets/'+name);
  assets.push({name,raw:bytes.length,gzip:gzipSync(bytes).length,sha256:createHash('sha256').update(bytes).digest('hex')});
}
const assetMap=new Map(assets.map(a=>[a.name,a]));
const browsers=await chromium.launch({channel:'chromium',headless:true});
const records=[];
const devices=[['desktop',1440,900,false],['ipad',820,1180,true],['ipad-landscape',1024,768,true],['phone',390,844,true]];
const resources=page=>page.evaluate(()=>performance.getEntriesByType('resource').map(r=>({name:new URL(r.name).pathname.split('/').at(-1),transferSize:r.transferSize,decodedBodySize:r.decodedBodySize,duration:r.duration})));
const sizes=rows=>{
  const own=[...new Set(rows.map(r=>r.name))].map(name=>assetMap.get(name)).filter(Boolean);
  return {requests:rows.length,transferSize:rows.reduce((n,r)=>n+r.transferSize,0),decodedBytes:rows.reduce((n,r)=>n+r.decodedBodySize,0),raw:own.reduce((n,a)=>n+a.raw,0),gzip:own.reduce((n,a)=>n+a.gzip,0),assets:own.map(a=>a.name),unmapped:rows.filter(r=>!assetMap.has(r.name)).map(r=>r.name)};
};
async function recordResult(){await writeFile(out+'/performance.json',JSON.stringify({version:PUBLIC_VERSION,measuredAt:new Date().toISOString(),origin,emulated:true,devices,assets,records},null,2));}
try{
  for(const [device,width,height,hasTouch]of devices)for(const [id,slug]of Object.entries(historySlugs)){
    const context=await browsers.newContext({viewport:{width,height},hasTouch,reducedMotion:'reduce'});
    await context.addInitScript(()=>{localStorage.setItem('hub_lang','en');localStorage.setItem('hub_lens','infraFund');});
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.route(/^https:\/\//,r=>r.abort());
    const activate=locator=>hasTouch?locator.tap():locator.click();
    let start=performance.now();await page.goto(origin+'/markets/'+slug);const trigger=page.locator('.public-story-trigger');await expect(trigger).toBeVisible();
    const overviewMs=performance.now()-start;
    const bounds=await trigger.boundingBox();expect(bounds.y+bounds.height).toBeLessThanOrEqual(height);
    await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready);
    const initial=await resources(page);expect(initial.some(r=>/^public-history-|^research-(?:history|data|owner|entry)-/.test(r.name))).toBe(false);
    const overviewFile=`${device}-${id}-overview.png`;await page.screenshot({path:out+'/'+overviewFile});
    await page.evaluate(()=>performance.clearResourceTimings());start=performance.now();await activate(trigger);
    await page.locator('.public-full-history [data-history-node]').last().waitFor();const firstOpenMs=performance.now()-start;
    await expectCompleteHistory(page,id,'en');await page.waitForLoadState('networkidle');
    const modal=await resources(page),owner=id.startsWith('jp_')?'jp':id;
    for(const request of modal){const match=/^research-(?:data|history|owner|entry)-(.+?)-[A-Za-z0-9_-]{8}\.js$/.exec(request.name);if(match)expect(match[1]).toBe(owner);}
    const historyFile=`${device}-${id}-history.png`;await page.screenshot({path:out+'/'+historyFile});
    const body=page.locator('.public-story-body'),scroll=await body.evaluate(el=>({height:el.clientHeight,scrollHeight:el.scrollHeight,width:el.clientWidth,scrollWidth:el.scrollWidth}));
    expect(scroll.scrollWidth).toBeLessThanOrEqual(scroll.width+1);
    await page.locator('.public-full-history [data-history-node]').last().scrollIntoViewIfNeeded();
    await expect(page.locator('.public-full-history [data-history-node]').last()).toBeInViewport();
    const tailFile=`${device}-${id}-tail.png`;await page.screenshot({path:out+'/'+tailFile});
    const provenance=page.locator('.public-history-provenance');await activate(provenance.locator('summary'));await expect(provenance).toHaveAttribute('open','');
    await expect(provenance.locator('a').last()).toBeVisible();
    await page.evaluate(()=>performance.clearResourceTimings());start=performance.now();
    await page.locator('.public-story-nav button[data-chapter=research]').click();await expect(page.locator('.public-chapter[data-chapter=research]')).toBeVisible();
    const chapterMs=performance.now()-start;
    await page.locator('.public-story-nav button[data-chapter=history]').click();await expectCompleteHistory(page,id,'en');
    await page.waitForLoadState('networkidle');const cached=await resources(page);expect(cached.length).toBe(0);
    await page.locator('.public-story-dialog').getByRole('button',{name:'Switch to Chinese'}).click();await expectCompleteHistory(page,id,'zh');
    const zhFile=`${device}-${id}-history-zh.png`;
    if(['gb','nem','wa','jp_tokyo','jp_kyushu','jp_hokkaido'].includes(id))await page.screenshot({path:out+'/'+zhFile});
    let scene=null;
    if(!['ca_on','sa','es'].includes(id)){
      await page.evaluate(()=>performance.clearResourceTimings());start=performance.now();
      await page.locator('.public-story-nav button[data-chapter=storage]').click();await expect(page.locator('.public-power-scene')).toBeVisible();
      const sceneMs=performance.now()-start;await page.waitForLoadState('networkidle');scene={ms:sceneMs,...sizes(await resources(page))};
      await activate(page.locator('[data-part=connection]'));await expect(page.locator('.public-equipment.is-selected')).toHaveAttribute('data-component','connection');
    }
    await page.keyboard.press('Escape');await expect(page.locator('.public-story-dialog')).toHaveCount(0);await expect(page.locator('.public-story-trigger')).toBeFocused();
    expect(errors).toEqual([]);
    records.push({id,device,viewport:{width,height},touch:hasTouch,locales:['en','zh'],overviewMs,firstOpenMs,chapterMs,
      initial:sizes(initial),modal:sizes(modal),scene,cacheDelta:cached.length,scroll,errors,screenshots:[overviewFile,historyFile,tailFile,...(['gb','nem','wa','jp_tokyo','jp_kyushu','jp_hokkaido'].includes(id)?[zhFile]:[])]});
    await recordResult();console.log(device,id,'nodes complete · cache',cached.length);await context.close();
  }
}finally{await recordResult();await browsers.close();}
