import { briefingFromDisk } from '../briefing/disk.js';
import { homeProjection } from '../briefing/model.js';
import { opportunitySummary } from './summary.js';
export const OPPORTUNITY_SUMMARY = opportunitySummary(homeProjection(await briefingFromDisk()));
