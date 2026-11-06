/* Per-value locators load only after the reader opens a source disclosure. */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';

let provenance;
const SHOT_PATHS = {
  'nem-02': /^history\./,
  'nem-03': /^qed\.fcas|^teaching\./,
  'nem-04': /^cisa\.|^tenders\./,
  'nem-05': /^qed\.(daily|evening|timeOfDay|vintage)/,
  'nem-06': /^qed\.(quarters|nemDischarge|wemDischarge|priceSetting|nemSpread|wemSpread|vintage)/,
  'nem-07': /^qed\.regional/,
  'nem-08': /^teaching\./,
  'nem-09': /^cisa\./,
  'nem-11': /^register\./,
  'nem-12': /^tenders\.tender-10|^history\.H-NEM-06/,
};

export function attachEvidence(dialog) {
  const attached = new WeakSet();
  const attach = () => {
    for (const article of dialog.querySelectorAll('[data-shot]')) {
      const details = article.querySelector('.ix-story-sources'), rule = SHOT_PATHS[article.getAttribute('data-shot')];
      if (!details || !rule || attached.has(details)) continue;
      attached.add(details);
      details.addEventListener('toggle', async () => {
        if (!details.open || details.querySelector('.nem-provenance')) return;
        provenance ||= import('../data/storyEvidenceProvenance.js');
        const { NEM_STORY_PROVENANCE: records } = await provenance;
        if (!details.isConnected) return;
        details.append(h('div', { class: 'nem-provenance' }, h('h5', {}, L(['Value locators and arithmetic', '逐值出处与计算'])),
          h('dl', {}, Object.entries(records).filter(([path]) => rule.test(path)).flatMap(([path, p]) => [
            h('dt', {}, path), h('dd', {}, p.sourceRef, ' · ', p.locator, ' · ', p.unit, ' · ', p.vintage, ' · ', p.arithmetic, ' · ', p.rights),
          ]))));
      });
    }
  };
  attach();
  dialog.addEventListener('click', attach);
}
