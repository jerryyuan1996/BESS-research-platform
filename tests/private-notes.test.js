/* ---------------------------------------------------------------------------
   THE PRIVATE OVERLAY.

   "Public verdicts, private notes" is a promise about what reaches a reader:
   the grade and its basis publish, the analyst's reason does not. These tests
   hold the half of that promise the code can keep — absence is the normal
   case, a note can never be an input to a score, and no tracked file carries a
   note. The other half is the build: the notes file is git-ignored and the
   local-data plugin leaves its stub untouched on `vite build`.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { NOTES_KEY, validateNotes, gradeNote, verdictNote } from '../src/local/notes.js';
import { createViewStore } from '../scripts/view/writer.mjs';
import { BASIS } from '../src/governance/investability.js';

const sample = {
  fi: {
    grades: { revenueCertainty: { reason: ['A private reason.', '一条不公开的理由。'] } },
    verdicts: { infraFund: { note: ['A private note.', '一条不公开的备注。'] } },
  },
};

test('under plain Node, as in a build, there are no notes', () => {
  assert.equal(gradeNote('fi', 'revenueCertainty'), null);
  assert.equal(verdictNote('fi', 'infraFund'), null);
});

test('a note is found by market and by dimension or archetype, and absence is null', () => {
  assert.deepEqual(gradeNote('fi', 'revenueCertainty', sample), ['A private reason.', '一条不公开的理由。']);
  assert.deepEqual(verdictNote('fi', 'infraFund', sample), ['A private note.', '一条不公开的备注。']);
  assert.equal(gradeNote('fi', 'saturation', sample), null);
  assert.equal(gradeNote('wa', 'revenueCertainty', sample), null);
  assert.equal(verdictNote('fi', 'developer', sample), null);
  assert.equal(gradeNote('fi', 'revenueCertainty', null), null);
});

test('a malformed notes file fails loudly instead of rendering nothing', () => {
  assert.deepEqual(validateNotes(sample), []);
  const bad = (notes, pattern) => assert.ok(validateNotes(notes).some(p => pattern.test(p)), JSON.stringify(notes));
  bad({ fi: { grades: { vibes: { reason: ['a', '甲'] } } } }, /unknown dimension/);
  bad({ fi: { grades: { saturation: { reason: 'English only' } } } }, /reason must be/);
  bad({ fi: { verdicts: { tourist: { note: ['a', '甲'] } } } }, /unknown archetype/);
  bad({ fi: { verdicts: { developer: {} } } }, /note must be/);
  bad({ fi: { grade: 4 } }, /not a section of the notes/);
  assert.deepEqual(validateNotes([]), ['notes must be an object keyed by market']);
  assert.throws(() => gradeNote('fi', 'saturation', { fi: { grades: { saturation: {} } } }), /is malformed/);
});

test('a note carries words and nothing a score could read', () => {
  /* The overlay explains a grade; it must never be able to change one. Its
     schema has no grade, no metric and no number, so there is nothing for the
     arithmetic to pick up even by accident. */
  const numeric = { fi: { grades: { saturation: { reason: ['a', '甲'], grade: 5, metric: { perMW: 1 } } } } };
  assert.deepEqual(validateNotes(numeric), [], 'extra keys are tolerated, and ignored');
  assert.deepEqual(gradeNote('fi', 'saturation', numeric), ['a', '甲']);
});

test('the notes file is git-ignored and no public practitioner grade carries its reason', async () => {
  const ignore = await readFile(new URL('../.gitignore', import.meta.url), 'utf8');
  assert.match(ignore, /^local-data\/\*$/m, `local-data/${NOTES_KEY}.json must stay out of the repository`);

  /* The public half of the same cell: where the basis is practitioner, the
     view store holds the grade and no reason. If a reason appears there it has
     been published, whatever the overlay says. */
  for (const view of await createViewStore().readAll()){
    for (const [id, record] of Object.entries(view.grades)){
      if (record.basis === BASIS.PRACTITIONER){
        assert.ok(!record.reason, `${view.marketId}/${id}: a practitioner grade carries a public reason — it belongs in the private overlay`);
      }
    }
  }
});
