/* Japan's section extraction must preserve original research routes and the
   shared engine's async boundary, not just the chapter excerpts. Both viewport
   projects run each regional route. No production content is changed here. */
import { test, expect } from '@playwright/test';

const REGIONS = [['tokyo','Tokyo','东京'],['kyushu','Kyushu','九州'],['hokkaido','Hokkaido','北海道']];
const tab = (page, label) => page.getByRole('link', { name: label, exact: true }).and(page.locator('a.tab-btn'));
const section = (page, id) => page.locator(`[data-section="${id}"]`);
const requests = page => {
  const asked=[];
  page.on('request',request=>{
    const hit=/\/assets\/section-jp-([a-z]+)-[^/]+\.js$/.exec(request.url());
    if(hit && hit[1]!=='shared') asked.push(hit[1]);
  });
  return asked;
};
test.beforeEach(async ({page})=>{
  await page.route(/^https:\/\//,route=>route.abort());
});

for(const [region,en,zh] of REGIONS){
  const base='/markets/japan-'+region;
  test(`${region} original research preserves deep links, tab reuse and bilingual regional content`,async({page})=>{
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    let asked=requests(page);
    await page.goto(base+'/case');
    await expect(section(page,'case').locator('.sect')).toBeVisible();
    await expect(section(page,'case')).toContainText(en);
    expect(asked).toEqual(['case']);
    await expect(section(page,'home')).toHaveCount(0);
    await expect(section(page,'grid')).toHaveCount(0);

    /* A cold legacy /grid URL becomes the grouped entry/grid route. */
    asked.length=0;
    await page.goto(base+'/grid');
    await expect(page).toHaveURL(new RegExp(base+'/entry/grid$'));
    await expect(section(page,'grid').locator('.geo-grid-map svg')).toBeVisible();
    await expect(section(page,'grid')).toContainText(en);
    expect([...new Set(asked)].sort()).toEqual(['entry','grid']);

    /* Brief deliberately returns to the investment page, not the original
       research /case deep link checked above. Revisit two research tabs. */
    await expect(tab(page,'Brief')).toHaveAttribute('href',base);
    await tab(page,'Market Story').click();
    await expect(section(page,'home')).toBeVisible();
    await tab(page,'Entry & Delivery').click();
    await expect(section(page,'grid').locator('.sect')).toBeVisible();
    await tab(page,'Market Story').click();
    await expect(section(page,'home')).toBeVisible();
    await expect(section(page,'story')).toHaveCount(1);
    await expect(section(page,'grid')).toHaveCount(0);
    const loaded=asked.slice();
    await page.getByRole('button',{name:'Switch to Chinese'}).click();
    await expect(section(page,'home')).toContainText(zh);
    await expect(section(page,'story')).toContainText(/[一-鿿]{4,}/);
    await page.getByRole('button',{name:'切换到英文'}).click();
    await expect(section(page,'home')).toContainText(en);
    await expect(section(page,'story')).toHaveCount(1);
    expect(asked).toEqual(loaded);
    const counts=asked.reduce((all,id)=>({...all,[id]:(all[id]||0)+1}),{});
    for(const [id,count] of Object.entries(counts))expect(count,id+' is fetched once in this page').toBe(1);
    expect(errors).toEqual([]);
  });

  test(`${region} a late story chunk cannot replace the entry page`,async({page})=>{
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    let release,arrived;
    const held=new Promise(resolve=>{release=resolve;});
    const blocked=new Promise(resolve=>{arrived=resolve;});
    await page.route(/\/assets\/section-jp-story-/,async route=>{
      arrived();await held;await route.continue();
    });
    await page.goto(base+'/case');
    await expect(section(page,'case').locator('.sect')).toBeVisible();
    await tab(page,'Market Story').click();
    await blocked;
    try {
      await tab(page,'Entry & Delivery').click();
      await expect(section(page,'grid').locator('.sect')).toBeVisible();
      const response=page.waitForResponse(/\/assets\/section-jp-story-/);
      release();await (await response).finished();
      /* Let module evaluation and its pending render continuation settle. */
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      await expect(page).toHaveURL(new RegExp(base+'/entry$'));
      await expect(section(page,'home')).toHaveCount(0);
      await expect(section(page,'story')).toHaveCount(0);
      await expect(section(page,'entry')).toHaveCount(1);
      await expect(section(page,'grid')).toHaveCount(1);
      await expect(section(page,'grid')).toContainText(en);
      expect(errors).toEqual([]);
    } finally { release(); }
  });

  test(`${region} a failed section offers reload and recovers after the network returns`,async({page})=>{
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    let fail=true;
    await page.route(/\/assets\/section-jp-case-/,route=>fail?route.abort():route.continue());
    await page.goto(base+'/case');
    const reload=page.getByRole('button',{name:'Reload the page',exact:true});
    await expect(reload).toBeVisible();
    await expect(page.locator('.warnbox').filter({hasText:'This section could not be loaded'})).toBeVisible();
    await expect(section(page,'case')).toHaveCount(0);
    fail=false;await reload.click();
    await expect(section(page,'case').locator('.sect')).toBeVisible();
    await expect(section(page,'case')).toContainText(en);
    await expect(reload).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}

test('a late Kyushu excerpt cannot rebind the newer Tokyo page',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  let dashboardUrl,release,arrived;
  page.on('request',request=>{
    if(/\/assets\/market-jp-[^/]+\.js$/.test(request.url()))dashboardUrl=request.url();
  });
  const held=new Promise(resolve=>{release=resolve;});
  const blocked=new Promise(resolve=>{arrived=resolve;});
  await page.route(/\/assets\/section-jp-duration-/,async route=>{
    arrived();await held;await route.continue();
  });
  const research=chapter=>page.locator(`main .ix-research-context[data-research-chapter="${chapter}"]`);
  await page.goto('/markets/japan-kyushu');
  const old=research('revenue');
  await old.locator(':scope > summary').click();
  await blocked;
  const oldBody=await old.locator('.ix-research-context-body').elementHandle();
  try {
    /* Use the actual SPA control: a full navigation would discard the stale
       module and conceal this shared-engine race. */
    await page.getByRole('combobox',{name:'Switch market',exact:true}).selectOption('japan-tokyo');
    await expect(page).toHaveURL(/\/markets\/japan-tokyo$/);
    const current=research('bankable');
    await current.locator(':scope > summary').click();
    const body=current.locator('.ix-research-context-body');
    await expect(body).toHaveAttribute('aria-busy','false');
    await expect(body.locator('.ix-research-card[open] .ix-research-card-body')).not.toBeEmpty();
    const text=await body.innerText();
    expect(dashboardUrl).toBeTruthy();
    const currentRegion=()=>page.evaluate(async url=>(await import(url)).state.region,dashboardUrl);
    expect(await currentRegion()).toBe('tokyo');

    const response=page.waitForResponse(/\/assets\/section-jp-duration-/);
    release();await (await response).finished();
    /* Wait for the removed body's actual continuation, not an arbitrary delay. */
    await expect.poll(()=>oldBody.evaluate(node=>node.getAttribute('aria-busy'))).toBe('false');
    expect(await oldBody.evaluate(node=>node.isConnected)).toBe(false);
    expect(await currentRegion()).toBe('tokyo');
    expect(await body.innerText()).toBe(text);
    await expect(page.getByRole('combobox',{name:'Switch market',exact:true})).toHaveValue('japan-tokyo');
    expect(errors).toEqual([]);
  } finally { release();await oldBody.dispose(); }
});
