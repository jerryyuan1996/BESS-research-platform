/* Per-value locators load only after the reader opens a source disclosure. */
import {h} from '../../../utils/dom.js';
import {L} from '../../../app/i18n.js';

let provenance;
const includes=(id,path)=>{
  if(id==='pjm-01')return path.startsWith('footprint.')||path.startsWith('history.H-PJM-01');
  if(id==='pjm-02')return path.startsWith('history.')||/deliveryStart|deliveryEnd|resultsPostedDate|auctionTerm/.test(path);
  if(id==='pjm-03')return /history.H-PJM-03|history.H-PJM-04|teaching/.test(path);
  if(id==='pjm-04'||id==='pjm-08'||id==='pjm-09')return /RatingByHours|teaching|firstMarginalYear/.test(path);
  if(id==='pjm-05')return /queue\.|attribution\.|shortfall|comparison/.test(path);
  if(id==='pjm-06')return /history.H-PJM-05|collar|uncappedSimulation/.test(path);
  if(id==='pjm-07')return path.startsWith('years.');
  if(id==='pjm-10')return path.startsWith('auctionTerm.');
  return /backstop\.|auctionWindow|resultsPostedDate|ratingPostedDate/.test(path);
};

export function attachEvidence(dialog){
  const attached=new WeakSet();
  const attach=()=>{
    for(const article of dialog.querySelectorAll('[data-shot]')){
      const details=article.querySelector('.ix-story-sources');
      if(!details||attached.has(details))continue;
      attached.add(details);
      details.addEventListener('toggle',async()=>{
        if(!details.open||details.querySelector('.pjm-provenance'))return;
        provenance ||= import('../data/storyEvidenceProvenance.js');
        const {PJM_STORY_PROVENANCE:records}=await provenance;
        if(!details.isConnected)return;
        const id=article.getAttribute('data-shot');
        details.append(h('div',{class:'pjm-provenance'},h('h5',{},L(['Value locators and arithmetic','逐值出处与计算'])),
          h('dl',{},Object.entries(records).filter(([path])=>includes(id,path)).flatMap(([path,p])=>[
            h('dt',{},path),h('dd',{},p.sourceRef,' · ',p.locator,' · ',p.unit,' · ',p.arithmetic),
          ]))));
      });
    }
  };
  attach();dialog.addEventListener('click',attach);
}
