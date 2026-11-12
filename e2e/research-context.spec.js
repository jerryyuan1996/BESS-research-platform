/* Research in context, as a reader meets it: one closed "research behind this
   section" under each chapter of a placed market's page and under two chapters
   of its market-background reading. Nothing is fetched until one is opened;
   then the cards are the research's own, drawn by the market's own engine.
   Which card sits under which chapter is held by tests/research-map.test.js. */
import {test,expect} from '@playwright/test';
import {picksFor} from '../src/experience/researchMap.js';

test.beforeEach(async({page})=>{await page.route(/^https:\/\//,r=>r.abort());});

const RESEARCH=/\/assets\/(?:research-context-|market-(?:nem|jp)-|section-nem-)/;
const PAGE_CHAPTERS=['revenue-drivers','revenue-drivers','revenue-drivers','bankable','revenue','execution','downside','sources'];
async function visit(page,slug,locale='en'){
  await page.goto('/');await page.evaluate(locale=>localStorage.setItem('hub_lang',locale),locale);
  await page.goto('/markets/'+slug);await expect(page.locator('#sources')).toBeVisible();
  await expect(page.locator('#revenue-drivers')).toBeVisible();
}
const disclosure=(scope,chapter,slot)=>scope.locator(`.ix-research-context[data-research-chapter="${chapter}"]`+(slot?`[data-research-slot=${slot}]`:':not([data-research-slot])'));

test('every chapter of the NEM page carries its research, closed, and opening one fetches only what it shows',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const fetched=[];page.on('request',r=>fetched.push(r.url()));
  await visit(page,'nem');
  const all=page.locator('main .ix-research-context');
  expect(await all.evaluateAll(nodes=>nodes.map(n=>n.dataset.researchChapter))).toEqual(PAGE_CHAPTERS);
  expect(await all.evaluateAll(nodes=>nodes.some(n=>n.open))).toBe(false);
  expect(fetched.filter(url=>RESEARCH.test(url))).toEqual([]);

  const bankable=disclosure(page,'bankable');
  await bankable.locator('summary').first().click();
  const body=bankable.locator('.ix-research-context-body');
  await expect(body).toHaveAttribute('aria-busy','false');
  await expect(body.locator('.ix-research-kind')).toContainText('Research excerpt');
  /* The sections asked for, and no others. */
  const picks=picksFor('nem','bankable');
  expect(await body.locator('.ix-research-group').evaluateAll(nodes=>nodes.map(n=>n.dataset.researchSection))).toEqual(picks.map(pick=>pick.section));
  const sections=fetched.map(url=>/section-nem-([a-z]+)-/.exec(url)?.[1]).filter(Boolean);
  expect(sections.filter(name=>['capacity','energy','services','grid','story','pipeline','duration'].includes(name))).toEqual([]);
  /* One card opens with the disclosure; the rest wait, and draw when opened. */
  const cards=body.locator('.ix-research-card');
  expect(await cards.count()).toBeGreaterThanOrEqual(3);
  expect(await cards.evaluateAll(nodes=>nodes.filter(n=>n.open).length)).toBe(1);
  const closed=cards.nth(await cards.evaluateAll(nodes=>nodes.findIndex(n=>!n.open)));
  await expect(closed.locator('.ix-research-card-body')).toBeEmpty();
  await closed.locator('summary').click();
  await expect(closed.locator('.ix-research-card-body')).not.toBeEmpty();
  /* The heading is the line the reader pressed, not repeated inside the card. */
  await expect(closed.locator('.ix-research-card-body > .card > h3')).toHaveCount(0);
  /* Each group links to the tab its cards come from, which is still there. */
  const link=body.locator('.ix-research-tab-link').last();
  await expect(link).toHaveAttribute('href','/markets/nem/'+picks.at(-1).section);
  const count=fetched.length;
  await bankable.locator('summary').first().click();await bankable.locator('summary').first().click();
  await expect(body.locator('.ix-research-kind')).toBeVisible();
  expect(fetched.length,'reopening fetches nothing').toBe(count);
  await link.click();await expect(page).toHaveURL(/\/markets\/nem\/[a-z]+$/);await expect(page.locator('.sect').first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('each revenue mechanism carries the research that explains it',async({page})=>{
  await visit(page,'nem');
  for(const slot of ['award','merchant','ancillary']){
    const node=disclosure(page,'revenue-drivers',slot);
    await expect(node).toHaveCount(1);
    /* Research that explains a mechanism on this route sits inside that mechanism's card. */
    const card=page.locator('details.ix-mechanism').filter({has:node});
    if(await card.count())await card.locator('> summary').click();
    await node.locator('summary').first().click();
    const body=node.locator('.ix-research-context-body');
    await expect(body).toHaveAttribute('aria-busy','false');
    expect(await body.locator('.ix-research-group').evaluateAll(nodes=>nodes.map(n=>n.dataset.researchSection))).toEqual(picksFor('nem','revenue-drivers',slot).map(pick=>pick.section));
    expect(await body.locator('.ix-research-card').count()).toBeGreaterThan(0);
  }
  /* Nothing in an opened panel reaches past the page. */
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
});

test('Japan shows each area its own research, in Chinese as in English',async({page})=>{
  await visit(page,'japan-kyushu','zh');
  /* Japan also has research that spans the mechanisms, under its own line. */
  await expect(disclosure(page,'revenue-drivers')).toHaveCount(1);
  const downside=disclosure(page,'downside');
  await expect(downside.locator('summary').first()).toHaveText('本节背后的研究');
  await downside.locator('summary').first().click();
  const body=downside.locator('.ix-research-context-body');
  await expect(body).toHaveAttribute('aria-busy','false');
  await expect(body.locator('.ix-research-kind')).toContainText('研究摘录');
  expect(await body.locator('.ix-research-card').count()).toBeGreaterThan(0);
  await expect(body.locator('.ix-research-tab-link').first()).toHaveAttribute('href',/^\/markets\/japan-kyushu\//);
  expect(await body.innerText()).toMatch(/[一-鿿]/);
});

test('the market-background reading carries research under System tensions and Market mechanism',async({page})=>{
  const fetched=[];page.on('request',r=>fetched.push(r.url()));
  await visit(page,'nem');
  await page.locator('.public-story-trigger').click();
  const dialog=page.locator('.public-story-dialog');
  await expect(dialog.locator('.ix-research-context')).toHaveCount(0);
  for(const chapter of ['system','mechanism']){
    await dialog.locator(`.public-story-nav button[data-chapter=${chapter}]`).click();
    const node=disclosure(dialog,chapter);
    await expect(node.locator('summary').first()).toHaveText('Research behind this chapter');
    expect(await node.evaluate(n=>n.open)).toBe(false);
  }
  expect(fetched.filter(url=>/\/assets\/(?:research-context-|market-nem-)/.test(url))).toEqual([]);
  const node=disclosure(dialog,'mechanism');
  await node.locator('summary').first().click();
  await expect(node.locator('.ix-research-context-body')).toHaveAttribute('aria-busy','false');
  expect(await node.locator('.ix-research-card').count()).toBeGreaterThan(0);
  for(const chapter of ['storage','judgement','research']){
    await dialog.locator(`.public-story-nav button[data-chapter=${chapter}]`).click();
    await expect(dialog.locator(`.public-chapter[data-chapter=${chapter}]`)).toBeVisible();
    await expect(dialog.locator('.ix-research-context')).toHaveCount(0);
  }
});

test('a failed research load offers a retry without replacing the chapter',async({page})=>{
  let fail=true;await page.route(/\/assets\/research-context-.*\.js/,r=>fail?r.abort():r.continue());
  await visit(page,'nem');
  const node=disclosure(page,'execution');
  await node.locator('summary').first().click();
  await expect(node.getByRole('button',{name:'Retry'})).toBeVisible();
  /* The chapter above the failed panel is untouched. */
  await expect(page.locator('#execution h2').first()).toBeVisible();
  fail=false;await node.getByRole('button',{name:'Retry'}).click();
  await expect(node.locator('.ix-research-card').first()).toBeVisible();
});


/* The full rollout is exercised through the built site in both languages and
   both configured viewports. Open every available chapter, not just the first
   dashboard, so an empty mapping or a missing adapter cannot hide behind a
   working market. */
const ROLLOUT = [
  ['nem','nem'], ['jp','japan-tokyo'], ['jp','japan-kyushu'], ['jp','japan-hokkaido'],
  ['wa','western-australia'], ['gb','great-britain'], ['de','germany'],
  ['it','italy'], ['ie','ireland'], ['ro','romania'], ['pl','poland'],
  ['pjm','pjm'], ['ercot','ercot'], ['caiso','caiso'], ['fi','finland'],
  ['ca_on','ontario'], ['sa','saudi-arabia'], ['es','spain'],
];
for (const [owner, slug] of ROLLOUT) for (const locale of ['en','zh']){
  test(`${slug} research chapters reuse public research (${locale})`, async ({page}) => {
    test.setTimeout(120000);
    const errors=[]; page.on('pageerror', error => errors.push(error.message));
    const fetched=[]; page.on('request', request => fetched.push(request.url()));
    await visit(page,slug,locale);
    expect(fetched.some(url => /\/assets\/research-context-/.test(url))).toBe(false);
    const panels=page.locator('main .ix-research-context');
    const expectedTargets=['revenue-drivers:award','revenue-drivers:merchant','revenue-drivers:ancillary',
      ...(['jp','de','it','ercot'].includes(owner)?['revenue-drivers']:[]),
      ...(owner==='sa'?['bankable','execution','sources']:['bankable','revenue','execution','downside','sources'])];
    expect(await panels.evaluateAll(nodes=>nodes.map(node=>node.dataset.researchChapter+
      (node.dataset.researchSlot?':'+node.dataset.researchSlot:'')).sort())).toEqual(expectedTargets.sort());
    if(owner==='sa'){
      /* Research may explain an unpriced market; it must not invent a return. */
      await expect(page.locator('#revenue, #downside')).toHaveCount(0);
      await expect(page.locator('#bankable > .ix-kpis')).toHaveCount(0);
      await expect(page.locator('#bankable > p')).toContainText(locale==='zh'?'尚无完整回报模型':'does not yet have a complete return model');
    }
    const surfaced=new Set();
    expect(await panels.evaluateAll(nodes => nodes.some(node => node.open))).toBe(false);
    for (const panel of await panels.all()){
      const mechanism=panel.locator('xpath=ancestor::details[contains(@class,"ix-mechanism")]');
      if (await mechanism.count() && !await mechanism.evaluate(node => node.open))
        await mechanism.locator(':scope > summary').click();
      await panel.locator(':scope > summary').click();
      const body=panel.locator('.ix-research-context-body');
      await expect(body).toHaveAttribute('aria-busy','false');
      await expect(body.locator('.ix-research-kind')).toContainText(locale==='zh'?'研究摘录':'Research excerpt');
      const target=await panel.evaluate(node=>({chapter:node.dataset.researchChapter,slot:node.dataset.researchSlot||null}));
      expect(await body.locator('.ix-research-group').evaluateAll(nodes=>nodes.map(node=>node.dataset.researchSection)))
        .toEqual(picksFor(owner,target.chapter,target.slot).map(pick=>pick.section));
      const cards=body.locator('.ix-research-card');
      expect(await cards.count()).toBeGreaterThan(0);
      expect(await cards.evaluateAll(nodes => nodes.filter(node => node.open).length)).toBe(1);
      await expect(body.locator('.ix-research-card[open] .ix-research-card-body').first()).not.toBeEmpty();
      if(owner==='sa') for(const card of await cards.all()){
        /* All fourteen non-history units must be reachable even without a
           priced model. The fifteenth is the existing history reading. */
        surfaced.add(await card.evaluate(node=>node.closest('[data-research-section]').dataset.researchSection+'/'+node.dataset.researchCard));
        await card.evaluate(node=>{node.open=true;});
        await expect(card.locator('.ix-research-card-body')).not.toBeEmpty();
      }
      const links=body.locator('.ix-research-tab-link');
      expect(await links.count()).toBeGreaterThan(0);
      for (const href of await links.evaluateAll(nodes => nodes.map(node => node.getAttribute('href'))))
        expect(href).toMatch(new RegExp('^/markets/'+slug+'/'));
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
      await panel.locator(':scope > summary').click();
    }
    if(owner==='sa')expect(surfaced.size).toBe(14);
    /* Reuse this page and its already fetched research for the two public
       reading chapters. The separate NEM test above holds cold-load laziness;
       this matrix checks all routes without another navigation per chapter. */
    await page.locator('.public-story-trigger').click();
    const dialog=page.locator('.public-story-dialog');
    await expect(dialog).toBeVisible();
    if (['ca_on','sa','es'].includes(owner)){
      await expect(dialog.locator('.public-power-scene')).toHaveCount(0);
      await expect(dialog.locator('.ix-research-context')).toHaveCount(0);
      await expect(dialog.locator('.public-story-nav button[data-chapter=system], .public-story-nav button[data-chapter=mechanism]')).toHaveCount(0);
    } else {
      for (const chapter of ['system','mechanism']){
        await dialog.locator(`.public-story-nav button[data-chapter=${chapter}]`).click();
        const panel=disclosure(dialog,chapter);
        await expect(panel).toHaveCount(1);
        expect(await panel.evaluate(node=>node.open)).toBe(false);
        await panel.locator(':scope > summary').click();
        const body=panel.locator('.ix-research-context-body');
        await expect(body).toHaveAttribute('aria-busy','false');
        await expect(body.locator('.ix-research-kind')).toContainText(locale==='zh'?'研究摘录':'Research excerpt');
        await expect(body.locator('.ix-research-card[open] .ix-research-card-body').first()).not.toBeEmpty();
        expect(await body.locator('.ix-research-group').evaluateAll(nodes=>nodes.map(node=>node.dataset.researchSection)))
          .toEqual(picksFor(owner,chapter).map(pick=>pick.section));
        const links=body.locator('.ix-research-tab-link');
        expect(await links.count()).toBeGreaterThan(0);
        for (const href of await links.evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href'))))
          expect(href).toMatch(new RegExp('^/markets/'+slug+'/'));
        expect(await dialog.evaluate(node=>node.scrollWidth<=node.clientWidth+1)).toBe(true);
        expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
        await panel.locator(':scope > summary').click();
      }
    }
    if (owner==='wa'){
      /* Neither page nor reading may reach the confidential portfolio adapter. */
      expect(fetched.some(url => /portfolioSection|wa-portfolio/.test(url))).toBe(false);
    }
    expect(errors).toEqual([]);
  });
}


for (const locale of ['en','zh']) test(`Japan fetches only the requested sections and keeps the regional lens (${locale})`, async ({page}) => {
  for (const region of ['tokyo','kyushu','hokkaido']){
    const fetched=[]; const record=request=>fetched.push(request.url()); page.on('request',record);
    await visit(page,'japan-'+region,locale);
    expect(fetched.filter(url=>/\/assets\/section-jp-/.test(url))).toEqual([]);
    const panel=disclosure(page,'revenue');
    await panel.locator(':scope > summary').click();
    await expect(panel.locator('.ix-research-context-body')).toHaveAttribute('aria-busy','false');
    const sections=fetched.map(url=>/section-jp-([a-z]+)-/.exec(url)?.[1]).filter(Boolean);
    const expected=picksFor('jp','revenue').map(pick=>pick.section);
    expect([...new Set(sections)].filter(id=>id!=='shared').sort()).toEqual([...expected].sort());
    const bodyText=await panel.innerText();
    expect(bodyText).toContain(locale==='zh'?{tokyo:'东京',kyushu:'九州',hokkaido:'北海道'}[region]:{tokyo:'Tokyo',kyushu:'Kyushu',hokkaido:'Hokkaido'}[region]);
    page.off('request',record);
  }
});
