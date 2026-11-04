/* ---------------------------------------------------------------------------
   BOUNDED CONCURRENCY FOR THE ETL.

   Sequential was the right default while a run was one request and a handful of
   datasets. It is the wrong one now: twenty-two datasets share a run, and the
   P0-1 baseline measured five of them at 78% of the wall time while the other
   seventeen waited — including fourteen that skipped before making a request.

   `Promise.all` over the catalogue is not the answer either. It is unbounded by
   construction, and a scheduled job that opens nineteen sockets at a public
   regulator is how an IP gets blocked at three in the morning.

   So: a small pool with two limits.

     global        how many datasets may be in flight at once. Default 3.
     per provider  how many of one connector's datasets may be in flight.
                   Default 1, because a provider is the unit a rate limit is
                   expressed in.

   Per-provider defaults stay 1 unless the connector documents otherwise.
   Two entries are not defaults and are explained where they are declared:
   `jepx` may run its three areas at once, and `fingrid` is pinned at one and
   cannot be raised from the environment.

   Determinism does not come from completion order. Results come back in task
   order and the caller writes them in catalogue order, so a fast dataset
   finishing first changes nothing about what is published or reported. The pool
   reports the highest number of tasks it ever held in flight, which is the
   number a reader needs to tell "concurrency is configured" from "concurrency
   is working".
   --------------------------------------------------------------------------- */

/** Datasets in flight by default. Above about four, the sources are the limit. */
export const DEFAULT_GLOBAL_LIMIT = 3;

/** A ceiling on the environment override, so a typo cannot become a flood. */
export const MAX_GLOBAL_LIMIT = 8;

/** Per-provider allowance, where a connector documents one. */
export const PROVIDER_LIMITS = {
  /* JEPX publishes each area as a static CSV per fiscal year: no key, no
     published rate limit, and the same two files are read by all three area
     datasets. Three concurrent readers of one web server is not a load
     increase; it is the same six requests overlapping instead of queueing. */
  jepx: 3,
};

/**
 * Providers whose limit is a property of the source, not a preference.
 *
 * Fingrid's starter key allows about one request every two seconds and answers
 * 429 beyond it; the connector spaces its own requests with a module-level
 * clock (`lastRequestAt` in etl/sources/fingrid.mjs), which two concurrent
 * datasets would race. Raising this from the environment would therefore
 * produce 429s and a corrupted spacing clock, so the environment cannot.
 */
export const PINNED_PROVIDER_LIMITS = {
  fingrid: 1,
};

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

function positiveInt(raw, fallback){
  if (raw === undefined || raw === null || String(raw).trim() === '') return fallback;
  const n = Number(String(raw).trim());
  if (!Number.isInteger(n) || n < 1) return fallback;
  return n;
}

/**
 * The effective concurrency for one provider.
 *
 * @param {string} provider      connector id, e.g. 'jepx'
 * @param {object} [overrides]   parsed ETL_PROVIDER_CONCURRENCY values
 */
export function providerLimit(provider, overrides = {}){
  if (PINNED_PROVIDER_LIMITS[provider]) return PINNED_PROVIDER_LIMITS[provider];
  const configured = overrides[provider] ?? PROVIDER_LIMITS[provider] ?? 1;
  return clamp(configured, 1, MAX_GLOBAL_LIMIT);
}

/**
 * Read the run's concurrency configuration from the environment.
 *
 *   ETL_CONCURRENCY=3                 datasets in flight, 1–8
 *   ETL_PROVIDER_CONCURRENCY=jepx=2   per-provider overrides, comma-separated
 *
 * Invalid values fall back to the default and produce a warning rather than
 * throwing: a scheduled run with a typo in a repository variable should still
 * fetch the day's data, conservatively, and say what it ignored.
 *
 * @param {object} [env]
 * @param {object} [opts]
 * @param {string[]} [opts.knownProviders]  connector ids in this run's catalogue
 * @returns {{global:number, providers:object, warnings:string[]}}
 */
