import { AUTHORITY } from '../governance/authority.js';
import {
  EVIDENCE_CONFIDENCE,
  EVIDENCE_STATUS,
  toBuildEvidence,
  validateEvidenceCollection,
} from '../governance/evidenceStatus.js';
import { capacityRevenue, saturationProxy } from '../economics/valueMetrics.js';

export const VALUE_DRIVER_MARKETS = Object.freeze([
  'wa', 'gb', 'ie', 'pl', 'ro', 'jp_hokkaido', 'jp_tokyo', 'jp_kyushu',
]);

export const VALUE_DRIVER_METRICS = Object.freeze([
  {
    id: 'duration',
    label: ['Duration evidence', '时长证据'],
    description: ['Official requirement or observed market duration; never the house archetype', '官方要求或市场观测时长；绝不使用内部假设项目'],
  },
  {
    id: 'saturation',
    label: ['Saturation proxy', '饱和度代理指标'],
    description: ['Named competition numerator divided by a named denominator', '明确的竞争供给分子除以明确的需求分母'],
  },
  {
    id: 'capacity-revenue',
    label: ['Capacity revenue', '容量收入'],
    description: ['Qualified MW × clearing price × de-rating; price-only cells remain proxies', '合格MW×出清价×折减系数；仅有价格时仍为代理指标'],
  },
  {
    id: 'capture-rate',
    label: ['Capture rate', '捕获率'],
    description: ['Realized BESS revenue divided by a same-window executable benchmark', '实际储能收入除以同窗口可执行基准'],
  },
  {
    id: 'curtailment',
    label: ['Curtailment', '弃电'],
    description: ['Energy rate preferred; event days shown only with their exact window', '优先使用电量比率；事件天数必须标明精确窗口'],
  },
  {
    id: 'area-basis',
    label: ['Area basis', '区域基差'],
    description: ['Area price minus the same-interval system benchmark', '区域价格减去同一时段系统基准价'],
  },
  {
    id: 'executable-spread',
    label: ['Executable spread', '可执行价差'],
    description: ['Mean daily best non-overlapping contiguous charge-then-discharge windows', '每日最佳不重叠连续充电后放电窗口的平均价差'],
  },
]);
/**
 * Investor-facing dimensions are deliberately separate from the governed
 * indicators above. A dimension may use a narrower, sourced indicator, but it
 * never turns that evidence into an intuition-only attractiveness score.
 */
export const VALUE_DRIVER_DIMENSIONS = Object.freeze([
  {
    id: 'cheap-energy-formation',
    label: ['Cheap Energy Formation', '低价电力形成'],
    description: ['Executable charge-to-discharge spread evidence', '可执行充放电窗口价差证据'],
    evidenceMetricId: 'executable-spread',
  },
  {
    id: 'peak-scarcity',
    label: ['Peak Scarcity', '高峰稀缺性'],
    description: ['Executable spread as observed scarcity evidence; not a scarcity score', '以可执行价差作为已观察稀缺性证据，而非主观稀缺评分'],
    evidenceMetricId: 'executable-spread',
  },
  {
    id: 'grid-constraint',
    label: ['Grid Constraint', '电网约束'],
    description: ['Official curtailed-energy or event evidence', '官方弃电电量或事件证据'],
    evidenceMetricId: 'curtailment',
  },
  {
    id: 'firm-capacity-value',
    label: ['Firm Capacity Value', '可靠容量价值'],
    description: ['Qualified capacity revenue, or a clearly labelled price proxy', '合格容量收入，或明确标注的价格代理值'],
    evidenceMetricId: 'capacity-revenue',
  },
  {
    id: 'flexibility-need',
    label: ['Flexibility Need', '灵活性需求'],
    description: ['Official or observed storage-duration evidence', '官方或已观察的储能时长证据'],
    evidenceMetricId: 'duration',
  },
  {
    id: 'bess-competition',
    label: ['BESS Competition', '储能竞争'],
    description: ['Named competition numerator divided by a named denominator', '明确的竞争供给分子除以明确的需求分母'],
    evidenceMetricId: 'saturation',
  },
  {
    id: 'revenue-visibility',
    label: ['Revenue Visibility', '收入可见性'],
    description: ['Realized BESS capture against an executable benchmark', '储能实际收入相对于可执行基准的捕获表现'],
    evidenceMetricId: 'capture-rate',
  },
  {
    id: 'forecast-confidence',
    label: ['Forecast Confidence', '预测置信度'],
    description: ['Backtested official or analyst forecast accuracy—not a qualitative grade', '经回测的官方或分析师预测准确性，而非定性评级'],
    evidenceMetricId: null,
    gap: ['No governed forecast-versus-outturn backtest is registered', '尚未登记受治理的预测与实际结果回测'],
    buildPlan: ['Register forecast vintages, freeze them, and score against later outturns', '登记并冻结预测版本，再与后续实际结果进行评分'],
  },
]);

