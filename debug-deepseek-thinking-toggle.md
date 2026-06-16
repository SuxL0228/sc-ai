# [VERIFIED] deepseek-thinking-toggle

## 背景
- 症状：插件里已选择开启 `DeepSeek` 深度思考，但打开 `DeepSeek` 页面后，平台侧深度思考没有被自动开启。
- 期望：当插件配置要求开启深度思考时，注入层应检测页面当前状态，必要时切换平台开关，并确认结果。

## 当前假设
1. 注入器根本没有在发送前执行 `thinkingAction.enable()`。
2. `DeepSeek` provider 的 `thinkingAction.getState()` 没有找到真实按钮，导致后续逻辑短路。
3. `thinkingAction.enable()` 被调用了，但点击命中了错误元素，没有触发页面真实开关。
4. 页面初始化时机过早，开关 DOM 尚未稳定，导致检测与点击都发生在无效时机。
5. 页面开关切换成功后，状态回读失败，导致后续流程误判为未生效或直接跳过。

## 调试计划
1. 给注入器里“能力同步”路径添加日志，确认是否执行了思考模式同步。
2. 给 `DeepSeek` provider 的 `getState/enable/disable` 添加日志，记录选择器命中与状态变化。
3. 在浏览器内复现一次，收集运行时证据。
4. 基于证据做最小修复，再用修复前后日志对比验证。

## 结果记录
- 2026-06-11：用户提供真实 DOM 证据，确认假设 2（`getState()` 找不到按钮，后续逻辑全部静默短路）。
- 根因：DeepSeek 开关现为 `<div tabindex="0" aria-pressed="..." class="... ds-toggle-button ...">`，**没有 `role="button"`，也没有 `aria-label`**；`findToggleButton` 的三个选择器都要求 role/button/aria-label，全部落空 → `found: false` → injector 静默跳过同步（深度思考与智能搜索同一条路径，因此两个开关都无效）。
- 文案（深度思考/智能搜索）与选中态判断（`ds-toggle-button--selected`、`aria-pressed`）均仍然正确，无需改动。
- 修复：`packages/inject/src/providers/deepseek.ts` 首选选择器由 `.ds-toggle-button[role="button"] >> ${label}` 改为 `.ds-toggle-button >> ${label}`。已重新构建 inject 与扩展 dist。
- 2026-06-11 验证通过：运行日志确认 DeepSeek 深度思考/智能搜索按钮均能找到并正确同步状态（getState found+enabled 正确、点击后状态翻转正确）；千问思考开关同样生效。
- 待办：稳定运行一段时间后移除 deepseek.ts / injector.ts 中的 debug-point 探针（含 send-flow 探针）。
