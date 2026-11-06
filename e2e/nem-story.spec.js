import { test, expect } from '@playwright/test';
import { story } from '../src/markets/nem/story.js';
const MARKET = '/markets/nem', PREVIEW = MARKET + '?story=preview';
const q = id => [story.opening, ...story.chapters.flatMap(c => c.shots)].find(s => s.id === id).question;

async function open(page, url = PREVIEW) {
  await page.goto(url);
  const trigger = page.locator('.ix-full-research');
  await trigger.scrollIntoViewIfNeeded(); await trigger.click();
  const dialog = page.locator('.ix-story-dialog'); await expect(dialog).toBeVisible();
  return { trigger, dialog };
}

test('NEM opens publicly after G-2 and fetches no story bytes before the research button is pressed', async ({ page }) => {
  const loaded = []; page.on('request', r => { if (/story-nem-|storyEvidenceProvenance-/.test(r.url())) loaded.push(r.url()); });
  await page.goto('/'); await page.goto(MARKET);
  await expect(page.locator('.ix-full-research')).toBeVisible();
  expect(loaded).toEqual([]);
  await page.locator('.ix-full-research').click();
  await expect(page.locator('.ix-story-dialog')).toBeVisible();
  expect(loaded.some(u => /story-nem-/.test(u))).toBe(true);
});

test('NEM preview reads thirteen bilingual shots, one marker each, with the observed AEMO layers and no console errors', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/_vercel\/insights/.test(m.location().url)) errors.push(m.text()); }); // Vercel's analytics script exists only in production
  const loaded = []; page.on('request', r => { if (/story-nem-/.test(r.url())) loaded.push(r.url()); });
  const { trigger, dialog } = await open(page);
  expect(loaded.length).toBeGreaterThan(0);
  await expect(dialog.locator('article.ix-shot')).toHaveCount(13);
  await expect(dialog.locator('.ix-marker')).toHaveCount(13);
  await expect(dialog.locator('.ix-story-play')).toContainText('7.4%');
  await expect(dialog.locator('[data-chart=Chart-NEM-SPREAD]')).toHaveAttribute('data-mode', 'observed');
  await expect(dialog.locator('[data-chart=Chart-NEM-DAY]')).toHaveAttribute('data-mode', 'observed');
  await expect(dialog.locator('[data-shot=nem-06] [data-kind=observed]')).toHaveCount(10);
  await expect(dialog.locator('[data-shot=nem-06] .ix-shot-copy')).toContainText('fell from $339/MWh to $59/MWh');
  await expect(dialog.locator('[data-shot=nem-07] .ix-shot-copy')).toContainText('narrowest at $51/MWh');
  await expect(dialog.locator('[data-shot=nem-00] .ix-shot-copy')).not.toContainText('..');
  await expect(dialog.locator('[data-shot=nem-11] .ix-shot-copy')).toContainText('none of the 15 NEM battery agreements');
  expect(await dialog.evaluate(el => /\bnull\b|undefined|NaN/.test(el.innerText))).toBe(false);
  await expect(dialog.locator('[data-shot=nem-08] tr[data-route=ltda]')).toBeVisible();
  await dialog.getByRole('button', { name: 'Start the story', exact: true }).click();
  await expect(dialog.locator('#ix-shot-nem-01')).toBeFocused();
  await dialog.getByRole('button', { name: 'Switch to Chinese' }).click();
  await expect(dialog.locator('#ix-shot-nem-01')).toHaveText(q('nem-01')[1]);
  await expect(dialog.locator('[data-shot=nem-11] .ix-shot-copy')).toContainText('15份NEM电池协议中，尚无一份已投运');
  await expect(dialog.locator('.ix-marker')).toHaveCount(13);
  await page.keyboard.press('Escape'); await expect(dialog).toHaveCount(0); await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});

