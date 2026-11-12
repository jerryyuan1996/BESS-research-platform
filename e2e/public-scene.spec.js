/* The explanatory scene of the market-background reading, as a reader uses it:
   the step-through sequences, the three coordinated views, the payment rail,
   the reader's switches, the phone frame and reduced motion. The content rules
   for the steps themselves are tests/public-sequences.test.js. */
import {test,expect} from '@playwright/test';
import nem from '../src/experience/story/public/sequences/nem.js';
import jp from '../src/experience/story/public/sequences/jp.js';

test.beforeEach(async({page})=>{await page.route(/^https:\/\//,r=>r.abort());});

async function openScene(page,slug,chapter='system',locale='en'){
  await page.goto('/');await page.evaluate(locale=>localStorage.setItem('hub_lang',locale),locale);
  await page.goto('/markets/'+slug);await page.locator('.public-story-trigger').click();
  const dialog=page.locator('.public-story-dialog');
  await dialog.locator(`.public-story-nav button[data-chapter=${chapter}]`).click();
  await expect(dialog.locator('.public-power-scene')).toBeVisible();
  return dialog;
}
const step=(dialog)=>dialog.locator('.k-seq');
const drawing=(dialog)=>dialog.locator('.public-power-scene');

test('each scene chapter opens on its own sequence, and the steps drive the three views',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const dialog=await openScene(page,'nem');
  /* System tensions opens on the energy-shifting sequence, with all four offered. */
  await expect(dialog.locator('[data-sequence]')).toHaveText(nem.sequences.map(q=>q.title[0]));
  await expect(dialog.locator('[data-sequence=nem-shift]')).toHaveAttribute('aria-pressed','true');
  await expect(dialog.locator('.public-scene-title')).toHaveText('Solar surplus to evening peak');
  const shift=nem.sequences[0];
  await expect(step(dialog)).toHaveAttribute('data-step',shift.steps[0].id);
  await expect(dialog.locator('.k-seq-count')).toHaveText(`Step 1 of ${shift.steps.length}`);
  await expect(dialog.getByRole('button',{name:'Previous step'})).toBeDisabled();
  /* Every step is a complete picture: its question, title, text and sources, and the view it declares. */
  for(const [i,s] of shift.steps.entries()){
    if(i)await dialog.getByRole('button',{name:'Next step'}).click();
    await expect(step(dialog)).toHaveAttribute('data-step',s.id);
    await expect(dialog.locator('.k-seq-title')).toHaveText(s.title[0]);
    await expect(dialog.locator('.k-seq-text')).toHaveText(s.text[0]);
    await expect(dialog.locator('.k-seq-sources a')).toHaveCount(s.sources.length);
    await expect(drawing(dialog)).toHaveAttribute('data-mode',s.view);
    await expect(drawing(dialog)).toHaveAttribute('data-time',s.state.time);
    await expect(dialog.locator(`.public-scene-modes [data-mode=${s.view}]`)).toHaveAttribute('aria-pressed','true');
    await expect(dialog.locator('.k-seq-steps [aria-current=step]')).toHaveText(String(i+1));
  }
  await expect(dialog.getByRole('button',{name:'Next step'})).toBeDisabled();
  await expect(dialog.locator('[data-seq=play]')).toHaveText('Replay');
  /* The other chapters open on the sequence that calls them home. */
  await dialog.locator('.public-story-nav button[data-chapter=storage]').click();
  await expect(dialog.locator('[data-sequence=nem-fcas]')).toHaveAttribute('aria-pressed','true');
  await dialog.locator('.public-story-nav button[data-chapter=mechanism]').click();
  await expect(dialog.locator('[data-sequence=nem-cis]')).toHaveAttribute('aria-pressed','true');
  /* A contracted sequence names its six stages in the market's own words, and marks the current one. */
  await expect(dialog.locator('.public-scene-stages li')).toHaveCount(6);
  await expect(dialog.locator('.public-scene-stages li[aria-current=step]')).toHaveText(nem.sequences[2].stages[0][0]);
  expect(errors).toEqual([]);
});

test('keys step through a sequence, Play advances one step at a time and never starts by itself',async({page})=>{
  const dialog=await openScene(page,'nem');
  await expect(step(dialog)).toHaveAttribute('data-playing','false');
  await dialog.locator('.k-seq-steps button').first().focus();
  await page.keyboard.press('ArrowRight');await expect(step(dialog)).toHaveAttribute('data-step','charge');
  await expect(dialog.locator('.k-seq-steps button').nth(1)).toBeFocused();
  await page.keyboard.press('End');await expect(step(dialog)).toHaveAttribute('data-step','squeeze');
  await page.keyboard.press('ArrowLeft');await expect(step(dialog)).toHaveAttribute('data-step','paid');
  await page.keyboard.press('Home');await expect(step(dialog)).toHaveAttribute('data-step','surplus');
  /* Play rests on a step long enough to read it, then shows the next; Pause holds it there. */
  const play=dialog.locator('[data-seq=play]');
  await play.click();await expect(play).toHaveText('Pause');await expect(play).toHaveAttribute('aria-pressed','true');
  await expect(step(dialog)).toHaveAttribute('data-step','surplus');
  await expect(step(dialog)).toHaveAttribute('data-step','charge',{timeout:9000});
  await play.click();await expect(play).toHaveText('Play');await expect(step(dialog)).toHaveAttribute('data-playing','false');
  await page.waitForTimeout(800);await expect(step(dialog)).toHaveAttribute('data-step','charge');
  /* Stepping by hand stops Play. */
  await play.click();await dialog.getByRole('button',{name:'Next step'}).click();
  await expect(step(dialog)).toHaveAttribute('data-playing','false');await expect(step(dialog)).toHaveAttribute('data-step','peak');
});

test('a service delivered is paid only through three open gates',async({page},info)=>{
  const dialog=await openScene(page,'nem','mechanism');
  const rail=dialog.locator('.k-rail'),line=dialog.locator('.public-scene-reading [data-reading=payment]');
  const cis=nem.sequences.find(q=>q.id==='nem-cis');
  /* Stage by stage the claim stops at the first gate that is shut. */
  const expected=['stopped-1','stopped-2','stopped-3',null,null,'paid'];
  for(const [i,s] of cis.steps.entries()){
    await dialog.locator(`.k-seq-steps [data-step=${s.id}]`).click();
    if(s.view!=='mechanism'){await expect(rail).toHaveCount(0);await expect(line).toHaveCount(0);continue;}
    await expect(rail).toHaveAttribute('data-outcome',expected[i]);
    const shut=expected[i]==='paid'?4:Number(expected[i].slice(-1));
    for(const gate of [1,2,3])await expect(dialog.locator(`.k-gate[data-gate="${gate}"]`)).toHaveClass(gate<shut?/is-open/:gate===shut?/is-shut/:/k-gate/);
  }
  await expect(line).toHaveText('All three conditions are met: the payment settles.');
  /* The gates carry the market's own names, and the reader can shut any one of them. */
  await expect(dialog.locator('[data-condition]')).toHaveText(['1 · Eligible bid','2 · Executed agreement','3 · Fully operating']);
  if(info.project.name==='desktop')await expect(dialog.locator('.k-rail-label')).toContainText(['Eligible bid','Executed agreement','Fully operating']);
  await dialog.locator('[data-condition=awarded]').click();
  await expect(dialog.locator('[data-condition=awarded]')).toHaveAttribute('aria-pressed','false');
  await expect(dialog.locator('[data-condition=awarded]')).toBeFocused();
  await expect(rail).toHaveAttribute('data-outcome','stopped-2');
  await expect(line).toContainText('The second condition is not met');
  await expect(dialog.locator('.k-contract')).toHaveClass(/is-unsigned/);
  /* From another view, a payment condition opens the payment chain, where the rail is. */
  await dialog.locator('.public-scene-modes [data-mode=system]').click();await expect(rail).toHaveCount(0);
  await dialog.locator('[data-condition=awarded]').click();
  await expect(drawing(dialog)).toHaveAttribute('data-mode','mechanism');await expect(rail).toHaveAttribute('data-outcome','paid');
  /* The cause chain is text, shown whole. */
  for(const cause of await dialog.locator('.public-cause p').all())expect(await cause.evaluate(el=>el.scrollHeight<=el.clientHeight+1)).toBe(true);
});

test('the switches change the drawing and its words together, and never the investment case',async({page})=>{
  const dialog=await openScene(page,'nem');
  const before=await page.locator('#decision').innerText();
  const reading=key=>dialog.locator(`.public-scene-reading [data-reading=${key}]`);
  await dialog.locator('[data-network=constrained]').click();
  await expect(reading('network')).toContainText('at its limit');await expect(dialog.locator('.public-congestion')).toHaveCount(1);
  await dialog.locator('[data-network=open]').click();await expect(dialog.locator('.public-congestion')).toHaveCount(0);
  await dialog.locator('[data-time=night]').click();await expect(drawing(dialog)).toHaveAttribute('data-time','night');await expect(reading('time')).toContainText('Night');
  await dialog.locator('[data-flow=charge]').click();await expect(reading('flow')).toContainText('charging');await expect(dialog.locator('[data-flow=charge]')).toBeFocused();
  /* The drawing's own description is the same words, for a reader who cannot see it. */
  expect(await drawing(dialog).locator('desc').textContent()).toContain(await reading('flow').innerText());
  await expect(dialog.locator('.k-layers li')).toHaveCount(5);
  await page.keyboard.press('Escape');
  expect(await page.locator('#decision').innerText()).toBe(before);
});

test('reduced motion: steps change without anything moving',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  const dialog=await openScene(page,'nem','mechanism');
  await dialog.getByRole('button',{name:'Next step'}).click();
  await expect(drawing(dialog)).toHaveClass(/is-live/);
  expect(await drawing(dialog).evaluate(svg=>[...svg.querySelectorAll('*')].filter(n=>getComputedStyle(n).animationName!=='none').length)).toBe(0);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await dialog.getByRole('button',{name:'Next step'}).click();
  expect(await drawing(dialog).evaluate(svg=>getComputedStyle(svg.querySelector('.k-token-move')).animationName)).toBe('k-travel');
});

test('the drawing fits its column on a phone and on a desktop',async({page},info)=>{
  const dialog=await openScene(page,'japan-kyushu');
  const view=dialog.locator('.public-scene-viewport');
  await expect(drawing(dialog)).toHaveAttribute('data-frame',info.project.name==='mobile'?'compact':'wide');
  for(const mode of ['system','storage','mechanism']){
    await dialog.locator(`.public-scene-modes [data-mode=${mode}]`).click();
    expect(await view.evaluate(el=>el.scrollWidth<=el.clientWidth),mode+' scrolls sideways').toBe(true);
    const [svg,box]=[await drawing(dialog).boundingBox(),await view.boundingBox()];
    expect(svg.width).toBeLessThanOrEqual(box.width+1);
  }
  /* Nothing in the figure reaches past the dialog, and every control is a full touch target. */
  expect(await dialog.locator('.public-scene').evaluate(el=>[...el.querySelectorAll('button')].every(b=>b.getBoundingClientRect().height>=44))).toBe(true);
  expect(await dialog.locator('.public-scene').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
});

test('Japan: each area has its own sequence and shares the national award, in both languages',async({page})=>{
  const fetched=[];page.on('request',r=>fetched.push(r.url()));
  const dialog=await openScene(page,'japan-kyushu','system','zh');
  await expect(dialog.locator('[data-sequence]')).toHaveText(jp.for('jp_kyushu').map(q=>q.title[1]));
  await expect(dialog.locator('.k-seq-title')).toHaveText(jp.for('jp_kyushu')[0].steps[0].title[1]);
  await expect(dialog.locator('.k-seq-count')).toHaveText('第1步 / 共6步');
  /* Step 2: the one way out is full and solar is held back. */
  await dialog.getByRole('button',{name:'下一步'}).click();
  await expect(dialog.locator('.public-curtailed-mark')).toHaveCount(1);await expect(dialog.locator('.public-congestion')).toHaveCount(1);
  await expect(dialog.locator('.public-scene-reading [data-reading=solar]')).toBeVisible();
  for(const id of ['jp_hokkaido','jp_tokyo']){
    await dialog.locator('.public-story-tools select').selectOption(id);
    await expect(drawing(dialog)).toHaveAttribute('data-market',id);
    await expect(dialog.locator('[data-sequence]')).toHaveText(jp.for(id).map(q=>q.title[1]));
    /* Tokyo and Hokkaido meet their neighbour through a converter station. */
    await expect(dialog.locator('.public-converter')).toHaveCount(1);
  }
  expect(fetched.filter(url=>/public-sequence-jp-/.test(url)).length).toBe(1);
  expect(fetched.some(url=>/public-sequence-nem-/.test(url))).toBe(false);
});

test('a failed sequence chunk keeps the three views and the switches, and costs only the steps',async({page})=>{
  await page.route(/\/assets\/public-sequence-gb-.*\.js/,r=>r.abort());
  let dialog=await openScene(page,'great-britain');
  await expect(dialog.locator('.k-seq')).toHaveCount(0);await expect(dialog.locator('.public-sequence-picker')).toBeHidden();
  await dialog.locator('.public-scene-modes [data-mode=mechanism]').click();await expect(dialog.locator('.k-rail')).toHaveAttribute('data-outcome','paid');
  await dialog.locator('[data-part=transformer]').click();await expect(dialog.locator('.public-equipment.is-selected')).toHaveAttribute('data-component','transformer');
  await page.route(/\/assets\/public-sequence-nem-.*\.js/,r=>r.abort());
  dialog=await openScene(page,'nem');
  await expect(dialog.locator('.k-seq')).toHaveCount(0);await expect(drawing(dialog)).toHaveAttribute('data-market','nem');
  await expect(dialog.getByRole('button',{name:'Retry scene'})).toHaveCount(0);
});
