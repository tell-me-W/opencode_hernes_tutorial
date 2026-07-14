---
name: run-phase
description: Use inside an OpenCode harness project to inspect, approve after explicit user approval, execute externally, and record state for an existing phases/{task-name}/ directory. scripts/execute.py is a state manager only; it must not run agents, hooks, shell commands, verification commands, git commands, or change phase scope.
---

# Run Phase

Operate an existing phase directory in an installed OpenCode harness project.

`scripts/execute.py` is intentionally state-only. It records approval, current step, completion, failures, blocks, external output files, and commit hashes. It does not execute implementation work.

## Workflow

1. Confirm the target is a bounded task directory under `phases/{task-name}/`.
2. Read `AGENTS.md`, relevant docs under `docs/`, `phases/{task-name}/index.json`, phase files, and `state.json`.
3. Inspect current state:

```bash
python scripts/execute.py phases/{task-name} status
```

4. If `approved_by_user` is false, do not execute. If the user explicitly approved this phase design in the current conversation, record approval:

```bash
python scripts/execute.py phases/{task-name} approve
```

5. Ask the state manager for the next incomplete step:

```bash
python scripts/execute.py phases/{task-name} next
```

`run` is a compatibility alias for `next`; it does not run anything.

6. When beginning a step, record that the step is in progress:

```bash
python scripts/execute.py phases/{task-name} start --step <step-id>
```

7. Execute the step outside `execute.py`:

- `agent`: use OpenCode/Codex or another approved agent workflow against the phase file.
- `command`: run the deterministic command block yourself after checking safety.
- `verify`: run the verification command block yourself, or perform the exact manual verification described by the phase.

8. Record the result:

```bash
python scripts/execute.py phases/{task-name} complete --step <step-id>
python scripts/execute.py phases/{task-name} fail --step <step-id> --reason "<reason>"
python scripts/execute.py phases/{task-name} block --step <step-id> --reason "<reason>"
```

For development-related steps with `"commit_after": true`, create the commit outside `execute.py`, then record the evidence:

```bash
python scripts/execute.py phases/{task-name} complete --step <step-id> --commit <hash>
```

If the step legitimately changed nothing:

```bash
python scripts/execute.py phases/{task-name} complete --step <step-id> --no-changes
```

9. Repeat `next`, external execution, and state recording until no steps remain.
10. Report changed files, commits, completed steps, verification results, blocked state, and remaining risks.

## State Manager Commands

- `status`: print `index.json`, next step, and `state.json`.
- `approve`: set `approved_by_user=true`; use only after explicit user approval.
- `next`: print the next incomplete step without changing state.
- `run`: compatibility alias for `next`; it does not execute.
- `start`: mark a step as `running` and set `current_phase`.
- `complete`: mark a step as completed after external execution.
- `fail`: record an external failure and set `blocked` for review.
- `block`: record a hard blocker and set `blocked`.

Useful metadata:

```bash
python scripts/execute.py phases/{task-name} fail --step <step-id> --exit-code 1 --output-file path/to/log.txt
python scripts/execute.py phases/{task-name} complete --step <step-id> --output-file path/to/result.jsonl --note "manual verification passed"
```

## Step Handling

- `agent`: read the phase file, run the agent externally, inspect output, then record `complete`, `fail`, or `block`.
- `command`: run command blocks externally. Do not use `execute.py` for shell execution.
- `verify`: run verification externally. Do not mark complete until verification evidence exists.

`execute.py` validates step type, dependency completion, approval state, and `commit_after` evidence. It does not validate business correctness.

## Commit Policy

Development-related steps should commit before they are marked complete.

A step is development-related when either:

- `index.json` has `"commit_after": true` for the step.
- The step changes production code, tests, app configuration, build files, scripts, migrations, or project docs as part of development work.

Use this sequence outside `execute.py`:

```bash
git status --short
git diff --stat
git add <phase-owned-path>...
git commit -m "<type>: <short task/step summary>"
git rev-parse --short HEAD
```

Then record the commit:

```bash
python scripts/execute.py phases/{task-name} complete --step <step-id> --commit <hash>
```

Never stage unrelated paths. Compare the current `git status --short` to the baseline captured before the step. If changed paths include files outside the current phase scope, stop and record a block instead of committing.

## Rules

- Do not change phase scope during execution. Use `make-phase` to revise scope.
- Do not approve a phase unless the user explicitly approved it.
- Do not use `execute.py` to run agents, hooks, command blocks, verification blocks, git commands, or permission bypasses.
- Do not manually mark a step complete before external work and verification are actually done.
- Do not mark a development-related step complete before its commit is created or explicitly reported as unnecessary because there were no changes.
- Do not stage every changed path indiscriminately when unrelated user changes are present.
- Do not run destructive commands without explicit approval.
- Keep work inside the current phase's instructions and out-of-scope boundaries.
