/* ---------------------------------------------------------------------------
   Minimal single-entry ZIP reader.

   AEMO publishes each archived WEM trading day as a one-file zip. Node has no
   built-in zip reader, and the repository has exactly one dev dependency by
   design, so this reads the container directly rather than adding a package for
   forty lines of work.

   Scope is deliberately narrow: the FIRST entry of a zip, stored or deflated.
   That is what AEMO publishes. Anything else throws rather than guessing.

   One quirk worth knowing, because it caused a wrong first implementation:
   AEMO's zips are written with a streaming data descriptor, so the local file
   header records a compressed size of 0xFFFFFFFF rather than the real length.
   The size field therefore cannot be trusted to slice the payload. inflateRaw
   stops at the end of the deflate stream on its own, so the fix is to hand it
   everything from the start of the payload onward and let it find the end.
   --------------------------------------------------------------------------- */
import { inflateRawSync } from 'node:zlib';

const LOCAL_FILE_HEADER = 0x04034b50;

/**
 * Extract the first entry of a zip archive.
 *
 * @param {Buffer} buf  the whole archive
 * @returns {{name: string, data: Buffer}}
 */
export function unzipFirstEntry(buf){
  if (!Buffer.isBuffer(buf) || buf.length < 30){
    throw new Error('zip: buffer too small to contain a local file header');
  }
  if (buf.readUInt32LE(0) !== LOCAL_FILE_HEADER){
    throw new Error(`zip: bad signature 0x${buf.readUInt32LE(0).toString(16)} — not a zip archive`);
  }

  const method = buf.readUInt16LE(8);
  const nameLen = buf.readUInt16LE(26);
  const extraLen = buf.readUInt16LE(28);
  const name = buf.subarray(30, 30 + nameLen).toString('utf8');
  const start = 30 + nameLen + extraLen;

  if (method === 0){
    // Stored. Here the recorded size is the only way to find the end, and for a
    // stored entry it is reliable — a data descriptor implies compression.
    const size = buf.readUInt32LE(18);
    return { name, data: buf.subarray(start, start + size) };
  }

  if (method === 8){
    // Deflated. Pass the remainder; inflateRaw finds the stream end itself.
    return { name, data: inflateRawSync(buf.subarray(start)) };
  }

  throw new Error(`zip: unsupported compression method ${method} (expected 0 stored or 8 deflate)`);
}
