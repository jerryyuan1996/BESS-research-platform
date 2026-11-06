/** Tiny read-only sidecar. It never imports policy maps, stories or a model. */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { link } from '../experience/chrome.js';
export async function attachReviewNotice(app,market){
  const main=app.querySelector('main');if(!main||main.querySelector('[data-policy-review-notice]'))return;
  try{
    const response=await fetch('/data/public/policy/index.json',{cache:'no-cache'});
    if(!response.ok||!(response.headers.get('content-type')||'').includes('json'))return;
    const text=await response.text();if(text.length>1_000_000)return;const index=JSON.parse(text);
    if(!/^[a-f0-9]{64}$/.test(index.head||'')||!Array.isArray(index.pendingReviews))return;
    const reviews=index.pendingReviews.filter(r=>r.market===market.manifest.id&&/^[a-z][a-z0-9_-]{1,95}$/.test(r.instrument));
    if(!reviews.length||!main.isConnected||!location.pathname.startsWith(`/markets/${market.manifest.slug}`))return;
    const notice=h('aside',{class:'note','data-policy-review-notice':'','aria-label':L(['Pending investment reassessment','投资结论待复核'])},h('strong',{},L(['Pending investment reassessment','投资结论待复核'])),h('p',{},L(['New verified policy evidence affects this market. Its approved investment call and story remain unchanged pending analyst review.','新的已核实政策证据影响本市场。分析师复核前，已批准的投资结论与叙事保持不变。'])),...reviews.slice(0,10).map(r=>link(`/policy/dossiers/${r.instrument}?version=${index.head}`,['Inspect the policy evidence','查看政策证据'])));
    main.prepend(notice);
  }catch{/* The sidecar's availability cannot break the approved investment page. */}
}
