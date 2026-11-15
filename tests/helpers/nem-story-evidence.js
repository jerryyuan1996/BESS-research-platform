/* The complete NEM story evidence registry, for validation and authoring only.
   No runtime module imports this file: it pulls in the withheld observed
   records, which must never reach the browser while the rights switch is off. */
import { NEM_STORY_VALUES } from '../../src/markets/nem/data/storyEvidenceValues.js';
import { NEM_STORY_PROVENANCE } from '../../src/markets/nem/data/storyEvidenceProvenance.js';
import { NEM_STORY_OBSERVED } from '../../src/markets/nem/data/storyEvidenceObserved.js';
export const NEM_STORY_EVIDENCE = { ...NEM_STORY_VALUES, observed: NEM_STORY_OBSERVED, provenance: NEM_STORY_PROVENANCE };
