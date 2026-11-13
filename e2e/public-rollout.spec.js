/* Release 4 reuses the NEM/Japan player and visual language. Exercise the
   market-specific content, payment conditions and lazy boundaries here; the
   reference player tests continue to cover keyboard, playback and focus. */
import {test,expect} from '@playwright/test';

const ROUTES={wa:'western-australia',gb:'great-britain',de:'germany',it:'italy',ie:'ireland',
  ro:'romania',pl:'poland',pjm:'pjm',ercot:'ercot',caiso:'caiso',fi:'finland'};
const PACKS=Object.fromEntries(await Promise.all(Object.keys(ROUTES).map(async id=>
  [id,(await import(`../src/experience/story/public/sequences/${id}.js`)).default])));

test.beforeEach(async({page})=>{await page.route(/^https:\/\//,r=>r.abort());});

async function visit(page,slug,lang){
  await page.goto('/');
  await page.evaluate(lang=>localStorage.setItem('hub_lang',lang),lang);
  await page.goto('/markets/'+slug);
  await expect(page.locator('#decision')).toBeVisible();
}

for(const [id,slug] of Object.entries(ROUTES))for(const lang of ['en','zh']){
  test(`${id}: every explanation stays sourced, coordinated and readable (${lang})`,async({page},info)=>{
    // Each case visits every translated animation step, including layout and payment gates.
    test.setTimeout(120000);
    const errors=[],fetched=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('request',r=>fetched.push(r.url()));
    await visit(page,slug,lang);
    const before=await page.locator('#decision').innerText();
    expect(fetched.some(url=>/\/public-sequence-/.test(url))).toBe(false);
    await page.locator('.public-story-trigger').click();
    const dialog=page.locator('.public-story-dialog');
    await dialog.locator('[data-chapter=system]').click();
    await expect(dialog.locator('.k-seq')).toBeVisible();
    const index=lang==='zh'?1:0;
    await expect(dialog.locator('[data-sequence]')).toHaveText(PACKS[id].sequences.map(q=>q.title[index]));
    for(const q of PACKS[id].sequences){
      await dialog.locator(`[data-sequence="${q.id}"]`).click();
      await expect(dialog.locator('.k-seq')).toHaveAttribute('data-playing','false');
      for(const [i,step] of q.steps.entries()){
        if(i)await dialog.locator('[data-seq=next]').click();
        await expect(dialog.locator('.k-seq-title')).toHaveText(step.title[index]);
        await expect(dialog.locator('.k-seq-text')).toHaveText(step.text[index]);
        await expect(dialog.locator('.k-seq-sources a')).toHaveCount(step.sources.length);
        await expect(dialog.locator('.public-power-scene')).toHaveAttribute('data-mode',step.view);
        await expect(dialog.locator('.public-power-scene')).toHaveAttribute('data-frame',info.project.name==='mobile'?'compact':'wide');
        const state={qualified:true,awarded:true,delivers:true,flow:'discharge',breaker:'closed',...q.base,...step.state};
        if(step.view==='mechanism'){
          const shut=[state.qualified,state.awarded,state.delivers].indexOf(false);
          await expect(dialog.locator('.k-rail')).toHaveAttribute('data-outcome',shut<0?'paid':`stopped-${shut+1}`);
        }
        /* Preserve the original system/storage frame's layout check before switching views. */
        expect(await dialog.locator('.public-scene').evaluate(el=>el.scrollWidth<=el.clientWidth+1),q.id+'/'+i+' original frame overflows').toBe(true);
        expect(await dialog.locator('.k-seq-caption').evaluate(el=>el.scrollHeight<=el.clientHeight+1),q.id+'/'+i+' original caption clips').toBe(true);
        /* Energy sold is not reserve readiness. A reader may open the payment
           view while an energy-sale sequence is still charging or waiting. */
        if(['Energy delivered','Delivered'].includes(q.gates[2][0])&&(state.flow!=='discharge'||state.breaker==='open')){
          await dialog.locator('.public-scene-modes [data-mode=mechanism]').click();
          await expect(dialog.locator('[data-condition=delivers]')).toHaveAttribute('aria-pressed','false');
          await expect(dialog.locator('.k-gate[data-gate="3"]')).not.toHaveClass(/is-open/);
          await expect(dialog.locator('.k-rail')).not.toHaveAttribute('data-outcome','paid');
        }
        /* Check every translated step, not only the sequence's final frame. */
        expect(await dialog.locator('.public-scene').evaluate(el=>el.scrollWidth<=el.clientWidth+1),q.id+'/'+i+' overflows').toBe(true);
        expect(await dialog.locator('.k-seq-caption').evaluate(el=>el.scrollHeight<=el.clientHeight+1),q.id+'/'+i+' clips its caption').toBe(true);
      }
      await expect(dialog.locator('[data-condition]')).toHaveText(q.gates.map((g,i)=>`${i+1} · ${g[index]}`));
    }
    const own=new RegExp(`/public-sequence-${id}-`);
    expect(fetched.filter(url=>/\/public-sequence-/.test(url)&&!own.test(url)&&!/public-sequence-contracted-/.test(url))).toEqual([]);
    await page.keyboard.press('Escape');
    expect(await page.locator('#decision').innerText()).toBe(before);
    expect(errors).toEqual([]);
  });
}

test('linked frequency systems are not drawn as isolated grids',async({page})=>{
  for(const id of ['gb','ie','fi']){
    await visit(page,ROUTES[id],'en');
    await page.locator('.public-story-trigger').click();
    const dialog=page.locator('.public-story-dialog');
    await dialog.locator('[data-chapter=system]').click();
    await expect(dialog.locator('.k-seq')).toBeVisible();
    await dialog.locator('.public-scene-modes [data-mode=system]').click();
    await dialog.locator('[data-network=constrained]').click();
    await expect(dialog.locator('[data-reading=network]')).toContainText('link to the neighbouring area');
    await expect(dialog.locator('.public-converter')).toHaveCount(id==='fi'?0:1);
    await expect(dialog.locator('.public-boundary')).toHaveCount(0);
    await expect(dialog.locator('.public-power-scene')).not.toContainText(/Honshu|本州/);
  }
});

test('history-only markets receive no unapproved investment-logic scene',async({page})=>{
  const fetched=[];page.on('request',r=>fetched.push(r.url()));
  for(const slug of ['ontario','saudi-arabia','spain']){
    await visit(page,slug,'en');await page.locator('.public-story-trigger').click();
    const dialog=page.locator('.public-story-dialog');
    await expect(dialog.locator('.public-story-nav [data-chapter=history]')).toBeVisible();
    await expect(dialog.locator('.public-story-nav [data-chapter=system]')).toHaveCount(0);
    await expect(dialog.locator('.public-scene')).toHaveCount(0);
  }
  expect(fetched.some(url=>/\/public-sequence-/.test(url))).toBe(false);
});
