/* ---------------------------------------------------------------------------
   SECTION SPECS ARE SECTIONS, NOT CARDS.

   All ten Finland section specifications were written in the CARD shape —
   `{ t:'card', title, badges, blocks }` — where the shared renderer requires
   the SECTION shape, `{ head, blocks }`. renderSection reads `spec.head` and
   `spec.blocks` and never looks at `t`, `title` or `badges`, so for that whole
   market no heading, no `.sect` wrapper and no badges ever reached the page.

   NOTHING FAILED. The specs were valid objects, every test passed, the build
   passed, and the page rendered its blocks in a plausible order. The defect was
   only visible by opening the market in a browser and noticing that a heading
   which should have been there was not.

   It also silently swallowed a section claim: placeSectionClaim anchors on the
   `.sect` wrapper and its heading, so with no wrapper it found nothing and
   returned. A claim can be registered, validated and correctly gated and still
   never appear.

   ---------------------------------------------------------------------------
   WHAT IS ASSERTED, AND WHY IT IS NOT "EVERY SECTION HAS A HEAD"

   Four markets deliberately give `home` no heading and lead with cards, so a
   blanket head requirement would be wrong. The real invariant is narrower and
   exact: a section spec must never carry card fields at its top level, because
   the renderer cannot see them. That catches the defect precisely without
   forbidding a legitimate headless overview.

   Finland is additionally pinned at ten sections with ten headings, because
   that is the market the bug was found in.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Build one market's sections against its REAL data and sources.
 *
 * The `api` a market destructures is wide and mostly rendering helpers. Rather
 * than stub each one and skip whatever a thin stub cannot satisfy — an earlier
 * version of this test did that and inspected four sections out of eleven — the
 * unknown members resolve to a permissive function so every section builds.
 * M and SRC are the market's own modules, not fixtures.
 */
const ANY = new Proxy(function (){}, {
  get(t, k){
    if (k === Symbol.toPrimitive || k === 'toString') return () => '';
    if (k === Symbol.iterator) return function* (){};
    if (k === 'length') return 0;
    return ANY;
  },
  apply(){ return ANY; },
});

async function sectionsFor(dir){
  const mod = await import(`../src/markets/${dir}/sections.js`);
  const { M } = await import(`../src/markets/${dir}/data.js`);
  const { SRC } = await import(`../src/markets/${dir}/sources.js`);
  const api = new Proxy(
    { L: a => (Array.isArray(a) ? a[0] : a), M, SRC, fmtN: String, fmt: String },
    { get: (t, k) => (k in t ? t[k] : ANY) },
  );
  /* A market that fetches its sections on demand (the NEM, since the P1 pilot)
     builds nothing until they arrive, and says how to get them. Every other
     market has no such export and is built from the one file, as before. */
  if (typeof mod.loadAllSections === 'function') await mod.loadAllSections(api);
  const built = mod.buildSections(api);
  return typeof built === 'function' ? built() : built;
}

const MARKET_DIRS = readdirSync(path.join(REPO, 'src/markets'), { withFileTypes: true })
  .filter(d => d.isDirectory() && existsSync(path.join(REPO, 'src/markets', d.name, 'sections.js')))
  .map(d => d.name);

test('no section spec is written in the card shape', async () => {
  const misShaped = [];
  let inspected = 0;
  const perMarket = {};

  for (const dir of MARKET_DIRS){
    const S = await sectionsFor(dir);
    let n = 0;
    for (const id of Object.keys(S || {})){
      let spec;
      try { spec = S[id]; } catch { continue; }
      n++; inspected++;
      /* The exact defect: fields the renderer cannot see, at the level where it
         would look for section fields. */
      for (const field of ['t', 'title', 'badges', 'live']){
        if (spec && spec[field] !== undefined)
          misShaped.push(`${dir}/${id} carries "${field}" at section level — renderSection ` +
                         'reads head/blocks and will silently drop it');
      }
    }
    perMarket[dir] = n;
  }

  assert.deepEqual(misShaped, []);

  /* The guard that makes the above mean something. The first version of this
     test built sections with a stub too thin to satisfy them, inspected ZERO
     sections, and passed. */
  assert.ok(inspected >= 100,
    `only ${inspected} sections were inspected across ${MARKET_DIRS.length} markets — ` +
    'the harness has gone blind, not the codebase clean');
  /* Per-market too, not just in total — one market falling silent must not be
     hidden by eleven others. Ireland's `home` reads a live-data shape the stub
     does not reproduce and is the single section that still declines to build. */
  for (const [dir, n] of Object.entries(perMarket))
    assert.ok(n >= 10, `${dir} built only ${n} sections; every market in this lineage has ten or more`);
});

test('Finland builds twelve sections and every one of them has a heading', async () => {
  /* Pinned, because this is the market the defect was found in and the one
     whose repair is a visible change to the page. */
  const S = await sectionsFor('fi');
  const ids = Object.keys(S);
  /* Ten until the investment-view revision added Investment Case and Entry.
     Since plan phase 5 these twelve SECTIONS sit in seven tabs; the sections
     themselves, and their ids, are what they were. See tests/tab-groups.test.js. */
  assert.equal(ids.length, 12, 'Finland has the standard ten tabs plus Investment Case and Entry');

  const headless = ids.filter(id => !S[id]?.head);
  assert.deepEqual(headless, [], 'every Finland section must render a heading');

  /* And the heading is a bilingual pair, not a bare string that would print
     English into a Chinese page. */
  for (const id of ids){
    const head = S[id].head;
    assert.ok(Array.isArray(head) && head.length === 2 && head[0] && head[1],
      `fi/${id} head must be an [en, zh] pair`);
  }
});

test('the .sect wrapper and its heading come from spec.head alone', async () => {
  /* Why `head` is the thing worth asserting above: it is the only input that
     produces the wrapper a claim attaches to. Held against the source, because
     there is no DOM in this suite — the rendered result is verified in the
     browser, and this keeps the link from drifting. */
  const engine = readFileSync(path.join(REPO, 'src/markets/_shared/engine.js'), 'utf8');
  assert.match(engine, /if \(spec\.head\) sectionHead\(main, spec\.head, spec\.cap\)/,
    'renderSection must build the section head from spec.head');

  const header = readFileSync(path.join(REPO, 'src/components/sectionHeader.js'), 'utf8');
  assert.match(header, /['"]sect['"]/, 'sectionHead is what creates the .sect wrapper');

  const enhancements = readFileSync(path.join(REPO, 'src/components/pageEnhancements.js'), 'utf8');
  assert.match(enhancements, /querySelector\('\.sect'\)/,
    'placeSectionClaim anchors on .sect, which is why a headless section swallows a claim');
});
