import { briefingFromDisk, readBriefingInputs } from '../briefing/disk.js';
import { homeProjection } from '../briefing/model.js';
import { opportunitySummary } from './summary.js';
export const OPPORTUNITY_SUMMARY = opportunitySummary(homeProjection(await briefingFromDisk()),(await readBriefingInputs()).views);

/** Browser builds replace this stub with per-investor lazy data chunks. */
export async function loadInvestmentSummary(lens) { return OPPORTUNITY_SUMMARY[lens]; }
