/* ---------------------------------------------------------------------------
   THE SCOUT PASS — report-only proposals for scout cards.

   One pass covers one region: three markets with no dashboard. For each:

       fetch the pages the analyst listed for it, and hash them
       give the model the card as it stands, the anchors and the pages
       turn its answer into whole-record changes
       check every quotation against the page it cites
       put each change to the view writer's gate, in order

   and prepare the surviving proposals as a batch, without applying them.
   The pass runs only on explicit dispatch and receives a read-only store.
   Core-market analysis is separate and also report-only.

   IT READS ONLY WHAT IS ON THE LIST. No search, no following links. A page
   whose terms nobody has read is probed — fetched for its status and thrown
   away — so the report says what CI can reach, and is never shown to the
   model. A page its site's robots file disallows is not fetched at all.

   A PROPOSAL THAT FAILS IS DROPPED, RECORDED AND COUNTED. The records that
   pass are still written: a card may be partial, and a dimension with no
   quotable source stays ungraded. But a pass with any rejection is not a
   clean pass, and clean passes are what the agent is being measured on.

   The dependencies are arguments, as in core.mjs, so everything that decides
   whether a record survives is tested without a network and without a key.
   --------------------------------------------------------------------------- */
import { DIMENSIONS, anchorText } from '../src/governance/investability.js';
import { ARCHETYPES, KNOCK_OUT } from '../src/governance/archetypes.js';
import { MAX_QUOTE_CHARS, EVIDENCE_CLASS } from '../src/governance/automation.js';
import {
  scoutMarket, scoutIdsIn, SCOUT_DIMENSION_IDS, SCOUT_MAX_PAGE_CHARS, SCOUT_EXTREME_GRADES, ADMITTED_TERMS,
  RETURN_WORDS, REVENUE_RATE,
} from '../src/governance/scout.js';
import { scoutSources } from '../src/scout/sources.js';
import { scoutKnockOutDimensions } from '../view/schema/scout.mjs';
import { pageText, hashOf } from './core.mjs';
import { MODEL } from './prompt.mjs';
import { SCOUT_PROMPT_VERSION, SCOUT_SYSTEM, SCOUT_ANSWER_SCHEMA, scoutUserMessage, triggerPrefix } from './scoutPrompt.mjs';

const squash = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

/** The name the fetcher gives itself, and looks for in a robots file. */
export const AGENT_TOKEN = 'bess-research-platform';

/**
 * Does a robots file allow this path? The group naming this agent is used if
 * there is one, otherwise the `*` group. The longest matching rule wins and an
 * Allow beats a Disallow of the same length. No file, or no rule, allows.
 */
export function robotsAllows(robotsText, pathname, token = AGENT_TOKEN){
  const groups = [];
  let current = null, lastWasAgent = false;
  for (const raw of String(robotsText || '').split(/\r?\n/)){
    const line = raw.replace(/#.*$/, '').trim();
    const m = /^([A-Za-z-]+)\s*:\s*(.*)$/.exec(line);
    if (!m) continue;
    const field = m[1].toLowerCase(), value = m[2].trim();
    if (field === 'user-agent'){
      if (!lastWasAgent){ current = { agents: [], rules: [] }; groups.push(current); }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
    } else {
      lastWasAgent = false;
      if (current && (field === 'allow' || field === 'disallow') && value) current.rules.push({ allow: field === 'allow', prefix: value });
    }
  }
  const named = groups.filter(g => g.agents.some(a => a !== '*' && token.toLowerCase().includes(a)));
  const rules = (named.length ? named : groups.filter(g => g.agents.includes('*'))).flatMap(g => g.rules);
  let best = null;
  for (const rule of rules){
    const pattern = new RegExp('^' + rule.prefix.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\\\$$/, '$'));
    if (!pattern.test(pathname)) continue;
    if (!best || rule.prefix.length > best.prefix.length || (rule.prefix.length === best.prefix.length && rule.allow)) best = rule;
  }
  return !best || best.allow;
}

