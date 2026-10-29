---
name: poteto-help
description: Guides users through pstack setup, /poteto-mode, and picking the skill, playbook, or principle for a task. Type /poteto-help with a question.
disable-model-invocation: true
---

# Poteto help

In Claude Code, consult [the Claude Code adapter](references/claude-code.md) when a question needs Claude-specific tool, model, or path mappings.

Answer the user's question about pstack, hand them a prompt they can send, and link the file the answer came from. For a help question, don't start the work. The user asked how, and a pstack run spends real tokens, so let them send the prompt.

A message that asks for work, such as "use pstack to fix this bug", is not a help question. Check whether `poteto-mode` is installed by that exact skill name. If it is, read its actual installed `SKILL.md` and do the work under it. If it is not, explain that the skill must be installed before work can start. Mention once that a Custom Mode keeps it on when the active harness supports one.

This file maps questions to skills and bundled guide pages. Those sources own the details. The seven guide pages this skill reads are bundled under `references/guide/`. For a sibling skill, check the active harness's installed skill catalog by its exact name and read its actual path before quoting it. If it is not installed, answer from this map's summary only, say when more detail requires installation, and give the public source URL. Never treat a source link as an installed skill.

## Find out what they need

Infer the need from the message and the conversation. A named situation, such as "which skill reviews a PR?", goes straight to its section. If the need is still unclear, ask one multiple-choice question with these options, then answer only the section they pick:

- Get set up
- Start a task with `/poteto-mode`
- Pick a skill for a situation
- Fix a run that went wrong
- Make pstack my own

Check the state that changes the answer, and mention it only when it does:

- If the active harness's model settings file is missing, `setup-pstack` has not run for this user, so every role uses its default model. See [`references/pstack-harness.md`](references/pstack-harness.md) for the paths.
- No `verify-*` skill or other app harness in the project means agents have no scripted way to drive the app. Mention `/create-verification-skill` when the question is about proving a change works.
- No formal verification skill in the project means no property is checked past what tests reach. Mention `/create-formal-verification-skill` when the question is about a race, an invariant, or another case tests rarely hit. When one exists and the code it covers changed after the commit it records as last in sync, mention `/maintain-formal-verification-skill` if the question touches that code.

When the model rule is missing and it matters, ask whether the user wants to pick a model for each role and a reasoning budget now. It matters when the user is new, the question is about setup or cost, or the answer depends on which models run. Ask at most once per chat. If the need is also unclear, ask both questions together. Offer two choices:

- Now: give them `/setup-pstack` to type, and answer their question too.
- Later: answer their question, and add one line saying every role keeps its default model until they run `/setup-pstack`.

## Get set up

1. Install the skills you need with `npx skills add toRolex/pstack`, or clone the repository and link selected `skills/<source-directory>` folders into the harness's skills directory. A standard Skills install provides skill files and their bundled resources; it does not register named subagents.
2. If setup is needed, install and invoke the skill named `setup-pstack`. It asks for a reasoning budget, maps a model to each role, and writes the active harness's model settings file. Then it offers once each to generate a verification skill and a formal verification skill for the project, unless the project already has one.
3. Start a real task with the installed skill named `poteto-mode`, a goal, and a check that can pass or fail. Install `poteto-mode` and any sibling skills its selected playbook needs.

Installing changes nothing until the user invokes a skill. Only `setup-pstack` loads from the user's words. [Guide page 1](references/guide/01-setup.md) has the details. Offer to word their first prompt with them, per [`references/prompting.md`](references/prompting.md).

If cost is the worry, say where the tokens go and how to spend fewer. pstack spends extra tokens on subagents and review panels. Rerun `/setup-pstack` and pick a smaller budget or cheaper models. A role set to `auto` or `inherit-parent` runs on the chat's model, which saves tokens when the chat runs on Auto or a cheaper model. A shorter panel list runs fewer subagents, one for each entry. Save `/poteto-mode` for work that needs rigor.

The skills use the Agent Skills format and do not require a Cursor or Claude plugin. In Claude Code, consult [`references/claude-code.md`](references/claude-code.md) when a step needs tool or path mappings, and skip Cursor-only features such as Bugbot or Automations with a one-line note. When a workflow needs a `poteto-agent` or Comment Sicko prompt but the harness has no registered agent, pass the prompt bundled with the corresponding skill to a generic subagent. A standard Skills install does not register those agent names. Custom Modes and `/loop` remain Cursor features.

