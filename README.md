中文 | [English](./README.en.md)

<!-- 中文译文对应 README.en.md 中的上游说明；本 fork 的同步规则见 MIRROR.md。 -->
# pstack 独立 Fork

> 本仓库直接跟进 Lauren Tan 的 [`cursor/plugins/pstack`](https://github.com/cursor/plugins/tree/main/pstack)，并保留本 fork 的跨 harness 适配。
> 可用于 Claude Code、Codex、Pi 等 agent，不限于 Cursor。
> 另见 [`backnotprop/bro`](https://github.com/backnotprop/bro)，[`/bro`](./skills/bro/SKILL.md) 技能引用了该项目。

Cursor 原 README 的中文译文在[本页下方](#pstack)。

## 安装

每个 `skills/<目录>/` 都是一个标准 [Agent Skill](https://agentskills.io)。使用 [`skills` CLI](https://skills.sh) 安装到当前项目，并按提示选择技能和目标 agent：

```bash
npx skills add toRolex/pstack
```

也可指定技能和目标，例如：

```bash
npx skills add toRolex/pstack --skill how --skill poteto-help --agent claude-code
```

CLI 只复制所选技能目录及其中的 `references/`、`scripts/` 和资源，不会自动安装 sibling skills 或仓库根目录文件。需要跨技能协作时，按下表一起安装。

也可以克隆仓库并逐项软链技能目录：

```bash
git clone https://github.com/toRolex/pstack.git
ln -s "$PWD/pstack/skills/how" /path/to/agent/skills/how
ln -s "$PWD/pstack/skills/tdd" /path/to/agent/skills/tdd-pstack
```

将 `/path/to/agent/skills` 换成目标 harness 的技能目录。软链名称按 `SKILL.md` 的安装名命名；`tdd-pstack` 的源目录仍是 `skills/tdd`。常规 Skills 安装会携带技能内提示词资源，但不会注册 `poteto-agent` 或 `comment-sicko` 这样的具名子代理；技能会在需要时把随包提示词交给通用子代理。Claude Code 适配仅在步骤需要时读取，不是安装前置条件。

## 技能

以下技能可单独安装并使用：

`unslop`、`bro`、`how`、`tdd-pstack`、`typescript-best-practices`、`arena`、`swarm`、`reflect`、`in-your-own-words`、`sharpen`、`poteto-help`、`create-formal-verification-skill`、`statechart`

需要跨技能工作的场景，按对应分支一起安装：

| 技能 | 需同时安装 |
|---|---|
| `teach` | `how`、`why` |
| `why` | `how` |
| `ketchup-video` | `ketchup` |
| `ketchup` | `bro` |
| `technical-writing` | `unslop` |
| `show-me-your-work` | `unslop` |
| `figure-it-out` | `poteto-mode`、`show-me-your-work`；`architect`（设计分支） |
| `automate-me` | `poteto-mode`、`unslop` |
| `architect` | `arena`、`how` |
| `blast-radius` | `arena`、`how`、`why`、`unslop` |
| `interrogate` | `arena`、`in-your-own-words` |
| `no-comments` | `how` 或 `why`（需要查代码时）；`architect`（需要设计修复形状时） |
| `create-verification-skill` | `maintain-verification-skill`（之后维护生成的技能时） |
| `create-formal-verification-skill` | `maintain-formal-verification-skill`（之后维护生成的技能时）；`statechart`（TLA+ 分支） |
| `principle-explain-the-number` | `benchmark-checklist`（性能数字分支） |
| `poteto-help` | `poteto-mode`（仅当用户要求开始实际工作时） |
| `poteto-mode` | 所有 `principle-*` 技能；并按所选 playbook 安装其调用的技能 |

`poteto-mode` 的完整跨技能路由可直接安装全部技能：`npx skills add toRolex/pstack --skill '*'`。CLI 不会自动解析这些依赖。

## 本 fork 的改动

许多上游技能原本面向 Cursor。本 fork 保留这些技能在 Claude Code、Codex、Pi、OpenCode 等 harness 中使用所需的适配；`tdd-pstack` 保留 fork 中的技能名，make-bot-ui 使用 Herdr 本地 server。

---

# pstack

我是 [poteto](https://x.com/poteto)。我不是总裁或 CEO，但在 Meta、Netflix 和 Cursor 工作时接触过数百万行代码。我也是 React 核心团队成员，参与构建和维护 React Compiler。

越来越多人觉得 AI 写了太多低质量代码，我也这么认为。我不想像一支由二十个低质量代码写手组成的团队那样交付。只有产出、没有质量，不是我的目标。想做得快，先把问题理解透。

**pstack 是我的答案。** 这些技能就是我每天在 Cursor 用来交付高质量代码的技能。它们让 Cursor 像一支真正的工程团队一样工作。目标不是增加代码行数，恰恰相反。pstack 帮你少写代码，同时提高质量。

**pstack 让你更有把握地并行工作。** 当你能让一个 agent 深入处理任务，并信任它写出可验证的好代码时，才有信心并行推进。启动多个使用 `poteto-mode` 的 agent，让它们按严格的工程原则完成工作。

**Cursor 让你结合不同模型的长处。** 每个前沿模型都有优点和缺点。pstack 可以配合任意模型使用。我的许多技能采用多模型工作流，利用各个模型的长处。

Fork 它，改进它，按你的需要调整它。欢迎提交 PR！

## 在 Cursor 中安装

```bash
/add-plugin pstack
```

## 开始使用

只需两步：

1. 运行 [`/setup-pstack`](./skills/setup-pstack/SKILL.md)，选择推理预算和要使用的模型。
2. 遇到需要严谨处理的任务时，使用 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)。

第一次使用？[pstack 指南](./docs/guide/README.md) 会带你完成第一个实际任务，涵盖配置、提示词、验证和通宵运行。遇到困难，或不知道该选哪个技能？问 [`/poteto-help`](./skills/poteto-help/SKILL.md)。

其他技能按场景使用，模式技能会在需要时调用它们。默认情况下，模式按模型长处分配工作。代码任务，包括功能开发、重构、修复 bug、性能优化和持续指标优化，交给 Grok。最难的改动、文字写作和判断交给 Opus 5.5。默认评审组合是 Opus 5.5 和 Grok。[`/setup-pstack`](./skills/setup-pstack/SKILL.md) 可以修改这些配置。

## 用法

任务开始时使用 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)。它会读取你的请求，选择适合的操作流程，并在各步骤需要时运行其他技能。

### 直接使用 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)

这是主要入口。需要 agent 严谨地做工程工作时，我就使用它。它包含二十三套操作流程：

```
/poteto-mode this pr has a subtle bug where the scroll drifts every 750ms even when idle. repro
first, then fix and verify.
```

```
/poteto-mode i'm going to bed. land the stack even if ci flakes. i want everything merged by
morning.
```

<details>
<summary>全部二十三套操作流程</summary>

| 操作流程 | 适用场景 |
|---|---|
| [investigation](./skills/poteto-mode/playbooks/investigation.md) | 只读调查。了解 X 如何工作、Y 为什么这样设计，或核实某个判断。 |
| [bug fix](./skills/poteto-mode/playbooks/bug-fix.md) | 复现缺陷，找出根因，并用运行时证据验证修复。 |
| [perf](./skills/poteto-mode/playbooks/perf-issue.md) | 追查已测得的性能问题，并与基线比较改进结果。 |
| [hillclimb](./skills/poteto-mode/playbooks/hillclimb.md) | 围绕目标持续改进一个指标。反复提出假设，测量改动前后的结果，每次确认有效的改进单独提交。 |
| [runtime forensics](./skills/poteto-mode/playbooks/runtime-forensics.md) | 根据运行时观测数据诊断内存泄漏、空闲时 CPU 忙转或界面异常等现象。 |
| [trace forensics](./skills/poteto-mode/playbooks/trace-forensics.md) | 分析已有的性能采样文件，包括 cpuprofile、trace、spindump 和堆快照。 |
| [feature](./skills/poteto-mode/playbooks/feature.md) | 从明确的数据结构出发，构建新增或改动的行为。 |
| [refactoring](./skills/poteto-mode/playbooks/refactoring.md) | 改变结构，但保持行为不变。 |
| [prototype](./skills/poteto-mode/playbooks/prototype.md) | 用可丢弃的小型原型决定设计或行为，或通过实验解决事实问题。 |
| [visual parity](./skills/poteto-mode/playbooks/visual-parity.md) | 让两个实现的 UI 达到像素级一致。 |
| [authoring a skill](./skills/poteto-mode/playbooks/authoring-a-skill.md) | 编写或修改 SKILL.md。 |
| [eval](./skills/poteto-mode/playbooks/eval.md) | 通过盲测评估技能或提示词变化对 agent 行为的影响。 |
| [babysit](./skills/poteto-mode/playbooks/babysit.md) | 处理冲突、评审意见和 CI，让一个 PR 或一组堆叠 PR 达到可合并状态。 |
| [shipping](./skills/poteto-mode/playbooks/shipping.md) | 独立验证已通过检查的 PR 栈，再从底部开始合并连续通过验证的部分。默认通过 GitHub 操作，有 Origin 时使用 Origin。 |
| [autonomous run](./skills/poteto-mode/playbooks/autonomous-run.md) | 持续推进长任务，直到完成。 |
| [orchestrate](./skills/poteto-mode/playbooks/orchestrate.md) | 由一个协调者管理持续数天、多组堆叠 PR 和多个子代理的项目。 |
| [autopilot-full](./skills/poteto-mode/playbooks/autopilot-full.md) | 从代码就绪的版本开始推进独立 PR，直到合并。每个 PR 有一个负责人，每轮由主协调者汇总 swarm 验证结论。 |
| [autopilot-stack](./skills/poteto-mode/playbooks/autopilot-stack.md) | 构建并验证一组基于目标分支的线性 PR 栈，交给操作者评审和合并。 |
| [session pickup](./skills/poteto-mode/playbooks/session-pickup.md) | 恢复或接手先前 agent 尚未完成的工作。 |
| [pause safely](./skills/poteto-mode/playbooks/pause-safely.md) | 安全暂停进行中的工作，便于之后恢复。 |
| [multi-phase plan](./skills/poteto-mode/playbooks/multi-phase-plan.md) | 处理跨阶段或跨多个堆叠 PR 的工作。 |
| [worktree cleanup](./skills/poteto-mode/playbooks/worktree-cleanup.md) | 在确认安全后，清理已合并或废弃的 worktree 和过期的 iOS 模拟器，回收磁盘空间。 |
| [opening a pr](./skills/poteto-mode/playbooks/opening-a-pr.md) | 将小而有序的提交整理成可评审的 PR，使用 Conventional Commits 标题和简报式正文。在其他每套操作流程结束时调用。 |

</details>

调用后，它会：

1. 为任务匹配一套[操作流程](./skills/poteto-mode/playbooks/)，创建待办列表，并将流程步骤原样复制为列表的前几项。
2. 在各步骤需要时调用其他技能。
3. 写出没有 AI 套话的回复，说明使用者和维护者各自会受到什么影响。

完整规则和操作流程见 [`skills/poteto-mode/SKILL.md`](./skills/poteto-mode/SKILL.md)。

如果想让 [`/poteto-mode`](./skills/poteto-mode/SKILL.md) 跨轮次保持启用，从 `/` 菜单中选择它，然后按 Option+Enter，在 Windows 上按 Alt+Enter，不要只按 Enter。这样会将它设为 [Cursor 自定义模式](https://cursor.com/docs/skills)，可在 agents 窗口和 CLI 中使用。它每轮都保留在上下文中，遇到匹配的操作流程或需要严谨处理的任务时会生效，其他时候不干预。只按 Enter 则仅附加到当前消息。要停用，可以直接说明，或退出该模式。

[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 很适合配合 Cursor 的 `/loop` 命令。你可以让 Cursor 连续工作数小时，仍按严格的流程执行。

## 技能参考

[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 会在需要时运行其中大部分技能，包括 `how`、`why`、`architect`、`arena`、`swarm`、`interrogate`、`unslop`、`no-comments`、`technical-writing`、`tdd-pstack` 和原则技能。想直接调用某个技能时，可查阅下表：

```
/how do we cancel runs? do we have an n+1 when we look up every run to cancel?
```

```
/interrogate review this pr.
```

<details>
<summary>全部技能</summary>

| 技能 | 适用场景 |
|---|---|
| [`/poteto-mode`](./skills/poteto-mode/SKILL.md) | 所有非简单任务的默认入口。 |
| [`/poteto-help`](./skills/poteto-help/SKILL.md) | 刚开始使用 pstack，或不知道该选哪个技能、操作流程或原则。它会了解你的目标，回答相关问题，并给出可输入的提示词。仅在你输入 `/poteto-help` 时运行。 |
| [`/in-your-own-words`](./skills/in-your-own-words/SKILL.md) | 开始前，先确认 agent 是否理解你的目标和问题。 |
| [`/sharpen`](./skills/sharpen/SKILL.md) | 发送任务前，把提示词写得更深入，而不是扩大范围。 |
| [`/how`](./skills/how/SKILL.md) | 想了解一个子系统如何工作。 |
| [`/why`](./skills/why/SKILL.md) | 想了解为什么采用当前设计。它在运行时发现可用的 MCP，并行查询各类证据，包括版本控制、问题追踪、长篇文档、即时聊天、基础设施可观测数据、错误追踪和分析数据仓库。 |
| [`/recall`](./skills/recall/SKILL.md) | 开始或恢复工作时，想从自己的聊天记录和共享记录中重建某个主题的近期上下文，得到简明的现状说明。 |
| [`/ketchup`](./skills/ketchup/SKILL.md) | 想了解上次发言后对话中发生了什么，并获得便于决策的行动摘要。 |
| [`/ketchup-video`](./skills/ketchup-video/SKILL.md) | 想通过带字幕的短视频回顾对话进展，并在视频下方查看待决事项。 |
| [`/blast-radius`](./skills/blast-radius/SKILL.md) | 想知道一个看似很小的改动还可能影响什么，并通过实际运行代码证明它安全所依赖的关键事实，而不是只作断言。 |
| [`/architect`](./skills/architect/SKILL.md) | 即将编写跨函数边界的代码，想先确定调用方式、类型和模块结构。 |
| [`/arena`](./skills/arena/SKILL.md) | 想并行尝试同一个任务 N 次，再选取各次尝试中最好的部分。 |
| [`/swarm`](./skills/swarm/SKILL.md) | 想让 N 个工作者分别处理不同部分或竞速完成任务，再汇总成一份报告。 |
| [`/interrogate`](./skills/interrogate/SKILL.md) | 已有 diff，想让不同模型尝试找出问题，其中包含严格的代码质量评审。 |
| [`/automate-me`](./skills/automate-me/SKILL.md) | 想根据自己的实际工作方式生成专属的 `-mode` 技能。 |
| [`/make-bot-ui`](./skills/make-bot-ui/SKILL.md) | 想构建页面或仪表板，用按钮通过 webhook 唤醒 Grok Bot，并处理发送者密钥交接和 Tailscale。 |
| [`/setup-pstack`](./skills/setup-pstack/SKILL.md) | 想为每种角色选择 pstack 使用的模型。它会检测可用模型并写入配置规则。 |
| [`/reflect`](./skills/reflect/SKILL.md) | 长任务完成后，想把工作方法记录为技能改动。 |
| [`/correct`](./skills/correct/SKILL.md) | 不断纠正 agent 的同类错误。它会从历史记录中归纳错误类别，优先在最有效的层面修复，依次考虑架构、类型、lint、CI 和测试，最后才是文档。它还会维护规则与执行机制的对应表。 |
| [`/teach`](./skills/teach/SKILL.md) | 想真正理解一个改动或子系统，而不只是看摘要。它会运行 how 和 why，结合图解逐步形成一份直白的说明。 |
| [`/tdd-pstack`](./skills/tdd/SKILL.md) | 正在修复 bug，且本地测试成本低。先写失败测试，再修复。 |
| [`/benchmark-checklist`](./skills/benchmark-checklist/SKILL.md) | 已运行基准测试，或测得性能提升或回退。在报告或采用数据前，检查限制因素、调优、错误、重复测量和端到端相关性。 |
| [`/no-comments`](./skills/no-comments/SKILL.md) | 想在评审前清理注释。它会启动 Comment Sicko，修复认可的问题，并建议如何将声称存在的约束编码到程序中。 |
| [`/typescript-best-practices`](./skills/typescript-best-practices/SKILL.md) | 正在阅读或编辑 TypeScript。它用具体语法落实类型系统纪律原则。 |
| [`/figure-it-out`](./skills/figure-it-out/SKILL.md) | 没有适合的内置操作流程。它会为任务设计严谨、可审计的流程。 |
| [`/show-me-your-work`](./skills/show-me-your-work/SKILL.md) | 想留下可评审的决策记录。它将决策写入可提交的 TSV 文件。 |
| [`/create-verification-skill`](./skills/create-verification-skill/SKILL.md) | 项目没有脚本化的应用行为验证方法。它为项目生成包含功能清单的验证技能，适用于任何语言或平台。 |
| [`/maintain-verification-skill`](./skills/maintain-verification-skill/SKILL.md) | 验证技能的功能清单已与应用不一致。它会先检查源码，再做一次实际运行验证，最多提交一个包含已证实修正的 PR。 |
| [`/create-formal-verification-skill`](./skills/create-formal-verification-skill/SKILL.md) | 想为最重要、测试最难覆盖的代码验证一个形式化性质，并生成项目本地的检查技能。 |
| [`/maintain-formal-verification-skill`](./skills/maintain-formal-verification-skill/SKILL.md) | 代码变化后更新形式化模型或证明，并区分验证漂移与代码缺陷。 |
| [`/statechart`](./skills/statechart/SKILL.md) | 检查 TLA+ 状态模型，并绘制 Mermaid 状态图和违反规则的最短路径。 |
| [`/unslop`](./skills/unslop/SKILL.md) | 想清理文字，去掉 AI 写作痕迹。 |
| [`/bro`](./skills/bro/SKILL.md) | 想把上一条消息改写为直白的人话，不用术语。 |
| [`/technical-writing`](./skills/technical-writing/SKILL.md) | 需要编写文档、RFC、README、PR 描述或提交消息。它结合 Diátaxis、Google 开发者写作风格、STE 和 Global English 规范。 |

</details>

### 示例

我通常在任务开始时输入 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)，让它选择操作流程。其他技能按步骤需要调用。有时我也会直接调用个别技能。

<details>
<summary>全部示例</summary>

```
bug fix:           /poteto-mode this pr has a subtle bug where the scroll drifts every 750ms even
                   when idle. repro first, then fix and verify.
perf:              /poteto-mode a big list takes a second or two to load even though we virtualize.
                   run a cpu trace and tell me why.
feature:           /poteto-mode build a small feature behind a feature flag. verify it really works.
prototype:         /poteto-mode build two prototypes of the markdown renderer so we can compare.
                   spawn an agent for each.
multi-phase:       /poteto-mode open source these skills as a plugin. nothing internal leaks, work
                   in a temp dir, show me the dependency graph first.
overnight run:     /poteto-mode i'm going to bed. land the stack even if ci flakes. i want
                   everything merged by morning.
babysit:           /poteto-mode check on pr 123. anything outstanding?
visual parity:     /poteto-mode the row spacing is too tall when this flag is on. the second image
                   is correct. repro and fix until it matches.
figure it out:     /poteto-mode i'm stepping away. migrate every caller from the synchronous store
                   to the new async one, keeping behavior identical. i want to trust it was done
                   right when i'm back.
how:               /how do we cancel runs? do we have an n+1 when we look up every run to cancel?
why:               /why is this feature flag not on yet?
architect:         design this instrumentation to be high signal with no false positives. /architect
                   this first.
arena:             /arena take my prompt to the arena verbatim. i want to compare their proposals
                   with yours.
swarm:             /swarm check every package under packages/ against its check.sh. one worker per
                   package. one report.
interrogate:       /interrogate review this pr.
tdd:               /tdd-pstack implement
unslop:            can we unslop and tighten the new changes?
reflect:           /reflect that took too long. capture what we learned so the next run doesn't
                   repeat it.
correct:           /correct
show-me-your-work: /show-me-your-work keep a decision trail i can review when i'm back.
automate-me:       /automate-me
help:              /poteto-help which skill should i use to review this branch?
```

</details>

## `poteto-agent` 和 Comment Sicko 子代理

根目录的 [`agents/poteto-agent.md`](./agents/poteto-agent.md) 和 [`agents/comment-sicko.md`](./agents/comment-sicko.md) 是提示词维护源；可移植副本随 [`poteto-mode`](./skills/poteto-mode/references/poteto-agent.md) 和 [`no-comments`](./skills/no-comments/references/comment-sicko.md) 技能分发。标准 Agent Skills 安装不会注册具名子代理。若 harness 没有已注册的对应 agent，技能会把随包提示词交给通用子代理；若 harness 没有子代理工具，则按技能指令串行执行。

## 原则

二十四个短技能，每个对应一条原则。`poteto-mode` 内置原则索引，在任务开始时读取。独立文件让其他技能能按名称引用原则，也让索引能链接到每条原则的完整规则。

<details>
<summary>全部二十四条原则</summary>

| 原则 | 分组 | 规则 |
|---|---|---|
| [laziness-protocol](./skills/principle-laziness-protocol/SKILL.md) | 核心 | 优先删除，只做解决问题所需的最小改动。 |
| [foundational-thinking](./skills/principle-foundational-thinking/SKILL.md) | 核心 | 写逻辑前先考虑核心类型和数据结构、基础结构与功能的实现顺序，以及并发参与者共享什么。选对数据结构，让后续代码的写法更明确。 |
| [redesign-from-first-principles](./skills/principle-redesign-from-first-principles/SKILL.md) | 核心 | 将新需求视为从第一天就存在的基础条件重新设计，而不是在现有设计上追加。 |
| [attack-the-premise](./skills/principle-attack-the-premise/SKILL.md) | 核心 | 两次或更多修复基于同一个前提，却未通过同一项检查时，先查清哪些参与者存在失衡，再质疑该前提，不要继续基于它修补。 |
| [subtract-before-you-add](./skills/principle-subtract-before-you-add/SKILL.md) | 核心 | 先删除无用内容、重复校验和占位引用，再在更简单的基础上继续。 |
| [minimize-reader-load](./skills/principle-minimize-reader-load/SKILL.md) | 核心 | 检查从问题到答案要经过多少层，以及读者必须记住多少隐含状态。合并只有一个调用方的封装，缩小可变状态的作用域。 |
| [outcome-oriented-execution](./skills/principle-outcome-oriented-execution/SKILL.md) | 核心 | 有明确阶段边界的重写和迁移应收敛到目标架构，不要用之后要丢弃的兼容代码维持平滑的中间状态。 |
| [experience-first](./skills/principle-experience-first/SKILL.md) | 核心 | 优先考虑用户体验，而不是实现方便。宁可交付较少但完善的功能，也不要交付更多粗糙功能。 |
| [exhaust-the-design-space](./skills/principle-exhaust-the-design-space/SKILL.md) | 核心 | 构建两到三个相互竞争的原型，并排比较后再决定。 |
| [build-the-lever](./skills/principle-build-the-lever/SKILL.md) | 核心 | 所有非简单工作，包括编辑、迁移、分析和检查，都应构建能执行或验证工作的工具。使用 codemod、脚本、生成器或子代理遵循的技能，而不是只靠手工。评审者应能重新运行该工具。 |
| [model-the-domain](./skills/principle-model-the-domain/SKILL.md) | 架构 | 用结构表达领域，而不是让领域规则散落在条件判断中。 |
| [boundary-discipline](./skills/principle-boundary-discipline/SKILL.md) | 架构 | 将防御性检查集中在 CLI、配置、网络和外部 API 等系统边界。信任内部类型，保持业务逻辑纯粹。 |
| [type-system-discipline](./skills/principle-type-system-discipline/SKILL.md) | 架构 | 让非法状态无法表示。为有特定语义的基础值使用品牌类型，在边界解析外部数据，不绕过编译器，穷尽处理所有变体，并从权威 schema 派生类型。 |
| [make-operations-idempotent](./skills/principle-make-operations-idempotent/SKILL.md) | 架构 | 无论之前执行到哪一步，重复执行都收敛到同一个最终状态。 |
| [migrate-callers-then-delete-legacy-apis](./skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md) | 架构 | 一次迁移所有调用方并删除旧 API，不保留兼容层。 |
| [separate-before-serializing-shared-state](./skills/principle-separate-before-serializing-shared-state/SKILL.md) | 架构 | 先消除共享。只有确实必须由一个共享写入者操作时，才通过结构保证串行执行。 |
| [prove-it-works](./skills/principle-prove-it-works/SKILL.md) | 验证 | 完成任务、宣布结束前，直接检查真实产物。运行功能，读取实际值，检查 diff，而不是依赖间接信号、自我报告或“能编译”。 |
| [fix-root-causes](./skills/principle-fix-root-causes/SKILL.md) | 验证 | 将每个现象追溯到根因，在根因处修复。先复现，持续追问原因，不要靠空值检查掩盖崩溃。 |
| [sequence-verifiable-units](./skills/principle-sequence-verifiable-units/SKILL.md) | 验证 | 将多步骤工作拆成小单元，每个单元结束时都可验证。验证一个再做下一个，让交付顺序本身证明工作可靠。 |
| [test-behavior-not-implementation](./skills/principle-test-behavior-not-implementation/SKILL.md) | 验证 | 按用户的方式调用代码，用明确的预期值断言结果。如果所有导入函数都返回 undefined 时测试仍会通过，就重写断言或删除测试。 |
| [explain-the-number](./skills/principle-explain-the-number/SKILL.md) | 验证 | 在信任、报告或采用测量结果前，找出限制因素，并排除测量对象与目标工作不一致的情况。适用于性能提升、吞吐、延迟和评估结果。 |
| [guard-the-context-window](./skills/principle-guard-the-context-window/SKILL.md) | 委派 | 将大量阅读和处理工作交给子代理。主线程保留摘要，不堆积原始内容。 |
| [never-block-on-the-human](./skills/principle-never-block-on-the-human/SKILL.md) | 委派 | 先执行并展示结果，让用户之后纠正方向。只有不可逆操作才需要先确认。 |
| [encode-lessons-in-structure](./skills/principle-encode-lessons-in-structure/SKILL.md) | 元规则 | 将规则落实为 lint、元数据标记、运行时检查或脚本，而不是继续追加文字。 |

</details>

## 未包含的工具

`poteto-mode` 引用了以下工具，但 pstack 不提供它们：

- `/deslop` 和 `deslop` 技能来自 `cursor-team-kit` 插件。
- `control-cli` 用于 CLI 和 TUI，`control-ui` 用于浏览器、Electron 和 Web，同样来自 `cursor-team-kit`。
- `/create-skill` 是 Cursor 内置功能。Cursor 也有内置的 `/babysit`。在 `poteto-mode` 中，PR 状态请求使用本项目的 [babysit 操作流程](./skills/poteto-mode/playbooks/babysit.md)，而不是 Cursor 内置技能。

如果需要完整工具集，请同时安装 `cursor-team-kit`。

## 为什么没有规划技能？

Cursor 已有很好的 Plan 模式，可以配合 pstack 使用。但我个人并不相信先做规划。最好的规格说明是代码。如果你确实想制定计划，[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 也支持，只是不将它作为默认步骤。

## 按你的需要调整

`poteto-mode` 体现的是我的风格。你未必想完全照用。

输入 [`/automate-me`](./skills/automate-me/SKILL.md)。它会分析你近期的会话记录，根据你的实际工作方式生成 `<your-name>-mode` 技能，并通过底层的 pstack 调用其他技能。你保留 pstack 作为基础，同时得到一个与 `poteto-mode` 并存的专属调度技能。

模型也可配置。输入 [`/setup-pstack`](./skills/setup-pstack/SKILL.md)。它会检测你能使用的模型，将代码、判断和评审组合等角色映射到模型。配置文件按 harness 区分：Cursor 使用 `~/.cursor/rules/pstack-models.mdc`，Claude Code 使用 `~/.claude/rules/pstack-models.md`，其他 harness 使用 `~/.agents/pstack-models.md`。规则不存在时使用默认配置，所以只需覆盖想修改的部分。

默认模型变化后，之前写入的规则仍会固定使用旧默认值。删除对应角色的配置行，或删除整个文件，再运行 `/setup-pstack`。重新运行时，会保留模型与当前默认值不同的角色配置。

## 自动化

pstack 还提供一个默认未启用的 [benny 自动化包](./automations/benny/)。benny 会初步处理 Slack 中的问题报告，再借助真实 UI 证据复现并修复确认存在的 bug。这些文件不会注册为斜杠技能，也不属于 Claude Code 插件入口。

要配置它，请让 Cursor 读取 [`FOR_AGENTS.md`](./automations/benny/FOR_AGENTS.md)。配置过程将包复制到目标仓库的 `.cursor/automations/benny/`，在目标仓库启用 pstack 以共享技能，并将用户配置保留在复制的包之外。

## 许可证

MIT
