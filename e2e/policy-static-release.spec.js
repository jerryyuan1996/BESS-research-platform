import {test,expect} from '@playwright/test';
import fs from 'node:fs';
import {digest} from '../policy/integrity.mjs';
const admission=JSON.parse(fs.readFileSync(new URL('../policy/static-release-admission.json',import.meta.url),'utf8'));
const snapshot=JSON.parse(fs.readFileSync(new URL('../public/data/public/policy/snapshots/'+admission.releaseSnapshotHash+'.json',import.meta.url),'utf8'));
test.beforeEach(async({page})=>page.addInitScript(()=>localStorage.setItem('hub_lang','en')));

test('real historical Radar serves the exact admitted source snapshot without original excerpts',async({page})=>{
  const response=await page.request.get('/data/public/policy/index.json');expect(response.ok()).toBe(true);expect(response.headers()['content-type']).toContain('application/json');
  const index=await response.json();expect(index.head).toBe(admission.releaseSnapshotHash);expect(index.versions).toEqual([admission.releaseSnapshotHash]);
  const source=await page.request.get('/data/public/policy/snapshots/'+index.head+'.json');const actual=await source.json();expect(digest(actual)).toBe(index.head);
  expect(actual.sources).toHaveLength(47);expect(actual.claims).toHaveLength(90);expect(actual.stories).toHaveLength(4);expect(actual.reviews).toHaveLength(27);
  expect(actual.claims.every(c=>c.evidence.every(e=>e.reproduction==='withheld'&&!Object.hasOwn(e,'quote')))).toBe(true);
  await page.goto('/policy');await expect(page.getByRole('heading',{name:'Global Policy Radar'})).toBeVisible();await expect(page.locator('.policy-event')).toHaveCount(20);
  await expect(page.locator('[data-policy-historical-scope]')).toContainText('complete current law is not established');
  await expect(page.getByLabel('Author source check',{exact:true})).toBeVisible();await expect(page.getByText('Snapshot prepared',{exact:false})).toBeVisible();
  await page.getByRole('button',{name:'Switch to Chinese'}).click();await expect(page.locator('[data-policy-historical-scope]')).toContainText('完整现行法律状态尚未确立');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});

test('all four real historical stories and dossiers retain both languages and pending investment review',async({page})=>{
  for(const story of snapshot.stories){
    await page.goto('/policy/stories/'+story.id);await expect(page.getByRole('heading',{name:story.title[0],exact:true})).toBeVisible();
    await expect(page.locator('[data-policy-section]')).toHaveCount(story.chapters.length);
    await expect(page.getByText('Policy interpretation is separate from the approved investment thesis.',{exact:true})).toBeVisible();
    await page.getByRole('button',{name:'Switch to Chinese'}).click();await expect(page.getByRole('heading',{name:story.title[1],exact:true})).toBeVisible();
    await page.getByRole('button',{name:'切换到英文'}).click();
    await page.goto('/policy/stories/'+story.id+'?depth=explorer');await expect(page.locator('.policy-evidence')).toHaveCount(story.claimIds.length);await expect(page.locator('blockquote')).toHaveCount(0);
    const instrument=snapshot.instruments.find(i=>i.id===story.instrumentIds[0]);
    await page.goto('/policy/dossiers/'+instrument.id);await expect(page.getByRole('heading',{name:instrument.title[0],exact:true})).toBeVisible();
    await expect(page.locator('[data-policy-currentness]')).toContainText('Current law: not established.');
    await expect(page.locator('.policy-dates dt').filter({hasText:'Author source check'})).toHaveCount(1);
    await expect(page.locator('blockquote')).toHaveCount(0);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  }
});
