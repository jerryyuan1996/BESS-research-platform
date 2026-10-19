import { markets } from '../src/markets/registry.js';
import { STAGES } from '../src/acquisition/parameters.js';
import { acquisitionInput, marketAcquisitionReference } from '../src/acquisition/reference.js';
import { validateAcquisition } from '../src/acquisition/valuation.js';

// Research report: missing project evidence does not suppress public references.
const rows=markets.filter(m=>m.comparison).map(m=>({market:m.manifest.id,stages:Object.fromEntries(STAGES.map(stage=>[
  stage,{missing:validateAcquisition(acquisitionInput(m,stage)),
    referenceStatus:marketAcquisitionReference(m,stage,stage==='operating'?'infraFund':'developer').status,
    publishedInvestorEligibility:m.comparison.acquisition?.eligibleInvestors?.[stage]||[]},
]))}));
console.log(JSON.stringify({asOf:'2026-10-19',markets:rows},null,2));