## Start a task with `/poteto-mode`

`/poteto-mode` matches the task to a playbook, copies the playbook's steps into the todo list, and runs the other skills as the steps need them. A step it skips stays in the list as `skip: <reason>`. A good prompt states the goal and how to tell it's done. It doesn't list skills, because a hand-written sequence tends to drop or reorder steps the playbook would keep. Read [`references/prompting.md`](references/prompting.md) before you help word one. [Guide page 2](references/guide/02-poteto-mode.md) has examples.

Whether `/poteto-mode` stays on depends on how the user starts it:

- Enter on `/poteto-mode` attaches the skill to one message. It fades as the chat moves on.
- Option+Enter on Mac or Alt+Enter on Windows, or Use as Mode from the skill entry, makes it a Custom Mode. It stays in context every turn until the user exits the mode, and it stays out of casual turns.
- Cursor's docs list Custom Modes in the Agents Window and the CLI. Elsewhere, start each new task with `/poteto-mode`.

Link [Cursor's skills docs](https://cursor.com/docs/skills) when this comes up. Mid-chat, "new task" makes the mode match a fresh playbook. When `poteto-mode` is installed, it uses the prompt bundled in that skill for playbook delegates. A Skills install does not register `poteto-agent`; follow the skill's generic-subagent fallback when the harness has no registered agent.

## Pick a skill

The default answer is `/poteto-mode`, which runs most of the others when its steps need them. Name a skill directly when the user wants more or less of something than the playbook gives. Read the skill before you recommend it, and give one example prompt.

| The user wants to | Skill |
|---|---|
| Do any non-trivial task with rigor | [`/poteto-mode`](https://github.com/toRolex/pstack/blob/main/skills/poteto-mode/SKILL.md) |
| Check that the agent understood their goal and the problem before it starts | [`/in-your-own-words`](https://github.com/toRolex/pstack/blob/main/skills/in-your-own-words/SKILL.md) |
| Get a prompt rewritten deeper, not bigger, before sending it: what a top professional would add, their raw material and methods, and an outside check. It returns the prompt and doesn't do the task | [`/sharpen`](https://github.com/toRolex/pstack/blob/main/skills/sharpen/SKILL.md) |
| Know how code works now, or where new code should live | [`/how`](https://github.com/toRolex/pstack/blob/main/skills/how/SKILL.md) |
| Know why code is shaped this way, or where a number came from | [`/why`](https://github.com/toRolex/pstack/blob/main/skills/why/SKILL.md) |
| Understand a change or subsystem, explained plainly | [`/teach`](https://github.com/toRolex/pstack/blob/main/skills/teach/SKILL.md) |
| Catch up on their own recent work on a topic | [`/recall`](https://github.com/toRolex/pstack/blob/main/skills/recall/SKILL.md) |
| Catch up on what changed in this chat since their last message, in plain words and small visuals, with every item waiting on them listed and decidable from the reply alone | [`/ketchup`](https://github.com/toRolex/pstack/blob/main/skills/ketchup/SKILL.md) |
| Catch up like `/ketchup`, in a short subtitled video of slides, with the waiting calls as text under it | [`/ketchup-video`](https://github.com/toRolex/pstack/blob/main/skills/ketchup-video/SKILL.md) |
| Know what a small diff could break outside itself | [`/blast-radius`](https://github.com/toRolex/pstack/blob/main/skills/blast-radius/SKILL.md) |
| Settle types and module shape before code that crosses a function boundary | [`/architect`](https://github.com/toRolex/pstack/blob/main/skills/architect/SKILL.md) |
| Get several attempts at one brief, merged into the best one | [`/arena`](https://github.com/toRolex/pstack/blob/main/skills/arena/SKILL.md) |
| Run parallel checks over slices, or race workers, as cloud agents | [`/swarm`](https://github.com/toRolex/pstack/blob/main/skills/swarm/SKILL.md) |
| Have different models review a diff and try to break it | [`/interrogate`](https://github.com/toRolex/pstack/blob/main/skills/interrogate/SKILL.md) |
| Fix a bug test-first when a cheap local test exists | [`/tdd-pstack`](https://github.com/toRolex/pstack/blob/main/skills/tdd/SKILL.md) |
| Apply TypeScript rules to `.ts` or `.tsx` work | [`/typescript-best-practices`](https://github.com/toRolex/pstack/blob/main/skills/typescript-best-practices/SKILL.md) |
| Strip comments before review, using a reviewer that didn't write them | [`/no-comments`](https://github.com/toRolex/pstack/blob/main/skills/no-comments/SKILL.md) |
| Clean AI tells out of prose | [`/unslop`](https://github.com/toRolex/pstack/blob/main/skills/unslop/SKILL.md) |
| Write docs, an RFC, a README, a PR description, or a commit message to a standard | [`/technical-writing`](https://github.com/toRolex/pstack/blob/main/skills/technical-writing/SKILL.md) |
| Hear the last reply again in plain words | [`/bro`](https://github.com/toRolex/pstack/blob/main/skills/bro/SKILL.md) |
| Give agents a scripted way to drive the app and prove behavior | [`/create-verification-skill`](https://github.com/toRolex/pstack/blob/main/skills/create-verification-skill/SKILL.md) |
| Bring a verification skill and its feature map back in line with the app | [`/maintain-verification-skill`](https://github.com/toRolex/pstack/blob/main/skills/maintain-verification-skill/SKILL.md) |
| Formally verify a race, invariant, or other property that tests rarely reach | [`/create-formal-verification-skill`](https://github.com/toRolex/pstack/blob/main/skills/create-formal-verification-skill/SKILL.md) |
| Bring a formal verification back in line after the code it covers changed, and learn whether a failure is drift or a bug | [`/maintain-formal-verification-skill`](https://github.com/toRolex/pstack/blob/main/skills/maintain-formal-verification-skill/SKILL.md) |
| Show a PM or designer what the user sees as a chart checked by a TLA+ model, with the shortest path to each state that breaks a rule | [`/statechart`](https://github.com/toRolex/pstack/blob/main/skills/statechart/SKILL.md) |
| Vet a performance number before reporting or acting on it | [`/benchmark-checklist`](https://github.com/toRolex/pstack/blob/main/skills/benchmark-checklist/SKILL.md) |
| Run a large or cross-cutting change, or one to review after stepping away | [`/figure-it-out`](https://github.com/toRolex/pstack/blob/main/skills/figure-it-out/SKILL.md) |
| Keep a decision log during a run, and review it afterward | [`/show-me-your-work`](https://github.com/toRolex/pstack/blob/main/skills/show-me-your-work/SKILL.md) |
| Pick a model for each role and a reasoning budget | [`/setup-pstack`](https://github.com/toRolex/pstack/blob/main/skills/setup-pstack/SKILL.md) |
| Turn their own working habits into a personal mode skill | [`/automate-me`](https://github.com/toRolex/pstack/blob/main/skills/automate-me/SKILL.md) |
| Turn what a finished task taught into skill edits | [`/reflect`](https://github.com/toRolex/pstack/blob/main/skills/reflect/SKILL.md) |
| Stop agents from repeating the same mistakes in this repo | [`/correct`](https://github.com/toRolex/pstack/blob/main/skills/correct/SKILL.md) |
| Build a page whose buttons wake a Grok Bot over a webhook | [`/make-bot-ui`](https://github.com/toRolex/pstack/blob/main/skills/make-bot-ui/SKILL.md) |
| Find their way around pstack | `/poteto-help` |

If a skill is missing from the table, check the active harness's installed skill catalog and route by its exact skill name and description. Read its actual `SKILL.md` only when installed. If it is absent, give the public source URL and do not imply that it was read.

Close calls:

- `/how` explains what the code does. `/why` explains the reasons. `/teach` runs one or both and explains the result plainly.
- `/arena` gives every worker the same brief and merges the best parts. `/swarm` splits work into slices or a race and returns one report.
- `/architect` implements right after it settles the design. Add "with checkpoint" to review the design before it writes code.
- `/interrogate` reviews the diff. `/blast-radius` looks for breakage outside the diff and proves the one fact that makes the change safe.
- `/recall` rebuilds context across recent chats. `/ketchup` covers only this chat since the user's last message. Resuming one specific chat or branch is the Session pickup playbook.
- `/figure-it-out` designs one rigorous run. The Orchestrate playbook runs a program that spans days and many PRs. The Autonomous run playbook drives one task to a finish condition.

Not in pstack:

- `/deslop`, `control-cli`, and `control-ui` ship in the `cursor-team-kit` plugin.
- `/loop` and `/create-skill` are Cursor built-ins.
- pstack has no `/orchestrate` skill. Orchestrate is a `/poteto-mode` playbook. If the slash menu shows `/orchestrate`, another plugin provides it.

## Playbooks and principles

Playbooks are step lists inside `/poteto-mode`, not skills, so they have no slash command. Inside `/poteto-mode`, describing the task picks one, and these phrases name one directly:

- "babysit this pr" or "check on pr 123" runs Babysit. It drives the PR to merge-ready and stops there. It doesn't merge unless the user asks to merge, land, or ship.
- "land the stack" runs Shipping.
- "take over this branch" runs Session pickup.
- "pause safely" runs Pause safely.
- "full autopilot on this queue" runs Autopilot-full. "autopilot, don't merge" runs Autopilot-stack.
- "run the eval playbook" runs Eval.

Without `/poteto-mode`, a phrase such as "babysit this pr" can start Cursor's own skill for the same job instead. The Playbooks section of [`poteto-mode`](https://github.com/toRolex/pstack/blob/main/skills/poteto-mode/SKILL.md) lists every playbook and when it applies. [Guide page 6](references/guide/06-verify-and-ship.md) covers opening, babysitting, and landing a PR.

pstack has no planning skill. Cursor's Plan Mode works alongside it. For work that spans phases or stacked PRs, asking `/poteto-mode` for a plan runs the [Multi-phase plan playbook](https://github.com/toRolex/pstack/blob/main/skills/poteto-mode/playbooks/multi-phase-plan.md), which writes the plan and doesn't implement it. For a design question, the Prototype playbook or `/architect` settles it in code first.

Principles are one-rule skills that `/poteto-mode` reads and cites in its replies. The user rarely invokes one. They steer with the names instead, as in "apply prove it works. show me the real output." Typing `/principle-<name>` still loads one on demand. [Guide page 8](references/guide/08-principles.md) lists them.

## Fix a run that went wrong

| Symptom | Fix |
|---|---|
| The mode stopped applying after a few turns | It was started with Enter. Start it as a Custom Mode, or start each task with `/poteto-mode`. |
| A question got treated as the next step of the last task | Say "new task", or say the turn doesn't need the mode. |
| A new model choice had no effect | The rule from `/setup-pstack` applies to new chats. Start one. |
| Runs cost more than expected | See the cost paragraph under Get set up. |
| A skill didn't load on its own | Only `/setup-pstack` loads from the user's words. The others load when the user types them or when `/poteto-mode` runs them, and it doesn't run every skill. |
| Parallel agents overwrote each other | Give each agent its own worktree, or run them as cloud agents, which each get their own machine. |
| An overnight run moved but finished nothing | `/loop` needs a check that can pass or fail, not a duration. See [guide page 7](references/guide/07-overnight.md). |
| The reply claims success from a green build | Ask for the real command, flow, stored value, or profile. That's the prove-it-works principle. |

For a run that drifts, [`references/prompting.md`](references/prompting.md) has one-line steers. [Guide page 10](references/guide/10-recipes-and-pitfalls.md) has more pitfalls and the recipes worth copying.

## Make pstack my own

- [`/automate-me`](https://github.com/toRolex/pstack/blob/main/skills/automate-me/SKILL.md) drafts a personal mode skill from the user's own history, to use alongside `/poteto-mode`.
- [`/reflect`](https://github.com/toRolex/pstack/blob/main/skills/reflect/SKILL.md) after a session turns its lessons into skill edits the user approves.
- `/poteto-mode write a skill for <workflow>` runs the authoring playbook. The eval playbook tests a skill change blind.
- Fix a misbehaving skill in its own PR, not inside the feature work where it went wrong.

[Guide page 9](references/guide/09-make-it-yours.md) covers each of these.

## Reply

Lead with the answer. Give at most one example prompt in a code block, adapted from [`references/recipes.md`](references/recipes.md) when one fits, then the link to that file. Keep it short unless the user asked for the whole map.
