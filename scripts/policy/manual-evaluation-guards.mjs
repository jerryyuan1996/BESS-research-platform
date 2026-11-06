import {loadMarkers,loadFingerprintKey,fingerprintOf,MARKER_FINGERPRINT,scanText} from '../lib/markers.mjs';
import {independentlyValidate} from '../../policy/validation.mjs';

/** Same original marker fingerprint and scanner used by the publication gate. */
export async function scanManualEvidence({body,source}){
  const markers=loadMarkers({required:true}),f=fingerprintOf(markers.markers,loadFingerprintKey({required:true}).key);
  return f.count===MARKER_FINGERPRINT.count&&f.hmacSha256===MARKER_FINGERPRINT.hmacSha256&&scanText(JSON.stringify({body,source}),markers.markers).length===0;
}
/** Reviewed profiles and public references must come from trusted code. */
export function manualSemanticValidator({profiles,marketIds,publicReferences}){
  return async({candidate,source,body})=>independentlyValidate({snapshot:candidate,bodies:new Map([[source.id,body]]),profiles,marketIds,publicReferences}).valid;
}
