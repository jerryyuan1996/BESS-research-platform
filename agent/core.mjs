/* ---------------------------------------------------------------------------
   THE AGENT — what it does, without the two things it depends on.

   The agent is for what no rule anticipated: an event trigger has no feed, so
   somebody has to establish that the event happened, from a source. This is
   the daily pass:

       pick the markets with a trigger due soon, or overdue
       for each: fetch the pages those triggers cite, and hash them
                 give the model the market's view, the due triggers, the pages
                 turn its answer into whole-record changes
                 check every quotation against the page it cites
                 put each change to the view writer's gate
       report what it would have changed, and what the gate said

   IT WRITES NOTHING. Every change goes to the writer's `prepare`, which
   checks and returns; nothing here calls `apply`, and the writer would refuse
   an agent's apply in any case — the agent is a permitted author and not a
   live one. See LIVE_AUTHORS in the view schema.

   THE TWO DEPENDENCIES ARE ARGUMENTS: how a page is fetched and how the model
   is asked. agent/run.mjs supplies the real ones; the tests supply stubs. So
   everything that decides whether a proposal survives is tested without a
   network and without a key.

   WHAT A PAGE CAN DO TO THIS. The agent reads pages nobody here controls.
   Whatever one says, the only thing the model can return is a proposal in a
   fixed shape, and three checks stand between a proposal and a report line
   that says "would pass": the quotation must be in the page, character for
   character; the change must be one the agent's class may make; and a verdict
   needs an official source or two independent ones.

   This phase the agent proposes changes to grades and verdicts only. The
   thesis and plain triggers are within its rights and outside this pass.
   --------------------------------------------------------------------------- */
import { createHash } from 'node:crypto';

import { DIMENSIONS, TREND, VERDICT_IDS } from '../src/governance/investability.js';
import { SOURCE_DECISION_PROFILE } from '../src/governance/triggers.js';
import { AGENT_TRIGGER_HORIZON_DAYS, MAX_QUOTE_CHARS, MAX_MACHINE_CHANGES_PER_RUN, EVIDENCE_CLASS } from '../src/governance/automation.js';
import { parsePath } from '../view/schema/view.mjs';
import { PROMPT_VERSION, MODEL, userMessage } from './prompt.mjs';

const ANCHORS = Object.fromEntries(DIMENSIONS.map(d => [d.id, d.anchors]));

const addDays = (day, days) => new Date(Date.parse(`${day}T00:00:00Z`) + days * 86_400_000).toISOString().slice(0, 10);
/* A month-precision date is due at the end of its month. */
const dueDay = (when) => when.length === 7 ? `${when}-31` : when;

/** The triggers of a view that are overdue, or due inside the horizon. Undated ones are not due. */
export function dueTriggers(view, today, horizonDays = AGENT_TRIGGER_HORIZON_DAYS){
  const until = addDays(today, horizonDays);
  return view.triggers.filter(t => t.expected !== null && dueDay(t.expected) <= until);
}

/**
 * The pages a set of triggers cite, as { url, publisher, class }, once each.
 * A register key is looked up in the market's source register, which also
 * says whether the publisher is an official body. A trigger that cites the
 * decision profile, or a key with no link, has no page to fetch.
 */
