# 完整历程与日期语义 · 验收记录

公共版本 2026-11-06.3。本次迁移18市场已有研究；软件验收不构成新的 Jerry 内容签核。

- 来源完整性：16所有者、90独立节点、104路由展示实例；完整双语y/t/p/i、开篇、why、来源、支撑序列及WA／日本上下文由原表达式契约保护。
- 跨投资人：18市场四类入口×EN/ZH×桌面／手机／纵向iPad的实际渲染；横屏iPad对18市场核对完整双语长内容。
- 交互：长内容滚动、来源开合、触控、键盘、关闭焦点／页面位置、语言阅读锚点、重开、章节深链接、Back/Forward、日本切区、失败重试和reduced motion均在完整E2E与实测中检查。GB／WA锚点保留严格偏移回归。
- 72条设备×市场诊断：零页面错误，缓存切章新增资源均为0，全部资源计数未过滤。
- 15原公共市场SVG保留；ca_on/sa/es仅迁移历史，不补造投资逻辑、模型或Story批准。

|最终本地命令|退出码|日志|
|---|---|---|
|`npm run build`|0|C:\Users\Jerry\Documents\Codex\2026-11-06\task-5\evidence\history-gates\20261106T191442Z\build.log|
|`local preview identity rehearsal`|0|C:\Users\Jerry\Documents\Codex\2026-11-06\task-5\evidence\history-gates\20261106T191442Z\preview-identity.log|
|`npm run test:budget`|0|C:\Users\Jerry\Documents\Codex\2026-11-06\task-5\evidence\history-gates\20261106T191442Z\budget.log|
|`npm test`|0|C:\Users\Jerry\Documents\Codex\2026-11-06\task-5\evidence\history-gates\20261106T191442Z\unit.log|
|`npm run test:current`|0|C:\Users\Jerry\Documents\Codex\2026-11-06\task-5\evidence\history-gates\20261106T191442Z\current.log|
|`npm run test:bundle`|0|C:\Users\Jerry\Documents\Codex\2026-11-06\task-5\evidence\history-gates\20261106T191442Z\bundle.log|
|`npm run etl:verify`|0|C:\Users\Jerry\Documents\Codex\2026-11-06\task-5\evidence\history-gates\20261106T191442Z\etl.log|
|`npm run test:e2e`|0|C:\Users\Jerry\Documents\Codex\2026-11-06\task-5\evidence\history-gates\20261106T191442Z\e2e.log|

完整Playwright：407通过、0失败、0不稳定、15跳过。原有iPad双项目重复项保持原跳过策略；不以专项代替全量。详见[验证记录](validation.json)。精确head CI、merge和正常发布结果由PR与Actions记录提供，不能将#171的检查当成本候选检查。

[来源覆盖](coverage.md) · [逐节点映射](source-mapping.json) · [批准日期审计](approval-date-audit.md) · [性能对照](performance.md) · [截图目录](gallery.md)
