/** Independent, analyst-reviewed source parsers/translation templates belong
 * here. A model cannot supply or alter them. Empty means no unattended approval.
 * Each profile must bind an official document/locator and validate its semantics,
 * dates, scope, numeric normalization, licence and bilingual template. */
export const TRUSTED_POLICY_PROFILES=Object.freeze([]);
export const APPROVED_HISTORICAL_EVALUATION=Object.freeze({approved:false,method:null,model:null,reviewedAt:null,cases:[],falsePositive:null,falseNegative:null,criticalUnsupported:null});
