/* One attempt, including the complete body. No redirect, authentication or
   rate-limit retry is hidden in this reader. Callers validate official URLs. */
export async function boundedDownload(url, {
  maxBytes, timeoutMs, signal: outerSignal, headers = {}, fetchImpl = globalThis.fetch,
  allowNotModified = false, contentType = null,
} = {}){
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1 || !Number.isFinite(timeoutMs) || timeoutMs < 1) throw new Error('download: explicit bounds required');
  const controller = new AbortController();
  const signal = outerSignal ? AbortSignal.any([outerSignal, controller.signal]) : controller.signal;
  const timer = setTimeout(() => controller.abort(new Error('download: whole-response deadline exceeded')), timeoutMs);
  let abortListener;
  const aborted = new Promise((_, reject) => {
    abortListener = () => reject(signal.reason || new Error('download aborted'));
    if (signal.aborted) abortListener();
    else signal.addEventListener('abort', abortListener, { once:true });
  });
  let reader, response;
  const cancel = () => { try { const p = reader ? reader.cancel() : response?.body?.cancel(); p?.catch(() => {}); } catch {} };
  try {
    response = await Promise.race([fetchImpl(url, { signal, headers, redirect:'manual' }), aborted]);
    const metadata = { etag:response.headers.get('etag'), lastModified:response.headers.get('last-modified'), contentType:response.headers.get('content-type') };
    if (response.status === 304 && allowNotModified){ cancel(); return { notModified:true, ...metadata }; }
    if (response.status !== 200) throw new Error(`download: HTTP ${response.status}; no retry or redirect`);
    if (contentType && !contentType.test(metadata.contentType || '')) throw new Error('download: unexpected content type');
    const length = response.headers.get('content-length');
    if (length && (!/^\d+$/.test(length) || Number(length) > maxBytes)) throw new Error('download: declared size exceeds limit');
    if (!response.body) throw new Error('download: empty body');
    reader = response.body.getReader();
    const chunks = []; let bytes = 0;
    for (;;){
      const next = await Promise.race([reader.read(), aborted]);
      if (next.done) break;
      bytes += next.value.byteLength;
      if (bytes > maxBytes) throw new Error('download: streamed size exceeds limit');
      chunks.push(Buffer.from(next.value));
    }
    if (!bytes) throw new Error('download: empty body');
    return { bytes:Buffer.concat(chunks), ...metadata, notModified:false };
  } catch (error){ cancel(); throw error; }
  finally { clearTimeout(timer); signal.removeEventListener('abort', abortListener); }
}
