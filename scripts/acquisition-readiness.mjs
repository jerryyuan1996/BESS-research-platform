import { markets } from '../src/markets/registry.js';
import { STAGES } from '../src/acquisition/parameters.js';
import { acquisitionInput } from '../src/acquisition/reference.js';
import { validateAcquisition } from '../src/acquisition/valuation.js';

// Research-only report. Missing inputs are deliberately absent from home.
const rows=markets.filter(m=>m.comparison).map(m=>({market:m.manifest.id,stages:Object.fromEntries(STAGES.map(stage=>[
  stage,{missing:validateAcquisition(acquisitionInput(m,stage)),
    publishedInvestorEligibility:m.comparison.acquisition?.eligibleInvestors?.[stage]||[]},
]))}));
console.log(JSON.stringify({asOf:'2026-10-18',markets:rows},null,2));
