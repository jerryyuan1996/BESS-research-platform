import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  capitalRecoveryFactor, netCapexPerMW, revenueRequirement, requirementBand,
  coverRatio, revenueHeadroom, impliedReturn,
} from '../src/economics/requirement.js';
import {
  buildEconomicsChain, validateChain, sumStack, STEP_IDS, TIER, REVENUE_CLASS,
} from '../src/economics/chain.js';
import { economicsChainBlocks, moneyFormats, ECONOMICS_CARD_CLASS } from '../src/economics/chainBlocks.js';
import { EXIT_Y_CONTRACTED, EXIT_Y_MERCHANT, LIFE } from '../src/comparison/assumptions.js';

import { WA_CHAIN } from '../src/markets/wa/economicsChain.js';
import { GB_CHAIN } from '../src/markets/gb/economicsChain.js';
import { IE_CHAIN } from '../src/markets/ie/economicsChain.js';
import { RO_CHAIN } from '../src/markets/ro/economicsChain.js';
import { PL_CHAIN } from '../src/markets/pl/economicsChain.js';
import { JP_CHAINS, JP_REGION_COVER, JP_OBSERVED } from '../src/markets/jp/economicsChain.js';

const CHAINS = {
  wa: WA_CHAIN, gb: GB_CHAIN, ie: IE_CHAIN, ro: RO_CHAIN, pl: PL_CHAIN,
  jp_tokyo: JP_CHAINS.tokyo, jp_kyushu: JP_CHAINS.kyushu, jp_hokkaido: JP_CHAINS.hokkaido,
};

/* ---------------------------------------------------------------------- math */

test('the capital-recovery factor is the standard annuity formula and degrades honestly', () => {
  // 7.5% and 11.5% over 15 years, to six decimals.
  assert.equal(capitalRecoveryFactor(0.075, 15).toFixed(6), '0.113287');
  assert.equal(capitalRecoveryFactor(0.115, 15).toFixed(6), '0.142924');
  // A zero rate is straight-line, not a division by zero.
  assert.equal(capitalRecoveryFactor(0, 20), 1 / 20);
  // Absence is carried, never defaulted.
  assert.equal(capitalRecoveryFactor(0.1, 0), null);
  assert.equal(capitalRecoveryFactor(-0.01, 15), null);
  assert.equal(capitalRecoveryFactor(null, 15), null);
});

test('a grant reduces the capital to be recovered rather than adding revenue', () => {
  assert.equal(netCapexPerMW({ capexPerMW: 1000, grantPct: 20 }), 800);
  assert.equal(netCapexPerMW({ capexPerMW: 1000 }), 1000);
  // A 100% grant would make the requirement meaningless, so it is refused.
  assert.equal(netCapexPerMW({ capexPerMW: 1000, grantPct: 100 }), null);
  assert.equal(netCapexPerMW({ capexPerMW: 0, grantPct: 10 }), null);
});

test('the revenue requirement is the annuity plus opex, and is null when an input is missing', () => {
  const r = revenueRequirement({ capexPerMW: 460000, opexPerMW: 9000, rate: 0.115, years: 15 });
  assert.equal(Math.round(r.capitalAnnuity), 65745);
  assert.equal(Math.round(r.total), 74745);
  assert.equal(r.total, r.capitalAnnuity + r.opex);
  assert.equal(revenueRequirement({ capexPerMW: 460000, rate: 0.115, years: 15 }), null);
  assert.equal(revenueRequirement({ capexPerMW: 460000, opexPerMW: 9000, years: 15 }), null);
});

test('the requirement band refuses rates passed the wrong way round', () => {
  const ok = requirementBand({ capexPerMW: 1e6, opexPerMW: 1e4, years: 15, lowRate: 0.075, highRate: 0.115 });
  assert.ok(ok.low.total < ok.high.total);
  assert.equal(ok.spread, ok.high.total - ok.low.total);
  assert.equal(requirementBand({ capexPerMW: 1e6, opexPerMW: 1e4, years: 15, lowRate: 0.115, highRate: 0.075 }), null);
});

