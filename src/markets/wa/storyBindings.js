/* ---------------------------------------------------------------------------
   Western Australia — where the story's {tokens} come from.

   Each token reads a field the market page or the WA research already reads;
   nothing here computes a model result. A field that is missing resolves to
   null, which the contract renders as an em dash, never as a typed number.

     playDuration, nextAction, entryRoute   row.play (the briefing's play); the
                                            stage word is playTitle's STAGE_WORD
     securedShare, securedTenor             row.econ ("Modelled fixed revenue",
                                            "Fixed revenue tenor")
     durationRequirement, requirementTerm   the capacity route's duration floor,
                                            read as src/comparison/designFit.js
                                            floorOf() reads it
     requirementPath                        ESR_REQUIREMENT, the requirement table
                                            the WA research story tab shows
   --------------------------------------------------------------------------- */
import { ESR_REQUIREMENT } from './data/esrRequirement.js';
import { STAGE_WORD } from '../../governance/playTitle.js';

const finite = (v) => typeof v === 'number' && Number.isFinite(v);
const pct = (v) => (finite(v) ? `${(v * 100).toFixed(1)}%` : null);

/** The capacity route's floor, with floorOf()'s precedence for 'cap'. */
function capFloor(market){
  const cmp = market?.comparison;
  const rule = cmp?.durationResponse?.routeRules?.cap || {};
  const hours = finite(rule.floorHours) ? rule.floorHours : null;
  const term = finite(rule.termYears) ? rule.termYears : (finite(cmp?.economics?.contractYears) ? cmp.economics.contractYears : null);
  return { hours, term };
}

/** Token values for one market-page row. */
export function storyValues(row){
  const floor = capFloor(row?.market);
  const path = ESR_REQUIREMENT.map(r => r.h).filter(finite);
  return {
    playDuration: finite(row?.play?.hours) ? String(row.play.hours) : null,
    nextAction: Array.isArray(row?.play?.action?.text) ? row.play.action.text : null,
    entryRoute: STAGE_WORD[row?.play?.stage] || null,
    securedShare: pct(row?.econ?.secured),
    securedTenor: finite(row?.econ?.securedYears) ? String(row.econ.securedYears) : null,
    durationRequirement: finite(floor.hours) ? String(floor.hours) : null,
    requirementTerm: finite(floor.term) ? String(floor.term) : null,
    requirementPath: path.length ? [path.join(' → '), path.join(' → ')] : null,
  };
}
