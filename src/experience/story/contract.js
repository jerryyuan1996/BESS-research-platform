/* ---------------------------------------------------------------------------
   The market-story content contract (immersive-experience plan, WP-02).

   A story is plain data: six chapters of shots, every reader-facing string an
   [en, zh] pair, and every figure a {token} that resolves from a field the
   market page already reads. This module validates that data and resolves its
   tokens. It draws nothing and computes no model result.

   Rules it enforces (docs/immersive-experience-plan/evidence-and-content-
   specification.md §5):
     - chapters are the six shared ids, in order; shot ids are unique;
     - every string has both languages;
     - every {token} is declared by the story's bindings;
     - page copy carries no typed figure outside a token, except years and
       values tagged Example;
     - one marker per shot, with a "what would change it" line;
     - every claim a shot cites is registered, with its sources;
     - `reviewedAgainst` matches the live play, or the story is flagged.
   --------------------------------------------------------------------------- */

export const STORY_SCHEMA_VERSION = 1;

export const CHAPTERS = ['origins', 'choices', 'tensions', 'battery', 'payment', 'investment'];

export const MARKERS = {
  strong: ['Strong evidence', '证据充分'],
  fair: ['Fair evidence', '证据尚可'],
  thin: ['Thin evidence', '证据单薄'],
};

const TOKEN = /\{([a-zA-Z][a-zA-Z0-9]*)\}/g;

/** The {tokens} a string uses. */
export function tokensIn(text){
  return [...String(text).matchAll(TOKEN)].map(m => m[1]);
}

const isPair = (v) => Array.isArray(v) && v.length === 2
  && v.every(s => typeof s === 'string' && s.trim().length > 0);

/* Visit every [en, zh] pair inside a nested structure (timeline nodes,
   hotspots, factor cards). A two-string array is a pair; anything else nests. */
function walkPairs(node, where, visit){
  if (node === undefined || node === null) return;
  if (Array.isArray(node) && node.length === 2 && node.every(s => typeof s === 'string')){ visit(where, node); return; }
  if (Array.isArray(node)) node.forEach((n, i) => walkPairs(n, `${where}[${i}]`, visit));
  else if (typeof node === 'object') for (const [k, v] of Object.entries(node)) walkPairs(v, `${where}.${k}`, visit);
}

/* Fields of a shot that are page copy, where a typed figure is forbidden. */
const COPY_FIELDS = ['question', 'copy', 'meaning'];
/* Fields where a figure is allowed only on a value tagged Example. */
const LIST_FIELDS = ['controls', 'labels'];

const YEAR = /\b(19|20)\d{2}(-\d{2})?\b|(19|20)\d{2}年|\d{1,2}\s?(January|February|March|April|May|June|July|August|September|October|November|December)|\d{1,2}月\d{1,2}日/g;
const EXAMPLE = /Example|示例/;

/** Digits left in a string once tokens and dates are removed. */
function strayFigures(text){
  return String(text).replace(TOKEN, '').replace(YEAR, '').match(/\d/g) || [];
}

/**
 * Validate a story. Returns { ok, complete, problems }.
 * `complete` is false when a chapter is declared unavailable or has no shots:
 * an incomplete draft can validate, but it cannot be published.
 */