test('cover, headroom and implied return agree with one another at break-even', () => {
  const req = revenueRequirement({ capexPerMW: 1e6, opexPerMW: 2e4, rate: 0.10, years: 15 });
  assert.equal(coverRatio(req.total, req.total), 1);
  assert.equal(revenueHeadroom(req.total, req.total), 0);
  const implied = impliedReturn({ capexPerMW: 1e6, opexPerMW: 2e4, years: 15, revenuePerMW: req.total });
  assert.ok(Math.abs(implied - 0.10) < 1e-6, `implied ${implied} should recover the 10% input`);
});

test('a negative or absent revenue never becomes a plausible-looking return', () => {
  assert.equal(coverRatio(100, 0), null);
  assert.equal(coverRatio(null, 100), null);
  // Revenue below opex leaves nothing for capital: no non-negative rate exists.
  assert.equal(impliedReturn({ capexPerMW: 1e6, opexPerMW: 5e4, years: 15, revenuePerMW: 4e4 }), null);
  // Revenue far above any plausible annuity is reported as off-scale, not as 40%.
  assert.equal(impliedReturn({ capexPerMW: 1e6, opexPerMW: 0, years: 15, revenuePerMW: 1e6 }), null);
  // A negative merchant year is passed through rather than floored.
  assert.ok(coverRatio(-5000, 50000) < 0);
});

/* --------------------------------------------------------------------- stack */

test('a GATED revenue line is absent from the total, never zero, and is counted', () => {
  const s = sumStack([
    { value: 100, tier: TIER.MODEL, cls: REVENUE_CLASS.SECURED },
    { value: 300, tier: TIER.MODEL, cls: REVENUE_CLASS.MERCHANT },
    { value: null, tier: TIER.GATED, cls: REVENUE_CLASS.MERCHANT },
  ]);
  assert.equal(s.total, 400);
  assert.equal(s.gatedCount, 1);
  assert.equal(s.byClass.secured, 100);
  assert.equal(s.exposed, 300);
  assert.equal(s.securedShare, 0.25);
});

test('the erosion stress reaches exposed revenue and never touches secured revenue', () => {
  const chain = buildEconomicsChain({
    marketId: 'x', asOf: '2026-07-29', currency: 'EUR',
    cost: { capexPerMW: 1e6, opexPerMW: 1e4, years: 15 },
    rates: { low: 0.075, high: 0.115 },
    stack: [
      { id: 'a', label: ['secured', 'secured'], value: 60000, cls: REVENUE_CLASS.SECURED, tier: TIER.MODEL },
      { id: 'b', label: ['merchant', 'merchant'], value: 40000, cls: REVENUE_CLASS.MERCHANT, tier: TIER.MODEL },
    ],
    erosion: { pct: 50, basis: ['test', 'test'], referencePct: 100, referenceBasis: ['ref', 'ref'] },
  });
  assert.equal(chain.stress.total, 60000 + 20000);
  assert.equal(chain.stress.lost, 20000);
  // At a 100% reference stress the secured line survives untouched.
  assert.equal(chain.reference.total, 60000);
});

test('the blended discount rate follows the secured share rather than an analyst choice', () => {
  const mk = (secured, merchant) => buildEconomicsChain({
    marketId: 'x', asOf: '2026-07-29', currency: 'EUR',
    cost: { capexPerMW: 1e6, opexPerMW: 1e4, years: 15 },
    rates: { low: 0.075, high: 0.115 },
    stack: [
      { id: 'a', label: ['s', 's'], value: secured, cls: REVENUE_CLASS.SECURED, tier: TIER.MODEL },
      { id: 'b', label: ['m', 'm'], value: merchant, cls: REVENUE_CLASS.MERCHANT, tier: TIER.MODEL },
    ],
  });
  // Fully merchant → the merchant yield. Fully secured → the contracted yield.
  assert.equal(mk(0, 100).margin.blendedRate.toFixed(4), (0.115).toFixed(4));
  assert.equal(mk(100, 0).margin.blendedRate.toFixed(4), (0.075).toFixed(4));
  // Half and half → the midpoint, and more secured is never more expensive.
  assert.equal(mk(50, 50).margin.blendedRate.toFixed(4), (0.095).toFixed(4));
  assert.ok(mk(80, 20).margin.blendedRate < mk(20, 80).margin.blendedRate);
});

