/* Tiny DOM helpers, verbatim from the prototype (lines 328-342).
   `h` is the single element factory used by every component and chart in the app:
   attrs starting with "on" become listeners, `html` sets innerHTML, `class` sets
   className, everything else becomes an attribute. Children are flattened and
   null/undefined children are skipped, which is what lets callers write
   conditional children inline as `cond && node`. */
const $id = (i) => document.getElementById(i);
function h(tag, attrs, ...kids){
  const e = document.createElement(tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)){
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  for (const k of kids.flat()){
    if (k == null) continue;
    e.append(k.nodeType ? k : document.createTextNode(k));
  }
  return e;
}

export { $id, h };
