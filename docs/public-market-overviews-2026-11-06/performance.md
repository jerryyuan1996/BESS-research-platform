# 性能前后记录

单位：等待时间为毫秒；原始响应体字节与 gzip 产物体积分别记录。测试对象为本地固定生产构建，外部 HTTPS 请求关闭，所有数据为本机实测。

基线点击旧研究／Story 按钮，新版点击公共摘要按钮；两者分别反映原路径与新路径的阅读就绪时间。每个记录是一轮冷浏览器上下文，结果用于工程对照，不能解释为统计显著的速度承诺。首屏完成点是对应入口可用，不是全页面网络空闲。原始响应体记录按完成阶段计数，可能包括同页后台工作；gzip 表来自构建文件。

| 市场（桌面） | 原首屏入口 | 新首屏入口 | 原首次弹窗 | 新首次公共章 | 首次机制／SVG | 缓存章节 | 缓存新增资源 |
|---|---:|---:|---:|---:|---:|---:|---:|
| 澳洲 NEM | 2951 | 1299 | 743 | 181 | 233 | 101 | 0 |
| 日本东京／关东 | 7692 | 869 | 2193 | 184 | 130 | 57 | 0 |
| 西澳 WEM | 1609 | 2424 | 777 | 335 | 559 | 301 | 0 |

| 市场／设备 | 首屏已完成响应体 B | 首次章增量 B | 首次机制阶段增量 B |
|---|---:|---:|---:|
| wa / desktop | 1423233 | 28302 | 36020 |
| nem / desktop | 1352716 | 29684 | 36020 |
| gb / desktop | 1352716 | 36105 | 36020 |
| de / desktop | 1352716 | 32229 | 36020 |
| it / desktop | 1353901 | 28862 | 36020 |
| ie / desktop | 1352716 | 30152 | 36020 |
| ro / desktop | 1352716 | 34769 | 36020 |
| pl / desktop | 1424995 | 37852 | 36020 |
| jp_tokyo / desktop | 1426265 | 26748 | 36020 |
| jp_kyushu / desktop | 1425532 | 26748 | 36020 |
| jp_hokkaido / desktop | 1425897 | 26748 | 36020 |
| pjm / desktop | 1352716 | 31902 | 36020 |
| ercot / desktop | 1352716 | 30241 | 36020 |
| caiso / desktop | 1352716 | 34460 | 36020 |
| fi / desktop | 1352716 | 36991 | 36020 |
| wa / ipad | 1423233 | 28302 | 36020 |
| nem / ipad | 1352716 | 29684 | 36020 |
| gb / ipad | 1352716 | 36105 | 36020 |
| de / ipad | 1352716 | 32229 | 36020 |
| it / ipad | 1353901 | 28862 | 36020 |
| ie / ipad | 1352716 | 30152 | 36020 |
| ro / ipad | 1352716 | 34769 | 36020 |
| pl / ipad | 1424995 | 37852 | 36020 |
| jp_tokyo / ipad | 1426265 | 26748 | 36020 |
| jp_kyushu / ipad | 1425532 | 26748 | 36020 |
| jp_hokkaido / ipad | 1425897 | 26748 | 36020 |
| pjm / ipad | 1352716 | 31902 | 36020 |
| ercot / ipad | 1352716 | 30241 | 36020 |
| caiso / ipad | 1352716 | 34460 | 36020 |
| fi / ipad | 1352716 | 36991 | 36020 |
| wa / phone | 1423233 | 28302 | 36020 |
| nem / phone | 1352716 | 29684 | 36020 |
| gb / phone | 1352716 | 36105 | 36020 |
| de / phone | 1352716 | 32229 | 36020 |
| it / phone | 1353901 | 28862 | 36020 |
| ie / phone | 1352716 | 30152 | 36020 |
| ro / phone | 1352716 | 34769 | 36020 |
| pl / phone | 1424995 | 37852 | 36020 |
| jp_tokyo / phone | 1426265 | 26748 | 36020 |
| jp_kyushu / phone | 1425532 | 26748 | 36020 |
| jp_hokkaido / phone | 1425897 | 26748 | 36020 |
| pjm / phone | 1352716 | 31902 | 36020 |
| ercot / phone | 1352716 | 30241 | 36020 |
| caiso / phone | 1352716 | 34460 | 36020 |
| fi / phone | 1352716 | 36991 | 36020 |

## 按需模块体积

| 构建文件 | 原始 B | gzip B |
|---|---:|---:|
| public-catalog-CBcoxEFl.js | 8648 | 4553 |
| public-chapter-BBNKNIbW.js | 7668 | 3987 |
| public-content-caiso-DcawuWwd.js | 13538 | 4591 |
| public-content-de-dBJej51Y.js | 11307 | 5239 |
| public-content-ercot-DjSYIcgf.js | 9319 | 3323 |
| public-content-fi-DnZQZtVq.js | 16069 | 5619 |
| public-content-gb-it24_DhX.js | 15183 | 6321 |
| public-content-ie-Dp8cfFoY.js | 9230 | 3836 |
| public-content-it-Dqb7Wau0.js | 7940 | 3006 |
| public-content-jp-DJsdPN-0.js | 5826 | 2845 |
| public-content-nem-DpNoy2t3.js | 8762 | 3568 |
| public-content-pjm-DRQ1MVWf.js | 10980 | 3290 |
| public-content-pl-BSMryvRO.js | 16930 | 4591 |
| public-content-ro-C49AnBqO.js | 13847 | 5691 |
| public-content-wa-gYmAzzw8.js | 7380 | 3260 |
| public-overview-CxTK4Y9_.js | 1653 | 914 |
| public-pack-DSBqQrE8.js | 8228 | 3910 |
| public-scene-BCOJXH-P.js | 10477 | 4952 |
| story-geometry-DV7T4wma.js | 7781 | 3228 |

首屏只读取轻量公共摘要。完整市场包、章节渲染器和 SVG 分别按需加载；日本全国包复用，区域投影保持独立。成功模块由浏览器模块缓存和内容 promise 缓存复用。失败的内容 promise 被移除；失败模块重试重新加载同一章节地址。

缓存断言仍要求零新增资源。早期额外请求被定位为 Chromium 在 History API 变更后查找默认 `/favicon.ico`；声明内联图标后消除了该 HTTP 查找。诊断使用多重集记录重复 URL，等待初始后台工作结束，再比较完整资源列表，未通过只统计某些文件名来规避请求。

英国旧 Story 曾因共享小模块拆分超过原 40 KiB 门禁。几何模块合并为明确成员的共享 chunk，通用 URL 写入复用路由层，恢复原门禁；没有放宽任何预算。完整体积门禁以 `npm run test:budget` 实际结果为准。

完整原始记录：[新版](browser-measurements.json) · [基线](baseline-measurements.json)。
