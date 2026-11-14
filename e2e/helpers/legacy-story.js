// Exercise saved original-story links after the second visible entrance retires.
// A real same-page link keeps the router's Back/Forward and focus behaviour in use.
export async function openLegacyStory(page){
 await page.locator('.public-story-trigger').waitFor();
 const url=new URL(page.url());url.searchParams.set('view','story');url.searchParams.set('chapter','opening');url.searchParams.delete('shot');
 await page.evaluate(href=>{const link=document.createElement('a');link.href=href;document.body.append(link);link.click();link.remove();},url.href);
}
