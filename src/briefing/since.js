/* ---------------------------------------------------------------------------
   "SINCE YOUR LAST VISIT" — when that was, on this device.

   Two marks are kept in the reader's own browser: when this visit started
   being seen (`at`) and when the visit before it was (`prev`). A load more
   than VISIT_GAP_MINUTES after the last one is a new visit, and the last one
   becomes `prev`; a reload inside the gap keeps the same "since", so reading
   the page does not reset what it says changed.

   A first visit has no `prev` and reads the last FIRST_VISIT_DAYS.

   The marks are per device, by design: there is no account and no server.
   The weekly digest is the one view that is the same on every device.

   Layering: no DOM. The storage is handed in.
   --------------------------------------------------------------------------- */

import { VISIT_GAP_MINUTES, FIRST_VISIT_DAYS } from '../governance/briefing.js';

const DAY = 86_400_000;

/**
 * The marks after this load, and the moment "since your last visit" starts.
 *
 * On a first visit `prev` is set to FIRST_VISIT_DAYS before that first load,
 * so a reload keeps the same window, and `first` says it was a first visit.
 *
 * @param stored  { at, prev, first }: epoch milliseconds, and a flag; any absent
 * @param nowMs   this load
 * @returns { since, at, prev, firstVisit }
 */
export function nextSeen(stored, nowMs){
  const at = Number(stored?.at) || null;
  const prev = Number(stored?.prev) || null;
  if (!at){
    const since = nowMs - FIRST_VISIT_DAYS * DAY;
    return { since, at: nowMs, prev: since, firstVisit: true };
  }
  if (nowMs - at > VISIT_GAP_MINUTES * 60_000) return { since: at, at: nowMs, prev: at, firstVisit: false };
  const since = prev || nowMs - FIRST_VISIT_DAYS * DAY;
  return { since, at: nowMs, prev: since, firstVisit: Boolean(stored?.first) };
}
