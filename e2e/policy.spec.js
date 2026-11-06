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
  await expect(page.locator('[data-policy-template=timeline]')).toContainText('2021-01-01');
  await expect(page.locator('[data-policy-template=timeline]')).toContainText('2027-01-01');
  await expect(page.locator('[data-policy-component=gb-test-number]')).toHaveCount(2);
  await expect(page.locator('[data-policy-total=gb-scenario]')).toHaveCount(1);
  const accessible=page.locator('.policy-scene').last().getByText('Accessible evidence table',{exact:true});await accessible.click();
  await expect(page.locator('.policy-scene').last().getByRole('table')).toContainText('GBP / MW');
  await page.getByRole('link',{name:'Evidence explorer',exact:true}).click();await expect(page.getByRole('heading',{name:'One canonical evidence graph'})).toBeVisible();await expect(page.locator('.policy-evidence')).toHaveCount(6);await expect(page.locator('.policy-evidence a').first()).toHaveAttribute('href',/^https:\/\/official\.example\//);
  await expect(page.locator('.policy-evidence').first().getByRole('link',{name:'Use terms',exact:true})).toHaveAttribute('href','https://official.example/terms');
  await page.getByRole('button',{name:'Switch to Chinese'}).click();await expect(page.getByRole('heading',{name:'同一份规范证据图谱'})).toBeVisible();await expect(page.getByText('政策解读独立于已批准投资论点。')).toBeVisible();
  await expect(page.locator('.policy-evidence').first().getByRole('link',{name:'使用条款',exact:true})).toHaveAttribute('href','https://official.example/terms');
});
test('comparison keeps NEM and WA separate and declines incompatible quantitative returns',async({page})=>{
  await servePolicy(page);await page.goto('/policy/compare');await expect(page.getByRole('heading',{name:'Compare mechanisms, keep the basis visible'})).toBeVisible();await expect(page.getByRole('columnheader',{name:/National Electricity Market/})).toBeVisible();await expect(page.getByRole('columnheader',{name:'Western Australia'})).toBeVisible();await expect(page.getByText('Not comparable',{exact:false}).first()).toBeVisible();
  await page.goto('/markets/nem/policy');await expect(page.locator('.policy-event')).toHaveCount(2);await expect(page.locator('.policy-feed')).not.toContainText('Synthetic WEM');
});

