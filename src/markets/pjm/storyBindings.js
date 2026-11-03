/* Resolve existing case fields and the approved, fixed-vintage evidence only. */
import { HOME_BRIEFING } from '../../briefing/homeData.js';
import { playTitle } from '../../governance/playTitle.js';
import { tokensIn } from '../../experience/story/contract.js';
import { PJM_STORY_VALUES as E } from './data/storyEvidenceValues.js';
import { FIELD_BINDINGS } from './story.js';

export const WATCHED_TRIGGERS = ['pjm-capacity-auction-2029-30','pjm-backstop-filing-suspension-ends','pjm-elcc-2030-31-rating'];
const finite = value => typeof value === 'number' && Number.isFinite(value);
const get = (object, path) => path.reduce((v,key)=>v?.[key],object);
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export function datePair(value) {
  if (!value) return null;
  const [y,m,d] = String(value).split('-');
  return d ? [`${Number(d)} ${months[Number(m)-1]} ${y}`,`${y}年${Number(m)}月${Number(d)}日`]
    : m ? [`${months[Number(m)-1]} ${y}`,`${y}年${Number(m)}月`] : [y,`${y}年`];
}

export function nextPublishedAuction(hours, evidence = E) {
  return Object.values(evidence.years).find(y=>y.auctionStatus==='pending' && finite(y.auctionRatingByHours?.[hours])) || null;
}

/** Selected design cells are displayed, never repriced by a teaching control. */
export function durationDesigns() {
  return HOME_BRIEFING.grids.pjm.cells.filter(cell=>cell.route==='cap').map(cell=>({
    ...cell,
    valueText:finite(cell.value)?[`${cell.value<0?'−':'+'}$${Math.round(Math.abs(cell.value)/1000)}k/MW`,
      `每MW ${cell.value<0?'−':'+'}${(Math.abs(cell.value)/10000).toFixed(1)}万美元`]:null,
    holdText:finite(cell.hold)?`${(cell.hold*100).toFixed(1)}%`:null,
  }));
}

export function watchedEvents() {
  return WATCHED_TRIGGERS.map(id=>HOME_BRIEFING.triggers[id]).filter(Boolean);
}

export function storyValues(row, ui = {}) {
  const values = {};
  const next = nextPublishedAuction(row?.play?.hours);
  for (const [token, {path, format}] of Object.entries(FIELD_BINDINGS)) {
    const [owner,...parts] = path.split('.');
    let value = owner==='R' ? get(row,parts) : owner==='E' ? get(E,parts)
      : owner==='nextPublishedAuction' ? get(next,parts)
      : path==='B.build.pjm.line' ? HOME_BRIEFING.build.find(x=>x.market==='pjm')?.line
      : get(HOME_BRIEFING,parts);
    if(format==='rating') value=value?.[row?.play?.hours];
    if(token==='watchedTriggerCount') value=WATCHED_TRIGGERS.filter(id=>value?.[id]);
    if(value===null || value===undefined){values[token]=null;continue;}
    values[token] = format==='call' ? ui.CALLS?.[value] ?? null
      : format==='play' ? (ui.playTitle || playTitle)(value,row.stage)
      : format==='share' ? ui.share?.(value) ?? (finite(value)?`${Math.round(value*100)}%`:null)
      : format==='return' ? ui.returnPct?.(value) ?? null
      : format==='rating' ? finite(value)?`${Math.round(value*100)}%`:null
      : format==='date' ? datePair(value)
      : format==='year' ? String(value).slice(0,4)
      : format==='list' ? value.join(' / ')
      : format==='count' ? String(value.length)
      : format==='pair' ? value : value==='Outlook'?['Outlook','展望']:String(value);
  }
  return values;
}

export function storyMatches(story,row,lens='infraFund') {
  return lens==='infraFund' && row?.market?.manifest?.id==='pjm'
    && row.play?.id===story.reviewedAgainst.playRef && row.play.hours===story.reviewedAgainst.hours
    && row.call===story.reviewedAgainst.call;
}

/* Missing evidence uses a figure-free state; it never substitutes zero or an old rating. */
export function storyWithAvailableValues(story,values) {
  const missing=pair=>pair?.some(s=>tokensIn(s).some(t=>values[t]===null || values[t]===undefined));
  const adapt=shot=>({...shot,
    copy:missing(shot.copy)?['Current evidence unavailable; read the research context.','当前证据暂不可用；请阅读研究背景。']:shot.copy,
    question:missing(shot.question)?['How does this mechanism work?','这一机制如何运作？']:shot.question,
    meaning:missing(shot.meaning)?null:shot.meaning,
    labels:Object.fromEntries(Object.entries(shot.labels||{}).filter(([,p])=>!missing(p))),
  });
  return {...story,opening:adapt(story.opening),chapters:story.chapters.map(c=>({...c,shots:c.shots.map(adapt)}))};
}
