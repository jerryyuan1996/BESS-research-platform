/* ---------------------------------------------------------------------------
   ONE SPONSOR POSITION, EVERY PAGE.

   The platform runs two costing lineages. The comparison engine normalizes each
   market to a $1M investment and feeds the cockpit, the league table, the $1M
   matrix, the certainty frontier and the Investment Lab. The market dashboards
   run their own project-level model — a named MW/hours configuration — and feed
   the Portfolio tab and every duration and optimiser section.

   They are allowed to model different assets. They are NOT allowed to buy
   equipment at different prices or discount at different rates.

   In August 2026 they did. `applySponsorAssumptions` was wired into the market
   registry only, so the cockpit priced Romania at €567,000/MW while Romania's
   own Portfolio tab priced the identical 2h configuration at €630,000/MW and
   published an unlevered IRR of 4.9% against the cockpit's 20.8%. Nothing failed;
   the two numbers simply disagreed in public.

   This file is what makes that disagreement fail the build.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';

import { byId } from '../src/markets/registry.js';
import {
  applySponsorLabSeed, OEM_CAPEX_MULTIPLIER, SPONSOR_DISCOUNT_DELTA_PP,
} from '../src/comparison/sponsorAssumptions.js';

import { M as nem } from '../src/markets/nem/data.js';
import { M as gb } from '../src/markets/gb/data.js';
import { M as de } from '../src/markets/de/data.js';
import { M as it } from '../src/markets/it/data.js';
import { M as ie } from '../src/markets/ie/data.js';
import { M as ro } from '../src/markets/ro/data.js';
import { M as pl } from '../src/markets/pl/data.js';
import { M as pjm } from '../src/markets/pjm/data.js';
import { M as ercot } from '../src/markets/ercot/data.js';
import { M as caiso } from '../src/markets/caiso/data.js';
import { M as jp } from '../src/markets/jp/data.js';
import { M as fi } from '../src/markets/fi/data.js';
import { SEED as waSeed } from '../src/markets/wa/data/seed.js';

/* Every allocation market that renders a dashboard, mapped to the raw lab seed
   its dashboard is built from. Tokyo stands for the three Japanese allocation
   points, which share one dashboard and therefore one seed. */
const DASHBOARD_SEEDS = {
  wa: waSeed.lab,
  nem: nem.lab,
  gb: gb.lab,
  de: de.lab,
  it: it.lab,
  ie: ie.lab,
  ro: ro.lab,
  pl: pl.lab,
  pjm: pjm.lab,
  ercot: ercot.lab,
  caiso: caiso.lab,
  jp_tokyo: jp.lab,
  fi: fi.lab,          // since 2026-10-17, when Finland entered the engine
};

/* Dashboards whose reference configuration is deliberately NOT the comparison
   archetype, with the reason. A market may only appear here for a stated
   modelling reason — never because its numbers stopped reconciling. */
const DIFFERENT_ARCHETYPE = {
  gb: 'the GB screening case is the merchant-weighted 2h asset; the comparison archetype is 4h',
  wa: 'WA screens an 8h build against a 7h comparison archetype — the 7th hour is the buffer',
  jp_tokyo: 'the Japan lab models a 4h configuration; LTDA eligibility puts the archetype at 6h',
};

/** What the dashboard's own seed implies, per MW, at its own duration. */
const labCapexPerMW = (lab) =>
  (lab.hours || 0) * 1000 * (lab.capexKWh || 0) + 1000 * (lab.capexKW || 0);

test('the sponsor position reaches every dashboard seed, not just the cockpit', () => {
  for (const [id, raw] of Object.entries(DASHBOARD_SEEDS)){
    const seeded = applySponsorLabSeed(raw);

    /* The quoted DC block inside the energy rate is a transaction price and is
       not discounted (2026-10-17); everything else is. */
    const quoted = raw.dcQuoteKWh || 0;
    if (raw.capexKWh != null){
      assert.equal(seeded.capexKWh, (raw.capexKWh - quoted) * OEM_CAPEX_MULTIPLIER + quoted,
        `${id}: capexKWh must carry the sponsor buying position on all but the quoted block`);
    }
    if (raw.capexKW != null){
      assert.equal(seeded.capexKW, raw.capexKW * OEM_CAPEX_MULTIPLIER,
        `${id}: capexKW must carry the sponsor buying position`);
    }
    assert.equal(seeded.dcQuoteKWh, raw.dcQuoteKWh, `${id}: the quoted block passes through unscaled`);

    assert.equal(seeded.disc, Number((raw.disc + SPONSOR_DISCOUNT_DELTA_PP).toFixed(2)),
      `${id}: the dashboard hurdle rate must move with the platform's cost of capital`);
  }
});

test('a grid connection charge is never discounted as though it were equipment', () => {
  /* A TSO or DNO connection charge is a published tariff. The sponsor cannot
     negotiate it, so a procurement multiplier must not touch it. Every market
     seeds it at zero or leaves it undeclared today, which is exactly why this
     needs asserting now rather than after one of them publishes a real number. */
  for (const [id, raw] of Object.entries(DASHBOARD_SEEDS)){
    const seeded = applySponsorLabSeed(raw);
    assert.equal(seeded.connectionPerMW, raw.connectionPerMW,
      `${id}: connection charge must pass through unscaled`);
  }
});

test('where the dashboard models the comparison archetype, the two costings reconcile exactly', () => {
  let checked = 0;

  for (const [id, raw] of Object.entries(DASHBOARD_SEEDS)){
    const comparison = byId(id).comparison;
    const archetypeHours = comparison.archetype.durationHours;
    const lab = applySponsorLabSeed(raw);

    if (lab.hours !== archetypeHours){
      assert.ok(DIFFERENT_ARCHETYPE[id],
        `${id}: dashboard models ${lab.hours}h against a ${archetypeHours}h archetype with no stated reason`);
      continue;
    }

    /* Same asset, same duration, same sponsor — so the same number, to the
       cent: the dashboard's component rates are derived from the market's own
       installed cost, so any larger difference is a costing that drifted. (The
       quoted block arrives at both by different float paths, hence the cent.) */
    assert.ok(Math.abs(labCapexPerMW(lab) - comparison.economics.capexPerMW) < 0.01,
      `${id}: dashboard prices ${labCapexPerMW(lab)}/MW against the cockpit's ${comparison.economics.capexPerMW}/MW`);
    checked += 1;
  }

  assert.equal(checked, Object.keys(DASHBOARD_SEEDS).length - Object.keys(DIFFERENT_ARCHETYPE).length,
    'every market that shares the comparison archetype must be reconciled');
  assert.ok(checked >= 9, `only ${checked} markets reconciled — an exemption was added without a reason`);
});

test('the dashboards that differ do so on duration alone, at the same unit rates', () => {
  /* GB, WA and Japan screen a different-sized battery, which is a modelling
     choice. What they may not do is buy that battery at a different price, so
     their per-unit rates still carry the multiplier — checked above — and their
     hurdle rates still carry the delta. This test states that the exemption is
     about duration and nothing else. */
  for (const id of Object.keys(DIFFERENT_ARCHETYPE)){
    const raw = DASHBOARD_SEEDS[id];
    const lab = applySponsorLabSeed(raw);
    assert.notEqual(lab.hours, byId(id).comparison.archetype.durationHours, `${id}: exemption is stale`);
    assert.ok(lab.capexKWh < raw.capexKWh, `${id}: energy rate must still be the sponsor's`);
    assert.ok(lab.disc < raw.disc, `${id}: hurdle rate must still carry the revision`);
  }
});
