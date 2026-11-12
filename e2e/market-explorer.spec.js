import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { markets } from '../src/markets/registry.js';
import { REVENUE_SECTIONS } from '../src/markets/tabGroups.js';
import { readResearch } from '../scripts/research/coverage.mjs';
import { gridMapForMarket } from '../src/markets/gridMapRegistry.js';

const original = { en: await readResearch({lang:'en'}), zh: await readResearch({lang:'zh'}) };
for (const owner of new Set(markets.map(m=>m.manifest.dashboardId||m.manifest.id)))
  await import(`../src/markets/${owner}/gridMapData.js`);
test.beforeEach(async({page}) => { await page.route(/^https:\/\//, r => r.abort()); });

for (const market of markets) test(`${market.manifest.id}: own grid and complete readers, without duplicate Home tabs`, async({page}, info) => {
  test.setTimeout(180000);
  const {id, slug, dashboardId, region} = market.manifest, owner = dashboardId || id;
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  for (const lang of ['en','zh']) {
    await page.goto('/');
    await page.evaluate(lang => localStorage.setItem('hub_lang',lang),lang);
    await page.goto('/markets/'+slug);
    const overview = page.locator('.market-overview');
    await expect(overview.locator('.market-overview-map')).toHaveAttribute('aria-busy','false');
    const svg = overview.locator('.geo-map-pane svg');
    await expect(svg).toBeVisible();
    const mapId=`${owner==='jp'?'jp-'+region:owner}-grid-map-overview`;
    await expect(svg).toHaveAttribute('aria-labelledby',`${mapId}-title ${mapId}-description`);
    await expect(overview.locator('.public-overview-art')).toHaveCount(0);
    const context = overview.locator('.market-overview-context');
    await expect(context).toHaveAttribute('aria-busy','false');
    await expect(context.locator('.market-context-card')).toBeVisible();
    await expect(overview.locator('.public-chapter-steps,.public-source-date')).toHaveCount(0);
    const text = pair => Array.isArray(pair) ? pair[lang==='zh'?1:0] : pair;
    if (id==='it') {
      const spec=original[lang].find(r=>r.market==='it'&&r.section==='story').units.find(u=>u.key.startsWith('Six bidding zones'));
      const rows=spec.blocks[0].blocks[0].rows;
      await expect(context.locator('tbody tr')).toHaveCount(rows.length);
      for (const [i,row] of rows.entries()) {
        await expect(context.locator('tbody tr').nth(i)).toContainText(text(row[0].b));
        await expect(context.locator('tbody tr').nth(i)).toContainText(text(row[1]));
      }
    } else {
      const map=gridMapForMarket(owner,region), current=map.periods.current;
      await expect(context).toHaveAttribute('data-context-map',map.id);
      for (const field of ['kicker','thesis','implication']) await expect(context).toContainText(text(current[field]));
    }
    const contextBox=await context.boundingBox(), copyBox=await overview.locator('.public-overview-copy').boundingBox();
    const triggerBox=await overview.locator('.public-story-trigger').boundingBox();
    expect(contextBox.y-copyBox.y-copyBox.height).toBeLessThanOrEqual(25);
    expect(triggerBox.y-contextBox.y-contextBox.height).toBeGreaterThanOrEqual(0);
    expect(triggerBox.y-contextBox.y-contextBox.height).toBeLessThanOrEqual(21);
    await expect(page.locator('#revenue-drivers .ix-research-context')).toHaveCount(0);
    for (const kind of ['grid','revenue']) {
      const trigger = page.locator(`[data-market-research="${kind}"]`);
      await trigger.click();
      const dialog = page.locator('.market-research-dialog');
      await expect(dialog).toHaveAttribute('data-market',id);
      await expect(dialog.locator('[role="tabpanel"]')).toHaveAttribute('aria-busy','false');
      const sections = market.tabs.map(([s])=>s).filter(s=>kind==='grid'?['grid','entry'].includes(s):REVENUE_SECTIONS.includes(s));
      const wanted = original[lang].filter(r=>r.market===owner && r.lens===(region||null) && sections.includes(r.section)).flatMap(r=>r.units.map(u=>u.key));
      const found=[];
      for (const tab of await dialog.getByRole('tab').all()) {
        await tab.click();
        for (const card of await dialog.locator('.ix-research-card').all()) {
          found.push(await card.getAttribute('data-research-card'));
          if (!(await card.evaluate(el=>el.open))) await card.locator(':scope > summary').click();
          await expect(card.locator('.ix-research-card-body')).not.toBeEmpty();
        }
        await expect(dialog.locator('.geo-grid-map')).toHaveCount(0);
        expect(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
      }
      expect(found.sort()).toEqual(wanted.sort());
      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    if (lang==='zh' && ['gb','nem','jp_kyushu','wa'].includes(id)) {
      await mkdir('.tmp/market-demo',{recursive:true});
      await overview.screenshot({path:`.tmp/market-demo/${id}-${info.project.name}.png`});
    }
    await page.goto('/markets/'+slug+'/home');
    const tabs = page.locator('.ix-research-inner .tabs .tab-btn');
    await expect(tabs.first()).toBeVisible();
    await expect(tabs.filter({hasText:/^(Revenue & Design|Entry & Delivery|收入与设计|进入与交付)$/})).toHaveCount(0);
    await expect(page.locator('.tab-section[data-section="grid"],.tab-section[data-section="entry"],.tab-section[data-section="capacity"]')).toHaveCount(0);
  }
  // Existing bookmarks open their exact section inside the new reader.
  await page.goto('/markets/'+slug+'/revenue/duration');
  const reader=page.locator('.market-research-dialog');
  await expect(reader.locator('[aria-selected="true"]')).toHaveAttribute('data-chapter','duration');
  await page.keyboard.press('Escape');
  await expect(reader).toHaveCount(0);
  await expect(page).toHaveURL(new RegExp('/markets/'+slug+'#revenue-drivers$'));
  expect(errors).toEqual([]);
});

test('legacy grid address and Back retain the destination and release the modal',async({page})=>{
  await page.goto('/returns');
  await page.goto('/markets/great-britain/entry/grid');
  await expect(page.locator('.market-research-dialog')).toHaveAttribute('data-kind','grid');
  await page.goBack();
  await expect(page).toHaveURL(/\/returns$/);
  await expect(page.locator('.market-research-dialog')).toHaveCount(0);
  expect(await page.evaluate(()=>document.body.style.overflow)).not.toBe('hidden');
});
