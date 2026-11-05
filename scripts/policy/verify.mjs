import {ROOT} from './runtime-io.mjs';
import {POLICY_AUTHORIZATION} from '../../policy/authorization.mjs';
import {TRUSTED_POLICY_PROFILES,APPROVED_HISTORICAL_EVALUATION} from '../../policy/validation-profiles.mjs';
import {verifyPolicyStore} from '../../policy/verify-store.mjs';
try{console.log(JSON.stringify(await verifyPolicyStore({repo:ROOT,config:POLICY_AUTHORIZATION,profiles:TRUSTED_POLICY_PROFILES,evaluation:APPROVED_HISTORICAL_EVALUATION})));}catch{console.error('Public policy store failed the independent release gate');process.exitCode=1;}