const GAP = {
  duration: [
    ['No official like-for-like market duration series is registered', '尚未登记官方同口径市场时长序列'],
    ['Ingest operating MW and MWh or the applicable official duration rule', '接入在运MW与MWh，或适用的官方时长规则'],
  ],
  saturation: [
    ['No complete official competition numerator and matching denominator', '缺少完整官方竞争供给分子及匹配分母'],
    ['Build a coverage-labelled delivery funnel and define its denominator', '建设带覆盖率标识的交付漏斗并定义分母'],
  ],
  'capacity-revenue': [
    ['Applicable price, qualified MW or de-rating is missing', '适用价格、合格MW或折减系数缺失'],
    ['Ingest auction result and asset-specific qualification before calculating revenue', '接入拍卖结果及资产资格后再计算收入'],
  ],
  'capture-rate': [
    ['No public realized BESS revenue matched to the price window', '缺少与价格窗口匹配的公开储能实际收入'],
    ['Ingest realized dispatch revenue and compare with the executable benchmark', '接入实际调度收入并与可执行基准比较'],
  ],
  curtailment: [
    ['No comparable official curtailed-energy series is registered', '尚未登记可比的官方弃电电量序列'],
    ['Ingest curtailed and available MWh for the same technology and window', '接入同技术、同窗口的弃电及可发电量'],
  ],
  'area-basis': [
    ['Area and system prices are not paired in one governed snapshot', '区域价与系统价尚未在同一治理快照中配对'],
    ['Ingest both prices at identical intervals and subtract deterministically', '按相同时段接入两类价格并确定性相减'],
  ],
  'executable-spread': [
    ['No validated interval-price snapshot is published for this market', '该市场尚无经验证的时段电价快照'],
    ['Publish a governed interval series and run contiguous-window spread', '发布受治理的时段序列并运行连续窗口价差'],
  ],
};

const labelFor = metricId => VALUE_DRIVER_METRICS.find(metric => metric.id === metricId).label;

const records = [];
for (const marketId of VALUE_DRIVER_MARKETS){
  for (const metric of VALUE_DRIVER_METRICS){
    records.push(toBuildEvidence({
      id: marketId.replaceAll('_', '-') + '-' + metric.id,
      marketId,
      metricId: metric.id,
      label: metric.label,
      gap: GAP[metric.id][0],
      buildPlan: GAP[metric.id][1],
    }));
  }
}

function replace(marketId, metricId, record){
  const index = records.findIndex(item => item.marketId === marketId && item.metricId === metricId);
  records[index] = {
    id: marketId.replaceAll('_', '-') + '-' + metricId,
    marketId,
    metricId,
    label: labelFor(metricId),
    ...record,
  };
}

