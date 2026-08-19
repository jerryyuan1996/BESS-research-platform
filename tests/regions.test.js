/* ---------------------------------------------------------------------------
   REGIONAL COLOUR IS ORIENTATION, AND THAT IS ALL IT IS ALLOWED TO BE.

   The rules this file enforces:

     · every registered market has a region, so a new one cannot silently
       arrive with no orientation and no error;
     · the accents come from outside the series ramp, so a regional tint can
       never be mistaken for a data series;
     · each accent clears 3:1 against the page and the card behind it, which is
       the threshold for a meaningful non-text boundary;
     · the accent is never the only channel — asserted by requiring the region
       label to exist for every region.

   WHAT IS DELIBERATELY NOT ASSERTED, AND WHY.

   That the four accents are distinguishable FROM EACH OTHER under colour-vision
   deficiency. They are not, and they cannot be: simulating them collapses
   europe onto oceania at 1.06:1 under deuteranopia and americas onto asia at
   1.01:1 under tritanopia. Four hues that each hold 3:1 against a light page do
   not have room left to hold a usable separation from one another across all
   three common deficiencies.

   Rather than pretend otherwise with a weaker threshold, the design does not
   depend on it: the region is named in text everywhere an accent appears, and
   no navigation state is carried by hue. The simulation below runs anyway and
   records the real numbers, so the claim stays honest and a future palette
   change cannot quietly make things worse without someone reading it.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { REGIONS, regionOf, regionFor, mappedMarkets } from '../src/markets/regions.js';
import { markets } from '../src/markets/registry.js';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOKENS = readFileSync(path.join(REPO, 'src/styles/tokens.css'), 'utf8');

/* ---- colour maths ---------------------------------------------------------- */
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const hx = (h) => { const s = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(s.slice(i, i + 2), 16)); };
const lum = (rgb) => { const [r, g, b] = rgb.map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)]; return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

/** Read a custom property out of the first :root block (the light theme). */
function token(name){
  const m = TOKENS.match(new RegExp('--' + name + ':\\s*(#[0-9a-fA-F]{6})'));
  assert.ok(m, `--${name} is not defined in tokens.css`);
  return m[1];
}

const PAGE = token('bg');
const CARD = token('surface');
const ACCENTS = Object.keys(REGIONS).map(id => [id, token('region-' + id)]);

test('every registered market has a region', () => {
  /* Fail closed. A market with no region gets no accent, which is correct, but
     it should be a decision rather than an omission nobody noticed. */
  const missing = markets.map(m => m.manifest.id).filter(id => !regionOf(id));
  assert.deepEqual(missing, [],
    'add these to BY_MARKET in src/markets/regions.js: ' + missing.join(', '));
});

test('the region map contains no market that does not exist', () => {
  const live = new Set(markets.map(m => m.manifest.id));
  const stale = mappedMarkets().filter(id => !live.has(id));
  assert.deepEqual(stale, [], 'these mapped markets are no longer registered');
});

test('every region is named in both languages', () => {
  /* The text label is what carries the meaning when the colour cannot. */
  for (const [id, r] of Object.entries(REGIONS)){
    assert.equal(r.id, id);
    assert.ok(Array.isArray(r.label) && r.label.length === 2 && r.label[0] && r.label[1],
      `${id} needs an [en, zh] label — the accent is never the only channel`);
  }
  assert.equal(regionFor('nope'), null, 'an unknown market gets null, never a guessed region');
});

test('each accent clears 3:1 against the page and the card', () => {
  /* The threshold for a meaningful non-text boundary. Below it the rule the
     accent draws is not reliably visible, so it is decoration that fails even
     at being decoration. */
  for (const [id, hex] of ACCENTS){
    const vsPage = ratio(hx(hex), hx(PAGE));
    const vsCard = ratio(hx(hex), hx(CARD));
    assert.ok(vsPage >= 3, `${id} is ${vsPage.toFixed(2)}:1 against the page, below 3:1`);
    assert.ok(vsCard >= 3, `${id} is ${vsCard.toFixed(2)}:1 against the card, below 3:1`);
  }
});

