/** Conservative representation checks, not legal interpretation. Independent
 * source/translation/complete-record approval is still required by the writer. */
export function isCalendarDate(value){
  return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
}
export function isContextPeriod(value,precision){
  return typeof value==='string'&&(precision==='year'?/^\d{4}$/.test(value):precision==='month'?/^\d{4}-(?:0[1-9]|1[0-2])$/.test(value):false);
}
const MONTHS={january:1,february:2,march:3,april:4,may:5,june:6,july:7,august:8,september:9,october:10,november:11,december:12,januar:1,februar:2,'märz':3,mai:5,juni:6,juli:7,oktober:10,dezember:12};
const day=(y,m,d)=>`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
export function calendarDatesInQuote(quote,{language=''}={}){
  if(typeof quote!=='string')return [];
  const dates=new Set();const text=quote.normalize('NFC').toLowerCase();
  for(const match of text.matchAll(/\b(\d{4})-(\d{2})-(\d{2})\b/g))dates.add(day(match[1],match[2],match[3]));
  for(const match of text.matchAll(/\b(\d{4})\.(\d{2})\.(\d{2})\b/g))dates.add(day(match[1],match[2],match[3]));
  for(const match of text.matchAll(/\b(\d{1,2})\.?\s+([a-zä]+)\s+(\d{4})\b/gu))if(MONTHS[match[2]])dates.add(day(match[3],MONTHS[match[2]],match[1]));
  for(const match of text.matchAll(/\b([a-zä]+)\s+(\d{1,2}),?\s+(\d{4})\b/gu))if(MONTHS[match[1]])dates.add(day(match[3],MONTHS[match[1]],match[2]));
  if(/^en(?:-|$)/i.test(language))for(const match of text.matchAll(/\b(\d{1,2})(st|nd|rd|th)\s+([a-z]+)\s+(\d{4})\b/g)){
    const n=Number(match[1]),suffix=n%100>=11&&n%100<=13?'th':({1:'st',2:'nd',3:'rd'}[n%10]||'th');
    if(match[2]===suffix&&MONTHS[match[3]])dates.add(day(match[4],MONTHS[match[3]],n));
  }
  // German dotted dates require original-locale metadata. Slash dates remain
  // ambiguous and are never guessed from investment market or UI language.
  if(/^de(?:-|$)/i.test(language))for(const match of text.matchAll(/\b(\d{1,2})\.(\d{1,2})\.(\d{4})\b/g))dates.add(day(match[3],match[2],match[1]));
  return [...dates].filter(isCalendarDate);
}
const WORDS={draft:['draft','entwurf','festlegungsentwurf'],consultation:['consultation','konsultation'],amended:['amended','amendment','geändert'],adopted:['adopted','approved','beschlossen','genehmigt'],effective:['effective','in force','commences operation','come into operation'],suspended:['suspended','ausgesetzt'],withdrawn:['withdrawn','zurückgezogen'],repealed:['repealed','aufgehoben'],superseded:['superseded','ersetzt']};
export function criticalValueInQuote(claim,quote,{language=''}={}){
  if(typeof quote!=='string')return false;
  if(claim.kind==='date'&&isContextPeriod(claim.value,claim.datePrecision)){
    const text=quote.normalize('NFC').toLowerCase().replace(/\s+/g,' ');
    if(claim.datePrecision==='year')return new RegExp('\\b'+claim.value+'\\b').test(text);
    const [year,month]=claim.value.split('-');
    return text.includes(claim.value)||Object.entries(MONTHS).some(([name,n])=>n===Number(month)&&new RegExp('\\b'+name+' '+year+'\\b','u').test(text));
  }
  if(claim.kind==='date')return isCalendarDate(claim.value)?calendarDatesInQuote(quote,{language}).includes(claim.value):quote.includes(String(claim.value));
  if(claim.kind==='number'){
    const escaped=String(claim.value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    return new RegExp(`(^|[^\\d.,])${escaped}(?![\\d.,])`).test(quote);
  }
  if(claim.kind!=='legal_status')return true;
  const text=quote.normalize('NFC').toLowerCase().replace(/\s+/g,' ');
  const words=WORDS[claim.value]||[];
  const officialForms={adopted:/\b(?:has made a final determination and rule|market rules made|have decided to approve|makes the following rule|the authority consents|the authority agrees that the timetable)\b/u,effective:/\b(?:come(?:s)? into force|commence(?:s)?)\b/u};
  if(!words.some(word=>new RegExp(`\\b${word}\\b`,'u').test(text))&&!officialForms[claim.value]?.test(text))return false;
  if(claim.value==='effective'&&/\bnot(?: yet)? (?:(?:come|comes) into force|commence(?:s)?)\b/u.test(text))return false;
  if(['adopted','effective','repealed'].includes(claim.value)&&/\b(?:not(?:\s+yet)?|never|nicht)\s+(?:adopted|approved|effective|in force|repealed|beschlossen|genehmigt)\b/u.test(text))return false;
  return true;
}
