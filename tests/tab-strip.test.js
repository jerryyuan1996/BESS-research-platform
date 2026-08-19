/* ---------------------------------------------------------------------------
   THE OVERFLOW HINT, INCLUDING THE TRANSITIONS.

   Below the --bp-md step the tab strip scrolls instead of wrapping, and fades
   whichever edge has more tabs beyond it. Getting the steady states right is
   easy; the bugs were in the transitions.

   A resize observer watches the border box, and the border box is not what
   decides the hint. The strip is full width, so narrowing the window resizes it
   and the observer fires — but the hint depends on scrollWidth, which changes
   when the media query flips flex-wrap, not when the box resizes. Those
   coincide often enough to look correct and not always: an already-mounted
   desktop page narrowed to mobile left strips scrollable with no hint at all.

   So the two cases tested here are narrowing a mounted strip until it overflows
   and widening it again until it does not — a rotation is exactly this — plus
   the scroll positions in between.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { overflowHint } from '../src/components/navigation.js';

test('a strip that fits has no hint', () => {
  assert.equal(overflowHint(320, 320, 0), null);
  /* One pixel of slack is rounding, not content. */
  assert.equal(overflowHint(321, 320, 0), null);
});

test('narrowing a mounted strip raises the hint', () => {
  /* The failing case. Wide first: everything fits, no hint. */
  assert.equal(overflowHint(800, 900, 0), null);
  /* Then the viewport narrows and flex-wrap flips: the same tabs now overflow,
     and the strip is at the start, so the tabs beyond it are on the right. */
  assert.equal(overflowHint(1330, 335, 0), 'right');
});

test('widening again clears a stale hint', () => {
  /* The other half, and the one a steady-state test would miss entirely: a
     strip that was scrolled and then widened must not keep advertising an edge
     that no longer has anything past it. */
  assert.equal(overflowHint(1330, 335, 333), 'both');
  assert.equal(overflowHint(1330, 1400, 0), null);
  /* Even if a stale scrollLeft survives the widen, the absence of slack wins. */
  assert.equal(overflowHint(1330, 1400, 333), null);
});

test('the hint names the side that actually has more', () => {
  const scrollWidth = 1330, clientWidth = 335;
  const maxScroll = scrollWidth - clientWidth;
  assert.equal(overflowHint(scrollWidth, clientWidth, 0), 'right',
    'at the start, everything hidden is to the right');
  assert.equal(overflowHint(scrollWidth, clientWidth, maxScroll), 'left',
    'at the end, everything hidden is to the left');
  assert.equal(overflowHint(scrollWidth, clientWidth, maxScroll / 2), 'both',
    'in the middle, both');
});

test('the ends are reached within a pixel', () => {
  /* Fractional scroll positions are normal after a flick or on a zoomed page;
     a strip one subpixel from the end must not claim there is more. */
  const scrollWidth = 1000, clientWidth = 400, maxScroll = 600;
  assert.equal(overflowHint(scrollWidth, clientWidth, 0.4), 'right');
  assert.equal(overflowHint(scrollWidth, clientWidth, maxScroll - 0.4), 'left');
});
