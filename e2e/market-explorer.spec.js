import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { markets } from '../src/markets/registry.js';
import { REVENUE_SECTIONS } from '../src/markets/tabGroups.js';
import { readResearch } from '../scripts/research/coverage.mjs';
import { gridMapForMarket } from '../src/markets/gridMapRegistry.js';
import { CORE_STORYLINE } from '../src/markets/ro/coreStoryline.js';
import { CORE_STORYLINE_TEXT as WA_STORYLINE } from '../src/markets/wa/coreStoryline.js';
import { conciseResearchSpec } from '../src/markets/_shared/conciseResearch.js';

const original = { en: await readResearch({lang:'en'}), zh: await readResearch({lang:'zh'}) };
const walk = blocks => (blocks || []).filter(Boolean).flatMap(b=>[b,...walk(b.blocks),...walk(b.cards)]);
const useful = unit => !walk(unit.blocks).some(b=>['scorecard','aug'].includes(b.t));
const labels = [['Support & adequacy','支持机制与充裕度'],['Wholesale & intraday markets','批发与日内市场'],['Balancing & reserves','平衡与备用'],['Storage duration','储能时长']];
const normalize = text => text.replace(/\s+/g,'');
for (const owner of new Set(markets.map(m=>m.manifest.dashboardId||m.manifest.id)))
  await import(`../src/markets/${owner}/gridMapData.js`);
test.beforeEach(async({page,baseURL}) => { await page.route(/^https:\/\//, r =>
  new URL(r.request().url()).origin === new URL(baseURL).origin ? r.continue() : r.abort()); });