/** What the model is told about the dimensions: the twelve a card is graded on, with their anchors. */
export function scoutDimensions(){
  return DIMENSIONS.filter(d => SCOUT_DIMENSION_IDS.includes(d.id)).map(d => ({
    id: d.id, pillar: d.pillar, what: d.label[0], question: d.question[0], measure: d.measure?.[0] ?? null,
    anchors: Object.fromEntries([5, 4, 3, 2, 1].map(g => [g, anchorText(d.id, g)?.[0] ?? null])),
  }));
}

/** What the model is told about the investors: who each is and what shuts it out. */
export function scoutArchetypes(){
  return Object.values(ARCHETYPES).map(a => ({
    id: a.id, who: a.label[0], usualRoute: a.defaultRoute,
    shutOutBy: scoutKnockOutDimensions(a.id).map(d => ({
      dimension: d, atGrade: Object.entries(a.reads[d]).filter(([, u]) => u === KNOCK_OUT).map(([g]) => Number(g)),
    })),
  }));
}

/* The quotations of one proposal, checked against the pages: guardrail A,
   done mechanically. Returns { evidence, keys } or { refused }. */
function verify(cited, pages){
  const evidence = [], keys = new Set();
  for (const one of Array.isArray(cited) ? cited : []){
    const page = pages[one.page - 1];
    if (!page) return { refused: `cites page ${one.page}, which was not fetched` };
    const quote = squash(one.quote);
    if (!quote) return { refused: 'an evidence record with no quotation' };
    if (quote.length > MAX_QUOTE_CHARS) return { refused: `a quotation of ${quote.length} characters — at most ${MAX_QUOTE_CHARS}` };
    if (!squash(page.text).includes(quote)) return { refused: `the quotation is not in the page it cites (${page.url})` };
    evidence.push({ publisher: page.publisher, url: page.url, class: page.class, retrievedAt: page.retrievedAt, sha256: page.sha256, quote });
    keys.add(page.key);
  }
  return { evidence, keys: [...keys] };
}

/* What a reader of the card sees of a quotation: enough to open the page. */
const shown = (evidence) => evidence.map(({ publisher, url, quote }) => ({ publisher, url, quote }));

/**
 * Turn the model's answer for one market into whole-record changes, in the
 * order the gate needs them: triggers and grades before the verdicts that
 * cite them. Each item is { record, change } or { record, refused }.
 */
