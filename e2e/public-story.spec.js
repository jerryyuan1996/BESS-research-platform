import {test,expect} from '@playwright/test';
import {PUBLIC_CATALOG,PUBLIC_VERSION} from '../src/experience/story/public/catalog.js';
import {loadPublicContent} from '../src/experience/story/public/content.js';
import {expectCompleteHistory} from './helpers/research-history.js';
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
      {
        await expect(overview.locator('.market-overview-map')).toHaveAttribute('aria-busy','false');
        await expect(overview.locator('.geo-map-pane svg')).toBeVisible();
      }
      const profile=page.getByRole('combobox',{name:locale==='en'?'Investor profile':'投资者类型',exact:true});
      await expect(profile).toBeVisible();await expect(profile).toHaveValue(investor);
      const context=page.locator('.market-overview-context');
      await expect(context).toHaveAttribute('aria-busy','false');
      await expect(context.locator('.market-context-card')).toBeVisible();
      const narrative=overview.locator('.public-core-storyline');
      await expect(narrative).toHaveAttribute('aria-busy','false');
      const bound=await trigger.boundingBox(),card=await context.boundingBox();
      expect(bound.y).toBeGreaterThanOrEqual(card.y+card.height);
      expect(bound.y-card.y-card.height).toBeLessThanOrEqual(21);
      await expect(narrative).toHaveAttribute('data-storyline-market',id);
      await expect(narrative.locator('h3')).not.toBeEmpty();
      await expect(overview.locator('.public-history,.public-logic,.public-condition')).toHaveCount(0);
      await expect(overview.locator('[data-date-kind=g1]')).toHaveCount(0);
      await expect(overview.locator('[data-date-kind=source-check]')).toHaveCount(0);
      const order=await overview.evaluate(el=>['decision','bankable','revenue'].every(id=>{const target=document.getElementById(id);return !target||Boolean(el.compareDocumentPosition(target)&Node.DOCUMENT_POSITION_FOLLOWING);}));expect(order).toBe(true);
      const summary=await overview.locator('.market-overview-story').innerText();if(expectedOverview)expect(summary).toBe(expectedOverview);else expectedOverview=summary;
      await trigger.click();const dialog=page.locator('.public-story-dialog');await expect(dialog).toBeVisible();await expect(dialog.locator('[data-chapter=history].public-chapter')).toBeVisible();
      await expect(dialog).toHaveAttribute('data-market',id);await expect(dialog).toHaveAttribute('lang',locale);
      await expectCompleteHistory(page,id,locale);
      await expect(dialog.locator('.public-source-check-note')).toHaveCount((await loadPublicContent(id)).latestCheckedOn?1:0);
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
  await expect(page.locator('.market-overview-context')).toHaveAttribute('aria-busy','false');
  await expect(page.locator('.market-overview-map')).toHaveAttribute('aria-busy','false');
  const trigger=page.locator('.public-story-trigger');await trigger.waitFor();await trigger.focus();
  await trigger.evaluate(node=>window.scrollTo({top:window.scrollY+node.getBoundingClientRect().top-120,behavior:'instant'}));
  const scroll=await page.evaluate(()=>scrollY);expect(scroll).toBeGreaterThan(100);await page.keyboard.press('Enter');
  const dialog=page.locator('.public-story-dialog');await expect(dialog.getByRole('button',{name:'Close market background'})).toBeFocused();
  await dialog.locator('.public-story-nav button[data-chapter=system]').click();await expect(dialog.locator('.public-power-scene')).toBeVisible();
  await dialog.locator('.public-story-nav button[data-chapter=storage]').click();await expect(dialog.locator('.public-chapter')).toHaveAttribute('data-chapter','storage');
  await page.goBack();await expect(dialog.locator('.public-chapter')).toHaveAttribute('data-chapter','system');
  await page.goForward();await expect(dialog.locator('.public-chapter')).toHaveAttribute('data-chapter','storage');
  await dialog.getByRole('button',{name:'Switch to Chinese'}).click();await expect(dialog).toHaveAttribute('lang','zh');await expect(dialog.locator('.public-chapter')).toHaveAttribute('data-chapter','storage');
  const deep=page.url();expect(deep).toContain('public-zh-'+PUBLIC_VERSION.replace('.','-')+'-storage');await page.reload();await expect(page.locator('.public-story-dialog')).toHaveAttribute('lang','zh');await expect(page.locator('.public-chapter')).toHaveAttribute('data-chapter','storage');
  await page.keyboard.press('Escape');await expect(page.locator('.public-story-dialog')).toHaveCount(0);
  // Translation changes the narrative height; restore the visible entrance
  // rather than an obsolete pixel offset or the top of the market page.
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(100);
  await expect(page.locator('.public-story-trigger')).toBeInViewport();
  await expect(page.locator('.public-story-trigger')).toBeFocused();
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
  await page.goto('/markets/nem');
  const narrative=page.locator('.public-core-storyline');await expect(narrative).toHaveAttribute('aria-busy','false');
  const summary=await narrative.textContent();await page.locator('.public-story-trigger').click();
  await expect(page.locator('.public-story-trigger')).toHaveAttribute('data-load-failed','true');await expect(narrative).toHaveText(summary);
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
  await page.goto('/markets/nem');await page.locator('.public-story-trigger').waitFor();expect(fetched.some(s=>/public-(?:content-|scene-|sequence-|chapter-|pack-)|story-geometry-/.test(s))).toBe(false);
  await page.locator('.public-story-trigger').click();await page.locator('.public-chapter').waitFor();expect(fetched.some(s=>/public-content-nem-/.test(s))).toBe(true);expect(fetched.some(s=>/public-scene-|public-sequence-|story-geometry-/.test(s))).toBe(false);
  await page.locator('.public-story-nav button[data-chapter=mechanism]').click();await page.locator('.public-power-scene').waitFor();
  await page.waitForLoadState('networkidle');const count=fetched.length;await page.locator('.public-story-nav button[data-chapter=storage]').click();await page.locator('.public-power-scene').waitFor();await page.waitForLoadState('networkidle');expect(fetched.length).toBe(count);
});

