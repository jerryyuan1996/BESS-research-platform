/* Authoritative full research history. Extracted verbatim from src/markets/sa/sections.js.
   Original facts, interpretations, scope and live data bindings are preserved.
   Public relocation is an editorial draft, not a new content approval. */
export function researchHistory(api){
  const {M,SRC}=api;
  
  
  return {head: ['How Saudi Arabia got here — storage bought like solar', '沙特的演进 — 像采购光伏一样采购储能'],
  cards:[
{ t: 'card', mt: false, title: ['How the market got here', '市场如何演变至此'], badges: ['official'], blocks: [
      { t: 'timeline', items: M.timeline },
      { t: 'why', text: [
        'SPPC runs storage the way it runs its solar rounds: it picks the sites, prequalifies bidders and signs a long contract with the winner. A national target of ' + M.target2030GWh + ' GWh by 2030 against 20 GWh in SPPC\'s two groups says more rounds follow.',
        'SPPC按光伏轮次的方式采购储能：自行选址、资格预审并与中标方签订长期合同。2030年全国目标' + M.target2030GWh + 'GWh，而SPPC两组仅20GWh，意味着后续还有更多轮次。',
      ] },
      { t: 'src', src: SRC.renewableVision, use: ['The national ledger', '全国储能台账'] },
    ] }
  ]};
}
