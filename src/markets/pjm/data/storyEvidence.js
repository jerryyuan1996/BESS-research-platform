/* Complete analyst-entered evidence registry for validation and authoring.
   Runtime values and per-value provenance share this unchanged public contract. */
import {PJM_STORY_VALUES} from './storyEvidenceValues.js';
import {PJM_STORY_PROVENANCE} from './storyEvidenceProvenance.js';
export const PJM_STORY_EVIDENCE={...PJM_STORY_VALUES,provenance:PJM_STORY_PROVENANCE};