export function changesFromScoutAnswer(answer, { card, pages, runAt, model }){
  const day = runAt.slice(0, 10);
  const author = { kind: 'agent', run: runAt, model, prompt: SCOUT_PROMPT_VERSION };
  const out = [];
  const make = (record, to, reason, evidence) => out.push({ record, change: { market: card.id, path: record, to, author, reason, evidence } });
  const refuse = (record, why) => out.push({ record, refused: why });

  for (const t of answer.triggers ?? []){
    const record = `triggers.${t.id}`;
    const v = verify(t.evidence, pages);
    if (v.refused){ refuse(record, v.refused); continue; }
    if (typeof t.id !== 'string' || !t.id.startsWith(triggerPrefix(card.id))){ refuse(record, `a trigger id on this card begins with "${triggerPrefix(card.id)}" — "${t.id}" does not`); continue; }
    if (!v.keys.length){ refuse(record, 'a trigger cites the page that dates it'); continue; }
    make(record, {
      id: t.id, kind: 'event', market: card.id, label: [t.label_en, t.label_zh], expected: t.expected || null,
      watches: t.watches, direction: t.direction, source: v.keys[0], effect: null,
    }, [`${t.label_en}: an event the listed page dates or announces.`, `${t.label_zh}：所列页面已公布或已给出日期的事件。`], v.evidence);
  }

  for (const g of answer.grades ?? []){
    const record = `grades.${g.dimension}`;
    const v = verify(g.evidence, pages);
    if (v.refused){ refuse(record, v.refused); continue; }
    const current = card.grades[g.dimension];
    const to = {
      ...(current ? structuredClone(current) : { dimension: g.dimension, lockedUntil: null }),
      grade: Number(g.grade), trend: g.trend,
      basis: v.evidence.some(e => e.class === EVIDENCE_CLASS.OFFICIAL) ? 'official' : 'third-party',
      evidence: v.keys, reason: [g.reason_en, g.reason_zh], asOf: day, author: 'agent',
    };
    if (g.trend === 'stable') delete to.trendCause; else to.trendCause = [g.cause_en, g.cause_zh];
    make(record, to, [g.reason_en, g.reason_zh], v.evidence);
  }

  /* FACTS, ONE AT A TIME. The store holds the facts as one list, but each fact
     stands on its own quotation, so each is checked on its own: one that
     fails is dropped and recorded as its own rejection, named by its place in
     the answer, and the ones that pass are still written. Until 2026-10-11 the
     first failure refused the whole list, and one over-long quotation cost a
     market every fact it had.

     A DROPPED FACT MUST NOT DELETE ONE THE CARD ALREADY HOLDS. The model
     returns the list as it should read afterwards, so a fact it meant to keep
     and quoted badly would otherwise vanish from the card without anybody
     having decided that. Where a dropped fact's text is a fact on the card,
     the card's own version stays in the list. Its quotation is found again in
     this run's page, because the gate shows no quotation a run did not
     verify. If it cannot be found again the list is left exactly as it is:
     nothing is written to `facts` this run, and that is recorded too. */
  if ((answer.facts ?? []).length){
    const facts = [], evidence = [];
    const onCard = (f) => card.facts.find(held => squash(held.text[0]) === squash(f.text_en) || squash(held.text[1]) === squash(f.text_zh));
    let stranded = null;
    answer.facts.forEach((f, i) => {
      const v = verify(f.evidence, pages);
      /* The two things the gate would refuse the whole list for, caught here
         for the one fact that has them. */
      if (!v.refused && !v.evidence.length) v.refused = 'a fact carries at least one quotation with its source';
      if (!v.refused && [f.text_en, f.text_zh, ...v.evidence.map(e => e.quote)].some(s => RETURN_WORDS.test(s) || REVENUE_RATE.test(s))){
        v.refused = 'names a modelled return or quotes a revenue rate — a fact on a scout card does neither';
      }
      if (!v.refused){
        facts.push({ text: [f.text_en, f.text_zh], evidence: shown(v.evidence) });
        evidence.push(...v.evidence);
        return;
      }
      refuse(`facts[${i}]`, v.refused);
      const held = onCard(f);
      if (!held) return;
      const again = verify(held.evidence.map(e => ({ page: pages.findIndex(p => p.url === e.url) + 1, quote: e.quote })), pages);
      if (again.refused){ stranded = stranded ?? i; return; }
      facts.push({ text: held.text, evidence: shown(again.evidence) });
      evidence.push(...again.evidence);
    });
    if (stranded !== null){
      refuse('facts', `facts[${stranded}] is already on the card and its quotation could not be found again in this run's pages — the list is left as it is, so nothing is deleted`);
    } else if (facts.length){
      make('facts', facts, [`${facts.length} sourced facts from the listed pages.`, `来自所列页面的${facts.length}条有出处的事实。`], evidence);
    }
  }

  if (answer.return_signal?.present){
    const v = verify(answer.return_signal.evidence, pages);
    if (v.refused) refuse('returnSignal', v.refused);
    else make('returnSignal', { kind: 'third-party-index', note: [answer.return_signal.note_en, answer.return_signal.note_zh], evidence: shown(v.evidence) },
      ['A third party\'s published index, quoted as a signal. No return is modelled.', '引用第三方公布的指数作为参考信号，本平台未对回报建模。'], v.evidence);
  }

  for (const p of answer.verdicts ?? []){
    const record = `verdicts.${p.archetype}`;
    const v = verify(p.evidence, pages);
    if (v.refused){ refuse(record, v.refused); continue; }
    const current = card.verdicts[p.archetype];
    const to = {
      ...(current ? structuredClone(current) : { archetype: p.archetype, route: p.route, where: null, lockedUntil: null }),
      call: p.call,
      because: (p.because ?? []).map(b => ({ dimension: b.dimension, text: [b.text_en, b.text_zh] })),
      despite: [p.despite_en, p.despite_zh],
      changesIf: p.waits_for ? [p.waits_for] : (current?.changesIf ?? []),
      reviewBy: p.review_by || current?.reviewBy || null,
      author: 'agent', asOf: day,
    };
    make(record, to, [p.reason_en, p.reason_zh], v.evidence);
  }
  return out;
}

