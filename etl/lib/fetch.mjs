/* ---------------------------------------------------------------------------
   HTTP for connectors.

   Timeouts, bounded retries with backoff, a truthful user agent, and a hard
   response-size cap. Connectors call these and do not reach for global fetch —
   an unbounded fetch in a scheduled job is how a hung endpoint turns into a
   six-hour CI bill.

   Retries are only for transport faults and 5xx/429. A 4xx is a bug in the
   request or an expired credential and retrying it just makes the same mistake
   three times more slowly.
   --------------------------------------------------------------------------- */

const USER_AGENT =
  'bess-research-platform/1.0 (+https://github.com/; scheduled public-data ETL; contact via repository)';

const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_RETRIES = 3;
const MAX_BYTES = 64 * 1024 * 1024;   // 64 MB — WEM annual CSVs are the big case

const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);

export class FetchError extends Error {
  constructor(message, { status = null, url = null, retryable = false } = {}){
    super(message);
    this.name = 'FetchError';
    this.status = status;
    this.url = url;
    this.retryable = retryable;
  }
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/**
 * Fetch with timeout and retry. Returns the Response on success.
 *
 * @param {string} url
 * @param {object} [opts]
 * @param {number} [opts.timeoutMs]
 * @param {number} [opts.retries]
 * @param {object} [opts.headers]
 * @param {AbortSignal} [opts.signal]  optional caller lifetime, including body reads
 * @param {'follow'|'error'|'manual'} [opts.redirect] optional source restriction
 * @param {(msg:string)=>void} [opts.log]
 */
export async function httpGet(url, opts = {}){
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    retries = DEFAULT_RETRIES,
    headers = {},
    log = () => {},
    /* Some public query APIs only accept POST — Overpass rejects a long query
       string in a URL. Kept optional so every existing caller is unchanged, and
       routed through here rather than through a raw fetch so a POST still gets
       the timeout, the backoff and the truthful user agent. */
    method = 'GET',
    body = undefined,
  } = opts;

  let lastError = null;

  for (let attempt = 1; attempt <= retries; attempt++){
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        // Optional caller lifetime can outlive the header timeout, so a
        // connector can also bound reading a stalled response body. Existing
        // callers without a signal retain exactly their current behaviour.
        signal: opts.signal ? AbortSignal.any([controller.signal, opts.signal]) : controller.signal,
        redirect: opts.redirect ?? 'follow',
        method,
        body,
        headers: { 'user-agent': USER_AGENT, accept: '*/*', ...headers },
      });

      if (res.ok) return res;

      const retryable = RETRYABLE_STATUS.has(res.status);
      lastError = new FetchError(
        `HTTP ${res.status} ${res.statusText}`, { status: res.status, url, retryable });

      if (!retryable) throw lastError;

    } catch (err){
      if (err instanceof FetchError && !err.retryable) throw err;
      lastError = err instanceof FetchError ? err : new FetchError(
        err?.name === 'AbortError' ? `timed out after ${timeoutMs}ms` : String(err?.message || err),
        { url, retryable: true });
    } finally {
      clearTimeout(timer);
    }

    if (attempt < retries){
      const backoff = Math.min(1000 * 2 ** (attempt - 1), 8000);
      log(`  retry ${attempt}/${retries - 1} in ${backoff}ms — ${lastError.message}`);
      await sleep(backoff);
    }
  }

  throw lastError ?? new FetchError('request failed', { url });
}

/** Fetch and read as text, enforcing the size cap. */
export async function httpGetText(url, opts = {}){
  const res = await httpGet(url, opts);
  const declared = Number(res.headers.get('content-length') || 0);
  if (declared > MAX_BYTES){
    throw new FetchError(`response too large: ${declared} bytes`, { url });
  }
  const text = await res.text();
  if (text.length > MAX_BYTES){
    throw new FetchError(`response too large after read: ${text.length} bytes`, { url });
  }
  return text;
}

/** Fetch and parse as JSON, with a useful message when the body is not JSON. */
export async function httpGetJson(url, opts = {}){
  const text = await httpGetText(url, opts);
  try {
    return JSON.parse(text);
  } catch {
    throw new FetchError(
      `expected JSON but got ${text.slice(0, 120).replace(/\s+/g, ' ')}…`, { url });
  }
}

/**
 * Read a required secret from the environment.
 *
 * Returns null rather than throwing when absent. A missing credential must
 * degrade to "this dataset was not refreshed this run" and leave the previous
 * snapshot in place — never to a published snapshot with an empty series, which
 * would read as "the price went to zero".
 */
export function secret(name){
  const v = process.env[name];
  return (typeof v === 'string' && v.trim() !== '') ? v.trim() : null;
}
