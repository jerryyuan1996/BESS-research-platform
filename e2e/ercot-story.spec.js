import {openLegacyStory} from './helpers/legacy-story.js';
import { test, expect } from '@playwright/test';
import { story } from '../src/markets/ercot/story.js';
import { opportunities, returnPct } from '../src/experience/model.js';
const MARKET = '/markets/ercot', PREVIEW = MARKET + '?story=preview';
const q = id => [story.opening, ...story.chapters.flatMap(c => c.shots)].find(s => s.id === id).question;
const row = opportunities('infraFund').find(r => r.id === 'ercot');

async function open(page, url = MARKET) {
  await page.goto(url);
  const trigger = page.locator('.public-story-trigger');
  await trigger.scrollIntoViewIfNeeded(); await openLegacyStory(page);
  const dialog = page.locator('.ix-story-dialog'); await expect(dialog).toBeVisible();
  return { trigger, dialog };
}

test('ERCOT is released and loads story bytes only after the research button opens it', async ({ page }) => {
  const loaded = []; page.on('request', r => { if (/story-ercot-/.test(r.url())) loaded.push(r.url()); });
  await page.goto(MARKET);
  expect(loaded).toEqual([]);
  const trigger = page.locator('.public-story-trigger');
  await trigger.scrollIntoViewIfNeeded(); await openLegacyStory(page);
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.ix-story-dialog')).toBeVisible();
  expect(loaded.length).toBeGreaterThan(0);
});

test('ERCOT reads thirteen bilingual shots, one marker each, with the Example chart and no console errors', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/_vercel\/insights/.test(m.location().url)) errors.push(m.text()); }); // Vercel's analytics script exists only in production
  const loaded = []; page.on('request', r => { if (/story-ercot-/.test(r.url())) loaded.push(r.url()); });
  const { trigger, dialog } = await open(page);
  expect(loaded.length).toBeGreaterThan(0);
  await expect(dialog.locator('article.ix-shot')).toHaveCount(13);
  await expect(dialog.locator('.ix-marker')).toHaveCount(13);
  await expect(dialog.locator('.ix-story-play')).toContainText(returnPct(row.investment.holdIRR));
  await expect(dialog.locator('.ercot-opening svg')).toBeVisible();
  for (const shot of ['ercot-05', 'ercot-06']) await expect(dialog.locator(`[data-shot=${shot}] [data-chart=Chart-ERCOT-AS]`)).toHaveAttribute('data-mode', 'example');
  expect(await dialog.locator('[data-chart=Chart-ERCOT-AS] svg text').evaluateAll(n => n.some(t => /\d/.test(t.textContent)))).toBe(false);
  await expect(dialog.locator('[data-shot=ercot-01] [data-kind=dc-tie]')).toHaveCount(4);
  await expect(dialog.locator('[data-shot=ercot-01] .ix-shot-copy')).toContainText('1,220 MW in all');
  await expect(dialog.locator('[data-shot=ercot-11] .ix-shot-copy')).toContainText(`its all-equity return is ${returnPct(row.investment.holdIRR)}`);
  await expect(dialog.locator('[data-shot=ercot-11]')).toContainText('Contract price unverified');
  await expect(dialog.locator('[data-shot=ercot-12]')).toContainText(row.decision.event.label[0]);
  await expect(dialog.locator('[data-shot=ercot-00] .ix-shot-copy')).not.toContainText('..');
  expect(await dialog.evaluate(el => /\bnull\b|undefined|NaN/.test(el.innerText))).toBe(false);
  await dialog.getByRole('button', { name: 'Start the story', exact: true }).click();
  await expect(dialog.locator('#ix-shot-ercot-01')).toBeFocused();
  await dialog.getByRole('button', { name: 'Switch to Chinese' }).click();
  await expect(dialog.locator('#ix-shot-ercot-01')).toHaveText(q('ercot-01')[1]);
  await expect(dialog.locator('[data-shot=ercot-11]')).toContainText('合同价格未核验');
  await expect(dialog.locator('.ix-marker')).toHaveCount(13);
  await page.keyboard.press('Escape'); await expect(dialog).toHaveCount(0); await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});

test('ERCOT chapter links, Back, refresh and a language switch keep the reader’s place', async ({ page }) => {
  const { dialog } = await open(page);
  await dialog.locator('nav.ix-story-nav button[data-chapter=tensions]').click();
  await expect(dialog.locator('#ix-shot-ercot-05')).toBeFocused();
  await expect(page).toHaveURL(/shot=ercot-05/);
  await dialog.locator('nav.ix-story-nav button[data-chapter=payment]').click();
  await expect(page).toHaveURL(/shot=ercot-10/);
  await page.goBack(); await expect(page).toHaveURL(/shot=ercot-05/);
  await page.reload();
  await expect(page.locator('.ix-story-dialog #ix-shot-ercot-05')).toBeFocused();
  await page.locator('.ix-story-dialog').getByRole('button', { name: 'Switch to Chinese' }).click();
  await expect(page).toHaveURL(/shot=ercot-05/);
  await expect(page.locator('.ix-story-dialog [data-shot=ercot-05] h4')).toHaveText(q('ercot-05')[1]);
});