replace('wa', 'duration', {
  status: EVIDENCE_STATUS.VERIFIED,
  authority: AUTHORITY.OBSERVED,
  confidence: EVIDENCE_CONFIDENCE.HIGH,
  value: 7,
  unit: 'h',
  display: ['7 h — 2028–29 ESR requirement', '7小时 — 2028–29 ESR要求'],
  sourceIds: ['wa-aemo-wem-esoo'],
  asOf: '2026-07-29',
});
replace('wa', 'saturation', {
  status: EVIDENCE_STATUS.PROXY,
  authority: AUTHORITY.DERIVED_OBSERVED,
  confidence: EVIDENCE_CONFIDENCE.MEDIUM,
  value: saturationProxy({ competingMW: 6670, denominatorMW: 6323 }),
  unit: 'x',
  display: ['1.05× existing + committed / Peak RCR', '1.05× 现有及已承诺容量/峰值RCR'],
  sourceIds: ['wa-aemo-wem-esoo'],
  asOf: '2026-07-29',
  proxyFor: ['Near-term capacity-market saturation', '近期容量市场饱和度'],
  method: ['(6,323 MW RCR + 347 MW surplus) / 6,323 MW RCR', '（6,323MW RCR + 347MW过剩）/ 6,323MW RCR'],
});
replace('wa', 'capacity-revenue', {
  status: EVIDENCE_STATUS.PROXY,
  authority: AUTHORITY.DERIVED_OBSERVED,
  confidence: EVIDENCE_CONFIDENCE.MEDIUM,
  value: capacityRevenue({ pricePerKWYear: 488.5, qualifiedMW: 1, deratingFactor: 1 }),
  unit: 'AUD/MW-year',
  display: ['A$488.5k/MW-yr BRCP — not project RCP', 'A$488.5千/MW年 BRCP — 非项目RCP'],
  sourceIds: ['wa-era-brcp'],
  asOf: '2026-07-29',
  proxyFor: ['Gross capacity-revenue benchmark', '毛容量收入基准'],
  method: ['Official BRCP × 1 MW; assigned credits and applicable RCP are not yet applied', '官方BRCP×1MW；尚未应用获配容量信用及适用RCP'],
});
replace('wa', 'executable-spread', {
  status: EVIDENCE_STATUS.DERIVED,
  authority: AUTHORITY.DERIVED_OBSERVED,
  confidence: EVIDENCE_CONFIDENCE.MEDIUM,
  value: 37.255845170454556,
  unit: 'AUD/MWh',
  display: ['A$37.26/MWh · 8 h · 88 days', 'A$37.26/MWh · 8小时 · 88天'],
  sourceIds: ['wa-aemo-market-data'],
  asOf: '2026-07-29',
  method: ['Mean daily best chronological non-overlapping contiguous 8 h windows; 1 May–27 Jul 2026', '每日最佳按时序不重叠连续8小时窗口均值；2026年5月1日至7月27日'],
});

replace('gb', 'saturation', {
  status: EVIDENCE_STATUS.PROXY,
  authority: AUTHORITY.DERIVED_OBSERVED,
  confidence: EVIDENCE_CONFIDENCE.LOW,
  value: saturationProxy({ competingMW: 177195.8, denominatorMW: 3627.9 }),
  unit: 'x',
  display: ['48.84× TEC forward / built MW', '48.84× TEC远期/已建MW'],
  sourceIds: ['gb-neso-tec-register'],
  inputMetricIds: ['gb-tec-exact-ess-forward-capacity', 'gb-tec-exact-ess-built-capacity'],
  asOf: '2026-07-29',
  proxyFor: ['Connection-register pressure, not delivered competition', '并网登记压力，而非已交付竞争'],
  method: ['177,195.8 MW forward exact-ESS / 3,627.9 MW built; no financing, MWh or COD screen', '177,195.8MW远期精确ESS/3,627.9MW已建；未筛选融资、MWh或COD'],
});

const jpCapacity = {
  jp_tokyo: 15111,
  jp_kyushu: 15112,
  jp_hokkaido: 14972,
};
const jpCurtailment = {
  jp_tokyo: { days: 20, display: ['20 days · Mar–May 2026', '20天 · 2026年3–5月'], source: 'jp-occto-tokyo-curtailment-2026' },
  jp_kyushu: { days: 50, display: ['50 days · Jan–Mar 2026', '50天 · 2026年1–3月'], source: 'jp-occto-kyushu-curtailment-2026' },
  jp_hokkaido: { days: 36, display: ['36 days · Mar–May 2026', '36天 · 2026年3–5月'], source: 'jp-occto-hokkaido-curtailment-2026' },
};
const jpSpreads = {
  jp_tokyo: { value: 9525.935792349726, display: ['¥9,526/MWh · 4 h · 366 days', '¥9,526/MWh · 4小时 · 366天'] },
  jp_kyushu: { value: 9967.947404371585, display: ['¥9,968/MWh · 4 h · 366 days', '¥9,968/MWh · 4小时 · 366天'] },
  jp_hokkaido: { value: 12463.316256830602, display: ['¥12,463/MWh · 4 h · 366 days', '¥12,463/MWh · 4小时 · 366天'] },
};

