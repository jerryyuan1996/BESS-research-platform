/* ---------------------------------------------------------------------------
   Project Kemerton underwriting layer + the market-level 2028-29 capacity balance.
   Verbatim from the prototype (lines 812-888). All project-specific content is
   confined to the Portfolio tab.
   --------------------------------------------------------------------------- */
import { SRC } from '../sources.js';

// ============================================================================
// PROJECT KEMERTON — Drive-backed underwriting layer (2026-07 review)
// Screened as ONE of several potential WEM opportunities; all project-specific
// content is confined to the Portfolio tab.
// Official market data, project technical evidence, developer assumptions and
// model assumptions are deliberately separated. Null means not yet evidenced.
// ============================================================================
const KEMERTON = {
  project: {
    name: 'Project Kemerton', powerMW: 100, energyMWh: 860, rawDurationHours: 8.6,
    connectionKV: 132, inverterCount: 34, inverterTechnology: 'SMA grid-forming',
    installedInverterMW: 156, reactiveMvar: 48.4, forecastCOD: '2028-09-29', lifeYears: 25,
    location: 'Lot 5 (#335) Wellesley Road North, Wellesley'
  },
  duration: {
    currentRequirementHours: 7.0, fixedPriceBaseThresholdHours: 7.5,
    sensitivityLowHours: 8.0, sensitivityHighHours: 8.5,
    deliverableEnergyMWh: null, degradationAdjustedDurationHours: null,
    sustainableTradedPeakCRCMW: null, eligibilityStatus: ['Potentially eligible — not yet proven','可能符合 — 尚未证明']
  },
  capacityContext: {
    peakRCTMW: 6323, existingCommittedMW: 6670, headlineSurplusMW: 347,
    durationUpliftMW: 392, committedDeliveryMW: 889, anticipatedMW: 622,
    eoiPressureMW: 2000, vppPeakReductionMW: 200
  },
  merchant: {
    renewableChargeCost: 70, renewableDischargePrice: 130, grossSpread: 60,
    ocgtChargeCost: 135, ocgtDischargeBid: 195, initialContractYears: '2–3',
    status: ['Developer-reported / uncontracted','开发商披露 / 未签约']
  },
  marketServices: {
    annualRevenueAUD: 1750000, escalationPct: 2.5,
    status: ['Modelled downside assumption','模型下行情景假设']
  },
  capex: {
    initialAUD: 242234000, modelAltAUD: 254517000, auditSelectedAUD: 249026000,
    augmentationAUD: 77243400, initialPerKWh: 282, inclAugPerKWh: 371,
    eraBenchmarkPerKWh: 521, eraReferenceCapexAUD: 625600000,
    eraBRCP: 488500, fixedCapitalChargePerMW: 100000
  },
  grid: {
    gpsStatus: ['R0 / final approval outstanding','R0 / 最终批准待定'], naqMW: null, capacityCreditsMW: null,
    rasStatus: ['No project protection identified in current study','当前研究未识别项目RAS保护'],
    findings: [
      { e:['100 MW discharge overloads under relevant contingencies','相关事故场景下100MW放电过载'], i:['Potential SCED curtailment / reduced NAQ','可能SCED限发 / NAQ降低'], s:['OPEN','待解决'] },
      { e:['80 MW charging constraint during planned outages','计划停运期间80MW充电约束'], i:['Recharge and availability risk','补能及可用率风险'], s:['OPEN','待解决'] },
      { e:['Historical Kemerton-area NAQ reduction for another facility','Kemerton区域其他设施曾出现NAQ折减'], i:['Locational precedent only','仅作区位先例'], s:['REFERENCE','参考'] },
      { e:['KEM–MRR constraints in Western Power planning','Western Power规划中的KEM–MRR约束'], i:['Long-term locational exposure','长期区位风险'], s:['MONITOR','跟踪'] }
    ]
  },
  schedule: [
    ['7 Jul 2026',['CRC applications close','CRC申请截止']],
    ['25 Aug 2026',['AEMO notifies Peak and Flexible CRC','AEMO通知峰值及灵活CRC']],
    ['7 Sep 2026',['Security, trade declaration and 5-/10-year fixed-price nomination','保证金、交易声明及5/10年固定价选择']],
    ['13 Oct 2026',['Capacity Credits assigned; NAQ notified; initial price information','容量信用分配；NAQ通知；初始价格信息']],
    ['19 Nov 2026',['Component credits, category prices and RCR adequacy determination','分项信用、分类价格及RCR充足性结论']]
  ],
  sources: {
    esoo: SRC.esoo, brcp: SRC.brcp, crc: SRC.crc,
    model: { file:'20260716 Kemerton Financial Model.xlsx', status:['Financial-model assumption','财务模型假设'], date:'16 Jul 2026', cy:'Project case', url:'https://drive.google.com/file/d/1W5h-tOpoOWK_7UIpR1aae7HCwUUlsKqC' },
    gps: { file:'Kemerton GPS report — Draft 25.05.26.pdf', status:['Project technical study','项目技术研究'], date:'25 May 2026', cy:'R0', url:'https://drive.google.com/file/d/165oRRCfCuoiFDE_Ywb07J2kbfPhLgJR1' },
    steady: { file:'CS040079 Sunrise Energy Wellesley 100MW BESS Steady State Report', status:['Project technical study','项目技术研究'], date:'27 May 2026', cy:'Connection study', url:'https://drive.google.com/drive/folders/1hKGGMszpMtTxqJII7__ikCUaf43kEJKX' },
    trading: { file:'3.1.14 Charge and Discharge Approach for Kemerton 100MW BESS.pdf', status:['Developer-reported','开发商披露'], date:'2026', cy:'Commercial strategy', url:'https://drive.google.com/drive/folders/1hKGGMszpMtTxqJII7__ikCUaf43kEJKX' },
    schedule: { file:'3.1.07 Kemerton BESS Schedule.pdf', status:['Developer-reported','开发商披露'], date:'2026', cy:'Development schedule', url:'https://drive.google.com/file/d/1ILz0nQRJYnl9G7kY44LOn6-km1YzF8B3' },
    tsp: SRC.tsp
  },
  // Configuration version history — only the 860 MWh case is active
  configHistory: ['400 MWh','600 MWh','700 MWh / 7h','860 MWh ACTIVE','952 MWh']
};

// Market-level 2028-29 capacity balance (2026 WEM ESOO, 15 Jul 2026) — RCM tab.
const ESOO_BAL = Object.assign({}, KEMERTON.capacityContext, {
  existingCommittedBessMW: 1666,   // existing + committed SWIS battery forecast operational by 2028-29
  reliabilityMetYears: 3,          // reliability target expected to be met over the next three years
  esr2829Hours: 7, esr2728Hours: 6,
  consumption3536TWh: 32.1, peakRct3536MW: 7454, thermalExit3536MW: 1661, ecGap3536MW: -2161,
});

export { KEMERTON, ESOO_BAL };
