---
name: how
description: "Use for \"how does X work\", code walkthroughs before changing something, and placement / ownership / layering questions (\"where should this live\", \"which package owns this\", \"is this the right layer\"). Explains subsystem architecture, runtime flow, onboarding mental models. Use why for motivation."
disable-model-invocation: true
---

# How

In Claude Code, consult [the Claude Code adapter](references/claude-code.md) when a step needs Claude-specific tool, model, or path mappings.

Explore the codebase to answer "how does X work?" questions. Produce architectural explanations at the level of a senior engineer onboarding onto a subsystem, enough to build a working mental model, not so much that it reads like annotated source code.

Each spawn uses the harness subagent tool in read-only mode. Explorers use the `how explorer` model setting (default `grok-4.7-xhigh-fast`), and explainers use `how explainer` (default `claude-opus-5-5-xhigh`). Read the harness-specific pstack model settings file listed in [`references/pstack-harness.md`](references/pstack-harness.md). Set the subagent model to the role value or its default; leave it unset for `auto` or `inherit-parent`. If the tool rejects a configured model, use the role default and say so. If it rejects the default, use the closest valid model of the same family from its error message. Pick the reasoning level and speed for the job per [`references/pstack-harness.md`](references/pstack-harness.md).

## 1. Assess complexity

If the scope is ambiguous, state your interpretation and explore. The user can redirect.

- **Simple** (a single module, a small utility, a narrow question such as "how does function X work"): no explorers. Spawn one explainer that explores and explains in one pass, built from `references/explainer-prompt.md` without the explorer-findings section. Go to step 4.
- **Complex** (a subsystem spanning multiple files or services, a cross-cutting feature, a full architectural overview): go to step 2.

When in doubt, take the simple path.

**Other harnesses.** Each spawn uses the harness's subagent tool. For example, use `Agent` in Claude Code (`subagent_type: general-purpose`), `task` in OpenCode (`subagent_type: general`), or `spawn_agent` in Codex. Keep the prompt and model, and drop unsupported parameters. If there is no subagent tool, run each role yourself, one after another. Read the active harness's pstack model settings file listed in [`references/pstack-harness.md`](references/pstack-harness.md).

## 2. Explore (complex only)

Decompose the question into 2 to 4 angles, each a distinct slice of the subsystem. Spawn all explorers in a single message, each with `references/explorer-prompt.md` and its angle filled in.

## 3. Synthesize (complex only)

Once all explorers have returned, spawn one explainer with `references/explainer-prompt.md` and every explorer's findings filled in.

## 4. Present

Present the explainer's output. Light edits for clarity or context from the conversation are fine. Do not substantially rewrite it.

## Output format

The explanation uses the sections defined in `references/explainer-prompt.md`, dropping any that do not apply: Overview, Key Concepts, How It Works, Where Things Live, Gotchas.
