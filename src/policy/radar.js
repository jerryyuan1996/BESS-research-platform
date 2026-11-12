import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { navigate } from '../app/router.js';
import { link } from '../experience/chrome.js';
import { eventVerification } from '../../policy/dates.mjs';
import { JURISDICTIONS, NEWS_CATEGORIES, filterNews, coverageRows } from './intelligence.js';
import { newsTextPair,hasNewsTranslation } from '../news/localization.js';
import { SOURCE_CHECKS,SOURCE_CHECK_DATE } from './source-checks.js';

const POLICY_FILTERS = ['lifecycle','mechanism','deadline','freshness','strength','review'];
const NEWS_FILTERS = ['category','period'];
const TYPES = [['',['All intelligence','全部情报']],['policy',['Policy','政策']],['news',['Industry news','行业新闻']]];
let returnToItem = null;

export function renderIntelligenceRadar(main, {snapshot,index,market,markets,news,policyError,newsError}, helpers) {
  const {filterEvents,recordJurisdiction,eventClaims,labelState,eventDateSummary,verificationText,evidenceCard,reviewNotice,resourceURL,date,STATE,TOPICS} = helpers;
  const params = new URLSearchParams(location.search), marketId = market?.manifest.id;
  let feed;
  function update(key,value) {
    if(key==='selected'&&!value)returnToItem=params.get('selected');
    const next = new URLSearchParams(location.search);
    value ? next.set(key,value) : next.delete(key);
    if (key === 'type') for (const field of [...POLICY_FILTERS,...NEWS_FILTERS]) next.delete(field);
    if (POLICY_FILTERS.includes(key) && value) { next.set('type','policy'); for (const field of NEWS_FILTERS) next.delete(field); }
    if (NEWS_FILTERS.includes(key) && value) { next.set('type','news'); for (const field of POLICY_FILTERS) next.delete(field); }
    if (!['selected','panel','page'].includes(key)) { next.delete('selected'); next.delete('page'); next.delete('list_y'); }
    if (key === 'page') next.delete('selected');
    if (key === 'selected' && feed) next.set('list_y',String(Math.round(feed.scrollTop)));
    navigate(`${location.pathname}${next.size?'?'+next:''}`);
  }
  const countryOf = event => recordJurisdiction(snapshot,event);
  const scope = new URLSearchParams(params); scope.delete('jurisdiction');
  const coverage = coverageRows(filterEvents(snapshot,scope,marketId),filterNews(news?.items || [],scope,marketId),countryOf);
  const events = filterEvents(snapshot,params,marketId), items = filterNews(news?.items || [],params,marketId);
  const totalEvents=filterEvents(snapshot,new URLSearchParams(),marketId);
  const totalNews=filterNews(news?.items||[],new URLSearchParams(),marketId);
  const entries = [...events.map(event=>({kind:'policy',id:event.id,event,t:eventVerification(event).at || ''})), ...items.map(item=>({kind:'news',id:item.id,item,t:item.t}))].sort((a,b)=>b.t.localeCompare(a.t)||a.id.localeCompare(b.id));
  const page = Math.max(0,Math.min(Math.floor(Number(params.get('page')))||0,Math.max(0,Math.ceil(entries.length/20)-1)));
  main.append(h('div',{class:'policy-heading'},h('div',{},h('div',{class:'policy-kicker'},L(['POLICY & INDUSTRY INTELLIGENCE','政策与行业情报'])),
    h('h1',{},market?`${L(market.manifest.name)} · ${L(['Intelligence radar','情报雷达'])}`:L(['Global intelligence radar','全球情报雷达'])),
    h('p',{class:'policy-meta'},L(['Follow policy evidence and industry developments, market by market.','沿着市场，追踪政策证据与行业动态。'])))),
    h('div',{class:'intelligence-summary'},
      h('div',{},h('strong',{},String(totalEvents.length)),h('span',{},L(['Policy events','政策事件'])),h('small',{},index?`${L(['Historical snapshot','历史快照'])} · ${date(index.publishedAt)}`:L(['No verified snapshot available','暂无已核实快照']))),
      h('div',{},h('strong',{},String(totalNews.length)),h('span',{},L(['Industry headlines','行业新闻'])),h('small',{},news?`${L(['Feed checked','新闻源检查'])} · ${date(news.snapshot.fetchedAt)}`:L(['Feed unavailable','新闻源暂不可用']))),
      h('div',{},h('strong',{},String(coverage.filter(row=>row.count).length)),h('span',{},L(['Regions in view','当前覆盖区域'])),h('small',{},L(['Select a pin to explore','点击地图标记查看'])))),
    h('div',{class:'policy-links'},link('/policy/compare',['Compare policy mechanisms','比较政策机制']),h('a',{href:'#event-watch',onclick:()=>{watch.open=true;}},L(['Opportunities, risks & calendar ↓','机会、风险与日历 ↓'])),market?link(`/markets/${market.manifest.slug}`,['Back to market','返回市场']):null));
  const typeBar = h('div',{class:'policy-switch intelligence-types',role:'group','aria-label':L(['Information type','情报类型'])},...TYPES.map(([id,label])=>h('button',{type:'button','data-intelligence-type':id||'all','aria-pressed':String((params.get('type')||'')===id),onclick:()=>update('type',id)},L(label))));
  const filters=h('form',{class:'policy-filters','aria-label':L(['Intelligence filters','情报筛选']),onsubmit:e=>{e.preventDefault();update('q',search.value.trim());}});
  function select(host,key,label,options) {
    const control=h('select',{id:`policy-${key}`,'aria-label':L(label),onchange:e=>update(key,e.target.value)},h('option',{value:''},L(['All','全部'])),...options.map(([value,text])=>h('option',{value},L(text))));
    control.value=params.get(key)||'';host.append(h('label',{for:`policy-${key}`},L(label),control));
  }
  if(!market)select(filters,'market',['Investment market','投资市场'],markets.map(m=>[m.manifest.id,m.manifest.name]));
  select(filters,'jurisdiction',['Jurisdiction','司法辖区'],[...coverage.map(row=>[row.id,row.label]),['unmapped',['Global / location unspecified','全球／地区未明确']]]);
  const search=h('input',{type:'search',name:'q',value:params.get('q')||'',placeholder:L(['Search titles and summaries','搜索标题与摘要']),'aria-label':L(['Search intelligence','搜索情报'])});
  filters.append(h('label',{class:'intelligence-search'},L(['Search','搜索']),h('div',{},search,h('button',{type:'submit'},L(['Search','搜索'])))));
  if(params.size)filters.append(h('button',{type:'button',class:'intelligence-reset',onclick:()=>navigate(location.pathname)},L(['Reset filters','重置筛选'])));
  const advanced=h('details',{class:'intelligence-advanced',...([...POLICY_FILTERS,...NEWS_FILTERS].some(key=>params.get(key))?{open:''}:{})},h('summary',{},L(['More filters','更多筛选'])));
  const policyFields=h('div',{class:'policy-filters'}),newsFields=h('div',{class:'policy-filters'});
  select(policyFields,'lifecycle',['Legal lifecycle','法律阶段'],Object.entries(STATE));select(policyFields,'mechanism',['Mechanism / topic','机制／主题'],TOPICS);
  select(policyFields,'deadline',['Deadline','期限'],[['upcoming',['Within 90 days','未来90天']]]);select(policyFields,'freshness',['Author source check','作者来源检查'],[['recent',['Within 7 days','最近7天']],['stale',['More than 7 days','超过7天']]]);
  select(policyFields,'strength',['Evidence strength','证据强度'],[['official',['Official source','官方来源']]]);select(policyFields,'review',['Investment review','投资复核'],[['pending',['Pending reassessment','待复核']]]);
  select(newsFields,'category',['News topic','新闻主题'],Object.entries(NEWS_CATEGORIES));select(newsFields,'period',['News published','新闻发布日期'],[['7',['Last 7 days','最近7天']],['30',['Last 30 days','最近30天']],['90',['Last 90 days','最近90天']]]);
  advanced.append(h('h3',{},L(['Policy filters','政策筛选'])),policyFields,h('h3',{},L(['News filters','新闻筛选'])),newsFields);
  main.append(typeBar,filters,advanced);
  if(policyError)main.append(h('div',{class:'intelligence-load-status',role:'status'},h('h2',{},L(['Verified policy evidence is unavailable','已核实政策证据暂不可用'])),h('p',{},L(['The policy snapshot could not be validated. Available news remains readable.','政策快照未能通过读取或校验，仍可阅读已获取的新闻。']))));
  else if(!index)main.append(h('p',{class:'policy-meta'},L(['No verified policy snapshot has been published.','尚未发布已核实政策快照。'])));
  if(newsError)main.append(h('p',{class:'intelligence-load-status',role:'status'},L(['News could not be loaded. Policy evidence remains available.','新闻暂时无法加载，政策证据仍可使用。'])));
  const panel=params.get('panel')==='map'?'map':'feed';
  main.append(h('div',{class:'policy-switch policy-mobile-switch','aria-label':L(['Mobile radar view','移动端雷达视图'])},...['feed','map'].map(id=>h('button',{type:'button','aria-pressed':String(panel===id),onclick:()=>update('panel',id)},L(id==='feed'?['Event feed','事件列表']:['Coverage map','覆盖地图'])))));
  const map=h('div',{class:'policy-map','aria-busy':'true'});
  const countLabel=row=>`${L(['Policy','政策'])} ${row.policyCount} · ${L(['News','新闻'])} ${row.newsCount}`;
  const mapPane=h('section',{class:'policy-map-pane'},h('div',{class:'intelligence-pane-heading'},h('h2',{},L(['Where the signals are','动态发生在哪里'])),h('span',{class:'policy-meta'},L(['Select a region','选择区域']))),map,
    h('div',{class:'intelligence-legend'},h('span',{class:'intelligence-policy-key'},L(['Policy evidence','政策证据'])),h('span',{class:'intelligence-news-key'},L(['Industry news','行业新闻']))),
    h('p',{class:'policy-meta'},L(['Counts follow the filters. News locations come from headline and excerpt tags; unspecified locations stay in the list.','数量随筛选变化；新闻地区来自标题与摘要标签，地区未明确的新闻保留在列表中。'])),
    h('div',{class:'policy-jurisdictions'},...coverage.filter(row=>row.count||params.get('jurisdiction')===row.id).map(row=>h('button',{type:'button','data-jurisdiction':row.id,'aria-label':`${L(row.label)} · ${countLabel(row)}`,'aria-pressed':String(params.get('jurisdiction')===row.id),onclick:()=>update('jurisdiction',params.get('jurisdiction')===row.id?'':row.id)},h('span',{},L(row.label)),h('small',{},countLabel(row))))));
  feed=h('div',{class:'policy-feed',tabindex:'0','aria-label':L(['Intelligence event feed','情报事件列表'])});
  const newsTitle=item=>h('button',{type:'button','aria-expanded':String(params.get('selected')===item.id),onclick:()=>update('selected',item.id)},L(newsTextPair(item)));
  for(const entry of entries.slice(page*20,page*20+20)) {
    if(entry.kind==='news') { const item=entry.item;feed.append(h('article',{class:'intelligence-news policy-event-card','data-news-item':item.id},h('div',{class:'policy-tags'},h('span',{class:'intelligence-kind news'},L(['Industry news','行业新闻'])),h('span',{},item.source),h('time',{datetime:item.t},`${L(['Published','发布'])} ${date(item.t)}`)),newsTitle(item),item.summary?h('p',{},L(newsTextPair(item,'summary')).replace(/\s*The post[\s\S]*$/,'')):null,h('div',{class:'policy-tags'},h('span',{},L(NEWS_CATEGORIES[item.category]||['Industry','行业'])),...item.jurisdictions.map(id=>h('span',{},L(JURISDICTIONS[id]||[id,id]))))));continue; }
    const event=entry.event,instrument=snapshot.instruments.find(i=>i.id===event.instrument);
    feed.append(h('article',{class:'policy-event policy-event-card','data-policy-event':event.id},h('div',{class:'policy-tags'},h('span',{class:'intelligence-kind policy'},L(['Policy evidence','政策证据'])),h('span',{},countryOf(event)),h('span',{},labelState(event.to)),h('time',{'data-policy-verification':'recorded',datetime:eventVerification(event).at},verificationText(event))),h('button',{type:'button',onclick:()=>update('selected',event.id),'aria-expanded':String(params.get('selected')===event.id)},L(instrument.title)),h('p',{},L(event.summary))));
  }
  if(!entries.length)feed.append(h('div',{class:'policy-empty',role:'status'},L(['No intelligence matches these filters.','没有符合筛选条件的情报。'])));
  const layout=h('div',{class:'policy-radar','data-panel':panel,id:'radar'},mapPane,h('section',{class:'policy-feed-pane'},h('div',{class:'intelligence-pane-heading'},h('h2',{},`${L(['Latest intelligence','最新情报'])} · ${entries.length}`),h('span',{class:'policy-meta'},`${events.length} ${L(['policy','政策'])} / ${items.length} ${L(['news','新闻'])}`)),feed,
    h('div',{class:'policy-switch'},page>0?h('button',{type:'button',onclick:()=>update('page',String(page-1))},L(['Previous events','上一页事件'])):null,(page+1)*20<entries.length?h('button',{type:'button',onclick:()=>update('page',String(page+1))},L(['Next events','下一页事件'])):null)));
  const selected=entries.find(e=>e.id===params.get('selected'));
  let preview;
  if(selected) {
    preview=h('aside',{class:'policy-preview',role:'region',tabindex:'-1','aria-label':L(selected.kind==='policy'?['Policy preview','政策预览']:['News preview','新闻预览'])},h('button',{type:'button',class:'btn',onclick:()=>update('selected','')},L(['Close preview','关闭预览'])));
    if(selected.kind==='policy') { const event=selected.event,instrument=snapshot.instruments.find(i=>i.id===event.instrument),stories=snapshot.stories.filter(s=>s.instrumentIds.includes(instrument.id));
      preview.append(h('h2',{},L(instrument.title)),h('p',{},L(event.summary)),h('p',{class:'policy-meta'},`${labelState(event.to)} · ${eventDateSummary(event)} · ${verificationText(event)}`),...eventClaims(snapshot,event).map(c=>evidenceCard(snapshot,c)),reviewNotice(snapshot,event.claimIds,markets)||'',h('div',{class:'policy-links'},link(resourceURL('dossiers',instrument.id),['Open policy dossier','打开政策档案']),...stories.map(story=>link(resourceURL('stories',story.id),story.title))));
    } else { const item=selected.item;preview.append(h('h2',{},L(newsTextPair(item))),h('p',{class:'policy-meta'},`${item.source} · ${L(['Published','发布'])} ${date(item.t)}`),h('p',{},L(newsTextPair(item,'summary')).replace(/\s*The post[\s\S]*$/,'')),h('a',{href:item.url,target:'_blank',rel:'noopener noreferrer'},L(['Read the original article ↗','阅读原始报道 ↗'])),h('div',{class:'policy-links'},...item.markets.map(id=>{const m=markets.find(m=>m.manifest.id===id);return m?link(`/markets/${m.manifest.slug}`,m.manifest.name):null;}))); }
    layout.append(preview);
  }
  main.append(layout);feed.scrollTop=Number(params.get('list_y'))||0;
  if(preview){preview.focus({preventScroll:true});preview.scrollIntoView({block:'nearest',behavior:'instant'});}
  else if(returnToItem){main.querySelector(`[data-news-item="${CSS.escape(returnToItem)}"] button, [data-policy-event="${CSS.escape(returnToItem)}"] button`)?.focus({preventScroll:true});returnToItem=null;}
  main.addEventListener('keydown',e=>{if(e.key==='Escape'&&selected)update('selected','');});
  import('./map.js').then(({renderPolicyMap})=>{if(!map.isConnected)return;renderPolicyMap(map,{jurisdictions:coverage,selected:params.get('jurisdiction'),onSelect:id=>update('jurisdiction',params.get('jurisdiction')===id?'':id)});map.removeAttribute('aria-busy');}).catch(()=>{if(map.isConnected){map.removeAttribute('aria-busy');map.textContent=L(['Map unavailable; use the region buttons below.','地图暂不可用，可使用下方区域按钮。']);}});
  const watchHashes=['#event-watch','#bell','#calendar','#risk-watch'];
  const watch=h('details',{class:'intelligence-watch',id:'event-watch',...(watchHashes.includes(location.hash)?{open:''}:{})},h('summary',{},L(['Opportunities, risks & market calendar','机会提示、风险与市场日历'])));
  let watchLoaded=false;
  watch.addEventListener('toggle',async()=>{if(!watch.isConnected)return;history.replaceState(history.state,'',location.pathname+location.search+(watch.open?'#event-watch':''));if(!watch.open||watchLoaded)return;watchLoaded=true;try{const {renderEventWatch}=await import('../news/newsPage.js');if(watch.isConnected)renderEventWatch(watch,{headlines:news?.items||[],marketId:marketId||params.get('market')});}catch{watchLoaded=false;watch.append(h('p',{},L(['Calendar unavailable; reopen to retry.','日历暂不可用，重新展开可重试。'])));}});
  main.append(watch);
  const sources=h('details',{class:'intelligence-sources'},h('summary',{},L(['Sources & update status','来源与更新状态'])));
  const checkedSources=SOURCE_CHECKS.filter(s=>!(marketId||params.get('market'))||s.market===(marketId||params.get('market')));
  if(checkedSources.length)sources.append(h('h3',{},`${L(['Manual update · official source checks','本次更新 · 官方来源核对'])} · ${SOURCE_CHECK_DATE}`),h('ul',{class:'intelligence-source-checks'},...checkedSources.map(s=>h('li',{'data-policy-source-check':s.market},h('a',{href:s.url,target:'_blank',rel:'noopener noreferrer'},L(s.title)),h('small',{},L(s.mode==='collector'?['Direct collection succeeded','直接采集成功']:['Web reading checked; direct collection restricted','已通过网页阅读核对；直接采集受限']))))));
  sources.append(h('p',{class:'policy-meta','data-policy-historical-scope':'true'},L(['Policy events retain their recorded author source-check dates. A news-feed refresh does not reverify historical policy or establish current law.','政策事件保留原有作者来源检查日期。新闻更新不会重新核实历史政策，也不代表现行法律状态已确认。'])));
  for(const source of news?.snapshot.derived?.sourceStatus||[]) sources.append(h('p',{class:'policy-meta'},h('strong',{},source.source),' · ',L(source.status==='ok'?['Feed checked','新闻源检查成功']:source.status==='retained-previous'?['Previous items retained; latest fetch failed','本次获取失败，保留上次条目']:['Unavailable','暂不可用'])));
  sources.append(h('p',{class:'policy-meta'},L(['Chinese mode uses editorial translations of headlines and short feed summaries. English mode and source links retain the originals.','中文模式展示标题与短摘要的编辑译文；切换英文或打开来源链接可查看原文。'])));
  const untranslated=(news?.items||[]).filter(item=>!hasNewsTranslation(item)||(item.summary&&!hasNewsTranslation(item,'summary'))).length;
  if(untranslated)sources.append(h('p',{class:'policy-meta'},L([`${untranslated} new or revised articles await Chinese translation and display their original text.`,`${untranslated} 条新增或修订报道的中文译文待补，暂显示来源原文。`])));
  main.append(sources);
}
