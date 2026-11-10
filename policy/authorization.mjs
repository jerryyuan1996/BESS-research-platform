/** Analyst-owned release configuration. Never populated from model output. */
export const POLICY_AUTHORIZATION=Object.freeze({
  manualOnly:true,enabled:false,publicationEnabled:false,approvalId:null,provider:null,model:null,
  maxSerializedInputBytes:16000,maxInputTokens:12000,maxOutputTokens:3000,maxDailyUSD:null,wallTimeMs:120000,
  inventoryVersion:1,validatedGoldCases:0,inputUSDPerMTokens:null,outputUSDPerMTokens:null,priceSource:null,
});
export function authorizationProblems(config){
  const errors=[];
  if(config?.enabled!==true)errors.push('Policy model activation is OFF');
  if(!config?.approvalId||!config?.provider||!config?.model)errors.push('Named provider/model and concrete approval are missing');
  if(config?.provider!=='anthropic')errors.push('Only the explicitly supported policy transport may run');
  for(const key of ['maxSerializedInputBytes','maxInputTokens','maxOutputTokens','wallTimeMs'])if(!Number.isInteger(config?.[key])||config[key]<=0)errors.push(`Invalid ${key}`);
  if(!Number.isFinite(config?.maxDailyUSD)||config.maxDailyUSD<=0)errors.push('Approved daily USD cap is missing');
  if(!Number.isFinite(config?.inputUSDPerMTokens)||config.inputUSDPerMTokens<0||!Number.isFinite(config?.outputUSDPerMTokens)||config.outputUSDPerMTokens<=0||!/^https:\/\/(?:www\.anthropic\.com|platform\.claude\.com|claude\.com)\//.test(config?.priceSource||''))errors.push('Reviewed provider pricing is missing');
  if(!Number.isInteger(config?.validatedGoldCases)||config.validatedGoldCases<12)errors.push('Historical gold evaluation gate is incomplete');
  return errors;
}
export function worstCaseModelUSD(config){return (config.maxInputTokens*config.inputUSDPerMTokens+config.maxOutputTokens*config.outputUSDPerMTokens)/1_000_000;}
