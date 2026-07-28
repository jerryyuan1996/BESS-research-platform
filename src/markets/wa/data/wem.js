/* ---------------------------------------------------------------------------
   Real WA market data, verbatim from the prototype (lines 533-635).
   Western Power connection-queue insights, the operating fleet, the project
   pipeline register, and financing precedents.
   --------------------------------------------------------------------------- */


// ============================================================================
//  REAL MARKET DATA — wired in 2026-07 from two external source packs:
//   (1) Western Power "Major Customer Connections Insights", quarterly, June 2026  → WP_QUEUE
//   (2) Crestone "WA BESS RCM revenue forecast" / 西澳立项会材料 (2026-07-23)        → WA_FLEET / WA_PIPELINE / WA_FIN
//  Badged 'official' where the underlying figure is a published regulator/utility
//  value; 'illus' where a specific MW/MWh split was undisclosed and estimated.
// ============================================================================
const WP_QUEUE = {
  src: 'Western Power — Major Customer Connections Insights (quarterly), June 2026',
  // Access Offer Duration waterfall — average calendar months (report p.5).
  // Each stage is split into Western-Power time vs customer-led delay.
  aoDuration: [
    { l: ['Enquiry','问询'],       wp: 2.3, cust: 1.2 },
    { l: ['Initiation','启动'],    wp: 7.9, cust: 2.1 },
    { l: ['Scoping','方案'],       wp: 4.1, cust: 3.3 },
    { l: ['Planning','规划'],      wp: 4.1, cust: 2.4 },
  ],
  wpMonths: 18.4, custMonths: 9.0, totalMonths: 27.4,
  // Battery (BESS) connection-type by active stage (report p.6/7). dsoc = generation-side send-out MW.
  bessByStage: [
    { l: ['1. Enquiry','1. 问询'],          n: 19, dsoc: 2233 },
    { l: ['2. Initiation','2. 启动'],       n: 12, dsoc: 1641 },
    { l: ['3. Scoping','3. 方案'],          n: 2,  dsoc: 12 },
    { l: ['4. Planning','4. 规划'],         n: 3,  dsoc: 430 },
    { l: ['5. Construction','5. 建设与调试'], n: 7,  dsoc: 1580 },
    { l: ['6. Close out','6. 收口'],        n: 1,  dsoc: 100 },
  ],
  bessTotal:    { n: 44,  dsoc: 5996,  cmd: 6003 },
  genBessTotal: { n: 24,  dsoc: 6270,  cmd: 3709 },   // "Generator & BESS" combined connection type
  queueTotal:   { n: 244, dsoc: 31108, cmd: 15491 },
  region: [ {l:['Metro','都会'],n:72,pct:29.5}, {l:['North','北部'],n:67,pct:27.5}, {l:['South','南部'],n:65,pct:26.6}, {l:['East','东部'],n:40,pct:16.4} ],
  // Transmission enquiries over time — count of new projects by financial year (report p.8).
  enqYears:  ['FY20','FY21','FY22','FY23','FY24','FY25','FY26'],
  enqCounts: [15, 15, 45, 57, 68, 50, 61],
  quarter: { newEnq: 22, accessOffers: 3, newApps: 6 },   // movements this quarter (report p.9)
};

const WA_FLEET = {  // operating stock ~1.4 GW as at 2026 — ownership concentrated in Synergy & Neoen (deck slide 3)
  asOf: 2026, totalMW: 1385, totalMWh: 5740,
  rows: [
    { n: 'Kwinana BESS 1',    owner: 'Synergy', mw: 100, mwh: 200,  h: 2.0, cod: '2023' },
    { n: 'Kwinana BESS 2',    owner: 'Synergy', mw: 225, mwh: 900,  h: 4.0, cod: '2024/25' },
    { n: 'Neoen Collie St.1', owner: 'Neoen',   mw: 219, mwh: 877,  h: 4.0, cod: 'Oct-2024' },
    { n: 'Neoen Collie St.2', owner: 'Neoen',   mw: 341, mwh: 1363, h: 4.0, cod: '2025' },
    { n: 'Synergy Collie',    owner: 'Synergy', mw: 500, mwh: 2400, h: 4.8, cod: '2026' },
  ],
};

