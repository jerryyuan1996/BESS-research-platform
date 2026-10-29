/* ---------------------------------------------------------------------------
   NEWS TAGS — which market a headline is about.

   The industry-news feed (public/data/public/industry-news.json) carries
   headlines from four publishers with no market attached. The briefing shows a
   headline only when it is about a market on the platform, so each one is
   tagged here, deterministically, from its title and summary. No model reads
   it: a term either appears or it does not.

   This is methodology (plan of 2026-10-16, decision 3): the vocabulary decides
   what reaches the briefing, so the analyst owns it. It is listed in
   METHODOLOGY_SURFACES.

   STRONG AND WEAK TERMS. A strong term names one market and nothing else. A
   weak term names a country that holds several markets ("Japan", "Australia"):
   it tags every market in its group, but only when no strong term has already
   placed the headline in one of them. "Western Australia" is strong for WA, so
   a headline about it is not also tagged to the NEM through "Australia".

   Layering: no DOM, no import.
   --------------------------------------------------------------------------- */

const w = (source) => new RegExp(source, 'i');

/** Market id → strong terms. Word-bounded and case-insensitive. */
export const STRONG_TERMS = {
  wa:          [w('\\bWestern Australia'), w('\\bWEM\\b'), w('\\bSynergy\\b'), w('\\bKwinana\\b'), w('\\bCollie\\b'), w('\\bSWIS\\b')],
  nem:         [w('\\bNEM\\b'), w('National Electricity Market'), w('New South Wales'), w('\\bNSW\\b'), w('\\bQueensland'), w('\\bSouth Australia'), w('\\bVictoria(n)?\\b'), w('\\bTasmania'), w('Capacity Investment Scheme'), w('\\bLTESA\\b')],
  gb:          [w('\\bGB\\b'), w('\\bGreat Britain\\b'), w('\\bBritain\\b'), w('\\bBritish\\b'), w('\\bUnited Kingdom\\b'), w('\\bUK\\b'), w('\\bEngland\\b'), w('\\bScotland\\b'), w('\\bScottish\\b'), w('(?<!New South )\\bWales\\b'), w('\\bNESO\\b'), w('\\bOfgem\\b'), w('\\bElexon\\b')],
  de:          [w('\\bGermany\\b'), w('\\bGerman\\b'), w('\\bBundesnetzagentur\\b'), w('\\bBNetzA\\b'), w('\\bAmprion\\b'), w('\\b50Hertz\\b'), w('\\bTransnetBW\\b')],
  it:          [w('\\bItaly\\b'), w('\\bItalian\\b'), w('\\bTerna\\b'), w('\\bMACSE\\b'), w('\\bARERA\\b'), w('\\bSicily\\b'), w('\\bSardinia\\b')],
  ie:          [w('\\bIreland\\b'), w('\\bIrish\\b'), w('\\bEirGrid\\b'), w('\\bDS3\\b'), w('\\bFASS\\b')],
  ro:          [w('\\bRomania\\b'), w('\\bRomanian\\b'), w('\\bTranselectrica\\b'), w('\\bANRE\\b')],
  pl:          [w('\\bPoland\\b'), w('\\bPolish\\b'), w('Polskie Sieci')],
  jp_tokyo:    [w('\\bTokyo\\b'), w('\\bTEPCO\\b'), w('\\bKanto\\b')],
  jp_kyushu:   [w('\\bKyushu\\b')],
  jp_hokkaido: [w('\\bHokkaido\\b')],
  pjm:         [w('\\bPJM\\b'), w('\\bPennsylvania\\b'), w('\\bNew Jersey\\b'), w('\\bMaryland\\b'), w('\\bDelaware\\b'), w('\\bVirginia\\b'), w('\\bOhio\\b'), w('\\bIllinois\\b'), w('\\bComEd\\b')],
  ercot:       [w('\\bERCOT\\b'), w('\\bTexas\\b'), w('\\bTexan\\b'), w('\\bPUCT\\b')],
  caiso:       [w('\\bCAISO\\b'), w('\\bCalifornia\\b'), w('\\bCalifornian\\b'), w('\\bCPUC\\b')],
  fi:          [w('\\bFinland\\b'), w('\\bFinnish\\b'), w('\\bFingrid\\b'), w('\\bOlkiluoto\\b')],
  ca_on:       [w('\\bOntario\\b'), w('\\bIESO\\b'), w('\\bLT2\\b'), w('\\bHydro One\\b')],
  sa:          [w('\\bSaudi\\b'), w('\\bSPPC\\b'), w('Saudi Power Procurement'), w('\\bNational Grid SA\\b')],
  es:          [w('\\bSpain\\b'), w('\\bSpanish\\b'), w('\\bRed Eléctrica\\b'), w('\\bOMIE\\b'), w('\\bMITECO\\b')],
};

/** A country-level term, and the markets it stands for when no strong term placed the headline. */
export const WEAK_GROUPS = [
  { terms: [w('\\bJapan\\b'), w('\\bJapanese\\b'), w('\\bOCCTO\\b'), w('\\bJEPX\\b'), w('long-term decarboni[sz]ation auction')], markets: ['jp_tokyo', 'jp_kyushu', 'jp_hokkaido'] },
  { terms: [w('\\bAustralia(n)?\\b'), w('\\bAEMO\\b')], markets: ['nem'], unless: ['wa'] },
];

/**
 * The markets a headline is about, in id order. Empty when it names none of
 * them — a headline about El Salvador or Greece reaches no briefing.
 */
export function tagHeadline(item){
  const text = `${item?.title || ''} ${item?.summary || ''}`;
  const tagged = new Set();
  for (const [market, terms] of Object.entries(STRONG_TERMS)){
    if (terms.some(re => re.test(text))) tagged.add(market);
  }
  for (const group of WEAK_GROUPS){
    if (!group.terms.some(re => re.test(text))) continue;
    if (group.markets.some(m => tagged.has(m))) continue;
    if ((group.unless || []).some(m => tagged.has(m))) continue;
    for (const m of group.markets) tagged.add(m);
  }
  return [...tagged].sort();
}
