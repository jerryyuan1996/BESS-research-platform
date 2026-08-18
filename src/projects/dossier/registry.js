/* ---------------------------------------------------------------------------
   THE DOSSIER REGISTRY — project files, one interface, absent by default.

   A dossier is the deal-level document: what the project is, where it connects,
   how it was underwritten. Every one of them is confidential in its entirety —
   not merely in its numbers — so none live in this repository. They are read
   from local-data/dossiers/ by the dev server and are structurally absent from
   any build. See src/local/dossiers.js and docs/data-policy.md.

   WHAT THIS FILE IS FOR. The public shell needs to ask three questions without
   ever holding a dossier: does this market have any, what are they called, and
   does this slug resolve. In a production build the answers are none, nothing
   and no — and the shell is built so that those answers render a complete page
   rather than a broken one.

   SHAPE VALIDATION HAPPENS HERE, on load, because a dossier is authored outside
   the repository and nothing in CI can see it. A malformed one is dropped with a
   console warning rather than crashing a page: the confidential layer is
   additive, and a bad file in it must not take down the public site.
   --------------------------------------------------------------------------- */
import { DOSSIERS, AVAILABLE } from '../../local/dossiers.js';

/* The tabs a dossier may declare. Fixed, for the same reason market tabs are:
   two dossiers that name their sections differently cannot be read side by side,
   and a reader moving between deals should not have to relearn the furniture. */
export const DOSSIER_TABS = [
  ['overview',    ['Overview', '总览']],
  ['grid',        ['Grid and siting', '电网与选址']],
  ['pathway',     ['Build pathway', '建设路径']],
  ['transaction', ['Transaction', '交易结构']],
  ['model',       ['Model', '财务模型']],
  ['evidence',    ['Evidence', '证据来源']],
];

const TAB_IDS = new Set(DOSSIER_TABS.map(([id]) => id));

const isPair = (v) => Array.isArray(v) && v.length >= 2 && typeof v[0] === 'string';

/**
 * Problems with one dossier. Empty array means usable.
 *
 * Deliberately minimal. This validates the SHAPE the shell depends on and
 * nothing about the content, because the content is exactly what this repository
 * must not know anything about.
 */
export function validateDossier(d){
  const problems = [];
  if (!d || typeof d !== 'object') return ['not an object'];
  if (typeof d.slug !== 'string' || !/^[a-z0-9-]+$/.test(d.slug)){
    problems.push('slug must be lower-case letters, digits and hyphens — it is a URL segment');
  }
  if (!isPair(d.name)) problems.push('name must be an [en, zh] pair');
  if (typeof d.marketId !== 'string' || !d.marketId) problems.push('marketId must name a registered market');
  if (!d.sections || typeof d.sections !== 'object') problems.push('sections must be an object keyed by tab id');
  else {
    for (const key of Object.keys(d.sections)){
      if (!TAB_IDS.has(key)) problems.push(`unknown section "${key}" — see DOSSIER_TABS`);
    }
    if (!d.sections.overview) problems.push('a dossier must have an overview section');
  }
  return problems;
}

/* Built once at module load. Invalid entries are dropped rather than thrown,
   and the warning names the slug so it can be found in local-data/. */
const BY_SLUG = new Map();

for (const d of DOSSIERS || []){
  const problems = validateDossier(d);
  if (problems.length){
    console.warn('[dossier] %o dropped: %s', d?.slug ?? '(no slug)', problems.join('; '));
    continue;
  }
  if (BY_SLUG.has(d.slug)){
    console.warn('[dossier] duplicate slug %o — the later one is ignored', d.slug);
    continue;
  }
  BY_SLUG.set(d.slug, d);
}

/** True when any dossier is present. Always false in a build. */
export const hasDossiers = () => BY_SLUG.size > 0 && AVAILABLE;

/** Every dossier, in slug order. Empty in a build. */
export const allDossiers = () => [...BY_SLUG.values()].sort((a, b) => a.slug.localeCompare(b.slug));

/**
 * One dossier by slug, or null.
 *
 * Null is the answer for an unknown slug AND for every slug in production. The
 * caller renders a 404 either way — deliberately, because a "withheld" page that
 * appeared only for real slugs would confirm which codenames exist to anyone who
 * guessed one. See docs/data-policy.md.
 */
export const dossierBySlug = (slug) => BY_SLUG.get(slug) || null;

/** Dossiers belonging to one market. Empty in a build. */
export const dossiersForMarket = (marketId) =>
  allDossiers().filter(d => d.marketId === marketId);

/** Route path for a dossier. */
export const dossierPath = (d) => '/projects/' + d.slug;

/** Test seam. Never called by the application. */
export function __resetDossiers(){
  BY_SLUG.clear();
}
