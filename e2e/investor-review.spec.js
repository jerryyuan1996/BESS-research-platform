import { test,expect } from '@playwright/test';

test('current Italy and Finland narratives reconcile to the main metrics',async({page})=>{
  await page.goto('/markets/italy');
  const irr=await page.locator('#bankable .ix-kpis strong').first().innerText();
  await expect(page.locator('.ix-thesis')).toContainText(irr);
  await expect(page.locator('.ix-thesis')).not.toContainText('14.6%');
  await expect(page.locator('#decision')).toContainText('project-rights price');
  await page.goto('/markets/finland');
  await expect(page.locator('#revenue .ix-assumptions')).toContainText('40%');
  await expect(page.locator('#revenue .ix-assumptions')).not.toContainText('50%');
});
test('Saudi has an evidence gap rather than a negative-return label or a stranded loading message',async({page},info)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/markets/saudi-arabia');
  await expect(page.locator('#decision')).toContainText('payment is unpublished');
  await expect(page.locator('#execution')).toContainText('No priced model');
  await expect(page.getByRole('button',{name:'Model this market ↗',exact:true})).toHaveCount(0);
  await page.screenshot({path:info.outputPath('saudi-withheld.png'),fullPage:true});
  expect(errors).toEqual([]);
});
test('the new Spain case states its execution assumptions and retains a downside',async({page})=>{
  await page.goto('/markets/spain');
  await expect(page.locator('#bankable')).toContainText('perfect-foresight');
  await expect(page.locator('#bankable')).toContainText('capacity and balancing receipts excluded');
  await expect(page.locator('#downside .ix-downside-table')).not.toContainText('N/M');
});
test('a month-only event keeps its uncertainty in both languages',async({page})=>{
  await page.goto('/news');
  await page.locator('#event-watch>summary').click();
  await expect(page.getByText('Expected month; exact date unconfirmed').first()).toBeVisible();
  await expect(page.getByText('Due by tomorrow',{exact:true})).toHaveCount(0);
  await expect(page.getByText('OTHER NEWS FROM THIS MARKET').first()).toBeVisible();
  await page.getByRole('button',{name:'Switch to Chinese',exact:true}).click();
  await expect(page.getByText('预计月份，具体日期待确认').first()).toBeVisible();
});
test('risk analysis keeps baseline debt and exposes the twenty-year contract tail',async({page},info)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/markets/germany');
  await page.locator('.ix-risk-analysis-host>summary').click();
  await expect(page.locator('.ix-life-year')).toHaveCount(20);
  await expect(page.locator('.ix-risk-analysis')).toContainText('No debt is resized');
  await page.locator('#downside').screenshot({path:info.outputPath('risk-analysis.png')});
  expect(errors).toEqual([]);
});
test('route links select the corresponding investment and financing case',async({page})=>{
  await page.goto('/markets/italy?play=it-ltda-6h#route-options');
  await expect(page.locator('#route-options')).toHaveCount(0);
  await expect(page.locator('.ic-play-option[aria-pressed=true]')).toContainText('MACSE');
  await expect(page.locator('#bankable')).toContainText('4.8%');
  await expect(page.locator('#bankable [data-debt-stream=ltda]')).toBeVisible();
});
test('responsive decision cards, shared navigation and comparison margins remain usable',async({page},info)=>{
  await page.goto('/returns');
  await expect(page.locator('.ix-opportunity-set tbody tr')).toHaveCount(17);
  await expect(page.locator('.ix-matrix-svg')).toContainText('All-equity IRR (%)');
  await expect(page.locator('.ix-matrix-svg')).not.toContainText('minus target');
  await expect(page.locator('[data-market-row=sa]')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2)).toBe(false);
  await page.screenshot({path:info.outputPath('comparison-margin.png'),fullPage:true});
  await page.goto('/data');
  await expect(page.locator('.ix-header')).toHaveCount(1);
  await expect(page.getByText('Investment conventions',{exact:true})).toBeVisible();
  await page.goto('/');
  await page.locator('.ix-home-hero').screenshot({path:info.outputPath('home-investor-review.png')});
});


test('special value separates design, timing, costs and price and only the active investor data loads',async({page})=>{
  const loaded=[];page.on('request',r=>{if(/\/(infraFund|strategic|foreignFirstTimer|developer)-[^/]+\.js/.test(r.url()))loaded.push(r.url());});
  await page.goto('/');
  await expect(page.locator('.ix-featured')).toBeVisible();
  expect(new Set(loaded).size).toBe(1);
  await page.goto('/markets/germany');
  await page.getByText('What creates the extra value?',{exact:true}).click();
  await expect(page.locator('.ix-opportunity-output')).toContainText('Sequential NPV bridge');
  await expect(page.locator('.ix-opportunity-output')).toContainText('Extra acquisition price');
});

