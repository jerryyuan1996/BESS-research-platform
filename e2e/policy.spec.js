import { test,expect } from '@playwright/test';
import { digest } from '../policy/integrity.mjs';
import { policyUIFixture,servePolicy } from '../tests/helpers/policy-ui-fixture.mjs';
test.beforeEach(async({page})=>{await page.addInitScript(()=>localStorage.setItem('hub_lang','en'));});
test('policy routes are lazy, expose honest empty coverage and preserve market sections',async({page})=>{
  const policyRequests=[];page.on('request',r=>{if(/policy-page|policy-map|\/data\/public\/policy\//.test(r.url()))policyRequests.push(r.url());});
  await page.goto('/');await expect(page.getByRole('heading',{name:'Capital priorities. Conditions first.'})).toBeVisible();expect(policyRequests).toEqual([]);
  await page.goto('/policy');await expect(page.getByRole('heading',{name:'Global Policy Radar'})).toBeVisible();await expect(page.getByText('No verified policy snapshot has been published.',{exact:false})).toBeVisible();await expect(page.locator('.policy-event')).toHaveCount(0);
  await page.goto('/markets/great-britain/policy');await expect(page.getByRole('heading',{name:'Great Britain · Policy'})).toBeVisible();
  await page.goto('/markets/great-britain/revenue');await expect(page.locator('.policy-page')).toHaveCount(0);await expect(page.locator('.dash-skeleton')).toHaveCount(0);
});
test('Radar filters, map and preview preserve context through dossier and Back',async({page},info)=>{
  await servePolicy(page);await page.goto('/policy');await expect(page.locator('.policy-event')).toHaveCount(8);
  await page.getByLabel('Jurisdiction',{exact:true}).selectOption('GB');await expect(page.locator('.policy-event')).toHaveCount(2);
  await page.locator('.policy-event button').first().click();await expect(page.getByRole('region',{name:'Policy preview'})).toBeVisible();await expect(page.getByText('Pending investment reassessment',{exact:true}).first()).toBeVisible();
  await page.getByRole('link',{name:'Open policy dossier'}).click();await expect(page.getByRole('heading',{name:'Synthetic Great Britain storage policy'})).toBeVisible();await expect(page.getByRole('heading',{name:'Instrument lifecycle'})).toBeVisible();await expect(page.locator('.policy-timeline li')).toHaveCount(2);
  await page.goBack();await expect(page.getByLabel('Jurisdiction',{exact:true})).toHaveValue('GB');await expect(page.getByRole('region',{name:'Policy preview'})).toBeVisible();
  await page.getByRole('button',{name:'Close preview'}).click();
  if(info.project.name==='mobile')await page.getByRole('button',{name:'Coverage map',exact:true}).click();
  await page.locator('.policy-jurisdictions button').filter({hasText:'Western Australia'}).click();
  if(info.project.name==='mobile')await page.getByRole('button',{name:'Event feed',exact:true}).click();
  await expect(page.getByLabel('Jurisdiction',{exact:true})).toHaveValue('AU-WA');await expect(page.locator('.policy-event')).toHaveCount(2);await page.reload();await expect(page.getByLabel('Jurisdiction',{exact:true})).toHaveValue('AU-WA');
});
test('Dossier versions and story depths share evidence, translate and retain safe SVG',async({page})=>{
  const data=await servePolicy(page);await page.goto('/policy/dossiers/gb-test-instrument');await expect(page.getByRole('heading',{name:'Immutable history and corrections'})).toBeVisible();await expect(page.getByText('changed records; prior versions remain available.',{exact:false})).toBeVisible();
  await page.getByRole('link',{name:data.index.versions[0].slice(0,12),exact:true}).click();await expect(page.getByText('GB · SYN-gb · Consultation',{exact:false})).toBeVisible();await page.goBack();
  await page.getByRole('link',{name:'Synthetic Great Britain policy story'}).click();await expect(page.getByRole('heading',{name:'From consultation to adoption'})).toBeVisible();expect(await page.locator('.policy-scene svg').count()).toBe(3);expect(await page.locator('.policy-scene svg *').count()).toBeLessThan(100);
  await page.getByRole('link',{name:'Evidence explorer',exact:true}).click();await expect(page.getByRole('heading',{name:'One canonical evidence graph'})).toBeVisible();await expect(page.locator('.policy-evidence')).toHaveCount(4);await expect(page.locator('.policy-evidence a').first()).toHaveAttribute('href',/^https:\/\/official\.example\//);
  await page.getByRole('button',{name:'Switch to Chinese'}).click();await expect(page.getByRole('heading',{name:'同一份规范证据图谱'})).toBeVisible();await expect(page.getByText('政策解读独立于已批准投资论点。')).toBeVisible();
});
test('comparison keeps NEM and WA separate and declines incompatible quantitative returns',async({page})=>{
  await servePolicy(page);await page.goto('/policy/compare');await expect(page.getByRole('heading',{name:'Compare mechanisms, keep the basis visible'})).toBeVisible();await expect(page.getByRole('columnheader',{name:/National Electricity Market/})).toBeVisible();await expect(page.getByRole('columnheader',{name:'Western Australia'})).toBeVisible();await expect(page.getByText('Not comparable',{exact:false}).first()).toBeVisible();
  await page.goto('/markets/nem/policy');await expect(page.locator('.policy-event')).toHaveCount(2);await expect(page.locator('.policy-feed')).not.toContainText('Synthetic WEM');
});

test('material review appears outside the approved market content without loading policy maps',async({page})=>{
  const requests=[];page.on('request',r=>{if(/policy-page|policy-map/.test(r.url()))requests.push(r.url());});
  await servePolicy(page);await page.goto('/markets/great-britain/revenue');
  const notice=page.locator('[data-policy-review-notice]');await expect(notice).toBeVisible();await expect(notice.getByRole('link',{name:'Inspect the policy evidence'})).toHaveAttribute('href',/^\/policy\/dossiers\/gb-test-instrument\?version=[a-f0-9]{64}$/);
  await expect(page.locator('.policy-page')).toHaveCount(0);expect(requests).toEqual([]);
});
test('unsafe scenes, false citations and changed snapshot bytes fail closed',async({page})=>{
  const data=policyUIFixture();data.snapshot.stories[0].chapters[0].scene.onclick='window.__policyInjected=true';const hash=digest(data.snapshot);data.index.head=hash;data.index.versions.push(hash);data.versions.set(hash,data.snapshot);await servePolicy(page,data);
  await page.goto('/policy');await expect(page.getByRole('heading',{name:'Verified policy evidence is unavailable'})).toBeVisible();expect(await page.evaluate(()=>window.__policyInjected)).toBeUndefined();
});
test('source text is rendered as text and keyboard controls remain usable without overflow',async({page})=>{
  const data=policyUIFixture();data.snapshot.claims[0].text=['<img src=x onerror=alert(1)>','<img src=x onerror=alert(1)>'];const hash=digest(data.snapshot);data.index.head=hash;data.index.versions.push(hash);data.versions.set(hash,data.snapshot);await servePolicy(page,data);
  await page.goto('/policy/dossiers/de-test-instrument');await expect(page.getByText('<img src=x onerror=alert(1)>',{exact:true})).toBeVisible();await expect(page.locator('.policy-page img')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);await page.keyboard.press('Tab');expect(await page.evaluate(()=>document.activeElement.tagName)).not.toBe('BODY');
});
