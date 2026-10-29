# Syncing this fork

This fork follows Lauren Tan's [`cursor/plugins/pstack`](https://github.com/cursor/plugins/tree/main/pstack) directly. There is no intermediate mirror source. Preserve fork-specific changes while syncing the author's `pstack/` directory: the Chinese `README.md`, the adapted introduction in `README.en.md` (the English body below its separator must remain byte-for-byte equal to the author's `pstack/README.md`), cross-harness instructions, `tdd-pstack`, and the Herdr-backed `make-bot-ui` server. The [`backnotprop/bro`](https://github.com/backnotprop/bro) project remains an external dependency referenced by the `bro` skill, not an update source.

## Source and merge

1. Record the exact author commit and use the pure author baseline as the common ancestor when available. Compare baseline-to-author changes with baseline-to-fork changes using a three-way merge or an equivalent per-file integration; never overwrite fork changes wholesale.
2. Integrate author additions and edits. For overlapping changes, preserve the author's current meaning and the fork's harness-neutral adaptation. In particular, author revisions to `how`, `why`, and `reflect` must not remove the fork's subagent, settings, transcript, or skill-folder mappings. Preserve the principle-skill naming and navigation rules in the Principles section of `skills/poteto-mode/SKILL.md`.
3. Review every author deletion against the pure baseline and fork-specific content before deleting it. Review every remaining diff from the author tree and confirm it is a documented fork adaptation.
4. Refresh the bundled Comment Sicko prompt only when its author source changed. Check upstream skill diffs for Cursor-only tool names and reapply harness mappings where needed. The Harness section in `skills/poteto-mode/SKILL.md` is the mapping source of truth.

## Agent Skills distribution boundary

- Keep one canonical set of `skills/` and the root prompt sources in `agents/`. Do not copy or check in `harness/pstack/claude-code/`, `.claude-plugin/`, or a root `plugin.json`.
- Keep `.cursor-plugin/plugin.json` aligned with the author version and preserve its Cursor-specific fields. It is upstream Cursor metadata, not a prerequisite or bundle for Agent Skills installation.
- Keep `docs/harness/claude-code.md` as the single manually maintained Claude adapter. Its references in skills are conditional and point to generated copies at `skills/<name>/references/claude-code.md`; do not introduce `pstack:` commands or named-agent registration assumptions.
- Keep `skills/poteto-mode/SKILL.md` as the source of Harness and Subagents guidance. Run `node scripts/generate-skill-resources.mjs` after changing its sections, the Claude adapter, root agent prompts, or guide pages; commit the generated skill-local references. Run the same script with `--check` to reject stale copies.
- The root `agents/` files remain the prompt sources. The generated copies inside `poteto-mode` and `no-comments` are prompt resources, not registered subagents. Standard Skills installations pass them to generic subagents where supported; without a subagent tool, follow the skill's serial fallback.
- Keep `.pi/` and pre-existing notes untouched during syncs.

## Documentation, validation, and delivery

1. Keep the default `README.md` in Chinese; update its upstream-derived translation, Agent Skills installation instructions, dependency combinations, and entries for new skills. Keep local navigation and the fork-specific introduction in `README.en.md`, with the author's English README body byte-for-byte below its separator; the upstream plugin instructions in that body describe the author source only.
2. Keep `.cursor-plugin/plugin.json` aligned with the author version. Do not add Claude marketplace or root plugin manifests. Check the Cursor manifest JSON, all SKILL frontmatter and local Markdown links, `node scripts/generate-skill-resources.mjs --check`, adapter-pointer coverage, generated resource freshness, declared skill dependencies, and retained fork adaptations. Confirm `.claude-plugin/` and root `plugin.json` are absent. Run available tests from the fork worktree, never from an untrusted upstream download directory, and record tests that could not run.
3. Keep the integration uncommitted and unpublished unless explicitly requested. Record the isolated worktree path, source commits, merge counts and decisions, changed-file inventory, validation evidence, and unresolved items in `/tmp/pstack-sync-implementation-report.md`.

Use jj to manage the workspace and do not push or publish unless explicitly requested.
