/* ---------------------------------------------------------------------------
   The build-time / runtime boundary.

   `exceljs` was added so three of the best project registers on the platform —
   Marktstammdatenregister, EIA-860M and AEMO Generation Information — could be
   read at all. They publish Excel and nothing else.

   It is a devDependency and it must stay one. A spreadsheet parser in the
   browser bundle would be several hundred kilobytes shipped to every visitor to
   support a job that runs on a developer's machine once a month. The application
   reads the JSON the ETL produces and never the workbook it came from.

   This test is what makes that a rule rather than an intention. It fails the
   moment anything under src/ reaches for the parser, directly or through the
   adapter, which is a mistake that would otherwise only show up as a bundle
   that quietly grew.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'));

/** Every .js/.mjs file under a directory. */
function sourceFiles(dir){
  const out = [];
  const walk = (path) => {
    for (const entry of readdirSync(path, { withFileTypes: true })){
      const full = resolve(path, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(js|mjs)$/.test(entry.name)) out.push(full);
    }
  };
  walk(resolve(ROOT, dir));
  return out;
}

test('the spreadsheet parser is a build-time dependency, not a runtime one', () => {
  assert.ok(pkg.devDependencies?.exceljs, 'exceljs must be a devDependency');
  assert.ok(!pkg.dependencies?.exceljs, 'exceljs must not be a runtime dependency');
});

test('nothing the browser loads imports a spreadsheet parser', () => {
  for (const file of sourceFiles('src')){
    const text = readFileSync(file, 'utf8');
    const relative = file.slice(ROOT.length);
    assert.ok(!/from\s+['"]exceljs['"]/.test(text),
      `${relative}: imports exceljs — it must stay in the ETL`);
    assert.ok(!/etl\/lib\/workbook/.test(text),
      `${relative}: imports the workbook adapter — the app reads the ETL's JSON, not its inputs`);
  }
});

test('the workbook adapter is only reachable from the data pipeline', () => {
  /* The adapter itself may import the parser; nothing else may. Keeping the
     import in one file is what makes swapping the library a one-file change. */
  const importers = [...sourceFiles('etl'), ...sourceFiles('scripts')]
    .filter(file => /from\s+['"]exceljs['"]/.test(readFileSync(file, 'utf8')))
    // Windows separators and a possible trailing slash on ROOT both normalised.
    .map(file => file.slice(ROOT.length).replace(/\\/g, '/').replace(/^\//, ''));

  assert.deepEqual(importers, ['etl/lib/workbook.mjs'],
    'exceljs must be imported in exactly one place');
});

test('the ETL does not import the browser application', () => {
  /* One direction only. The ETL reads governance and schema modules — which are
     plain data and validators — but must never pull in a renderer, or a
     scheduled job starts needing a DOM. */
  for (const file of sourceFiles('etl')){
    const text = readFileSync(file, 'utf8');
    const relative = file.slice(ROOT.length).replace(/\\/g, '/');
    assert.ok(!/from\s+['"][^'"]*src\/components\//.test(text),
      `${relative}: imports a component`);
    assert.ok(!/from\s+['"][^'"]*src\/charts\//.test(text),
      `${relative}: imports a chart`);
  }
});

test('workbook fixtures stay small enough to live in the repo', () => {
  /* Fixtures are committed so the transforms are testable without a download.
     A real EIA release is ~10 MB and does not belong here; a shaped sample is
     a few kilobytes and does. */
  for (const file of readdirSync(resolve(ROOT, 'tests/fixtures/workbooks'))){
    const bytes = statSync(resolve(ROOT, 'tests/fixtures/workbooks', file)).size;
    assert.ok(bytes < 200 * 1024,
      `${file}: ${(bytes / 1024).toFixed(0)} kB — shape a smaller sample, do not commit a release`);
  }
});
