/* Deliberate authoring migration, not an ETL or model/fixture generator.
   Copies only the explicitly selected, token-free signed-script paragraphs.
   Run after editing the mapping; review generated prose as public-review drafts. */
import { mkdir, writeFile } from 'node:fs/promises';
import { loadMarkers, scanText } from './lib/markers.mjs';
import { PUBLIC_CATALOG } from '../src/experience/story/public/catalog.js';
import { ERCOT_STORY_SOURCES } from '../src/markets/ercot/data/storyEvidence.js';
import { composeStory,SHARED_SHOTS,JP_CLAIMS } from '../src/markets/jp/story.js';
import { RO_STORY_SOURCES } from '../src/markets/ro/data/storyEvidence.js';
import { PL_STORY_SOURCES } from '../src/markets/pl/data/capacityAuctions.js';
const pair = (en, zh) => [en, zh];
const config = {
  wa: { history:['wa-03'], system:['wa-01','wa-02'], mechanism:['wa-04'],
    payment:pair('AEMO allocates Capacity Credits after certification. Capacity availability, energy and system services are different obligations; an annual capacity price is not a fixed long-term tariff.', 'AEMO在认证后分配容量信用。容量可用性、电能量和系统服务对应不同义务；年度容量价格不是长期固定电价。'),
    constraint:pair('Solar at midday / evening reliability', '午间光伏／晚间可靠性'), payer:pair('Capacity Credits → availability payment', '容量信用 → 可用性付费') },
  nem: { history:['nem-02'], system:['nem-01'], mechanism:[],
    payment:pair('Energy trading earns the regional spot price and FCAS pays qualified services. A CIS or other underwriting award is a separate agreement: its floor, ceiling, payment cap, start and expiry must be read from the contract. An application is not an award.', '电能量交易按区域现货价格结算，FCAS为合格服务付费。CIS或其他收入支持中标是独立协议：收入下限、上限、支付限额、起始与到期条件须从合同核对。申请不等于中标。'),
    constraint:pair('Regional links limit shared prices', '区域联络线限制价格联通'), payer:pair('Energy + FCAS / separate award', '电能量＋FCAS／独立中标合同') },
  gb: { history:[], system:['gb-01'], mechanism:['gb-10','gb-09'],
    payment:pair('Trading, NESO response procurement, balancing settlement and Capacity Market agreements pay for different actions. A private toll can transfer dispatch rights for a fee during its term; the market itself does not grant that fee to every battery.', '交易、NESO响应采购、平衡结算和容量市场协议，为不同动作付费。私人租赁合同可在期限内以费用交换调度权；市场并不向所有电池授予这笔租赁费。'),
    constraint:pair('Separate frequency / connection access', '独立频率／并网准入'), payer:pair('Response · balancing · capacity', '响应 · 平衡 · 容量') },
  de: { history:[], system:['de-01','de-06'], mechanism:[],
    payment:pair('The public market pays trading and qualified balancing activity. A toll exchanges dispatch rights for contractual revenue during its term. Check charging costs, network costs, availability deductions and the merchant exposure after expiry. Capacity-procurement eligibility must be tested separately.', '公共市场为交易和合格平衡服务付费。租赁以调度权交换合同期内约定收入。须核对充电成本、电网成本、可用率扣款以及到期后的市场风险。容量采购资格须单独检验。'),
    constraint:pair('Renewable timing / network access', '风光出力时段／电网准入'), payer:pair('Captured spread / qualified balancing', '可捕获价差／合格平衡服务') },
  it: { history:[], system:['it-04'], mechanism:[],
    payment:pair('The capacity market pays per credited unit of power; MACSE procures stored energy and transfers the time-shifting use of that contracted energy. A contract’s unit, control rights and vintage must be kept together. A legacy illustration is not a current new-entry ranking.', '容量市场按计入功率付费；MACSE采购储存电量，并转移该签约电量的时移使用权。合同的计量单位、控制权和批次须一并核对。旧批次示例不能当作当前新进入者的排名。'),
    constraint:pair('South / islands → northern demand', '南部／岛屿 → 北部负荷'), payer:pair('Capacity MW / MACSE MWh', '容量MW／MACSE MWh') },
  ie: { history:[], system:['ie-01'], mechanism:[],
    payment:pair('Suppliers fund capacity through the market operator; energy trades in wholesale markets and the system operators procure services. Qualification and an accepted award matter separately. A historic system-services tariff does not establish a new entrant’s future revenue.', '售电商通过市场运营商为容量付费；电能量通过批发市场交易，系统运营商采购服务。资格与实际中标须分别核实。历史系统服务费率，不能确立新进入者未来的收入。'),
    constraint:pair('Island wind / frequency and energy', '岛屿风电／频率与电量'), payer:pair('Capacity · energy · services', '容量 · 电能量 · 服务') },
  ro: { history:['ro-02'], system:['ro-01','ro-04','ro-05'], mechanism:[],
    payment:pair('Trading and balancing pay market revenues. A private optimiser floor, if executed, is a different promise: inspect the payment, duration, fee, availability test and counterparty. Local reserve results are needed before treating a curve calibrated elsewhere as Romanian evidence.', '交易和平衡服务产生市场收入。已签署的私人优化商保底是另一种承诺：须核对付款、期限、费用、可用率测试和对手方。将境外标定曲线视为罗马尼亚证据之前，需要本地备用采购结果。'),
    constraint:pair('Solar surplus / coupled border limits', '光伏富余／耦合边境限制'), payer:pair('Energy spread / balancing awards', '电能量价差／平衡中标') },
  pl: { history:[], system:[], mechanism:[],
    payment:pair('A capacity agreement pays for availability and carries delivery penalties. A construction grant reimburses eligible build costs; it is not recurring operating revenue. Trading remains separate. Earlier capacity factors and a closed grant cohort cannot be applied to an unawarded new project.', '容量协议为可用性付费，并附带未履约罚则。建设补贴报销合格建设成本，不是持续运营收入。电力交易另行计算。早期容量系数和已关闭的补贴批次，不能套用到尚未中标的新项目。'),
    constraint:pair('Ageing coal fleet / award vintage', '老化煤电／中标批次'), payer:pair('Capacity ≠ construction grant', '容量付费 ≠ 建设补贴') },
  pjm: { history:[], system:[], mechanism:[],
    payment:pair('Electricity suppliers pay through PJM for capacity that cleared the auction. The resource must perform during emergencies. Accreditation determines how much nameplate power is counted; a high auction price does not lock the next delivery year. Energy and Regulation remain separate market activities.', '售电主体通过PJM为拍卖中出清的容量付费。资源须在紧急状态下履约。核定系数决定铭牌功率中有多少可计入；单次高价拍卖不锁定下一交付年度。电能量和调频仍属独立市场业务。'),
    constraint:pair('Accreditation / emergency delivery', '容量核定／紧急履约'), payer:pair('Cleared capacity → delivery year', '出清容量 → 单一交付年度') },
  caiso: { history:[], system:['caiso-02'], mechanism:['caiso-09','caiso-11'],
    payment:pair('Resource Adequacy is a bilateral obligation backed by deliverability and a retailer contract. The grid connection alone is insufficient. Sold RA capacity must satisfy market-offer and recharge requirements; trading can use only compatible remaining capability.', '资源充足性是以可交付性及售电主体合同为基础的双边义务，仅有并网连接不足以取得收入。已出售的RA容量须满足市场报价及再充电要求；交易只能使用与之兼容的剩余能力。'),
    constraint:pair('Solar midday / sunset net-load peak', '午间光伏／日落净负荷高峰'), payer:pair('Deliverability + RA contract', '可交付性＋RA合同') },
  fi: { history:['fi-03'], system:['fi-01','fi-02'], mechanism:['fi-09','fi-10'],
    payment:pair('Fingrid pays accepted reserve capability; activation energy follows each product’s settlement rules. Trading and any privately contracted optimiser floor are separate. Connected storage is potential competition, not a measure of qualified or awarded reserve supply.', 'Fingrid为获接受的备用能力付费；调用电量遵循各品种结算规则。交易及私人优化商保底另行核算。已并网储能代表潜在竞争，并不等于已获资格或已中标的备用供给。'),
    constraint:pair('Shared frequency / qualified headroom', '共享频率／合格响应裕度'), payer:pair('Accepted bid + delivered response', '获接受报价＋实际响应') },
};
const dir = new URL('../src/experience/story/public/content/', import.meta.url);
const markers = loadMarkers({required:true}).markers;
const timeline = {
  wa:[['2006','Energy and capacity market opens','电能量与容量市场运行'],['2023-10-01','Reformed market rules begin','改革后的市场规则实施']],
  nem:[['1998-12','Energy-only NEM opens','电能量核心的NEM运行'],['2021','Five-minute settlement begins','五分钟结算实施'],['2023','CIS pilot','CIS试点']],
  gb:[['2001','NETA replaces the Pool','NETA取代电力库'],['2005','BETTA covers Great Britain','BETTA覆盖大不列颠']],
  de:[['1998','Market opens to competition','市场向竞争开放'],['2015','Price-led reform choice','选择价格驱动改革']],
  it:[['2021','Central storage procurement decree','集中储能采购法令']],
  ie:[['2007','All-island SEM','全岛SEM'],['2018','I-SEM redesign','I-SEM新设计']],
  ro:[['2005-06-30','Two-sided day-ahead auction','双边日前竞价'],['2014-11','Four-market coupling','四国市场耦合'],['2021','European day-ahead coupling','欧洲日前耦合']],
  pl:[['2015','Industrial supply restrictions','工业供电受限'],['2017','Capacity market established','建立容量市场']],
  pjm:[['1927','Power pool begins','电力联营开始'],['2007/2008','Forward capacity auction delivery','远期容量拍卖交付'],['2022-12','Elliott tests emergency performance','Elliott检验紧急履约']],
  caiso:[['2006-06-01','System Resource Adequacy requirements','系统资源充足性要求'],['2013-10-17','Storage procurement order','储能采购决定']],
  fi:[['1998','Finland joins Elspot','芬兰加入Elspot'],['2023-04-16','Olkiluoto 3 regular production','Olkiluoto 3常规发电']],
};
await mkdir(dir,{recursive:true});
async function save(id, data){
  const text='/* Public edition: editorial review pending. Original approvals unchanged. */\nexport default '+JSON.stringify(data,null,2)+';\n';
  if(scanText(text,markers).length)throw new Error('Authoring confidentiality check failed');
  await writeFile(new URL(id+'.js',dir),text);
}
for(const [id,c] of Object.entries(config)){
  const {story}=await import('../src/markets/'+id+'/story.js');
  const sourceRegister=story.sources||({ro:RO_STORY_SOURCES,pl:PL_STORY_SOURCES}[id]);
  const shots=story.chapters.flatMap(ch=>ch.shots);
  const extracts=Object.fromEntries(['history','system','mechanism'].map(section=>[section,c[section].map(shotId=>{
    const shot=shots.find(s=>s.id===shotId);
    if(!shot || shot.copy.some(t=>/[{}]/.test(t)))throw new Error('Unresolved or missing signed excerpt: '+shotId);
    return {shotId,question:shot.question,text:shot.copy,claimIds:shot.claims,sourceIds:[...new Set(shot.claims.flatMap(k=>story.claims[k]?.sources||[]))]};
  })]));
  const basis=shots.filter(s=>({gb:['gb-02','gb-10'],de:['de-02','de-03','de-06'],it:['it-01','it-03','it-08'],ie:['ie-02','ie-03','ie-10'],pl:['pl-01','pl-02','pl-03','pl-10'],pjm:['pjm-01','pjm-02','pjm-03','pjm-07','pjm-10'],fi:['fi-04','fi-09','fi-10']}[id]||[]).includes(s.id)).map(s=>({shotId:s.id,claimIds:s.claims,sourceIds:[...new Set(s.claims.flatMap(k=>story.claims[k]?.sources||[]))]}));
  const selected=new Set([...Object.values(extracts).flat(),...basis].flatMap(s=>s.sourceIds));
  // Public reorganisation also refers readers to the existing script's primary
  // source register. No source fact is upgraded to a new approval by this copy.
  const sources=Object.fromEntries(Object.entries(sourceRegister).filter(([k,v])=>!k.startsWith('REPO') && /^https:/.test(v.url)).map(([k,v])=>[k,{title:v.title,url:v.url,checkedOn:v.checkedOn,locator:v.locator,reuse:v.reuse}]));
  const slug={wa:'western-australia',gb:'great-britain',de:'germany',it:'italy',ie:'ireland',ro:'romania',pl:'poland',pjm:'pjm',caiso:'caiso',fi:'finland',nem:'nem'}[id];
  const chapterShots={history:c.history.length?c.history:basis.map(s=>s.shotId),system:c.system.length?c.system:basis.map(s=>s.shotId),mechanism:c.mechanism.length?c.mechanism:basis.map(s=>s.shotId)};
  const sourceIdsByChapter=Object.fromEntries(Object.entries(chapterShots).map(([section,ids])=>[section,[...new Set(ids.flatMap(k=>shots.find(s=>s.id===k)?.claims||[]).flatMap(k=>story.claims[k]?.sources||[]))]]));
  await save(id,{marketId:id,legacyVersion:story.contentVersion,script:'docs/immersive-experience-plan/'+({wa:'western-australia',gb:'great-britain',de:'germany',it:'italy',ie:'ireland',ro:'romania',pl:'poland',fi:'finland'}[id]||id)+'-storyboard.md',extracts,basis,timeline:timeline[id],sourceIdsByChapter,payment:c.payment,constraint:c.constraint,payer:c.payer,sources,sourceIds:[...selected],legacyScope:story.reviewedAgainst});
}
await save('ercot',{
  marketId:'ercot',legacyVersion:'2026-11-01',script:'docs/immersive-experience-plan/ercot-storyboard.md',
  legacyScope:{lens:'infraFund',playRef:'ercot-toll-2h',on:'2026-11-01',gate:'G-1 only'},extracts:{history:[],system:[],mechanism:[]},
  timeline:[['2021-02','Winter Storm Uri','Uri寒潮'],['2023-06-10','ECRS procurement begins','ECRS开始采购'],['2025-12-05','Real-time co-optimisation','实时联合优化']],
  background:pair('ERCOT serves most of Texas on a grid linked to neighbours mainly through direct-current ties. Connect-and-manage permits entry without first completing all wider network upgrades; it does not guarantee unconstrained dispatch.', 'ERCOT在主要通过直流联络线连接邻区的电网上服务德州大部分地区。“连接并管理”允许在全部广域网络升级完成之前接入，但不保证调度不受约束。'),
  payment:pair('Energy and ancillary-service awards pay for different actions. Scarcity revenues vary with system conditions and competition. An executed private toll transfers dispatch rights for contractual revenue; a modelled toll is not a signed or publicly disclosed market tariff.', '电能量与辅助服务中标，为不同动作付费。稀缺收入随系统条件与竞争变化。已签私人租赁合同以调度权交换约定收入；模型中的租赁费既不是已签合同，也不是公开市场费率。'),
  constraint:pair('Fast entry / scarce scarcity hours', '快速进入／稀缺时段有限'),payer:pair('Energy + reserves / private toll', '电能量＋备用／私人租赁'),
  sources:Object.fromEntries(Object.entries(ERCOT_STORY_SOURCES).filter(([,v])=>/^https:/.test(v.url)).map(([k,v])=>[k,{title:v.title,url:v.url,checkedOn:v.checkedOn,locator:v.locator,reuse:v.reuse}])),
});
const originalJapanSources=composeStory('tokyo').sources;
const jpSources=Object.fromEntries(Object.entries(originalJapanSources).filter(([key,s])=>!key.startsWith('REPO')&&/^https:/.test(s.url)));
await save('jp',{
  shared:true,legacyVersion:'2026-11-05',script:'docs/immersive-experience-plan/japan-storyboard.md',legacyScope:{lens:'infraFund',route:'ltda',stage:'operating',on:'2026-11-05'},
  timeline:[['2011','Earthquake and supply shock','地震与供给冲击'],['2015','OCCTO coordination','OCCTO协调'],['2016','Retail opening','售电开放'],['2020','Grid legal separation','电网法律分离']],
  background:pair('Japan’s regional grids developed separately. After the 2011 earthquake, system reform introduced OCCTO coordination in 2015, full retail opening in 2016 and legal separation of grid businesses in 2020. The eastern and western systems exchange power through frequency converters.', '日本各区域电网分别发展。2011年地震之后，系统改革于2015年引入OCCTO协调、2016年全面开放售电、2020年完成电网业务法律分离。东部与西部系统经变频站交换电力。'),
  payment:pair('National capacity auctions and long-term decarbonisation awards have different terms. A long-term winner receives contracted capacity payments, must meet discharge and performance obligations, and returns most other-market profit under the applicable rules. The capacity award does not remove regional charging or connection constraints.', '全国容量拍卖与长期脱碳中标采用不同期限。长期中标者取得合同容量付费，须满足放电与履约义务，并按适用规则返还大部分其他市场利润。容量中标不能消除区域充电或并网约束。'),
  sources:jpSources,
  nationalSourceIds:[...new Set(['jp-01','jp-02','jp-03','jp-04','jp-05','jp-06','jp-11'].flatMap(id=>SHARED_SHOTS[id].claims).flatMap(id=>JP_CLAIMS[id]?.sources||[]))].filter(id=>jpSources[id]),
  internalReferencesByRegion:Object.fromEntries(['jp_tokyo','jp_kyushu','jp_hokkaido'].map(id=>[id,Object.fromEntries(Object.entries(originalJapanSources).filter(([key])=>key.startsWith('REPO')).map(([key,s])=>[key,{...s,url:s.url.replaceAll('{areaSlug}',{jp_tokyo:'japan-tokyo',jp_kyushu:'japan-kyushu',jp_hokkaido:'japan-hokkaido'}[id])}]))])),
  regions:{
    jp_tokyo:{constraint:pair('Demand centre / converter and queue', '负荷中心／变频站与队列'),payer:pair('National award / local connection', '全国中标／本地并网'),shots:['jp-tokyo-07','jp-tokyo-10']},
    jp_kyushu:{constraint:pair('Solar surplus / Kanmon export limit', '光伏富余／关门外送限制'),payer:pair('Award / conditional charging access', '中标／有条件充电准入'),shots:['jp-kyushu-07','jp-kyushu-10']},
    jp_hokkaido:{constraint:pair('Controlled charging / Honshu link', '受控充电／本州联络线'),payer:pair('Award / charging obligations', '中标／充电条件'),shots:['jp-hokkaido-07','jp-hokkaido-10']},
  },
  regionalEvidence:Object.fromEntries(['jp_tokyo','jp_kyushu','jp_hokkaido'].map(id=>{const s=composeStory(id);const ids=new Set(s.chapters.flatMap(c=>c.shots).filter(t=>t.id.includes(id.slice(3))).flatMap(t=>t.claims).flatMap(k=>s.claims[k]?.sources||[]));return [id,[...ids]];})),
});
console.log('Authored 12 individual public packs + one shared Japan pack; all public approvals pending.');
