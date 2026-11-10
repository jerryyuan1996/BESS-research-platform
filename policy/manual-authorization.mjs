/** Separate owner-controlled manual evaluation decision. This is neither live
 * policy activation nor a fallback to an existing agent credential/config. */
export const MANUAL_EVALUATION_AUTHORIZATION=Object.freeze({
  manualOnly:true,enabled:false,manualEvaluationApproved:false,approvalId:null,approvedCorpusHash:null,
  provider:null,model:null,maxSerializedInputBytes:16000,maxInputTokens:12000,maxOutputTokens:3000,wallTimeMs:120000,
  maxDailyUSD:null,inputUSDPerMTokens:null,outputUSDPerMTokens:null,priceSource:null,
});
