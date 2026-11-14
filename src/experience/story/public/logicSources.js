// Supplements to the preserved original-story evidence. No private agreement
// or fee is inferred from a public market rule. New sources checked 14 Nov 2026.
const source=(title,url,locator)=>({title,url,locator,checkedOn:'2026-11-14'});
export const LOGIC_SOURCES={
 de:{'LOGIC-DE-RESERVES':source('German TSOs · Balancing services and prequalification','https://www.regelleistung.net/en-us/','Product qualification, tendering and activation are separate steps; no private toll terms are established.')},
 ercot:{'LOGIC-ERCOT-RULES':source('ERCOT · Current Nodal Protocols','https://www.ercot.com/mktrules/nprotocols/current','Sections 4–6: day-ahead, reliability and real-time operations; energy-storage state of charge and ancillary obligations. No private toll price.')},
 pjm:{'LOGIC-PJM-MARKETS':source('PJM · Energy market and ancillary services','https://www.pjm.com/markets-and-operations','Separate energy, capacity and ancillary market activities; no implied simultaneous dispatch rights.')},
 es:{
  'LOGIC-ES-OMIE':source('OMIE · Day-ahead market','https://www.omie.es/en/mercado-de-electricidad','Executed energy trading; the illustration contains no observed price series or capture calculation.'),
  'LOGIC-ES-REE':source('Red Eléctrica · Participation in balancing services','https://www.ree.es/es/clientes/representante/participacion-en-servicios-de-balance/como-participar-en-los-servicios-de-balance','System-operator qualification is required before participation.'),
  'LOGIC-ES-CAPACITY':source('BOE · Order TED/966/2026, peninsular capacity market','https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-19329','Arts. 3, 7, 10–11, 15, 22 and 27: firm capacity, auction award, aid treatment and obligations. Enactment does not establish a project award.'),
  'LOGIC-ES-GRANT':{title:'MITECO · PINALM investment support awards',url:'https://www.miteco.gob.es/content/dam/miteco/es/prensa/20251230_NdP.%20El%20MITECO%20asigna%20818%20millones%20a%20126%20proyectos%20que%20reforzar%C3%A1n%20el%20almacenamiento%20energ%C3%A9tico%20a%20gran%20escala%20en%20todo%20el%20pa%C3%ADs.pdf',locator:'Existing Spain research source, read 29 October 2026. Investment support and awarded projects; not recurring service remuneration.',checkedOn:'2026-10-29'},
 },
 ca_on:{
  'LOGIC-ON-PROCUREMENT':source('IESO · Second Long-Term Request for Proposals','https://www.ieso.ca/Sector-Participants/Resource-Acquisition-and-Contracts/Long-Term-2-RFP','Capacity and energy streams and their separate windows; subsequent draft windows do not amend executed earlier contracts.'),
  'LOGIC-ON-CONTRACT':source('IESO · LT2(c-1) final consolidated contract, 4 November 2025','https://www.ieso.ca/-/media/Files/IESO/Document-Library/long-term-rfp/capacity/LT2c-1-20251104-Contract-Consolidated-with-Addendum-1-and-2-and-3.pdf','Articles 2–4 and Exhibit J: operating duties, other products, capacity commitments, monthly payment and storage adjustments. Form terms are not proof of an individual award.'),
 },
 sa:{'LOGIC-SA-PROCUREMENT':source('Saudi Press Agency · SPPC storage procurement qualification','https://www.spa.gov.sa/en/N2568317','22 April 2026: BOO project companies contract with the Principal Buyer through a Storage Services Agreement. The notice does not disclose tariff, deductions or operating-rights allocation.')},
};
