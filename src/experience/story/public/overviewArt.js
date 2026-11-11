// Decorative, schematic only: no external assets, scene engine, or model data.
const paths={
 island:'M40 95 Q65 25 110 55 T185 90 T265 65 Q300 100 255 132 T125 135 T40 95Z',
 regional:'M30 65 L100 115 L165 55 L230 120 L300 70 M100 115 L170 135 L230 120',
 frequency:'M20 95 L70 95 L85 65 L100 125 L115 40 L130 145 L145 95 L300 95',
 congestion:'M30 45 L145 85 L300 45 M30 95 L145 85 L300 95 M30 145 L145 85 L300 145',
 capacity:'M35 140 V90 H90 V65 H145 V40 H200 V80 H255 V140 M20 140 H310',
 scarcity:'M20 135 L70 130 L110 115 L145 35 L165 110 L205 125 L250 65 L300 135',
 solar:'M20 140 Q160 -40 300 140 M35 135 L100 135 L150 105 L200 105 L265 135',
 tokyo:'M40 140 V70 H75 V140 M100 140 V35 H145 V140 M170 140 V60 H210 V140 M235 140 V85 H280 V140',
 kyushu:'M35 120 Q75 55 130 105 T220 65 T295 110 M30 140 Q160 10 300 140',
 hokkaido:'M30 140 L95 45 L150 125 L215 35 L300 140 M95 45 L115 140 M215 35 L235 140',
 history:'M30 95 H300 M65 75 V115 M130 65 V125 M195 75 V115 M260 65 V125',
};
export function overviewArt(theme='history'){
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.setAttribute('viewBox','0 0 330 180');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');svg.setAttribute('class','public-overview-art');svg.dataset.theme=theme;
 const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',paths[theme]||paths.history);path.setAttribute('fill','none');path.setAttribute('stroke','currentColor');path.setAttribute('stroke-width','2');path.setAttribute('stroke-linecap','round');path.setAttribute('stroke-linejoin','round');svg.append(path);
 return svg;
}
