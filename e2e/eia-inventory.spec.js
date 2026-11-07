import {test,expect} from '@playwright/test';

const PATH='/data/public/us-eia-storage-projects.json';
const isInventory=response=>new URL(response.url()).pathname===PATH&&response.request().method()==='GET';
const markerIds=page=>page.locator('.geo-project-layer [data-project-ids]').evaluateAll(nodes=>nodes.flatMap(n=>n.dataset.projectIds.split(' ')).sort());

for(const market of ['pjm','ercot','caiso'])for(const lang of ['en','zh'])test(`${market} ${lang}: monthly quantities and annual denominator reach the same map and table`,async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/');
    await page.evaluate(value=>localStorage.setItem('hub_lang',value),lang);
    const ready=page.waitForResponse(isInventory);
    await page.goto(`/markets/${market}/grid`);
    const response=await ready;expect(response.ok()).toBe(true);const data=await response.json();
    const projects=data.series.filter(p=>p.marketId===market),located=projects.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon));
    const panel=page.locator(`.eia-inventory[data-market="${market}"]`);
    await expect(panel).toHaveAttribute('data-project-count',String(projects.length));
    await expect(panel).toHaveAttribute('data-located-count',String(located.length));
    await expect(panel).toHaveAttribute('data-content-checksum',data.contentChecksum);
    await expect(panel.locator('h4')).toHaveText(lang==='en'?'Battery generator inventory — EIA':'电池机组清单 — EIA');
    await expect(panel).toContainText(data.derived.inventory.sources.monthly.period);
    await expect(panel).toContainText(String(data.derived.inventory.sources.annual.reportingYear));
    await expect(panel.locator('.eia-attribution')).toContainText('U.S. Energy Information Administration');
    await page.locator('.geo-period-group button[data-period="current"]').click();
    await expect.poll(()=>markerIds(page)).toEqual(located.map(p=>p.id).sort());
    for(const title of await page.locator('.geo-project.cluster title').allTextContents())expect(title).toContain(lang==='en'?'generator units':'台机组');
    const toggle=page.locator('.geo-layer-toggle.project input');
    await toggle.uncheck();await expect(page.locator('.geo-project-layer [data-project-ids]')).toHaveCount(0);
    await toggle.check();await expect.poll(()=>markerIds(page)).toEqual(located.map(p=>p.id).sort());
    await panel.locator('.eia-project-details > summary').click();
    await expect(panel.locator('tbody tr')).toHaveCount(projects.length);
    const sample=projects.find(p=>p.storageEvidence.durationHours!=null&&Math.abs(p.capacityMW-p.storageEvidence.maximumDischargeMW)>1e-8);
    expect(sample).toBeTruthy();
    const row=panel.locator(`tr[data-project-id="${sample.id}"]`);
    const fmt=n=>Number.isFinite(n)?n.toLocaleString('en-US',{maximumFractionDigits:4}):'—';
    await expect(row.locator('[data-field="monthly-mw"]')).toHaveText(fmt(sample.capacityMW));
    await expect(row.locator('[data-field="monthly-mwh"]')).toHaveText(fmt(sample.energyObservation?.value));
    await expect(row.locator('[data-field="annual-mwh"]')).toHaveText(fmt(sample.storageEvidence.energyMWh));
    await expect(row.locator('[data-field="annual-discharge-mw"]')).toHaveText(fmt(sample.storageEvidence.maximumDischargeMW));
    await expect(row.locator('[data-field="annual-hours"]')).toHaveText(fmt(sample.storageEvidence.energyMWh/sample.storageEvidence.maximumDischargeMW));
    const missing=projects.find(p=>p.storageEvidence.match==='none');expect(missing).toBeTruthy();
    await expect(panel.locator(`tr[data-project-id="${missing.id}"] [data-field="annual-mwh"]`)).toHaveText('—');
    await page.locator('.geo-period-group button[data-period="future"]').click();
    await expect(page.locator('.geo-project-layer [data-project-ids]')).toHaveCount(0);
    await expect(panel).toHaveAttribute('data-project-count',String(projects.length));
    expect(errors).toEqual([]);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBe(true);
});

test('failed inventory leaves the existing map usable and retry adds projects without replacing its geometry',async({page})=>{
  let fail=true;await page.route('**'+PATH,route=>fail?route.fulfill({status:503,body:'unavailable'}):route.continue());
  await page.goto('/markets/pjm/grid');
  const panel=page.locator('.eia-inventory'),country=page.locator('.geo-country').first();
  await expect(country).toBeVisible();const original=await country.elementHandle();
  const retry=panel.getByRole('button',{name:/Retry inventory|重试清单/});await expect(retry).toBeVisible();
  await expect(page.locator('.geo-project-layer [data-project-ids]')).toHaveCount(0);
  fail=false;const ready=page.waitForResponse(isInventory);await retry.click();const data=await(await ready).json();
  await expect(panel).toHaveAttribute('data-project-count',String(data.series.filter(p=>p.marketId==='pjm').length));
  expect(await page.evaluate(node=>node===document.querySelector('.geo-country'),original)).toBe(true);
});

test('home, an American brief and unrelated maps do not download the large inventory',async({page})=>{
  const requests=[];page.on('request',r=>{if(new URL(r.url()).pathname===PATH)requests.push(r.url());});
  for(const path of ['/','/markets/pjm/brief','/markets/germany/grid']){
    await page.goto(path);await page.waitForLoadState('networkidle');expect(requests).toEqual([]);
  }
  const ready=page.waitForResponse(isInventory);await page.goto('/markets/pjm/grid');await ready;
  await expect(page.locator('.eia-inventory')).toHaveAttribute('data-market','pjm');expect(requests).toHaveLength(1);
});
