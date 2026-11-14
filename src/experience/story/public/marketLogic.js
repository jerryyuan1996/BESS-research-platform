import {renderChapter as renderLogic} from './italyLogic.js';
import {marketLogic} from './marketLogicContent.js';
import {LOGIC_SOURCES} from './logicSources.js';

export function renderChapter(data,id,ctx){
 return renderLogic({...data,sources:{...data.sources,...LOGIC_SOURCES[data.marketId]}},id,ctx,marketLogic(data.marketId));
}
