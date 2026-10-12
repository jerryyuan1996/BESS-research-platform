/* ---------------------------------------------------------------------------
   THE WEEKLY DIGEST — what the machines changed, in one message.

   A rule or an agent changes the view live, and nothing on the page marks the
   change: the changelog is the record. That is the analyst's decision, and its
   cost is that a change can go unseen until he happens to scroll past it. This
   is the answer to that cost (plan §7.6, guardrail H): once a month, every
   machine-written line of the last thirty-one days, with what moved, why, on what
   evidence, and the one command that undoes it.

   It reads the changelog and prints. It writes nothing and changes nothing.
   An empty month prints nothing at all, so the workflow can stay silent.

   Run:  node scripts/view/digest.mjs            the last thirty-one days
         node scripts/view/digest.mjs --days 30
   --------------------------------------------------------------------------- */
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { MACHINE_AUTHORS } from '../../view/schema/view.mjs';
import { DIGEST_DAYS } from '../../src/governance/automation.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CHANGELOG = path.resolve(HERE, '..', '..', 'view', 'changelog.jsonl');

const brief = (value) => {
  if (value === null || value === undefined) return 'nothing';
  if (typeof value !== 'object' || Array.isArray(value)) return JSON.stringify(value);
  if ('call' in value) return `"${value.call}"`;
  if ('grade' in value) return `grade ${value.grade}, ${value.trend}`;
  return 'a record';
};

/** The machine-written entries inside the window, oldest first. */
export function machineChanges(entries, now, days = DIGEST_DAYS){
  const since = new Date(now.getTime() - days * 86_400_000).toISOString();
  const reverted = new Set(entries.map(e => e.reverts).filter(Boolean));
  return entries
    .filter(e => MACHINE_AUTHORS.includes(e.author?.kind) && e.at >= since && e.at <= now.toISOString())
    .map(e => ({ ...e, wasReverted: reverted.has(e.id) }));
}

/** The digest as markdown, or an empty string when no machine wrote anything. */
export function renderDigest(entries, now, days = DIGEST_DAYS){
  const changes = machineChanges(entries, now, days);
  if (!changes.length) return '';
  const lines = [
    `# Machine changes to the view — ${days} days to ${now.toISOString().slice(0, 10)}`, '',
    `${changes.length} change${changes.length === 1 ? '' : 's'} written by a rule or an agent. Nothing on the page marks them; this is the record.`, '',
  ];
  for (const e of changes){
    const who = e.author.kind === 'rule' ? `rule \`${e.author.rule}\`` : `agent (${e.author.model}, prompt ${e.author.prompt})`;
    lines.push(`## ${e.market} · ${e.path}${e.wasReverted ? ' — since reverted' : ''}`, '',
      `- **When** ${e.at}`, `- **Who** ${who}`,
      `- **Change** ${brief(e.from)} → ${brief(e.to)}`,
      `- **Why** ${e.reason[0]}`);
    for (const ev of e.evidence){
      lines.push(`- **Evidence** ${ev.publisher}, ${ev.url}${ev.field ? ` — \`${ev.field}\` read ${ev.observed}, line ${ev.op ?? ''} ${ev.threshold}` : ''}${ev.quote ? ` — “${ev.quote}”` : ''}`);
    }
    if (!e.wasReverted) lines.push(`- **Undo** \`node scripts/view/writer.mjs revert ${e.id}\``);
    lines.push('');
  }
  return lines.join('\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href){
  const i = process.argv.indexOf('--days');
  const days = i > 0 ? Number(process.argv[i + 1]) : DIGEST_DAYS;
  const entries = existsSync(CHANGELOG)
    ? (await readFile(CHANGELOG, 'utf8')).split('\n').filter(Boolean).map(line => JSON.parse(line))
    : [];
  process.stdout.write(renderDigest(entries, new Date(), Number.isFinite(days) && days > 0 ? days : DIGEST_DAYS));
}
