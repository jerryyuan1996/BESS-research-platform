/* Authoritative full research history. Extracted verbatim from src/markets/es/sections.js.
   Original facts, interpretations, scope and live data bindings are preserved.
   Public relocation is an editorial draft, not a new content approval. */
export function researchHistory(api){
  const {M}=api;
  
  
  return {head: ['How Spain got here — solar made the spread', '西班牙的演进 — 光伏造就价差'],
  cards:[
{ t: 'card', mt: false, title: ['How the market got here', '市场如何演变至此'], badges: ['official'], blocks: [
      { t: 'timeline', items: M.timeline },
    ] }
  ]};
}