test('no accent collides with the series ramp', () => {
  /* A regional tint that matched a chart series would be read as data. */
  const series = [...TOKENS.matchAll(/--s\d+:\s*(#[0-9a-fA-F]{6})/g)].map(m => m[1].toLowerCase());
  for (const [id, hex] of ACCENTS){
    assert.ok(!series.includes(hex.toLowerCase()),
      `${id} reuses a series colour (${hex}); a regional accent must not read as a data series`);
  }
});

test('regional hue is never the carrier of a state', () => {
  /* Property the design DOES rely on: strip every regional hue and navigation,
     content and state remain understandable. Enforced at the source — a
     --region-* token may only paint a boundary, never a state, a fill that
     carries meaning, or text. */
  const css = readFileSync(path.join(REPO, 'src/styles/cockpit.css'), 'utf8');
  const offending = [];
  for (const line of css.split(/\r?\n/)){
    if (!line.includes('--region-')) continue;
    /* Allowed: a border colour. Anything else would make the hue load-bearing. */
    if (!/border(-inline-start)?-color\s*:/.test(line)) offending.push(line.trim().slice(0, 90));
    if (/:hover|:focus|\.active/.test(line)) offending.push('state uses a regional hue: ' + line.trim().slice(0, 70));
  }
  assert.deepEqual(offending, [],
    'a regional accent may only draw a boundary; states are border, weight and background');
});

test('a regional accent never appears without a text label beside it', () => {
  /* The card sets data-region and renders .mregion in the same expression, so
     the two cannot be separated by an edit that only touches one of them. */
  const card = readFileSync(path.join(REPO, 'src/components/marketCard.js'), 'utf8');
  assert.match(card, /'data-region':/, 'the card must tag its region');
  assert.match(card, /class:\s*'mregion'/, 'and must name it in text');
  const tagAt = card.indexOf("'data-region':");
  const labelAt = card.indexOf("class: 'mregion'");
  assert.ok(labelAt > tagAt && labelAt - tagAt < 600,
    'the region label must sit with the accent it explains, not elsewhere in the file');
});

test('confidential dossiers receive no market- or region-derived chrome', () => {
  /* A project's market association is confidential until the deal is public.
     Tinting a dossier page by region would leak it from the chrome, with no
     text saying so and nothing for a reader to notice. */
  for (const rel of ['src/projects/dossier/page.js', 'src/projects/dossier/blocks.js',
                     'src/styles/dossier.css']){
    const src = readFileSync(path.join(REPO, rel), 'utf8');
    assert.ok(!src.includes('--region-'),
      `${rel} paints with a regional token; a dossier must not advertise its market`);
    assert.ok(!/data-region/.test(src),
      `${rel} tags a region; a dossier must not advertise its market`);
  }
});

test('DIAGNOSTIC: how the accents separate under colour-vision simulation', () => {
  /* REPORTED, NOT REQUIRED. The design treats mutual distinguishability as
     decorative — the region is always named in text — so this asserts nothing
     about the palette. It prints the numbers so a future change can be seen,
     and so the comment in tokens.css can be checked against reality rather
     than trusted. */
  const MAT = {
    deuteranopia: [[0.625, 0.375, 0], [0.70, 0.30, 0], [0, 0.30, 0.70]],
    protanopia:   [[0.567, 0.433, 0], [0.558, 0.442, 0], [0, 0.242, 0.758]],
    tritanopia:   [[0.95, 0.05, 0], [0, 0.433, 0.567], [0, 0.475, 0.525]],
  };
  const unlin = (c) => { c = Math.min(1, Math.max(0, c));
    return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055; };
  const sim = (hex, kind) => {
    const [r, g, b] = hx(hex).map(lin);
    return MAT[kind].map(row => Math.round(unlin(row[0] * r + row[1] * g + row[2] * b) * 255));
  };
  const report = [];
  for (const kind of Object.keys(MAT)){
    let worst = { r: Infinity };
    for (let i = 0; i < ACCENTS.length; i++)
      for (let j = i + 1; j < ACCENTS.length; j++){
        const r = ratio(sim(ACCENTS[i][1], kind), sim(ACCENTS[j][1], kind));
        if (r < worst.r) worst = { r, a: ACCENTS[i][0], b: ACCENTS[j][0] };
      }
    report.push(`  ${kind}: worst pair ${worst.a}/${worst.b} at ${worst.r.toFixed(2)}:1`);
  }
  console.log(['regional accents under simulation (diagnostic only):'].concat(report).join(String.fromCharCode(10)));
  assert.ok(report.length === 3, 'all three deficiencies reported');
});