test('ERCOT teaching controls work by keyboard and leave the case, address and history unchanged', async ({ page }) => {
  await page.goto(PREVIEW + '&view=story&chapter=tensions&shot=ercot-06');
  const dialog = page.locator('.ix-story-dialog'); await expect(dialog.locator('#ix-shot-ercot-06')).toBeFocused();
  const before = await page.locator('#bankable').innerText(), url = page.url(), history = await page.evaluate(() => window.history.length);
  const shot = dialog.locator('[data-shot=ercot-06]');
  const ecrs = shot.getByRole('button', { name: 'ECRS', exact: true });
  await ecrs.focus(); await page.keyboard.press('Enter');
  await expect(ecrs).toHaveAttribute('aria-pressed', 'true');
  await expect(shot.locator('[data-chart=Chart-ERCOT-AS]')).toHaveAttribute('data-product', '1');
  const measured = shot.getByRole('button', { name: 'How measured', exact: true });
  await measured.focus(); await page.keyboard.press('Space');
  await expect(shot.locator('.ercot-measured')).toContainText('per MW held ready, per hour');
  expect(await page.locator('#bankable').innerText()).toBe(before);
  expect(page.url()).toBe(url);
  expect(await page.evaluate(() => window.history.length)).toBe(history);
  await page.goto(PREVIEW + '&view=story&chapter=battery&shot=ercot-08');
  await expect(dialog.locator('#ix-shot-ercot-08')).toBeFocused();
  const eight = dialog.locator('[data-shot=ercot-08]');
  await eight.getByRole('button', { name: 'Hold a reserve', exact: true }).click();
  await eight.getByRole('button', { name: 'Non-spinning reserve', exact: true }).click();
  await expect(eight.locator('[data-kind=beyond]')).toHaveCount(1);
  await eight.getByRole('button', { name: 'Reset example', exact: true }).click();
  await expect(eight.getByRole('button', { name: 'Move energy', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(dialog.locator('.ix-story-play-title')).toContainText('2h');
});

test('ERCOT loads per-value locators only when a source disclosure opens', async ({ page }) => {
  const requests = []; page.on('request', r => requests.push(r.url()));
  const { dialog } = await open(page);
  expect(requests.some(u => /\/evidence-[^/]+\.js$/.test(u))).toBe(false);
  const shot = dialog.locator('[data-shot=ercot-01]');
  await shot.locator('.ix-story-sources summary').click();
  await expect(shot.locator('.ercot-provenance')).toContainText('§II.H');
  expect(requests.some(u => /\/evidence-[^/]+\.js$/.test(u))).toBe(true);
});

test('ERCOT source locators retry a failed import without an unhandled error', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  let attempts = 0;
  await page.route(/\/evidence-[^/]+\.js$/, route => ++attempts === 1
    ? route.abort('failed') : route.continue());
  const { dialog } = await open(page);
  const sources = dialog.locator('[data-shot=ercot-01] .ix-story-sources');
  await sources.locator('summary').click();
  await expect.poll(() => attempts).toBe(1);
  await expect(sources.locator('a').first()).toBeVisible();
  await sources.locator('summary').click();
  await sources.locator('summary').click();
  await expect(sources.locator('.ercot-provenance')).toContainText('§II.H');
  expect(attempts).toBe(2);
  expect(errors).toEqual([]);
});

test('ERCOT concurrent disclosures attach only their own shot records', async ({ page }) => {
  let release, requested;
  const held = new Promise(resolve => { release = resolve; });
  await page.route(/\/evidence-[^/]+\.js$/, async route => {
    requested = route.request().url(); await held; await route.continue();
  });
  const { dialog } = await open(page);
  const first = dialog.locator('[data-shot=ercot-01] .ix-story-sources');
  const third = dialog.locator('[data-shot=ercot-03] .ix-story-sources');
  await first.locator('summary').click();
  await expect.poll(() => Boolean(requested)).toBe(true);
  await third.locator('summary').click();
  release();
  await expect(first.locator('.ercot-provenance')).toContainText('§II.H');
  await expect(third.locator('.ercot-provenance')).toContainText('47');
  await expect(third.locator('.ercot-provenance')).not.toContainText('§II.H');
  await expect(first.locator('.ercot-provenance')).toHaveCount(1);
  await expect(third.locator('.ercot-provenance')).toHaveCount(1);
});

for (const action of ['language', 'close']) test(`ERCOT ignores pending source content after ${action} disposes its node`, async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  let release, requested;
  const held = new Promise(resolve => { release = resolve; });
  await page.route(/\/evidence-[^/]+\.js$/, async route => {
    requested = route.request().url(); await held; await route.continue();
  });
  const { dialog, trigger } = await open(page);
  const sources = dialog.locator('[data-shot=ercot-01] .ix-story-sources');
  const old = await sources.elementHandle();
  await sources.locator('summary').click();
  await expect.poll(() => Boolean(requested)).toBe(true);
  if (action === 'language') await dialog.getByRole('button', { name: 'Switch to Chinese' }).click();
  else { await page.keyboard.press('Escape'); await expect(trigger).toBeFocused(); }
  release();
  await page.evaluate(async url => { await import(url); }, requested);
  expect(await old.evaluate(el => el.querySelector('.ercot-provenance'))).toBe(null);
  if (action === 'close') await openLegacyStory(page);
  const fresh = page.locator('.ix-story-dialog [data-shot=ercot-01] .ix-story-sources');
  await fresh.locator('summary').click();
  await expect(fresh.locator('.ercot-provenance')).toContainText(action === 'language' ? '逐值出处与计算' : 'Value locators and arithmetic');
  await expect(fresh.locator('.ercot-provenance')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('ERCOT falls back to research for another lens', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('hub_lens', 'strategic'));
  await page.goto(PREVIEW); await openLegacyStory(page);
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.ix-story-dialog')).toHaveCount(0);
});

test('ERCOT fits phone to desktop widths in both languages with no sideways scroll', async ({ page }) => {
  const { dialog } = await open(page);
  for (const lang of ['en', 'zh']) {
    if (lang === 'zh') await dialog.getByRole('button', { name: 'Switch to Chinese' }).click();
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth + 2)).toBe(true);
    }
  }
});
