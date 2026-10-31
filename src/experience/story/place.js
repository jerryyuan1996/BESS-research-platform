/* ---------------------------------------------------------------------------
   Where the reader is in a story, and the address that says so
   (immersive-experience plan, WP-04).

   /markets/western-australia?view=story&chapter=tensions&shot=wa-06

   Moving to a chapter or shot adds a history entry, so Back and Forward step
   through the reader's own path; scrolling only updates the current entry.
   Teaching controls never come here. Other query parameters (?region=,
   ?story=preview) are kept as they are. The address carries no part of the
   investment case: the story reads the case from the market page.
   --------------------------------------------------------------------------- */
import { STORY_PARAMS } from '../../app/router.js';

/** Every shot in reading order, the opening first. */
export const shotsOf = (story) => [story.opening, ...story.chapters.flatMap(c => c.shots)];

/** The chapter id a shot sits in ('opening' for the opening). */
export const chapterOf = (shot) => (shot.chapter === 'opening' ? 'opening' : shot.chapter);

/**
 * The shot to show for a place from the address. A known shot wins; an
 * unknown shot falls back to its chapter's first shot; anything else opens
 * at the start.
 */
export function resolvePlace(story, place){
  const shots = shotsOf(story);
  const byShot = shots.find(s => s.id === place?.shot);
  if (byShot) return byShot.id;
  if (place?.chapter === 'opening') return story.opening.id;
  const chapter = story.chapters.find(c => c.id === place?.chapter);
  return chapter?.shots[0]?.id || story.opening.id;
}

/** The query string with the story's place set, or removed when `place` is null. */
export function placeSearch(search, place){
  const params = new URLSearchParams(search);
  for (const k of STORY_PARAMS) params.delete(k);
  if (place){
    params.set('view', 'story');
    params.set('chapter', place.chapter);
    params.set('shot', place.shot);
  }
  const text = params.toString();
  return text ? `?${text}` : '';
}

/** The place of a shot id in a story. */
export function placeOf(story, id){
  const shot = shotsOf(story).find(s => s.id === id);
  return shot ? { chapter: chapterOf(shot), shot: shot.id } : null;
}

/**
 * Writes the place into the address: 'push' adds a history entry, 'replace'
 * updates the current one. Nothing is written when the address already says
 * it. The router is not told, so the page behind is not re-rendered.
 */
export function recordPlace(place, how = 'push'){
  if (typeof window === 'undefined' || !window.history) return;
  const { pathname, search, hash } = window.location;
  const next = placeSearch(search, place);
  if (next === search || (next === '' && search === '')) return;
  const url = `${pathname}${next}${hash}`;
  if (how === 'replace') window.history.replaceState(window.history.state, '', url);
  else window.history.pushState({}, '', url);
}

/** fn(route, { samePage }) when Back or Forward moves; returns a stop function. */
export { onStoryPlace as onPlaceChange } from '../../app/router.js';
