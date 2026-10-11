# Syncing this fork

This fork follows Lauren Tan's [`cursor/plugins/pstack`](https://github.com/cursor/plugins/tree/main/pstack) directly. There is no intermediate mirror source. Preserve fork-specific changes while syncing the author's `pstack/` directory, especially Chinese `README.md`, the adapted introduction in `README.en.md`, cross-harness instructions, `tdd-pstack`, and the Herdr-backed `make-bot-ui` server. The [`backnotprop/bro`](https://github.com/backnotprop/bro) project remains an external dependency referenced by the `bro` skill, not an update source.

## Steps

1. Fetch or check out the author's latest `cursor/plugins` and record the exact commit SHA. Use the pure author baseline for the common ancestor when available. Compare the baseline-to-author changes with baseline-to-fork changes using a three-way merge or an equivalent per-file integration. Do not overwrite fork changes wholesale.
2. Integrate all author additions and edits. For overlapping changes, keep the author's current meaning and retain the fork's harness-neutral adaptation. In particular, author revisions to `how`, `why`, and `reflect` must not remove the fork's subagent, settings, transcript, or skill-folder mappings.
3. Keep the upstream README body in `README.en.md` byte-for-byte below its fork-specific introduction. Keep the default `README.md` in Chinese, update its upstream-derived content and fork-specific introduction, and add entries for new upstream skills. Keep references to `tdd-pstack` and the Herdr server intact.
4. Update `.cursor-plugin/plugin.json` to the author version. Check all local Markdown links and SKILL frontmatter after the merge. Review every difference from the author tree and confirm it is a documented fork adaptation.
5. Refresh the bundled Comment Sicko prompt only when its author source changed. Check upstream skill diffs for Cursor-only tool names and reapply harness mappings where needed. The Harness section in `skills/poteto-mode/SKILL.md` is the mapping source of truth.

Use jj to manage the workspace and do not push or publish unless explicitly requested.
