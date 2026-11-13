import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import './marketReadingNav.css';

/** One reading position for the market page, including lazily loaded chapters. */
export function mountMarketReadingNav(root, chapters) {
  const current = h('span', { class:'market-reading-current' });
  const count = h('span', { class:'market-reading-count', 'aria-hidden':'true' });
  const toggle = h('button', { type:'button', class:'market-reading-toggle', 'aria-expanded':'false', 'aria-controls':'market-reading-links' },
    h('span', { class:'market-reading-battery', 'aria-hidden':'true' }, ...Array.from({length:4},()=>h('i'))),
    h('span', {}, h('small', {}, L(['ON THIS PAGE','当前章节'])), current), count,
    h('span', { class:'market-reading-chevron', 'aria-hidden':'true' }, '⌄'));
  const links = h('div', { id:'market-reading-links', class:'market-reading-links' });
  const nav = h('nav', { class:'market-reading-nav', 'aria-label':L(['Market reading navigation','市场阅读导航']) }, toggle, links);
  const top = h('button', { type:'button', class:'market-back-top', hidden:true, 'aria-label':L(['Back to top','回到顶部']), title:L(['Back to top','回到顶部']) },
    h('span', { 'aria-hidden':'true' }, '↑'));
  root.querySelector('.ix-market-intro').after(nav);
  root.append(top);
  let targets = [], signature = '', frame = null, destroyed = false, pendingHash = window.location.hash;
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const close = () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded','false'); };
  const jump = target => {
    close();
    if (target.tagName === 'DETAILS') target.open = true;
    target.setAttribute('tabindex','-1');
    target.focus({preventScroll:true});
    target.scrollIntoView({behavior:reduced()?'instant':'smooth',block:'start'});
  };
  toggle.addEventListener('click',()=>{
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded',String(open)); nav.classList.toggle('is-open',open);
  });
  nav.addEventListener('keydown',event=>{if(event.key==='Escape'){close();toggle.focus();}});
  top.addEventListener('click',()=>{
    close();
    pendingHash = null;
    history.replaceState(history.state,'',window.location.pathname+window.location.search);
    const heading = root.querySelector('h1'); heading.setAttribute('tabindex','-1'); heading.focus({preventScroll:true});
    window.scrollTo({top:0,behavior:reduced()?'instant':'smooth'});
  });

  function update() {
    frame = null;
    if (!root.isConnected) { destroy(); return; }
    const present = chapters.map(([id,label,child])=>({ id,label,child,node:root.querySelector('#'+id) })).filter(item=>item.node);
    const next = present.map(item=>item.id).join('|');
    if (next !== signature) {
      signature = next; targets = present;
      links.replaceChildren(...targets.map((item,index)=>{
        item.link = h('a', { href:'#'+item.id, class:item.child?'is-subchapter':'', onclick:event=>{
          event.preventDefault();
          history.pushState(history.state,'','#'+item.id);
          jump(item.node);
        } }, h('span', { class:'market-reading-cell', 'aria-hidden':'true' }),
          h('span', {}, L(item.label)));
        return item.link;
      }));
    }
    if (!targets.length) return;
    const destination = pendingHash && targets.find(item=>'#'+item.id === pendingHash);
    if (destination) { pendingHash = null; jump(destination.node); }
    const compact = window.matchMedia('(max-width:1050px)').matches;
    toggle.disabled = !compact;
    toggle.setAttribute('aria-expanded',String(!compact || nav.classList.contains('is-open')));
    const offset = compact ? Math.max(112,toggle.offsetHeight + 32) : 100;
    let active = targets[0];
    for (const item of targets) {
      if (item.node.getBoundingClientRect().top <= offset) active = item;
    }
    // Reaching the end of a short final section still identifies that section.
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) active = targets.at(-1);
    const index = targets.indexOf(active);
    for (const [i,item] of targets.entries()) {
      if (item === active) item.link.setAttribute('aria-current','location'); else item.link.removeAttribute('aria-current');
      item.link.classList.toggle('is-read',i<index);
    }
    nav.classList.toggle('is-in-revenue',active.id.startsWith('revenue-'));
    if (current.textContent !== L(active.label)) current.textContent = L(active.label);
    const position = String(index+1).padStart(2,'0') + ' / ' + String(targets.length).padStart(2,'0');
    if (count.textContent !== position) count.textContent = position;
    const cells = toggle.querySelectorAll('.market-reading-battery i');
    cells.forEach((cell,i)=>cell.classList.toggle('is-charged',i<Math.ceil((index+1)/targets.length*4)));
    top.hidden = window.scrollY < 400;
  }
  function schedule() { if (!destroyed && frame === null) frame = requestAnimationFrame(update); }
  function destroy() {
    destroyed = true;
    if (frame !== null) cancelAnimationFrame(frame);
    window.removeEventListener('scroll',schedule); window.removeEventListener('resize',schedule);
    observer.disconnect(); resize.disconnect();
  }
  // The parent observation also tears down listeners on route/language changes.
  const observer = new MutationObserver(schedule);
  observer.observe(root.parentElement,{childList:true,subtree:true});
  const resize = new ResizeObserver(schedule); resize.observe(root);
  window.addEventListener('scroll',schedule,{passive:true}); window.addEventListener('resize',schedule);
  schedule();
  return destroy;
}
