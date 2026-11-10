import {manualRequestBinding} from '../../scripts/policy/manual-request.mjs';
export async function manualRequest({cases,caseId,config,now=new Date('2026-11-05T07:00:00Z'),id='synthetic-request'}){
  return {schemaVersion:1,id,explicitRequest:true,mode:'manual-shadow',requestedBy:'synthetic-requester',approvalId:config.approvalId,requestedAt:new Date(now).toISOString(),expiresAt:new Date(+new Date(now)+3600000).toISOString(),...await manualRequestBinding({cases,caseId,config})};
}