export function validateStory(story){
  const problems = [];
  const at = (where, msg) => problems.push(`${where}: ${msg}`);

  if (story?.storySchemaVersion !== STORY_SCHEMA_VERSION) at('story', `storySchemaVersion must be ${STORY_SCHEMA_VERSION}`);
  if (typeof story?.marketId !== 'string') at('story', 'marketId is required');
  if (typeof story?.playRef !== 'string') at('story', 'playRef is required');
  const ra = story?.reviewedAgainst;
  if (!ra || typeof ra.playRef !== 'string' || typeof ra.hours !== 'number' || typeof ra.call !== 'string' || typeof ra.on !== 'string'){
    at('story', 'reviewedAgainst needs playRef, hours, call and on');
  }
  if (JSON.stringify(story?.supportedLocales) !== JSON.stringify(['en', 'zh'])) at('story', "supportedLocales must be ['en', 'zh']");

  const declared = new Set(story?.tokens || []);
  const claims = story?.claims || {};
  const sources = story?.sources || {};
  for (const [id, claim] of Object.entries(claims)){
    for (const s of claim.sources || []) if (!sources[s]) at(`claim ${id}`, `unknown source ${s}`);
    if (!(claim.sources || []).length) at(`claim ${id}`, 'cites no source');
  }

  const checkString = (where, value, { copy = false, list = false } = {}) => {
    if (!isPair(value)){ at(where, 'must be an [en, zh] pair with both strings'); return; }
    value.forEach((text, i) => {
      for (const t of tokensIn(text)) if (!declared.has(t)) at(where, `unresolved token {${t}}`);
      const stray = strayFigures(text);
      if (stray.length && (copy || (list && !EXAMPLE.test(text)))) at(where, `typed figure in ${i ? 'zh' : 'en'}: "${text}"`);
    });
    const [en, zh] = value.map(tokensIn);
    if (JSON.stringify([...en].sort()) !== JSON.stringify([...zh].sort())) at(where, 'en and zh use different tokens');
  };

  const chapters = story?.chapters || [];
  if (JSON.stringify(chapters.map(c => c.id)) !== JSON.stringify(CHAPTERS)) at('story', `chapters must be ${CHAPTERS.join(', ')} in order`);

  let complete = true;
  const ids = new Set();
  const shots = [...(story?.opening ? [story.opening] : []), ...chapters.flatMap(c => c.shots || [])];
  for (const chapter of chapters){
    checkString(`chapter ${chapter.id}`, chapter.title);
    if (chapter.unavailable || !(chapter.shots || []).length) complete = false;
    for (const shot of chapter.shots || []) if (shot.chapter !== chapter.id) at(`shot ${shot.id}`, `sits in ${chapter.id} but says ${shot.chapter}`);
  }
  if (!story?.opening) complete = false;

  for (const shot of shots){
    const where = `shot ${shot.id}`;
    if (!/^[a-z]{2,}(-[a-z]+)?-\d\d$/.test(shot.id || '')) at(where, 'id must look like wa-06');
    if (ids.has(shot.id)) at(where, 'duplicate id');
    ids.add(shot.id);
    checkString(`${where} question`, shot.question, { copy: true });
    checkString(`${where} copy`, shot.copy, { copy: true });
    if (shot.meaning !== null) checkString(`${where} meaning`, shot.meaning, { copy: true });
    if (!shot.marker || !(shot.marker.level in MARKERS || shot.marker.level === 'play')) at(where, 'needs one marker: strong, fair, thin or play');
    else if (shot.marker.level !== 'play') checkString(`${where} marker`, shot.marker.change, { copy: true });
    for (const field of LIST_FIELDS){
      (shot[field] || []).forEach((pair, i) => checkString(`${where} ${field}[${i}]`, pair, { list: true }));
    }
    walkPairs(shot.extra, `${where} extra`, checkString);
    if (shot.caption) checkString(`${where} caption`, shot.caption);
    for (const c of shot.claims || []) if (!claims[c]) at(where, `unknown claim ${c}`);
  }

  return { ok: problems.length === 0, complete: complete && problems.length === 0, problems };
}

/**
 * Has the play moved since the story was signed off? Compares the live row's
 * play and call with `reviewedAgainst`. A stale story still renders; it shows
 * the date it was last reviewed, until the user signs it off again.
 */
export function isStale(story, row){
  const ra = story.reviewedAgainst;
  return !row?.play || row.play.id !== ra.playRef || row.play.hours !== ra.hours || row.call !== ra.call;
}

/**
 * Fill a string's {tokens}. `values` maps a token to a string or an [en, zh]
 * pair; `lang` picks the side. A token with no value renders as an em dash, so
 * a missing field never shows as a typed number or as "undefined".
 */
export function fillTokens(text, values, lang = 'en'){
  return String(text).replace(TOKEN, (_, t) => {
    const v = values[t];
    if (v === undefined || v === null || v === '') return '—';
    return Array.isArray(v) ? v[lang === 'zh' ? 1 : 0] : String(v);
  });
}

/** A pair with its tokens filled, for L(). */
export function fillPair(pair, values){
  return [fillTokens(pair[0], values, 'en'), fillTokens(pair[1], values, 'zh')];
}