for (const marketId of Object.keys(jpCapacity)){
  replace(marketId, 'capacity-revenue', {
    status: EVIDENCE_STATUS.PROXY,
    authority: AUTHORITY.DERIVED_OBSERVED,
    confidence: EVIDENCE_CONFIDENCE.MEDIUM,
    value: capacityRevenue({ pricePerKWYear: jpCapacity[marketId], qualifiedMW: 1, deratingFactor: 1 }),
    unit: 'JPY/MW-year',
    display: ['¥' + (jpCapacity[marketId] / 1000).toFixed(3) + 'm/MW-yr before de-rating', '折减前¥' + (jpCapacity[marketId] / 1000).toFixed(3) + '百万/MW年'],
    sourceIds: ['jp-occto-capacity-auctions'],
    asOf: '2026-07-29',
    proxyFor: ['Gross one-MW capacity-price benchmark', '1MW毛容量价格基准'],
    method: ['Official 2029 area price × 1,000 kW; de-rating and asset obligation not applied', '官方2029区域价格×1,000kW；未应用折减及资产义务'],
  });
  replace(marketId, 'curtailment', {
    status: EVIDENCE_STATUS.VERIFIED,
    authority: AUTHORITY.OBSERVED,
    confidence: EVIDENCE_CONFIDENCE.HIGH,
    value: jpCurtailment[marketId].days,
    unit: 'days',
    display: jpCurtailment[marketId].display,
    sourceIds: [jpCurtailment[marketId].source],
    asOf: '2026-07-29',
  });
  replace(marketId, 'executable-spread', {
    status: EVIDENCE_STATUS.DERIVED,
    authority: AUTHORITY.DERIVED_OBSERVED,
    confidence: EVIDENCE_CONFIDENCE.HIGH,
    value: jpSpreads[marketId].value,
    unit: 'JPY/MWh',
    display: jpSpreads[marketId].display,
    sourceIds: ['jp-jepx-spot'],
    asOf: '2026-07-29',
    method: ['Mean daily best chronological non-overlapping contiguous 4 h windows; 29 Jul 2025–29 Jul 2026', '每日最佳按时序不重叠连续4小时窗口均值；2025年7月29日至2026年7月29日'],
  });
}

export const VALUE_DRIVER_EVIDENCE = Object.freeze(records);

export function valueDriverEvidence(marketId, metricId){
  return VALUE_DRIVER_EVIDENCE.find(record => record.marketId === marketId && record.metricId === metricId) || null;
}

export function validateValueDriverEvidence(){
  const problems = validateEvidenceCollection(VALUE_DRIVER_EVIDENCE);
  for (const marketId of VALUE_DRIVER_MARKETS){
    for (const metric of VALUE_DRIVER_METRICS){
      if (!valueDriverEvidence(marketId, metric.id)) problems.push(marketId + '/' + metric.id + ': missing heatmap cell');
    }
  }
  return problems;
}

export function valueDriverDimensionEvidence(marketId, dimensionId){
  const dimension = VALUE_DRIVER_DIMENSIONS.find(item => item.id === dimensionId);
  if (!dimension) return null;
  if (dimension.evidenceMetricId) return valueDriverEvidence(marketId, dimension.evidenceMetricId);
  return toBuildEvidence({
    id: marketId.replaceAll('_', '-') + '-' + dimension.id,
    marketId,
    metricId: dimension.id,
    label: dimension.label,
    gap: dimension.gap,
    buildPlan: dimension.buildPlan,
  });
}

