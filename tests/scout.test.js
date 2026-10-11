/* ---------------------------------------------------------------------------
   THE SCOUTING TIER.

   The agent is a live author on scout cards and nowhere else. These tests are
   what "nowhere else" rests on, and what a card may hold:

     · the roster and the source list are the analyst's, and no id is in both
       tiers
     · a card holds no return: not a field, not a dimension, not a word
     · the agent's rights on a card, and guardrails A to I as they read when a
       record is created as often as it is changed
     · the agent is dry on cards until SCOUT_LIVE_AUTHORS says otherwise, and
       even live it cannot reach a market through the scout door
     · a pass is clean only when nothing was rejected, and the streak is a
       function of the pass log

   Every card here is a hand-written fixture in a temporary store. Nothing in
   this file writes view/scout/, and the model is a stub that answers whatever
   the test says, including an answer that lies.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createViewStore, ViewRejected, VIEW_ROOT } from '../etl/lib/viewWriter.mjs';
import {
  AUTHOR_RIGHTS, LIVE_AUTHORS, PERMITTED_AUTHORS, HELD_AUTHORS, parsePath, validateChangelogEntry,
} from '../view/schema/view.mjs';
import {
  SCOUT_SECTIONS, SCOUT_RIGHTS, SCOUT_LIVE_AUTHORS, emptyCard, cardIsEmpty, validateCard, parseScoutPath,
  scoutAuthorMayWrite, scoutMachineProblems, scoutRunProblems, scoutKnockOutDimensions, admittedSources,
  passIsClean, validatePass, cleanStreak, graduationProgress, returnTextProblems,
} from '../view/schema/scout.mjs';
import {
  SCOUT_ROSTER, SCOUT_IDS, SCOUT_REGION_IDS, SCOUT_REGIONS, SCOUT_DIMENSION_IDS, SCOUT_PILLARS, SCOUT_SCHEDULE,
  MAX_SCOUT_FACTS, MAX_SCOUT_CARDS_PER_RUN, SCOUT_EXIT_STREAK, SCOUT_REVIEW_MIN_DAYS, SCOUT_FIRST_CALLS,
  SCOUT_KNOCKED_OUT_CALLS, SCOUT_EXTREME_GRADES, GRADUATION, GRADUATION_RULE, RETURN_WORDS, REVENUE_RATE,
  RETURN_SIGNAL_KINDS, RETURN_SIGNAL_LABEL, isScoutId, scoutIdsIn, scoutMarket, ADMITTED_TERMS,
} from '../src/governance/scout.js';
import { SCOUT_SOURCES, scoutSources } from '../src/scout/sources.js';
import { MAX_MACHINE_CHANGES_PER_RUN } from '../src/governance/automation.js';
import { DIMENSION_IDS, ARCHETYPE_IDS, dimension } from '../src/governance/investability.js';
import { markets } from '../src/markets/registry.js';
import { runScoutPass, renderScoutReport, changesFromScoutAnswer, robotsAllows, spotCheckSample, scoutDimensions, scoutArchetypes } from '../agent/scout.mjs';
import { SCOUT_PROMPT_VERSION, SCOUT_SYSTEM, SCOUT_ANSWER_SCHEMA, scoutUserMessage, triggerPrefix } from '../agent/scoutPrompt.mjs';
import { MODEL } from '../agent/prompt.mjs';
import { hashOf } from '../agent/core.mjs';
import { scoutIndex, scoutData } from '../vite-plugin-scout.js';
import { scoutBoardRows } from '../src/scout/boardRows.js';
import { buildScoutPage, NO_RETURN } from '../src/scout/scoutModel.js';
import { scoutStatus, renderScoutStatus, checkState } from '../scripts/view/scout-status.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const analyst = { kind: 'analyst' };
const reason = ['Because the page says so.', '因为页面如此表述。'];
const NOW = new Date('2026-11-11T04:30:00Z');
const RUN = NOW.toISOString();
const agent = { kind: 'agent', run: RUN, model: MODEL, prompt: SCOUT_PROMPT_VERSION };
const SHA = `sha256:${'c'.repeat(64)}`;

/* Spain has two listed pages whose terms were read. Every fixture uses them. */
const STORAGE = SCOUT_SOURCES.es['ree-storage'];
const ACCESS = SCOUT_SOURCES.es['ree-access'];
const quoted = (source = STORAGE, patch = {}) => ({
  publisher: source.publisher, url: source.url, class: 'official', retrievedAt: RUN, sha256: SHA,
  quote: 'Storage facilities require an access and connection permit.', ...patch,
});

const grade = (patch = {}) => ({
  dimension: 'gridScarcity', grade: 3, trend: 'stable', basis: 'official', evidence: ['ree-storage'],
  reason: ['Capacity is published node by node.', '各节点的可用容量逐一公布。'], asOf: '2026-11-11', author: 'agent', lockedUntil: null, ...patch,
});
const verdict = (patch = {}) => ({
  archetype: 'developer', call: 'opportunistic', route: 'greenfield', where: null,
  because: [{ dimension: 'gridScarcity', text: ['Capacity can still be secured.', '仍可取得并网容量。'] }],
  despite: ['Nothing is contracted.', '没有任何合同化收入。'],
  changesIf: [], reviewBy: null, author: 'agent', asOf: '2026-11-11', lockedUntil: null, ...patch,
});
const trigger = (patch = {}) => ({
  id: 'es-capacity-auction', kind: 'event', market: 'es', label: ['The first capacity auction', '首次容量拍卖'],
  expected: '2027-06', watches: ['policyStability'], direction: 'up', source: 'ree-storage', effect: null, ...patch,
});
const change = (p, to, patch = {}) => ({ market: 'es', path: p, to, author: agent, reason, evidence: [quoted()], ...patch });

async function scratch(run){
  const root = await mkdtemp(path.join(tmpdir(), 'bess-scout-'));
  try { await run(createViewStore(root), root); }
  finally { await rm(root, { recursive: true, force: true }); }
}
const rejects = (promise, pattern) => assert.rejects(promise, (error) => {
  assert.ok(error instanceof ViewRejected, `expected a ViewRejected, got ${error?.name}: ${error?.message}`);
  assert.match(error.message, pattern);
  return true;
});
const files = async (root) => (await readdir(root, { recursive: true })).map(f => f.replace(/\\/g, '/')).sort();

/* The flip, as the analyst will make it: the agent added to the card list.
   Done on the real list, for one test at a time, and always undone. */
async function withAgentLive(run){
  SCOUT_LIVE_AUTHORS.push('agent');
  try { return await run(); }
  finally { SCOUT_LIVE_AUTHORS.splice(SCOUT_LIVE_AUTHORS.indexOf('agent'), 1); }
}

/* ---- the roster ---------------------------------------------------------------- */

test('the roster is the nine markets of the first batch, three a region, and none is a registered market', async () => {
  assert.deepEqual(SCOUT_IDS, ['se', 'ee', 'lt', 'es', 'nl', 'bg', 'cl', 'ca_on', 'sa']);
  assert.deepEqual(SCOUT_REGION_IDS, ['nordics-baltics', 'southern-eastern-europe', 'americas-middle-east']);
  for (const region of SCOUT_REGION_IDS){
    assert.equal(scoutIdsIn(region).length, 3, region);
    assert.ok(SCOUT_REGIONS[region].label[0] && SCOUT_REGIONS[region].label[1]);
  }
  assert.equal(MAX_SCOUT_CARDS_PER_RUN, 3, 'a run covers one region');
  assert.deepEqual(Object.values(SCOUT_SCHEDULE).sort(), [...SCOUT_REGION_IDS].sort(), 'every region has its day of the month');

  /* THE TWO TIERS DO NOT OVERLAP. The id is what decides which rights a
     change is read against, so an id in both would be a core market the agent
     could write. */
  const core = new Set(markets.map(m => m.manifest.id));
  const coreFiles = (await readdir(path.join(VIEW_ROOT, 'markets'))).map(f => f.replace(/\.json$/, ''));
  for (const m of SCOUT_ROSTER){
    assert.ok(/^[a-z][a-z0-9_]*$/.test(m.id), m.id);
    assert.ok(!core.has(m.id), `${m.id} is a registered market and a scout market`);
    assert.ok(!coreFiles.includes(m.id), `${m.id} has a market view and a scout card`);
    assert.ok(m.name[0] && m.name[1] && SCOUT_REGIONS[m.region], m.id);
    assert.equal(scoutMarket(m.id), m);
  }
  for (const id of [...core, 'xx', '', null, undefined, 'SE', 'se.json']) assert.equal(isScoutId(id), false, `${id}`);
});

test('a card is graded on twelve dimensions: the two in the Return pillar are not among them', () => {
  assert.equal(SCOUT_DIMENSION_IDS.length, 12);
  assert.deepEqual(DIMENSION_IDS.filter(id => !SCOUT_DIMENSION_IDS.includes(id)), ['assetReturn', 'revenueCertainty']);
  for (const id of SCOUT_DIMENSION_IDS) assert.notEqual(dimension(id).pillar, 'return');
  assert.deepEqual(SCOUT_PILLARS, ['entry', 'durability', 'capital'], 'three pillars, never blended into one number');
  assert.equal(scoutDimensions().length, 12);
  assert.ok(scoutDimensions().every(d => d.anchors[1] && d.anchors[5]));
});

