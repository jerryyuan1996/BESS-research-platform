/* ---------------------------------------------------------------------------
   NO MODEL RESULTS IN ANALYST PROSE.

   The analyst ruled on 2026-10-31 (docs/view-text-plan-2026-10-31.md, 1A and
   4A) that a return the engine computes is never typed into analyst prose: the
   card and the design grid show it, and a typed copy drifts the moment the
   model moves. Theses written in mid-October quoted the design grid, and after
   the 29 October financing revision the card showed a different basis, so the
   page disagreed with itself in fourteen markets.

   This test reads every market's view and fails when a thesis, play reason,
   action, verdict reason, "despite" line or score note carries a return figure.
   Grade reasons are exempt (2A): they are the dated record of why a grade was
   given, and keep their figure with its basis and date. Design terms, sourced
   facts and regulatory parameters (Japan's 4.5% pre-tax bid cap) are not
   return figures and pass.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'view', 'markets');

/* Italy's entry-cohort ruling was approved on 1 November 2026. Its prose now
   follows the same bound-result rule as every other market. */
const HELD = new Set();

const EN = [
  /\b(?:returns?|hold|IRR)\b[^.;:]{0,20}?−?\d+(?:\.\d+)?%/i,
  /−?\d+(?:\.\d+)?%\s*(?:hold|IRR)\b/i,
];
const ZH = [/(?:持有期回报|持有期IRR|回报为|回报仅|IRR为?)\s*−?\d/];

export function typedReturn([en, zh]){
  return EN.some(re => re.test(en)) || ZH.some(re => re.test(zh));
}

function prose(view){
  const out = [];
  const pair = (where, p) => { if (Array.isArray(p) && p.length === 2) out.push([where, p]); };
  const verdict = (where, v) => {
    if (!v) return;
    for (const [i, b] of (v.because || []).entries()) pair(`${where}.because[${i}]`, b?.text);
    pair(`${where}.despite`, v.despite);
    pair(`${where}.scoreNote`, v.scoreNote);
  };
  pair('thesis', view.thesis);
  for (const [lens, v] of Object.entries(view.verdicts || {})) verdict(`verdicts.${lens}`, v);
  for (const [id, play] of Object.entries(view.plays || {})){
    pair(`plays.${id}.why`, play.why);
    pair(`plays.${id}.action`, play.action?.text);
    for (const [lens, v] of Object.entries(play.calls || {})) verdict(`plays.${id}.calls.${lens}`, v);
  }
  return out;
}

test('the detector catches a typed return and passes design terms and caps', () => {
  assert.equal(typedReturn(['The reference project returns 2.4% on the model.', '参考项目的模型回报为2.4%。']), true);
  assert.equal(typedReturn(['Merchant four hours is the best design at 13.9% hold.', '持有期回报13.9%。']), true);
  assert.equal(typedReturn(['Fifteenth on hold IRR, −5.9%.', '持有期IRR为−5.9%']), true);
  assert.equal(typedReturn(['A battery bid is capped at a regulated 4.5% pre-tax return.', '蓄电池报价的税前回报受监管上限4.5%约束。']), false);
  assert.equal(typedReturn(['A floor at half of expected revenue for seven years.', '预期收入的一半、为期七年。']), false);
  assert.equal(typedReturn(['At build cost the reference project falls short of the fund\'s target.', '按建设成本测算，参考项目达不到基金目标回报。']), false);
});

test('no market types a model return into its analyst prose', async () => {
  const files = (await readdir(ROOT)).filter(f => f.endsWith('.json'));
  assert.ok(files.length > 0, 'no market views found');
  const found = [];
  for (const file of files){
    const view = JSON.parse(await readFile(path.join(ROOT, file), 'utf8'));
    if (HELD.has(view.marketId)) continue;
    for (const [where, p] of prose(view)) if (typedReturn(p)) found.push(`${view.marketId} ${where}: ${p[0]}`);
  }
  assert.deepEqual(found, [], `model returns typed into prose — say it in words, and let the card show the figure:\n  ${found.join('\n  ')}`);
});
