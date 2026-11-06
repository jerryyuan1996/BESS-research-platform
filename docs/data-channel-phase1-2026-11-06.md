# 第一阶段：公开数据渠道接入与内容增补

核查及实施日期：2026-11-06。本文保留首轮实现 `df24f73` 的验收记录，当时尚未合并、部署或在生产定时环境验收；后续合并、CI、发布及生产采集状态以 [PR #170](https://github.com/jerryyuan1996/BESS-research-platform/pull/170) 和关联 Actions 记录为准。原 A01–A14 清单是候选计划，不是完成清单。

## 实际范围

本阶段新增一个官方来源的两类渠道、三个独立数据集：Elexon 指示性系统买／卖不平衡结算价，以及系统净不平衡电量。另增加西澳既有价格快照的只读半小时覆盖审计。EIA 储能专项表完成真实下载与字段验证，未接入项目转换或公共项目清单。

开工时匿名 Git 远端核对：`main=c0229820ff609e38f45b259c3abf9a948aaee51c`；PR #159 仍 open/draft，分支 `feat/policy-intelligence-v4=c2e558d72e6f26a10bec09f098676b060d7fbf07`。本任务使用独立 clone 和 `feat/public-data-channels-phase1`，未编辑已存在的工作树。共享工作树中的未跟踪文件保留原状。

发布整合阶段核对的 main 为 `966ce1af673590620518bfae5ee163621eab3369`，已包含独立完成的 PR #171。该 main 已无冲突地整合到本分支；整合后的提交必须重新通过 CI，首轮旧基线的绿色结果不能代替这次核验。

现行 `.github/workflows/etl.yml`、每六小时刷新、`live-data` 并发锁和发布链保持不变。没有新增 cron、私有存储、账号、API key、付费请求、Policy 开关或投资写入授权。全部旧 22 个数据集目录记录经逐对象比较保持一致；新数据 `bearsOn: []`。

## 已实施：A04 的 Elexon DISEBSP 子集

| 数据集 | 原始字段 | 单位及意义 | 验证与输出 |
|---|---|---|---|
| `gb-imbalance-buy` | `systemBuyPrice` | GBP/MWh，指示性系统买入／cash-out 价 | 独立价格序列；不替换 `gb-day-ahead` |
| `gb-imbalance-sell` | `systemSellPrice` | GBP/MWh，指示性系统卖出／cash-out 价 | 与买入字段分别保存，即使当前单一价格机制下数值相等 |
| `gb-net-imbalance-volume` | `netImbalanceVolume` | 每半小时的有符号 MWh；正为系统短缺，负为系统过剩 | 独立 `metric` schema；不是 MW、采购量或单电池调度量 |

官方机器入口：`https://data.elexon.co.uk/bmrs/api/v1/balancing/settlement/system-prices/{YYYY-MM-DD}?format=json`。只取公开 DISEBSP，无登录、密钥或前端抓取。[官方 API 说明](https://developer.data.elexon.co.uk/)、[字段与刷新说明](https://bmrs.elexon.co.uk/system-prices)、[结算含义](https://www.elexon.co.uk/bsc/settlement/imbalance-pricing/)。

### 权利及自动获取条件

适用的是 [Elexon BMRS Open Data Licence](https://www.elexon.co.uk/bsc/data/balancing-mechanism-reporting-agent/copyright-licence-bmrs-data/)，其定义明确包括 Insights Solution 上的 BMRS 数据，允许复制、适配及商业再利用；个人数据、无权许可的第三方权利和标识等不在许可内。下载 API 与许可页均已匿名 HTTP 200 验证。本连接器只保留系统汇总数字、时间与发布状态，不获取个人或参与者身份。

原始快照及摘要携带许可链接和要求的署名：

> Contains BMRS data © Elexon Limited copyright and database right 2026.

许可不构成官方背书，亦不保证供给持续或准确性。每次来源许可发生变化时仍需复核；没有将“公开可访问”当作一般转载授权。

### 时间、历史、节奏和预算

- 原始粒度为半小时。保存来源明确给出的 UTC 起始时间、`settlementDate`、`settlementPeriod`、`createdDateTime`，以及 `bsadDefaulted`、`priceDerivationCode`。结算日为 `Europe/London`；夏令时切换日应有 46 或 50 个期间，普通日 48 个。
- 数据是 **indicative**，来源会进行 D+1 修订；本阶段没有声称取得最终结算价格。较旧来源版本不能覆盖已保存的新版本，同一响应内相同发布版本的矛盾数据被拒绝。
- 沿用原执行器和 365 日滚动窗口。每轮至多六个独立日请求，由三个指标共享：两天复查、最多四天补齐；若三个历史窗口不同，超出公共预算的工作留待以后。不开独立定时任务。
- 单次请求 20 秒超时覆盖响应头和完整响应体，仅一次尝试，沿用共享响应大小限制。共享 HTTP helper 新增可选的外部 AbortSignal；旧调用未传 signal，保留原行为。专项测试模拟了收到 200 响应头后不再发送正文，并验证六个受控请求全部被取消。401、403、429 会停止本逻辑周期的新请求，不切换身份或绕过限制。其他日期的坏格式、空值或缺失分别隔离。
- 部分日缺失时，那个日期的旧点保留，其他完整日仍可前进；整个来源没有完整日返回时，真实执行器保留 last-good 文件，报告失败。缺失不填零或插值。
- 首次候选只覆盖少量最近完整日，不代表全年齐全。多年归档、2025 全年回填和最终结算历史均未实施；过窗历史样本没有塞入滚动快照。
- 原始文件与摘要都按内容校验值写入，只有检查时间变化时不重写。摘要包含独立的指标类型、单位、结算状态和本地日覆盖计数；没有通用价格价差、套利指数或收入桥。

`kind: metric` 路径要求明确单位、间隔、覆盖、数值范围、排序及唯一时间点，不使用价格中位数倍率判据。旧价格校验的边界、倍率和容错保持原样，专项测试验证这一点。新增来源不会自动影响 `economics.merchGross`、rules、方法、RTE、折现率或收益参数。

### 实际下载验证

| 样本 | HTTP／格式 | 实际覆盖和结果 |
|---|---|---|
| 2026-11-04 | 200，JSON，42,070 字节 | 48 行／48 个唯一期间；UTC 00:00 至 23:30 |
| 2025-10-26 历史回拨日 | 200，JSON，44,526 字节 | 50 行／50 个唯一期间；UTC 2025-10-25 23:00 至 2025-10-26 23:30 |
| BMRS 许可页 | 200，HTML，191,838 字节 | 核对许可范围、转载、署名和例外 |
| 真实执行器 dry-run | 成功，无公共文件写入 | 三个指标各 288 点，6 个共享日请求；零 drift findings |
| 真实执行器首次写入 | 成功，原 boundary writer 生成三组文件 | 各 288 点；UTC 2026-10-31 00:00 至 2026-11-05 23:30，6 天；零 unavailable／drift findings |
| 完整响应体期限修复后的增量 dry-run | 成功，未改写已保存的 288 点样本 | 各 480 点候选；复用六个日请求补进四个更早完整日，零 unavailable／drift findings |

样本 SHA-256：近期 `5b89e78e7b523130fbf85dedf0cfd4ca88942950030afafd35f70b4f68cd95d0`；历史 `fb93fe2ba88641c1479c78b0715754e12ee5523cafa74ba6d16a2ca6e8053759`；许可页 `becde4d5f152dba31af9cf599d04d8a17eb7cd9d5119e0ef020aa106ac4c57b3`。原始研究下载保留在任务目录、仓库之外，没有把整页许可正文或历史响应当成测试 fixture。

## 已实施审计，未修补价格：A02

运行 `node scripts/audit-wem-coverage.mjs`，只读取现有公开 `wa-wem-prices`，不请求网络、不写文件、不改变连接器。

基线快照校验值 `sha256:7233438c58a73123e92b2e6d61baa32d34c4b713005af545001f161c8509bec9`：首尾观测为 2025-11-06 07:00 UTC 至 2026-11-05 23:30 UTC。这个范围内应有 17,506 个半小时，实有 17,463 个，差 43 个；重复、坏点及偏离时间网格均为零。缺口分布在 UTC 2025-11-27、2025-11-30、2026-05-14。

这证明“每个日期都出现过”不能证明半小时完整。尚未逐个重取官方文件、分类 `isPublished:false` 或生成采纳候选，因此 **没有修补 43 个价格、重算 WA 套利或修改旧快照**。审计只衡量首尾观测之间，不能证明更早或更晚日期不存在缺失。

## 技术验证成功，未实施：A09

匿名下载 [EIA 2025 年度 ZIP](https://www.eia.gov/electricity/data/eia860/xls/eia8602025.zip)：HTTP 200，23,622,347 字节；实际解压 `3_4_Energy_Storage_Y2025.xlsx`，457,955 字节。用仓库已有 workbook adapter 读取 `Operable`，表头为第 2 行：1,013 条数据记录，1,003 条 `Prime Mover=BA` 记录，这 1,003 条均有正的铭牌 MWh 和最大放电 MW。另存在 Proposed 与 Retired/Canceled 表，不能混算为在运。

已确认字段：Plant Code、Generator ID、Nameplate Energy Capacity (MWh)、Maximum Charge Rate (MW)、Maximum Discharge Rate (MW)。同时修正既有解析器的错误注释，将“年度表没有 MWh”改成“当前 Plant-only join 尚未读取储能专项表”；转换逻辑、输出和公共项目未变。本阶段没有据此宣称 PJM／ERCOT／CAISO 的匹配覆盖率。

权限依据：[EIA Copyrights and Reuse](https://www.eia.gov/about/copyrights_reuse.php)。EIA 自产统计可复制分发，须保留来源及版本日期；第三方保护材料和标识不在此次统计数据复用范围。年度 ZIP SHA-256 为 `2b27929d26cc1da9ad6a530da1cac6718cd8496098ee560c4d47cfffd96d08ba`；储能工作簿为 `22e93d60ba46c7c878bffb225d625a3ac52538687ccccb09059ad5e4945f2a8e`。

下一步需按 Plant Code＋Generator ID 精确关联、区分状态与年度修订、报告未匹配项并验证功率口径。现有 `energyMWh(project)` 以 `capacityMW * durationHours` 反推 MWh，而月表 `capacityMW` 是铭牌 MW；若把“铭牌 MWh／最大放电 MW”的时长直接写入，且两种 MW 不等，反推 MWh 会错误。实际样本中有 161／1,003 条电池记录的铭牌 MW 与最大放电 MW 相差超过 0.001 MW；这是全美 Operable 电池样本，尚未按目标市场关联。应先保留显式能量与分母来源，再设计兼容 schema，不能机械补一个时长。月表自动发现、版本缓存、坐标关联和持久归档也尚未实现。

## 这些数据可以如何丰富现有内容

| 已有内容 | 新证据可以补什么 | 当前交付与尚待工作 |
|---|---|---|
| GB 能源及辅助服务研究 | 按系统短缺／过剩分组的 cash-out 分布、极端价格、季节性，以及价格与系统状态的共同变化 | 数据目录、静态数据文件和按日摘要已接入；`/data` 显示来源、覆盖和时效，专门的 GB 图表与年度历史分析未制作 |
| GB 价格机会与收入判断 | 区分“系统存在机会”和“项目实际捕获”；能识别价格压力发生的时间和方向 | 不能将 NIV×系统价当成电池净收入；仍需项目调度、可用率、合同和费用等证据 |
| WA 数据质量 | 精确列出首尾范围内缺失半小时，避免虚假的“完整日”判断 | 审计可复现；重取、修订分类与价格采纳留待下一批 |
| 美国供给与时长研究 | 在精确匹配后，统计真实 MWh、不同分母的时长、竞争电量，而非只比较 MW | 仅下载／字段验证；现有地图、项目规模和经济假设没有改动 |

## A01–A14 本批状态

| 原项 | 本批状态 | 具体界限／下一步 |
|---|---|---|
| A01 NEM 连续价格／FCAS | 未验证、未实施 | 按表核对许可及匿名 ZIP，小批预算，不能假定整库和全部年份可用 |
| A02 WA 价格／FCESS | 覆盖审计已实施；修补／新 FCESS 未验证 | 43 缺口尚未分类；不插值或覆盖现价 |
| A03 WA 容量获配 | 未验证、未实施 | 保留为独立 AEMO 市场数据候选；不解除 WA.gov.au 政策停采 |
| A04 GB Elexon | DISEBSP 已实施 | 买／卖价和 NIV；未实施 BOD、单元报价或全部 BM 指标 |
| A05 FI 采购／投标／激活 | 未验证、未实施 | 既有 Fingrid 连接器与授权保持原样，未读取、复制或改变 API 凭据 |
| A06 OMIE | 未验证、未实施 | 具体文件许可、粒度与夏令时仍需逐样本核验 |
| A07 CAISO OASIS | 未验证、未实施 | 未查询节点；不得把其他服务或 AWS 历史下载授权带入 |
| A08 Ontario 归档 | 未验证、未实施 | 滚动报表的发现、修订保留与归档预算需要下一小批处理；不承诺全年覆盖 |
| A09 EIA 月／年表 | 年度储能表技术验证成功，未接入 | 月表刷新、项目精确关联、MWh schema 与版本保存待做 |
| A10 JEPX | 既有接入未变；扩展未验证 | 未新增早年回填、回测或改变现有 9h 派生指标 |
| A11 NESO EAC 扩展 | 未验证、未实施 | 原 DC／DM／DR 过滤与输出保持原样；BR／QR／SR 待独立验证 |
| A12 GB／NEM 项目刷新 | 未验证、未实施 | 未将季度规划／排队容量当作在运，也未添加默认时长 |
| A13 日本／PJM 容量资料 | 未验证、未实施 | 日本来源需另验；仅限内部的 PJM 材料不适用于本公共流水线 |
| A14 Saudi 公告事实 | 未验证、未实施 | 未批量复制正文、推算 SSA 费率或打开回报引擎 |

C、D 类来源及另行提出的八组候选均未抓取、未接入、未作为 fixture。本批没有把“私人研究”解释成商业使用或公开再分发许可，也没有建设新的隔离或授权系统。

## 验证和回滚

专项覆盖正常／DST 日期、重复与修订顺序、单位及 schema、空／坏／部分响应、限流停止、共享请求预算、完整响应体取消、last-good 文件保留、并行其他来源、无变化不写入及旧价格判据回归。新增专项 20 项通过；连同原 governance 套件的定向运行共 76 项通过。

| 检查 | 本地结果 |
|---|---|
| 最终 `npm test`，构建后及完整响应体期限修复后 | 1,457 通过，0 失败、0 跳过 |
| `npm run test:current` | 84 通过；未重生成 baseline |
| `npm run build` | 成功；原有大 chunk 提示仍存在，受治理的体积预算通过 |
| `REQUIRE_OUTPUT=1 REQUIRE_MARKERS=1 npm run test:bundle` | 7 通过，构建和 tracked tree 已实际扫描 |
| `REQUIRE_OUTPUT=1 npm run test:budget` | 32 通过，无跳过 |
| `npm run etl:verify` | 20 个公开原始快照的校验值全部通过，包括新增三个 |
| 桌面／移动端 `npm run test:e2e` 初跑 | 288 通过、2 个移动端地图用例达到原有 60 秒超时；初跑日志、截图及 trace 保留 |
| 移动端地图文件独立复跑 | 原断言及超时不变，单 worker 跑完整文件：8／8 通过，耗时 2.1 分钟；不能将其描述成首次整套 290／290 全绿 |
| 旧目录及输入回归 | 旧 22 个数据集逐对象一致；旧源及其快照、workflow、model、rules 未改动，EIA 仅改错误注释 |

本地 Node 为 26.2.0，仓库 CI 使用 `.nvmrc` 的 Node 22；CI 的结果需单独报告。浏览器测试使用仓库原断言和两种视口，通过任务目录外部配置只指定本副本的预览目录、独立端口和结果目录，防止复用其他工作树的服务。没有修改生产地址或仓库的 Playwright 配置。测试通过不等同于生产上线。

未来可用普通 revert 回滚本阶段提交，移除新增模块、目录／执行器注册及本阶段新增的三组快照与摘要，恢复公共 validator 的前一版本。既有 ID、来源、旧快照、模型和工作流不依赖这些新输入；Git 中的来源历史继续保留，不通过 reset、清理或重生成抹除。首轮实现未执行回滚、合并或部署；后续发布记录见 PR #170。
