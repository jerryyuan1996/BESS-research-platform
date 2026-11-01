/* The market story (immersive-experience plan, WP-03 to WP-07 and WP-10), on
   the built site. Released at G-2, so it needs no preview flag. */
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // committed assets only, as in platform.spec.js
  await page.route(/^https:\/\//, route => new URL(route.request().url()).origin === process.env.PLATFORM_TEST_BASE_URL ? route.continue() : route.abort());
});

const open = async (page) => {
  await page.goto('/markets/western-australia');
  const trigger = page.locator('.ix-full-research');
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const dialog = page.locator('.ix-story-dialog');
  await expect(dialog).toBeVisible();
  return { trigger, dialog };
};

test('the WA story reads end to end, in both languages, and gives focus back', async ({ page }, info) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  const { trigger, dialog } = await open(page);
  await expect(dialog.getByRole('button', { name: 'Close the story' })).toBeFocused();
  await expect(dialog.locator('article.ix-shot')).toHaveCount(13);
  await expect(dialog.locator('.ix-marker')).toHaveCount(13);

  // figures are read from the model's fields, not typed
  await expect(dialog.locator('[data-shot="wa-08"] .ix-shot-copy')).toContainText('builds 8 hours');
  await expect(dialog.locator('[data-shot="wa-06"] .ix-shot-copy')).toContainText('7 hours for batteries first credited');
  await expect(dialog.locator('[data-shot="wa-03"] .ix-node').first()).toContainText('2006');
  await expect(dialog.locator('[data-shot="wa-03"] .ix-node').first().locator('dd').nth(1)).toHaveText('Pay for capacity as well as energy.');
  await expect(dialog).not.toContainText('[object');

  // shot and chapter navigation move focus to the heading they reach
  await dialog.getByRole('button', { name: 'Next →' }).click();
  await expect(dialog.locator('#ix-shot-wa-01')).toBeFocused();
  await dialog.getByRole('button', { name: /Today's tensions/ }).click();
  await expect(dialog.locator('#ix-shot-wa-05')).toBeFocused();
  await expect(dialog.getByRole('button', { name: /Today's tensions/ })).toHaveAttribute('aria-current', 'true');
  await dialog.screenshot({ path: info.outputPath('story-en.png') });

  // Chinese at the same place, then back
  await dialog.getByRole('button', { name: 'Switch to Chinese' }).click();
  await expect(dialog.locator('[data-shot="wa-05"] h4')).toHaveText('晴天的中午会发生什么？');
  await expect(dialog.locator('[data-shot="wa-08"] .ix-shot-copy')).toContainText('建设8小时');
  await expect(dialog.locator('.ix-marker-strong').first()).toHaveText('证据充分');
  await expect(dialog.locator('#ix-story-title')).toContainText('故事');
  await expect(dialog.locator('#ix-story-title')).not.toContainText('Western Australia');
  await dialog.screenshot({ path: info.outputPath('story-zh.png') });
  await dialog.getByRole('button', { name: '切换到英文' }).click();
  await expect(dialog.locator('[data-shot="wa-05"] h4')).toHaveText('What happens on a sunny midday?');

  // the full research sits one layer deeper and returns to the story
  await dialog.getByRole('button', { name: 'Full research ↗' }).click();
  const research = page.locator('.ix-research-dialog');
  await expect(research).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(research).toHaveCount(0);
  await expect(dialog).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});

test('every chapter shot draws its scene, and the toggles teach without touching the case', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  const { dialog } = await open(page);
  await expect(dialog.locator('article.ix-shot .k-scene')).toHaveCount(12);
  const caseText = await page.locator('#bankable').innerText();

  // wa-08: a shorter build is credited as a smaller battery
  const station = dialog.locator('[data-shot="wa-08"]');
  const short = station.getByRole('button', { name: '4 hours (Example)' });
  await short.scrollIntoViewIfNeeded();
  await short.focus();
  await page.keyboard.press('Enter');
  await expect(short).toHaveAttribute('aria-pressed', 'true');
  await expect(station.getByRole('button', { name: '8 hours' })).toHaveAttribute('aria-pressed', 'false');
  await expect(station.locator('.k-energy-bar')).toHaveClass(/k-short/);
  await expect(station.locator('.k-readout')).not.toContainText('100 MW / 100 MW');

  // wa-11: dropping services clears the evening conflict
  const board = dialog.locator('[data-shot="wa-11"]');
  await expect(board.locator('.k-conflict')).toHaveCount(1);
  await board.getByRole('button', { name: 'Frequency services' }).click();
  await expect(board.getByRole('button', { name: 'Frequency services' })).toHaveAttribute('aria-pressed', 'false');
  await expect(board.locator('.k-conflict')).toHaveCount(0);

  // wa-06: the midday view moves the highlight off the window
  const dusk = dialog.locator('[data-shot="wa-06"]');
  const before = await dusk.locator('svg.k-chart').innerHTML();
  await dusk.getByRole('button', { name: 'Midday' }).click();
  expect(await dusk.locator('svg.k-chart').innerHTML()).not.toEqual(before);

  // the scenes follow the language, and the case never moved
  await dialog.getByRole('button', { name: 'Switch to Chinese' }).click();
  await expect(dialog.locator('[data-shot="wa-11"] .k-key')).toContainText('傍晚容量');
  await expect(dialog).not.toContainText('[object');
  await dialog.getByRole('button', { name: '切换到英文' }).click();
  await page.keyboard.press('Escape');
  expect(await page.locator('#bankable').innerText()).toEqual(caseText);
  expect(errors).toEqual([]);
});

test('on a phone the scenes fit the screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const { dialog } = await open(page);
  const body = dialog.locator('.ix-story-body');
  const overflow = await body.evaluate(el => el.scrollWidth - el.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  for (const svg of await dialog.locator('.k-scene svg').all()){
    const box = await svg.boundingBox();
    if (box) expect(box.x + box.width).toBeLessThanOrEqual(390 + 0.5);
  }
});

/* ---- story URLs (WP-04) -------------------------------------------------- */
const WA = '/markets/western-australia';

test('the address follows the reader, and Back and Forward retrace the path', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  const { dialog } = await open(page);
  await expect(page).toHaveURL(`${WA}?view=story&chapter=opening&shot=wa-00`);

  await dialog.getByRole('button', { name: 'Next →' }).click();
  await expect(page).toHaveURL(/chapter=origins&shot=wa-01$/);
  await dialog.getByRole('button', { name: /Who pays/ }).click();
  await expect(page).toHaveURL(/chapter=payment&shot=wa-10$/);
  await expect(dialog.locator('#ix-shot-wa-10')).toBeFocused();

  // Back steps to the previous shot without re-rendering the page behind
  await page.evaluate(() => { document.querySelector('.ix-full-research').dataset.kept = 'yes'; });
  await page.goBack();
  await expect(page).toHaveURL(/chapter=origins&shot=wa-01$/);
  await expect(dialog.locator('#ix-shot-wa-01')).toBeFocused();
  await expect(page.locator('.ix-full-research')).toHaveAttribute('data-kept', 'yes');

  await page.goForward();
  await expect(page).toHaveURL(/chapter=payment&shot=wa-10$/);
  await expect(dialog.locator('#ix-shot-wa-10')).toBeFocused();

  // closing adds an entry; Back reopens the story where the reader left it
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page).toHaveURL(`${WA}`);
  await page.goBack();
  await expect(page.locator('.ix-story-dialog')).toBeVisible();
  await expect(page.locator('#ix-shot-wa-10')).toBeFocused();
  await expect(page.locator('.ix-full-research')).toHaveAttribute('data-kept', 'yes');

  // Back past the opening closes the story again
  for (let i = 0; i < 3; i++) await page.goBack();
  await expect(page).toHaveURL(`${WA}`);
  await expect(page.locator('.ix-story-dialog')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('a link, and a refresh, open the story at its shot', async ({ page }) => {
  await page.goto(`${WA}?view=story&chapter=tensions&shot=wa-06`);
  const dialog = page.locator('.ix-story-dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('#ix-shot-wa-06')).toBeFocused();
  await expect(dialog.getByRole('button', { name: /Today's tensions/ })).toHaveAttribute('aria-current', 'true');
  await expect(dialog.locator('[data-shot="wa-06"]')).toBeInViewport();

  await page.reload();
  await expect(page.locator('.ix-story-dialog #ix-shot-wa-06')).toBeFocused();
  await expect(page.locator('.ix-story-dialog')).toHaveCount(1);
});

test('an unknown shot falls back to its chapter, and the address is corrected', async ({ page }) => {
  await page.goto(`${WA}?view=story&chapter=payment&shot=wa-99`);
  await expect(page.locator('.ix-story-dialog #ix-shot-wa-10')).toBeFocused();
  await expect(page).toHaveURL(/chapter=payment&shot=wa-10$/);

  await page.goto(`${WA}?view=story&chapter=nowhere`);
  await expect(page.locator('.ix-story-dialog')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close the story' })).toBeFocused();
  await expect(page).toHaveURL(/chapter=opening&shot=wa-00$/);
});

test('switching language keeps the place, and teaching controls never enter history', async ({ page }) => {
  await page.goto(`${WA}?view=story&chapter=battery&shot=wa-08`);
  const dialog = page.locator('.ix-story-dialog');
  await expect(dialog.locator('#ix-shot-wa-08')).toBeFocused();
  const entries = await page.evaluate(() => history.length);

  const station = dialog.locator('[data-shot="wa-08"]');
  await station.getByRole('button', { name: '4 hours (Example)' }).click();
  await station.getByRole('button', { name: 'After fade (Example)' }).click();
  expect(await page.evaluate(() => history.length)).toBe(entries);
  await expect(page).toHaveURL(/chapter=battery&shot=wa-08$/);

  await dialog.getByRole('button', { name: 'Switch to Chinese' }).click();
  await expect(page.locator('.ix-story-dialog')).toHaveCount(1);
  await expect(dialog.locator('[data-shot="wa-08"]')).toBeInViewport();
  await expect(page).toHaveURL(/chapter=battery&shot=wa-08$/);
  expect(await page.evaluate(() => history.length)).toBe(entries);
  await dialog.getByRole('button', { name: '切换到英文' }).click();
});

test('an investor switch behind a closed story leaves it closed, and Back reopens it on the new view', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(`${WA}?view=story&chapter=payment&shot=wa-10`);
  await expect(page.locator('.ix-story-dialog #ix-shot-wa-10')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(`${WA}`);

  const investor = page.getByRole('combobox', { name: 'Investor profile' });
  const other = await investor.evaluate(s => [...s.options].map(o => o.value).find(v => v !== s.value));
  await investor.selectOption(other);
  await expect(page.locator('.ix-full-research')).toBeVisible();
  await expect(page.locator('.ix-story-dialog')).toHaveCount(0);
  await expect(page).toHaveURL(`${WA}`);

  await page.goBack();
  await expect(page.locator('.ix-story-dialog #ix-shot-wa-10')).toBeFocused();
  await expect(page).toHaveURL(/chapter=payment&shot=wa-10$/);
  expect(errors).toEqual([]);
});

test('a market without a story ignores a story link', async ({ page }) => {
  await page.goto('/markets/italy?view=story&chapter=tensions&shot=wa-06');
  await expect(page.locator('.ix-full-research')).toBeVisible();
  await expect(page.locator('.ix-story-dialog')).toHaveCount(0);
  await expect(page.locator('.ix-research-dialog')).toHaveCount(0);
});

test('the story hands the reader to the investment case', async ({ page }) => {
  const { dialog } = await open(page);
  await dialog.getByRole('link', { name: 'Go to the investment case' }).first().click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('#bankable')).toBeFocused();
});

test('every exit in the last chapter reaches its market-page section', async ({ page }) => {
  for (const [label, anchor] of [['Revenue', 'revenue'], ['Execution', 'execution'], ['Downside', 'downside']]){
    const { dialog } = await open(page);
    await dialog.locator('.ix-story-exits').getByRole('link', { name: label, exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.locator(`#${anchor}`)).toBeFocused();
  }
});

test('the WA button opens the story for every reader, with the research one click deeper', async ({ page }) => {
  await page.goto('/markets/western-australia');
  await page.locator('.ix-full-research').click();
  const dialog = page.locator('.ix-story-dialog');
  await expect(dialog).toBeVisible();
  await expect(page.locator('.ix-research-dialog')).toHaveCount(0);
  await dialog.getByRole('button', { name: 'Full research ↗' }).click();
  await expect(page.locator('.ix-research-dialog')).toBeVisible();
});

/* Germany WP-09: the same shell and URL contract, on the approved Example. */
const DE = '/markets/germany';
const openGermany = async page => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(DE);
  const trigger = page.locator('.ix-full-research');
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const dialog = page.locator('.ix-story-dialog');
  await expect(dialog).toBeVisible();
  return { trigger, dialog };
};

test('Germany explains the toll and congestion boundary in English and Chinese', async ({ page }, info) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  const priceRequests = []; page.on('request', r => { if (/de-day-ahead/.test(r.url())) priceRequests.push(r.url()); });
  const { trigger, dialog } = await openGermany(page);
  await expect(dialog.locator('article.ix-shot')).toHaveCount(13);
  await expect(dialog.locator('.ix-marker')).toHaveCount(13);
  await expect(dialog.locator('.de-opening-thumb')).toHaveCount(1);
  await expect(dialog.locator('[data-shot=de-00] .ix-story-play-title')).toContainText('Toll');
  await expect(dialog.locator('[data-shot=de-05] .ix-shot-copy')).toContainText('connection and cost issue');
  await expect(dialog.locator('[data-shot=de-09] .ix-shot-copy')).toContainText('contractual revenue during its term');
  await expect(dialog.locator('[data-shot=de-09] .ix-shot-copy')).toContainText('earns less');
  await expect(dialog.locator('[data-shot=de-09] .ix-marker-change')).toContainText('EPEX SPOT');
  await expect(dialog.locator('[data-shot=de-09] .ix-marker-change')).toContainText('SMARD');
  await expect(dialog.locator('[data-shot=de-09] .ix-marker-change')).toContainText('CC BY 4.0');
  await expect(dialog.locator('[data-shot=de-09] .ix-marker-change')).toContainText('HEDWIG');
  await expect(dialog.locator('[data-shot=de-09] [data-mode=example]')).toBeVisible();
  await dialog.getByRole('button', { name: 'Next →' }).focus();
  await page.keyboard.press('Enter');
  await expect(dialog.locator('#ix-shot-de-01')).toBeFocused();
  await dialog.getByRole('button', { name: 'Switch to Chinese' }).click();
  await expect(dialog.locator('[data-shot=de-05] .ix-shot-copy')).toContainText('并网限制和成本');
  await expect(dialog.locator('[data-shot=de-09] .ix-shot-meaning')).toContainText('转移价格风险');
  await expect(dialog.locator('[data-shot=de-09] .ix-marker-change')).toContainText('数据所有者许可');
  await expect(dialog.locator('[data-shot=de-09] .k-tag')).toContainText('示例');
  await expect(dialog.locator('.de-opening-thumb')).toHaveCount(1);
  const chinese = await dialog.locator('article.ix-shot').evaluateAll(nodes => nodes.map(el => ({ copy: el.querySelector('.ix-shot-copy').innerText, marker: el.querySelector('.ix-marker').innerText })));
  for (const article of chinese) {
    expect(article.copy).toMatch(/[一-鿿]/);
    expect(article.marker).toBe('证据尚可');
  }
  await dialog.screenshot({ path: info.outputPath('germany-story-zh.png') });
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  expect(priceRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test('German teaching controls preserve the case and expose costs, term and method', async ({ page }) => {
  const { dialog } = await openGermany(page);
  const before = await page.locator('#bankable').innerText();
  const entries = await page.evaluate(() => history.length);
  const station = dialog.locator('[data-shot=de-08]');
  const longer = station.getByRole('button', { name: /h merchant/ }).nth(1);
  await longer.scrollIntoViewIfNeeded(); await longer.focus(); await page.keyboard.press('Enter');
  await expect(longer).toHaveAttribute('aria-pressed', 'true');
  const fee = dialog.locator('[data-shot=de-09] .de-spread-chart');
  const amount = await fee.getAttribute('data-fee');
  expect(Number(amount)).toBeGreaterThan(0);
  await dialog.locator('[data-shot=de-09]').getByRole('button', { name: 'Toll', exact: true }).click();
  await expect(dialog.locator('[data-shot=de-09] .de-spread-chart')).toHaveAttribute('data-fee', amount);
  await dialog.locator('[data-shot=de-09]').locator('summary').filter({ hasText: 'How measured' }).click();
  await expect(dialog.locator('[data-shot=de-09]')).toContainText('Hindsight price opportunity');
  await dialog.locator('[data-shot=de-10]').getByRole('button', { name: 'After expiry', exact: true }).click();
  await expect(dialog.locator('[data-shot=de-10] .de-clock')).toHaveAttribute('data-clock', 'model-entry');
  await expect(dialog.locator('[data-shot=de-10] .de-clock')).toHaveAttribute('data-tail', 'true');
  await dialog.locator('[data-shot=de-11]').getByRole('button', { name: 'Transition checks', exact: true }).click();
  await expect(dialog.locator('[data-shot=de-11] [data-grid-layer=cost]')).toHaveCount(1);
  expect(await page.evaluate(() => history.length)).toBe(entries);
  await page.keyboard.press('Escape');
  expect(await page.locator('#bankable').innerText()).toEqual(before);
});

test('German story URLs, refresh and language use the shared place handling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(DE + '?view=story&chapter=payment&shot=de-09');
  const dialog = page.locator('.ix-story-dialog');
  await expect(dialog.locator('#ix-shot-de-09')).toBeFocused();
  await dialog.getByRole('button', { name: 'Next →' }).click();
  await expect(page).toHaveURL(/shot=de-10$/);
  await page.goBack(); await expect(dialog.locator('#ix-shot-de-09')).toBeFocused();
  await page.goForward(); await expect(dialog.locator('#ix-shot-de-10')).toBeFocused();
  await page.reload(); await expect(page.locator('#ix-shot-de-10')).toBeFocused();
  await page.locator('.ix-story-dialog').getByRole('button', { name: 'Switch to Chinese' }).click();
  await expect(page).toHaveURL(/shot=de-10$/);
  await page.keyboard.press('Escape');
  await page.goto(DE + '?view=story&chapter=payment&shot=de-99');
  await expect(page.locator('#ix-shot-de-09')).toBeFocused();
});

test('German scenes fit four widths and the last chapter hands off to the case', async ({ page }, info) => {
  const { dialog } = await openGermany(page);
  for (const width of [390, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await dialog.locator('.ix-story-body').evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
  }
  await dialog.getByRole('button', { name: /The investment/ }).click();
  await dialog.locator('[data-shot=de-12]').getByRole('button', { name: 'Grid fees', exact: true }).click();
  await expect(dialog.locator('[data-shot=de-12] .ix-story-exits a[href=\"#execution\"]')).toHaveClass(/de-exit-focus/);
  await dialog.screenshot({ path: info.outputPath('germany-story-handoff.png') });
  await dialog.locator('[data-shot=de-12]').getByRole('button', { name: 'Back to the play', exact: true }).click();
  await expect(dialog.locator('#ix-shot-de-00')).toBeFocused();
  await dialog.locator('[data-shot=de-00]').getByRole('link', { name: 'Go to the investment case' }).click();
  await expect(page.locator('#bankable')).toBeFocused();
  await expect(dialog).toHaveCount(0);
});

test('Germany loads its story lazily and keeps the research button as the entry', async ({ page }) => {
  const chunks = []; page.on('request', r => { if (/story-de-.*\.js/.test(r.url())) chunks.push(r.url()); });
  await page.goto('/');
  expect(chunks).toEqual([]);
  await page.goto(DE);
  await expect(page.locator('.ix-full-research')).toBeVisible();
  expect(chunks).toEqual([]);
  await page.locator('.ix-full-research').click();
  await expect(page.locator('.ix-story-dialog')).toBeVisible();
  expect(chunks.length).toBe(1);
});

test('German full research remains one click deeper and returns focus', async ({ page }) => {
  const { trigger, dialog } = await openGermany(page);
  await dialog.getByRole('button', { name: 'Full research ↗' }).click();
  await expect(page.locator('.ix-research-dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});

/* ---- Finland: WP-09 reuse of the released story shell ------------------- */
const FI='/markets/finland';
const openFinland=async page=>{
  await page.goto(FI);
  const trigger=page.locator('.ix-full-research');
  await trigger.click();
  const dialog=page.locator('.ix-story-dialog');
  await expect(dialog).toBeVisible();
  return {trigger,dialog};
};

test('Finland reads the signed-off play in both languages and returns focus',async({page},info)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const {trigger,dialog}=await openFinland(page);
  await expect(dialog.locator('article.ix-shot')).toHaveCount(13);
  await expect(dialog.locator('.ix-marker')).toHaveCount(13);
  await expect(dialog.locator('article.ix-shot .k-scene')).toHaveCount(12);
  await expect(dialog.locator('.fi-opening-thumb')).toHaveCount(1);
  const opening=dialog.locator('[data-shot=fi-00]');
  await expect(opening.locator('.ix-story-play-title')).toContainText('2h');
  await expect(opening.locator('.ix-shot-copy')).toContainText('merchant exposure after expiry');
  await expect(dialog.locator('[data-shot=fi-08] .ix-shot-copy')).toContainText('uses 2 hours');
  await expect(dialog.locator('[data-shot=fi-11] .ix-shot-copy')).toContainText('revenue reverts to merchant exposure');
  await expect(dialog).not.toContainText('[object');
  await dialog.getByRole('button',{name:'Start the story',exact:true}).click();
  await expect(dialog.locator('#ix-shot-fi-01')).toBeFocused();
  await dialog.getByRole('button',{name:'Switch to Chinese'}).click();
  await expect(dialog.locator('[data-shot=fi-01] h4')).toHaveText('芬兰与谁共享电网频率？');
  await expect(dialog.locator('[data-shot=fi-08] .ix-shot-copy')).toContainText('采用2小时');
  await expect(dialog.locator('.fi-opening-thumb')).toHaveCount(1);
  await expect(dialog.locator('.ix-marker-fair').first()).toHaveText('证据尚可');
  await dialog.screenshot({path:info.outputPath('finland-story-zh.png')});
  await dialog.getByRole('button',{name:'切换到英文'}).click();
  await dialog.getByRole('button',{name:'Full research ↗'}).click();
  await expect(page.locator('.ix-research-dialog')).toBeVisible();
  await page.keyboard.press('Escape');await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});

test('Finland teaching controls preserve the case, URL and history',async({page})=>{
  await page.goto(FI+'?view=story&chapter=battery&shot=fi-08');
  const dialog=page.locator('.ix-story-dialog');
  await expect(dialog.locator('#ix-shot-fi-08')).toBeFocused();
  const before=await page.locator('#bankable').innerText();
  const duration=dialog.locator('[data-shot=fi-08]');
  const longer=duration.getByRole('button',{name:'Longer teaching battery',exact:true});
  await longer.focus();
  const url=page.url(),history=await page.evaluate(()=>window.history.length);
  await page.keyboard.press('Enter');
  await expect(duration.locator('[data-duration]')).toHaveAttribute('data-duration','4');
  await expect(longer).toHaveAttribute('aria-pressed','true');
  expect(page.url()).toBe(url);expect(await page.evaluate(()=>window.history.length)).toBe(history);
  await dialog.getByRole('button',{name:'Switch to Chinese'}).click();
  await expect(duration.getByRole('button',{name:'更长时长示例',exact:true})).toHaveAttribute('aria-pressed','true');
  await dialog.getByRole('button',{name:'切换到英文'}).click();
  const historyShot=dialog.locator('[data-shot=fi-03]');
  await historyShot.getByRole('button',{name:'Future plans',exact:true}).click();
  await expect(historyShot.locator('.ix-marker')).toHaveCount(1);
  await expect(historyShot.locator('.ix-marker')).toHaveClass(/ix-marker-thin/);
  await historyShot.getByRole('button',{name:'History',exact:true}).click();
  await expect(historyShot.locator('.ix-marker')).toHaveClass(/ix-marker-fair/);
  await page.keyboard.press('Escape');
  expect(await page.locator('#bankable').innerText()).toBe(before);
});

test('Finland need keeps storage definitions, source gaps and the crossing honest',async({page},info)=>{
  const {dialog}=await openFinland(page),shot=dialog.locator('[data-shot=fi-05]');
  await shot.getByRole('button',{name:'Current scale',exact:true}).click();
  await expect(shot.locator('[data-series=network-model-technical-capacity]')).toHaveCount(7);
  await expect(shot.locator('[data-crossing=left-censored]')).toHaveCount(1);
  await expect(shot.locator('[data-connected-observation]')).toHaveAttribute('data-precision','early-month');
  await expect(shot.locator('.ix-shot-copy')).toContainText('exact crossing date is unknown');
  await shot.getByRole('button',{name:'Show definitions',exact:true}).click();
  await expect(shot).toContainText('differs from the all-size connected estimate');
  await shot.screenshot({path:info.outputPath('finland-need-en.png')});
  await shot.getByRole('button',{name:'Procurement history',exact:true}).click();
  await expect(shot.locator('[data-crossing]')).toHaveCount(0);
  await expect(shot).toContainText('annual obligation is a different measure');
  await expect(shot.locator('[data-series=fcrN]')).toHaveCount(7);
});

test('Finland reserve auction prices stay separate from activation energy and captured revenue',async({page})=>{
  const {dialog}=await openFinland(page),prices=dialog.locator('[data-shot=fi-06]');
  await prices.getByText('Inspect capacity prices',{exact:true}).click();
  const product=prices.getByRole('combobox',{name:'Choose product'});
  for(const id of ['fi-fcr-n','fi-fcr-d-up','fi-fcr-d-down','fi-afrr-up','fi-afrr-down','fi-mfrr-up','fi-mfrr-down']){
    await product.selectOption(id);
    await expect(prices.locator('[data-series="'+id+'"]').first()).toBeVisible();
    await expect(prices).toContainText('EUR/MW/h');
    await expect(prices).toContainText('Europe/Helsinki');
    await expect(prices).toContainText('Auction observations, not captured earnings');
  }
  const payment=dialog.locator('[data-shot=fi-10]');
  await payment.getByRole('button',{name:'Capacity',exact:true}).click();
  await expect(payment.locator('[data-payment-path=capacity]')).toBeVisible();
  await expect(payment.locator('[data-payment-path=capacity]')).toContainText('EUR/MW/h');
  await payment.getByRole('button',{name:'Activation energy',exact:true}).click();
  await expect(payment.locator('[data-payment-path=energy]')).toBeVisible();
  await expect(payment.locator('[data-payment-path=energy]')).toContainText('EUR/MWh');
  await expect(payment.locator('[data-payment-path=capacity]')).toBeHidden();
  await expect(payment.locator('[data-payment-path=energy]')).toContainText('no separate energy-market fee shown');
});

test('Finland uses shared story URLs and retains its local teaching state on refresh',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(FI+'?view=story&chapter=battery&shot=fi-08');
  const dialog=page.locator('.ix-story-dialog');
  await expect(dialog.locator('#ix-shot-fi-08')).toBeFocused();
  await dialog.locator('[data-shot=fi-08]').getByRole('button',{name:'Longer teaching battery',exact:true}).click();
  await dialog.getByRole('button',{name:'Next →'}).click();
  await expect(page).toHaveURL(/shot=fi-09$/);
  await page.goBack();await expect(dialog.locator('#ix-shot-fi-08')).toBeFocused();
  await page.reload();await expect(page.locator('#ix-shot-fi-08')).toBeFocused();
  await expect(page.locator('[data-shot=fi-08] [data-duration]')).toHaveAttribute('data-duration','4');
  await page.goto(FI+'?view=story&chapter=payment&shot=fi-99');
  await expect(page.locator('#ix-shot-fi-10')).toBeFocused();
});

test('Finland fits four widths in English and Chinese with keyboard controls',async({page},info)=>{
  const {dialog}=await openFinland(page);
  for(const language of ['en','zh']){
    if(language==='zh')await dialog.getByRole('button',{name:'Switch to Chinese'}).click();
    for(const width of [390,768,1440,1920]){
      await page.setViewportSize({width,height:900});
      expect(await dialog.locator('.ix-story-body').evaluate(el=>el.scrollWidth-el.clientWidth)).toBeLessThanOrEqual(1);
    }
    await page.setViewportSize({width:390,height:844});
    await dialog.locator('[data-shot=fi-08]').scrollIntoViewIfNeeded();
    await dialog.screenshot({path:info.outputPath('finland-phone-'+language+'.png')});
  }
});

test('Finland evidence and investment exits reach the existing market sections',async({page})=>{
  const exits=[['fi-08','Open duration evidence','bankable'],['fi-11','Contract evidence','bankable'],['fi-12','Bankable case','bankable'],['fi-12','Revenue','revenue'],['fi-12','Execution','execution'],['fi-12','Downside','downside']];
  for(const [shot,label,anchor]of exits){
    const {dialog}=await openFinland(page);
    await dialog.locator('[data-shot='+shot+'] .ix-story-exits').getByRole('link',{name:label,exact:true}).click();
    await expect(dialog).toHaveCount(0);await expect(page.locator('#'+anchor)).toBeFocused();
  }
});

test('Finland story code loads only after its existing market-page button',async({page})=>{
  const chunks=[];page.on('request',r=>{if(/story-fi-.*\.js/.test(r.url()))chunks.push(r.url());});
  await page.goto('/');expect(chunks).toEqual([]);
  await page.goto(FI);await expect(page.locator('.ix-full-research')).toBeVisible();expect(chunks).toEqual([]);
  await page.locator('.ix-full-research').click();await expect(page.locator('.ix-story-dialog')).toBeVisible();
  expect(chunks.length).toBe(1);
});
