// Operational receipt for the user-requested manual update, not policy claims.
// Dates describe source access, never legal publication or independent validation.
export const SOURCE_CHECK_DATE='2026-11-12';
export const SOURCE_CHECKS=[
  {market:'de',mode:'collector',title:['Germany · AgNes official register','德国 · AgNes 官方程序目录'],url:'https://www.bundesnetzagentur.de/1059162'},
  {market:'gb',mode:'collector',title:['Great Britain · Connections reform','英国 · 并网改革'],url:'https://www.ofgem.gov.uk/decision/decision-connections-reform-package-tm04'},
  {market:'nem',mode:'collector',title:['NEM · AEMO IESS technical implementation','NEM · AEMO 储能接入技术实施文档'],url:'https://tech-specs.docs.public.aemo.com.au/Content/TSP_EMMS_June2024/Integrating_Energy_Storage.htm'},
  {market:'nem',mode:'web',title:['NEM · AEMO IESS implementation timeline','NEM · AEMO 储能接入实施时间表'],url:'https://www.aemo.com.au/initiatives/major-programs/nem-reform-program/nem-reform-program-initiatives/integrating-energy-storage-systems-project'},
  {market:'wa',mode:'collector',title:['Western Australia · ERA capacity benchmark procedure','西澳 · ERA 容量基准价格程序'],url:'https://www.erawa.com.au/markets/wholesale-electricity-market/information-rule-participants/wem-procedures/wem-procedure-brcp'},
  {market:'wa',mode:'web',title:['Western Australia · AEMO investment-certainty implementation','西澳 · AEMO 投资确定性改革实施'],url:'https://www.aemo.com.au/consultations/current-and-closed-consultations/aepc_2025_21'},
];
