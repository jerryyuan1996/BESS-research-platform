/* Chapter-only adapter. No dashboard, complete dataset or finance engine. */
import {researchHistory} from './history.js';
import {HISTORY_DATA as M} from './historyData.js';
export const readHistory=()=>({...researchHistory({M}),dataDate:M.dataDate||M.asOf,dataVersion:M.modelVersion});
