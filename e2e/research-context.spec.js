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

test('a market whose research is not placed reads as before, and a failed load offers a retry',async({page})=>{
  await visit(page,'great-britain');
  await expect(page.locator('.ix-research-context')).toHaveCount(0);
  await page.locator('.public-story-trigger').click();
  await page.locator('.public-story-nav button[data-chapter=system]').click();
  await expect(page.locator('.public-power-scene')).toBeVisible();
  await expect(page.locator('.public-story-dialog .ix-research-context')).toHaveCount(0);

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