test('reviewed scene templates draw distinct sourced relationships, comparisons and scope with table fallbacks',async({page})=>{
  const data=policyUIFixture(),story=data.snapshot.stories.find(s=>s.id==='gb-test-story');
  const claims=['gb-consultation','gb-adopted'],relations=[{from:claims[0],to:claims[1],evidenceClaim:claims[1]}];
  const original=data.snapshot.impacts.find(i=>i.id==='gb-scenario');data.snapshot.impacts.push({...original,id:'gb-second-scenario'});
  for(const template of ['status_transition','before_after','causal','stakeholder','sourced_range','market_matrix']){
    const scene={template,claimIds:template==='sourced_range'?[]:claims,impactIds:template==='sourced_range'?['gb-scenario','gb-second-scenario']:[],...(['causal','stakeholder'].includes(template)?{relations}:{})};
    story.chapters.push({id:`scene-${template}`,title:[`Synthetic ${template}`,`Synthetic ${template}`],text:['Synthetic safety fixture.','模拟安全测试。'],claimIds:claims,scene});
  }
  const hash=digest(data.snapshot);data.index.head=hash;data.index.versions=[data.index.versions[0],hash];data.versions.set(hash,data.snapshot);await servePolicy(page,data);
  await page.goto('/policy/stories/gb-test-story');await expect(page.locator('.policy-scene svg')).toHaveCount(9);
  await expect(page.locator('[data-policy-template=causal] [data-policy-relation]')).toHaveCount(1);
  await expect(page.locator('[data-policy-template=stakeholder] .policy-scene-card')).toHaveCount(2);
  await expect(page.locator('[data-policy-template=market_matrix]')).toContainText('gb');
  await expect(page.locator('[data-policy-template=sourced_range] circle')).toHaveCount(2);
  await expect(page.locator('.policy-scene script,.policy-scene foreignObject,.policy-scene style')).toHaveCount(0);
  expect(await page.locator('.policy-scene svg *').count()).toBeLessThan(350);
  await expect(page.locator('.policy-scene summary')).toHaveCount(9);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
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

test('unknown publication stays distinct from a dated document and chronology follows the dated claims',async({page})=>{
  const data=policyUIFixture(),event=data.snapshot.events.find(e=>e.id==='gb-event-new'),claim=data.snapshot.claims.find(c=>c.id==='gb-published-new');
  event.publishedAt=null;event.recordDatedAt=claim.value;event.claimIds.push(claim.id);claim.predicate='document_dated_at';
  claim.text=['Synthetic document dated 2025-01-01.','模拟文件落款2025-01-01。'];
  const history=data.snapshot.stories.find(s=>s.id==='gb-test-story').chapters.find(c=>c.id==='history');
  history.scene.claimIds=['gb-effect-date','gb-published-new','gb-published-old'];
  const hash=digest(data.snapshot);data.index.head=hash;data.index.versions=[data.index.versions[0],hash];data.versions.set(hash,data.snapshot);
  await servePolicy(page,data);await page.goto('/policy/dossiers/gb-test-instrument');
  const dates=page.locator('.policy-dates');
  await expect(dates.locator('div').filter({has:page.locator('dt',{hasText:'Published document'})}).locator('dd')).toHaveText('Not established');
  await expect(dates.locator('div').filter({has:page.locator('dt',{hasText:'Document dated'})}).locator('dd')).toContainText('2025');
  await page.goto('/policy/stories/gb-test-story');
  const labels=page.locator('[data-policy-template=timeline] .policy-scene-date');
  await expect(labels).toHaveCount(3);
  expect(await labels.allTextContents()).toEqual(['Published · 2021-01-01T00:00:00Z','Document dated · 2025-01-01T00:00:00Z','Commencement / effect · 2027-01-01T00:00:00Z']);
  if(await page.evaluate(()=>innerWidth)<720){const viewport=page.locator('[data-policy-template=timeline]').locator('..');await viewport.focus();await page.keyboard.press('ArrowRight');await expect.poll(()=>viewport.evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);}
  await page.getByRole('button',{name:'Switch to Chinese'}).click();
  await expect(page.locator('[data-policy-template=timeline]')).toContainText('文件落款');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});

test('verification labels use the actual recorded event time rather than snapshot preparation',async({page})=>{
 const data=policyUIFixture(),event=data.snapshot.events.find(e=>e.id==='gb-event-new');
 event.verifiedAt='2026-10-15T12:00:00Z';
 const hash=digest(data.snapshot);data.index.head=hash;data.index.versions=[data.index.versions[0],hash];data.versions.set(hash,data.snapshot);
 await servePolicy(page,data);await page.goto('/policy/dossiers/gb-test-instrument');
 const verification=page.locator('.policy-dates div').filter({has:page.locator('dt',{hasText:'Last verified'})}).locator('dd');
 await expect(verification).toContainText('Oct 2026');
 await expect(verification).not.toContainText('Nov 2026');
});
test('an event without recorded verification cannot enter the published policy UI',async({page})=>{
 const data=policyUIFixture();data.snapshot.events.find(e=>e.id==='gb-event-new').verifiedAt=null;
 const hash=digest(data.snapshot);data.index.head=hash;data.index.versions=[data.index.versions[0],hash];data.versions.set(hash,data.snapshot);
 await servePolicy(page,data);await page.goto('/policy');
 await expect(page.getByRole('heading',{name:'Verified policy evidence is unavailable'})).toBeVisible();
 await expect(page.locator('.policy-event')).toHaveCount(0);
});
test('source retrieval, withheld excerpts, partial history and unquantified impact stay distinct in both languages',async({page})=>{
 const data=policyUIFixture(),source=data.snapshot.sources.find(s=>s.id==='gb-source-new'),instrument=data.snapshot.instruments.find(i=>i.id==='gb-test-instrument'),story=data.snapshot.stories.find(s=>s.id==='gb-test-story');
 Object.assign(source.rights,{reproduction:'facts_only',attribution:['Synthetic authority — Test record','模拟机关 — 测试文件'],license:['Facts and source links only','仅事实及来源链接'],changes:['Original excerpts omitted','省略原文引文']});
 for(const claim of data.snapshot.claims)for(let n=0;n<claim.evidence.length;n++){const e=claim.evidence[n];if(e.source===source.id)claim.evidence[n]={source:e.source,locator:e.locator,quoteHash:'sha256:'+digest(e.quote),reproduction:'withheld',supports:e.supports};}
 instrument.currentness={status:'unknown',asOf:null,scope:['As-issued source versions only.','仅所引原始版本。']};
 const historical={id:'gb-month-history',instrument:instrument.id,kind:'date',predicate:'context_at',value:'2023-05',datePrecision:'month',dateSubject:['Earlier open letter','较早公开信'],status:'verified',text:['Earlier letter in 2023-05.','2023-05的较早公开信。'],markets:['gb'],mechanism:'context',translationReviewed:true,evidence:[{source:source.id,locator:source.locator,quoteHash:'sha256:'+digest('May 2023'),reproduction:'withheld',supports:'date'}]};
 data.snapshot.claims.push(historical);story.claimIds.push(historical.id);const history=story.chapters.find(c=>c.id==='history');history.claimIds.push(historical.id);history.scene.claimIds.push(historical.id);
 data.snapshot.impacts.push({id:'gb-unquantified',claim:'gb-adopted',lane:'not_quantifiable',value:null,currency:null,denominator:null,period:null,technology:'BESS',location:'GB',formula:null,inputs:[],attribution:null,asOf:null,contract:null,taxTreatment:null,marketDefinition:'GB'});
 story.chapters.push({id:'unknown-impact',title:['Impact awaiting quantification','影响待量化'],text:['No sourced project income is established.','尚未确立有来源的项目收入。'],claimIds:['gb-adopted'],scene:{template:'impact_summary',claimIds:['gb-adopted'],impactIds:['gb-unquantified'],relations:[]}});
 const hash=digest(data.snapshot);data.index.head=hash;data.index.versions=[data.index.versions[0],hash];data.versions.set(hash,data.snapshot);
 await servePolicy(page,data);await page.goto('/policy/dossiers/gb-test-instrument');
 await expect(page.locator('[data-policy-currentness]')).toContainText('Current law: not established');
 await expect(page.locator('#claim-gb-adopted blockquote')).toHaveCount(0);
 await expect(page.locator('#claim-gb-adopted [data-policy-reproduction]')).toContainText('Original excerpt omitted');
 await expect(page.locator('#claim-gb-adopted [data-policy-attribution]')).toContainText('Synthetic authority');
 await expect(page.locator('#claim-gb-adopted small.policy-meta')).toContainText('Retrieved / availability checked');
 await page.goto('/policy/stories/gb-test-story');
 await expect(page.locator('[data-policy-template=impact_summary]')).toContainText('Not yet quantifiable');
 await expect(page.locator('[data-policy-template=impact_summary] a')).toHaveAttribute('href',/depth=explorer.*#claim-gb-adopted$/);
 await expect(page.locator('[data-policy-template=timeline]')).toContainText('2023-05');
 await expect(page.locator('[data-policy-template=timeline]')).not.toContainText('2023-05-01');
 await page.getByRole('button',{name:'Switch to Chinese'}).click();
 await expect(page.locator('[data-policy-template=impact_summary]')).toContainText('尚无法量化');
 await page.goto('/policy/dossiers/gb-test-instrument');
 await page.getByRole('button',{name:'Switch to Chinese'}).click();
 await expect(page.locator('[data-policy-currentness]')).toContainText('现行法律状态：尚未确立');
 await expect(page.locator('#claim-gb-adopted [data-policy-reproduction]')).toContainText('原文引文已省略');
 await expect(page.locator('#claim-gb-adopted small.policy-meta')).toContainText('获取／可访问性检查');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await page.goto('/policy/stories/gb-test-story');
 await page.locator('[data-policy-template=impact_summary] a').click();
 await expect(page.locator('#claim-gb-adopted')).toBeVisible();
});
