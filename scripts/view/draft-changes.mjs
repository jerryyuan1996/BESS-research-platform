/* ---------------------------------------------------------------------------
   THE ANALYST'S ANSWERS TO A GRADING SHEET, AS A CHANGE FILE.

   scripts/view/draft-sheet.mjs lays a draft out; the analyst answers it. This
   turns the answer into the file `scripts/view/writer.mjs apply` takes, and
   does nothing else: it writes no view and has no path to the store.

     node scripts/view/draft-changes.mjs <market-id> <answers.json> <out.json>

   The answers file is what the analyst said, and only that:

     { "answeredOn": "2026-10-12",
       "grades": { "assetReturn": "accept", "debtAvailability": 5, … } }

   THREE RULES, so that nothing reaches the store he did not decide:

     - "accept" writes the drafted record exactly as the sheet showed it;
     - a number on a dimension with no draft is a practitioner grade: no
       evidence and no public reason, because none was offered;
     - a number that differs from a draft is refused here. The drafted reason
       argued for the drafted grade, and a record whose grade and reason
       disagree is the half-edit the store exists to prevent. The reason is
       rewritten with him first.

   Every dimension must be answered, or the market waits.
   --------------------------------------------------------------------------- */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { DIMENSION_IDS, validateGrade } from '../../src/governance/investability.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const [id, answersFile, outFile] = process.argv.slice(2);
if (!id || !answersFile || !outFile){
  console.error('usage: node scripts/view/draft-changes.mjs <market-id> <answers.json> <out.json>');
  process.exit(2);
}

const draft = JSON.parse(await readFile(path.join(ROOT, 'docs', 'grading', `${id}.draft.json`), 'utf8'));
const answers = JSON.parse(await readFile(answersFile, 'utf8'));
const day = answers.answeredOn;

const problems = [];
const changes = [];
for (const dimension of DIMENSION_IDS){
  const answer = answers.grades?.[dimension];
  const drafted = draft.drafted[dimension];
  let record, reason;
  if (answer === undefined){ problems.push(`${dimension}: not answered — the market waits`); continue; }
  if (answer === 'accept'){
    if (!drafted){ problems.push(`${dimension}: accepted, and no draft was offered`); continue; }
    record = { ...drafted };
    reason = [`Drafted from sources opened for the grading sheet and accepted by the analyst on ${day}.`,
              `依据为评级表查阅的来源起草，并于${day}经分析师确认。`];
  } else if (Number.isInteger(answer)){
    if (drafted && drafted.grade !== answer){
      problems.push(`${dimension}: the analyst gave ${answer} and the draft argues for ${drafted.grade} — rewrite the reason with him before writing the record`);
      continue;
    }
    if (drafted){ record = { ...drafted }; reason = [`Drafted from sources opened for the grading sheet and accepted by the analyst on ${day}.`, `依据为评级表查阅的来源起草，并于${day}经分析师确认。`]; }
    else {
      record = { dimension, grade: answer, trend: 'stable', basis: 'practitioner', evidence: [] };
      reason = [`Graded by the analyst on ${day} as practitioner judgement; no public source was offered for this dimension.`,
                `${day}由分析师以从业者判断给出评级；该维度未提供公开来源。`];
    }
  } else { problems.push(`${dimension}: the answer must be "accept" or a whole number`); continue; }

  record = { ...record, asOf: day, author: 'analyst', lockedUntil: null };
  problems.push(...validateGrade(record));
  changes.push({ market: id, path: `grades.${dimension}`, author: { kind: 'analyst' }, to: record, reason, evidence: [] });
}

if (problems.length){ console.error(problems.join('\n')); process.exit(1); }
await writeFile(outFile, JSON.stringify(changes, null, 2) + '\n', 'utf8');
console.log(`  ${changes.length} changes for ${id}  →  ${outFile}`);
