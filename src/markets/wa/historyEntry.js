/* Both WA research axes, without the dashboard or financial model. */
import {researchHistory} from './history.js';
import {fmtN,fmtA,NF1} from './ui.js';
import {HISTORY_SEED} from './historyData.js';
export const readHistory=()=>({...researchHistory({fmtN,fmtA,NF1}),dataDate:HISTORY_SEED.asOf,dataVersion:HISTORY_SEED.modelVersion});
