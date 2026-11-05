/* Japan G-2 candidate: built output only, all three preview-only allocation
   pages, in both configured desktop/mobile projects. */
import {test,expect} from '@playwright/test';
import {composeStory} from '../src/markets/jp/story.js';

const areas=[
  {region:'tokyo',name:['Japan — Tokyo Area','日本 — 东京区域']},
  {region:'kyushu',name:['Japan — Kyushu Area','日本 — 九州区域']},
  {region:'hokkaido',name:['Japan — Hokkaido Area','日本 — 北海道区域']},
];
const allShots=story=>[story.opening,...story.chapters.flatMap(c=>c.shots)];
const frame=page=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));

test.beforeEach(async({page})=>{
  await page.route(/^https:\/\//,route=>new URL(route.request().url()).origin===process.env.PLATFORM_TEST_BASE_URL?route.continue():route.abort());
});

for(const area of areas){
  const base='/markets/japan-'+area.region,preview=base+'?story=preview',story=composeStory('jp_'+area.region);

  test(`${area.region}: one lazy pack reads all fourteen shots, markers and price cases in both languages`,async({page},info)=>{
    const requests=[],errors=[];page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
    const packs=()=>requests.filter(u=>/\/story-jp-[^/]+\.js/.test(u));
    const locators=()=>requests.filter(u=>/\/storyEvidenceProvenance[^/]*\.js/.test(u));
    await page.goto('/');await expect(page.locator('main')).toBeVisible();expect(packs()).toEqual([]);
    await page.goto(preview);await expect(page.locator('.ix-full-research')).toBeVisible();expect(packs()).toEqual([]);
    const trigger=page.locator('.ix-full-research');await trigger.click();const dialog=page.locator('.ix-story-dialog');
    await expect(dialog).toBeVisible();await expect(dialog.getByRole('button',{name:'Close the story',exact:true})).toBeFocused();
    await expect(dialog.locator('article.ix-shot')).toHaveCount(14);await expect(dialog.locator('.ix-marker')).toHaveCount(14);
    await expect(dialog.locator('.jp-scene')).toHaveCount(13);await expect(dialog.locator('.jp-opening')).toHaveCount(1);
    expect(new Set(packs()).size).toBe(1);expect(locators()).toEqual([]);
    await dialog.locator('.jp-opening svg').scrollIntoViewIfNeeded();
    await page.screenshot({path:info.outputPath('jp-'+area.region+'-map-en.png')});
    const chart=dialog.locator('[data-shot="jp-08"]');
    for(const [i,lang] of ['en','zh'].entries()){
      if(i){
        await dialog.getByRole('button',{name:'Switch to Chinese',exact:true}).click();
        await expect(chart.getByRole('button',{name:'比较三个区域',exact:true})).toHaveAttribute('aria-pressed','true');
      }
      for(const shot of allShots(story)){
        const article=dialog.locator('[data-shot="'+shot.id+'"]');
        await expect(article.locator('h4')).toHaveText(shot.question[i].replace('{areaName}',area.name[i]));
        await expect(article.locator('.ix-marker')).toHaveClass(new RegExp('ix-marker-'+(shot.marker.level==='play'?'fair':shot.marker.level)));
        if(shot.id!=='jp-00')await expect(article.locator('.jp-scene svg').first()).toBeAttached();
      }
      await expect(chart.locator('.jp-build-cost')).toHaveCount(0);await expect(chart.locator('.jp-discount-band')).toHaveCount(0);
      await expect(chart.locator('.jp-build-withheld')).toHaveText(story.text['Missing financial binding'][i]);
      await chart.getByRole('button',{name:story.chapters[2].shots[2].controls[1][i],exact:true}).click();
      await expect(chart.locator('[data-price-table] tbody tr')).toHaveCount(9);
      await expect(chart.locator('[data-axis-currency]:visible')).toHaveAttribute('data-axis-currency','JPY');
      await expect(chart.locator('.jp-design-value')).toHaveAttribute('data-currency','USD');
      const overflow=await dialog.evaluate(d=>[...d.querySelectorAll('.ix-shot,.jp-scene,.jp-panel')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.className));
      expect(overflow).toEqual([]);
      await chart.locator('[data-chart="Chart-JP-PRICE"]:visible').scrollIntoViewIfNeeded();
      const visibleAreas=chart.locator('[data-chart="Chart-JP-PRICE"]:visible [data-area]');
      await expect(visibleAreas).toHaveCount(info.project.name==='mobile'?1:3);
      const tick=chart.locator('[data-chart="Chart-JP-PRICE"]:visible .jp-price-tick').first();
      await tick.focus();await expect(chart.locator('.jp-price-readout')).toHaveText(await tick.getAttribute('aria-label'));
      await page.screenshot({path:info.outputPath('jp-'+area.region+'-price-'+lang+'.png')});
      await chart.locator('[data-price-table]').scrollIntoViewIfNeeded();
      await page.screenshot({path:info.outputPath('jp-'+area.region+'-price-table-'+lang+'.png')});
      for(const id of ['jp-06','jp-11']){
        const scene=dialog.locator('[data-shot="'+id+'"]');
        await expect(scene.locator(info.project.name==='mobile'?'.jp-narrow':'.jp-wide')).toBeVisible();
        await expect(scene.locator(info.project.name==='mobile'?'.jp-wide':'.jp-narrow')).toBeHidden();
      }
      if(i)await expect(chart.getByRole('button',{name:'比较三个区域',exact:true})).toHaveAttribute('aria-pressed','true');
    }
    expect(locators()).toEqual([]);
    await dialog.locator('[data-shot="jp-05"] .ix-story-sources > summary').click();
    await expect(dialog.locator('[data-shot="jp-05"] .jp-record').first()).toBeVisible();
    expect(locators().length).toBeGreaterThan(0);
    await page.keyboard.press('Escape');await expect(trigger).toBeFocused();expect(errors).toEqual([]);
  });

  test(`${area.region}: keyboard teaching stays local and preserves focus, case and translated state`,async({page})=>{
    const id='jp-'+area.region+'-10';
    await page.goto(preview+'&view=story&chapter=battery&shot='+id);
    const dialog=page.locator('.ix-story-dialog'),article=dialog.locator('[data-shot="'+id+'"]');
    await expect(article.locator('h4')).toBeFocused();
    const before=await page.locator('#bankable').innerText();
    const toggle=article.locator('.k-toggle').last();await toggle.scrollIntoViewIfNeeded();await toggle.focus();await frame(page);
    const url=page.url(),history=await page.evaluate(()=>window.history.length);
    await page.keyboard.press('Enter');await expect(toggle).toBeFocused();await expect(toggle).toHaveAttribute('aria-pressed','true');
    expect(page.url()).toBe(url);expect(await page.evaluate(()=>window.history.length)).toBe(history);
    await dialog.getByRole('button',{name:'Switch to Chinese',exact:true}).click();
    await expect(article.locator('.k-toggle').last()).toHaveAttribute('aria-pressed','true');
    await dialog.getByRole('button',{name:'切换到英文',exact:true}).click();await page.keyboard.press('Escape');
    expect(await page.locator('#bankable').innerText()).toBe(before);
  });

  test(`${area.region}: refresh, Back, language and foreign regional-shot fallback restore place`,async({page})=>{
    const own='jp-'+area.region+'-07';
    await page.goto(preview+'&view=story&chapter=tensions&shot='+own);
    const dialog=page.locator('.ix-story-dialog');await expect(dialog.locator('#ix-shot-'+own)).toBeFocused();
    await page.reload();await expect(dialog.locator('#ix-shot-'+own)).toBeFocused();
    await dialog.getByRole('button',{name:'Next →',exact:true}).click();await expect(dialog.locator('#ix-shot-jp-08')).toBeFocused();
    await page.goBack();await expect(dialog.locator('#ix-shot-'+own)).toBeFocused();
    await dialog.getByRole('button',{name:'Switch to Chinese',exact:true}).click();
    await expect(dialog.getByRole('button',{name:'切换到英文',exact:true})).toBeFocused();
    await frame(page);expect(page.url()).toContain('shot='+own);
    const foreign=areas.find(a=>a.region!==area.region).region;
    await page.goto(preview+'&region=compare&view=story&chapter=tensions&shot=jp-'+foreign+'-07');
    await expect(dialog.locator('#ix-shot-jp-06')).toBeFocused();await expect(dialog.locator('article.ix-shot')).toHaveCount(14);
    await expect(dialog.locator('[data-shot="jp-'+area.region+'-07"]')).toHaveCount(1);
    await expect(dialog.locator('[data-shot="jp-'+foreign+'-07"]')).toHaveCount(0);
    await expect(dialog.locator('.jp-price-chart')).toHaveAttribute('data-comparison','false');
    expect(new URL(page.url()).searchParams.get('region')).toBe('compare');
  });

  test(`${area.region}: all four section handoffs and the wrong-profile fallback stay on its own page`,async({page})=>{
    for(const anchor of ['bankable','revenue','execution','downside']){
      await page.goto(preview+'&view=story&chapter=investment&shot=jp-'+area.region+'-13');
      const dialog=page.locator('.ix-story-dialog');await expect(dialog).toBeVisible();
      await dialog.locator('.ix-story-exits a[href="#'+anchor+'"]').click();
      await expect(dialog).toHaveCount(0);await expect(page.locator('#'+anchor)).toBeFocused();expect(new URL(page.url()).pathname).toBe(base);
    }
    await page.goto(preview);await page.getByRole('combobox',{name:'Investor profile',exact:true}).selectOption('developer');
    await page.locator('.ix-full-research').click();await expect(page.locator('.ix-research-dialog')).toBeVisible();await expect(page.locator('.ix-story-dialog')).toHaveCount(0);
  });

  test(`${area.region}: normal entry stays research-only and reduced-motion outage teaching is static`,async({page})=>{
    await page.goto(base);await page.locator('.ix-full-research').click();
    await expect(page.locator('.ix-research-dialog')).toBeVisible();await expect(page.locator('.ix-story-dialog')).toHaveCount(0);
    await page.keyboard.press('Escape');await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto(preview+'&view=story&chapter=origins&shot=jp-02');
    const shot=page.locator('[data-shot="jp-02"]');await expect(shot.locator('h4')).toBeFocused();
    await shot.locator('.k-toggle').last().click();await expect(shot.locator('.jp-rotate')).toHaveCount(0);
    const animations=await shot.locator('svg rect').evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).animationName));
    expect(animations.every(name=>name==='none')).toBeTruthy();
  });
}

test('Japan source disclosure failure keeps the story readable and exposes its bilingual retry state',async({page})=>{
  await page.route('**/storyEvidenceProvenance*.js',route=>route.abort());
  await page.goto('/markets/japan-tokyo?story=preview&view=story&chapter=choices&shot=jp-05');
  const dialog=page.locator('.ix-story-dialog'),source=dialog.locator('[data-shot="jp-05"] .ix-story-sources');
  await expect(dialog).toBeVisible();await source.locator('summary').click();
  await expect(source.getByRole('button',{name:'Retry',exact:true})).toBeVisible();
  await expect(dialog.locator('[data-shot="jp-05"] .ix-marker')).toHaveCount(1);
  await expect(dialog.locator('article.ix-shot')).toHaveCount(14);
  await dialog.getByRole('button',{name:'Switch to Chinese',exact:true}).click();
  await source.locator('summary').click();await expect(source.getByRole('button',{name:'重试',exact:true})).toBeVisible();
});
