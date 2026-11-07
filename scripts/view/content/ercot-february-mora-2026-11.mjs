/* ---------------------------------------------------------------------------
   ERCOT's next public event after the January 2027 MORA, ruled by the analyst
   on 7 November 2026 with the January outcome (scripts/view/content/
   ercot-mora-2026-11.mjs):

     - a new trigger, `ercot-february-2027-mora`, for the report due on the
       first Friday of December, 4 December 2026, on the cadence ERCOT states
       in the January 2027 MORA itself;
     - the fund verdict watches it in place of the resolved January trigger;
     - the play's next action moves to that date. Its second half (an executed
       toll only, tested against the market monitor's 2025 battery revenue)
       is unchanged.

   No grade, call, toll assumption or model figure moves.

     node scripts/view/content/ercot-february-mora-2026-11.mjs --check | --apply
   --------------------------------------------------------------------------- */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createViewStore } from '../writer.mjs';

const analyst = { kind: 'analyst' };
const AS_OF = '2026-11-07';
const ID = 'ercot-february-2027-mora';
const DUE = '2026-12-04';
const SCHEDULE = 'https://www.ercot.com/files/docs/2026/11/06/MORA_January_2027.pdf';
const ruled = (en, zh) => [`Ruled by the analyst on ${AS_OF} with the January 2027 MORA outcome: ${en}`, `分析师于${AS_OF}随2027年1月资源充裕度月报结果裁定：${zh}`];

export async function februaryChanges(store){
  const view = await store.read('ercot');
  if ((view.triggers || []).some(t => t.id === ID)) throw new Error(`${ID} already exists`);
  const fund = view.verdicts?.infraFund;
  const play = view.plays?.['ercot-toll-2h'];
  if (!fund || !play) throw new Error('ercot fund verdict or play ercot-toll-2h is missing');

  return [
    { market: 'ercot', path: `triggers.${ID}`, author: analyst,
      reason: ruled('the January report is recorded, so the next public adequacy event is the February 2027 MORA, due on 4 December.',
        '1月月报已记录，下一项公开的资源充裕度事件为2027年2月月报，预计于12月4日发布。'),
      to: { id: ID, kind: 'event', market: 'ercot',
        label: ['February 2027 MORA: review winter adequacy and battery availability', '2027年2月资源充裕度月报：复核冬季供需与电池可用性'],
        expected: DUE, watches: ['demandGrowth', 'saturation'], direction: 'either',
        source: { publisher: 'ERCOT', url: SCHEDULE, access: 'opened' },
        note: [
          'ERCOT targets each MORA for the first Friday of the month, two months ahead of the reporting month, as the January 2027 MORA states; the first Friday of December 2026 is 4 December. It informs demand and saturation; it is not evidence of a toll price.',
          '据2027年1月资源充裕度月报所述，ERCOT计划于每月第一个星期五发布月报，提前两个月覆盖报告月份；2026年12月的第一个星期五为12月4日。该报告反映需求与饱和程度，但不能作为租赁价格的依据。',
        ],
        effect: null } },

    { market: 'ercot', path: 'verdicts.infraFund', author: analyst,
      reason: ruled('the fund call now watches the February 2027 MORA; the January trigger is resolved.',
        '基金结论改为关注2027年2月月报；1月触发事件已结案。'),
      to: { ...fund, changesIf: [ID], asOf: AS_OF } },

    { market: 'ercot', path: 'plays.ercot-toll-2h', author: analyst,
      reason: ruled('the play\'s next action moves to the February 2027 MORA on 4 December; the toll condition is unchanged.',
        '方案下一项行动改为12月4日的2027年2月月报；租赁条件不变。'),
      to: { ...play, asOf: AS_OF,
        action: {
          text: [
            'Read the February 2027 MORA on 4 December for winter adequacy and battery availability. Engage only with an executed toll: get its price and test it against the market monitor\'s 2025 battery revenue before any bid.',
            '于12月4日阅读2027年2月资源充裕度月报，复核冬季供需与电池可用性。只考虑已签署租赁的项目：出价前取得租赁价格，并与市场监测机构公布的2025年电池收入对比检验。',
          ],
          due: DUE,
        } } },
  ];
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)){
  const store = createViewStore();
  const changes = await februaryChanges(store);
  if (process.argv[2] === '--apply'){
    const done = await store.applyBatch(changes, new Date());
    console.log(`Applied ${done.length} changes. See view/changelog.jsonl.`);
  } else {
    const prepared = await store.prepareBatch(changes, new Date());
    console.log(`${prepared.length} changes pass the writer's gate. Nothing was written.`);
  }
}
