/** A manual release decision binds exact immutable snapshots, independently of
 * model activation. Candidates cannot write this file or approve a new hash. */
export const MANUAL_POLICY_PUBLICATION=Object.freeze({enabled:false,approvalId:null,approvedHeads:Object.freeze([])});
