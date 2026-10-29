/* A play's label names its design: route, hours and any qualifier ("awarded",
   "with an optimiser floor"). It carries no stage, because the stage depends
   on who is reading. The play's own call enters at `play.stage`; another
   investor's row may enter the same design earlier. Each surface adds the
   stage it means with playTitle.

   No imports, on purpose: pages that show a label import this, not plays.js,
   so the play validator and its vocabulary stay out of the first view. */
export const STAGE_WORD = {
  'greenfield':     ['greenfield', '绿地开发'],
  'ready-to-build': ['ready-to-build', '具备开工条件'],
  'operating':      ['operating', '在运资产'],
  'co-invest':      ['co-investment', '跟投'],
};

/** "Long-term auction award · 9h · operating": the label plus the stage meant. */
export function playTitle(play, stage = play.stage){
  const word = STAGE_WORD[stage];
  return word ? [`${play.label[0]} · ${word[0]}`, `${play.label[1]} · ${word[1]}`] : play.label;
}
