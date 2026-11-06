import {test,expect} from '@playwright/test';
import {PUBLIC_CATALOG,PUBLIC_VERSION} from '../src/experience/story/public/catalog.js';
import {loadPublicContent} from '../src/experience/story/public/content.js';
const slugs={wa:'western-australia',nem:'nem',gb:'great-britain',de:'germany',it:'italy',ie:'ireland',ro:'romania',pl:'poland',jp_tokyo:'japan-tokyo',jp_kyushu:'japan-kyushu',jp_hokkaido:'japan-hokkaido',pjm:'pjm',ercot:'ercot',caiso:'caiso',fi:'finland'};
const investors=['infraFund','strategic','foreignFirstTimer','developer'];
test.beforeEach(async({page})=>{await page.route(/^https:\/\//,r=>r.abort());});

function coverage(){for(const [id,slug] of Object.entries(slugs))test(id+' · shared content for every investor and language',async({page},info)=>{
  test.setTimeout(180000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  for(const locale of ['en','zh']){
    let expectedOverview,expectedMechanism;
    for(const investor of investors){
      await page.evaluate(({investor,locale})=>{localStorage.setItem('hub_lens',investor);localStorage.setItem('hub_lang',locale);},{investor,locale});
      await page.goto('/markets/'+slug);
      const overview=page.locator('#overview[data-public-market]'),trigger=page.locator('.public-story-trigger');
      await expect(trigger).toBeVisible();await expect(overview).toHaveAttribute('data-version',PUBLIC_VERSION);
      const profile=page.getByRole('combobox',{name:locale==='en'?'Investor profile':'投资者类型',exact:true});
      await expect(profile).toBeVisible();await expect(profile).toHaveValue(investor);
      const bound=await trigger.boundingBox();expect(bound.y+bound.height).toBeLessThanOrEqual(page.viewportSize().height);
      const c=PUBLIC_CATALOG[id];await expect(overview).toContainText(c.history[locale==='en'?0:1]);await expect(overview).toContainText(c.logic[locale==='en'?0:1]);await expect(overview).toContainText(c.condition[locale==='en'?0:1]);
      const order=await overview.evaluate(el=>['decision','bankable','revenue'].every(id=>{const target=document.getElementById(id);return !target||Boolean(el.compareDocumentPosition(target)&Node.DOCUMENT_POSITION_FOLLOWING);}));expect(order).toBe(true);
      const summary=await overview.innerText();if(expectedOverview)expect(summary).toBe(expectedOverview);else expectedOverview=summary;
      await trigger.click();const dialog=page.locator('.public-story-dialog');await expect(dialog).toBeVisible();await expect(dialog.locator('[data-chapter=history].public-chapter')).toBeVisible();
      await expect(dialog).toHaveAttribute('data-market',id);await expect(dialog).toHaveAttribute('lang',locale);
      await dialog.locator('.public-story-nav button[data-chapter=mechanism]').click();await expect(dialog.locator('.public-power-scene')).toBeVisible();
      const text=await dialog.locator('.public-chapter').innerText();if(expectedMechanism)expect(text).toBe(expectedMechanism);else expectedMechanism=text;
      await expect(dialog.locator('.public-power-scene')).toHaveAttribute('data-market',id);
      await dialog.locator('[data-part=connection]').click();await expect(dialog.locator('.public-equipment.is-selected')).toHaveAttribute('data-component','connection');
      await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(trigger).toBeFocused();
    }
  }
  expect(errors).toEqual([]);
});}
test.describe('desktop and phone matrix',coverage);
test.describe('iPad touch matrix',()=>{
  test.use({viewport:{width:820,height:1180},hasTouch:true});
  test.beforeEach(({},info)=>{test.skip(info.project.name==='mobile','iPad is exercised once by the desktop project');});
  coverage();
});

test('keyboard, history, language, deep links and repeated opening preserve the reading place',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/markets/nem');
  const trigger=page.locator('.public-story-trigger');await trigger.waitFor();await trigger.focus();
  const scroll=await page.evaluate(()=>scrollY);await page.keyboard.press('Enter');
  const dialog=page.locator('.public-story-dialog');await expect(dialog.getByRole('button',{name:'Close market background'})).toBeFocused();
  await dialog.locator('.public-story-nav button[data-chapter=system]').click();await expect(dialog.locator('.public-power-scene')).toBeVisible();
  await dialog.locator('.public-story-nav button[data-chapter=storage]').click();await expect(dialog.locator('.public-chapter')).toHaveAttribute('data-chapter','storage');
  await page.goBack();await expect(dialog.locator('.public-chapter')).toHaveAttribute('data-chapter','system');
  await page.goForward();await expect(dialog.locator('.public-chapter')).toHaveAttribute('data-chapter','storage');
  await dialog.getByRole('button',{name:'Switch to Chinese'}).click();await expect(dialog).toHaveAttribute('lang','zh');await expect(dialog.locator('.public-chapter')).toHaveAttribute('data-chapter','storage');
  const deep=page.url();expect(deep).toContain('public-zh-2026-11-06-1-storage');await page.reload();await expect(page.locator('.public-story-dialog')).toHaveAttribute('lang','zh');await expect(page.locator('.public-chapter')).toHaveAttribute('data-chapter','storage');
  await page.keyboard.press('Escape');await expect(page.locator('.public-story-dialog')).toHaveCount(0);expect(await page.evaluate(()=>scrollY)).toBeCloseTo(scroll,0);await expect(page.locator('.public-story-trigger')).toBeFocused();
  await page.goBack();await expect(page.locator('.public-story-dialog')).toBeVisible();
  await page.keyboard.press('Escape');await page.locator('.public-story-trigger').click();await expect(page.locator('.public-story-dialog')).toBeVisible();
});

test('content and scene failures expose readable fallback and working retry',async({page})=>{
  let failContent=true;await page.route(/\/assets\/public-content-nem-.*\.js/,r=>failContent?r.abort():r.continue());
  await page.goto('/markets/nem');await page.locator('.public-story-trigger').click();
  const dialog=page.locator('.public-story-dialog');await expect(dialog.getByRole('button',{name:'Retry chapter'})).toBeVisible();await expect(dialog).toContainText(PUBLIC_CATALOG.nem.history[0]);
  failContent=false;await dialog.getByRole('button',{name:'Retry chapter'}).click();await expect(page.locator('.public-chapter')).toHaveAttribute('data-chapter','history');
  let failScene=true;await page.route(/\/assets\/public-scene-.*\.js/,r=>failScene?r.abort():r.continue());
  await page.locator('.public-story-nav button[data-chapter=system]').click();await expect(page.getByRole('button',{name:'Retry scene'})).toBeVisible();
  failScene=false;await page.getByRole('button',{name:'Retry scene'}).click();await expect(page.locator('.public-power-scene')).toBeVisible();
});

test('a failed modal module retries from the intact public summary',async({page})=>{
  let fail=true;await page.route(/\/assets\/public-pack-.*\.js/,r=>fail?r.abort():r.continue());
  await page.goto('/markets/nem');await page.locator('.public-story-trigger').click();
  await expect(page.locator('.public-story-trigger')).toHaveAttribute('data-load-failed','true');await expect(page.locator('#overview')).toContainText(PUBLIC_CATALOG.nem.logic[0]);
  fail=false;await page.locator('.public-story-trigger').click();await expect(page.locator('.public-chapter')).toHaveAttribute('data-chapter','history');
});

test('Japan region switching keeps the edition and chapter while changing local evidence',async({page})=>{
  await page.goto('/markets/japan-tokyo');await page.locator('.public-story-trigger').click();
  await page.locator('.public-story-nav button[data-chapter=system]').click();
  for(const id of ['jp_kyushu','jp_hokkaido','jp_tokyo']){
    await page.locator('.public-story-tools select').selectOption(id);
    const dialog=page.locator('.public-story-dialog');await expect(dialog).toHaveAttribute('data-market',id);await expect(dialog.locator('.public-chapter')).toHaveAttribute('data-chapter','system');await expect(dialog.locator('.public-power-scene')).toHaveAttribute('data-market',id);
    await expect(dialog).toContainText(PUBLIC_CATALOG[id].logic[0]);
    await dialog.locator('.public-story-nav button[data-chapter=research]').click();
    const data=await loadPublicContent(id);
    for(const group of data.sourceGroups){
      const rendered=dialog.locator(`.public-source-group[data-source-scope=${group.id}]`);
      await expect(rendered.locator('h4')).toHaveText(group.title[0]);
      expect((await rendered.locator('[data-source-id]').evaluateAll(nodes=>nodes.map(n=>n.dataset.sourceId))).sort()).toEqual([...group.ids].sort());
    }
    expect((await dialog.locator('.public-chapter-sources [data-source-id]').evaluateAll(nodes=>nodes.map(n=>n.dataset.sourceId))).sort()).toEqual(Object.keys(data.sources).sort());
    await dialog.locator('.public-story-nav button[data-chapter=system]').click();
  }
});

test('the first screen fetches no complete narrative or SVG; subsequent chapters reuse the successful modules',async({page})=>{
  const fetched=[];page.on('request',r=>fetched.push(r.url()));
  await page.goto('/markets/nem');await page.locator('.public-story-trigger').waitFor();expect(fetched.some(s=>/public-(?:content-|scene-|chapter-|pack-)|story-geometry-/.test(s))).toBe(false);
  await page.locator('.public-story-trigger').click();await page.locator('.public-chapter').waitFor();expect(fetched.some(s=>/public-content-nem-/.test(s))).toBe(true);expect(fetched.some(s=>/public-scene-|story-geometry-/.test(s))).toBe(false);
  await page.locator('.public-story-nav button[data-chapter=mechanism]').click();await page.locator('.public-power-scene').waitFor();
  await page.waitForLoadState('networkidle');const count=fetched.length;await page.locator('.public-story-nav button[data-chapter=storage]').click();await page.locator('.public-power-scene').waitFor();await page.waitForLoadState('networkidle');expect(fetched.length).toBe(count);
});

test.describe('touch panning',()=>{
  test.use({hasTouch:true});
  test('phone and iPad scene scrolling leaves annotations reachable by touch',async({page},info)=>{
    await page.setViewportSize(info.project.name==='mobile'?{width:390,height:844}:{width:820,height:1180});
    await page.goto('/markets/nem');await page.locator('.public-story-trigger').tap();
    await page.locator('.public-story-nav button[data-chapter=storage]').tap();
    const view=page.locator('.public-scene-viewport');await view.waitFor();await view.scrollIntoViewIfNeeded();
    const box=await view.boundingBox();
    if(info.project.name==='mobile'){
      expect(await view.evaluate(el=>el.scrollWidth>el.clientWidth)).toBe(true);
      const cdp=await page.context().newCDPSession(page),start=box.x+box.width-28,end=box.x+28,y=box.y+box.height/2;
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:start,y,id:0}]});
      for(let i=1;i<=8;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start+(end-start)*i/8,y,id:0}]});await page.evaluate(()=>new Promise(requestAnimationFrame));}
      await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      await expect.poll(()=>view.evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);
      await cdp.detach();
    }
    await page.locator('[data-part=transformer]').tap();await expect(page.locator('.public-equipment.is-selected')).toHaveAttribute('data-component','transformer');await expect(page.locator('[data-part=transformer]')).toBeFocused();
    await page.locator('[data-flow=charge]').tap();await expect(page.locator('[data-flow=charge]')).toHaveAttribute('aria-pressed','true');
    await page.screenshot({path:info.outputPath('touch-annotation.png')});
  });
});
