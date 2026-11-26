import { test, expect } from '@playwright/test';

for (const language of ['en', 'zh']) {
  test('the NEM catalogue and tariff replay separate observed charges from the signed seed (' + language + ')', async ({ page }) => {
    const chinese = language === 'zh';
    await page.addInitScript(value => localStorage.setItem('hub_lang', value), language);
    await page.route('**/data/public/nem-qld1-prices.summary.json', route => route.fulfill({ json: {
      schemaVersion:1, datasetId:'nem-qld1-prices', marketId:'nem', fetchedAt:'2026-11-26T05:00:00Z',
      refreshHours:24, staleAfterHours:96, units:{price:'AUD/MWh'},
      coverage:{from:'2026-10-01T00:00:00Z',to:'2026-11-01T00:00:00Z',resolution:'PT5M',points:8928},
      dispatch:{completeDays:31,underReviewAtIssue:4}, derived:null, daily:[],
      storageTariffs:{energex:{status:'observed-prices',days:31,from:'2026-10-01',to:'2026-10-31',
        merchantPerMWYear:52000,variableNetworkPerMWYear:-300,fixedPerMWYear:6000,
        demandPerMWYearAtUnity:0,needsPowerFactor:false,billing:'none'}},
    } }));
    await page.goto('/data');
    await expect(page.locator('tr .obs-tag').filter({hasText:/^nem-(nsw1|qld1|vic1|sa1|tas1)-prices$/})).toHaveCount(5);
    const queensland = page.locator('tr').filter({has:page.locator('.obs-tag',{hasText:'nem-qld1-prices'})});
    await expect(queensland).toContainText(chinese ? '4 条地区电价' : '4 regional prices');
    await page.goto('/investment-lab?opportunity=nem-sub5');
    await page.locator('.lab-ctl').first().getByRole('button',{name:/NEM/}).click();
    await page.locator('.acq-special-workbench > summary').click();
    const replay = page.getByRole('region', { name:chinese ? '澳洲配网费率回算' : 'NEM network tariff replay' });
    await replay.getByRole('combobox').selectOption('energex');
    await expect(replay.getByRole('row',{name:chinese ? /配网净额/ : /Net network value/})).toContainText('-6,300');
    await expect(replay.locator('.ix-basis-note')).toContainText('0 AUD/MW/');
    await expect(replay.getByRole('link')).toHaveAttribute('href',/energex.com.au/);
  });
}
