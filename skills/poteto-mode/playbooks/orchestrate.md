### Orchestrate

**You run the program, never the code. Decide which agent does each piece of work, then check what each one produces.** For a standing project handed to one coordinator chat: multi-day, many stacked PRs, dozens to hundreds of subagents, few human turns. One task driven to a predicate is Autonomous run. One ambitious run that needs a bespoke workflow is figure-it-out. Work that one agent could finish inside the session's budget is not a program.

Run it with your own tools. Spawn workers with `Task`. Keep the program's state in the Project tracker (`notes.md`) and the Project store. Watch each PR with PR and CI event subscriptions when your harness has them. Call no scripts, run no polling loops, and never relay messages or status between agents.

#### Topology

- **One owner per PR.** The owner is the only writer of its branch and carries the PR from build to merge. Only the owner pushes, rebases, or retargets it. Closing or retargeting a base PR orphans every PR above it, so the owner does that only on your call. You never author or edit code. Conflicted merges, chain rebases, and fixes go to owners.
- **A fresh worker for each independent task.** Its kickoff carries everything it needs, including each upstream report it depends on, pasted in full. Workers can't see their siblings. Run workers on a new cloud VM (`environment: "cloud"`) unless the work needs this machine: a `control-ui` or `control-cli` runtime check (from `cursor-team-kit`), local transcripts, a simulator, or auth that exists only here. Pick each subagent's reasoning level and fast or standard speed for the job, per the Subagents section.
- **A sub-coordinator only when one area has many parallel workers.** It owns that area's workers and kickoffs and sends you one rollup, never raw worker reports. Stop at three levels: you, sub-coordinators, and workers. Keep about ten workers in flight per coordinator, and start the next one as each finishes instead of waiting on a whole batch.
- **Fork when new work needs a worker's built state,** such as its checkout, uncommitted changes, or a running process. Message a worker only for a follow-up on the same work. Never message one to check on it, because a message restarts an idle agent.
- **Each PR gets a verifier that isn't its author,** on a different model family. The owner merges only on that verifier's pass at the current head.
- **Start with one unit.** Take it through kickoff, owner, verifier, and merge before you fan out, so a flaw in the kickoff costs one agent instead of fifty. On near-identical cheap units, the first unit is that test.

#### Supervision

- **Coordinator.** The receiving chat frames the program, authors briefs, drains results, makes judgment calls, and owns the human report. It does not author code; code changes, conflicted merges, and restacks go to the unit owner. Spawn, resume, and drain workers through the active harness's subagent tool, 在 Claude Code 中使用随技能提供的 [adapter](../references/claude-code.md) 映射。
- **Each kickoff names proof and scope.** Include the goal, evidence that proves completion, paths the worker may and may not write, and actions it must not take. If the evidence is unclear, the unit is not scoped.
- **Review the artifact.** Read the diff or artifact, not only the worker's summary. Green CI is an input, not a verdict. Behavioral work needs more than a type check. A verdict covers one head SHA; a new push needs a new verdict. Read sample sub-coordinator kickoffs while their workers run and correct instructions that fail.
- **Keep the scope tight.** Send back work that drifts or grows past the request. Keep only fixes that block the program and park the rest as follow-ups.
- **Check live state.** Before reporting, inspect each PR's live state with `gh pr view` and `gh pr checks` or the forge equivalent, not the worker's last report. Account for each worker as done, replaced, or absorbed.
- **Handle stalls deliberately.** Judge workers by their pushes and PR activity, not status text. Retry with a smaller scope after a context limit, the same kickoff after a dropped connection, or a different model after a tool error. After two retries, drop the unit and replan. When a stopped worker returns late, check its result against current PR state and give unique findings to a fresh worker.
- **Ask only for a real decision or blocker.** Pause for an irreversible action, a product or preference call no experiment can settle, or a dead end that survived a replan. Rebase mechanics, retries, CI flakes, review triage, and whether to continue stay with the coordinator.

**Reply:** what landed against the goal, each PR's live state and verdict with its link, what was dropped and why, and the decisions waiting on the user.
