/* ---------------------------------------------------------------------------
   The outcome of `ercot-january-2027-mora`, the trigger added under ruling 5A
   (docs/open-calls-plan-2026-10-31.md) to give ERCOT's fund call its next event.

   ERCOT posted the January 2027 MORA on its 6 November 2026 schedule, as
   MORA_January_2027.pdf (PDF created 4 November). This records what the report
   says about winter adequacy and battery availability, and closes the trigger.
   The trigger has no effect, so nothing else moves: no grade, call, play, toll
   assumption or model figure. The outcome quotes the report's own observed
   figures; it types no model return.

   Drafted for the analyst's sign-off; the analyst applies it by merging.

     node scripts/view/content/ercot-mora-2026-11.mjs --check | --apply
   --------------------------------------------------------------------------- */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createViewStore } from '../writer.mjs';

const analyst = { kind: 'analyst' };
const ID = 'ercot-january-2027-mora';
const PUBLISHED = '2026-11-06';
const REPORT = 'https://www.ercot.com/files/docs/2026/11/06/MORA_January_2027.pdf';

export async function moraChanges(store){
  const view = await store.read('ercot');
  const trigger = (view.triggers || []).find(t => t.id === ID);
  if (!trigger) throw new Error(`${ID} is not in view/markets/ercot.json`);
  if (trigger.outcome) throw new Error(`${ID} already has an outcome`);

  return [{
    market: 'ercot', path: `triggers.${ID}`, author: analyst,
    reason: [
      `The January 2027 MORA was published on ${PUBLISHED}; it shows low winter risk and more storage, and is not toll-price evidence, so the call is unchanged.`,
      `2027年1月资源充裕度月报已于${PUBLISHED}发布：冬季风险低、储能继续增加，且不构成租赁价格依据，因此投资判断不变。`,
    ],
    to: {
      ...trigger,
      source: { publisher: 'ERCOT', url: REPORT, access: 'opened' },
      outcome: {
        on: PUBLISHED,
        text: [
          'ERCOT published the January 2027 MORA on schedule. Winter risk is low: the riskiest hour is the morning, 8 a.m., at a 3.20% chance of an Energy Emergency Alert against ERCOT\'s 10% threshold, and evening hours stay near 1%. Storage keeps arriving: 21,528 MW installed, 807 MW more than in the December report, with 12,525 MW expected available at the riskiest hour; low wind is the main risk. A new battery sub-model slightly lowers the estimated risk. Nothing here prices a toll, so the call is unchanged.',
          'ERCOT按时发布2027年1月资源充裕度月报。冬季风险低：风险最高的时段在早上8点，触发电力紧急警报的概率为3.20%，低于ERCOT的10%门槛；晚间时段约为1%。储能继续增加：装机21,528MW，比12月月报多807MW，风险最高时段预计可用12,525MW；主要风险来自低风电出力。新增的电池子模型使估算风险略有下降。报告不涉及租赁定价，因此投资判断不变。',
        ],
      },
    },
  }];
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)){
  const store = createViewStore();
  const changes = await moraChanges(store);
  if (process.argv[2] === '--apply'){
    const done = await store.applyBatch(changes, new Date());
    console.log(`Applied ${done.length} change. See view/changelog.jsonl.`);
  } else {
    const prepared = await store.prepareBatch(changes, new Date());
    console.log(`${prepared.length} change passes the writer's gate. Nothing was written.`);
  }
}