test('every listed page is https, says who publishes it and what its terms were found to say', () => {
  assert.deepEqual(Object.keys(SCOUT_SOURCES).sort(), [...SCOUT_IDS].sort(), 'every roster market has a list, and no other id does');
  const statuses = ['permits', 'silent', 'private-use', 'refused', 'unread'];
  for (const [id, list] of Object.entries(SCOUT_SOURCES)){
    assert.ok(Object.keys(list).length > 0, `${id}: no page listed`);
    for (const [key, s] of Object.entries(list)){
      assert.match(key, /^[a-z0-9]+(-[a-z0-9]+)*$/, `${id}/${key}`);
      assert.match(s.url, /^https:\/\//, `${id}/${key}`);
      assert.ok(s.publisher && ['official', 'third-party'].includes(s.authority), `${id}/${key}`);
      assert.ok(statuses.includes(s.terms.status), `${id}/${key}`);
      /* A status other than unread is a claim that somebody read a page on a date. */
      if (s.terms.status !== 'unread'){
        assert.match(s.terms.url, /^https:\/\//, `${id}/${key}: terms with no address`);
        assert.match(s.terms.readOn, /^\d{4}-\d{2}-\d{2}$/, `${id}/${key}: terms with no date`);
      }
      assert.notEqual(s.terms.status, 'refused', `${id}/${key}: a page whose terms refuse reuse is not listed`);
    }
    for (const s of Object.values(admittedSources(id))) assert.ok(ADMITTED_TERMS.includes(s.terms.status));
  }
  /* `private-use` is a publisher that reserves everything but private,
     non-commercial use. It is admitted on the analyst's ruling that the
     platform is for his private use, and is its own status so that the ground
     stays visible: such a page is a third party's, never an official body's,
     and its terms were read by somebody on a date. */
  assert.deepEqual(ADMITTED_TERMS, ['permits', 'silent', 'private-use']);
  const privateUse = Object.entries(SCOUT_SOURCES).flatMap(([id, list]) => Object.entries(list).filter(([, s]) => s.terms.status === 'private-use').map(([key, s]) => [`${id}/${key}`, s]));
  assert.ok(privateUse.length > 0);
  for (const [where, s] of privateUse){
    assert.equal(s.authority, 'third-party', `${where}: a page admitted on private use is listed as official`);
    assert.match(s.terms.url, /^https:\/\//, where);
  }
  assert.deepEqual(Object.keys(admittedSources('sa')), [], 'an unread page is not admitted');
  assert.deepEqual(Object.keys(admittedSources('nl', UNREAD)), []);
});

/* ---- the wall -------------------------------------------------------------------- */

test('nothing in view.mjs was widened for the scout tier', () => {
  /* The core tables, value for value. A change to any of these is a change to
     what a machine may do on a market, and is not this phase's to make. */
  assert.deepEqual(PERMITTED_AUTHORS, ['analyst', 'rule', 'agent']);
  assert.deepEqual(LIVE_AUTHORS, ['analyst', 'rule']);
  assert.deepEqual(HELD_AUTHORS, ['analyst']);
  assert.deepEqual(AUTHOR_RIGHTS.agent, {
    grades:   { create: false, replace: true, remove: false, fields: ['grade', 'trend', 'trendCause', 'reason', 'evidence', 'basis'] },
    verdicts: { create: false, replace: true, remove: false, fields: ['call', 'because', 'despite', 'reviewBy', 'changesIf'] },
    triggers: { create: true, replace: true, remove: false, fields: null },
    thesis:   { create: true, replace: true, remove: false, fields: null },
  });
  assert.deepEqual(AUTHOR_RIGHTS.rule, {
    grades:   { create: false, replace: true, remove: false, fields: ['grade', 'trend', 'trendCause'] },
    verdicts: { create: false, replace: true, remove: false, fields: ['call', 'reviewBy', 'changesIf'] },
  });
  /* A card's paths are not a market's, in either direction. */
  for (const p of ['facts', 'returnSignal', 'checked']) assert.equal(parsePath(p), null, p);
  for (const p of ['thesis', 'grades.gridScarcity.held', 'grades.assetReturn', 'grades.revenueCertainty']) assert.equal(parseScoutPath(p), null, p);
});

test('a path on a card names one whole record, and none spells a return, a held view or methodology', () => {
  assert.deepEqual(SCOUT_SECTIONS, ['facts', 'grades', 'verdicts', 'triggers', 'returnSignal', 'checked']);
  for (const id of SCOUT_DIMENSION_IDS) assert.ok(parseScoutPath(`grades.${id}`));
  for (const id of ARCHETYPE_IDS) assert.ok(parseScoutPath(`verdicts.${id}`));
  assert.deepEqual(parseScoutPath('facts'), { section: 'facts', key: null, layer: null });
  const refused = [
    'grades.assetReturn', 'grades.revenueCertainty', 'grades.gridScarcity.held', 'grades.gridScarcity.grade', 'verdicts.developer.call',
    'irr', 'returns', 'returnSignal.value', 'comparison', 'economics.merchGross', 'facts.0', 'thesis',
    'weights.developer', 'anchors.gridScarcity', 'limits', 'bands.wait', 'discountRate', 'roster', 'sources', 'sources.es', 'name', 'region', 'tier', 'id',
    'graduatesWhen', 'passes', '', null, undefined, 7,
  ];
  for (const p of refused){
    assert.equal(parseScoutPath(p), null, `"${p}" parsed as a path on a card`);
    for (const kind of PERMITTED_AUTHORS) assert.equal(scoutAuthorMayWrite(p, kind), false, `"${kind}" may write "${p}"`);
  }
});

/* ---- no return is modelled ----------------------------------------------------- */

test('no return is modelled: a card has no field for one, no dimension for one and no words for one', () => {
  const card = { ...emptyCard('es'), grades: { gridScarcity: grade({ author: 'analyst' }) } };
  assert.deepEqual(validateCard(card), []);
  const bad = (edit, pattern) => {
    const next = structuredClone(card); edit(next);
    const problems = validateCard(next);
    assert.ok(problems.some(p => pattern.test(p)), `expected ${pattern}, got ${JSON.stringify(problems)}`);
  };
  for (const key of ['irr', 'comparison', 'economics', 'returns', 'weights', 'anchors', 'limits', 'bands', 'name', 'region', 'graduatesWhen']){
    bad(c => { c[key] = {}; }, /is not a section of a scout card/);
  }
  bad(c => { c.grades.assetReturn = { ...grade({ author: 'analyst' }), dimension: 'assetReturn' }; }, /no return is modelled/);
  bad(c => { c.grades.revenueCertainty = { ...grade({ author: 'analyst' }), dimension: 'revenueCertainty' }; }, /no return is modelled/);
  bad(c => { c.grades.gridScarcity.metric = { usd: 1 }; }, /carries no figures beside a grade/);
  bad(c => { c.grades.gridScarcity.held = { grade: 1 }; }, /has no held layer/);
  bad(c => { c.returnSignal = { kind: 'third-party-index', note: reason, evidence: [quoted()], value: 338 }; }, /carries no number of its own/);
  bad(c => { c.returnSignal = { kind: 'engine', note: reason, evidence: [quoted()] }; }, /returnSignal\.kind/);

  /* The words. Every place a reader would see text is checked. */
  const irr = ['An IRR of 11% is typical.', '典型内部收益率为11%。'];
  bad(c => { c.grades.gridScarcity.reason = irr; }, /names a modelled return/);
  bad(c => { c.facts = [{ text: irr, evidence: [quoted()] }]; }, /names a modelled return/);
  bad(c => { c.facts = [{ text: reason, evidence: [quoted(STORAGE, { quote: 'Projects target an IRR above 10%.' })] }]; }, /names a modelled return/);
  bad(c => { c.returnSignal = { kind: 'third-party-index', note: ['Payback in six years.', '六年回本。'], evidence: [quoted()] }; }, /names a modelled return/);
  bad(c => { c.triggers = [trigger({ label: ['Returns of about 12% are expected', '预计回报率约12%'] })]; }, /names a modelled return/);
  for (const text of ['IRR', 'an unlevered IRR', 'MOIC of 1.8x', 'payback', 'internal rate of return', '内部收益率', '回收期', '回报率', '9% equity return', 'yields of 8%']){
    assert.ok(RETURN_WORDS.test(text), text);
  }
  for (const text of ['The operator returns the deposit on connection.', 'Capacity fell 12% in a year.', 'A 9% share of peak demand.']){
    assert.ok(!RETURN_WORDS.test(text), text);
  }

  /* A third party's revenue index is a signal, and only the signal may quote it. */
  const index = ['The index publishes €338k/MW/yr for two-hour assets.', '该指数公布的两小时资产水平为每兆瓦每年33.8万欧元。'];
  assert.ok(REVENUE_RATE.test(index[0]) && REVENUE_RATE.test(index[1]));
  assert.ok(!REVENUE_RATE.test('aFRR capacity cleared at €120/MW/h.'));
  bad(c => { c.facts = [{ text: index, evidence: [quoted()] }]; }, /belongs in the return signal and nowhere else/);
  const withSignal = { ...card, returnSignal: { kind: 'third-party-index', note: index, evidence: [quoted()] } };
  assert.deepEqual(validateCard(withSignal), []);
  assert.deepEqual(returnTextProblems(withSignal), []);
  assert.deepEqual(RETURN_SIGNAL_KINDS, ['third-party-index']);
  assert.ok(RETURN_SIGNAL_LABEL['third-party-index'][1]);
});

test('a scout card cannot enter the engine, the league table or the frontier', async () => {
  const walk = async (dir) => {
    const out = [];
    for (const entry of await readdir(dir, { withFileTypes: true })){
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) out.push(...await walk(full));
      else if (/\.m?js$/.test(entry.name)) out.push(full);
    }
    return out;
  };
  const rel = (file) => path.relative(REPO, file).replace(/\\/g, '/');
  const SCOUT_IMPORT = /from\s+['"][^'"]*(\/scout\/|governance\/scout\.js|schema\/scout\.mjs|view\/scout)/;

  /* Nothing that prices a return, ranks one or plots one imports the tier.
     Three home modules do, and none of them touches a return: the page that
     places the scouting rows, the renderer that draws them, and the "what
     changed" panel, which needs a scout market's name. */
  const pricing = [
    ...await walk(path.join(REPO, 'src', 'comparison')),
    ...(await walk(path.join(REPO, 'src', 'home'))).filter(f => !/[\\/](verdictHome|verdictBoard|changesPanel)\.js$/.test(f)),
    ...await walk(path.join(REPO, 'src', 'markets')),
    ...await walk(path.join(REPO, 'src', 'entry')),
  ];
  for (const file of pricing){
    assert.ok(!SCOUT_IMPORT.test(await readFile(file, 'utf8')), `${rel(file)} imports the scouting tier`);
  }
  /* And the tier imports nothing that prices one, and formats no IRR. */
  for (const file of [...await walk(path.join(REPO, 'src', 'scout')), path.join(REPO, 'src', 'governance', 'scout.js'), path.join(REPO, 'view', 'schema', 'scout.mjs')]){
    const source = await readFile(file, 'utf8');
    assert.ok(!/from\s+['"][^'"]*(comparison\/|entry\/|returnsPage|marketComparison|investmentLab|viewRegistry)/.test(source), `${rel(file)} imports the engine, a ledger or a market view`);
    assert.ok(!/fmtIRR|irrHold|irrExit|runScenarioSet|runBaseCase/.test(source), `${rel(file)} reaches for a return`);
    /* The registry is imported by the page alone, for the navigation strip. */
    if (!/scoutPage\.js$/.test(file)) assert.ok(!/markets\/registry/.test(source), `${rel(file)} imports the market registry`);
  }
  /* The verdict board draws the scouting rows from calls and prints no return in them. */
  const board = await readFile(path.join(REPO, 'src', 'home', 'verdictBoard.js'), 'utf8');
  const scouting = board.slice(board.indexOf('the scouting tier'), board.indexOf('export function renderVerdictBoard'));
  assert.ok(scouting.length > 500 && !/irr\(|fmtIRR|ret\.|\.fit\b/.test(scouting), 'a scouting row prints a return or a fit');
});

/* ---- rights ---------------------------------------------------------------------- */

test('on a card the agent creates and changes, never removes, and a rule writes nothing', () => {
  assert.deepEqual(Object.keys(SCOUT_RIGHTS).sort(), ['agent', 'analyst'], 'there are no rules on a card');
  assert.deepEqual(Object.keys(SCOUT_RIGHTS.agent).sort(), ['facts', 'grades', 'returnSignal', 'triggers', 'verdicts']);
  for (const [section, rights] of Object.entries(SCOUT_RIGHTS.agent)){
    assert.equal(rights.remove, false, `the agent may remove ${section}`);
    assert.equal(rights.create, true);
  }
  /* What it may change on a record that exists is what it may change on a market. */
  assert.equal(SCOUT_RIGHTS.agent.grades.fields, AUTHOR_RIGHTS.agent.grades.fields);
  assert.equal(SCOUT_RIGHTS.agent.verdicts.fields, AUTHOR_RIGHTS.agent.verdicts.fields);
  for (const field of ['lockedUntil', 'held', 'dimension', 'archetype', 'route', 'where', 'scoreNote', 'author']){
    assert.ok(!SCOUT_RIGHTS.agent.grades.fields.includes(field) && !SCOUT_RIGHTS.agent.verdicts.fields.includes(field), field);
  }
  /* The analyst's spot-check is the analyst's. */
  assert.equal(scoutAuthorMayWrite('checked', 'analyst'), true);
  for (const kind of ['agent', 'rule', 'etl', undefined]) assert.equal(scoutAuthorMayWrite('checked', kind), false);
  for (const p of ['grades.gridScarcity', 'verdicts.developer', 'facts', 'returnSignal', 'triggers.es-x']){
    assert.equal(scoutAuthorMayWrite(p, 'rule'), false, `a rule may write ${p}`);
    assert.equal(scoutAuthorMayWrite(p, 'agent'), true);
  }
});

/* ---- the gate --------------------------------------------------------------------- */

test('A — every record the agent creates quotes a page fetched in that run, from the analyst\'s list', () => scratch(async (store) => {
  await store.prepare(change('grades.gridScarcity', grade()), NOW);
  const bad = (patch, pattern) => rejects(store.prepare(change('grades.gridScarcity', grade(), patch), NOW), pattern);
  await bad({ evidence: [] }, /at least one evidence record/);
  await bad({ evidence: undefined }, /at least one evidence record/);
  await bad({ evidence: [quoted(STORAGE, { quote: '' })] }, /quotes the passage/);
  await bad({ evidence: [quoted(STORAGE, { sha256: 'abc' })] }, /content hash/);
  await bad({ evidence: [quoted(STORAGE, { quote: 'x'.repeat(301) })] }, /at most 300/);
  /* A real-looking page that is not on the list is not a source. */
  await bad({ evidence: [quoted(STORAGE, { url: 'https://www.ree.es/en/some-other-page' })] }, /not on this market's source list/);
  await bad({ evidence: [quoted(STORAGE, { url: 'https://paper.example/story', publisher: 'A paper' })] }, /not on this market's source list/);
  /* What a source is, is the list's to say. */
  await bad({ evidence: [quoted(STORAGE, { class: 'third-party' })] }, /is listed as official and the change calls it third-party/);
  /* The grade names exactly the pages the change quotes. */
  await rejects(store.prepare(change('grades.gridScarcity', grade({ evidence: ['ree-access'] })), NOW), /not the pages the change quotes/);
  await rejects(store.prepare(change('grades.gridScarcity', grade({ evidence: ['not-listed'] })), NOW), /not the pages the change quotes/);
  assert.ok(validateCard({ ...emptyCard('es'), grades: { gridScarcity: grade({ evidence: ['not-listed'] }) } }).some(p => /not in this market's source list/.test(p)));
  await bad({ author: { ...agent, run: undefined } }, /records the run/);
  await bad({ author: { kind: 'agent', run: RUN } }, /model and prompt version/);

  /* A page whose terms nobody has read is on the list and still not a source. */
  await rejects(store.prepare({
    market: 'sa', path: 'grades.gridScarcity', to: grade({ evidence: ['sppc-home'] }), author: agent, reason,
    evidence: [quoted(SCOUT_SOURCES.sa['sppc-home'])],
  }, NOW), /its terms have not been read/);

  /* Facts and the signal show only quotations the change verified. */
  const fact = { text: reason, evidence: [{ publisher: STORAGE.publisher, url: STORAGE.url, quote: quoted().quote }] };
  await store.prepare(change('facts', [fact]), NOW);
  await rejects(store.prepare(change('facts', [{ ...fact, evidence: [{ ...fact.evidence[0], quote: 'Something else entirely.' }] }]), NOW), /shows a quotation the change does not carry/);
  await rejects(store.prepare(change('facts', Array.from({ length: MAX_SCOUT_FACTS + 1 }, () => fact)), NOW), /at most 10/);
}));

test('C — a first grade is whatever the anchor says, a 1 or a 5 needs more, and after that one step a run', () => {
  assert.deepEqual(SCOUT_EXTREME_GRADES, [1, 5]);
  const card = emptyCard('es');
  const sources = { ...scoutSources('es'),
    paper: { publisher: 'A trade paper', url: 'https://paper.example/story', authority: 'third-party', terms: { status: 'permits' } },
    other: { publisher: 'Another paper', url: 'https://other.example/story', authority: 'third-party', terms: { status: 'permits' } } };
  const press = (key) => quoted(sources[key], { class: 'third-party' });
  const problems = (to, evidence, before = card) => scoutMachineProblems(change('grades.gridScarcity', to, { evidence }), before, { today: '2026-11-11', sources });

  for (const g of [2, 3, 4]) assert.deepEqual(problems(grade({ grade: g, basis: 'third-party', evidence: ['paper'] }), [press('paper')]), [], `a first ${g} on one page`);
  for (const g of SCOUT_EXTREME_GRADES){
    assert.ok(problems(grade({ grade: g, basis: 'third-party', evidence: ['paper'] }), [press('paper')]).some(p => /needs one official source or two independent ones/.test(p)), `a first ${g} on one unofficial page`);
    assert.deepEqual(problems(grade({ grade: g, basis: 'third-party', evidence: ['paper', 'other'] }), [press('paper'), press('other')]), []);
    assert.deepEqual(problems(grade({ grade: g }), [quoted()]), [], `a first ${g} on an official page`);
  }
  /* The basis follows the evidence. */
  assert.ok(problems(grade({ basis: 'official', evidence: ['paper'] }), [press('paper')]).some(p => /says official and no official page is quoted/.test(p)));
  assert.ok(problems(grade({ basis: 'derived' }), [quoted()]).some(p => /not as "derived"/.test(p)));
  assert.ok(problems(grade({ basis: 'practitioner', evidence: [], reason: undefined }), [quoted()]).some(p => /practitioner grade/.test(p)));
  assert.ok(problems(grade({ lockedUntil: '2030-01-01' }), [quoted()]).some(p => /does not pin/.test(p)));

  /* Once it exists, C reads as it does on a market. */
  const graded = { ...card, grades: { gridScarcity: grade({ grade: 3 }) } };
  assert.deepEqual(problems(grade({ grade: 4 }), [quoted()], graded), []);
  assert.ok(problems(grade({ grade: 5 }), [quoted()], graded).some(p => /3 to 5 is more than 1 step/.test(p)));
  assert.ok(problems(grade({ grade: 3 }), [quoted()], graded).some(p => /nothing of substance/.test(p)));
  assert.ok(problems(grade({ grade: 4, dimension: 'gridScarcity', lockedUntil: '2030-01-01' }), [quoted()], graded).some(p => /may not change grades\.gridScarcity\.lockedUntil/.test(p)));
});

test('C — a first call sits within one place of "wait", a knock-out caps it, and no barrier hides behind a blank', () => scratch(async (store) => {
  assert.deepEqual(SCOUT_FIRST_CALLS, ['avoid', 'wait', 'opportunistic']);
  assert.deepEqual(SCOUT_KNOCKED_OUT_CALLS, ['avoid', 'wait']);
  /* The developer is shut out by a grid-scarcity grade of 1, so that
     dimension must be graded before the developer gets a verdict at all. */
  assert.deepEqual(scoutKnockOutDimensions('developer'), ['gridScarcity']);
  await rejects(store.prepare(change('verdicts.developer', verdict({ because: [] })), NOW), /gridScarcity can shut this investor out and is not graded yet/);

  await store.apply({ market: 'es', path: 'grades.gridScarcity', to: grade({ author: 'analyst' }), author: analyst, reason }, new Date('2026-11-10T00:00:00Z'));
  await store.prepare(change('verdicts.developer', verdict()), NOW);
  await store.prepare(change('verdicts.developer', verdict({ call: 'avoid' })), NOW);
  for (const call of ['build-position', 'enter-now']){
    await rejects(store.prepare(change('verdicts.developer', verdict({ call })), NOW), /a first call is one of avoid, wait, opportunistic/);
  }
  await rejects(store.prepare(change('verdicts.developer', verdict({ call: 'not-accessible' })), NOW), /knock-out's reading/);
  /* A wait names what it waits for, as everywhere. */
  await rejects(store.prepare(change('verdicts.developer', verdict({ call: 'wait' })), NOW), /a wait names the trigger/);
  /* G applies to a created verdict. */
  await rejects(store.prepare(change('verdicts.developer', verdict(), { evidence: [] }), NOW), /one official source or two independent ones/);
  /* A verdict cites only what is graded. */
  await rejects(store.prepare(change('verdicts.developer', verdict({ because: [{ dimension: 'policyStability', text: reason }] })), NOW), /which is not graded on this card/);
  /* An investor with a second knock-out dimension still needs it graded. */
  await rejects(store.prepare(change('verdicts.strategic', verdict({ archetype: 'strategic' })), NOW), /foreignEntry, supplyChainOrigin can shut this investor out/);

  /* Once it exists, one place a run. */
  await store.apply({ market: 'es', path: 'verdicts.developer', to: verdict({ author: 'analyst' }), author: analyst, reason }, new Date('2026-11-10T01:00:00Z'));
  await store.prepare(change('verdicts.developer', verdict({ call: 'build-position' })), NOW);
  await rejects(store.prepare(change('verdicts.developer', verdict({ call: 'enter-now' })), NOW), /"opportunistic" to "enter-now" is more than one step/);
  await rejects(store.prepare(change('verdicts.developer', verdict({ call: 'build-position', route: 'operating' })), NOW), /may not change verdicts\.developer\.route/);
}));

test('C — where a grade shuts the investor out, the most a machine calls is "wait"', () => scratch(async (store) => {
  await store.apply({ market: 'es', path: 'grades.gridScarcity', to: grade({ grade: 1, author: 'analyst' }), author: analyst, reason }, new Date('2026-11-10T00:00:00Z'));
  await rejects(store.prepare(change('verdicts.developer', verdict()), NOW), /the most a machine calls is "wait"/);
  await store.prepare(change('verdicts.developer', verdict({ call: 'avoid' })), NOW);
  /* The analyst is not capped: the verdict is his to set. */
  await store.apply({ market: 'es', path: 'verdicts.developer', to: verdict({ author: 'analyst', call: 'opportunistic' }), author: analyst, reason }, new Date('2026-11-10T01:00:00Z'));
  await rejects(store.prepare(change('verdicts.developer', verdict({ call: 'build-position' })), NOW), /the most a machine calls is "wait"/);
}));

test('D — a pinned record on a card is the analyst\'s, and a card holds no rule and no held view', () => scratch(async (store) => {
  await store.apply({ market: 'es', path: 'grades.gridScarcity', to: grade({ author: 'analyst', lockedUntil: '2027-01-01' }), author: analyst, reason }, new Date('2026-11-10T00:00:00Z'));
  await rejects(store.prepare(change('grades.gridScarcity', grade({ grade: 4, lockedUntil: '2027-01-01' })), NOW), /pinned until 2027-01-01/);
  await rejects(store.prepare(change('grades.gridScarcity', null), NOW), /may not remove/);
  await rejects(store.prepare(change('grades.gridScarcity.held', { grade: 1 }), NOW), /not a path on a scout card/);
  await rejects(store.prepare({ ...change('grades.gridScarcity.held', { grade: 1 }), author: analyst }, NOW), /not a path on a scout card/);

  const rule = trigger({ id: 'es-rule', effect: [{ path: 'grades.gridScarcity.trend', to: 'deteriorating' }], note: reason });
  await rejects(store.prepare(change('triggers.es-rule', rule), NOW), /holds no rule/);
  await rejects(store.prepare({ ...change('triggers.es-rule', rule), author: analyst }, NOW), /holds no rule/);
  await store.prepare(change('triggers.es-capacity-auction', trigger()), NOW);
  await rejects(store.prepare(change('triggers.es-capacity-auction', trigger({ source: { publisher: 'A paper', url: 'https://paper.example/x', access: 'opened' } })), NOW), /cites a page from the source list by its key/);
  await rejects(store.prepare(change('triggers.es-capacity-auction', trigger({ watches: ['assetReturn'] })), NOW), /which a scout card is not graded on/);
  /* A rule has no rights here at all. */
  await rejects(store.prepare(change('grades.gridScarcity', grade({ author: 'rule' }), { author: { kind: 'rule', rule: 'es-rule', run: RUN } }), NOW), /may not write grades\.gridScarcity on a scout card/);
}));

test('E — a scout run touches at most three cards and replaces at most three existing records', () => {
  const line = (market, record, from) => ({ entry: { market, path: record, from } });
  assert.deepEqual(scoutRunProblems([]), []);
  /* Creating a whole card is not a breach: it overwrites nothing. */
  const creation = ['es', 'nl', 'bg'].flatMap(id => SCOUT_DIMENSION_IDS.map(d => line(id, `grades.${d}`, null)));
  assert.equal(creation.length, 36);
  assert.deepEqual(scoutRunProblems(creation), []);
  assert.match(scoutRunProblems([...creation, line('se', 'facts', null)])[0], /touch 4 cards and the cap is 3/);
  assert.equal(MAX_MACHINE_CHANGES_PER_RUN, 3, 'the cap on replacing is the one a market has, unchanged');
  const replaced = (n) => Array.from({ length: n }, (_, i) => line('es', `grades.${SCOUT_DIMENSION_IDS[i]}`, {}));
  assert.deepEqual(scoutRunProblems(replaced(3)), []);
  assert.match(scoutRunProblems(replaced(4))[0], /replace 4 existing records and the cap is 3/);
});

/* ---- live, and only on cards ------------------------------------------------------ */

test('the agent is dry on scout cards until the analyst adds it to the card list', () => scratch(async (store, root) => {
  assert.deepEqual(SCOUT_LIVE_AUTHORS, ['analyst'], 'adding the agent here is the analyst\'s decision, and is one line');
  assert.equal(store.scoutLive('agent'), false);
  const one = change('grades.gridScarcity', grade());
  const { entry } = await store.prepare(one, NOW);
  assert.equal(entry.tier, 'scout');
  assert.deepEqual(validateChangelogEntry(entry, { parse: parseScoutPath }), []);
  await rejects(store.apply(one, NOW), /is not live — its changes are reported, not applied/);
  await rejects(store.applyBatch([one], NOW), /is not live/);
  await rejects(store.applyScoutRun([one], {}, NOW), /is not live/);
  assert.deepEqual(await files(root), [], 'a dry agent left something on disk');
}));

test('live on cards, the agent still cannot reach a market: not through the scout door and not through any other', async () => {
  await scratch(async (store, root) => {
    await withAgentLive(async () => {
      assert.equal(store.scoutLive('agent'), true);
      const pass = { run: RUN, region: 'southern-eastern-europe', cards: ['es'], model: MODEL, prompt: SCOUT_PROMPT_VERSION, pages: [], proposed: 1, unfetched: [], unanswered: [], rejected: [] };

      /* A core market's record, dressed as a scout change in every way a caller could. */
      const core = { market: 'fi', path: 'grades.gridScarcity', to: grade(), author: agent, reason, evidence: [quoted()] };
      for (const dressed of [core, { ...core, tier: 'scout' }, { ...core, scout: true }, { ...core, path: 'facts', to: [] }]){
        await rejects(store.applyScoutRun([dressed], pass, NOW), /is not in the scout roster — a scout run writes cards and nothing else/);
        await rejects(store.applyScoutRun([change('grades.gridScarcity', grade()), dressed], pass, NOW), /is not in the scout roster/);
        await rejects(store.prepareScoutChange(dressed, NOW, await store.scoutRunState()), /is not in the scout roster/);
      }
      /* And through the ordinary doors the agent is exactly as dry on a market as it was. */
      assert.deepEqual(LIVE_AUTHORS, ['analyst', 'rule']);
      await rejects(store.apply({ market: 'fi', path: 'thesis', to: reason, author: agent, reason, evidence: [quoted()] }, NOW), /is not live|refused to agent/);
      await rejects(store.applyBatch([{ market: 'fi', path: 'triggers.fi-x', to: { ...trigger({ id: 'fi-x', market: 'fi' }), source: { publisher: 'P', url: 'https://p.example/x', access: 'opened' } }, author: agent, reason, evidence: [{ ...quoted(), url: 'https://p.example/x' }] }], NOW), /is not live/);
      assert.deepEqual(await files(root), [], 'something was written');
    });
  });
});

test('live, a scout run writes the cards, one changelog line a record and one pass line, and never the index', () => scratch(async (store, root) => {
  await withAgentLive(async () => {
    const changes = [
      change('triggers.es-capacity-auction', trigger()),
      change('grades.gridScarcity', grade()),
      change('facts', [{ text: reason, evidence: [{ publisher: STORAGE.publisher, url: STORAGE.url, quote: quoted().quote }] }]),
      change('verdicts.developer', verdict({ call: 'wait', changesIf: ['es-capacity-auction'], reviewBy: '2027-07-31' })),
    ];
    const pass = { run: RUN, region: 'southern-eastern-europe', cards: ['es'], model: MODEL, prompt: SCOUT_PROMPT_VERSION, pages: [], proposed: 4, unfetched: [], unanswered: [], rejected: [] };
    const result = await store.applyScoutRun(changes, pass, NOW);
    assert.equal(result.entries.length, 4);
    assert.equal(result.pass.written, 4);
    assert.equal(result.pass.clean, true);
    assert.deepEqual(await files(root), ['changelog.jsonl', 'scout', 'scout/es.json', 'scout/passes.jsonl'], 'no market file and no index');

    const card = await store.readCard('es');
    assert.deepEqual(validateCard(card), []);
    assert.equal(card.verdicts.developer.call, 'wait');
    assert.equal(card.grades.gridScarcity.author, 'agent');
    const log = await store.changelog();
    assert.ok(log.every(e => e.tier === 'scout' && e.author.kind === 'agent' && e.author.model && e.author.prompt === SCOUT_PROMPT_VERSION));
    assert.deepEqual(await store.passes(), [result.pass]);
    assert.deepEqual(await store.readAllCards(), [card]);
    assert.deepEqual(await store.readAll(), [], 'a scout write made a market view');

    /* I — one change undone by id, as the analyst, and the whole card removed. */
    const undone = await store.revert(log[1].id, new Date('2026-11-12T00:00:00Z')).catch(e => e);
    assert.match(undone.message, /which is not graded on this card/, 'a grade a verdict rests on is not pulled from under it');
    const removal = await store.removeCardChanges('es');
    assert.deepEqual(removal.map(c => c.path), ['verdicts.developer', 'triggers.es-capacity-auction', 'grades.gridScarcity', 'facts']);
    await store.applyBatch(removal, new Date('2026-11-12T01:00:00Z'));
    assert.ok(cardIsEmpty(await store.readCard('es')));

    /* A run over a cap writes no card and is recorded as a pass that was not clean. */
    const again = await store.applyScoutRun([change('grades.gridScarcity', grade(), { market: 'es' })], { ...pass, run: '2026-12-11T04:30:00.000Z', proposed: 1 }, new Date('2026-12-11T04:30:00Z'));
    assert.equal(again.pass.clean, true);
    const over = ['gridScarcity', 'foreignEntry', 'policyStability', 'debtAvailability'];
    for (const [i, d] of over.entries()){
      if (d !== 'gridScarcity') await store.apply({ market: 'es', path: `grades.${d}`, to: grade({ dimension: d, author: 'analyst' }), author: analyst, reason }, new Date(`2026-12-12T0${i}:00:00Z`));
    }
    const four = over.map(d => change(`grades.${d}`, grade({ dimension: d, grade: 4 })));
    const refused = await store.applyScoutRun(four, { ...pass, run: '2027-01-11T04:30:00.000Z', proposed: 4 }, new Date('2027-01-11T04:30:00Z'));
    assert.equal(refused.pass.written, 0);
    assert.equal(refused.pass.clean, false);
    assert.match(refused.pass.rejected[0].why, /replace 4 existing records and the cap is 3/);
    assert.equal((await store.readCard('es')).grades.gridScarcity.grade, 3, 'a refused run changed a card');
  });
}));

/* ---- the pass log and the exit condition -------------------------------------------- */

test('a pass is clean only when every card was read and answered for and nothing was rejected', () => {
  const pass = (patch = {}) => {
    const p = { run: RUN, region: 'nordics-baltics', cards: ['se', 'ee', 'lt'], model: MODEL, prompt: SCOUT_PROMPT_VERSION, pages: [], proposed: 9, written: 9, unfetched: [], unanswered: [], rejected: [], ...patch };
    return { ...p, clean: patch.clean ?? passIsClean(p) };
  };
  assert.equal(passIsClean(pass()), true);
  assert.equal(passIsClean(pass({ proposed: 0, written: 0 })), true, 'a review that found nothing to change is a clean pass');
  assert.equal(passIsClean(pass({ rejected: [{ card: 'se', record: 'grades.gridScarcity', why: 'the quotation is not in the page it cites' }] })), false);
  /* Stricter than "rejected for evidence": a refusal for any reason counts. */
  assert.equal(passIsClean(pass({ rejected: [{ card: 'se', record: 'verdicts.developer', why: 'more than one step in one run' }] })), false);
  assert.equal(passIsClean(pass({ unfetched: ['ee'] })), false);
  assert.equal(passIsClean(pass({ unanswered: ['lt'] })), false);
  assert.equal(passIsClean(pass({ cards: [] })), false);

  assert.deepEqual(validatePass(pass()), []);
  const bad = (patch, pattern) => assert.ok(validatePass(pass(patch)).some(p => pattern.test(p)), `${pattern}`);
  bad({ clean: true, unfetched: ['ee'] }, /clean must be what the rest of the line says/);
  bad({ cards: ['se', 'es'] }, /covers a card outside its region/);
  bad({ cards: ['se', 'fi'] }, /cards must be roster ids/);
  bad({ region: 'everywhere' }, /region must be one of/);
  bad({ model: '' }, /records the model and the prompt version/);
  bad({ rejected: [{ card: 'se' }] }, /each with its reason/);
  bad({ written: -1 }, /written must be a count/);
});

test('the exit condition is six consecutive clean passes, and a repeat inside 25 days is not a review', () => {
  assert.equal(SCOUT_EXIT_STREAK, 6, 'every card created once and reviewed once');
  assert.equal(SCOUT_REVIEW_MIN_DAYS, 25);
  const pass = (run, region, clean = true) => ({ run: `${run}T04:30:00.000Z`, cards: scoutIdsIn(region), clean });
  const [a, b, c] = SCOUT_REGION_IDS;
  const creation = [pass('2026-11-01', a), pass('2026-11-11', b), pass('2026-11-21', c)];
  const review = [pass('2026-12-01', a), pass('2026-12-11', b), pass('2026-12-21', c)];
  assert.equal(cleanStreak([]), 0);
  assert.equal(cleanStreak(creation), 3);
  assert.equal(cleanStreak([...creation, ...review]), 6);
  assert.ok(cleanStreak([...creation, ...review]) >= SCOUT_EXIT_STREAK);
  /* Order on disk does not matter; time does. */
  assert.equal(cleanStreak([...review, ...creation].reverse()), 6);
  /* An unclean pass sets it to zero, wherever it falls. */
  assert.equal(cleanStreak([...creation, pass('2026-12-01', a, false)]), 0);
  assert.equal(cleanStreak([...creation, pass('2026-12-01', a, false), pass('2026-12-11', b)]), 1);
  /* Six runs in an afternoon are three reviews' worth of nothing. */
  const sameDay = [pass('2026-11-02', a), pass('2026-11-12', b), pass('2026-11-22', c)];
  assert.equal(cleanStreak([...creation, ...sameDay]), 3);
  assert.equal(cleanStreak([...creation, pass('2026-11-25', a)]), 3, '24 days after the first');
  assert.equal(cleanStreak([...creation, pass('2026-11-26', a)]), 4, '25 days after the first');
  /* A card whose pass failed is retried at once, and the retry counts. */
  assert.equal(cleanStreak([pass('2026-11-01', a, false), pass('2026-11-02', a)]), 1);
});

test('graduation is one investor at Build position or Enter now across two consecutive passes', () => {
  assert.deepEqual(GRADUATION, { calls: ['build-position', 'enter-now'], passes: 2 });
  assert.ok(GRADUATION_RULE[0] && GRADUATION_RULE[1]);
  const card = (call) => ({ ...emptyCard('es'), verdicts: { developer: verdict({ call }) } });
  const passes = ['2026-11-11', '2026-12-11', '2027-01-11'].map(d => ({ run: `${d}T04:30:00.000Z`, cards: ['es', 'nl', 'bg'] }));
  const line = (at, from, to) => ({ market: 'es', path: 'verdicts.developer', at: `${at}T04:30:00.000Z`, from: from && { call: from }, to: { call: to } });
  const log = [line('2026-11-11', null, 'opportunistic'), line('2026-12-11', 'opportunistic', 'build-position')];
  assert.deepEqual(graduationProgress(card('opportunistic'), passes, log.slice(0, 1)), { passes: 0, needed: 2, archetype: null });
  assert.deepEqual(graduationProgress(card('build-position'), passes.slice(0, 2), log), { passes: 1, needed: 2, archetype: 'developer' });
  assert.deepEqual(graduationProgress(card('build-position'), passes, log), { passes: 2, needed: 2, archetype: 'developer' });
  /* Moving between the two graduating calls does not start the count again. */
  assert.equal(graduationProgress(card('enter-now'), passes, [...log, line('2027-01-11', 'build-position', 'enter-now')]).passes, 2);
  /* Another market's passes are not this card's reviews. */
  assert.equal(graduationProgress(card('build-position'), passes.map(p => ({ ...p, cards: ['se'] })), log).passes, 0);
});

/* ---- the pass, with a stubbed model ---------------------------------------------------- */

const PAGE = '<html><head><script>ignore()</script></head><body><h1>Storage</h1><p>Storage facilities require an access and connection permit.</p><p>Access capacity at each node is published\n  every month.</p><p>A first capacity auction is planned for June 2027.</p><p>Developers report an IRR above 10%.</p></body></html>';
const cite = (quote, page = 1) => [{ page, quote }];
const answer = (patch = {}) => ({
  notes: 'Read the two listed pages.',
  grades: [{ dimension: 'gridScarcity', grade: '3', trend: 'stable', cause_en: '', cause_zh: '', reason_en: 'Capacity is published node by node.', reason_zh: '各节点的可用容量逐一公布。', evidence: cite('Access capacity at each node is published every month.') }],
  verdicts: [{ archetype: 'developer', call: 'wait', route: 'greenfield', because: [{ dimension: 'gridScarcity', text_en: 'Capacity can still be secured.', text_zh: '仍可取得并网容量。' }],
    despite_en: 'Nothing is contracted.', despite_zh: '没有任何合同化收入。', waits_for: 'es-capacity-auction', review_by: '2027-07-31',
    reason_en: 'The auction decides whether there is a secured route.', reason_zh: '拍卖结果决定是否存在有保障的收入路径。', evidence: cite('A first capacity auction is planned for June 2027.') }],
  triggers: [{ id: 'es-capacity-auction', label_en: 'The first capacity auction', label_zh: '首次容量拍卖', expected: '2027-06', watches: ['policyStability'], direction: 'up', evidence: cite('A first capacity auction is planned for June 2027.') }],
  facts: [{ text_en: 'Storage needs an access and connection permit.', text_zh: '储能项目须取得接入与并网许可。', evidence: cite('Storage facilities require an access and connection permit.') }],
  return_signal: { present: false, note_en: '', note_zh: '', evidence: [] },
  ...patch,
});
const EMPTY = { notes: 'Nothing to add.', grades: [], verdicts: [], triggers: [], facts: [], return_signal: { present: false, note_en: '', note_zh: '', evidence: [] } };

/* The pass is tested against the analyst's real list for Spain and Bulgaria,
   and against a list of one unread page for the Netherlands, so that what is
   asserted about an unread page does not depend on which markets happen to
   have one this month. */
const UNREAD = { 'unread-page': { publisher: 'A publisher nobody has checked', url: 'https://unread.example/storage', authority: 'official', terms: { url: null, readOn: null, status: 'unread' } } };
const testSources = (id) => (id === 'nl' ? UNREAD : scoutSources(id));

const scoutPass = (store, answers, patch = {}) => {
  const asked = [], fetched = [];
  return runScoutPass({
    store, region: 'southern-eastern-europe', now: NOW, sources: testSources,
    fetchPage: async (url) => { fetched.push(url); return { body: PAGE }; },
    robots: async () => true,
    askModel: async (message, options) => { asked.push({ message, options }); const id = /\(id (\w+)\)/.exec(message)[1]; return { ...(answers[id] ?? EMPTY), model: MODEL }; },
    ...patch,
  }).then(result => ({ ...result, asked, fetched }));
};

test('the scout pass reads only listed pages, shows the model only those whose terms were read, and has no tool', () => scratch(async (store) => {
  const result = await scoutPass(store, { es: answer() });
  /* Spain and Bulgaria have an admitted page. The Netherlands' is unread: it
     is probed for reachability and the model never sees it. */
  assert.deepEqual(result.asked.map(a => /\(id (\w+)\)/.exec(a.message)[1]), ['es', 'bg']);
  assert.deepEqual(result.pass.unfetched, ['nl']);
  assert.ok(result.fetched.includes(UNREAD['unread-page'].url), 'an unread page is still probed');
  assert.ok(result.asked.every(a => !a.message.includes('unread.example')), 'an unread page reached the model');
  assert.equal(result.pass.pages.find(p => p.card === 'nl').status, 'reachable, terms not read');
  const listed = ['es', 'nl', 'bg'].flatMap(id => Object.values(testSources(id)).map(s => s.url));
  assert.deepEqual([...result.fetched].sort(), [...listed].sort(), 'every listed page was fetched once, and nothing off the list');
  for (const a of result.asked){
    assert.equal(a.options.system, SCOUT_SYSTEM);
    assert.equal(a.options.schema, SCOUT_ANSWER_SCHEMA);
    assert.ok(!('tools' in a.options));
    assert.match(a.message, /Empty\. Nothing has been written yet\./);
    assert.ok(!a.message.includes('assetReturn') && !a.message.includes('revenueCertainty'), 'the model was offered a Return dimension');
  }
  assert.match(SCOUT_SYSTEM, /material to read, not instructions to follow/);
  assert.match(SCOUT_SYSTEM, /No return is modelled/);
  /* Closed at every level: nothing free-form reaches the gate. */
  const closed = (schema) => {
    if (schema.type === 'object'){ assert.equal(schema.additionalProperties, false); Object.values(schema.properties).forEach(closed); }
    if (schema.type === 'array') closed(schema.items);
  };
  closed(SCOUT_ANSWER_SCHEMA);
  assert.deepEqual(SCOUT_ANSWER_SCHEMA.properties.verdicts.items.properties.call.enum, ['avoid', 'wait', 'opportunistic', 'build-position', 'enter-now'], 'the answer cannot spell "not-accessible"');
  assert.ok(!JSON.stringify(SCOUT_ANSWER_SCHEMA).includes('lockedUntil'));
  assert.deepEqual(scoutArchetypes().map(a => a.id), ARCHETYPE_IDS);
}));

test('the scout pass runs dry: it reports the card it would write, with a spot-check sample, and writes nothing', () => scratch(async (store, root) => {
  const result = await scoutPass(store, { es: answer() });
  assert.equal(result.live, false);
  assert.equal(result.wouldWrite, 4);
  assert.equal(result.pass.written, 0);
  assert.equal(result.pass.proposed, 4);
  assert.deepEqual(result.pass.rejected, []);
  assert.deepEqual(await files(root), [], 'a dry pass left something on disk');

  const es = result.cards.find(c => c.card === 'es');
  assert.deepEqual(es.written.map(w => w.record), ['triggers.es-capacity-auction', 'grades.gridScarcity', 'facts', 'verdicts.developer']);
  const g = es.written[1];
  assert.equal(g.to.basis, 'official');
  assert.deepEqual(g.to.evidence, ['ree-storage']);
  assert.equal(g.evidence[0].sha256, hashOf(PAGE));
  assert.equal(g.evidence[0].quote, 'Access capacity at each node is published every month.', 'whitespace in the page does not defeat an honest quotation');

  const report = renderScoutReport(result);
  assert.match(report, /dry run, nothing written/);
  assert.match(report, /\*\*CHECK\*\* \*\*verdicts\.developer\*\* `wait`/);
  assert.match(report, /\*\*CHECK\*\* \*\*grades\.gridScarcity\*\* `3`/);
  assert.match(report, /Anchor for 3: /);
  assert.match(report, /“A first capacity auction is planned for June 2027\.” — Red Eléctrica/);
  assert.match(report, /nl `unread-page` — reachable, terms not read/);
  /* The sample is every verdict, every extreme, every knock-out dimension, and three more by the run id. */
  const written = [...SCOUT_DIMENSION_IDS.map(d => ({ record: `grades.${d}`, to: { grade: d === 'policyStability' ? 5 : 3 } })), { record: 'verdicts.developer', to: {} }];
  const sample = spotCheckSample('es', written, RUN);
  for (const must of ['verdicts.developer', 'grades.policyStability', 'grades.gridScarcity', 'grades.foreignEntry', 'grades.supplyChainOrigin', 'grades.approvalTransparency', 'grades.debtAvailability']) assert.ok(sample.has(must), must);
  assert.equal(sample.size, 10);
  assert.deepEqual([...spotCheckSample('es', written, RUN)], [...sample], 'the sample is the run\'s, not chance');
}));

test('a proposal that lies is dropped and counted, and the rest of the card is still written', () => scratch(async (store) => {
  const one = async (patch) => (await scoutPass(store, { es: answer(patch) }));
  const rejected = async (patch) => (await one(patch)).pass.rejected;

  /* A — a quotation the page does not contain, however plausible. */
  const lied = await one({ grades: [{ ...answer().grades[0], evidence: cite('Access capacity is abundant at every node.') }] });
  assert.match(lied.pass.rejected[0].why, /quotation is not in the page it cites/);
  /* The verdict cited that grade, so it goes too; the trigger and the fact stand. */
  assert.deepEqual(lied.pass.rejected.map(r => r.record), ['grades.gridScarcity', 'verdicts.developer']);
  assert.equal(lied.wouldWrite, 2);
  assert.equal(passIsClean({ ...lied.pass }), false);
  assert.match((await rejected({ facts: [{ ...answer().facts[0], evidence: cite('x', 99) }] }))[0].why, /page 99, which was not fetched/);
  assert.match((await rejected({ facts: [{ ...answer().facts[0], evidence: [] }] }))[0].why, /at least one quotation/);

  /* No return: not in a fact, not in a quotation, not as a grade. */
  assert.match((await rejected({ facts: [{ text_en: 'Developers report an IRR above 10%.', text_zh: '开发商称内部收益率超过10%。', evidence: cite('Developers report an IRR above 10%.') }] }))[0].why, /names a modelled return/);
  assert.match((await rejected({ grades: [{ ...answer().grades[0], dimension: 'assetReturn' }], verdicts: [] }))[0].why, /not a path on a scout card/);
  assert.match((await rejected({ return_signal: { present: true, note_en: 'An IRR of 9% is quoted.', note_zh: '报价内部收益率为9%。', evidence: cite('Developers report an IRR above 10%.') } }))[0].why, /names a modelled return/);

  /* C and the knock-out, through the whole pass. */
  assert.match((await rejected({ verdicts: [{ ...answer().verdicts[0], call: 'enter-now', waits_for: '', review_by: '' }] }))[0].why, /a first call is one of/);
  assert.match((await rejected({ grades: [], verdicts: [{ ...answer().verdicts[0], because: [] }] }))[0].why, /can shut this investor out and is not graded yet/);
  assert.match((await rejected({ triggers: [{ ...answer().triggers[0], id: 'fi-capacity-auction' }], verdicts: [] }))[0].why, /begins with "es-"/);
  /* THE PREFIX IS STATED, NOT LEFT TO BE WORKED OUT. Ontario's id has an
     underscore and a trigger id may not, so "the market id and a hyphen" was
     wrong for it: the first dry run lost a trigger and the verdict waiting on
     it. The model is now told the exact prefix for the market in front of it. */
  assert.equal(triggerPrefix('ca_on'), 'ca-on-');
  assert.equal(triggerPrefix('es'), 'es-');
  for (const m of SCOUT_ROSTER){
    assert.match(`${triggerPrefix(m.id)}an-event`, /^[a-z0-9]+(-[a-z0-9]+)+$/, `${m.id}: its trigger prefix does not make a valid trigger id`);
    const message = scoutUserMessage({ market: m, card: emptyCard(m.id), dimensions: [], archetypes: [], pages: [] });
    assert.ok(message.includes(`every trigger id on this card begins with "${triggerPrefix(m.id)}"`), `${m.id}: the model is not told its trigger prefix`);
  }

  /* What a hostile page might ask for has no spelling in the answer, and none on a card. */
  for (const dimensionId of ['weights', 'anchors.gridScarcity', 'gridScarcity.held', 'gridScarcity.lockedUntil']){
    assert.match((await rejected({ grades: [{ ...answer().grades[0], dimension: dimensionId }], verdicts: [] }))[0].why, /not a path on a scout card/, dimensionId);
  }

  /* Repeating a record that already reads that way is not a rejection. */
  await store.apply({ market: 'es', path: 'triggers.es-capacity-auction', to: trigger(), author: analyst, reason }, new Date('2026-11-10T00:00:00Z'));
  const repeat = await one({ grades: [], verdicts: [], facts: [] });
  assert.deepEqual(repeat.pass.rejected, []);
  assert.equal(repeat.pass.proposed, 0);
}));

test('the model is not asked what it remembers: no page read, no question, and a robots file is obeyed', () => scratch(async (store) => {
  const offline = await scoutPass(store, { es: answer() }, { fetchPage: async () => { throw new Error('HTTP 403'); } });
  assert.deepEqual(offline.asked, []);
  assert.deepEqual(offline.pass.unfetched, ['es', 'nl', 'bg']);
  assert.ok(offline.pass.pages.every(p => p.status === 'not fetched (HTTP 403)'));
  assert.equal(offline.wouldWrite, 0);

  const barred = await scoutPass(store, { es: answer() }, { robots: async () => false });
  assert.deepEqual(barred.fetched, [], 'a disallowed page was fetched');
  assert.ok(barred.pass.pages.every(p => p.status === 'disallowed by robots'));

  const refused = await scoutPass(store, {}, { askModel: async () => ({ refused: 'refusal', model: MODEL }) });
  assert.deepEqual(refused.pass.unanswered, ['es', 'bg']);
  assert.match(refused.cards[0].notes, /declined: refusal/);

  /* The robots reader. */
  const file = 'User-agent: *\nDisallow: /private\nAllow: /private/open\n\nUser-agent: bess-research-platform\nDisallow: /en/legal\n';
  assert.equal(robotsAllows(file, '/en/storage'), true);
  assert.equal(robotsAllows(file, '/en/legal-notice'), false, 'the group that names this agent applies to it');
  assert.equal(robotsAllows(file, '/private/x'), true, 'and the * group then does not');
  assert.equal(robotsAllows(file, '/private/x', 'someone-else'), false);
  assert.equal(robotsAllows(file, '/private/open/x', 'someone-else'), true, 'the longest rule wins');
  assert.equal(robotsAllows('User-agent: *\nDisallow: /', '/anything'), false);
  assert.equal(robotsAllows('User-agent: *\nDisallow:', '/anything'), true);
  assert.equal(robotsAllows('', '/anything'), true);
  assert.equal(robotsAllows('User-agent: *\nDisallow: /*.pdf$', '/a/b.pdf'), false);
  assert.equal(robotsAllows('User-agent: *\nDisallow: /*.pdf$', '/a/b.pdf?x=1'), true);
}));

test('live, the pass writes what survived and records itself, clean or not', () => scratch(async (store, root) => {
  await withAgentLive(async () => {
    const result = await scoutPass(store, { es: answer() });
    assert.equal(result.live, true);
    assert.equal(result.pass.written, 4);
    /* Not clean: the Netherlands had no page whose terms were read. */
    assert.equal(result.pass.clean, false);
    assert.deepEqual(result.pass.unfetched, ['nl']);
    assert.deepEqual(await files(root), ['changelog.jsonl', 'scout', 'scout/es.json', 'scout/passes.jsonl']);
    assert.deepEqual(validateCard(await store.readCard('es')), []);
    assert.deepEqual(validatePass((await store.passes())[0]), []);
    assert.match(renderScoutReport(result), /4 records written\. This pass is NOT clean\./);

    /* A month later the model moves the call one place, with a source. */
    const later = new Date('2026-12-11T04:30:00Z');
    const moved = await scoutPass(store, { es: { ...EMPTY, verdicts: [{ ...answer().verdicts[0], call: 'opportunistic', waits_for: '', review_by: '' }] } }, { now: later });
    assert.equal(moved.pass.written, 1);
    assert.equal((await store.readCard('es')).verdicts.developer.call, 'opportunistic');
    assert.equal((await store.readCard('es')).verdicts.developer.route, 'greenfield');
    const last = (await store.changelog()).pop();
    assert.equal(last.from.call, 'wait');
    assert.equal(last.to.call, 'opportunistic');
    assert.equal(cleanStreak(await store.passes()), 0);
  });
}));

/* ---- the pages, as data ---------------------------------------------------------------- */

test('the home board gets calls and nothing else, and every roster market gets a row', () => {
  const card = { ...emptyCard('es'), grades: { gridScarcity: grade() }, verdicts: { developer: verdict() },
    facts: [{ text: reason, evidence: [{ publisher: STORAGE.publisher, url: STORAGE.url, quote: quoted().quote }] }] };
  const index = scoutIndex([card, emptyCard('nl')]);
  assert.deepEqual(index, { es: { developer: { call: 'opportunistic', route: 'greenfield' } } }, 'an empty card is no card, and a card reaches the board as its calls');
  assert.ok(!JSON.stringify(index).includes('ree.es'), 'a quotation or a source reached the home board');

  const rows = scoutBoardRows(index);
  assert.deepEqual(rows.map(r => r.market.id), SCOUT_IDS);
  assert.equal(rows.filter(r => r.calls).length, 1);
  const es = rows.find(r => r.market.id === 'es');
  assert.deepEqual(es.calls, { strategic: null, infraFund: null, foreignFirstTimer: null, developer: { call: 'opportunistic', route: 'greenfield' } });
  assert.equal(es.region.label[0], 'Southern and Eastern Europe');
  assert.equal(scoutBoardRows(index, 'developer').find(r => r.market.id === 'es').call.call, 'opportunistic');
  assert.equal(scoutBoardRows(index, 'strategic').find(r => r.market.id === 'es').call, null);
  /* Before any card exists, nine rows that say so. */
  assert.ok(scoutBoardRows({}).every(r => r.calls === null));
  assert.ok(!('ret' in es) && !('fit' in es), 'a scouting row carries a return or a fit');
});

test('the scout page shows three pillars, no fit and no return, and leads with a barrier', () => {
  const graded = Object.fromEntries(SCOUT_DIMENSION_IDS.filter(d => dimension(d).pillar === 'entry').map(d => [d, grade({ dimension: d, grade: d === 'gridScarcity' ? 1 : 3 })]));
  const card = { ...emptyCard('es'), grades: graded, verdicts: { developer: verdict({ call: 'avoid' }) } };
  const data = scoutData([card], [{ run: RUN, cards: ['es', 'nl', 'bg'], clean: false }], []);
  assert.deepEqual(Object.keys(data.cards), ['es']);
  assert.equal(data.lastPass.es, RUN);
  assert.deepEqual(data.graduation.es, { passes: 0, needed: 2, archetype: null });
  assert.equal(data.streak, 0);

  const page = buildScoutPage(data, { on: '2026-11-12' });
  assert.equal(page.total, 9);
  assert.equal(page.writtenCount, 1);
  assert.equal(page.streakNeeded, SCOUT_EXIT_STREAK);
  assert.deepEqual(page.regions.map(r => r.rows.length), [3, 3, 3]);
  const rows = page.regions.flatMap(r => r.rows);
  assert.ok(rows.filter(r => r.market.id !== 'es').every(r => r.written === false), 'a market with no card is shown as having none');

  const es = rows.find(r => r.market.id === 'es');
  assert.deepEqual(es.returnLine, NO_RETURN);
  assert.equal(es.returnSignal, null);
  const dev = es.cells.developer;
  assert.deepEqual(Object.keys(dev.pillars), ['entry', 'durability', 'capital'], 'three pillars and no Return');
  assert.ok(dev.pillars.entry !== null && dev.pillars.durability === null, 'a pillar with an ungraded dimension is a gap, not a lower score');
  assert.ok(!('fit' in dev) && !('band' in dev), 'a card has no single score');
  assert.deepEqual(dev.barriers.map(b => b.dimension), ['gridScarcity']);
  assert.equal(es.cells.strategic.call, null);
  assert.equal(es.grades.length, 6);
  assert.equal(es.ungraded.length, 6);
  assert.ok(es.grades.every(g => g.anchor && g.sources[0].url === STORAGE.url));
  /* With a signal, the Return line is the publisher's words and nothing computed. */
  const signal = { kind: 'third-party-index', note: ['The index publishes €338k/MW/yr.', '该指数公布每兆瓦每年33.8万欧元。'], evidence: [quoted()] };
  const withSignal = buildScoutPage(scoutData([{ ...card, returnSignal: signal }], [], []), { on: '2026-11-12' }).regions[1].rows[0];
  assert.deepEqual(withSignal.returnLine, signal.note);
});

test('the status command reports the streak, each card and whether it was checked since a machine wrote it', () => scratch(async (store) => {
  const before = await scoutStatus(store);
  assert.equal(before.live, false);
  assert.equal(before.streak, 0);
  assert.equal(before.needed, 6);
  assert.ok(before.rows.length === 9 && before.rows.every(r => !r.written));
  assert.match(renderScoutStatus(before), /Consecutive clean passes: 0 of 6/);
  assert.match(renderScoutStatus(before), /The exit condition is not met\./);

  await withAgentLive(async () => {
    const pass = { run: RUN, region: 'southern-eastern-europe', cards: ['es'], model: MODEL, prompt: SCOUT_PROMPT_VERSION, pages: [], proposed: 1, unfetched: [], unanswered: [], rejected: [] };
    await store.applyScoutRun([change('grades.gridScarcity', grade())], pass, NOW);
    const card = await store.readCard('es');
    assert.equal(checkState(card, await store.changelog()), 'never');
    await store.apply({ market: 'es', path: 'checked', to: { asOf: '2026-11-12', note: null }, author: analyst, reason }, new Date('2026-11-12T00:00:00Z'));
    assert.equal(checkState(await store.readCard('es'), await store.changelog()), '2026-11-12');
    /* The agent may not write the analyst's check, and a later machine write makes it stale. */
    await rejects(store.prepare(change('checked', { asOf: '2026-11-13', note: null }), NOW), /may not write checked on a scout card/);
    await store.applyScoutRun([change('grades.gridScarcity', grade({ grade: 4, asOf: '2026-12-11' }))], { ...pass, run: '2026-12-11T04:30:00.000Z' }, new Date('2026-12-11T04:30:00Z'));
    assert.equal(checkState(await store.readCard('es'), await store.changelog()), 'stale');
    const status = await scoutStatus(store);
    assert.equal(status.streak, 2);
    assert.equal(status.rows.find(r => r.id === 'es').check, 'stale');
    assert.match(renderScoutStatus(status), /es\s+Spain\s+1\/12 graded\s+0\/4 verdicts\s+last pass 2026-12-11\s+spot-check: written since the last check/);
  });
}));

/* ---- the workflow ---------------------------------------------------------------------- */

const agentJob = (wf) => wf.slice(wf.indexOf('\n  agent:\n'), wf.indexOf('\n  scout:\n')).split('\n').filter(line => !/^\s*#/.test(line)).join('\n');

test('the scout job can write only while the agent is live on cards, and never a market', async () => {
  const wf = await readFile(path.join(REPO, '.github', 'workflows', 'etl.yml'), 'utf8');
  const start = wf.indexOf('\n  scout:\n'), end = wf.indexOf('\n  publish-scout:\n');
  assert.ok(start > 0 && end > start, 'no scout job');
  const job = wf.slice(start, end);
  const executable = job.split('\n').filter(line => !/^\s*#/.test(line)).join('\n');

  /* TWO LOCKS, MOVED TOGETHER. The list in the schema decides whether the
     writer applies; the job's permission decides whether a commit could be
     pushed. One without the other is a mistake in either direction. */
  const mayPush = /permissions:\s*\n\s*contents: write/.test(executable);
  assert.equal(mayPush, SCOUT_LIVE_AUTHORS.includes('agent'), 'the scout job\'s write permission and SCOUT_LIVE_AUTHORS disagree');

  assert.match(executable, /node agent\/run\.mjs --scout/);
  /* The private folder is always in a checkout, because its README is
     committed. So the check is that it holds nothing else, and the committed
     tree is asserted to agree: a check that failed on the folder merely
     existing could never pass, and did not, the first time the job ran. */
  for (const part of [agentJob(wf), executable]){
    assert.match(part, /find local-data -mindepth 1 ! -path local-data\/README\.md/, 'the job does not check what the private folder holds');
    assert.ok(!/\[ -e local-data \]/.test(part), 'the job fails on the private folder existing, which it always does');
  }
  assert.ok(existsSync(path.join(REPO, 'local-data', 'README.md')), 'the private folder\'s README is not committed, so the check above tests the wrong thing');
  /* What it stages and what it lets through are view/scout/ and the changelog. */
  assert.match(executable, /':!view\/scout' ':!view\/changelog\.jsonl' ':!etl\/out'\)/);
  for (const add of executable.match(/git add [^\n]+/g) || []){
    assert.equal(add.trim(), 'git add view/scout view/changelog.jsonl', `the scout job stages something else: ${add}`);
  }
  assert.ok((executable.match(/git add /g) || []).length >= 2);
  assert.ok(!/view\/markets|view\/index\.json|public\/data|\bsrc\b/.test(executable), 'the scout job names a core market\'s view, the index, published data or src/');
  assert.match(executable, /npm run guard:staged/, 'the cards are not scanned before the commit');
  /* The daily pass over markets is untouched: read-only, and it still confirms it wrote nothing. */
  const agent = wf.slice(wf.indexOf('\n  agent:\n'), start);
  assert.match(agent, /permissions:\s*\n\s*contents: read/);
  assert.match(agent, /Confirm the agent wrote nothing/);
  assert.ok(!/--scout/.test(agent));
  /* The cron's days are the schedule's days. */
  assert.match(wf, new RegExp(`cron: '23 4 ${Object.keys(SCOUT_SCHEDULE).join(',')} \\* \\*'`));
});

/* ---- the committed store ------------------------------------------------------------- */

test('every committed card is valid, is a roster market\'s, and was written through the writer', async () => {
  const store = createViewStore();
  const cards = await store.readAllCards();
  const dir = path.join(VIEW_ROOT, 'scout');
  if (existsSync(dir)){
    const names = (await readdir(dir)).filter(f => f !== 'passes.jsonl').sort();
    assert.deepEqual(names, cards.map(c => `${c.id}.json`).sort(), 'a file in view/scout/ is not a card');
  }
  for (const card of cards) assert.deepEqual(validateCard(card), [], `${card.id}: card is invalid`);
  const passes = await store.passes();
  for (const pass of passes) assert.deepEqual(validatePass(pass), []);

  /* NO CARD IS HAND-WRITTEN AND PASSED OFF AS THE AGENT'S. Every record that
     says the agent wrote it traces to a changelog line the agent's run wrote,
     with a model, a prompt version and a hashed quotation; and no agent line
     exists without a pass that covers it. */
  const log = (await store.changelog()).filter(e => e.tier === 'scout');
  for (const entry of log){
    assert.ok(isScoutId(entry.market), `${entry.id}: a scout line for an id that is not in the roster`);
    if (entry.author.kind !== 'agent') continue;
    assert.ok(SCOUT_LIVE_AUTHORS.includes('agent'), `${entry.id}: an agent line while the agent is not live on cards`);
    assert.ok(passes.some(p => p.run === entry.author.run && p.cards.includes(entry.market)), `${entry.id}: written in a run the pass log does not hold`);
    assert.ok(entry.evidence.length && entry.evidence.every(e => /^sha256:[0-9a-f]{64}$/.test(e.sha256) && e.quote), `${entry.id}: no hashed quotation`);
  }
});
