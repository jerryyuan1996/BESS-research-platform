/* ---------------------------------------------------------------------------
   THE ONE CALL TO THE MODEL.

   Kept apart from everything else the agent does so that the rest can be
   tested with a stub, and so that what the model is given is visible in one
   place: a system prompt, one user message, and a schema its answer must fit.
   No tools. The model cannot fetch, run or write anything; it can only return
   an answer in the shape below, and the gate decides what becomes of it.

   The credential is read from the environment by the SDK. In this repository
   that means a repository secret in the workflow and nothing else: there is no
   key in the code and none on the analyst's machine.

   NOT YET RUN AGAINST THE API. The workflow step that calls this is inert
   until the secret exists; the request shape below is checked against the
   SDK's own types, and everything around it is tested with a stub.
   --------------------------------------------------------------------------- */
import Anthropic from '@anthropic-ai/sdk';

import { MODEL, SYSTEM, ANSWER_SCHEMA } from './prompt.mjs';

/**
 * Ask the model about one market. Returns the parsed answer with the model
 * that gave it, or { refused, model } — never a partial answer.
 *
 * The daily pass and the scout pass ask in different words and expect
 * different shapes, so each supplies its own system prompt and schema. The
 * call is otherwise the same one, and neither is given a tool.
 */
export async function askModel(message, { system = SYSTEM, schema = ANSWER_SCHEMA } = {}){
  const client = new Anthropic();
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    output_config: { effort: 'medium', format: { type: 'json_schema', schema } },
    /* If the model declines on policy grounds the API re-runs the request on
       a fallback model; `response.model` then names the one that answered. */
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system,
    messages: [{ role: 'user', content: message }],
  });

  if (response.stop_reason === 'refusal') return { refused: response.stop_details?.category ?? 'refusal', model: response.model };
  if (response.stop_reason === 'max_tokens') return { refused: 'answer cut off at the token limit', model: response.model };
  const text = response.content.filter(block => block.type === 'text').map(block => block.text).join('');
  const answer = JSON.parse(text);
  return { ...answer, model: response.model, usage: response.usage ?? null };
}
