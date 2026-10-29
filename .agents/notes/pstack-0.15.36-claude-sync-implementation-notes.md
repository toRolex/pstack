# pstack 0.15.36 同步与通用 Agent Skills 分发

## 当前交付状态（取代下方历史完成状态）
- 用户目标与上游最新核实：done；用户已确认通用技能仓库、保留本地定制、完成后发 PR；2026-10-29 再查上游 main 仍为 `1ba91fc25c0977741dd0e267849e6234b037ed0a`，版本0.15.36。
- how 定向定位：done；交付 `/tmp/pstack-portable-plan-20261029.md`；定位23个adapter外部指针、13个Harness读取方、两个prompt及help指南资源；采用单源生成技能内资源的最小方案。
- 通用分发修正与安装验收：done；产物已转回当前仓库，555路径与隔离候选逐字核对；45个技能内资源生成，真实CLI五项单技能/依赖组/全58项及clone58软链通过；删除误加Claude插件入口，保留既有Cursor版本元数据。
- 独立审查：done；`/tmp/pstack-portable-review-20261029.md`两项P2已修复，正文依赖与playbook根路径回归检查通过；`/tmp/pstack-portable-final-tests-20261029.md`确认61项测试与typecheck通过，statechart物理TMPDIR下267通过/67跳过。
- PR发布：进行中；目标 `toRolex/pstack`，准备在隔离任务分支提交与推送，不合并。

## 本轮步骤与验收
1. Read the Principles section of the poteto-mode skill。done，本会话已加载。
2. Phase A: Frame。done，可检查完成条件是最新版同步、npx复制与clone软链资源可达、定制保留、PR存在。
3. Phase B: Design the workflow。done，复用已有基线同步和测试，聚焦分发修正，不重做全部调查。
4. Phase C: Run the loop。done，复制边界缺失已定位并由随包资源修复，实际CLI安装与软链检查通过。
5. Phase D: Keep the audit trail。done，记录于本notes与本任务TSV，旧插件方向已明确标记为失效历史。
6. Phase E: Verify and hand back。进行中，独立审查与最终测试通过，下一步创建PR。

## Throughput checkpoint
- 既有0.15.36更新涉及511路径，复用已有源同步与审查证据；新增工作只处理安装契约、必要适配和资源可达性，不重新实现上游状态图工具。
- 关键风险是单技能复制丢失根级运行资源及agent注册名。先验证真实目录边界，再做最小修改。
- 数据形态是技能包目录及其资源依赖，不是新的多agent平台注册表。仅在重复资源确需物化时增加一个可重跑的生成/校验脚本。

## 历史状态（此前误按插件版本交付，已被用户澄清取代）
- 本地基线调查：done；证据 `/tmp/pstack-local-audit-20261029.md`，已核实 MIRROR.md 与基线记录；下一步作为保留项输入。
- 上游调查：done；证据 `/tmp/pstack-upstream-audit-20261029.md`，已核实官方 Claude adapter；源 SHA `1ba91fc25c0977741dd0e267849e6234b037ed0a`，基线 `9d76bcab133aefcccb16121d7be874e6aa823729`。
- 作者源三方同步及 Claude Code 入口：done；511 个路径已转至当前仓库并逐文件字节核对；`.claude-plugin/plugin.json` 与 marketplace 独立验证通过；源版本0.15.36、英文正文一致、本地定制保留。实施报告 `/tmp/pstack-sync-implementation-report.md`。
- 独立审查及本地交付：done；`/tmp/pstack-sync-review-20261029.md` 的三项问题已修复并定向验收；测试报告 `/tmp/pstack-sync-tests-20261029.md`：poteto-mode 61通过、typecheck通过，statechart规范TMPDIR下267通过/67跳过。未提交、未推送、未安装全局。

## 历史决策（插件方向已被当前通用分发决策取代）
- 用户要求最新版且对齐 Claude Code 适配版。官方生成树是发布副本，作者源仍为 pstack/；避免维护两套重复 skills，在本 fork 根目录补官方 Claude plugin 包装并应用官方适配引导，保留现有 Cursor 入口。
- 本地未提交的三个既有 notes 和 `.pi/subagents.json` 全部保留。
- 上游共 75 个路径提交，502 文件，+21196/-3687 行；生成树不重复计作功能量。

## 历史审查修复（完整原生插件安装限制已撤销）
- 独立报告 `/tmp/pstack-sync-review-20261029.md` 发现三项 P2：interrogate 旧派发残留、tdd-pstack 名称到目录映射遗漏、单技能安装不携带 adapter。已在隔离产物窄范围修复：唯一派发/输出段、明确 TDD 路由例外、README 收窄 Claude 安装契约为完整原生插件。定向断言与 diff --check 通过，测试重验仍进行中。

## 历史 Deviations（用户现已授权提交及PR，通用分发决策优先）
- 不创建 Git 提交（用户未授权提交）。因此不走 jj 的已提交成果导入/历史整合流程；仅在核实父目录文件仍匹配基线后转移未提交工作文件，保留既有未提交文件，不操作 bookmarks 或共享历史。
- 本次保留官方 adapter 为根 docs 单一权威源；Claude Code 不再将单技能 CLI 复制列为完整插件的等价安装方式，避免为23个技能重复打包相同规则。
- 转移预检发现既有四文件为 intent-to-add 状态而非纯 untracked；首次保护检查安全中止，核实与转移清单无交集后转移，保留其状态和内容。
- 当前仓库全量 `git diff --check` 仍报告既有 `pstack-html-tutorial-implementation-notes.md:41` 末尾空行；未修改他项笔记。排除该既有文件后本次差异检查通过。
- statechart 默认 TMPDIR 下仍有上游 macOS fixture 路径别名失败；规范化TMPDIR后通过。67项需TLA2TOOLS的测试未执行，未下载Java/TLA工具。真实 marketplace 安装未执行；已验证插件和marketplace清单，不代表端到端安装测试。
