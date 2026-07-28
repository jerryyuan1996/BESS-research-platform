// AUTO-GENERATED fixture generator. Runs the LEGACY prototype's normalization layer
// verbatim, in Node, and dumps its outputs. Used to prove the modular engine
// reproduces the prototype. Do not hand-edit.
const state = { lang: 'en', exitYear: 5 };
const FX = { AUD: 0.66, GBP: 1.27, EUR: 1.08 };   // USD per unit — illustrative mid-rates
const LIFE = 15;                                   // uniform comparison window, years
const EXIT_Y_CONTRACTED = 0.075;                   // exit discount on contracted cash flow
const EXIT_Y_MERCHANT  = 0.115;                    // exit discount on merchant + services cash flow
const EXIT_Y_OPEX      = 0.08;

const MARKETS = [
  { id:'wa', flag:'🇦🇺', short:['WA','西澳'], name:['Western Australia — WEM','西澳 — WEM'],
    href:'../WA%20Dashboard/WA_BESS_Dashboard_v3.html', color:'var(--s1)',
    status:['Selective','选择性投资'], composite:59, connRisk:43, satNote:'~2.4×',
    arch:['200 MW · 8h · RCM-led','200MW · 8小时 · RCM主导'],
    thesis:['Capacity-led islanded market. Duration is the product; the risk is timing, not thesis.',
            '容量主导的孤立市场。时长即产品；风险在时点而非逻辑。'],
    cur:'AUD', sym:'A$',
    econ:{ hours:8, capexPerMW:4160000, opexPerMW:18000,
      contracted:464000, contractYears:10, postFactor:0.85,   // 0.95 × 2028-29 BRCP; 10-yr fixed-price election
      merchGross:139000, feePct:8, services:12000, grantPct:0, degr:2,
      capNote:['RCM refund exposure; 10-yr fixed-price election','RCM退款敞口；10年固定价选择权'] } },
  { id:'gb', flag:'🇬🇧', short:['GB','英国'], name:['Great Britain','英国'],
    href:'../GB%20Dashboard/index.html', color:'var(--s5)',
    status:['Selective','选择性投资'], composite:57, connRisk:43, satNote:'~2.5×',
    arch:['100 MW · 2h · trading-led','100MW · 2小时 · 交易主导'],
    thesis:['Trading-led and connection-rationed. Returns are made by execution and contracted structure, not by the market.',
            '交易主导、并网配给。收益来自执行与合同结构，而非市场本身。'],
    cur:'GBP', sym:'£',
    econ:{ hours:2, capexPerMW:460000, opexPerMW:9000,
      contracted:5962, contractYears:15, postFactor:0.5,      // £27.10/kW × 0.22 de-rating
      merchGross:73145, feePct:10, services:4000, grantPct:0, degr:2,
      toll:57000, tollYears:LIFE,
      capNote:['CM availability obligation; stress-event penalties','容量市场可用性义务；紧张事件罚则'],
      tollNote:['Precedent tenors are shorter; assumed rollable','先例期限更短；假设可滚动续签'] } },
  { id:'ie', flag:'🇮🇪', short:['IE','爱尔兰'], name:['Ireland — SEM (all-island)','爱尔兰 — SEM（全岛）'],
    href:'../Ireland%20Dashboard/index-IE.html', color:'var(--s2)',
    status:['Selective','选择性投资'], composite:60, connRisk:48, satNote:'~10×',
    arch:['50 MW · 4h · CRM-led','50MW · 4小时 · 容量机制主导'],
    thesis:['The highest capacity pay per nameplate MW in the set — earned against a Reliability Option and an executed connection agreement.',
            '样本中每铭牌MW容量付费最高 — 但以可靠性期权及已签并网协议为前提。'],
    cur:'EUR', sym:'€',
    econ:{ hours:4, capexPerMW:1160000, opexPerMW:10000,
      contracted:98974, contractYears:10, postFactor:0.6,     // €149.96/kW × 0.66 de-rating
      merchGross:71200, feePct:9, services:8000, grantPct:0, degr:2,
      capNote:['Reliability Option difference payments above the strike','高于执行价时的可靠性期权差价支付'] } },
  { id:'ro', flag:'🇷🇴', short:['RO','罗马尼亚'], name:['Romania','罗马尼亚'],
    href:'../Romania%20Dashboard/index-RO.html', color:'var(--s3)',
    status:['Selective','选择性投资'], composite:61, connRisk:53, satNote:'~3.0×',
    arch:['50 MW · 2h · merchant + grant','50MW · 2小时 · 市场化+补贴'],
    thesis:['Best raw spread economics, zero contracted revenue. Structure — a grant plus a negotiated floor — has to do the work the market does not.',
            '原始价差经济性最佳，合同化收入为零。须由结构 — 补贴加谈判保底 — 承担市场未承担的职能。'],
    cur:'EUR', sym:'€',
    econ:{ hours:2, capexPerMW:630000, opexPerMW:8000,
      contracted:0, contractYears:0, postFactor:0,
      merchGross:55400, feePct:10, services:15000, grantPct:20, degr:2,
      grantNote:['Includes the 20% capital grant — formal award required','含20%资本补贴 — 须取得正式授予'] } },
  { id:'pl', flag:'🇵🇱', short:['PL','波兰'], name:['Poland','波兰'],
    href:'../Poland%20Dashboard/index-PL.html', color:'var(--s6)',
    status:['Selective','选择性投资'], composite:60, connRisk:51, satNote:'~13×',
    arch:['100 MW · 4h · capacity contract','100MW · 4小时 · 容量合同'],
    thesis:['The longest contract in the set makes storage conventional infrastructure. The auction — not the site — is where value is created.',
            '样本中期限最长的合同使储能成为常规基础设施。价值创造发生在拍卖，而非场址。'],
    cur:'EUR', sym:'€',
    econ:{ hours:4, capexPerMW:970000, opexPerMW:9000,
      contracted:39585, contractYears:17, postFactor:0.5,     // ≈€60.9/kW × 0.65 correction factor (seed, verify)
      merchGross:78000, feePct:9, services:10000, grantPct:10, degr:2,
      grantNote:['Includes a 10% capital-support assumption','含10%资本支持假设'],
      capNote:['17-yr contract outlives the 15-yr window','17年合同长于15年比较窗口'] } },
];
const MK = id => MARKETS.find(m => m.id === id);