for (const market of markets) test(`${market.manifest.id}: own narrative, decision-first chapters and concise readers`, async({page}, info) => {
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
    const narrative = overview.locator('.public-core-storyline');
    await expect(narrative).toHaveAttribute('aria-busy','false');
    await expect(narrative).toHaveAttribute('data-storyline-market',id);
    if (id==='ro') {
      for (const pair of Object.values(CORE_STORYLINE)) await expect(narrative).toContainText(text(pair));
    } else {
      const core = owner==='wa' ? WA_STORYLINE : walk(original[lang].find(r=>r.market===owner&&r.lens===(region||null)&&r.section==='home').units.flatMap(u=>u.blocks)).find(b=>b.t==='band-story')?.text
        || (await import('../src/markets/'+owner+'/data.js')).M.overall?.rationale;
      expect(core, id+' has its own core storyline').toBeTruthy();
      expect(normalize(await narrative.innerText())).toContain(normalize(text(core)));
    }
    await expect(overview.locator('.public-history,.public-logic,.public-condition')).toHaveCount(0);
    const nav = page.locator('.market-reading-nav');
    await expect(nav).toBeVisible();
    await expect(nav.locator('[aria-current="location"]')).toHaveCount(1);
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
    {
      await expect(overview.locator('.public-history,.public-logic,.public-condition')).toHaveCount(0);
      await expect(page.locator('[data-market-research="revenue"]')).toHaveCount(0);
      const chapters = page.locator('#revenue-drivers > details');
      const sections = ['capacity','energy','services','duration'].map(key=>market.tabs.find(([id])=>
        id===key || (key==='capacity'&&id==='rcm') || (key==='services'&&id==='fcess'))).filter(Boolean);
      await expect(chapters).toHaveCount(4);
      for (const [i, [section]] of sections.entries()) {
        const chapter = chapters.nth(i);
        await expect(chapter.locator(':scope > summary')).toHaveText(String(i + 1).padStart(2, '0') + text(labels[i]));
        await chapter.locator(':scope > summary').click();
        const body = chapter.locator('.market-revenue-body');
        await expect(body).toHaveAttribute('aria-busy','false');
        const decision = body.locator('.market-revenue-decision');
        await expect(decision.locator('.why')).toBeVisible();
        await expect(decision.locator('.ix-eyebrow')).toHaveText(lang === 'en' ? 'INVESTMENT DECISION' : '投资决策');
        const units = original[lang].find(r => r.market === owner && r.lens === (region||null) && r.section === section).units.filter(useful);
        const key = await decision.getAttribute('data-decision-card');
        const own = units.find(u => u.key === key);
        expect(own).toBeTruthy();
        const expected = walk(conciseResearchSpec({blocks:own.blocks}).blocks).filter(b=>b.t==='why');
        const actual = normalize(await decision.innerText());
        if (expected.length) expect(expected.some(why=>actual.includes(normalize(text(why.text))))).toBeTruthy();
        else if (owner !== 'wa') expect(walk(own.blocks).filter(b=>b.t==='p').some(p=>actual.includes(normalize(text(p.text))))).toBeTruthy();
        expect(await body.locator('[data-research-card]').evaluateAll(nodes => nodes.map(n => n.dataset.researchCard))).toEqual(units.map(u => u.key));
        expect(await body.evaluate(el => el.firstElementChild.classList.contains('market-revenue-decision'))).toBe(true);
        for (const card of await body.locator('[data-research-card]').all()) await expect(card.locator('.card').first()).not.toBeEmpty();
        await expect(body.locator('.meta-illus,.badge.verify,.badge.etl')).toHaveCount(0);
        if (section === 'duration') await expect(body.locator('select.inp')).toHaveCount(0);
        await expect(body).not.toContainText(lang === 'zh' ? '评分卡' : 'Scorecard');
        await expect(body).not.toContainText(lang === 'zh' ? '增容准备度' : 'Augmentation readiness');
        await chapter.evaluate(el=>el.scrollIntoView({block:'start'}));
        await expect(nav.locator('[aria-current="location"]')).toHaveAttribute('href','#revenue-'+section);
        if (lang === 'zh' && id === 'ro') {
          await mkdir('.tmp/ro-narrative-demo', {recursive:true});
          await decision.screenshot({path:`.tmp/ro-narrative-demo/${section}-${info.project.name}.png`});
          if (section === 'services') await body.locator('[data-research-card]').first().screenshot({path:`.tmp/ro-narrative-demo/services-card-${info.project.name}.png`});
          if (section === 'duration') await chapter.screenshot({path:`.tmp/ro-narrative-demo/duration-chapter-${info.project.name}.png`});
          if (section === 'capacity') {
            await mkdir('.tmp/market-rollout',{recursive:true});
            await page.screenshot({path:`.tmp/market-rollout/navigation-${info.project.name}.png`});
          }
        }
        await chapter.locator(':scope > summary').click();
      }
      if (lang === 'zh' && id === 'ro') {
        await overview.screenshot({path:`.tmp/ro-narrative-demo/overview-${info.project.name}.png`});
        await page.locator('#revenue-drivers').screenshot({path:`.tmp/ro-narrative-demo/revenue-${info.project.name}.png`});
      }
    }
    if (info.project.name === 'mobile') await nav.locator('.market-reading-toggle').click();
    await nav.locator('a[href="#sources"]').click();
    await expect(nav.locator('[aria-current="location"]')).toHaveAttribute('href','#sources');
    const top = page.getByRole('button',{name:lang==='en'?'Back to top':'回到顶部',exact:true});
    await expect(top).toBeVisible();
    await top.click();
    await expect.poll(()=>page.evaluate(()=>window.scrollY)).toBeLessThan(10);
    for (const kind of ['grid']) {
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
          await expect(card.locator('.meta-illus,.badge.verify,.badge.etl')).toHaveCount(0);
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
    await expect(page.locator('.ix-research-inner')).not.toContainText(lang === 'zh' ? '时长需求指数' : 'Duration-Need Index');
    await expect(page.locator('.ix-research-inner .meta-illus,.ix-research-inner .badge.verify,.ix-research-inner .badge.etl')).toHaveCount(0);
    if (id === 'ro') {
      await page.goto('/markets/romania/data');
      await expect(page.getByRole('heading', { name: lang === 'zh' ? '核心公式' : 'Core formulas', exact: false })).toBeVisible();
      await expect(page.locator('.ix-research-inner')).not.toContainText(lang === 'zh' ? '时长评分卡' : 'Duration scorecard');
    }
  }
  // Existing bookmarks open their exact section inside the new reader.
  await page.goto('/markets/'+slug+'/revenue/duration');
  const reader=page.locator('.market-research-dialog');
  {
    await expect(page.locator('#revenue-duration')).toHaveAttribute('open','');
    await expect(page.locator('#revenue-duration .market-revenue-body')).toHaveAttribute('aria-busy','false');
    await expect(reader).toHaveCount(0);
  }
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
