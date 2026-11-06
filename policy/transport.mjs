/** No fallback to the monthly agent's credential or model. No tools or retries. */
import Anthropic from '@anthropic-ai/sdk';
import { policyModelRequest } from './model-contract.mjs';
export function policyTransport({key,config}){
  if(typeof key!=='string'||!key.trim()||config.provider!=='anthropic'||!config.model)throw new Error('Approved policy transport is not configured');
  if(process.env.ANTHROPIC_CUSTOM_HEADERS?.trim())throw new Error('Policy transport cannot inherit shared API headers');
  const logger={debug(){},info(){},warn(){},error(){}};
  const client=new Anthropic({apiKey:key,authToken:null,webhookKey:null,baseURL:'https://api.anthropic.com',maxRetries:0,timeout:config.wallTimeMs,logger});
  return async({system,evidence,previousPolicy,model,maxOutputTokens,signal})=>{
    const response=await client.messages.create(policyModelRequest({system,evidence,previousPolicy,model,maxOutputTokens}),{signal});
    if(response.model!==model||['max_tokens','refusal','tool_use'].includes(response.stop_reason))throw new Error('Policy response model or completion did not match the approved request');
    return {text:response.content.filter(block=>block.type==='text').map(block=>block.text).join(''),inputTokens:response.usage.input_tokens,outputTokens:response.usage.output_tokens};
  };
}
