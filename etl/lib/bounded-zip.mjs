import { inflateRawSync } from 'node:zlib';

const check = (ok, message) => { if (!ok) throw new Error('zip: ' + message); };
const crcTable = Array.from({length:256}, (_, n) => {
  for (let k = 0; k < 8; k++) n = (n >>> 1) ^ ((n & 1) ? 0xedb88320 : 0);
  return n >>> 0;
});
export function crc32(bytes){
  let n = 0xffffffff;
  for (const value of bytes) n = (n >>> 8) ^ crcTable[(n ^ value) & 255];
  return (n ^ 0xffffffff) >>> 0;
}

/** Inspect the central directory before decompressing any selected member. */
export function inspectZip(bytes, { maxBytes, maxEntries, maxExpandedBytes, maxMemberBytes } = {}){
  check(Buffer.isBuffer(bytes) && bytes.length >= 22 && bytes.length <= maxBytes, 'compressed size');
  let end = -1;
  for (let p = bytes.length - 22; p >= Math.max(0, bytes.length - 65557); p--){
    if (bytes.readUInt32LE(p) === 0x06054b50 && p + 22 + bytes.readUInt16LE(p + 20) === bytes.length){ end = p; break; }
  }
  check(end >= 0, 'missing end record');
  check(bytes.readUInt16LE(end + 4) === 0 && bytes.readUInt16LE(end + 6) === 0, 'multi-disk archive');
  const count = bytes.readUInt16LE(end + 10), size = bytes.readUInt32LE(end + 12), start = bytes.readUInt32LE(end + 16);
  check(count > 0 && count < 65535 && count <= maxEntries && count === bytes.readUInt16LE(end + 8), 'entry count / ZIP64');
  check(start + size === end && start >= 0, 'central directory bounds');
  let position = start, expanded = 0;
  const entries = [], names = new Set();
  for (let i = 0; i < count; i++){
    check(position + 46 <= end && bytes.readUInt32LE(position) === 0x02014b50, 'bad central entry');
    const nameLength = bytes.readUInt16LE(position + 28), extra = bytes.readUInt16LE(position + 30), comment = bytes.readUInt16LE(position + 32);
    check(position + 46 + nameLength + extra + comment <= end, 'truncated entry');
    const name = bytes.subarray(position + 46, position + 46 + nameLength).toString('utf8');
    check(name && !name.includes('\uFFFD') && !name.includes('\\') && !name.includes('\0') && !name.startsWith('/') && !name.split('/').some(p => p === '..' || p === '.') && !/^[a-z]:/i.test(name), 'unsafe member name');
    check(!names.has(name), 'duplicate member name'); names.add(name);
    const entry = { name, flags:bytes.readUInt16LE(position + 8), method:bytes.readUInt16LE(position + 10), crc:bytes.readUInt32LE(position + 16), compressed:bytes.readUInt32LE(position + 20), expanded:bytes.readUInt32LE(position + 24), offset:bytes.readUInt32LE(position + 42) };
    check(!(entry.flags & 1) && [0,8].includes(entry.method), 'encrypted or unsupported member');
    check(entry.expanded <= maxMemberBytes && entry.compressed <= bytes.length && entry.offset + 30 <= start, 'member size / offset');
    expanded += entry.expanded;
    check(Number.isSafeInteger(expanded) && expanded <= maxExpandedBytes, 'expanded archive limit');
    entries.push(entry); position += 46 + nameLength + extra + comment;
  }
  check(position === end, 'central directory length');
  return { entries, expandedBytes:expanded, centralOffset:start };
}

export function extractZipMember(bytes, inspected, pattern, maxBytes){
  const matches = inspected.entries.filter(entry => pattern.test(entry.name));
  check(matches.length === 1, 'required member absent or ambiguous');
  const entry = matches[0], at = entry.offset;
  check(bytes.readUInt32LE(at) === 0x04034b50, 'local signature');
  check(bytes.readUInt16LE(at + 6) === entry.flags && bytes.readUInt16LE(at + 8) === entry.method, 'local metadata mismatch');
  const nl = bytes.readUInt16LE(at + 26), xl = bytes.readUInt16LE(at + 28), from = at + 30 + nl + xl;
  check(bytes.subarray(at + 30, at + 30 + nl).toString('utf8') === entry.name, 'local name mismatch');
  check(entry.expanded <= maxBytes && from + entry.compressed <= inspected.centralOffset, 'selected member limit');
  const compressed = bytes.subarray(from, from + entry.compressed);
  const result = entry.method === 0 ? Buffer.from(compressed) : inflateRawSync(compressed, { maxOutputLength:maxBytes });
  check(result.length === entry.expanded && crc32(result) === entry.crc, 'size or CRC mismatch');
  return { bytes:result, name:entry.name };
}
