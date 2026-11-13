import {expect} from '@playwright/test';
import {countryForMarket} from '../../src/experience/story/public/overviewModel.js';
import {ELECTRICITY_OVERVIEW as DATA} from '../../src/experience/story/public/data/electricity2024.js';
const number=v=>new Intl.NumberFormat('en-GB',{maximumFractionDigits:1}).format(v);

export async function expectInvestorLayout(page,id,locale){
  const decision=page.locator('#decision');await expect(decision).toHaveCount(1);
  await expect(decision.locator('.ic-case-identity')).toBeVisible();
  await expect(decision.locator('.ix-decision-reasons')).toHaveCount(0);
  await expect(decision).not.toContainText(locale==='en'?'Declared downside':'既定下行');
  await expect(decision).not.toContainText(locale==='en'?'Project-rights price ceiling':'项目权利对价上限');
  await expect(page.locator('#route-options')).toHaveCount(0);
  if(id==='sa'){
    await expect(decision.locator('.ix-metric')).toHaveCount(0);
    await expect(page.locator('#bankable .ic-bankable-case')).toHaveCount(0);
  }else{
    const bankable=page.locator('#bankable .ic-bankable-case');await expect(bankable).toBeVisible();
    await expect(bankable.locator('details')).toHaveCount(0);
    await expect(bankable.locator('.ic-debt-table')).toBeVisible();
    await expect(bankable.locator('.ic-bankable-kpis .ix-metric')).toHaveCount(4);
    await expect(bankable).not.toContainText(/NaN|undefined|Unknown|未知/);
    const debt=await bankable.locator('.ic-debt-table tbody tr').count();expect(debt).toBeGreaterThanOrEqual(1);
    expect(await bankable.locator('.ic-debt-table th,.ic-debt-table td').evaluateAll(cells=>cells.every(c=>c.scrollWidth<=c.clientWidth+1))).toBe(true);
    await expect(bankable.locator('.ic-debt-table tfoot')).toContainText('%');
    if(id.startsWith('jp_')){
      await expect(decision).toContainText('LTDA');await expect(decision).not.toContainText('MACSE');
      await expect(decision.locator('.ic-case-size strong')).toContainText('9');
      await expect(bankable).toContainText('2.45% → 2.20% → 2.00%');
    }
    if(id==='nem')await expect(decision).toContainText('CIS');
    if(id==='fi')await expect(decision).toContainText(locale==='en'?'floor':'保底');
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2)).toBe(false);
}

export async function expectCountryOverview(page,id,locale,{restricted=false}={}){
  const dialog=page.locator('.public-story-dialog'),country=countryForMarket(id);
  expect(await dialog.locator('.public-story-nav button').evaluateAll(nodes=>nodes.map(n=>n.dataset.chapter))).toEqual(
    restricted?['history','overview','research']:['history','overview','system','mechanism','storage','research']);
  await dialog.locator('.public-story-nav [data-chapter=overview]').click();
  const overview=dialog.locator('.power-overview');await expect(overview).toHaveAttribute('data-country',country.id);
  await expect(overview.locator('.po-kpis')).toContainText(number(id==='it'?DATA.italy.demand:country.demand.total));
  await expect(overview.locator('.po-country-row.is-active')).toHaveAttribute('data-country',country.id);
  const source=overview.locator('.po-section-head .source-popup-trigger').first();await source.click();
  const popup=page.locator('.source-popup');await expect(popup).toBeVisible();
  await expect(popup.locator('a').first()).toHaveAttribute('href',/^https:/);
  await page.keyboard.press('Escape');await expect(popup).toHaveCount(0);await expect(dialog).toBeVisible();await expect(source).toBeFocused();
  await overview.locator('[data-metric=battery]').click();
  if(id==='sa')await overview.locator('[data-unit=gwh]').click();
  if(['wa','nem'].includes(id))await expect(overview.locator('.po-battery-row.is-active')).toHaveAttribute('data-battery-country',id==='wa'?'au-wem':'au-nem');
  if(!['fi','pl'].includes(id))expect(await overview.locator('.po-battery-row.is-active').count()).toBeGreaterThan(0);
  const body=dialog.locator('.public-story-body');expect(await body.evaluate(el=>el.scrollWidth>el.clientWidth+1)).toBe(false);
  if(id!=='it')await expect(overview).not.toContainText(/Terna|MACSE/);
  await dialog.locator('.public-story-nav [data-chapter=history]').click();
}
