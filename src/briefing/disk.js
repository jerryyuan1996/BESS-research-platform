/* ---------------------------------------------------------------------------
   THE BRIEFING'S INPUTS, READ FROM DISK — Node only.

   The build plugin, the weekly digest and the tests all build the briefing
   from the same files through this one function, so a page and the digest are
   computed from the same bytes:

     view/markets/*.json, view/changelog.jsonl         the view store
     public/data/public/<dataset>.summary.json         prices, news and FX
     src/markets/registry.js, src/entry/ledgerRegistry the engine's inputs

   FX follows the page's own rule: the committed ECB summary when it is
   current, the approved seed when it is not (comparison/fx.js).

   `overlay` applies changes in memory and writes nothing: the digest uses it to
   show what a drafted batch would make the briefing say before it is applied.

   Never reads local-data/. A private figure has no path in here.
   --------------------------------------------------------------------------- */

import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { markets } from '../markets/registry.js';
import { ledgerFor } from '../entry/ledgerRegistry.js';
import { DATASETS } from '../governance/datasets.js';
import { setObservedFxSummary, clearObservedFx } from '../comparison/fx.js';
import { writePath } from '../../view/schema/view.mjs';
import { buildBriefing } from './model.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(HERE, '..', '..');

async function readJson(file){
  return JSON.parse(await readFile(file, 'utf8'));
}

/** Every input the model takes, from the repository at `root`. */
export async function readBriefingInputs(root = REPO_ROOT, { watch = () => {} } = {}){
  const viewDir = path.join(root, 'view', 'markets');
  const views = [];
  for (const name of (await readdir(viewDir)).filter(f => f.endsWith('.json')).sort()){
    watch(path.join(viewDir, name));
    views.push(await readJson(path.join(viewDir, name)));
  }
  const changelogFile = path.join(root, 'view', 'changelog.jsonl');
  watch(changelogFile);
  const changelog = existsSync(changelogFile)
    ? (await readFile(changelogFile, 'utf8')).split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line))
    : [];

  const summaries = {};
  for (const dataset of DATASETS){
    const file = path.join(root, 'public', 'data', 'public', `${dataset.id}.summary.json`);
    if (!existsSync(file)) continue;
    watch(file);
    summaries[dataset.id] = await readJson(file);
  }
  /* The headlines themselves are in the snapshot; the summary only counts them. */
  const newsFile = path.join(root, 'public', 'data', 'public', 'industry-news.json');
  const news = existsSync(newsFile) ? (watch(newsFile), await readJson(newsFile)) : null;
  const reviews = [];
  const reviewsDir = path.join(root, 'docs', 'strategy-reviews');
  if (existsSync(reviewsDir)) {
    for (const entry of (await readdir(reviewsDir, { withFileTypes: true })).filter(e => e.isDirectory() && /^review-[a-z0-9-]+$/.test(e.name)).sort((a,b) => a.name.localeCompare(b.name))) {
      const file = path.join(reviewsDir, entry.name, 'review.json');
      if (existsSync(file)) { watch(file); reviews.push(await readJson(file)); }
    }
  }
  return { views, changelog, summaries, news, reviews };
}

/**
 * The briefing, built from disk.
 *
 * @param options.now      a Date; the build's own clock by default
 * @param options.overlay  changes to apply in memory first: [{ market, path, to }]
 */
export async function briefingFromDisk({ root = REPO_ROOT, now = new Date(), overlay = [], watch } = {}){
  const inputs = await readBriefingInputs(root, { watch });
  const views = new Map(inputs.views.map(v => [v.marketId, v]));
  for (const change of overlay){
    const view = views.get(change.market);
    if (view) views.set(change.market, writePath(view, change.path, change.to));
  }
  if (inputs.summaries['fx-ecb']) setObservedFxSummary(inputs.summaries['fx-ecb'], now.getTime());
  else clearObservedFx();
  try {
    return buildBriefing({
      markets, views: [...views.values()], changelog: inputs.changelog, ledgerFor,
      summaries: inputs.summaries, news: inputs.news, reviews: inputs.reviews, catalogue: DATASETS, now,
    });
  } finally {
    clearObservedFx();
  }
}