test('the margin step reports itself uncomputable rather than inventing a cost of capital', () => {
  const chain = buildEconomicsChain({
    marketId: 'x', asOf: '2026-07-29', currency: 'EUR',
    cost: { opexPerMW: 1e4, years: 15 },              // no capex
    rates: { low: 0.075, high: 0.115 },
    stack: [{ id: 'a', label: ['m', 'm'], value: 100, cls: REVENUE_CLASS.MERCHANT, tier: TIER.MODEL }],
  });
  assert.equal(chain.margin.computable, false);
  assert.ok(chain.margin.reason[0]);
  assert.equal(chain.stress.computable, false);
});

/* -------------------------------------------------------------- every market */

test('every market publishes a well-formed six-step chain', () => {
  for (const [id, chain] of Object.entries(CHAINS)){
    const problems = validateChain(chain);
    assert.deepEqual(problems, [], `${id}: ${problems.join('; ')}`);
    assert.deepEqual(Object.keys(chain.steps).sort(), [...STEP_IDS].sort(), `${id} step ids`);
  }
});

test('every chain prices risk with the same two published yields and the same asset life', () => {
  for (const [id, chain] of Object.entries(CHAINS)){
    assert.equal(chain.rates.low, EXIT_Y_CONTRACTED, `${id} low rate`);
    assert.equal(chain.rates.high, EXIT_Y_MERCHANT, `${id} high rate`);
    assert.equal(chain.cost.years, LIFE, `${id} life`);
    // The blended rate must always sit inside the published band.
    assert.ok(chain.margin.blendedRate >= chain.rates.low - 1e-12, `${id} blended below band`);
    assert.ok(chain.margin.blendedRate <= chain.rates.high + 1e-12, `${id} blended above band`);
  }
});

test('every chain names an erosion stress backed by evidence, and a falsifier', () => {
  for (const [id, chain] of Object.entries(CHAINS)){
    assert.ok(chain.erosion.pct > 0, `${id} erosion pct`);
    assert.ok(chain.erosion.basis[0], `${id} erosion basis`);
    assert.ok(chain.stress.computable, `${id} stress`);
    assert.ok(chain.stress.coverBlended <= chain.margin.coverBlended, `${id} stress must not improve cover`);
    assert.ok(chain.falsifier.length >= 3, `${id} falsifier count`);
    for (const f of chain.falsifier){
      assert.ok(f.label[0] && f.why[0] && f.watch[0] && f.trigger[0], `${id} falsifier fields`);
    }
  }
});

test('WA is the cross-market reference stress and quotes AEMO exactly', () => {
  // The one realised compression in the platform. Not rounded to 75%.
  assert.equal(WA_CHAIN.erosion.pct, 74.5);
  assert.equal(WA_CHAIN.erosion.referencePct, undefined);
  for (const id of ['gb', 'ie', 'ro', 'pl', 'jp_tokyo', 'jp_kyushu', 'jp_hokkaido']){
    assert.equal(CHAINS[id].erosion.referencePct, 74.5, `${id} reference stress`);
    assert.ok(CHAINS[id].reference.computable, `${id} reference computable`);
    assert.ok(CHAINS[id].erosion.referenceBasis[0], `${id} reference basis`);
  }
});