test('traceable calls cover every comparison case and matrix targets follow the toggle',async({page})=>{
  test.setTimeout(120000);
  await page.goto('/returns');
  const strips=page.locator('.ix-opportunity-set .ix-decision-strip');
  for(const lens of ['strategic','foreignFirstTimer','developer','infraFund']){
    await page.getByRole('combobox',{name:'Investor profile',exact:true}).selectOption(lens);
    await expect(page.locator(`.ix-opportunity-set .ix-decision-strip[data-investor=${lens}]`)).toHaveCount(17);
    const complete=await strips.evaluateAll(nodes=>nodes.every(n=>['call','target','debt','gate','evidence'].every(k=>n.querySelector(`[data-strip-element=${k}]`))&&!/NaN|undefined/.test(n.textContent)));
    expect(complete).toBe(true);
  }
  await expect(strips).toHaveCount(17);
  for(const strip of await strips.all()){
    const keys=await strip.locator('[data-strip-element]').evaluateAll(nodes=>nodes.map(n=>n.dataset.stripElement));
    expect(keys.filter(k=>k!=='event')).toEqual(['call','target','debt','gate','evidence']);
    expect([5,6]).toContain(keys.length);
    await expect(strip.locator('.ix-target-build-up')).toContainText('Government rate');
    await expect(strip.locator('[data-strip-element=evidence]')).toContainText('What would change it');
  }
  await expect(page.locator('[data-market-row=de] .ix-call-qualifier')).toHaveText(' · below target');
  await expect(page.locator('[data-market-row=ro] .ix-call-qualifier')).toHaveText(' · at a price');
  await expect(page.locator('[data-market-row=fi] .ix-call-qualifier')).toHaveText(' · clears target');
  await expect(page.locator('.ix-legend')).not.toContainText('capex');
  await expect(page.locator('.ix-point[data-market=ca_on] .ix-point-label')).not.toHaveText('CA_ON');
  for(const basis of ['All-equity','Levered']){
    await page.getByRole('button',{name:basis,exact:true}).click();
    const dots=await page.locator('.ix-point').evaluateAll(nodes=>nodes.map(n=>({met:n.dataset.meetsTarget,fill:getComputedStyle(n.querySelector('circle')).fill,r:n.querySelector('circle').getAttribute('r')})));
    expect(new Set(dots.map(d=>d.r)).size).toBe(1);
    expect(dots.filter(d=>d.met==='false').every(d=>d.fill==='rgb(255, 254, 250)')).toBe(true);
    const point=page.locator('.ix-point[data-market=jp_tokyo]');
    await point.focus();await page.keyboard.press('Enter');
    await expect(point).toHaveAttribute('aria-pressed','true');
    await expect(page.locator('.ix-matrix-detail h3')).toContainText('Tokyo');
    const overlap=await page.locator('.ix-point-label').evaluateAll(nodes=>{
      const boxes=nodes.map(n=>n.getBoundingClientRect());
      return boxes.some((a,i)=>boxes.slice(i+1).some(b=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top));
    });
    expect(overlap).toBe(false);
  }
  await page.getByRole('button',{name:'Switch to Chinese',exact:true}).click();
  const chineseOverlap=await page.locator('.ix-point-label').evaluateAll(nodes=>{
    const boxes=nodes.map(n=>n.getBoundingClientRect());
    return boxes.some((a,i)=>boxes.slice(i+1).some(b=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top));
  });
  expect(chineseOverlap).toBe(false);
});

test('built decision strip and local-currency bridge work bilingually at 375px',async({page},info)=>{
  test.setTimeout(120000);
  await page.setViewportSize({width:375,height:844});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const lang of ['en','zh']){
    for(const route of ['/','/returns','/markets/italy','/markets/finland']){
      await page.goto(route);
      if(lang==='zh'&&await page.getByRole('button',{name:'Switch to Chinese',exact:true}).count())await page.getByRole('button',{name:'Switch to Chinese',exact:true}).click();
      const strips=page.locator('.ix-decision-strip');await expect(strips.first()).toBeVisible();
      if(route.startsWith('/markets/')){
        const strip=page.locator('#decision .ix-decision-strip');await expect(strip).toHaveCount(1);
        await expect(strip.locator('[data-strip-element]')).toHaveCount(6);
        await expect(strip).toContainText(lang==='en'?'What would change it':'什么会改变判断');
        await expect(page.locator('#revenue')).toContainText('EUR');
        await expect(page.locator('#revenue')).not.toContainText('USD');
        await expect(page.locator('#downside .ix-downside-table')).not.toContainText('USD');
        const order=await page.locator('#decision').evaluate(n=>Boolean(n.compareDocumentPosition(document.querySelector('.public-overview'))&Node.DOCUMENT_POSITION_PRECEDING));
        expect(order).toBe(true);
        await strip.scrollIntoViewIfNeeded();
        await page.locator('#decision').screenshot({path:info.outputPath(`${route.split('/').pop()}-${lang}-decision-375.png`)});
      }else{
        await page.locator(route==='/'?'.ix-featured':'.ix-opportunity-set').screenshot({path:info.outputPath(`${route==='/'?'brief':'comparison'}-${lang}-375.png`)});
      }
      expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2)).toBe(false);
    }
  }
  expect(errors).toEqual([]);
});