test('source dates remain visible while internal approval events stay out of reader-facing content',async({page})=>{
  await page.goto('/markets/ercot?view=story&chapter=history&shot=public-en-2026-11-06-1-history');
  let dialog=page.locator('.public-story-dialog');await expect(dialog).toHaveAttribute('data-version',PUBLIC_VERSION);
  await expect(dialog.locator('.public-source-check-note')).toContainText('2026-11-02');
  await expect(dialog.locator('.public-source-check-note')).toContainText('Sources last checked');
  await expect(dialog).toContainText('Showing the current edition');
  await dialog.locator('.public-story-nav button[data-chapter=research]').click();
  await expect(dialog.locator('[data-date-kind=g1]')).toHaveCount(0);
  await expect(dialog.locator('[data-date-kind=source-check]')).toContainText('2026-11-02');
  await expect(dialog.locator('[data-date-kind=g2]')).toHaveCount(0);
  await page.goto('/markets/finland');await page.locator('.public-story-trigger').click();dialog=page.locator('.public-story-dialog');
  await dialog.locator('.public-story-nav button[data-chapter=research]').click();
  await expect(dialog.locator('[data-date-kind=g1]')).toHaveCount(0);
  await expect(dialog.locator('[data-date-kind=supplement]')).toHaveCount(0);
});

test.describe('touch panning',()=>{
  test.use({hasTouch:true});
  test('the phone and iPad scene fits its column and leaves annotations reachable by touch',async({page},info)=>{
    await page.setViewportSize(info.project.name==='mobile'?{width:390,height:844}:{width:820,height:1180});
    await page.goto('/markets/nem');await page.locator('.public-story-trigger').tap();
    await page.locator('.public-story-nav button[data-chapter=storage]').tap();
    const view=page.locator('.public-scene-viewport');await view.waitFor();await view.scrollIntoViewIfNeeded();
    /* The drawing has a compact frame for a phone: it is read whole, never panned sideways. */
    expect(await view.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
    await expect(page.locator('.public-power-scene')).toHaveAttribute('data-frame',info.project.name==='mobile'?'compact':'wide');
    await page.locator('[data-part=transformer]').tap();await expect(page.locator('.public-equipment.is-selected')).toHaveAttribute('data-component','transformer');await expect(page.locator('[data-part=transformer]')).toBeFocused();
    await page.locator('[data-flow=charge]').tap();await expect(page.locator('[data-flow=charge]')).toHaveAttribute('aria-pressed','true');
    await page.screenshot({path:info.outputPath('touch-annotation.png')});
  });
});

test('all eighteen markets expose clean bilingual reader copy and same-market research links',async({page})=>{
  test.setTimeout(240000);
  const allSlugs={...slugs,ca_on:'ontario',sa:'saudi-arabia',es:'spain'};
  const internal=/G-[12]|sign.off|签核|公共(?:逻辑|解读|迁移|重组)待确认|(?:public|relocation|interpretation) review pending|current review draft|no new Jerry/i;
  for(const locale of ['en','zh']){
    await page.goto('/');
    await page.evaluate(locale=>localStorage.setItem('hub_lang',locale),locale);
    for(const [id,slug] of Object.entries(allSlugs)){
      await page.goto('/markets/'+slug);
      const overview=page.locator('#overview');
      await expect(page.locator('.public-story-trigger')).toBeVisible();
      expect(await overview.innerText(),id+'/'+locale+' overview').not.toMatch(internal);
      await page.locator('.public-story-trigger').click();
      const dialog=page.locator('.public-story-dialog');
      await expect(dialog.locator('.public-chapter')).toHaveAttribute('data-chapter','history');
      for(const chapter of ['history','research']){
        await dialog.locator('.public-story-nav button[data-chapter='+chapter+']').click();
        await expect(dialog.locator('.public-chapter')).toHaveAttribute('data-chapter',chapter);
        expect(await dialog.innerText(),id+'/'+locale+'/'+chapter).not.toMatch(internal);
        await expect(dialog.locator('a[href*="github.com/jerryyuan1996/BESS-research-platform"]')).toHaveCount(0);
        await expect(dialog.locator('a[href="/markets/'+slug+'/home"]').first()).toBeAttached();
      }
      await page.keyboard.press('Escape');
      await expect(page.locator('.public-story-trigger')).toBeFocused();
    }
  }
});
