/* Axis label factory, verbatim from the prototype (lines 384-388).
   Uses var(--muted) and font-family:inherit so axis text re-themes with the page
   and matches body typography without a per-chart font declaration. */
import { S } from './chartUtils.js';

function axisText(x, y, txt, anchor = 'middle', size = 10.5, rotate){
  const t = S('text', { x, y, 'text-anchor': anchor, 'font-size': size, fill: 'var(--muted)', 'font-family': 'inherit' });
  if (rotate) t.setAttribute('transform', `rotate(${rotate} ${x} ${y})`);
  t.textContent = txt; return t;
}

export { axisText };
