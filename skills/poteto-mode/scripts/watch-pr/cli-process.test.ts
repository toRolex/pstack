import { expect, it } from "bun:test";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

it("reports unavailable checks once and exits in status-only mode", () => {
  const directory = mkdtempSync(join(tmpdir(), "watch-pr-cli-"));
  writeFileSync(
    join(directory, "gh"),
    `#!/bin/sh
case "$1:$2" in
  pr:view)
    printf '%s\\n' '{"mergeable":"MERGEABLE","mergeStateStatus":"CLEAN","reviewDecision":"APPROVED","headRefOid":"head","headRefName":"feature","baseRefName":"main","state":"OPEN","mergedAt":null,"isDraft":true}'
    ;;
  pr:checks)
    printf '%s\\n' 'no checks reported' >&2
    exit 1
    ;;
  api:graphql)
    case "$*" in
      *ReviewThreads*)
        printf '%s\\n' '{"data":{"repository":{"pullRequest":{"reviewThreads":{"nodes":[]}}}}}'
        ;;
      *)
        printf '%s\\n' '{"data":{"repository":{"pullRequest":{"commits":{"nodes":[{"commit":{"statusCheckRollup":null}}]}}}}}'
        ;;
    esac
    ;;
  *)
    printf '%s\\n' 'unexpected fake GitHub command' >&2
    exit 99
    ;;
esac
`,
    { mode: 0o755 }
  );
  const result = spawnSync(
    process.execPath,
    [
      join(import.meta.dir, "watch-pr"),
      "--owner",
      "fixture-owner",
      "--repo",
      "fixture-repo",
      "--pr",
      "6",
      "--status-only",
    ],
    {
      cwd: directory,
      env: {
        PATH: `${directory}:${dirname(process.execPath)}:/usr/bin:/bin`,
        HOME: directory,
      },
      encoding: "utf8",
      timeout: 2_500,
    }
  );
  expect({
    exit: result.status,
    verdicts: result.stdout.trim().split("\n").map((line) => JSON.parse(line)),
  }).toMatchObject({
    exit: 7,
    verdicts: [{
      kind: "BLOCKER",
      terminal: true,
      exitCode: 7,
      blocker: {
        kind: "status-query",
        failures: 1,
        failure: {
          kind: "checks-unavailable",
          detail: "could not read PR checks: fast path exit=1; GraphQL rollup was empty; no checks reported",
        },
      },
    }],
  });
});
