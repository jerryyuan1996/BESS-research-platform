/* Chapter-only adapter. No dashboard, complete dataset or finance engine. */
import {researchHistory} from './history.js';
import {HISTORY_DATA as M,HISTORY_FORMAT} from './historyData.js';
import {createFormat} from '../_shared/format.js';
export const readHistory=()=>({...researchHistory({M,...createFormat(HISTORY_FORMAT)}),dataDate:M.dataDate||M.asOf,dataVersion:M.modelVersion});
