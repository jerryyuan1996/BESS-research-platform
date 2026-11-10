/* Read-only review of the three return/rationale items. No view writer, model
   override, screening threshold, network request or file write is used here.
   Run: node scripts/view/review-investment-evidence.mjs [ISO review timestamp]
   The date fixes the briefing's data-currentness context for a dated review. */
import { pathToFileURL } from 'node:url';
import { byId, markets } from '../../src/markets/registry.js';
import { runBaseCase } from '../../src/comparison/engine.js';
import { sweepDesign } from '../../src/comparison/designFit.js';
import { returnGradesFor } from '../../src/comparison/returnGrades.js';
import { briefingFromDisk, readBriefingInputs } from '../../src/briefing/disk.js';
import { homeProjection } from '../../src/briefing/model.js';
import { opportunitySummary } from '../../src/opportunities/summary.js';

export async function investmentEvidence({ now = new Date() } = {}) {
  const briefing = await briefingFromDisk({ now });
  const { views } = await readBriefingInputs();
  const cards = opportunitySummary(homeProjection(briefing), views).infraFund.markets;
  const grades = returnGradesFor(markets);
  const result = { asOf: now.toISOString(), investor: 'infraFund', markets: {} };
  for (const id of ['nem', 'pjm', 'wa']) {
    const market = byId(id), base = runBaseCase(market, 5);
    const view = views.find(v => v.marketId === id), card = cards[id];
    result.markets[id] = {
      storedGrades: {
        assetReturn: view.grades.assetReturn,
        revenueCertainty: view.grades.revenueCertainty,
      },
      engineGrade: grades[id]['hold-irr'],
      // Comparison engine: existing 15-year operating case, no investment tax/debt.
      base: {
        hours: market.comparison.archetype.durationHours,
        holdIRR: base.irrHold, securedShare: base.securedShare,
        securedYears: base.securedYears, lifeYears: base.eb.length,
      },
      // Each design carries the sweep's own annual capacity/fade options.
      designs: sweepDesign(market).points.filter(p => p.priced &&
        p.route === base.strategyId).map(p => ({
        hours: p.hours, route: p.route, eligible: p.eligible,
        holdIRR: p.irrHold, securedShare: p.securedShare,
        valuePerMWUSD: p.value, runOptions: p.runOptions,
      })),
      // Exact same reference card as the homepage, not a substituted base design.
      investmentCard: {
        hours: card.hours, stage: card.stage, lifeYears: card.lifeYears,
        currency: card.currency, holdIRR: card.holdIRR,
        leveredIRR: card.leveredIRR, gearing: card.leverage?.gearing,
        securedShare: card.secured, securedYears: card.securedYears,
      },
    };
  }
  const ercot = views.find(v => v.marketId === 'ercot');
  result.ercot = {
    january: ercot.triggers.find(t => t.id === 'ercot-january-2027-mora'),
    february: ercot.triggers.find(t => t.id === 'ercot-february-2027-mora'),
  };
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const now = process.argv[2] ? new Date(process.argv[2]) : new Date();
  if (!Number.isFinite(now.getTime())) throw new RangeError('Invalid review timestamp');
  console.log(JSON.stringify(await investmentEvidence({ now }), null, 2));
}
