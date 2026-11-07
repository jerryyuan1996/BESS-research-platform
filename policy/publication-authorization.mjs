/** A manual release decision binds exact immutable snapshots, independently of
 * model activation. Candidates cannot write this file or approve a new hash. */
import {STATIC_POLICY_ADMISSION} from './static-release.mjs';
export const MANUAL_POLICY_PUBLICATION=Object.freeze({enabled:true,
  approvalId:STATIC_POLICY_ADMISSION.approvalId,
  approvedHeads:Object.freeze([STATIC_POLICY_ADMISSION.releaseSnapshotHash])});
