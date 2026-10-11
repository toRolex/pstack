# pstack 0.15.17 upstream sync

## Intent
Synchronize this fork directly from Lauren Tan's `cursor/plugins/pstack` 0.15.17 source, preserving established fork adapters and removing the intermediate mirror as an update source.

## Inputs
- Pure author baseline: `/tmp/pstack-upstream-check.HLb3H3/baseline` at `759b97e` (0.15.15).
- Author source: `/tmp/pstack-upstream-check.HLb3H3/plugins-main/pstack` at `9d76bcab133aefcccb16121d7be874e6aa823729`.
- Fork base: `main` at `4e89780`.

## Decisions
- Integrated each author delta against the fork with a three-way comparison. All 38 author-changed existing paths are represented; added `skills/ketchup/SKILL.md` and refreshed plugin version to 0.15.17.
- For overlapping changes in README, arena, how, interrogate, poteto-mode, reflect, and why, retained the fork's Chinese default and harness adapters while taking the new author content. In particular, `how`, `why`, and `reflect` retain subagent, model-setting, MCP, transcript, and skill-authoring guidance across harnesses.
- Kept the author README body byte-for-byte below the fork-specific preface in `README.en.md`; the preface documents the fork-only TDD name. Updated the Chinese README with ketchup and fork-specific details.
- Kept `tdd-pstack` and the Herdr-backed make-bot-ui server/config unchanged. Updated fork-local README, automation, guide, and playbook references to the tdd-pstack invocation.
- Replaced `MIRROR.md`'s branch-copy workflow with a direct upstream-source synchronization method; kept `backnotprop/bro` only as the external project used by the `bro` skill.
- Did not include `.pi` runtime files or temporary dependencies.

## Deviations
- No product or scope deviation. Where the author rewrite removed fork harness wording, reapplied the adapter beside the rewritten author workflow to retain both updates.

## Validation log
- Confirmed the dedicated workspace started clean at the child of `main`; jj and Git identities matched.
- Checked for candidate secret files before the first snapshot. None were present; `.gitignore` already covers dependency and common generated files.
- `jj desc` initially encountered a transient colocated index lock, then succeeded on retry without manual lock removal.
- Compared all baseline-to-author changed paths: 38 existing changed files, none missing from the integrated fork; one new ketchup skill added.
- Verified the English author README section is byte-identical to the author's current README.
- Verified all 55 SKILL.md frontmatter blocks parse with valid required fields and all local relative Markdown links resolve.
- Verified Herdr server/config and tdd-pstack skill bytes match the pre-sync fork snapshot.
- Ran the existing test suite: 52 passed, 0 failed; `bun run typecheck` passed. Temporary `node_modules` symlink to the original workspace was removed after validation.
- Parent independently reran the 52 tests and typecheck, checked whitespace, and verified the English author README and unchanged Herdr/TDD assets.
- Independent review caught an accidental restoration of author frontmatter `name: Poteto Mode`; restored the fork's `name: poteto-mode`. All 55 skill names now pass lowercase kebab-case and length validation. Also corrected a duplicated `tool` word in the swarm adapter.
