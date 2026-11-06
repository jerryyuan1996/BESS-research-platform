# 逐市场验收表

范围：15 个市场；另 3 个市场明确排除。本表区分设备证据、跨投资人／双语回归与内容确认。

公共版本：2026-11-06.1。设备记录：45/45；首屏／缓存／页面错误检查：通过。
跨投资人完整矩阵：45/45 设备市场用例通过，等于 360 个投资人×语言×市场×设备组合。

| 市场 | 桌面首屏／场景／缓存 | iPad 触控 | 手机触控 | 四类投资人 × EN/ZH × 三视口 | 内容确认 |
|---|---|---|---|---|---|
| 西澳 WEM (wa) | 通过 | 通过 (touch) | 通过 (touch) | 24/24 组合通过 | 公共编辑待 Jerry 确认；原 G-1/G-2 范围保留 |
| 澳洲 NEM (nem) | 通过 | 通过 (touch) | 通过 (touch) | 24/24 组合通过 | 公共编辑待 Jerry 确认；原 G-1/G-2 范围保留 |
| 英国 (gb) | 通过 | 通过 (touch) | 通过 (touch) | 24/24 组合通过 | 公共编辑待 Jerry 确认；原 G-1/G-2 范围保留 |
| 德国 (de) | 通过 | 通过 (touch) | 通过 (touch) | 24/24 组合通过 | 公共编辑待 Jerry 确认；原 G-1/G-2 范围保留 |
| 意大利 (it) | 通过 | 通过 (touch) | 通过 (touch) | 24/24 组合通过 | 公共编辑待 Jerry 确认；原 G-1/G-2 范围保留 |
| 爱尔兰 (ie) | 通过 | 通过 (touch) | 通过 (touch) | 24/24 组合通过 | 公共编辑待 Jerry 确认；原 G-1/G-2 范围保留 |
| 罗马尼亚 (ro) | 通过 | 通过 (touch) | 通过 (touch) | 24/24 组合通过 | 公共编辑待 Jerry 确认；原 G-1/G-2 范围保留 |
| 波兰 (pl) | 通过 | 通过 (touch) | 通过 (touch) | 24/24 组合通过 | 公共编辑待 Jerry 确认；原 G-1/G-2 范围保留 |
| 日本东京／关东 (jp_tokyo) | 通过 | 通过 (touch) | 通过 (touch) | 24/24 组合通过 | 公共编辑待 Jerry 确认；原 G-1/G-2 范围保留 |
| 日本九州 (jp_kyushu) | 通过 | 通过 (touch) | 通过 (touch) | 24/24 组合通过 | 公共编辑待 Jerry 确认；原 G-1/G-2 范围保留 |
| 日本北海道 (jp_hokkaido) | 通过 | 通过 (touch) | 通过 (touch) | 24/24 组合通过 | 公共编辑待 Jerry 确认；原 G-1/G-2 范围保留 |
| 美国 PJM (pjm) | 通过 | 通过 (touch) | 通过 (touch) | 24/24 组合通过 | 公共编辑待 Jerry 确认；原 G-1/G-2 范围保留 |
| 美国 ERCOT (ercot) | 通过 | 通过 (touch) | 通过 (touch) | 24/24 组合通过 | 公共编辑待 Jerry 确认；原 G-1/G-2 范围保留 |
| 美国 CAISO (caiso) | 通过 | 通过 (touch) | 通过 (touch) | 24/24 组合通过 | 公共编辑待 Jerry 确认；原 G-1/G-2 范围保留 |
| 芬兰 (fi) | 通过 | 通过 (touch) | 通过 (touch) | 24/24 组合通过 | 公共编辑待 Jerry 确认；原 G-1/G-2 范围保留 |

| 本轮未纳入 | 状态 |
|---|---|
| ca_on 安大略 | 原功能保留；公共 Story 内容缺口仍在 |
| sa 沙特 | 原功能保留；公共 Story 内容缺口仍在 |
| es 西班牙 | 原功能保留；公共 Story 内容缺口仍在 |

