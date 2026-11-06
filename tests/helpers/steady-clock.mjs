/* ---------------------------------------------------------------------------
   A CLOCK THAT NEVER STANDS STILL, FOR SCRATCH VIEW STORES.

   The view writer names each changelog line `${at}-${market}-${path}` and
   refuses a second change to one path in the same millisecond. That refusal is
   right for the real store and is tested on its own. But a test that makes two
   quick changes to one path without passing a time reads `new Date()` twice,
   and on a fast CI runner both reads can land in the same millisecond: the
   test then fails on the guard, not on what it checks. That happened on
   31 Oct and 4 Nov 2026, each time after a data refresh, and turned main red.

   This wraps a store so every call that would have read the wall clock gets a
   strictly later instant instead. A test that passes its own time is untouched,
   and the writer itself is unchanged.
   --------------------------------------------------------------------------- */
export function steadyClock(store){
  let last = 0;
  const tick = () => { last = Math.max(Date.now(), last + 1); return new Date(last); };
  return {
    ...store,
    prepare: (change, now = tick(), ...rest) => store.prepare(change, now, ...rest),
    apply: (change, now = tick()) => store.apply(change, now),
    prepareBatch: (changes, now = tick(), options) => store.prepareBatch(changes, now, options),
    applyBatch: (changes, now = tick(), options) => store.applyBatch(changes, now, options),
    revert: (id, now = tick(), options) => store.revert(id, now, options),
  };
}