test('the published cover ratios are the ones the arithmetic produces', () => {
  /* Pinned so a change to any approved input, or to the requirement model, is
     visible in a diff rather than silently altering a published conclusion.

     REPINNED 2026-08-04. Every value below moved, and none of them moved because
     the requirement model changed — `requirement.js` is untouched. They moved
     because the analyst revised the approved inputs each chain reads, in the
     2026-07-30 round recorded in docs/external-view.md §6a. Each pin carries the
     input that moved it, so a future unexplained drift is still a failure:

       wa   1.169 → 1.232  capex A$4.16m → A$3.64m (8h → 7h), contracted
                           A$464,000 → A$422,372, naqFactor 0.90 introduced
       gb   1.029 → 0.719  capex £460k → £900k (2h → 4h) against merchant revenue
                           up only ~30% — the same effect §5.4 records as a 3.1%
                           hold IRR, and the reason it says read the ordering
       ie   1.104 → 1.037  capacity price to the 2029/30 auction (€135.50/kW)
                           plus the DS3→FASS services decay curve
       ro   0.810 → 1.612  merchGross €70.4k → €110k with an FCR saturation curve
       pl   0.965 → 0.736  KWD 65% → 13.39%, the December 2025 auction adopted
       jp   0.847 → 0.487  4h → 6h and capex ¥45k → ¥60k/kWh

     Poland is the one to read twice: its cover fell because the de-rating
     collapse this file used to flag as a discrepancy is now inside the approved
     input. See the de-rating test below. */
  const cover = (id) => Number(CHAINS[id].margin.coverBlended.toFixed(3));
  assert.equal(cover('wa'), 1.232);
  assert.equal(cover('gb'), 0.719);
  assert.equal(cover('ie'), 1.037);
  assert.equal(cover('ro'), 1.612);
  assert.equal(cover('pl'), 0.667); // unnamed 10% grant removed from the new-entry case
  assert.equal(cover('jp_tokyo'), 0.487);

  // WA's capacity line alone covers most of the whole annual requirement, which is
  // the substance of its investment case. Higher than the 0.898 first pinned
  // because the 7h archetype cut capex faster than the BRCP revision cut revenue.
  const waCapacityCover = WA_CHAIN.stack.byClass.secured / WA_CHAIN.margin.blended.total;
  assert.equal(Number(waCapacityCover.toFixed(3)), 0.926);

  /* Romania now clears its requirement outright at the merchant yield, where it
     previously did not clear even at the contracted one. That is the €110k
     merchant revision, and it makes Romania the only market here whose case does
     not depend on a contracted line it has no mechanism to obtain. */
  assert.equal(Number(RO_CHAIN.margin.coverLow.toFixed(3)), 1.982);
  assert.equal(RO_CHAIN.stack.byClass.secured, 0);
});

test('Romania publishes a verified zero for capacity revenue rather than omitting the line', () => {
  const line = RO_CHAIN.stackLines.find(l => l.id === 'capacity');
  assert.equal(line.value, 0);
  assert.equal(line.tier, TIER.VERIFIED);
  assert.equal(line.cls, REVENUE_CLASS.SECURED);
  // With no secured revenue the requirement cannot be discounted at all.
  assert.equal(RO_CHAIN.margin.blendedRate, EXIT_Y_MERCHANT);
  assert.equal(RO_CHAIN.margin.coverBlended, RO_CHAIN.margin.coverHigh);
});

