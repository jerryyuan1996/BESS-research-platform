import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

test('reading position, chapter jumps and return to top survive responsive and language changes',async({page},info)=>{
  test.setTimeout(120000);
  await page.route(/^https:\/\//,route=>route.abort());
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/markets/romania');
  const nav = page.locator('.market-reading-nav'), toggle = nav.locator('.market-reading-toggle');
  await expect(page.locator('[data-storyline-market="ro"]')).toBeVisible();
  await expect(nav.locator('a[href="#revenue-duration"]')).toHaveCount(1);
  const widths = info.project.name === 'desktop' ? [1051,1280,1440] : [390,720,1050];
  for (const width of widths) {
    await page.setViewportSize({width,height:1000});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    if (width <= 1050) {
      await expect(toggle).toBeEnabled();
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded','true');
      await page.keyboard.press('Escape');
      await expect(toggle).toHaveAttribute('aria-expanded','false');
      await expect(toggle).toBeFocused();
      await toggle.click();
    } else {
      await expect(toggle).toBeDisabled();
      const rail = await nav.boundingBox(), content = await page.locator('#overview').boundingBox();
      expect(rail.x+rail.width).toBeLessThan(content.x);
      // Subchapters appear while the reader is in the revenue section.
      await page.locator('#revenue-drivers').evaluate(el=>el.scrollIntoView({block:'start'}));
    }
    await nav.locator('a[href="#revenue-duration"]').click();
    await expect(page.locator('#revenue-duration')).toHaveAttribute('open','');
    await expect(page.locator('#revenue-duration .market-revenue-body')).toHaveAttribute('aria-busy','false');
    await expect(nav.locator('[aria-current="location"]')).toHaveAttribute('href','#revenue-duration');
    await page.getByRole('button',{name:'Back to top',exact:true}).click();
    await expect.poll(()=>page.evaluate(()=>window.scrollY)).toBeLessThan(10);
    await expect(page.getByRole('heading',{name:'Romania',exact:true})).toBeFocused();
  }
  await page.goto('/markets/romania#revenue-duration');
  await expect(page.locator('#revenue-duration')).toHaveAttribute('open','');
  await expect(nav.locator('[aria-current="location"]')).toHaveAttribute('href','#revenue-duration');
  await page.getByRole('button',{name:'Back to top',exact:true}).click();
  await page.getByRole('button',{name:'Switch to Chinese',exact:true}).click();
  await expect(nav).toHaveCount(1);
  await expect(nav).toHaveAttribute('aria-label','市场阅读导航');
  await expect(page.locator('[data-storyline-market="ro"]')).toBeVisible();
  await page.locator('#revenue-capacity > summary').click();
  await expect(page.locator('#revenue-capacity .market-revenue-body')).toHaveAttribute('aria-busy','false');
  await page.locator('#revenue-capacity').evaluate(el=>el.scrollIntoView({block:'start'}));
  await expect(nav.locator('[aria-current="location"]')).toHaveAttribute('href','#revenue-capacity');
  await mkdir('.tmp/market-rollout',{recursive:true});
  await page.screenshot({path:`.tmp/market-rollout/navigation-final-${info.project.name}.png`});
});
