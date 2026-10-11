---
name: reflect
description: Spawn three parallel review subagents over the active transcript, surface learnings, and route each to a concrete edit on an existing skill. Use when the user says reflect.
disable-model-invocation: true
---

# Reflect

Mine the current conversation for durable learnings, then route them into skill edits.

Invoke when the user says "reflect" or "/reflect". Skip when the conversation is trivial, off-topic, or already covered by an existing skill the parent followed correctly. One-offs are not learnings.

## 1. Locate the active transcript

Before fanning out, find this conversation's transcript in the active workspace's session directory. Do not search every project's session directory; those contain private chats from unrelated workspaces.

- **Cursor:** use the `agent-transcripts/` directory named by the system prompt. It may use flat (`<id>.jsonl`), nested (`<id>/<id>.jsonl`), or subagent (`<parent>/subagents/<child>.jsonl`) layouts.
- **Claude Code:** use `~/.claude/projects/<slug>/<session-id>.jsonl`, where `<slug>` replaces every non-alphanumeric character in the workspace path with `-`.
- **Pi:** use `~/.pi/agent/sessions/--<slug>--/*.jsonl`, where `<slug>` drops the leading slash and replaces each `/` with `-`.
- **Codex:** use `~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl`, keeping files whose first line has `payload.cwd` equal to the workspace path.
- **Other harnesses:** check the session directory for this workspace.

Read the newest candidates first. Confirm a transcript by finding the conversation's opening user prompt in the first user message. If no path resolves, pass a tight session digest instead.

## 2. Spawn three reviewers in parallel

Use the harness's parallel subagent facility to launch three reviewers together. They need MCP access to look up tickets, chat threads, and observability traces referenced in the transcript, so use an MCP-enabled mode.

Each reviewer and synthesizer uses a role line from the pstack model settings, or the table default if the file or line is absent. Cursor reads `~/.cursor/rules/pstack-models.mdc`; other harnesses read `~/.agents/pstack-models.md`. Leave `model` unset for `auto` or `inherit-parent`. If a configured model is unavailable, use the default and say so; if the default is unavailable, select the closest valid model of the same family.

| Lens | Role line | Default model | Prompt template |
|---|---|---|---|
| Judgment | `reflect judgment, divergent, synthesizer` | `claude-opus-5-5-xhigh` | `references/judgment-reviewer.md` |
| Tooling | `reflect tooling` | `grok-4.7-xhigh-fast` | `references/tooling-reviewer.md` |
| Divergent | `reflect judgment, divergent, synthesizer` | `claude-opus-5-5-xhigh` | `references/divergent-reviewer.md` |

Pass each template as the reviewer prompt, substituting the transcript path or digest where marked. Reviewers return findings in their subagent response.

## 3. Synthesize

Spawn one synthesizer with MCP access, using the `reflect judgment, divergent, synthesizer` model setting (default `claude-opus-5-5-xhigh`). Pass `references/synthesizer.md` as its prompt, with each reviewer's full output inlined where marked. It spot-verifies citations and returns an Accepted / Rejected / Backlog list.

## 4. Structural enforcement check

Move any Accepted item that a lint rule, script, metadata flag, or runtime check would enforce more reliably to Backlog. See the **encode-lessons-in-structure** principle skill.

## 5. Apply

Present the synthesizer's full Accepted / Rejected / Backlog output and wait for explicit approval before applying any Accepted edit. The user picks the subset and may redirect routings. Skill changes affect every future agent in the org. Do not auto-apply.

File each Backlog item to your team's devex or backlog tracker without waiting. Only the Accepted list waits for approval.

Follow each approved row's Routing exactly:

- Trivial existing-skill edit (a one-line bullet, a tightened sentence, a stale fact corrected): the parent does it directly.
- Substantive existing-skill edit (a new section, a new pattern table, more than ~10 lines): use your harness's skill-authoring skill and run its draft / test / iterate loop. Use Cursor's built-in `create-skill`, Anthropic's `skill-creator`, or follow the Agent Skills format at agentskills.io if neither is available.
- `tune description: <skill path>` (the skill exists but didn't trigger when it should have): use your harness's skill-authoring skill and run its description-optimization loop.
- `new skill: <kebab-name>`: create it with your harness's skill-authoring skill. Do not invent the shape ad hoc.

If your environment ships a SKILL.md validator, run it on every touched skill before declaring done.

## 6. Summarize for the user

Short list, no preamble:

- Edits applied: `<skill path>`. What changed, one line each.
- New skills created: `<skill path>`. One line each (rare).
- Backlog filed to the devex tracker: `<issue title>` (`<tags>`). One line each.
- Dropped: one line per rejected finding + reason from the synthesizer.
