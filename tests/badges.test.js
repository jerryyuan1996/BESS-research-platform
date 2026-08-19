/* ---------------------------------------------------------------------------
   BADGES CARRY STATE; DEMOTED TYPES CANNOT COME BACK QUIETLY.

   The chip shape was doing four jobs at once — state, provenance, methodology
   and qualification — and provenance alone was two thirds of it. Splitting them
   is only durable if the split is enforced, because the easiest way to add a
   badge will always be to pass a new string to the generic helper.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  BADGE_LABELS, WARNING_BADGES, STATE_BADGES, DEMOTED_BADGES,
} from '../src/components/badge.js';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function walk(dir){
  return readdirSync(dir).flatMap(n => {
    const full = path.join(dir, n);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}
const JS = walk(path.join(REPO, 'src')).filter(f => f.endsWith('.js'));

test('the three groups are disjoint', () => {
  /* A type in two groups would render differently depending on which check ran
     first, which is the kind of ambiguity that produced the original mess. */
  for (const t of WARNING_BADGES)
    assert.ok(!STATE_BADGES.has(t) && !DEMOTED_BADGES[t], `${t} is in more than one group`);
  for (const t of STATE_BADGES)
    assert.ok(!DEMOTED_BADGES[t], `${t} is in more than one group`);
});

test('every badge type still has a label', () => {
  for (const t of [...WARNING_BADGES, ...STATE_BADGES, ...Object.keys(DEMOTED_BADGES)]){
    const l = BADGE_LABELS[t];
    assert.ok(Array.isArray(l) && l[0] && l[1], `${t} has no [en, zh] label`);
  }
});

test('a demoted type cannot be reintroduced as a badge', () => {
  /* The enforcement the whole split depends on. badge() checks DEMOTED_BADGES
     first and returns a labelled note, so a demoted type cannot reach the chip
     path at all — and because the groups are disjoint, adding it to a badge
     group as well would fail the first test in this file.

     Asserted on the source rather than by rendering, because there is no DOM
     here; the browser behaviour is verified in the round-6 visual pass. */
  const src = readFileSync(path.join(REPO, 'src/components/badge.js'), 'utf8');
  const demotedFirst = src.indexOf('if (DEMOTED_BADGES[type]) return demotedNote');
  const chipPath = src.indexOf("class: 'badge '");
  assert.ok(demotedFirst > 0, 'badge() must divert demoted types before the chip path');
  assert.ok(demotedFirst < chipPath, 'the diversion must come first, or it is not a guard');

  for (const t of Object.keys(DEMOTED_BADGES)){
    assert.ok(!WARNING_BADGES.has(t) && !STATE_BADGES.has(t),
      `${t} is demoted and must not also be renderable as a badge`);
  }
});

test('an unknown badge type is a mistake, not a silent fallback', async () => {
  /* The previous helper rendered unknown types with the "illustrative" label,
     so a typo produced a confident chip saying something nobody wrote — and a
     new provenance type could be added without anyone deciding it was a state. */
  const src = readFileSync(path.join(REPO, 'src/components/badge.js'), 'utf8');
  assert.match(src, /throw new Error\(\s*`unknown badge type/,
    'badge() must reject an unrecognised type');
  assert.ok(!/BADGE_LABELS\[type\] \|\| BADGE_LABELS\.illus/.test(src),
    'the illustrative fallback must be gone');
});

test('the retired types are gone from the vocabulary and from every call site', () => {
  for (const t of ['contract', 'jp-national', 'mismatch', 'gross']){
    assert.ok(!BADGE_LABELS[t], `${t} is still in BADGE_LABELS`);
    const used = JS.filter(f => readFileSync(f, 'utf8').includes(`badge('${t}')`));
    assert.deepEqual(used.map(f => path.relative(REPO, f)), [],
      `${t} was retired but is still called`);
  }
});

test('warning priority is announced, not implied by colour', () => {
  const src = readFileSync(path.join(REPO, 'src/components/badge.js'), 'utf8');
  assert.match(src, /data-priority/, 'the tier must be in the markup, not only in a class');
  assert.match(src, /sr-only/, 'a screen reader must hear the priority');
  assert.match(src, /badge-glyph/, 'a warning needs a non-colour channel');

  const css = readFileSync(path.join(REPO, 'src/styles/components.css'), 'utf8');
  assert.match(css, /\.badge-warning\{[^}]*font-weight/s, 'weight must separate the tiers');
  assert.match(css, /\.badge-warning\{[^}]*border/s, 'and a border, for grayscale');
  assert.match(css, /forced-colors: active\)\{[^}]*\.badge-warning/s,
    'the tier must survive a forced-colours palette');
});

test('REPORT: badge call sites by group', () => {
  /* Informational. Printed so the effect of the split stays visible, and so a
     future drift back towards badging everything is noticeable in CI output
     rather than only on the page. */
  const counts = { warning: 0, state: 0, demoted: 0 };
  const perType = new Map();
  for (const f of JS){
    for (const m of readFileSync(f, 'utf8').matchAll(/badge\('([a-z-]+)'/g)){
      const t = m[1];
      perType.set(t, (perType.get(t) || 0) + 1);
      if (WARNING_BADGES.has(t)) counts.warning++;
      else if (STATE_BADGES.has(t)) counts.state++;
      else if (DEMOTED_BADGES[t]) counts.demoted++;
    }
  }
  const chips = counts.warning + counts.state;
  const total = chips + counts.demoted;
  const lines = [
    `badge() call sites: ${total}`,
    `  rendered as chips: ${chips} (warning ${counts.warning}, state ${counts.state})`,
    `  rendered as text : ${counts.demoted}`,
    `  chips are ${(100 * chips / total).toFixed(0)}% of call sites`,
  ];
  for (const [t, n] of [...perType].sort((a, b) => b[1] - a[1])){
    const g = WARNING_BADGES.has(t) ? 'WARNING' : STATE_BADGES.has(t) ? 'state' : 'text';
    lines.push(`    ${t.padEnd(12)} ${g.padEnd(8)} ${n}`);
  }
  console.log(lines.join(String.fromCharCode(10)));
  assert.ok(total > 0);
});