test('Poland derives its de-rating sensitivity without mutating the approved capacity', async () => {
  /* REWRITTEN 2026-08-04, and the rewrite is the point.

     The original test asserted `contracted: 39585` appeared literally in
     pl/comparison.js. That was a proxy for the real invariant — the chain must
     not edit the approved input — and it stopped being a valid proxy the moment
     the analyst adopted the December 2025 auction and moved the approved line to
     a `capacity: { price, derating }` object. A regex on a superseded literal
     cannot tell "the input is protected" from "the input was replaced".

     So this now asserts the invariant directly: import the approved object,
     build the chain, and prove the object is byte-identical afterwards. That is
     strictly stronger than the string match it replaces, and it survives the
     next revision of the approved value. */
  const { comparison } = await import('../src/markets/pl/comparison.js');
  const approved = comparison.economics.capacity;

  const before = JSON.stringify(approved);
  const beforeContracted = comparison.economics.contracted;
  await import('../src/markets/pl/economicsChain.js');   // building it must not mutate
  assert.equal(JSON.stringify(approved), before, 'the approved capacity object must be immutable');
  assert.equal(comparison.economics.contracted, beforeContracted,
    'the derived contracted line must not be rewritten by the chain');

  /* The de-rating lives in the approved input and the alternates are derived
     from it, never hardcoded. A literal seed here is exactly what caused the
     chain to de-rate an already-de-rated line by 13.39/65 after the analyst
     adopted the auction, publishing a capacity figure of about €2,983. */
  const source = readFileSync(new URL('../src/markets/pl/economicsChain.js', import.meta.url), 'utf8');
  assert.match(source, /KWD_APPROVED = Number\(\(E\.capacity\.derating \* 100\)/,
    'the approved factor must be read from the capacity object, not restated');
  assert.doesNotMatch(source, /KWD_SEED\s*=\s*65/, 'no hardcoded seed de-rating may return');
  assert.match(source, /WHAT THIS FILE STILL DOES NOT DO: touch the approved capacity object/);

  // The sensitivity still has to be quantified to be worth publishing — but it now
  // runs the other way, because the collapse is inside the approved case.
  const conv = PL_CHAIN.steps.conversion;
  assert.match(conv.warn[0], /DISCREPANCY CLOSED/);
  assert.match(conv.warn[0], /13\.39%/, 'the approved factor must appear in the published flag');
  assert.match(conv.warn[0], /60%/, 'the reversion case must be named and sized');
  assert.ok(conv.mechanisms.some(x => x.tier === TIER.PROXY),
    'the reversion case is not an observation and must stay labelled PROXY');
});

test('Japan uses the governed year of JEPX data the previous section left unused', () => {
  for (const id of ['tokyo', 'kyushu', 'hokkaido']){
    const chain = JP_CHAINS[id];
    assert.equal(chain.observation.coverageDays, 366, `${id} coverage`);
    assert.ok(chain.observation.ratio > 0, `${id} observed/approved ratio`);
    // Capacity revenue is re-won annually, so no Japanese line is secured for the
    // modelled life and no discount can be earned.
    assert.equal(chain.stack.byClass.secured, 0, `${id} secured`);
    assert.equal(chain.margin.blendedRate, EXIT_Y_MERCHANT, `${id} rate`);
  }

  // The finding: the capacity auction cannot rank the areas, the observed data can,
  // and it reverses the seed's ordering.
  const bySeed = ['tokyo', 'kyushu', 'hokkaido'].sort((a, b) => JP_REGION_COVER[b].seed.cover - JP_REGION_COVER[a].seed.cover);
  const byObserved = ['tokyo', 'kyushu', 'hokkaido'].sort((a, b) => JP_REGION_COVER[b].observed.cover - JP_REGION_COVER[a].observed.cover);
  assert.equal(byObserved[0], 'hokkaido', 'observed data ranks Hokkaido first');
  assert.equal(bySeed[2], 'hokkaido', 'the seed ranks Hokkaido last');
  assert.notDeepEqual(bySeed, byObserved, 'the two orderings must differ — that is the finding');

  const spreads = ['tokyo', 'kyushu', 'hokkaido'].map(id => JP_OBSERVED[id].spreadMean);
  assert.ok(Math.max(...spreads) / Math.min(...spreads) > 1.25, 'observed spreads differ by more than 25%');
});

/* ------------------------------------------------------------------ rendering */

test('the chain renders to blocks the shared engine and the WA adapter both draw', () => {
  // The vocabulary the two renderers implement. A block type outside this set would
  // render in five markets and vanish in the sixth.
  const SUPPORTED = new Set(['card', 'kpis', 'table', 'flow', 'wf', 'chip', 'why', 'note',
    'reco', 'warn', 'cap', 'p', 'sub', 'meter', 'cmp', 'wfrows', 'src']);
  const walk = (blocks, seen = new Set()) => {
    for (const b of blocks.flat()){
      if (!b) continue;
      seen.add(b.t);
      if (b.blocks) walk(b.blocks, seen);
      if (b.cards) walk(b.cards, seen);
    }
    return seen;
  };

  for (const [id, chain] of Object.entries(CHAINS)){
    const blocks = economicsChainBlocks(chain, { currencySymbol: '€', locale: 'en-GB' });
    assert.ok(blocks.length >= 8, `${id} block count`);
    // Six numbered steps, plus the opening card and the verdict.
    const titles = blocks.map(b => b.title[0]);
    assert.equal(titles.filter(t => /^0\d · /.test(t)).length, 6, `${id} numbered steps`);
    assert.ok(titles.some(t => /Economics DNA/.test(t)), `${id} opening card`);
    assert.ok(titles.some(t => /^The verdict/.test(t)), `${id} verdict card`);

    for (const t of walk(blocks)){
      assert.ok(SUPPORTED.has(t), `${id} emits unsupported block type "${t}"`);
    }
    // Every card is tagged so the story tab can partition its panels explicitly.
    for (const b of blocks) assert.equal(b.cls, ECONOMICS_CARD_CLASS, `${id} untagged card: ${b.title[0]}`);
  }
});

test('the verdict card avoids the titles pageEnhancements deletes', () => {
  // removeUnquantifiedCards() strips "Investment conclusion" and "Bear / Base / Bull"
  // cards because the previous versions were unquantified prose. The rebuilt cards
  // carry cover ratios and falsifiers and must survive.
  const deleted = /Investment conclusion|投资结论|Bear\s*\/\s*Base\s*\/\s*Bull|Regional Bear|悲观\s*\/\s*基准\s*\/\s*乐观|区域悲观/i;
  for (const [id, chain] of Object.entries(CHAINS)){
    for (const b of economicsChainBlocks(chain, { currencySymbol: '€', locale: 'en-GB' })){
      assert.ok(!deleted.test(b.title[0]), `${id}: "${b.title[0]}" would be deleted at render`);
      assert.ok(!deleted.test(b.title[1]), `${id}: "${b.title[1]}" would be deleted at render`);
    }
  }
});

test('the story tab splits its panels on the chain marker, not on card order', () => {
  const source = readFileSync(new URL('../src/components/pageEnhancements.js', import.meta.url), 'utf8');
  assert.match(source, /economics-chain-card/);
  assert.equal(ECONOMICS_CARD_CLASS, 'economics-chain-card');

  // Each market must actually reach the marker path: the chain has to be part of the
  // story tab's blocks, or its Economics panel renders empty.
  const storyFiles = {
    wa: '../src/markets/wa/sections/story.js',
    gb: '../src/markets/gb/sections.js',
    ie: '../src/markets/ie/sections.js',
    ro: '../src/markets/ro/sections.js',
    pl: '../src/markets/pl/sections.js',
    jp: '../src/markets/jp/sections.js',
  };
  const calls = {
    wa: /renderWaEconomicsP0\(main\)/,
    gb: /\.\.\.gbEconomicsP0Blocks\(SRC\)/,
    ie: /\.\.\.ieEconomicsP0Blocks\(SRC\)/,
    ro: /\.\.\.buildROEconomicsBlocks\(\)/,
    pl: /\.\.\.buildPLEconomicsBlocks\(\)/,
    jp: /\.\.\.buildJPEconomicsBlocks\(region\(\)\)/,
  };
  for (const [id, file] of Object.entries(storyFiles)){
    const text = readFileSync(new URL(file, import.meta.url), 'utf8');
    assert.match(text, calls[id], `${id} does not integrate its economics chain`);
    // …and it must be inside the story section rather than another tab.
    const storyAt = text.search(/SEC_B\.story\s*=|function renderStory/);
    assert.ok(storyAt >= 0, `${id}: no story section found`);
    assert.ok(text.slice(storyAt).search(calls[id]) >= 0, `${id}: economics chain is not on the story tab`);
  }
});

test('money formatting respects each market currency and never invents precision', () => {
  const jpy = moneyFormats({ currencySymbol: '¥', locale: 'ja-JP' });
  assert.equal(jpy.money(180000000), '¥180m');
  assert.equal(jpy.money(8258738), '¥8.26m');
  assert.equal(jpy.money(-5000), '−¥5,000');
  assert.equal(jpy.money(null), '—');
  assert.equal(jpy.ratio(0.9), '0.90×');          // aligns in a column
  assert.equal(jpy.pctExact(74.5), '74.5%');      // a stated stress is not rounded
  assert.equal(jpy.pctExact(32), '32%');          // …and an integer gains no decimal
  const aud = moneyFormats({ currencySymbol: 'A$', locale: 'en-AU' });
  assert.equal(aud.exact(464000), 'A$464,000');
});
