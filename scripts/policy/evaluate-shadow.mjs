import {fileURLToPath} from 'node:url';
import {MANUAL_EVALUATION_AUTHORIZATION} from '../../policy/manual-authorization.mjs';
import {TRUSTED_POLICY_PROFILES} from '../../policy/validation-profiles.mjs';
import {policyTransport} from '../../policy/transport.mjs';
import {executeManualEvaluation} from './manual-command.mjs';

// No credentials are read until the committed approval, corpus hash, reviewed
// source profiles and source provenance have passed. Defaults make no request.
const args=process.argv.slice(2),caseId=args.length===2&&args[0]==='--case'?args[1]:null;
try{
  const result=await executeManualEvaluation({repo:fileURLToPath(new URL('../..',import.meta.url)),caseId,config:MANUAL_EVALUATION_AUTHORIZATION,profiles:TRUSTED_POLICY_PROFILES,makeInvoke:config=>policyTransport({key:process.env.POLICY_EVALUATION_API_KEY,config})});
  console.log(JSON.stringify({mode:'manual-shadow',...result}));
}catch{console.error(JSON.stringify({mode:'manual-shadow',status:'blocked',canPublish:false,error:'Manual evaluation gate, evidence or audit failed; inspect the private reviewed inputs before retrying'}));process.exitCode=1;}
