import { tagHeadline } from '../governance/newsTags.js';
import { newsSearchText } from '../news/localization.js';

// Display geography only. Investment-market tagging keeps its existing owner.
export const JURISDICTIONS = {
  DE:['Germany','德国'], GB:['Great Britain','英国'], IT:['Italy','意大利'],
  IE:['Ireland','爱尔兰'], FI:['Finland','芬兰'], PL:['Poland','波兰'],
  RO:['Romania','罗马尼亚'], ES:['Spain','西班牙'],
  'AU-NEM':['Australia · NEM','澳大利亚 · NEM'], 'AU-WA':['Western Australia · WEM','西澳 · WEM'],
  JP:['Japan','日本'], US:['United States','美国'], CA:['Canada','加拿大'],
  SA:['Saudi Arabia','沙特阿拉伯'], EU:['European Union','欧盟'], NZ:['New Zealand','新西兰'],
  KZ:['Kazakhstan','哈萨克斯坦'], NL:['Netherlands','荷兰'], SE:['Sweden','瑞典'],
  CD:['DR Congo','刚果（金）'], MX:['Mexico','墨西哥'], CN:['China','中国'],
  HR:['Croatia','克罗地亚'], TR:['Türkiye','土耳其'],
};
const MARKET_JURISDICTION = {de:'DE',gb:'GB',it:'IT',ie:'IE',fi:'FI',pl:'PL',ro:'RO',es:'ES',nem:'AU-NEM',wa:'AU-WA',jp_tokyo:'JP',jp_kyushu:'JP',jp_hokkaido:'JP',pjm:'US',ercot:'US',caiso:'US',ca_on:'CA',sa:'SA'};
export const NEWS_CATEGORIES = {capital:['Capital & M&A','资本与并购'],policy:['Policy & trade','政策与贸易'],grid:['Grid & markets','电网与市场'],technology:['Technology','储能技术']};
const COUNTRY_TERMS = {US:/\b(?:United States|USA|American)\b|\bU\.S\.(?=\W|$)/i,CA:/\bCanad(?:a|ian)\b/i,EU:/\b(?:European Union|EU)\b/i,NZ:/\bNew Zealand\b/i};
const ADDITIONAL_COUNTRY_TERMS = {KZ:/\bKazakh(?:stan)?\b/i,NL:/\b(?:Netherlands|Dutch)\b/i,SE:/\b(?:Sweden|Swedish)\b/i,CD:/\b(?:DRC|DR Congo|Democratic Republic of (?:the )?Congo)\b/i,MX:/\bMexic(?:o|an)\b/i,CN:/\b(?:China|Chinese|Hong Kong)\b/i,HR:/\bCroatia(?:n)?\b/i,TR:/\b(?:Türkiye|Turkey|Turkish)\b/i,US:/\b(?:Louisiana|Indiana|Utah)\b/i};
export function newsJurisdictions(item, markets = tagHeadline(item)) {
  const found = new Set(markets.map(id => MARKET_JURISDICTION[id]).filter(Boolean));
  for (const [id, pattern] of Object.entries(COUNTRY_TERMS)) if (pattern.test(`${item.title} ${item.summary || ''}`)) found.add(id);
  for (const [id, pattern] of Object.entries(ADDITIONAL_COUNTRY_TERMS)) if (pattern.test(`${item.title} ${item.summary || ''}`)) found.add(id);
  // A currency conversion (US$ / US dollars) is not a geographic signal.
  if(/\bUS\b(?!\s*(?:\$|dollars?\b))/.test(`${item.title} ${item.summary || ''}`))found.add('US');
  return [...found];
}
export function newsItems(snapshot) {
  const seen = new Set();
  return [...(snapshot?.series || [])].filter(item => {
    if (!item || typeof item.title !== 'string' || typeof item.source !== 'string' || !Number.isFinite(Date.parse(item.t))) return false;
    try { const url = new URL(item.url); if (!['http:','https:'].includes(url.protocol) || url.username || url.password) return false; } catch { return false; }
    const key = `${item.source}:${item.title.trim().toLowerCase()}`;
    if (seen.has(key)) return false; seen.add(key); return true;
  }).map(item => {
    const markets = tagHeadline(item);
    return {...item, summary:typeof item.summary==='string'?item.summary:'', id:`news:${item.url}`, markets, jurisdictions:newsJurisdictions(item, markets)};
  }).sort((a,b) => b.t.localeCompare(a.t));
}
export function filterNews(items, params, market, now = Date.now()) {
  if (params.get('type') === 'policy' || ['lifecycle','mechanism','deadline','freshness','strength','review'].some(key => params.get(key))) return [];
  return items.filter(item => {
    const marketId = market || params.get('market');
    if (marketId && !item.markets.includes(marketId)) return false;
    const jurisdiction = params.get('jurisdiction');
    if (jurisdiction === 'unmapped' ? item.jurisdictions.length : jurisdiction && !item.jurisdictions.includes(jurisdiction)) return false;
    if (params.get('category') && item.category !== params.get('category')) return false;
    if (params.get('q') && !`${newsSearchText(item)} ${item.source}`.toLowerCase().includes(params.get('q').trim().toLowerCase())) return false;
    const days = Number(params.get('period'));
    return !days || Date.parse(item.t) >= now - days * 86400000;
  });
}
export function coverageRows(events, items, jurisdictionOf) {
  const ids = new Set([...Object.keys(JURISDICTIONS), ...events.map(jurisdictionOf), ...items.flatMap(i => i.jurisdictions)]);
  return [...ids].filter(Boolean).map(id => {
    const policyCount = events.filter(event => jurisdictionOf(event) === id).length;
    const newsCount = items.filter(item => item.jurisdictions.includes(id)).length;
    return {id,label:JURISDICTIONS[id] || [id,id],policyCount,newsCount,count:policyCount+newsCount};
  });
}
export async function loadNews() {
  const response = await fetch('/data/public/industry-news.json', {cache:'no-cache'});
  if (!response.ok) throw new Error('news_snapshot_unavailable');
  const snapshot = await response.json();
  if (!Array.isArray(snapshot.series)) throw new Error('news_snapshot_invalid');
  return {snapshot,items:newsItems(snapshot)};
}