设备验证使用 Windows 上的 Chromium：iPad／手机为指定视口与触控仿真，未宣称实体设备实测。桌面完整 E2E 的默认视口为 1440×1000，另有本表 1440×900 的独立首屏截图。

全部设备记录都验证关闭后的触发焦点、重复章节加载零资源请求及无页面错误。专项另验键盘、Back/Forward、版本／语言深链接、减少动态效果、章节／场景／弹窗加载失败与重试、日本区域切换后的最终来源清单，以及手机原生横向触控手势。

## 完整命令门禁

| 命令 | 实际退出码 | 用时（秒） |
|---|---|---|
| npm test | 0 | 303.4 |
| npm run test:current | 0 | 3.9 |
| npm run build | 0 | 41.6 |
| npm run test:budget | 0 | 36.9 |
| npm run test:bundle | 0 | 6.6 |
| npm run etl:verify | 0 | 2.9 |
| npm run test:e2e -- --reporter=line,json | 0 | 2342.8 |

未出现在上表的门禁仍为待运行，不能视为通过。保密检查使用真实 marker set 与 fingerprint key，最终构建检查设置 REQUIRE_OUTPUT=1／REQUIRE_MARKERS=1。原本仅在本地保密叠加层存在时才有内容的条件检查，若跳过，会在完整测试日志中单列；它不替代独立的最终构建扫描。

## 样板截图

每组均含首屏摘要与主按钮，以及精细电站剖面。其余市场的三视口首屏／机制场景也已生成，完整 102 张 PNG 的字节数和校验和见 [产物清单](artifact-manifest.json)。完整本地产物目录为执行工作区相邻的 `evidence/public/`。

### 澳洲 NEM

- 桌面 1440×900：[首屏](gallery/nem-desktop-overview.png) · [电站剖面](gallery/nem-desktop-cutaway.png)
- iPad 820×1180：[首屏](gallery/nem-ipad-overview.png) · [电站剖面](gallery/nem-ipad-cutaway.png)
- 手机 390×844：[首屏](gallery/nem-phone-overview.png) · [电站剖面](gallery/nem-phone-cutaway.png)

### 日本东京／关东

- 桌面 1440×900：[首屏](gallery/jp_tokyo-desktop-overview.png) · [电站剖面](gallery/jp_tokyo-desktop-cutaway.png)
- iPad 820×1180：[首屏](gallery/jp_tokyo-ipad-overview.png) · [电站剖面](gallery/jp_tokyo-ipad-cutaway.png)
- 手机 390×844：[首屏](gallery/jp_tokyo-phone-overview.png) · [电站剖面](gallery/jp_tokyo-phone-cutaway.png)

### 日本九州

- 桌面 1440×900：[首屏](gallery/jp_kyushu-desktop-overview.png) · [电站剖面](gallery/jp_kyushu-desktop-cutaway.png)
- iPad 820×1180：[首屏](gallery/jp_kyushu-ipad-overview.png) · [电站剖面](gallery/jp_kyushu-ipad-cutaway.png)
- 手机 390×844：[首屏](gallery/jp_kyushu-phone-overview.png) · [电站剖面](gallery/jp_kyushu-phone-cutaway.png)

### 日本北海道

- 桌面 1440×900：[首屏](gallery/jp_hokkaido-desktop-overview.png) · [电站剖面](gallery/jp_hokkaido-desktop-cutaway.png)
- iPad 820×1180：[首屏](gallery/jp_hokkaido-ipad-overview.png) · [电站剖面](gallery/jp_hokkaido-ipad-cutaway.png)
- 手机 390×844：[首屏](gallery/jp_hokkaido-phone-overview.png) · [电站剖面](gallery/jp_hokkaido-phone-cutaway.png)
