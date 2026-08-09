/* ---------------------------------------------------------------------------
   WORKBOOK ADAPTER — the one place this repository reads a spreadsheet.

   Three of the best project registers on the platform publish only as Excel:
   Germany's Marktstammdatenregister, the EIA-860M monthly generator inventory,
   and AEMO's Generation Information. There is no CSV alternative for any of
   them, and they are the difference between a market having a pipeline layer and
   not having one.

   SCOPE, AND WHY IT IS DRAWN HERE.

   `exceljs` is a BUILD-TIME dependency. It lives in devDependencies, it is
   imported by etl/ and scripts/ only, and nothing under src/ may import this
   module — the browser bundle must never carry a spreadsheet parser. The ETL
   turns a workbook into canonical project records; the application only ever
   reads the JSON that comes out.

   It is `exceljs` rather than SheetJS's `xlsx` deliberately. The `xlsx` package
   published to npm is a stale 0.18.x with known advisories and SheetJS now
   distributes from its own registry, which is a supply-chain shape this repo
   should not take on for a data-ingest convenience. exceljs is MIT, actively
   maintained, and installs from npm normally.

   WHAT THIS DELIBERATELY DOES NOT DO. It does not extend etl/lib/zip.mjs, which
   stays the forty-line single-entry reader it was written to be. A workbook is
   not a zip with a different extension and pretending otherwise is how a small
   utility becomes an unmaintained parser.
   --------------------------------------------------------------------------- */
import ExcelJS from 'exceljs';

/**
 * Read a worksheet as an array of plain objects keyed by header.
 *
 * @param {string|Buffer} source        path to an .xlsx file, or its bytes
 * @param {object} [options]
 * @param {string|number} [options.sheet]      sheet name or 1-based index; defaults to the first
 * @param {number} [options.headerRow]         1-based row the headers sit on; defaults to 1
 * @param {(header:string)=>string} [options.mapHeader]  normalise a header before use
 * @returns {Promise<{rows: object[], sheetName: string, headers: string[]}>}
 */
export async function readSheet(source, options = {}){
  const workbook = new ExcelJS.Workbook();
  if (Buffer.isBuffer(source)) await workbook.xlsx.load(source);
  else await workbook.xlsx.readFile(source);

  const sheet = resolveSheet(workbook, options.sheet);
  if (!sheet) throw new Error(`workbook: sheet ${JSON.stringify(options.sheet ?? 1)} not found`);

  const headerRow = options.headerRow || 1;
  const mapHeader = options.mapHeader || defaultHeader;

  const headers = [];
  sheet.getRow(headerRow).eachCell({ includeEmpty: true }, (cell, column) => {
    const label = mapHeader(cellText(cell));
    if (label) headers[column] = label;
  });

  const named = headers.filter(Boolean);
  if (!named.length){
    throw new Error(`workbook: no headers on row ${headerRow} of "${sheet.name}" — check headerRow`);
  }

  const rows = [];
  sheet.eachRow({ includeEmpty: false }, (row, index) => {
    if (index <= headerRow) return;
    const record = {};
    let populated = false;
    row.eachCell({ includeEmpty: false }, (cell, column) => {
      const key = headers[column];
      if (!key) return;
      const value = cellValue(cell);
      if (value === null || value === '') return;
      record[key] = value;
      populated = true;
    });
    // Excel files are full of spacer and footnote rows; an empty one is not data.
    if (populated) rows.push(record);
  });

  return { rows, sheetName: sheet.name, headers: named };
}

/**
 * The sheet names in a workbook, in order.
 *
 * Lives here rather than in a connector so `exceljs` keeps exactly one import
 * site — AEMO renames its tabs between vintages and has to enumerate them, and
 * doing that with its own `import('exceljs')` would quietly make the parser a
 * two-file dependency.
 */
export async function sheetNames(source){
  const workbook = new ExcelJS.Workbook();
  if (Buffer.isBuffer(source)) await workbook.xlsx.load(source);
  else await workbook.xlsx.readFile(source);
  return workbook.worksheets.map(sheet => sheet.name);
}

function resolveSheet(workbook, wanted){
  if (wanted == null) return workbook.worksheets[0];
  if (typeof wanted === 'number') return workbook.worksheets[wanted - 1];
  const lower = String(wanted).toLowerCase();
  return workbook.worksheets.find(s => s.name.toLowerCase() === lower)
    // EIA renames its tabs between releases ("Operating" → "Operating "), so a
    // contains-match saves a connector breaking on a trailing space.
    || workbook.worksheets.find(s => s.name.toLowerCase().includes(lower));
}

/**
 * Header text normalised to a stable key: lower case, single underscores.
 *
 * Diacritics are folded rather than stripped. MaStR publishes German headers,
 * and "Nutzbare Speicherkapazität" with the umlaut merely removed becomes
 * `nutzbare_speicherkapazit_t` — a key nobody would write by hand and which
 * changes if the register ever ships the same header unaccented.
 */
