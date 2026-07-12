---
name: run-phase
description: Use inside an OpenCode harness project to inspect, approve after explicit user approval, execute, or continue an existing phases/{task-name}/ directory using scripts/execute.py, state.json, hooks, command steps, verify steps, and opencode-run agent orchestration. This skill must not design new phase scope.
---

# Run Phase

Operate an existing phase directory in an installed OpenCode harness project.

## Workflow

1. Confirm the target is a bounded task directory under `phases/{task-name}/`.
2. Read `AGENTS.md`, relevant docs under `docs/`, `phases/{task-name}/index.json`, phase files, and `state.json`.
3. Inspect current state:

```bash
python scripts/execute.py phases/{task-name} status
```

4. If `approved_by_user` is false, do not run. If the user has explicitly approved this phase design in the current conversation, mark approval:

```bash
python scripts/execute.py phases/{task-name} approve
```

5. Before executing, inspect `git status --short` and treat pre-existing changes as user-owned unless they are explicitly in the current phase scope.
6. Continue the next incomplete step according to `index.json` and `state.json` through the runner:

```bash
python scripts/execute.py phases/{task-name} run --max-retries 3
```

Use `--git-commits` when approved agent steps have `"commit_after": true`.
7. Stop for hook blocks, impossible done criteria, conflicting docs, `CRITICAL` rule conflicts, credentials, destructive approval, or unrelated dirty worktree changes.
8. Report changed files, commits, completed steps, verification results, blocked state, and remaining risks.

## Step Handling

- `agent`: let `scripts/execute.py run` orchestrate the approved step with `opencode run <prompt> --format json --dir <project-root>`. The runner writes `agent-output/{step-id}.jsonl`, records attempts, exit code, commit, and failures in `state.json`, and blocks before OpenCode when `commit_after` is true but `--git-commits` was not provided.
- `command`: run through the runner so hooks, retries, command extraction, and failures are recorded.
- `verify`: run through the runner so verification output and failures are recorded.

Default run:

```bash
python scripts/execute.py phases/{task-name} run --max-retries 3
```

Run with automatic commits for `commit_after` steps:

```bash
python scripts/execute.py phases/{task-name} run --max-retries 3 --git-commits
```

Use `--agent-runner none` only when you intentionally want to stop for manual/external agent execution. Use `--branch-prefix` only when the user wants per-task branches. Do not pass `--dangerously-skip-permissions` unless the user explicitly approved that OpenCode permission bypass.

## Commit Policy

Development-related steps should commit before they are marked complete.

A step is development-related when either:

- `index.json` has `"commit_after": true` for the step.
- The step changes production code, tests, app configuration, build files, scripts, migrations, or project docs as part of development work.

When not using runner-managed commits, use this sequence:

```bash
git status --short
git diff --stat
git add <phase-owned-path>...
git commit -m "<type>: <short task/step summary>"
git rev-parse --short HEAD
```

Use Conventional Commit types from `AGENTS.md`. Prefer `test:` for test-only TDD steps, `feat:` or `fix:` for behavior implementation, `refactor:` for behavior-preserving structure changes, and `docs:` for docs-only development updates.

Never stage unrelated paths. Compare the current `git status --short` to the baseline captured before the run. If changed paths include files outside the current phase scope, stop and report them instead of committing. If there are no file changes, the runner records why no commit was created.

## Rules

- Do not change phase scope during execution. Use `make-phase` to revise scope.
- Do not approve a phase unless the user explicitly approved it.
- Do not bypass hook failures or manually mark command/verify steps complete.
- Do not mark a development-related step complete before its commit is created or explicitly reported as unnecessary because there were no changes.
- Do not stage every changed path indiscriminately when unrelated user changes are present.
- Do not run destructive commands without explicit approval.
- Keep work inside the current phase's instructions and out-of-scope boundaries.
