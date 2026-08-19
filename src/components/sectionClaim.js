/* ---------------------------------------------------------------------------
   THE SECTION CLAIM, ON THE PAGE.

   One sentence saying what a section argues, placed directly under its heading
   and above the first figure, so a reader meets the argument before the
   evidence rather than after it.

   ---------------------------------------------------------------------------
   WHAT IS RENDERED, AND WHY IN THIS ORDER

   claim → caveat → basis and evidence.

   The caveat sits immediately under the claim, inside the same block, because
   the two are one statement. Moving a limitation into a methodology panel three
   screens away is how "the benchmark price is not project revenue" stops being
   read. For `rcm` that caveat is the difference between a benchmark and a
   payment; for `grid` it is the whole reason the sentence stops where it does.

   Basis and evidence come last and are visually subordinate. They matter to a
   reader checking the claim, not to one reading it.

   ---------------------------------------------------------------------------
   ONLY SUPPORTED CLAIMS RENDER

   An incomplete section renders NOTHING — not an empty container, not a
   placeholder, not a hidden draft. A drafted-but-unpublished sentence must not
   reach the DOM at all, because "hidden" is a rendering decision and the
   requirement is that the reader cannot obtain it: not by view-source, not by
   export, not through a screen reader. `sectionClaim` returns null and the
   caller appends nothing.

   `data` and `portfolio` get no treatment whatever. Their absence is a decision,
   not a gap, and a "no claim" notice would turn a decision into a hole.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { READINESS, evidenceRecords } from '../governance/claims.js';

const BASIS_LABEL = {
  measured: ['Measured', '实测'],
  forecast: ['Forecast', '预测'],
  policy:   ['Administered rule', '行政规则'],
  modelled: ['Modelled', '模型推算'],
};

/**
 * Build the claim block for one section, or null.
 *
 * @param {object} claim   a claim from a market claims module
 * @param {object} market  the registry entry, for resolving evidence records
 * @returns {HTMLElement|null}
 */
export function sectionClaim(claim, market){
  /* The gate. Anything not published returns null and reaches no surface. */
  if (!claim || claim.readiness !== READINESS.SUPPORTED) return null;
  if (!Array.isArray(claim.text) || !claim.text[0]) return null;

  const records = evidenceRecords(market);

  const root = h('section', {
    class: 'claim',
    'data-basis': claim.basis || '',
    /* Named so a screen reader announces what this region is before reading a
       sentence that would otherwise sound like body copy. */
    'aria-label': L(['Section claim', '分节结论']),
  });

  root.append(h('p', { class: 'claim-text' }, L(claim.text)));

  /* Immediately attached, inside the same block, never relocated. */
  if (Array.isArray(claim.caveat) && claim.caveat[0]){
    root.append(h('p', { class: 'claim-caveat' }, L(claim.caveat)));
  }

  const meta = h('p', { class: 'claim-meta' });
  if (BASIS_LABEL[claim.basis]){
    meta.append(h('span', { class: 'claim-basis' },
      L(['Basis: ', '依据类型：']) + L(BASIS_LABEL[claim.basis])));
  }

  const cited = (claim.evidence || []).filter(id => records[id]);
  if (cited.length){
    meta.append(h('span', { class: 'claim-evidence-label' },
      L(['Evidence: ', '证据：'])));
    cited.forEach((id, k) => {
      const rec = records[id];
      if (k) meta.append(document.createTextNode(' · '));
      /* Resolves to the record itself. A link with no href would be a claim
         that cannot be checked, which is worse than no link. */
      const label = rec.file || id;
      meta.append(rec.url
        ? h('a', {
            class: 'claim-evidence', href: rec.url,
            target: '_blank', rel: 'noopener noreferrer',
            title: label,
          }, label)
        : h('span', { class: 'claim-evidence claim-evidence-nolink', title: label }, label));
    });
  }
  if (meta.childNodes.length) root.append(meta);

  if (claim.attribution){
    root.append(h('p', { class: 'claim-attribution' },
      L(['Attributed to: ', '出处：']) + claim.attribution));
  }

  return root;
}
