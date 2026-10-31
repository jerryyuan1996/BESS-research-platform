/* ---------------------------------------------------------------------------
   The story kit's SVG element factory.

   The same shape as the `s()` helper in src/experience/charts.js: attributes
   are set as given, children are flattened, null children are skipped and a
   string child becomes a text node. Text always arrives already localised
   (L() is called by the caller), so nothing here holds a word of copy.
   --------------------------------------------------------------------------- */
export const SVGNS = 'http://www.w3.org/2000/svg';

export function s(tag, attrs = {}, ...children){
  const node = document.createElementNS(SVGNS, tag);
  for (const [key, value] of Object.entries(attrs)){
    if (value === undefined || value === null || value === false) continue;
    node.setAttribute(key, String(value));
  }
  for (const child of children.flat(Infinity)){
    if (child === undefined || child === null || child === false) continue;
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return node;
}

/** A number trimmed for an SVG attribute: two decimals at most. */
export const n2 = (v) => +(+v).toFixed(2);

let seq = 0;
/** A document-unique id for title/desc references. */
export const uid = (prefix) => `${prefix}-${++seq}`;