export function defaultHeader(text){
  return String(text ?? '').trim().toLowerCase()
    .replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')   // ä → a, é → e
    .replace(/\([^)]*\)/g, ' ')          // drop unit annotations like "(MW)"
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Resolve a connector's canonical field names against a sheet's actual headers.
 *
 * Registers rename columns between releases and publish in their own language,
 * so the mapping between "what this connector needs" and "what this file calls
 * it" is DATA rather than a chain of `??` fallbacks buried in the transform.
 * Adding a newly-seen spelling is then a one-line edit next to the others.
 *
 * A required field with no matching alias throws. That is the whole point: the
 * alternative is a transform that reads `undefined` for every row and publishes
 * a register of nulls that validates.
 *
 * @param {string[]} headers   normalised headers present in the sheet
 * @param {Record<string, {aliases: string[], required?: boolean}>} spec
 * @param {string} label       for the error message
 * @returns {Record<string, ?string>} canonical name → the header to read, or null
 */
export function resolveColumns(headers, spec, label){
  const present = new Set(headers);
  const resolved = {};
  const missing = [];

  for (const [canonical, field] of Object.entries(spec)){
    const hit = field.aliases.find(alias => present.has(alias));
    resolved[canonical] = hit || null;
    if (!hit && field.required) missing.push(`${canonical} (tried ${field.aliases.join(', ')})`);
  }

  if (missing.length){
    throw new Error(
      `${label}: could not resolve required column(s):\n  ${missing.join('\n  ')}\n`
      + `Headers present: ${headers.slice(0, 30).join(', ')}${headers.length > 30 ? ' …' : ''}`);
  }
  return resolved;
}

function cellText(cell){
  const v = cell?.value;
  if (v == null) return '';
  if (typeof v === 'object'){
    if (v.richText) return v.richText.map(part => part.text).join('');
    if (v.text != null) return String(v.text);
    if (v.result != null) return String(v.result);
  }
  return String(v);
}

/**
 * A cell as a JS value: numbers stay numbers, dates stay dates, formulas
 * resolve to their cached result, everything else is trimmed text.
 *
 * Returning the formula's result rather than its expression matters for AEMO,
 * whose capacity columns are computed — reading the expression would give every
 * project a capacity of "=SUM(D4:F4)".
 */
export function cellValue(cell){
  const v = cell?.value;
  if (v == null) return null;
  if (v instanceof Date) return v;
  if (typeof v === 'number' || typeof v === 'boolean') return v;
  if (typeof v === 'object'){
    if (v.richText) return v.richText.map(part => part.text).join('').trim();
    if (v.result !== undefined) return v.result;
    if (v.text != null) return String(v.text).trim();
    if (v.hyperlink && v.text) return String(v.text).trim();
    return null;
  }
  return String(v).trim();
}

/** A number, or null. Never NaN and never a coerced zero. */
export function num(value){
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (value == null) return null;
  /* Registers write "1,234.5", "1 234,5" and "≈120" depending on the country.
     Strip anything that is not part of a number rather than trusting Number(). */
  const cleaned = String(value).replace(/[^\d.,-]/g, '').replace(/,(?=\d{3}\b)/g, '');
  /* Number('') is 0, and so is Number('n/a'.replace(...)) once the letters are
     stripped. A cell with no digits in it is missing data, and publishing it as
     a zero would put 0 MW batteries in a pipeline table that sums its column. */
  if (!/\d/.test(cleaned)) return null;
  const normalised = cleaned.includes(',') && !cleaned.includes('.')
    ? cleaned.replace(',', '.')          // European decimal comma
    : cleaned;
  const n = Number(normalised);
  return Number.isFinite(n) ? n : null;
}

const pad = (n) => String(n).padStart(2, '0');

/**
 * An ISO date string, or null. Accepts Excel dates, ISO text and "YYYY-MM".
 *
 * A commissioning date is a calendar date, not an instant, and the two must not
 * be conflated. `Date.parse('1 June 2028')` produces local midnight, and
 * `toISOString()` then converts it to UTC — which on a machine east of Greenwich
 * reports 31 May. The date a register published must survive being read in a
 * different timezone than the one that read it, so local components are
 * formatted directly and never round-tripped through UTC.
 */
export function isoDate(value){
  if (value instanceof Date && !Number.isNaN(value.valueOf())){
    /* exceljs maps a date cell to UTC midnight, so UTC components are the ones
       the spreadsheet actually wrote. */
    return `${value.getUTCFullYear()}-${pad(value.getUTCMonth() + 1)}-${pad(value.getUTCDate())}`;
  }
  if (value == null) return null;
  const text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);
  if (/^\d{4}-\d{2}$/.test(text)) return `${text}-01`;

  const parsed = new Date(text);
  if (Number.isNaN(parsed.valueOf())) return null;
  // Parsed as local time, so read back as local time.
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
}

/**
 * Assert a sheet carries the columns a connector depends on.
 *
 * Registers rename columns between releases, and a renamed column read through
 * an optional-chaining accessor produces a file full of nulls that validates and
 * publishes. Failing loudly at the boundary is the whole point.
 */
export function requireColumns(headers, required, label){
  const missing = required.filter(column => !headers.includes(column));
  if (missing.length){
    throw new Error(
      `${label}: missing column(s) ${missing.join(', ')}. `
      + `Found: ${headers.slice(0, 24).join(', ')}${headers.length > 24 ? ' …' : ''}`);
  }
}
