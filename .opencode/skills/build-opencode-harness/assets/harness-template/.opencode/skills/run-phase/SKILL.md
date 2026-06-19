---
name: run-phase
description: Use inside an OpenCode harness project to inspect, approve after explicit user approval, execute, or continue an existing phases/{task-name}/ directory using scripts/execute.py, state.json, hooks, command steps, verify steps, and approved agent-step scope. This skill must not design new phase scope.
---

# Run Phase

Operate an existing phase directory in an installed OpenCode harness project.

## Workflow

1. Confirm the target is a bounded task directory under `phases/{task-name}/`.
2. Read `AGENTS.md`, relevant docs under `docs/`, `index.json`, phase files, and `state.json`.
3. Inspect current state with `python scripts/execute.py phases/{task-name} status`.
4. If `approved_by_user` is false, do not run. Mark approval only after explicit user approval with `python scripts/execute.py phases/{task-name} approve`.
5. Before executing a step, record a baseline with `git status --short` and treat pre-existing changes as user-owned unless they are explicitly in the current phase scope.
6. Continue the next incomplete step according to `index.json` and `state.json`.
7. Stop for hook blocks, impossible done criteria, conflicting docs, `CRITICAL` rule conflicts, credentials, destructive approval, or unrelated dirty worktree changes.
8. Report changed files, commits, completed steps, verification results, blocked state, and remaining risks.

## Step Handling

- `agent`: perform the phase instructions yourself inside the approved scope. The runner intentionally blocks on agent steps, so create the required commit when `commit_after` is true and update `state.json` only after the step is genuinely complete.
- `command`: run through `python scripts/execute.py phases/{task-name} run --max-retries 3`.
- `verify`: run through `python scripts/execute.py phases/{task-name} run --max-retries 3`.

## Commit Policy

Always commit after a development-related step completes and before marking that step complete in `state.json`.

A step is development-related when either:

- `index.json` has `"commit_after": true` for the step.
- The step changes production code, tests, app configuration, build files, scripts, migrations, or project docs as part of development work.

Use this sequence:

```bash
git status --short
git diff --stat
git add <phase-owned-path>...
git commit -m "<type>: <short task/step summary>"
git rev-parse --short HEAD
```

Use Conventional Commit types from `AGENTS.md`. Prefer `test:` for test-only TDD steps, `feat:` or `fix:` for behavior implementation, `refactor:` for behavior-preserving structure changes, and `docs:` for docs-only development updates.

Never stage unrelated paths. Compare the current `git status --short` to the baseline captured before the step. If changed paths include files outside the current phase scope, stop and report them instead of committing. If there are no file changes, record that no commit was created and why.

When completing an `agent` step in `state.json`, keep `commit_after` aligned with `index.json`. Also record `commit`, `commit_skipped_reason`, and `baseline_status` under `steps.{step-id}` when applicable. Mirror baseline status under `baseline_status.{step-id}` and commit hashes under `commits.{step-id}`.

## Rules

- Do not change phase scope during execution. Use `make-phase` to revise scope.
- Do not approve a phase unless the user explicitly approved it.
- Do not bypass hook failures or manually mark command/verify steps complete.
- Do not mark a development-related step complete before its commit is created or explicitly reported as unnecessary because there were no changes.
- Do not stage every changed path indiscriminately when unrelated user changes are present.
- Do not run destructive commands without explicit approval.
- Keep work inside the current phase's instructions and out-of-scope boundaries.
