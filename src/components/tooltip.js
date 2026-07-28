/* Shared floating tooltip, verbatim from the prototype (lines 354-364).
   One #tip element lives in index.html and is reused by every chart primitive;
   it is positioned in viewport coordinates and flips to the other side of the
   cursor when it would overflow the window. */
import { $id } from '../utils/dom.js';

const tip = () => $id('tip');
function tipShow(html, ev){
  const t = tip(); t.innerHTML = html; t.style.display = 'block';
  const pad = 14, w = t.offsetWidth, hh = t.offsetHeight;
  let x = ev.clientX + pad, y = ev.clientY + pad;
  if (x + w > innerWidth - 8) x = ev.clientX - w - pad;
  if (y + hh > innerHeight - 8) y = ev.clientY - hh - pad;
  t.style.left = x + 'px'; t.style.top = y + 'px';
}
function tipHide(){ tip().style.display = 'none'; }

export { tipShow, tipHide };
