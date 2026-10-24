# BESS：从并网／合同COD到实际收入的空窗

研究复核日：2026-10-23至24日。范围：平台全部16个配置市场、14个独立市场看板。日本三个区域共用国家规则，但不得共用项目获批日期。

## 投资结论

**需要把“可送电”“可参与某个产品”“合同开始支付”“现金到账”拆开。** 这些节点不重合是可建模的风险；但不能把任何国家的FON统一当作所有辅助服务收入的开关，也不能把流程最长期限当作预计延迟。

芬兰是典型案例，但原命题须修正：用户所给2025年流程图已经将备用启动放在FON之前。Fingrid在2026年10月5日更新的正式指引进一步明确，可在最终合规程序完成前提供备用服务；其§3/Table 2区分设备类型和产品，并明确产品本身的市场技术要求仍单独适用。[Fingrid准入指引](https://www.fingrid.fi/globalassets/dokumentit/fi/palvelut/kulutuksen-ja-tuotannon-liittaminen-kantaverkkoon/reserve_start_20260910.pdf)

**COD也不是由ION自动统一定义的法定经济事件。** EPC、收购、融资、优化商保底和容量合同可能各自定义COD／验收／服务开始。应逐份核对，尤其要检查业主已经付款并开始付息、但收入合同先决条件尚未满足的情况。

## 芬兰：如何正确读这张流程图

适用范围为大型储能常见的D类流程；B/C类有不同通知及过渡规则，不可直接套用。

| 节点 | 可支持的结论 | 不能直接推定 |
|---|---|---|
| EON | 可给网络及辅助设备送电 | 已可充放电交易、已达到合同COD |
| ION | 获准在连接点进行有功运行 | 所有备用产品已获批 |
| 日前／日内 | 有功交换许可及其他市场条件同时满足后可参与 | 不需要计量、平衡责任或交易安排 |
| mFRR | D类在有效ION期间可在FON前提供，仍须满足产品资格及协议 | ION本身等于mFRR中标或收入保证 |
| 自动备用 | 需相应投运试验结果经网方审查，并满足各产品技术预认证及市场安排；可早于FON | 通过一个产品就等于FCR-N、FCR-D、aFRR、FFR全部通过 |
| FON | 最终合规流程完成、持续运行获批 | 所有收入必须等到这个节点才出现 |

SJV2024的EON／ION／FON定义及D类期限见§6.4.3。9个月完成投运试验、12个月完成Stage 2，自首次有功送电起算；ION通常有效18个月，延期需要明确批准。它们不是“预计等9／12／18个月”。[SJV2024英文译本](https://www.fingrid.fi/globalassets/dokumentit/fi/palvelut/kulutuksen-ja-tuotannon-liittaminen-kantaverkkoon/sjv2024---unofficial-english-translation.pdf)

将上述网方流程与独立的产品资格／协议叠加，才得到各产品可参与日期。[Fingrid产品参与入口](https://www.fingrid.fi/en/electricity-market/reserves/reserve-products/)

## 其他市场：类似风险存在，但关键节点不同

下表的“风险”是对官方准入规则的投资解释，不是官方公布的当地平均延迟。项目实际日期、罚款、赔偿和付款条款仍需取证。

| 市场 | 收入起算的主要差异 | 股权投资应重点核查 | 官方依据 |
|---|---|---|---|
| 西澳WEM | 能源注册／调试、逐项FCESS认证、RCM容量义务与容量年度分别处理 | 已认证MW、容量分配年度、未按期交付的退款及担保责任 | [注册](https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/participate-in-the-market/registration/register-a-facility-in-the-wem)、[FCESS](https://aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/system-operations/essential-system-services/summary-of-frequency-co-optimised-essential-system-services/seeking-accreditation-for-fcess)、[RCM](https://aemo.com.au/Electricity/Wholesale-Electricity-Market-WEM/Reserve-capacity-mechanism) |
| 澳大利亚NEM | 注册、逐阶段调试放行与FCAS注册分开 | 已释放充放电MW、hold-point报告、各FCAS测试、CIS／私人合同先决条件 | [调试](https://www.aemo.com.au/energy-systems/electricity/national-electricity-market-nem/participate-in-the-market/network-connections/transmission-and-distribution-in-the-nem/completion)、[FCAS／MASS](https://www.aemo.com.au/energy-systems/electricity/national-electricity-market-nem/system-operations/ancillary-services/market-ancillary-services-specification-and-fcas-verification-tool) |
| 英国GB | 输电侧EON／ION／FON与DC／DM／DR准入不同；ION窗口通常24个月 | 各服务测试、SMP及监测接口；容量合同交付年和SCM；toll是否另有验收条件 | [合规](https://www.neso.energy/industry-information/connections/compliance-process)、[动态服务](https://www.neso.energy/industry-information/balancing-services/frequency-response-services/dynamic-services-dcdmdr)、[容量登记](https://www.neso.energy/data-portal/capacity-market-register/capacity_market_unit_cmu) |
| 德国 | 电网运行不替代接入区域TSO的FCR／aFRR／mFRR预认证 | 产品、单元／池、核准MW、实时数据交换和框架协议 | [PQ入口](https://www.regelleistung.net/de-de/Anbieter-werden/Pr%C3%A4qualifikationsverfahren) |
| 爱尔兰 | 系统服务能力证明与服务合同分别成立 | 储能对应试验模板、签约能力、交付时适用的采购机制及过渡条款 | [服务测试](https://www.eirgrid.ie/grid/grid-codes-and-compliance-overview/grid-code-compliance-testing/system-services-testing)、[DS3](https://www.eirgrid.ie/ds3-programme-delivering-secure-sustainable-electricity-system) |
| 罗马尼亚 | 产品技术预认证后，还须BSP参与协议及注册 | RSF／RRFa／RRFm储能测试、认可MW；补助拨付不要误当运行收入 | [BSP条款§3.2](https://www.transelectrica.ro/documents/10179/3992490/Terms%2Band%2BConditions_O127_2021.pdf/7211ec70-803f-49a8-a987-ab9c27bafc64)、[技术程序](https://www.transelectrica.ro/web/tel/proceduri-ce-decurg-din-implementarea-codului3) |
| 波兰 | DUB平衡服务认证与容量市场合同分开 | 技术资格、调度单元、容量认证、交付年度、履约担保 | [DUB](https://www.pse.pl/-/zmiany-na-rynku-bilansujacym-zasady-kwalifikacji-dostawcy-uslug-bilansujacych-dub-czesc-i-i-czesc-ii)、[容量FAQ](https://www.pse.pl/faq-rynek-mocy) |
| 意大利 | 投运并不自动满足MACSE交付要求；MACSE参考规则包含MSD资格 | 已签中标文件、技术报告、调度资格、交付期；不能假设失约后自动顺延 | [接入](https://www.terna.it/it/sistema-elettrico/programmazione-territoriale-efficiente/connessione-rete/procedura-connessione)、[MACSE参考规则](https://download.terna.it/terna/Disciplina_MACSE_finale_8dc5adee4100d68.pdf) |
| 日本：东京／九州／北海道 | 区域TSO并网、EPRX逐产品事前审查、容量／LTDA合同各有条件 | 控制通信施工、实动测试、获准模式和产品；交付年度；逐地区批准 | [EPRX FAQ](https://www.eprx.or.jp/contact/jukyuchoseishijo/faq.html)、[现行储能指引](https://www.eprx.or.jp/outline/announcement.html)、[OCCTO 2026交付规则](https://www.occto.or.jp/various/capacity-market/jitsujukyukanren/2026_jitsujukyu_kanren.html) |
| 美国PJM | 能源运行、调频资格、容量资格与交付期不等同 | Manual 12下的调频试验和遥测；Manual 18下容量认定及履约 | [Manual 12，Rev 57](https://www.pjm.com/-/media/DotCom/documents/manuals/m12.pdf)、[Manual 18，Rev 63](https://www.pjm.com/-/media/DotCom/documents/manuals/m18.pdf) |
| 美国ERCOT | QSE与资源都需取得相关辅助服务资格 | QSE代表安排、逐项AS认证、实测能力；不能以QSE注册代替资源获批 | [QSE](https://www.ercot.com/services/rq/qse)、[Nodal Protocols§8.1.1.2.1](https://www.ercot.com/files/docs/2026/03/29/April-1-2026-Nodal-Protocols.pdf) |
| 美国CAISO | NRI的COD／COM、AS认证、RA可交付性及供给安排分别处理 | 计量遥测合规证书；AS产品认证；认可容量及RA供给计划／合同 | [NRI](https://www.caiso.com/generation-transmission/generation/new-resource-implementation)、[AS](https://www.caiso.com/market-operations/products-services/ancillary-services)、[RA](https://www.caiso.com/generation-transmission/resource-adequacy) |
| 加拿大安大略 | IESO授权、设备注册和性能验证、LT1合同COD、调频采购分别处理 | 避免把已含在LT1合同COD中的调试期重复加到COD之后；核对合同修订 | [接入流程](https://ieso.ca/Sector-Participants/Connection-Process/Overview)、[LT1合同](https://www.ieso.ca/-/media/Files/IESO/Document-Library/long-term-rfp/LT1-Contract-20230929.pdf)、[调频采购](https://www.ieso.ca/Sector-Participants/Resource-Acquisition-and-Contracts/Regulation-Service-RFP) |

## 如何比较投资风险

NEM的CIS还存在单独的合同门槛。DCCEEW明确，项目须已运行并产生收入，且每份CISA适用其具体条件；不能从首次试送电推定支持款已起算。[CISA持有人指引](https://www.dcceew.gov.au/energy/renewable/capacity-investment-scheme/open-cis-tenders/information-for-cisa-holders)

1. **收入组合决定暴露。** 调频主导项目最敏感的是备用准入；容量／长期合同主导项目更应检查交付窗口和合同生效，而非只看频响测试。
2. **可银行融资的确定性来自合同条件和责任分配。** “已有保底”仍不足：保底可能在全部产品通过后才开始，或将调试／网方延误排除在赔偿范围之外。
3. **资格、成交、收款是三件事。** 获得资格只允许参与，不保证有中标量或正收入。结算及回款延迟还会增加流动性需求。
4. **存在共同延误因素。** OEM控制器、现场性能、通信与SCADA问题可能同时影响多个产品；不要将各产品延迟视为独立、相互抵消的风险。
5. **后续整改可能造成再次中断。** 许可到期、模型验证未完成或硬件／控制器重大变更，可能触发限制、重试或重新认证。关注未决事项清单，而不只看首次成功测试。

这些是投资推论；不能据此推定某市场具有固定的“3个月”或“6个月”延迟。

## 财务模型的具体调整

输入分别设置能源、辅助服务、容量、toll／保底／长期中标的起算月和线性爬坡月数，均相对于本次测算使用的合同COD。若有逐产品资料，可将备用收入按产品分配，权重合计必须为100%；权重代表收入分配，不代表可同时承诺同一MW。

每项收入的实际起算，应取适用条件中最晚日期：

`收入准入日 = max(网方运行许可, 产品资格, 计量/通信/平衡及交易准备, 合同生效/交付起点)`

缺少必要日期就是未核实，不能填“官方0个月”。平台保留现有公开参考案例的“COD时全部就绪”假设，并在页面上明确标注；3／6／12个月是压力情景，不是官方等待期。不能在没有项目证据时，为各国凭空添加一个平均等待期并据此改变市场排名。

计算先按月对收入可实现比例积分，再汇总至原有年度现金流。完整运营年的价格、费用、衰减、饱和曲线、合同到期及资产寿命继续原时间表。延期收入不会自动移到额外运营年补回。借款现金流和债务覆盖继续读取调整后的运营现金流。

保底按具备合同资格的月份参与计算，不能用后半年生效的保底覆盖前半年空窗。固定toll与另行保留的容量收入分别受合同门槛和容量门槛控制。CIS补足／分享条件在可参与月份按比例筛查，随后保持名义化与收购估值的相同口径；实际项目若采用不同年度结算方法，应输入其项目现金流。

可另填临时许可到期与最终批准／恢复许可的月份：到期后暂停收入，直到有明确恢复日期；不填恢复日期就不假设自动恢复。这个开关仅用于明确输入的项目情景，不自动断言各市场同受18个月限制。额外调试／持有费用使用独立金额及持续月数，不能重复扣除已有固定运维费用。

收购估值、长期现金流、债务测算与下载的案例同步承接时间输入。运营资产的输入仍从原始COD计时，按实际运营年龄截取剩余现金流；不能把过去的认证期再次加在收购日后。

### 模型边界

该版本是收入准入筛查模型。收入按月启用，但仍按年末现金流折现；它不是逐日XIRR、季节性调度优化或完整融资模型。分产品权重必须来自可行的优化安排，不能额外叠加备用MW。没有自动假设施工违约金、容量违约罚金、VAT桥贷、保险赔款、DSRA或保底合同的特例救济，也没有假设这些金额为已落实的补偿。完整项目模型应加入真实收支日期、税费、债务和合同条款。

## 芬兰量化示例：收入权重远比图上的一个节点更重要

平台现有芬兰种子值：日前交易毛收入€78,000/MW/年，扣10%费用后€70,200；备用€15,080，仅覆盖年度FCR-D分摊，未含小时级备用。净交易收入合计€85,280，备用占比约17.7%。**这是现有模型假设，不是对芬兰项目实际收入占比的最新市场估计。** 因此必须允许用户按项目证据调整收入拆分。

以下均采用同一总净收入、现有成本／衰减／建设期、市场化收入路线、无杠杆15年持有；仅改变备用收入权重和起算时间。80%是用于说明风险的假设，不是研究得出的芬兰全国占比。

| 备用权重 | 延迟 | 首年净收入 €/MW | 持有IRR | 相对同收入无空窗 |
|---|---:|---:|---:|---:|
| 现有模型17.7% | 0个月 | 85,280 | 14.59% | — |
| 现有模型17.7% | 6个月 | 77,740 | 14.24% | −0.34个百分点 |
| 现有模型17.7% | 12个月 | 70,200 | 13.90% | −0.68个百分点 |
| 示意80% | 0个月 | 85,280 | 14.59% | — |
| 示意80% | 3个月 | 68,224 | 13.82% | −0.77个百分点 |
| 示意80% | 6个月 | 51,168 | 13.08% | −1.50个百分点 |
| 示意80% | 12个月 | 17,056 | 11.71% | −2.87个百分点 |

例如80%备用权重、延迟六个月，首年损失为`85,280 × 80% × 6/12 = €34,112/MW`，并未减少原有固定费用。IRR下降1.50个百分点是这些指定假设下的测算结果，不能直接作为特定项目报价调整。

## 投资及合同落实清单

建议在签约前取得同一份、由责任方确认的里程碑表：

| 项目 | 负责人／所需证明 | 决策用途 |
|---|---|---|
| EPC、融资、收购及收入合同各自COD | 已签定义及先决条件 | 找出“业主已支付、收入未开始”的错配 |
| 每种产品的试验、批准、核准MW及尚未解决的问题 | 网方／TSO、BSP、OEM、调试方 | 计算可实现收入日期，而不是只记FON |
| 保底、toll、容量及长期中标的生效／交付日 | 优化商或合同买方确认 | 确认首年收入究竟受保护多少 |
| 网方／设备／通信延误责任 | EPC、OEM和优化商条款及赔偿上限 | 确认缺口由谁承担，以及赔款是否可收取 |
| 许可到期、重新测试、错过窗口后的安排 | 明确批准的延期、应急计划、担保要求 | 测试流动性及额外股本需求 |
| 实际结算和回款周期 | 交易／结算协议及保证金要求 | 将“有收入”转化为现金可用于偿债的日期 |

可以谈判的措施包括与关键产品获批挂钩的EPC尾款、分阶段验收、明确的lost-revenue赔偿、在测试期即生效的保底安排，以及按实际缺口测算的流动性储备。它们应作为谈判目标，不能在模型中预先视为已经获得。

## 页面入口与可复现性

- 每个市场的“进入与交付／并网”新增“每项收入究竟何时开始”，含规则、取证事项、来源、敏感性与情景入口。
- “跨市场回报对比”新增统一六个月辅助服务延迟的比较；采用各市场现有权重，不把压力情景误称为当地预测。
- “投资测算”新增起算／爬坡／收入权重／产品分配／许可期限／额外成本，可传递到收购及参考建设成本计算，并保存在案例导出中。
- 零延迟参考值保留；只有输入或选择情景后才调整该案例，避免凭空改写各市场已有基准判断。

基础规则复核与项目事实是不同层次。官方来源并未提供可用于所有项目的平均等待期；本报告不声称已经取得具体项目的产品审批日、可交易MW或实际合同付款日。
