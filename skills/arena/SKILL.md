---
name: arena
description: "Spawn N parallel candidates at the same task, pick a base, graft the strongest parts of the losers into it. Use for /arena, 'arena this', 'throw it in the arena', or when one attempt at a non-trivial artifact would lock in the wrong shape."
disable-model-invocation: true
---

# Arena

In Claude Code, consult [the Claude Code adapter](references/claude-code.md) when a step needs Claude-specific tool, model, or path mappings.

Open a todolist with one entry per phase (Frame, Fan out, Cross-judge, Pick, Graft, Verify) before launching anything.

## Phase A: Frame

Every candidate gets the same prompt, so the prompt is the contract.

1. State the artifact each candidate is producing.
2. Derive the rubric, 3-6 concrete gradeable criteria for what success looks like on *this* task. It is the picker's tool in Phase D. Candidates only see the task.
3. Pick the runners from the `arena runners` line in the harness-specific pstack model settings file listed in [`references/pstack-harness.md`](references/pstack-harness.md). If the file or role line is missing, default to one runner each on `claude-opus-5-5-xhigh` and `grok-4.7-xhigh-fast`. An `auto` or `inherit-parent` entry means the parent model, so leave `model` unset. Pick each runner's reasoning level and speed per [`references/pstack-harness.md`](references/pstack-harness.md). If the tool rejects a configured model, use its family's default and say so. If that fails, use the closest valid slug of the same family from the error message; if there is none, drop the seat and say so. If that leaves fewer than two runners, add runners until there are two, or one when the configured line has one entry. Use a remaining runner's model for added seats, or the parent model when none remain. Families go by prefix: `claude-*` and `grok-*`, including `cursor-grok-*` and `composer-*`; a refused `composer-*` entry uses `grok-4.7-xhigh-fast`. With no family match, use `claude-opus-5-5-xhigh`. Spawn more runners when the arena covers multiple design directions. Use the same model N times when the work is generation-bound rather than judgment-sensitive.
4. Give each candidate its own output location (a git worktree where possible, otherwise `/tmp/arena-<slug>/candidate-<n>/`), per the **separate-before-serializing-shared-state** principle skill.

## Phase B: Fan out

Use the harness's background option where supported. Spawn all N subagents in one message with the task, shared grounding path, each one's output path, and instructions to produce the artifact and a short rationale naming alternatives it considered and rejected.

If a candidate produces no output, proceed with N-1 and note the dropout.

## Phase C: Cross-judge

After all Phase B candidates complete, choose one model from the `arena cross-judge pool` line in the harness-specific pstack settings file. If the file or role line is missing, use `claude-opus-5-5-xhigh` and `grok-4.7-xhigh-fast` as the default pool. Spawn one read-only judge using the harness's read-only option where available. The judge must use a different family from the parent when possible: try real entries from another family in pool order; `auto` and `inherit-parent` are parent-family entries and never judge. If no configured entry from another family runs, try defaults from another family. If none runs, skip the judge, pick the base alone in Phase D, and say so. If you do not know the parent's model, try real slugs in pool order and say the family check did not run. The judge sees the rubric and candidates by path label, scores each criterion, and recommends a base with rationale. It runs in parallel with your reading in Phase D. Do not spawn it while candidates are still writing.

## Phase D: Pick a base

Read every candidate end to end before picking. Score each against the rubric criterion by criterion, not on holistic feel, and compare with the cross-judge when Phase C ran one. Agreement on the base confirms the pick. Disagreement means one of you is biased or the rubric was ambiguous. Read both rationales before deciding.

Pick the base a future maintainer can extend most easily without breaking invariants. When two feel tied, prefer the cleaner boundary or smaller API, per the Laziness Protocol.

## Phase E: Graft

Walk each losing candidate once more for what is worth porting into the base, usually one or two things per candidate, not most of it. Fold each graft in by hand, per the **redesign-from-first-principles** principle skill, so the result stays coherent under one mental model. Don't paste mechanically.

If the candidates converge on one shape, that is strong agreement. Note it and ship the consensus shape. No graft is needed. If they wildly diverge, Phase A was under-specified. Reframe and re-run rather than averaging the divergence.

## Phase F: Verify

Verify the synthesized artifact like any other output, per the **prove-it-works** principle skill. If verification finds a problem the arena missed, either Phase A was wrong (re-frame and re-run) or a candidate caught it and you missed the graft (go back to Phase E). Don't paper over it.

## Outputs

One synthesized artifact, with a short synthesis note alongside naming the base and why, the cross-judge's verdict or that Phase C skipped the judge, each graft with its source candidate, what was rejected and why, any convergence or dropouts, and the verification result.