/* A refusal that only says the record already reads this way. Dropped, never
   counted: the model was asked to leave such records out and occasionally
   repeats one. */
const NOTHING = /nothing (of substance )?would change/;

/* Deterministic, from the run and the record: the sample is not the agent's choice. */
function pick(seed, items, count){
  const score = (s) => { let h = 2166136261; for (const c of `${seed}|${s}`){ h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  return [...items].sort((a, b) => score(a) - score(b)).slice(0, count);
}

/**
 * The records of one card the analyst is asked to open: every verdict, every
 * grade of 1 or 5, every grade an investor can be shut out on, and three
 * others chosen from the run id.
 */
export function spotCheckSample(cardId, written, runAt){
  const grades = written.filter(w => w.record.startsWith('grades.'));
  const knock = new Set(Object.keys(ARCHETYPES).flatMap(a => scoutKnockOutDimensions(a)).map(d => `grades.${d}`));
  const must = new Set([
    ...written.filter(w => w.record.startsWith('verdicts.')).map(w => w.record),
    ...grades.filter(w => SCOUT_EXTREME_GRADES.includes(w.to.grade) || knock.has(w.record)).map(w => w.record),
  ]);
  for (const record of pick(`${runAt}|${cardId}`, grades.map(w => w.record).filter(r => !must.has(r)), 3)) must.add(record);
  return must;
}

/**
 * One scout pass.
 *
 * @param store      a view store
 * @param region     one of the scout regions
 * @param fetchPage  async (url) => { body } or throws
 * @param robots     async (url) => true when the site's robots file allows it
 * @param askModel   async (message, { system, schema }) => answer | { refused }
 * @param sources    (id) => that market's source list; the default is the analyst's
 */
export async function runScoutPass({ store, region, fetchPage, robots, askModel, now = new Date(), sources = scoutSources }){
  const runAt = now.toISOString();
  const ids = scoutIdsIn(region);
  const live = false; // Analysis is report-only, regardless of the supplied store.
  const state = await store.scoutRunState();
  const pass = { run: runAt, region, cards: ids, model: MODEL, prompt: SCOUT_PROMPT_VERSION, pages: [], proposed: 0, written: 0, unfetched: [], unanswered: [], rejected: [] };
  const cards = [], changes = [];

  for (const id of ids){
    const market = scoutMarket(id);
    const card = await store.readCard(id);
    const report = { card: id, name: market.name[0], notes: null, usage: null, written: [], rejected: [] };
    cards.push(report);

    const pages = [];
    for (const [key, source] of Object.entries(sources(id))){
      const line = { card: id, key, url: source.url, publisher: source.publisher, terms: source.terms?.status ?? 'unread' };
      pass.pages.push(line);
      const admitted = ADMITTED_TERMS.includes(line.terms);
      try {
        if (!(await robots(source.url))){ line.status = 'disallowed by robots'; continue; }
        const { body } = await fetchPage(source.url);
        if (!admitted){ line.status = 'reachable, terms not read'; continue; }
        line.status = 'read';
        pages.push({
          key, url: source.url, publisher: source.publisher,
          class: source.authority === 'official' ? EVIDENCE_CLASS.OFFICIAL : EVIDENCE_CLASS.THIRD_PARTY,
          text: pageText(body).slice(0, SCOUT_MAX_PAGE_CHARS), sha256: hashOf(body), retrievedAt: new Date().toISOString(),
        });
      } catch (error){ line.status = `not fetched (${error.message})`; }
    }
    /* Nothing read, nothing to write: the model is not asked what it remembers. */
    if (!pages.length){ pass.unfetched.push(id); report.notes = 'No admitted page could be read; the model was not asked.'; continue; }

    const answer = await askModel(scoutUserMessage({ market, card, dimensions: scoutDimensions(), archetypes: scoutArchetypes(), pages }),
      { system: SCOUT_SYSTEM, schema: SCOUT_ANSWER_SCHEMA });
    if (answer.model) pass.model = answer.model;
    report.usage = answer.usage ?? null;
    if (answer.refused){ pass.unanswered.push(id); report.notes = `The model declined: ${answer.refused}.`; continue; }
    report.notes = answer.notes ?? null;

    for (const item of changesFromScoutAnswer(answer, { card, pages, runAt, model: answer.model ?? MODEL })){
      pass.proposed += 1;
      const reject = (why, evidence) => {
        const one = { card: id, record: item.record, why };
        pass.rejected.push(one);
        report.rejected.push({ ...one, evidence });
      };
      if (item.refused){ reject(item.refused); continue; }
      try {
        const { entry } = await store.prepareScoutChange(item.change, now, state);
        changes.push(item.change);
        report.written.push({ record: item.record, from: entry.from, to: entry.to, reason: entry.reason, evidence: entry.evidence });
      } catch (error){
        if (NOTHING.test(error.message)){ pass.proposed -= 1; continue; }
        reject(error.message.split('\n').map(s => s.trim()).join(' '), item.change.evidence);
      }
    }
  }

  /* Validate the whole proposal batch. Nothing is written to the view or pass log. */
  let recorded = { ...pass, written: 0 };
  {
    try { await store.prepareScoutRun(changes, now); }
    catch (error){ recorded.rejected = [...pass.rejected, { card: null, record: null, why: error.message }]; }
  }
  return { runAt, region, live, pass: recorded, cards, wouldWrite: changes.length };
}

const call = (v) => (v && typeof v === 'object' ? (v.call ?? v.grade ?? '') : '');

/** The report a person reads, and spot-checks from. */
export function renderScoutReport(result){
  const { pass } = result;
  const lines = [
    `## Scout pass — ${result.region} — ${result.runAt}${result.live ? '' : ' (dry run, nothing written)'}`, '',
    `Model \`${pass.model}\`, prompt \`${pass.prompt}\`. ${result.live
      ? `${pass.written} records written. This pass is ${pass.clean ? 'clean' : 'NOT clean'}.`
      : `Report-only scout analysis: ${result.wouldWrite} records would have been written.`}`, '',
    '### Pages', '',
  ];
  for (const p of pass.pages) lines.push(`- ${p.card} \`${p.key}\` — ${p.status} — terms: ${p.terms} — ${p.publisher}, ${p.url}`);
  if (pass.unfetched.length) lines.push('', `No admitted page was read for: ${pass.unfetched.join(', ')}.`);
  if (pass.unanswered.length) lines.push('', `The model did not answer for: ${pass.unanswered.join(', ')}.`);

  for (const card of result.cards){
    lines.push('', `### ${card.name} (\`${card.card}\`)`, '');
    if (card.notes) lines.push(card.notes, '');
    if (card.usage) lines.push(`Tokens: ${card.usage.input_tokens ?? '?'} in, ${card.usage.output_tokens ?? '?'} out.`, '');
    const sample = spotCheckSample(card.card, card.written, result.runAt);
    for (const w of card.written){
      const mark = sample.has(w.record) ? '**CHECK** ' : '';
      /* A grade or a call has a value worth printing; a trigger or the facts do not. */
      const value = call(w.to) === '' ? '' : `${w.from ? `\`${call(w.from)}\` → ` : ''}\`${call(w.to)}\` `;
      lines.push(`- ${mark}**${w.record}** ${value}— ${w.reason[0]}`);
      if (w.record.startsWith('grades.')){
        const anchor = anchorText(w.to.dimension, w.to.grade)?.[0];
        if (anchor) lines.push(`  - Anchor for ${w.to.grade}: ${anchor}`);
      }
      for (const e of w.evidence) lines.push(`  - “${e.quote}” — ${e.publisher}, ${e.url}`);
    }
    for (const r of card.rejected){
      lines.push(`- REJECTED **${r.record}** — ${r.why}`);
      for (const e of r.evidence || []) lines.push(`  - “${e.quote}” — ${e.publisher}, ${e.url}`);
    }
    if (!card.written.length && !card.rejected.length) lines.push('Nothing proposed.');
  }
  const run = pass.rejected.filter(r => r.card === null);
  if (run.length) lines.push('', ...run.map(r => `The run as a whole was refused: ${r.why}`));
  lines.push('', 'For each record marked CHECK: is the quotation on the page and does it say what the reason claims; is this the anchor line you would have picked; is the source what the list says it is. Then record the check with the scout-check command in docs/governance.md.');
  return lines.join('\n');
}
