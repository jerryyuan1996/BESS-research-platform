import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { navigate } from '../app/router.js';
import { siteHeader,siteFooter,link } from '../experience/chrome.js';
import { loadPolicyIndex,loadPolicySnapshot,policyDiff } from './client.js';
import { renderPolicyScene } from './scenes.js';
import {eventDates,eventVerification,compareEventVerification,matchesVerificationFreshness} from '../../policy/dates.mjs';
import { safeURL,MECHANISMS } from '../../policy/schema.mjs';
import { impactCompatibility } from '../../policy/compare.mjs';
import './policy.css';

const STATE={draft:['Draft','草案'],consultation:['Consultation','征询意见'],amended:['Amended proposal','修订提案'],adopted:['Adopted','已通过'],effective:['Effective','已生效'],suspended:['Suspended','已暂停'],withdrawn:['Withdrawn','已撤回'],repealed:['Repealed','已废止'],superseded:['Superseded','已取代']};
const MECHANISM={eligibility:['Eligibility','资格'],grid_access:['Grid access','并网准入'],grid_cost:['Grid cost','并网成本'],revenue_right:['Revenue entitlement','收入权利'],deadline:['Deadline','期限'],investment_call:['Investment interpretation','投资解读'],context:['Context','背景']};
const LANE={official_observed:['Official observed','官方观测'],attributed_forecast:['Attributed forecast','具名预测'],scenario:['Transparent scenario','透明情景'],not_quantifiable:['Not yet quantifiable','尚无法量化']};
const JURISDICTIONS={DE:['Germany','德国'],GB:['Great Britain','英国'],'AU-NEM':['Australia · NEM','澳大利亚 · NEM'],'AU-WA':['Western Australia · WEM','西澳 · WEM'],EU:['European Union','欧盟'],US:['United States','美国'],JP:['Japan','日本'],CA:['Canada','加拿大'],NZ:['New Zealand','新西兰']};
const TOPICS=MECHANISMS.map(id=>[id,MECHANISM[id]]);
const unknown=()=>L(['Not established','尚未确认']);
const date=value=>value?new Date(value).toLocaleDateString(L(['en-GB','zh-CN']),{year:'numeric',month:'short',day:'numeric',...(/^\d{4}-\d{2}-\d{2}$/.test(value)?{timeZone:'UTC'}:{})}):unknown();
const eventDateSummary=event=>eventDates(event).map(row=>L(row.label)+' '+date(row.value)).join(' · ')||L(['Legal dates not established','法律日期未确定']);
const verificationText=event=>{const verification=eventVerification(event);return L(verification.label)+(verification.at?' '+date(verification.at):'');};
const labelState=value=>L(STATE[value]||[String(value),String(value)]);
const sourceLink=source=>{
  if(!source||!safeURL(source.url))return h('span',{},L(['Original source unavailable','原始来源不可用']));
  return h('span',{},h('a',{href:source.url,target:'_blank',rel:'noopener noreferrer'},`${source.publisher} · ${source.title} · ${source.locator}`),
    source.rights?.termsURL&&safeURL(source.rights.termsURL)?h('span',{},' · ',h('a',{href:source.rights.termsURL,target:'_blank',rel:'noopener noreferrer'},L(['Use terms','使用条款']))):null);
};
const heading=(kicker,title,sub=null)=>h('div',{class:'policy-heading'},h('div',{},h('div',{class:'policy-kicker'},L(kicker)),h('h1',{},L(title)),sub?h('p',{class:'policy-meta'},L(sub)):null));
const empty=text=>h('div',{class:'policy-empty',role:'status'},L(text));
const getParams=()=>new URLSearchParams(window.location.search);
const cleanBack=value=>/^\/policy(?:[/?]|$)/.test(value||'')?value:'/policy';
const resourceURL=(type,id,version=null)=>`/policy/${type}/${encodeURIComponent(id)}?${new URLSearchParams({from:window.location.pathname+window.location.search,...(version?{version}:{})})}`;
const evidenceFor=(snapshot,claim)=>claim.evidence.map(item=>({item,source:snapshot.sources.find(s=>s.id===item.source)}));
function evidenceCard(snapshot,claim){
  return h('article',{class:'policy-evidence',id:`claim-${claim.id}`},h('span',{class:'policy-badge'},claim.kind==='inference'||claim.kind==='scenario'?L(['Policy interpretation / scenario','政策解读／情景']):L(['Verified policy fact','已核实政策事实'])),h('p',{},L(claim.text)),...evidenceFor(snapshot,claim).map(({item,source})=>h('div',{},sourceLink(source),item.reproduction==='withheld'?h('small',{'data-policy-reproduction':'withheld'},L(['Original excerpt omitted; the factual summary links to the cited source.','原文引文已省略；事实摘要链接至所引来源。'])):h('blockquote',{},item.quote),source?.rights?.attribution?h('p',{class:'policy-meta','data-policy-attribution':source.id},L(source.rights.attribution)):null,source?.rights?.license?h('p',{class:'policy-meta'},L(source.rights.license)):null,source?.rights?.changes?h('p',{class:'policy-meta'},L(source.rights.changes)):null,h('small',{class:'policy-meta'},`${source?.language||''} · ${source?.contentHash||''} · ${L(['Retrieved / availability checked','获取／可访问性检查'])} ${date(source?.checkedAt)}`))));
}
function impactExhibits(snapshot,claimIds){
  const impacts=snapshot.impacts.filter(i=>claimIds.includes(i.claim));
  if(!impacts.length)return empty(['Impact is not yet quantifiable from the verified evidence.','已核实证据尚不足以量化影响。']);
  return h('div',{class:'policy-table-scroll'},h('table',{},h('thead',{},h('tr',{},...[[ 'Evidence lane','证据类别'],['Value and basis','数值与口径'],['Scope and formula','适用范围与公式']].map(label=>h('th',{scope:'col'},L(label))))),h('tbody',{},impacts.map(i=>h('tr',{},h('td',{},L(LANE[i.lane])),h('td',{},i.lane==='not_quantifiable'?L(LANE.not_quantifiable):`${i.value} ${i.currency}/${i.denominator} · ${i.period}`),h('td',{},`${i.location||''} · ${i.technology||''}`,i.formula?h('p',{},`${i.formula}(${(i.inputs||[]).join(', ')})`):null,link(`#claim-${i.claim}`,['Evidence','证据'])))))));
}
function reviewNotice(snapshot,claimIds,markets){
  const reviews=snapshot.reviews.filter(r=>r.status==='pending_reassessment'&&claimIds.includes(r.claim));
  if(!reviews.length)return null;
  const ids=new Set(reviews.flatMap(r=>r.linkIds));const affected=snapshot.links.filter(l=>ids.has(l.id));
  return h('aside',{class:'policy-notice','aria-label':L(['Pending investment reassessment','投资结论待复核'])},h('strong',{},L(['Pending investment reassessment','投资结论待复核'])),h('p',{},L(['The approved investment call remains unchanged. Review the linked policy evidence before relying on its affected assumptions.','已批准的投资结论保持不变。使用受影响假设前，请复核关联政策证据。'])),...affected.map(l=>{const market=markets.find(m=>m.manifest.id===l.market);return market?link(`/markets/${market.manifest.slug}`,market.manifest.name):null;}));
}
function shell(app,market){const main=h('main',{id:'ix-main',class:'policy-page',tabindex:'-1'});app.replaceChildren(siteHeader(market?'market':'policy'),main,siteFooter());return main;}
function eventClaims(snapshot,event){return event.claimIds.map(id=>snapshot.claims.find(c=>c.id===id)).filter(Boolean);}
function recordJurisdiction(snapshot,event){return snapshot.instruments.find(i=>i.id===event.instrument)?.jurisdiction||'';}
function filterEvents(snapshot,params,market){
  const cutoff=Date.now();
  return snapshot.events.filter(event=>{
    const claims=eventClaims(snapshot,event);const markets=new Set(claims.flatMap(c=>c.markets));
    if((market||params.get('market'))&&!markets.has(market||params.get('market')))return false;
    if(params.get('jurisdiction')&&recordJurisdiction(snapshot,event)!==params.get('jurisdiction'))return false;
    if(params.get('lifecycle')&&event.to!==params.get('lifecycle'))return false;
    if(params.get('mechanism')&&!claims.some(c=>c.mechanism===params.get('mechanism')))return false;
    const dates=[event.effectiveAt,event.consultationClosesAt].filter(Boolean).map(Date.parse);
    if(params.get('deadline')==='upcoming'&&!dates.some(t=>t>=cutoff&&t<=cutoff+90*86400000))return false;
    if(!matchesVerificationFreshness(event,params.get('freshness'),cutoff))return false;
    if(params.get('review')==='pending'&&!snapshot.reviews.some(r=>r.status==='pending_reassessment'&&event.claimIds.includes(r.claim)))return false;
    if(params.get('strength')==='official'&&!claims.some(c=>c.evidence.some(e=>snapshot.sources.find(s=>s.id===e.source)?.authority==='official')))return false;
    return true;
  }).sort(compareEventVerification);
}
function renderRadar(main,{snapshot,index,market,markets}){
  const params=getParams();const marketId=market?.manifest.id;
  main.append(heading(['POLICY INTELLIGENCE','政策情报'],market?[`${L(market.manifest.name)} · Policy`,`${L(market.manifest.name)} · 政策`]:['Global Policy Radar','全球政策雷达'],['Official evidence, separate policy interpretation and an explicit investment review boundary.','官方证据、独立政策解读与明确的投资复核边界。']));
  main.append(h('div',{class:'policy-links'},link('/policy/compare',['Compare policy mechanisms','比较政策机制']),market?link(`/markets/${market.manifest.slug}`,['Back to approved investment case','返回已批准投资分析']):null));
  main.append(h('p',{class:'policy-meta'},index?`${L(['Published','发布'])} ${date(index.publishedAt)} · ${snapshot.events.filter(e=>eventVerification(e).at).length} ${L(['verified events','已核实事件'])}`:L(['No verified policy snapshot has been published. Source discovery and legal-status verification are separate gates.','尚未发布已核实政策快照。来源发现与法律状态验证是两个独立环节。'])));
  const filterBar=h('form',{class:'policy-filters','aria-label':L(['Policy filters','政策筛选']),onsubmit:e=>e.preventDefault()});
  let feed;
  function update(key,value){const next=getParams();if(value)next.set(key,value);else next.delete(key);if(key!=='selected'&&key!=='panel'&&key!=='page'){next.delete('selected');next.delete('page');next.delete('list_y');}if(key==='selected'&&feed){next.set('list_y',String(Math.round(feed.scrollTop)));history.replaceState({...history.state,policyScroll:feed.scrollTop},'',`${location.pathname}?${next}`);}navigate(`${location.pathname}?${next}`);}
  function select(key,label,options){const control=h('select',{id:`policy-${key}`,'aria-label':L(label),onchange:e=>update(key,e.target.value)},h('option',{value:''},L(['All','全部'])),...options.map(([value,text])=>h('option',{value},L(text))));control.value=params.get(key)||'';filterBar.append(h('label',{for:`policy-${key}`},L(label),control));}
  if(!market)select('market',['Investment market','投资市场'],markets.map(m=>[m.manifest.id,m.manifest.name]));
  const jurisdictions=[...new Set([...Object.keys(JURISDICTIONS),...snapshot.instruments.map(i=>i.jurisdiction)])].map(id=>({id,label:JURISDICTIONS[id]||[id,id],count:snapshot.events.filter(e=>recordJurisdiction(snapshot,e)===id&&eventVerification(e).at).length}));
  select('jurisdiction',['Jurisdiction','司法辖区'],jurisdictions.map(j=>[j.id,j.label]));select('lifecycle',['Legal lifecycle','法律阶段'],Object.entries(STATE));select('mechanism',['Mechanism / topic','机制／主题'],TOPICS);select('deadline',['Deadline','期限'],[['upcoming',['Within 90 days','未来90天']]]);select('freshness',['Last verified','最近核实'],[['recent',['Within 7 days','最近7天']],['stale',['More than 7 days','超过7天']]]);select('strength',['Evidence strength','证据强度'],[['official',['Official source','官方来源']]]);select('review',['Investment review','投资复核'],[['pending',['Pending reassessment','待复核']]]);main.append(filterBar);
  const panel=params.get('panel')==='map'?'map':'feed';
  main.append(h('div',{class:'policy-switch policy-mobile-switch','aria-label':L(['Mobile policy view','移动端政策视图'])},...['feed','map'].map(id=>h('button',{type:'button','aria-pressed':String(panel===id),onclick:()=>update('panel',id)},L(id==='feed'?['Event feed','事件列表']:['Coverage map','覆盖地图'])))));
  const layout=h('div',{class:'policy-radar','data-panel':panel});
  const map=h('div',{class:'policy-map','aria-busy':'true'});const mapPane=h('section',{class:'policy-map-pane'},h('h2',{},L(['Coverage and jurisdiction','覆盖与辖区'])),map,h('p',{class:'policy-meta'},L(['Pins show verified event coverage, not investment scores. A zero count means no confirmed coverage; NEM and WA remain separate.','标记表示已核实事件的覆盖，并非投资评分。零表示尚无确认覆盖；NEM与西澳保持独立。'])),h('div',{class:'policy-jurisdictions'},...jurisdictions.map(j=>h('button',{type:'button','aria-pressed':String(params.get('jurisdiction')===j.id),onclick:()=>update('jurisdiction',params.get('jurisdiction')===j.id?'':j.id)},`${L(j.label)} · ${j.count}`))));
  const events=filterEvents(snapshot,params,marketId);const page=Math.max(0,Math.min(Number(params.get('page'))||0,Math.max(0,Math.ceil(events.length/20)-1)));feed=h('div',{class:'policy-feed',tabindex:'0','aria-label':L(['Policy event feed','政策事件列表'])});
  for(const event of events.slice(page*20,page*20+20)){
    const instrument=snapshot.instruments.find(i=>i.id===event.instrument);const claims=eventClaims(snapshot,event);
    feed.append(h('article',{class:'policy-event','data-policy-event':event.id},h('div',{class:'policy-tags'},h('span',{},recordJurisdiction(snapshot,event)),h('span',{},labelState(event.to)),h(eventVerification(event).at?'time':'span',{'data-policy-verification':eventVerification(event).at?'recorded':'pending',...(eventVerification(event).at?{datetime:eventVerification(event).at}:{})},verificationText(event))),h('button',{type:'button',onclick:()=>update('selected',event.id),'aria-expanded':String(params.get('selected')===event.id)},L(instrument.title)),h('p',{},L(event.summary)),h('div',{class:'policy-tags'},...new Set(claims.map(c=>L(MECHANISM[c.mechanism]))))));
  }
  if(!events.length)feed.append(empty(index?['No verified events match these filters.','没有符合筛选条件的已核实事件。']:['Verified policy coverage is not available yet. Unreviewed drafts are not shown as facts.','已核实政策覆盖尚不可用。未经复核的草案不会作为事实显示。']));
  layout.append(mapPane,h('section',{class:'policy-feed-pane'},h('h2',{},`${L(['Policy events','政策事件'])} · ${events.length}`),feed,h('div',{class:'policy-switch'},page>0?h('button',{type:'button',onclick:()=>update('page',String(page-1))},L(['Previous events','上一页事件'])):null,(page+1)*20<events.length?h('button',{type:'button',onclick:()=>update('page',String(page+1))},L(['Next events','下一页事件'])):null)));
  const selected=events.find(e=>e.id===params.get('selected'));
  if(selected){
    const instrument=snapshot.instruments.find(i=>i.id===selected.instrument);const stories=snapshot.stories.filter(s=>s.instrumentIds.includes(instrument.id));
    layout.append(h('aside',{class:'policy-preview',role:'region',tabindex:'-1','aria-label':L(['Policy preview','政策预览'])},h('button',{type:'button',class:'btn',onclick:()=>update('selected','')},L(['Close preview','关闭预览'])),h('h2',{},L(instrument.title)),h('p',{},L(selected.summary)),h('p',{class:'policy-meta'},`${labelState(selected.to)} · ${eventDateSummary(selected)} · ${verificationText(selected)}`),...eventClaims(snapshot,selected).map(c=>evidenceCard(snapshot,c)),reviewNotice(snapshot,selected.claimIds,markets),h('div',{class:'policy-links'},link(resourceURL('dossiers',instrument.id),['Open policy dossier','打开政策档案']),...stories.map(story=>link(resourceURL('stories',story.id),story.title)))));
  }
  main.append(layout);feed.scrollTop=Number(params.get('list_y'))||history.state?.policyScroll||0;
  main.addEventListener('keydown',e=>{if(e.key==='Escape'&&selected)update('selected','');});
  import('./map.js').then(({renderPolicyMap})=>{if(!map.isConnected)return;renderPolicyMap(map,{jurisdictions,selected:params.get('jurisdiction'),onSelect:id=>update('jurisdiction',params.get('jurisdiction')===id?'':id)});map.removeAttribute('aria-busy');}).catch(()=>{if(map.isConnected)map.replaceChildren(empty(['The map is unavailable. The event list and jurisdiction buttons remain usable.','地图暂不可用，事件列表和辖区按钮仍可使用。']));});
}
function renderHistory(main,{index,snapshot,route,marketIds}){
  const params=getParams();const version=params.get('version')||index.head;const ordinal=index.versions.indexOf(version);const previous=ordinal>0?index.versions[ordinal-1]:null;
  const section=h('section',{class:'policy-history'},h('h2',{},L(['Immutable history and corrections','不可变历史与更正'])),h('p',{class:'policy-meta'},`${L(['Version','版本'])}: ${version}`));
  const historyPage=Math.max(0,Number(params.get('history_page'))||0);const versions=[...index.versions].reverse();
  section.append(h('div',{class:'policy-links'},...versions.slice(historyPage*20,historyPage*20+20).map(hash=>{const p=getParams();p.set('version',hash);return link(`${location.pathname}?${p}`,[hash.slice(0,12),hash.slice(0,12)]);})),versions.length>(historyPage+1)*20?link(`${location.pathname}?${new URLSearchParams({...Object.fromEntries(params),history_page:String(historyPage+1)})}`,['Older versions','更早版本']):null);
  if(previous){
    const differences=h('div',{'aria-busy':'true'},h('p',{},L(['Loading exact before/after changes…','正在读取精确的前后变更…'])));section.append(differences);
    loadPolicySnapshot(index,{version:previous,marketIds}).then(before=>{
      if(!differences.isConnected)return;const changes=policyDiff(before,snapshot);const page=Math.max(0,Number(params.get('diff_page'))||0);differences.replaceChildren(h('h3',{},L(['What changed / why it matters','变更内容／影响机制'])),h('p',{},`${changes.length} ${L(['changed records; prior versions remain available.','条变更记录；旧版本仍可访问。'])}`),...changes.slice(page*20,page*20+20).map(change=>h('details',{},h('summary',{},`${change.kind} · ${change.id}`),h('h4',{},L(['Before','变更前'])),h('pre',{class:'policy-code'},JSON.stringify(change.before,null,2)),h('h4',{},L(['After','变更后'])),h('pre',{class:'policy-code'},JSON.stringify(change.after,null,2)))),changes.length>(page+1)*20?link(`${location.pathname}?${new URLSearchParams({...Object.fromEntries(params),diff_page:String(page+1)})}`,['More changes','更多变更']):null);differences.removeAttribute('aria-busy');
    }).catch(()=>{if(differences.isConnected)differences.replaceChildren(empty(['The prior verified version could not be loaded.','无法读取先前已核实版本。']));});
  }else section.append(h('p',{},L(['First published version. Corrections append history rather than rewriting it.','首个发布版本。更正会追加历史，而非覆盖历史。'])));
  main.append(section);
}
function renderDossier(main,{snapshot,index,route,markets}){
  const instrument=snapshot.instruments.find(i=>i.id===route.id);if(!instrument){main.append(heading(['POLICY DOSSIER','政策档案'],['No verified dossier at this address','此地址暂无已核实档案']),empty(['This instrument is unavailable in the selected published version.','所选发布版本不包含此政策文件。']));return;}
  const events=snapshot.events.filter(e=>e.instrument===instrument.id);const claims=snapshot.claims.filter(c=>c.instrument===instrument.id);const latest=events.at(-1);
  if(instrument.currentness)main.append(h('p',{class:'policy-meta','data-policy-currentness':instrument.currentness.status},L(['Current law: not established.','现行法律状态：尚未确立。'])+' '+L(instrument.currentness.scope)));
  if(instrument.provision){const parent=snapshot.instruments.find(i=>i.id===instrument.provision.parent);main.append(h('p',{class:'policy-meta'},L(['Provision-specific status','条款层级状态']),` · ${instrument.provision.locator} · `,link(resourceURL('dossiers',parent.id,getParams().get('version')),parent.title)));}
  const provisions=snapshot.instruments.filter(i=>i.provision?.parent===instrument.id);
  if(provisions.length)main.append(h('section',{class:'policy-provisions'},h('h2',{},L(['Separate provision commencement','条款分别生效'])),h('p',{},L(['The instrument status does not mean every provision has commenced. Open each cited schedule or clause for its own dates.','文件状态不代表所有条款均已生效。请逐项查看所引用附表或条款的日期。'])),h('ul',{},...provisions.map(i=>h('li',{},link(resourceURL('dossiers',i.id,getParams().get('version')),i.title),` · ${i.provision.locator} · ${labelState(i.state)}`)))));
  main.append(link(cleanBack(getParams().get('from')),['← Back to Radar context','← 返回雷达上下文']),heading(['POLICY DOSSIER','政策档案'],instrument.title),h('p',{class:'policy-meta'},`${instrument.jurisdiction} · ${instrument.officialId} · ${labelState(instrument.state)}`));
  const dates=[['Announcement','公告',latest?.announcedAt],['Published document','文件公布',latest?.publishedAt],['Document dated','文件落款',latest?.recordDatedAt],['Consultation closes','征询截止',latest?.consultationClosesAt],['Adopted','通过决定',latest?.adoptedAt],['Commencement / effective date','施行／生效日期',latest?.effectiveAt],['Last verified','最近核实',eventVerification(latest).at,eventVerification(latest).label]];
  main.append(h('dl',{class:'policy-dates'},...dates.map(([en,zh,value,fallback])=>h('div',{},h('dt',{},L([en,zh])),h('dd',{},value?date(value):fallback?L(fallback):unknown())))),reviewNotice(snapshot,claims.map(c=>c.id),markets),h('h2',{},L(['Instrument lifecycle','文件生命周期'])),h('ol',{class:'policy-timeline'},...events.map(e=>h('li',{},h('span',{class:'policy-meta'},eventDateSummary(e)+' · '+verificationText(e)),h('strong',{},` · ${labelState(e.to)}`),h('p',{},L(e.summary)),e.corrects?h('p',{},`${L(['Correction to','更正对象'])}: ${e.corrects}`):null))),h('h2',{},L(['Policy-only impact','政策层面影响'])),impactExhibits(snapshot,claims.map(c=>c.id)),h('h2',{},L(['Original evidence and interpretation','原始证据与解读'])),...claims.map(c=>evidenceCard(snapshot,c)));
  const stories=snapshot.stories.filter(s=>s.instrumentIds.includes(instrument.id));main.append(h('div',{class:'policy-links'},...stories.map(s=>link(resourceURL('stories',s.id,getParams().get('version')),s.title))));renderHistory(main,{index,snapshot,route,marketIds:markets.map(m=>m.manifest.id)});
}
function renderStory(main,{snapshot,index,route,markets}){
  const story=snapshot.stories.find(s=>s.id===route.id);if(!story){main.append(heading(['POLICY STORY','政策叙事'],['No verified story at this address','此地址暂无已核实叙事']),empty(['Unreviewed policy drafts are not published here.','此处不发布未经复核的政策草稿。']));return;}
  const params=getParams();const depth=['brief','guided','explorer'].includes(params.get('depth'))?params.get('depth'):'guided';main.classList.add('policy-story');
  main.append(link(cleanBack(params.get('from')),['← Back to Radar context','← 返回雷达上下文']),heading(['POLICY STORY · EVIDENCE GRAPH','政策叙事 · 证据图谱'],story.title),h('p',{},L(story.answer)),h('p',{class:'policy-meta'},L(['Policy interpretation is separate from the approved investment thesis.','政策解读独立于已批准投资论点。'])),reviewNotice(snapshot,story.claimIds,markets),h('nav',{class:'policy-links','aria-label':L(['Reading depth','阅读深度'])},...[[ 'brief',['30-second answer','30秒答案']],['guided',['5-minute guided story','5分钟引导叙事']],['explorer',['Evidence explorer','证据探索']]].map(([id,label])=>{const next=getParams();next.set('depth',id);return link(`${location.pathname}?${next}`,label,depth===id?'is-active':'',depth===id?{'aria-current':'page'}:{});})),h('h2',{},L(['What could change this policy interpretation','什么会改变本项政策解读'])),h('p',{},L(story.changesIf)));
  if(depth==='guided'){
    main.append(h('nav',{class:'policy-links','aria-label':L(['Story chapters','叙事章节'])},...story.chapters.map(c=>link(`#policy-section-${c.id}`,c.title))),...story.chapters.map(c=>h('article',{id:`policy-section-${c.id}`,'data-policy-section':c.id},h('h2',{},L(c.title)),h('p',{},L(c.text)),c.scene?renderPolicyScene(c.scene,snapshot):null,h('div',{class:'policy-links'},...c.claimIds.map(id=>link(`${location.pathname}?${new URLSearchParams({...Object.fromEntries(params),depth:'explorer'})}#claim-${id}`,['Inspect evidence','查看证据']))))));
    const section=params.get('section');if(section)main.querySelector(`[data-policy-section="${CSS.escape(section)}"]`)?.scrollIntoView({block:'start'});
    const observer=new IntersectionObserver(entries=>{if(!main.isConnected){observer.disconnect();return;}const visible=entries.find(e=>e.isIntersecting);if(visible){const p=getParams();p.set('section',visible.target.dataset.policySection);history.replaceState(history.state,'',`${location.pathname}?${p}`);}},{rootMargin:'-10% 0px -65% 0px'});main.querySelectorAll('[data-policy-section]').forEach(n=>observer.observe(n));
  }
  if(depth==='explorer')main.append(h('h2',{},L(['One canonical evidence graph','同一份规范证据图谱'])),impactExhibits(snapshot,story.claimIds),...story.claimIds.map(id=>evidenceCard(snapshot,snapshot.claims.find(c=>c.id===id))));
  main.append(h('div',{class:'policy-links'},...story.instrumentIds.map(id=>link(resourceURL('dossiers',id,params.get('version')),['Instrument dossier','政策文件档案']))));renderHistory(main,{index,snapshot,route,marketIds:markets.map(m=>m.manifest.id)});
}
function renderComparison(main,{snapshot,markets}){
  const pilots=['de','gb','nem','wa'];const names=pilots.map(id=>markets.find(m=>m.manifest.id===id)?.manifest.name||[id,id]);
  main.append(heading(['POLICY COMPARISON','政策比较'],['Compare mechanisms, keep the basis visible','比较机制，保留口径'],['Different rulebooks, dates and units do not become equivalent investment returns.','不同规则、日期与单位不会自动转化为等价投资回报。']),link('/policy',['← Global Policy Radar','← 全球政策雷达']));
  const rows=TOPICS.map(([mechanism,label])=>h('tr',{},h('th',{scope:'row'},L(label)),...pilots.map(market=>{
    const claims=snapshot.claims.filter(c=>c.markets.includes(market)&&c.mechanism===mechanism);
    return h('td',{},claims.length?claims.map(c=>h('div',{},h('p',{},L(c.text)),link(resourceURL('dossiers',c.instrument),['Source and legal scope','来源与法律范围']))):L(['No verified policy evidence','暂无已核实政策证据']));
  })));
  main.append(h('div',{class:'policy-table-scroll'},h('table',{},h('thead',{},h('tr',{},h('th',{scope:'col'},L(['Mechanism','机制'])),...names.map(name=>h('th',{scope:'col'},L(name))))),h('tbody',{},...rows))),h('h2',{},L(['Quantitative compatibility','量化口径兼容性'])));
  const impacts=pilots.map(id=>snapshot.impacts.find(i=>snapshot.claims.find(c=>c.id===i.claim)?.markets.includes(id)));
  const checks=[];for(let a=0;a<pilots.length;a++)for(let b=a+1;b<pilots.length;b++){const result=impactCompatibility(impacts[a],impacts[b]);checks.push(h('li',{},`${L(names[a])} / ${L(names[b])}: `,L(result.state==='comparable'?['Same declared basis; inspect sources','声明口径一致；请核查来源']:result.state==='not_available'?['Not available','暂无数据']:['Not comparable','不可比较']),h('p',{class:'policy-meta'},L(['Currency, denominator, period, technology, vintage, contract, tax and market definition must be declared and compatible.','币种、分母、期间、技术、时点、合同、税务及市场定义必须明确且兼容。']))));}
  main.append(h('ul',{},...checks));
}
export async function renderPolicyPage(app,{route,market=null,markets=[]}){
  const main=shell(app,market);main.append(empty(['Loading verified policy evidence…','正在读取已核实政策证据…']));main.setAttribute('aria-busy','true');
  try{
    const index=await loadPolicyIndex();const marketIds=markets.map(m=>m.manifest.id);const snapshot=index?await loadPolicySnapshot(index,{version:route.version||index.head,marketIds}):{instruments:[],events:[],claims:[],sources:[],stories:[],impacts:[],links:[],reviews:[]};
    if(!main.isConnected)return;main.replaceChildren();main.removeAttribute('aria-busy');
    if(route.kind==='dossier')return renderDossier(main,{snapshot,index,route,markets});
    if(route.kind==='story')return renderStory(main,{snapshot,index,route,markets});
    if(route.kind==='compare')return renderComparison(main,{snapshot,index,route,markets});
    renderRadar(main,{snapshot,index,route,market,markets});
  }catch{if(!main.isConnected)return;main.replaceChildren(heading(['POLICY INTELLIGENCE','政策情报'],['Verified policy evidence is unavailable','已核实政策证据暂不可用']),empty(['The published snapshot failed to load or validate. It has not been replaced with drafts or guessed facts.','发布快照未能读取或通过校验。系统不会以草稿或推测事实替代。']),link('/policy',['Return to the Radar','返回雷达']));main.removeAttribute('aria-busy');}
}