const STRATS = [
  { id:'cap',  n:['Capacity-backed','容量支撑'], d:['Capacity / CRM contract + merchant + services','容量合同 + 市场化 + 系统服务'] },
  { id:'mer',  n:['Merchant','纯市场化'], d:['Merchant + services only — skip the capacity mechanism','仅市场化与系统服务 — 放弃容量机制'] },
  { id:'toll', n:['Tolled / floor','租赁/保底'], d:['Fixed toll replaces market exposure','以固定租赁付费取代市场敞口'] },
];

// ---------------- unified model ----------------
function npvOf(rate, cfs){ return cfs.reduce((a, c, i) => a + c / Math.pow(1 + rate, i), 0); }
function irrOf(cfs){
  let lo = -0.9, hi = 2.0;
  const f = r => npvOf(r, cfs);
  if (f(lo) * f(hi) > 0) return null;
  for (let k = 0; k < 80; k++){ const m = (lo + hi) / 2; if (f(lo) * f(m) <= 0) hi = m; else lo = m; }
  return (lo + hi) / 2;
}
const pvTail = (arr, r, from) => arr.slice(from).reduce((a, v, i) => a + v / Math.pow(1 + r, i + 1), 0);

// Per-MW cash case in USD. Returns null when the strategy has no basis in that market.
function runCase(m, strat, exitYear){
  const e = m.econ, fx = FX[m.cur];
  let cap = 0, cy = 0, post = 0, note = null;
  let merch = e.merchGross * (1 - (e.feePct || 0) / 100) * fx;
  let svc = (e.services || 0) * fx;
  let grant = e.capexPerMW * fx * (e.grantPct || 0) / 100;
  const capexG = e.capexPerMW * fx, opex = e.opexPerMW * fx;
  if (strat === 'cap'){
    if (!e.contracted) return { na:['No capacity mechanism','无容量机制'] };
    cap = e.contracted * fx; cy = Math.min(e.contractYears, LIFE); post = e.postFactor || 0;
    note = e.capNote || e.grantNote || null;
  } else if (strat === 'mer'){
    note = e.grantNote || null;
  } else if (strat === 'toll'){
    if (!e.toll) return { na:['No market precedent','无市场先例'] };
    merch = 0; svc = 0; grant = 0;
    cap = e.toll * fx; cy = Math.min(e.tollYears || LIFE, LIFE); post = 0;
    note = e.tollNote || null;
  }
  const net = capexG - grant;
  const capY = [], mchY = [], eb = [];
  for (let y = 1; y <= LIFE; y++){
    const c = y <= cy ? cap : cap * post;
    const mm = (merch + svc) * Math.pow(1 - (e.degr || 2) / 100, y - 1);
    capY.push(c); mchY.push(mm); eb.push(c + mm - opex);
  }
  const irrHold = irrOf([-net].concat(eb));
  let cum = -net, payback = null;
  for (let y = 1; y <= LIFE; y++){ cum += eb[y - 1]; if (cum >= 0 && payback == null) payback = y; }
  const X = exitYear;
  const exitVal = pvTail(capY, EXIT_Y_CONTRACTED, X) + pvTail(mchY, EXIT_Y_MERCHANT, X)
    - pvTail(Array(LIFE - X).fill(opex), EXIT_Y_OPEX, 0);
  const exFlows = [-net].concat(eb.slice(0, X)); exFlows[X] += exitVal;
  const irrExit = irrOf(exFlows);
  const cumOp = eb.slice(0, X).reduce((a, b) => a + b, 0);
  const moic = (cumOp + exitVal) / net;
  const contractedShare = eb[0] > 0 ? capY[0] / (capY[0] + mchY[0]) : 0;
  return { net, grant, capexG, eb1: eb[0], yield1: eb[0] / net, capY, mchY, eb,
    irrHold, payback, exitVal, irrExit, moic, cumOp, contractedShare,
    kwPerM: 1e6 / (net / 1000), note };
}
const CASE = (id, strat) => runCase(MK(id), strat, state.exitYear);
function baseStrat(m){ return m.econ.contracted ? 'cap' : 'mer'; }

const out = {};
for (const m of MARKETS){
  for (const s of STRATS){
    for (const X of [5, 7, 10]){
      const r = runCase(m, s.id, X);
      const key = m.id + '|' + s.id + '|' + X;
      out[key] = r.na ? { na: r.na[0] } : {
        net: r.net, capexG: r.capexG, grant: r.grant, eb1: r.eb1, yield1: r.yield1,
        irrHold: r.irrHold, payback: r.payback, exitVal: r.exitVal, irrExit: r.irrExit,
        moic: r.moic, cumOp: r.cumOp, contractedShare: r.contractedShare, kwPerM: r.kwPerM,
        capY0: r.capY[0], mchY0: r.mchY[0],
      };
    }
  }
}
console.log(JSON.stringify({ generatedFrom: 'legacy/global-cockpit-0727-v1.html', baseStrategies: Object.fromEntries(MARKETS.map(m => [m.id, baseStrat(m)])), cases: out }, null, 2));