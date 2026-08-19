/* Axis label factory, verbatim from the prototype (lines 384-388).
   Uses var(--muted) and font-family:inherit so axis text re-themes with the page
   and matches body typography without a per-chart font declaration. */
import { S } from './chartUtils.js';

/* SIZE COMES THROUGH `style`, NOT THE SVG ATTRIBUTE. An SVG presentation
   attribute cannot resolve `var()`, so `font-size="var(--fs-micro)"` would be
   ignored and the browser would fall back — which is how chart axes sat at
   10.5px while every other size on the page moved onto the type scale. Setting
   it on the style property makes the custom property resolve, so charts obey
   the same scale as the tables beside them. A number is still accepted, for a
   caller that genuinely needs an off-scale size. */
function axisText(x, y, txt, anchor = 'middle', size = 'var(--fs-micro)', rotate){
  const t = S('text', { x, y, 'text-anchor': anchor, fill: 'var(--muted)', 'font-family': 'inherit' });
  t.style.fontSize = typeof size === 'number' ? size + 'px' : size;
  if (rotate) t.setAttribute('transform', `rotate(${rotate} ${x} ${y})`);
  t.textContent = txt; return t;
}

export { axisText };
