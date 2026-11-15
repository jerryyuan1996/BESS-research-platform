import { test, expect } from '@playwright/test';

const cases = [
  ['F1', 'poland', 'pl', 'infraFund'],
  ['S1', 'poland', 'pl', 'strategic'],
  ['S2', 'romania', 'ro', 'strategic'],
  ['F6', 'pjm', 'pjm', 'infraFund'],
  ['S5', 'pjm', 'pjm', 'strategic'],
  ['N6', 'pjm', 'pjm', 'foreignFirstTimer'],
];

for (const [code, slug, id, investor] of cases) {
  test(`${code} publishes the approved bounded Watch in both languages`, async ({ page }, info) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(lens => {
      localStorage.setItem('hub_lang', 'en');
      localStorage.setItem('hub_lens', lens);
    }, investor);
    await page.goto('/markets/' + slug);
    const trace = page.locator(`#decision .ix-decision-strip[data-market="${id}"][data-investor="${investor}"]`);
    for (const lang of ['en', 'zh']) {
      await expect(trace.locator('[data-strip-element="call"] [data-call="wait"]'))
        .toHaveText(lang === 'en' ? 'Watch' : '保持观察');
      await expect(trace.locator('.ix-call-qualifier')).toHaveCount(0);
      await expect(trace.locator('[data-strip-element="target"] strong')).toContainText('%');
      const action = page.locator('.ix-next-action');
      await expect(action).toContainText(lang === 'en'
        ? (id === 'pjm' ? '31 March' : '31 January')
        : (id === 'pjm' ? '3月31日' : '1月31日'));
      await expect(action).toContainText(lang === 'en' ? 'scoped Pass' : '放弃建议');
      if (id === 'pjm') {
        await expect(trace).toContainText(lang === 'en' ? 'actionable RBP participation path' : '可执行的RBP参与路径');
        await expect(trace).toContainText(lang === 'en' ? 'Proposed RBP results' : '拟议RBP结果');
      } else {
        await expect(trace.locator('time')).toHaveAttribute('datetime', '2026-11-30');
        await expect(trace).toContainText(lang === 'en' ? 'Analyst checkpoint' : '分析师复核');
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2)).toBe(false);
      await page.locator('#decision').screenshot({ path: info.outputPath(`${code}-${lang}.png`) });
      if (lang === 'en') await page.getByRole('button', { name: 'Switch to Chinese', exact: true }).click();
    }
    expect(errors).toEqual([]);
  });
}
