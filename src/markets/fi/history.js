/* Authoritative full research history. Extracted verbatim from src/markets/fi/sections.js.
   Original facts, interpretations, scope and live data bindings are preserved.
   Public relocation is an editorial draft, not a new content approval. */
export function researchHistory(api){
  const {M}=api;
  
  
  return {head: ['How Finland got here — from a reserve boom to a trading market', '芬兰市场的演进 — 从备用收入高峰到交易主导'],
  cards:[
{ t: 'card', mt: false, title: ['How the system got here', '系统如何演变至此'], badges: ['official'], blocks: [
      { t: 'timeline', items: M.timeline },
    ] }
  ]};
}
