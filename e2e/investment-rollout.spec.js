import {test,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
const screenshots='.tmp/all-market-investor-rollout/screenshots';
test.beforeEach(async({page})=>{
  await page.route(/^https:\/\//,r=>r.abort());
  await page.addInitScript(()=>{localStorage.setItem('hub_lang','en');localStorage.setItem('hub_lens','infraFund');});
});

for(const [slug,first,second,dscr] of [['poland','pl-grant-4h','pl-cap-4h','1.20×'],['germany','de-toll-4h','de-mer-4h','2.00×'],['great-britain','gb-toll-4h','gb-cap-4h','1.20×']]){
  test(slug+' selection updates its own returns and financing across language, reload and history',async({page},info)=>{
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('/markets/'+slug);
    const irr=await page.locator('#decision .ix-metric strong').first().innerText();
    const debt=await page.locator('#bankable .ic-debt-table').innerText();
    const cash=await page.locator('#revenue').innerText();
    await expect(page.locator(`.ic-play-option[data-play=${first}]`)).toHaveAttribute('aria-pressed','true');
    const next=page.locator(`.ic-play-option[data-play=${second}]`);await next.focus();await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp('play='+second));await expect(next).toHaveAttribute('aria-pressed','true');
    await expect(page.locator('#bankable .ic-debt-table')).toContainText(dscr);
    expect(await page.locator('#decision .ix-metric strong').first().innerText()).not.toBe(irr);
    expect(await page.locator('#bankable .ic-debt-table').innerText()).not.toBe(debt);
    expect(await page.locator('#revenue').innerText()).not.toBe(cash);
    if(slug==='germany'){
      await expect(page.locator('#bankable [data-debt-stream=toll]')).toHaveCount(0);
      await expect(next).toContainText('Reference alternative');
      await expect(page.locator('#decision')).toContainText('36 months');
    }
    await page.locator('.ix-language').click();await expect(next).toHaveAttribute('aria-pressed','true');
    await page.reload();await expect(next).toHaveAttribute('aria-pressed','true');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
    await mkdir(screenshots,{recursive:true});await page.locator('#bankable').screenshot({path:`${screenshots}/${info.project.name}-${slug}-financing.png`});
    await page.goBack();await expect(page.locator(`.ic-play-option[data-play=${first}]`)).toHaveAttribute('aria-pressed','true');
    expect(errors).toEqual([]);
  });
}

test('US supply and tax cases reprice debt and returns without changing the revenue play',async({page},info)=>{
  for(const slug of ['pjm','ercot','caiso']){
    await page.goto('/markets/'+slug);
    const initial=await page.locator('#bankable .ic-bankable-kpis').innerText();
    await page.locator('.ic-play-option[data-supply=chinese]').click();
    await expect(page).toHaveURL(/supply=chinese/);
    await expect(page.locator('#bankable')).toContainText('Chinese DC block · no credit');
    expect(await page.locator('#bankable .ic-bankable-kpis').innerText()).not.toBe(initial);
    await expect(page.locator('#bankable .ic-debt-table')).toContainText('2.00×');
    await page.reload();await expect(page.locator('.ic-play-option[data-supply=chinese]')).toHaveAttribute('aria-pressed','true');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
  }
  await mkdir(screenshots,{recursive:true});await page.locator('#bankable').screenshot({path:`${screenshots}/${info.project.name}-us-supply-financing.png`});
});