export function pagesToFetch(triggers, register){
  const pages = new Map();
  for (const trigger of triggers){
    const source = trigger.source;
    if (source === SOURCE_DECISION_PROFILE) continue;
    const page = typeof source === 'string'
      ? (register?.[source]?.url ? {
          url: register[source].url, publisher: register[source].publisher || register[source].file || source,
          class: register[source].provenance?.authority === 'official' ? EVIDENCE_CLASS.OFFICIAL : EVIDENCE_CLASS.THIRD_PARTY,
        } : null)
      : { url: source.url, publisher: source.publisher, class: EVIDENCE_CLASS.THIRD_PARTY };
    if (page && /^https:\/\//.test(page.url) && !pages.has(page.url)) pages.set(page.url, page);
  }
  return [...pages.values()];
}

/** Text of an HTML page: scripts and markup out, whitespace collapsed. */
export function pageText(html){
  return String(html)
    .replace(/<(script|style|noscript)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, '\'')
    .replace(/\s+/g, ' ').trim();
}

export const hashOf = (body) => `sha256:${createHash('sha256').update(body).digest('hex')}`;

const squash = (s) => String(s).replace(/\s+/g, ' ').trim();

/**
 * Turn one proposal into a whole-record change, or say why it cannot be one.
 * This is where a quotation is checked against the page: guardrail A, done
 * mechanically. A quotation that is not in the page it cites is not evidence,
 * whatever else is true of the proposal.
 */
export function changeFromProposal(proposal, { view, pages, runAt, model }){
  const refuse = (why) => ({ proposal, refused: why });
  const where = parsePath(proposal?.record);
  if (!where || where.layer || !['grades', 'verdicts'].includes(where.section)) return refuse(`"${proposal?.record}" is not a grade or a verdict`);
  const current = view[where.section][where.key];
  if (!current) return refuse(`${proposal.record} does not exist in ${view.marketId}`);

  const { held: ignored, ...record } = structuredClone(current);
  const grades = where.section === 'grades';
  if (proposal.field === 'grade' && grades){
    if (!/^[1-5]$/.test(proposal.value)) return refuse('a grade is a digit from 1 to 5');
    record.grade = Number(proposal.value);
  } else if (proposal.field === 'trend' && grades){
    if (!TREND.includes(proposal.value)) return refuse(`a trend is one of ${TREND.join(', ')}`);
    record.trend = proposal.value;
    if (proposal.value === 'stable') delete record.trendCause;
    else record.trendCause = [proposal.cause_en, proposal.cause_zh];
  } else if (proposal.field === 'call' && !grades){
    if (!VERDICT_IDS.includes(proposal.value)) return refuse(`a call is one of ${VERDICT_IDS.join(', ')}`);
    record.call = proposal.value;
  } else return refuse(`"${proposal.field}" is not a field of ${proposal.record} the agent may change`);

  const evidence = [];
  for (const cited of Array.isArray(proposal.evidence) ? proposal.evidence : []){
    const page = pages[cited.page - 1];
    if (!page) return refuse(`cites page ${cited.page}, which was not fetched`);
    const quote = squash(cited.quote);
    if (!quote) return refuse('an evidence record with no quotation');
    if (quote.length > MAX_QUOTE_CHARS) return refuse(`a quotation of ${quote.length} characters — at most ${MAX_QUOTE_CHARS}`);
    if (!squash(page.text).includes(quote)) return refuse(`the quotation is not in the page it cites (${page.url})`);
    evidence.push({ publisher: page.publisher, url: page.url, class: page.class, retrievedAt: page.retrievedAt, sha256: page.sha256, quote });
  }

  return {
    proposal,
    change: {
      market: view.marketId, path: proposal.record,
      to: { ...record, author: 'agent', asOf: runAt.slice(0, 10) },
      author: { kind: 'agent', run: runAt, model, prompt: PROMPT_VERSION },
      reason: [proposal.reason_en, proposal.reason_zh],
      evidence,
      ...(proposal.trigger ? { trigger: proposal.trigger } : {}),
    },
  };
}

/**
 * The daily pass. Writes nothing.
 *
 * @param store      a view store; only read, changelog and prepare are used
 * @param registers  async (marketId) => that market's source register, or null
 * @param fetchPage  async (url) => { body } or throws
 * @param askModel   async (message) => { proposals, notes, model } | { refused, model }
 */
export async function runAgent({ store, registers, fetchPage, askModel, now = new Date() }){
  const runAt = now.toISOString();
  const today = runAt.slice(0, 10);
  const markets = [];
  let passing = 0;

  for (const view of await store.readAll()){
    const due = dueTriggers(view, today);
    if (!due.length) continue;
    const market = { market: view.marketId, due: due.map(t => t.id), pages: [], proposals: [], notes: null };
    markets.push(market);

    const pages = [];
    for (const page of pagesToFetch(due, await registers(view.marketId))){
      try {
        const { body } = await fetchPage(page.url);
        pages.push({ ...page, text: pageText(body), sha256: hashOf(body), retrievedAt: new Date().toISOString() });
        market.pages.push({ url: page.url, publisher: page.publisher, class: page.class, fetched: true });
      } catch (error){
        market.pages.push({ url: page.url, publisher: page.publisher, class: page.class, fetched: false, error: error.message });
      }
    }
    /* Nothing fetched, nothing to read: the model is not asked what it remembers. */
    if (!pages.length){ market.notes = 'No page could be fetched for the due triggers; the model was not asked.'; continue; }

    const answer = await askModel(userMessage({ view, due, pages, anchors: ANCHORS }));
    market.model = answer.model ?? MODEL;
    if (answer.refused){ market.notes = `The model declined: ${answer.refused}.`; continue; }
    market.notes = answer.notes ?? null;

    for (const proposal of answer.proposals ?? []){
      const made = changeFromProposal(proposal, { view, pages, runAt, model: market.model });
      const line = { record: proposal.record, field: proposal.field, value: proposal.value, trigger: proposal.trigger ?? null, reason: [proposal.reason_en, proposal.reason_zh] };
      if (made.refused){ market.proposals.push({ ...line, gate: 'rejected', why: made.refused }); continue; }
      try {
        const { entry } = await store.prepare(made.change, now);
        market.proposals.push({ ...line, gate: 'would pass', from: entry.from, to: entry.to, evidence: entry.evidence });
        passing += 1;
      } catch (error){
        market.proposals.push({ ...line, gate: 'rejected', why: error.message, evidence: made.change.evidence });
      }
    }
  }
  return {
    runAt, prompt: PROMPT_VERSION, model: MODEL, markets, written: 0,
    /* Guardrail E, reported as it would bind: over the cap the run writes nothing. */
    overCap: passing > MAX_MACHINE_CHANGES_PER_RUN,
  };
}

/** The report a person reads. */
export function renderAgentReport(result){
  const lines = [
    `## Agent — ${result.runAt} (dry run, nothing written)`, '',
    `Model \`${result.model}\`, prompt \`${result.prompt}\`. The agent is not a live author: this is what it would have changed.`, '',
  ];
  if (!result.markets.length) lines.push('No market has a trigger due.');
  for (const m of result.markets){
    lines.push(`### ${m.market}`, '', `Due: ${m.due.map(id => `\`${id}\``).join(', ')}`);
    for (const p of m.pages) lines.push(`- ${p.fetched ? 'fetched' : `NOT fetched (${p.error})`} — ${p.publisher} (${p.class}) ${p.url}`);
    if (m.notes) lines.push('', m.notes);
    for (const p of m.proposals){
      lines.push('', `- **${p.record}** \`${p.field}\` → \`${p.value}\` — **${p.gate}**${p.why ? `: ${p.why.split('\n').join(' ')}` : ''}`, `  - ${p.reason[0]}`);
      for (const e of p.evidence || []) lines.push(`  - “${e.quote}” — ${e.publisher}, ${e.url}`);
    }
    if (!m.proposals.length) lines.push('', 'No change proposed.');
    lines.push('');
  }
  if (result.overCap) lines.push(`More than ${MAX_MACHINE_CHANGES_PER_RUN} changes would pass. Live, this run would write none of them.`);
  return lines.join('\n');
}
