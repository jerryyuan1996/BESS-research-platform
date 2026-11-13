import { researchUnits } from './researchUnits.js';

const MANUAL_SCORES = new Set(['scorecard', 'aug']);
const OMIT_BADGES = new Set(['illus', 'verify']);
const english = pair => Array.isArray(pair) ? pair[0] : pair;
const SCORE_REFERENCE = /duration[- ]need index|duration (?:economics )?scorecard|augmentation[- ](?:readiness|scorecard)|时长需求指数|增容准备度|增容[评记]分卡/i;
const scoreReference = value => SCORE_REFERENCE.test(typeof value === 'string' ? value : JSON.stringify(value));
export { scoreReference as isManualScoreReference };
const needsScore = block => Boolean(block && (MANUAL_SCORES.has(block.t)
  || [...(block.blocks || []), ...(block.cards || [])].some(needsScore)));

/** Reader presentation only. Keep the research inputs and calculations intact.
 * Remove whole scoring cards, including their explanation and trailing blocks,
 * plus explicitly identified dependent summaries. Do not turn assumed numbers
 * into observations: the original source drawers and methodology remain. */
export function conciseResearchSpec(spec, { scoreKpis = [], scoreRows = [] } = {}) {
  if (!spec?.blocks) return spec;
  const removed = new Set(researchUnits(spec).units.filter(unit => unit.blocks.some(needsScore)).flatMap(unit => unit.blocks));
  const badges = values => (values || []).filter(value => !OMIT_BADGES.has(value));
  const cleanBlocks = blocks => blocks.map(block => clean(block)).filter(Boolean);
  function clean(block, card = false) {
    if (!block || removed.has(block) || MANUAL_SCORES.has(block.t)
      || ((card || block.t === 'card') && needsScore(block))) return null;
    const next = { ...block };
    // Repeated publication/basis badges do not belong in the reading layer.
    delete next.live;
    if (block.badges) next.badges = badges(block.badges);
    if (block.blocks) next.blocks = cleanBlocks(block.blocks);
    if (block.cards) {
      next.cards = block.cards.map(member => clean(member, true)).filter(Boolean);
      if (!next.cards.length) return null;
    }
    if (block.t === 'kpis') next.items = block.items
      .filter(item => !scoreReference(item.l) && !scoreKpis.includes(english(item.l)))
      .map(item => ({ ...item, ...(item.b ? { b: badges(item.b) } : {}) }));
    if (block.t === 'table') next.rows = block.rows.filter(row => !scoreReference(row[0]) && !scoreRows.includes(english(row[0]?.b || row[0])));
    if (block.t === 'gloss') next.items = block.items.filter(item => !scoreReference(item));
    // A useful decision may end with a pointer to a removed scoring card.
    // Drop that sentence, preserving the economic argument before it.
    if (block.text && scoreReference(block.text)) {
      const strip = text => text.split(/(?<=[。！？])|(?<=[.!?])\s+/u)
        .filter(sentence => !scoreReference(sentence)).join(/[。！？]/u.test(text) ? '' : ' ');
      next.text = Array.isArray(block.text) ? block.text.map(strip) : strip(block.text);
    }
    if (block.t === 'badges') next.items = badges(block.items)
      .filter(item => typeof item === 'string'); // omit the old inline feed/build-state chips
    return next;
  }
  return { ...spec, blocks: cleanBlocks(spec.blocks) };
}

/** Keep section loading and per-language evaluation lazy in every reader. */
export function conciseResearchSections(buildSections, options) {
  return api => {
    const sections = buildSections(api);
    return () => {
      const raw = sections(), shown = {};
      for (const id of Object.keys(raw)) Object.defineProperty(shown, id, {
        enumerable: true, get: () => conciseResearchSpec(raw[id], options),
      });
      return shown;
    };
  };
}

/** Custom chart/grid renderers can create their own badges outside block specs.
 * Apply the same reading rule after every paint, including interactive redraws. */
export function finishConciseResearch(root) {
  for (const note of root.querySelectorAll('.meta-illus,.badge.verify,.badge.etl,.badge.seed')) note.remove();
  for (const card of root.querySelectorAll('.card')) {
    if (scoreReference(card.querySelector(':scope > h3')?.textContent || '')) card.remove();
  }
  for (const item of root.querySelectorAll('.kpi,.gloss-row')) {
    if (scoreReference(item.querySelector('.lbl')?.textContent || item.textContent)) item.remove();
  }
  for (const row of root.querySelectorAll('tr')) if (scoreReference(row.cells[0]?.textContent || '')) row.remove();
  for (const note of root.querySelectorAll('.why,.trig')) if (scoreReference(note.textContent)) note.remove();
}
