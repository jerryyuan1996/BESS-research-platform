/** Policy-only inventory. Two narrowly reviewed metadata collectors are active.
 * Existing investment/scout source governance remains unchanged. */
export const INVENTORY_VERSION=2;
export const POLICY_SOURCES=Object.freeze([
  {id:'de-agnes',jurisdiction:'DE',markets:['de'],language:'de',title:'AgNes official determination register',url:'https://www.bundesnetzagentur.de/1059162',host:'www.bundesnetzagentur.de',officialId:'AgNes',reviewed:false,rightsReviewed:false,
    metadataScope:{reviewed:true,purpose:'metadata_discovery_only',reviewedAt:'2026-11-10',reviewVersion:'2026-11-10-metadata-v1',
      termsURL:'https://www.bundesnetzagentur.de/DE/Service/Impressum/start.html',
      pageURLs:['https://www.bundesnetzagentur.de/1059162','https://www.bundesnetzagentur.de/DE/Beschlusskammern/GBK/Ebene1_Rahmen/AgNes/start.html'],
      paths:['/1059162'],directories:['/DE/Beschlusskammern/1_GZ/GBK-GZ/2025/GBK-25-01-1x3_AgNes/Downloads/','/DE/Beschlusskammern/GBK/Ebene1_Rahmen/AgNes/'],attachmentDownloadHosts:[]}},
  {id:'gb-connections',jurisdiction:'GB',markets:['gb'],language:'en',title:'Connections reform decision package',url:'https://www.ofgem.gov.uk/decision/decision-connections-reform-package-tm04',host:'www.ofgem.gov.uk',officialId:'TMO4+',reviewed:false,rightsReviewed:false,
    metadataScope:{reviewed:true,purpose:'metadata_discovery_only',reviewedAt:'2026-11-10',reviewVersion:'2026-11-10-metadata-v1',
      termsURL:'https://www.ofgem.gov.uk/c-ofgem-2026',
      pageURLs:['https://www.ofgem.gov.uk/decision/decision-connections-reform-package-tm04'],
      paths:['/decision/decision-connections-reform-package-tm04'],pdfDirectories:['/sites/default/files/'],attachmentDownloadHosts:[]}},
  {id:'nem-iess',jurisdiction:'AU-NEM',markets:['nem'],language:'en',title:'Integrating energy storage systems into the NEM',url:'https://www.aemc.gov.au/rule-changes/integrating-energy-storage-systems-nem',host:'www.aemc.gov.au',officialId:'ERC0280',reviewed:false,rightsReviewed:false,blockedReason:'prior_http_403_requires_new_access_review'},
  {id:'wa-wic',jurisdiction:'AU-WA',markets:['wa'],language:'en',title:'Wholesale Electricity Market Investment Certainty Review',url:'https://www.wa.gov.au/government/document-collections/wholesale-electricity-market-investment-certainty-review',host:'www.wa.gov.au',officialId:'WIC-Review',reviewed:false,rightsReviewed:false,blockedReason:'automated_acquisition_prohibited_by_terms'},
]);
// Discovery outside investment dashboards is a separate namespace. There is no
// inferred investment market, legal scope or source approval for these regions.
export const GLOBAL_COVERAGE=Object.freeze(['DE','GB','AU-NEM','AU-WA','EU','US','JP','CA','NZ'].map(jurisdiction=>({jurisdiction,status:'unconfirmed'})));