// Full WA BESS project universe with financing lens (deck slides 12–14).
//  st = stage id (matches SEED.stages);  cat = financing bucket A/B/C;  est = MW/MWh partly undisclosed.
const WA_PIPELINE = [
  { n:'Collie BESS St.1',        owner:'Neoen',                 mw:219, mwh:877,  cod:2024, st:'op',  cat:'A', fin:['Portfolio financed — A$1.1bn (Feb-2024)','组合融资 A$1.1bn'],       rev:['AEMO NCESS 4h + RCM','AEMO 4h + RCM'] },
  { n:'Collie BESS St.2',        owner:'Neoen',                 mw:341, mwh:1363, cod:2025, st:'op',  cat:'A', fin:['Portfolio financed — A$1.4bn (Dec-2024)','组合融资 A$1.4bn'],       rev:['300MW/4h AEMO + RCM','300MW/4h AEMO + RCM'] },
  { n:'Cunderdin Hybrid (BESS)', owner:'GPG (Naturgy)',         mw:55,  mwh:220,  cod:2025, st:'op',  cat:'A', fin:['Platform financed — A$2.3bn GPG','平台融资 A$2.3bn'],           rev:['No LT offtake; RCM + spot','无长约；RCM+现货'] },
  { n:'Merredin BESS',           owner:'Atmos + Nomad (JV)',    mw:100, mwh:400,  cod:2026, st:'con', cat:'A', fin:['FC Jun-2025; green-loan refi Dec-2025','2025年6月融资交割 + 绿色贷款再融资'],      rev:['CIS (Tender 2) + RCM','CIS + RCM'] },
  { n:'Waroona REP St.1',        owner:'Frontier Energy (FHE)', mw:81.5,mwh:562,  cod:2027, st:'com', cat:'A', fin:['Credit approved Jul-2026; FC ~Oct-2026','已批信贷；融资交割约10月'],       rev:['CIS (Tender 6) + RCM ~A$32m/yr','CIS + RCM约A$32m/年'] },
  { n:'Muchea Battery',          owner:'Neoen (Brookfield)',    mw:164, mwh:905,  cod:2027, st:'con', cat:'B', fin:['Balance sheet (Brookfield/Neoen)','表内融资'],                   rev:['CIS (Tender 2) + RCM','CIS + RCM'] },
  { n:'Wagerup BESS 1',          owner:'Alinta (Sembcorp)',     mw:100, mwh:200,  cod:2024, st:'op',  cat:'B', fin:['Balance sheet','表内融资'],                                     rev:['RCM + Alinta retail/gen','RCM + Alinta零售/发电'] },
  { n:'Wagerup BESS 2',          owner:'Alinta (Sembcorp)',     mw:300, mwh:null, cod:2027, st:'com', cat:'B', fin:['Balance sheet (~A$500m)','表内融资 ~A$500m'],                     rev:['RCM','RCM'] },
  { n:'Kwinana BESS 1',          owner:'Synergy (State)',       mw:100, mwh:200,  cod:2023, st:'op',  cat:'B', fin:['Government funded','政府出资'],                                  rev:['State-owned','国有资产'] },
  { n:'Kwinana BESS 2',          owner:'Synergy (State)',       mw:245, mwh:980,  cod:2026, st:'con', cat:'B', fin:['Government funded','政府出资'],                                  rev:['State-owned','国有资产'] },
  { n:'Collie BESS ESR4+ESR5',   owner:'Synergy (State)',       mw:540, mwh:2160, cod:2026, st:'con', cat:'B', fin:['Government funded (part of A$3.8bn)','政府出资（A$3.8bn的一部分）'], rev:['State-owned','国有资产'] },
  { n:'Boddington Giga Battery', owner:'PGS Energy',            mw:324, mwh:1200, cod:2027, st:'com', cat:'C', fin:['Unfinanced','尚未融资'],                                       rev:['CIS (Tender 2)','CIS'] },
  { n:'Yathroo Battery',         owner:'Neoen',                 mw:200, mwh:1600, cod:2028, st:'com', cat:'C', fin:['Unfinanced','尚未融资'],                                       rev:['CIS (Tender 6)','CIS'] },
  { n:'Collie Battery & Solar',  owner:'Enpowered + Plenary',   mw:200, mwh:1518, cod:2028, st:'com', cat:'C', fin:['Unfinanced','尚未融资'],                                       rev:['CIS (Tender 6)','CIS'] },
  { n:'Killawarra Hybrid',       owner:'Trina Solar',           mw:300, mwh:2100, cod:2028, st:'com', cat:'C', est:true, fin:['Unfinanced','尚未融资'],                              rev:['CIS (Tender 5)','CIS'] },
  { n:'Kemerton BESS',           owner:'Trina Solar',           mw:660, mwh:2640, cod:2028, st:'da',  cat:'C', fin:['Unfinanced (~A$400m)','尚未融资 ~A$400m'],                       rev:['None','无'] },
  { n:'Neerabup BESS',           owner:'Shell Energy',          mw:100, mwh:400,  cod:2028, st:'da',  cat:'C', fin:['Unfinanced','尚未融资'],                                       rev:['None','无'] },
  { n:'Kondinin BESS',           owner:'Shell + Foresight (JV)',mw:100, mwh:400,  cod:2028, st:'da',  cat:'C', est:true, fin:['Unfinanced','尚未融资'],                              rev:['Wind PPA w/ Synergy; BESS none','风电PPA；储能无'] },
  { n:'Narrogin BESS',           owner:'South Energy',          mw:200, mwh:800,  cod:2029, st:'da',  cat:'C', fin:['Unfinanced','尚未融资'],                                       rev:['None','无'] },
];

