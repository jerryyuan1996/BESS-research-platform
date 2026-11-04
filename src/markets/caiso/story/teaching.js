import {CAISO_EVIDENCE as E} from '../data/storyEvidence.js';
/* Analyst-approved Example arithmetic; no observation or investment-case input. */
export function CAISO_TEACHING(row){
  const powerMW=100,durationHours=[2,row.play.hours,8];
  return Object.freeze({powerMW,durationHours,energyMWh:durationHours.map(h=>powerMW*h),baseCreditedMW:durationHours.map(h=>powerMW*Math.min(h/E.qcBasisHours,1)),foldbackTrim:'schematic-only',afterFoldbackCreditedMW:null,allocationMW:null,allocationMWh:null,projectFeasibility:null,componentCostBreakdown:null,outageShortfallMW:null,adequacyStackMW:null,seasonMarginMW:null});
}
