/* ---------------------------------------------------------------------------
   Map selection under an active pointer capture.

   This bug has appeared twice in this repository, in two components, for the
   same reason. Panning needs `setPointerCapture` on the container; an active
   capture retargets the subsequent pointerup — and therefore the synthesised
   click — to the capture element. A `click` listener bound to a marker is then
   never called, and the detail panel stops responding on every market at once.

   src/home/marketGlobe.js documents it in a long comment and solves it by
   recording what was pressed on pointerdown. The grid map lost that lesson when
   it gained pan and zoom, and every selectable layer went dead.

   A DOM test would need a browser, so this is a structural guard instead: it
   asserts that no selectable is wired through `click` alone. That is the mistake
   a fifth layer would make, and it is exactly what happened.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const source = readFileSync(
  fileURLToPath(new URL('../src/components/geographicGridMap.js', import.meta.url)), 'utf8');

test('no selectable is wired through a click listener alone', () => {
  /* `bindSelectable` registers the node for the pointerup path AND attaches the
     ordinary click listener the overview map still relies on. Calling
     addEventListener('click', … setSelected …) directly gets only the second,
     which is dead under capture. */
  const direct = [...source.matchAll(/addEventListener\(\s*'click'[^)]*setSelected\(/g)];
  assert.deepEqual(direct.map(m => m[0]), [],
    'wire selectables through bindSelectable() so they survive pointer capture');
});

test('every selection path the map draws goes through bindSelectable', () => {
  // Zones, zone labels, routes and asset markers — the four selectable layers.
  const bound = [...source.matchAll(/bindSelectable\(/g)].length;
  assert.ok(bound >= 4, `only ${bound} selectable layer(s) registered; the map draws four`);
});

test('what was pressed is recorded before the capture is taken', () => {
  /* Order matters and is easy to get wrong: after setPointerCapture the original
     target is gone from the events that follow, so reading it afterwards yields
     the <svg> every time. */
  const pressedAt = source.indexOf('pressed = selectableAt(event.target)');
  const captureAt = source.indexOf('svg.setPointerCapture(event.pointerId)');
  assert.ok(pressedAt > 0, 'the pressed selectable must be recorded on pointerdown');
  assert.ok(captureAt > 0, 'the map must capture the pointer to pan');
  assert.ok(pressedAt < captureAt, 'record the press BEFORE taking the capture');
});

test('a press that panned the map does not also select', () => {
  // Otherwise every drag ending over a marker would open it.
  assert.match(source, /if\s*\(target\s*&&\s*!moved\)\s*setSelected\(target\)/,
    'selection on pointerup must be conditional on the pointer not having moved');
});

test('a cancelled pointer selects nothing', () => {
  /* pointercancel fires when a system gesture takes over. The gesture did not
     finish, so it is not a selection. */
  const cancel = source.match(/addEventListener\('pointercancel',\s*(\w+)\)/);
  assert.ok(cancel, 'pointercancel must be handled');
  assert.equal(cancel[1], 'endDrag', 'pointercancel must not run the selecting handler');
});

test('the overview map takes no pointer handlers at all', () => {
  /* It is a small orientation map with no pan or zoom, so its clicks are
     ordinary and must stay that way. */
  assert.match(source, /const interactive = !data\.compact;/);
  assert.match(source, /if \(interactive\)\{/,
    'pan/zoom wiring must be gated so the compact map keeps plain click behaviour');
});