test('NEM chapter links, Back, refresh and a language switch keep the reader’s place', async ({ page }) => {
  const { dialog } = await open(page);
  await dialog.locator('nav.ix-story-nav button[data-chapter=tensions]').click();
  await expect(dialog.locator('#ix-shot-nem-05')).toBeFocused();
  await expect(page).toHaveURL(/shot=nem-05/);
  await dialog.locator('nav.ix-story-nav button[data-chapter=investment]').click();
  await expect(page).toHaveURL(/shot=nem-11/);
  await page.goBack(); await expect(page).toHaveURL(/shot=nem-05/);
  await page.reload();
  await expect(page.locator('.ix-story-dialog #ix-shot-nem-05')).toBeFocused();
  await page.locator('.ix-story-dialog').getByRole('button', { name: 'Switch to Chinese' }).click();
  await expect(page).toHaveURL(/shot=nem-05/);
  await expect(page.locator('.ix-story-dialog [data-shot=nem-05] h4')).toHaveText(q('nem-05')[1]);
});

test('NEM teaching controls work by keyboard and leave the case, address and history unchanged', async ({ page }) => {
  await page.goto(PREVIEW + '&view=story&chapter=tensions&shot=nem-06');
  const dialog = page.locator('.ix-story-dialog'); await expect(dialog.locator('#ix-shot-nem-06')).toBeFocused();
  const before = await page.locator('#bankable').innerText(), url = page.url(), history = await page.evaluate(() => window.history.length);
  const wa = dialog.locator('[data-shot=nem-06]').getByRole('button', { name: 'WA beside it', exact: true });
  await wa.focus(); await page.keyboard.press('Enter');
  await expect(wa).toHaveAttribute('aria-pressed', 'true');
  await expect(dialog.locator('[data-shot=nem-06] [data-kind=wem]')).toHaveCount(2);
  await page.keyboard.press('Space');
  await expect(dialog.locator('[data-shot=nem-06] [data-kind=wem]')).toHaveCount(0);
  expect(await page.locator('#bankable').innerText()).toBe(before);
  expect(page.url()).toBe(url);
  expect(await page.evaluate(() => window.history.length)).toBe(history);
  await page.goto(PREVIEW + '&view=story&chapter=battery&shot=nem-08');
  await expect(dialog.locator('#ix-shot-nem-08')).toBeFocused();
  const url8 = page.url(), history8 = await page.evaluate(() => window.history.length);
  const eight = dialog.locator('[data-shot=nem-08]').getByRole('button', { name: '8h', exact: true });
  await eight.click(); await expect(eight).toHaveAttribute('aria-pressed', 'true');
  await expect(dialog.locator('[data-shot=nem-08]')).toContainText('800 MWh');
  expect(page.url()).toBe(url8);
  expect(await page.evaluate(() => window.history.length)).toBe(history8);
  await expect(dialog.locator('.ix-story-play-title')).toContainText('4h');
});

test('NEM loads per-value locators only when a source disclosure opens', async ({ page }) => {
  const requests = []; page.on('request', r => requests.push(r.url()));
  const { dialog } = await open(page);
  expect(requests.some(u => /storyEvidenceProvenance-/.test(u))).toBe(false);
  const shot = dialog.locator('[data-shot=nem-04]');
  await shot.locator('.ix-story-sources summary').click();
  await expect(shot.locator('.nem-provenance')).toBeVisible();
  expect(requests.some(u => /storyEvidenceProvenance-/.test(u))).toBe(true);
});

test('NEM falls back to research for another lens', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('hub_lens', 'strategic'));
  await page.goto(PREVIEW); await page.locator('.ix-full-research').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.ix-story-dialog')).toHaveCount(0);
});

test('NEM fits phone to desktop widths in both languages with no sideways scroll', async ({ page }) => {
  const { dialog } = await open(page);
  for (const lang of ['en', 'zh']) {
    if (lang === 'zh') await dialog.getByRole('button', { name: 'Switch to Chinese' }).click();
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth + 2)).toBe(true);
    }
  }
});