export function readConcurrencyConfig(env = process.env, { knownProviders = null } = {}){
  const warnings = [];

  const rawGlobal = env.ETL_CONCURRENCY;
  let global = positiveInt(rawGlobal, DEFAULT_GLOBAL_LIMIT);
  if (rawGlobal !== undefined && String(rawGlobal).trim() !== '' && global === DEFAULT_GLOBAL_LIMIT){
    const n = Number(String(rawGlobal).trim());
    if (!Number.isInteger(n) || n < 1){
      warnings.push(`ETL_CONCURRENCY="${rawGlobal}" is not a positive integer — using ${DEFAULT_GLOBAL_LIMIT}`);
    }
  }
  if (global > MAX_GLOBAL_LIMIT){
    warnings.push(`ETL_CONCURRENCY=${global} exceeds the ${MAX_GLOBAL_LIMIT} ceiling — using ${MAX_GLOBAL_LIMIT}`);
    global = MAX_GLOBAL_LIMIT;
  }

  const providers = {};
  const rawProviders = env.ETL_PROVIDER_CONCURRENCY;
  if (rawProviders && String(rawProviders).trim() !== ''){
    for (const entry of String(rawProviders).split(',')){
      const [name, value, ...rest] = entry.split('=').map(s => s.trim());
      if (!name) continue;
      if (rest.length > 0 || value === undefined || value === ''){
        warnings.push(`ETL_PROVIDER_CONCURRENCY entry "${entry.trim()}" is not name=limit — ignored`);
        continue;
      }
      const limit = positiveInt(value, null);
      if (limit === null){
        warnings.push(`ETL_PROVIDER_CONCURRENCY entry "${entry.trim()}" has no positive limit — ignored`);
        continue;
      }
      if (knownProviders && !knownProviders.includes(name)){
        warnings.push(`ETL_PROVIDER_CONCURRENCY names unknown connector "${name}" — ignored`);
        continue;
      }
      if (PINNED_PROVIDER_LIMITS[name]){
        warnings.push(
          `ETL_PROVIDER_CONCURRENCY cannot change "${name}": its limit of ` +
          `${PINNED_PROVIDER_LIMITS[name]} is set by the provider's rate limit — ignored`);
        continue;
      }
      providers[name] = clamp(limit, 1, MAX_GLOBAL_LIMIT);
    }
  }

  return { global, providers, warnings };
}

/**
 * Run tasks with a global limit and a per-provider limit.
 *
 * A provider whose allowance is used up does not block the queue: the scheduler
 * skips it and starts the next task whose provider has capacity, which is the
 * whole point of a pool over a batched `Promise.all`.
 *
 * A task that throws is recorded as `{ok:false, error}` and does not stop the
 * others. The pool itself never rejects: the caller decides what a failed
 * dataset means, and in this pipeline it means "keep yesterday's snapshot".
 *
 * @param {Array<{provider:string, run:()=>Promise<any>}>} tasks
 * @param {object} [opts]
 * @param {number} [opts.global]
 * @param {object} [opts.providers]  per-provider overrides
 * @returns {Promise<{results:Array<{ok:boolean,value?:any,error?:Error}>, maxObserved:number}>}
 */
export async function runWithConcurrency(tasks, { global = DEFAULT_GLOBAL_LIMIT, providers = {} } = {}){
  if (!Array.isArray(tasks)) throw new TypeError('runWithConcurrency: tasks must be an array');
  if (tasks.length === 0) return { results: [], maxObserved: 0 };

  const limit = clamp(positiveInt(global, DEFAULT_GLOBAL_LIMIT), 1, MAX_GLOBAL_LIMIT);
  const results = new Array(tasks.length);
  const started = new Array(tasks.length).fill(false);
  const activeByProvider = new Map();

  let running = 0;
  let settled = 0;
  let maxObserved = 0;

  return new Promise((resolve) => {
    const finish = (index, outcome) => {
      const provider = tasks[index].provider;
      running -= 1;
      settled += 1;
      activeByProvider.set(provider, (activeByProvider.get(provider) ?? 1) - 1);
      results[index] = outcome;

      if (settled === tasks.length) resolve({ results, maxObserved });
      else pump();
    };

    /* Re-scan from the front on every start and every completion. Twenty-two
       tasks make the extra scan irrelevant, and a queue that is re-read in
       order is much easier to prove fair than a rotating one. */
    function pump(){
      for (let i = 0; i < tasks.length; i += 1){
        if (running >= limit) return;
        if (started[i]) continue;

        const { provider } = tasks[i];
        const cap = providerLimit(provider, providers);
        if ((activeByProvider.get(provider) ?? 0) >= cap) continue;

        started[i] = true;
        running += 1;
        activeByProvider.set(provider, (activeByProvider.get(provider) ?? 0) + 1);
        if (running > maxObserved) maxObserved = running;

        Promise.resolve()
          .then(() => tasks[i].run())
          .then(
            value => finish(i, { ok: true, value }),
            error => finish(i, { ok: false, error: error instanceof Error ? error : new Error(String(error)) }),
          );
      }
    }

    pump();
  });
}
