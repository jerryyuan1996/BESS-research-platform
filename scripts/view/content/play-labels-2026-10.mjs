/* ---------------------------------------------------------------------------
   Play labels name the design only, signed off by the analyst on 2026-10-29
   (option C of the operating-play review).

   A label used to end with a stage: "Long-term auction award · 9h · operating,
   awarded". The stage is the play's own `stage` field, and another investor's
   row can enter the same design earlier, so the label said "operating" on rows
   priced as a new build. Each label now keeps its route, hours and any
   qualifier; every surface adds the stage it means (playTitle in
   src/governance/plays.js). The stage field, ids and asOf dates are unchanged.

     node scripts/view/content/play-labels-2026-10.mjs --check | --apply
   --------------------------------------------------------------------------- */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createViewStore } from '../writer.mjs';

const analyst = { kind: 'analyst' };
const reason = [
  'Ruled by the analyst on 2026-10-29: a play\'s label names its design; the stage is added where the label is shown, so a row never reads "operating" when it enters earlier.',
  '分析师于2026-10-29裁定：方案名称只写设计；进入阶段在显示处补充，避免较早进入的行显示为“在运”。',
];

/* Route · hours, plus a qualifier where the old stage segment carried one. */
const KEEP = {
  'it-ltda-6h': [' · awarded', ' · 已中标'],
  'ro-mer-2h': [' · with an optimiser floor', ' · 附优化商保底'],
};
/* Only a last segment that names a stage is replaced, so a second run changes nothing. */
const STAGE = /greenfield|ready-to-build|operating|co-investment|绿地开发|具备开工条件|在运资产|已投运|跟投/i;
const designOf = (id, label) => label.map((text, i) => {
  const parts = text.split(' · ');
  if (parts.length < 3 || !STAGE.test(parts.at(-1))) return text;
  return parts.slice(0, -1).join(' · ') + (KEEP[id]?.[i] ?? '');
});

export async function playLabelChanges(store){
  const changes = [];
  for (const view of await store.readAll()){
    const market = view.marketId;
    for (const play of Object.values(view.plays || {})){
      const label = designOf(play.id, play.label);
      if (label[0] === play.label[0] && label[1] === play.label[1]) continue;
      changes.push({ market, path: `plays.${play.id}`, author: analyst, reason, to: { ...play, label } });
    }
  }
  return changes;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)){
  const store = createViewStore();
  const changes = await playLabelChanges(store);
  for (const c of changes) console.log(`${c.path}: ${c.to.label[0]} | ${c.to.label[1]}`);
  if (process.argv[2] === '--apply'){
    const done = await store.applyBatch(changes, new Date());
    console.log(`Applied ${done.length} changes. See view/changelog.jsonl.`);
  } else {
    const prepared = await store.prepareBatch(changes, new Date());
    console.log(`${prepared.length} changes pass the writer's gate. Nothing was written.`);
  }
}