const WA_FIN = {
  // A. financed / bank debt approved (deck slide 12)
  financed: [
    { p:'Collie BESS St.1', size:'219MW / 877MWh', dev:'Neoen', when:'Feb-2024',
      struct:['A$1.1bn Australian portfolio facility across 1.5GW / 8 assets — not single-project debt.','A$1.1bn澳洲组合融资，覆盖1.5GW共8个资产；非单项目融资。'],
      banks:'ANZ · Bank of China · CEFC (A$55m) · CBA · CCB · HSBC · ING · Mizuho · MUFG · SocGen · Westpac (11)',
      rev:['AEMO NCESS 4h (2y from Oct-2024) + RCM credits','AEMO 4小时容量合约（2年）+ RCM'] },
    { p:'Collie BESS St.2', size:'341MW / 1,363MWh', dev:'Neoen', when:'Dec-2024',
      struct:['A$1.4bn second tranche (+1.3GW); 5.5y & 7y tenor. Two tranches >A$2bn / 15 assets.','A$1.4bn第二批（+1.3GW）；期限5.5与7年；两批合计逾A$2bn、15个资产。'],
      banks:'ANZ · Bank of China · CEFC (A$100m) · HSBC · ING · KfW IPEX · Mizuho · MUFG · SMBC · SocGen · Westpac (11)',
      rev:['300MW / 4h AEMO capacity (from Oct-2025) + RCM','300MW/4h AEMO合约（2025年10月起）+ RCM'] },
    { p:'Cunderdin Hybrid', size:'55MW / 220MWh BESS (+128MW PV)', dev:'GPG (Naturgy)', when:'Dec-2024',
      struct:['A$2.3bn GPG Australia platform facility on operating + under-construction portfolio — not project-level.','A$2.3bn GPG澳洲平台组合融资；非项目级。'],
      banks:'11 international banks (list undisclosed)',
      rev:['No public long-term offtake; RCM + spot / ESS','无公开长期offtake；依赖RCM+现货'] },
    { p:'Merredin BESS', size:'100MW / 400MWh', dev:'Atmos + Nomad (JV)', when:'FC 30-Jun-2025; refi Dec-2025',
      struct:['Folded into Atmos portfolio facility at FC; Dec-2025 green-loan refi (~1.6GW, oversubscribed); Igneo raised A$400m equity (Cbus, MLC, AMP).','融资交割时并入Atmos组合融资；2025年12月绿色贷款再融资（~1.6GW，超额认购）；Igneo募资A$400m。'],
      banks:'Bank of China · CCB Asia · BoCom · CBA · Rabobank · DBS · Deutsche · DNB · E.Sun · HSBC · ICBC Asia · ING · Mizuho · NAB · SocGen · Westpac (16)',
      rev:['CIS (Tender 2, Mar-2025) + RCM (2026/27 allocated)','CIS协议 + RCM（2026/27已获配）'] },
    { p:'Waroona REP St.1', size:'81.5MW / 562MWh (+132MW PV)', dev:'Frontier Energy (ASX:FHE)', when:'Credit approved 17-Jul-2026; FC ~Oct-2026',
      struct:['Up to A$280m fully-underwritten project debt + A$110m equity placement; debt ~70% of St.1, tenor up to 20y. Supersedes 2024 Infradebt A$215m mandate.','最高A$280m全额包销项目债务 + A$110m股权；债务约占70%，期限最长20年；取代2024年Infradebt授权。'],
      banks:'Natixis · SMBC (prior mandate: Infradebt)',
      rev:['CIS (Tender 6) + RCM ~A$32m/yr + LGC + energy/FCESS','CIS + RCM约A$32m/年 + LGC + 电能/FCESS'] },
  ],
  // Merchant-debt precedents — national NEM context (deck slide 15)
  merchant: [
    { p:'Bungama St.1', size:'150MW / 300MWh', mkt:'SA · NEM', note:['Closest to true pure-merchant BESS debt (Reuters: debt entirely on market revenue). Banks: CBA, Westpac, Export Development Canada.','最接近纯市场化融资；银行含CBA、Westpac、EDC。'] },
    { p:'Calala', size:'250MW / 500MWh', mkt:'NSW · NEM', note:['~60% merchant: 100MW SmartestEnergy contract; 150MW merchant with a Tesla Autobidder minimum-revenue guarantee.','约60%容量市场化；100MW有长约，150MW市场化带Tesla保底。'] },
  ],
  takeaway:['By 2025 Australia has produced 100%-merchant BESS debt precedents, but only in the eastern NEM. WA is smaller, more concentrated and rule-different (WEM ≠ NEM). For a first-time mid-cap sponsor, banks will likely require higher equity, completion support, cost-overrun cover, a debt-service reserve (DSRA) and a cash sweep.','截至2025年澳洲已出现100%市场化BESS融资先例，但均在东部NEM。西澳市场更小、资产更集中、规则不同（WEM≠NEM）。对首次进入的中型发起人，银行更可能要求较高股权比例、完工担保、成本超支兜底、还贷备用金(DSRA)与现金清扫(Cash Sweep)。'],
};

export { WP_QUEUE, WA_FLEET, WA_PIPELINE, WA_FIN };
