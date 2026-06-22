---
name: make-phase
description: Use inside an OpenCode harness project when converting a user request, feature idea, bug report, or refactor request into a small approved phase directory under phases/{task-name}/ with index.json, phase files, done criteria, out-of-scope boundaries, and verification steps. This skill designs phases only; it must not execute implementation work.
---

# Make Phase

Create a small, verifiable phase plan for an installed OpenCode harness project.

## Workflow

1. Confirm the project root contains `AGENTS.md`, `docs/`, `.opencode/skills/`, `scripts/execute.py`, and `phases/`.
2. Read `AGENTS.md`, then `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/ADR.md`, and `docs/UI_GUIDE.md` when UI exists.
3. Turn the user request into one task directory: `phases/{task-name}/`.
4. Create or update `index.json`, phase files, and `state.json`.
5. Stop after the phase design is written. Do not implement, run tests, approve, or execute the phase.
6. Summarize the phase plan and ask the user to approve before `/run-phase` is used.

## Task Naming

Create `{task-name}` from the user request:

- Use lowercase letters, digits, and hyphens only.
- Prefer a short verb-noun phrase such as `add-todo-filter`, `fix-login-refresh`, or `extract-todo-domain`.
- Keep it under 48 characters when practical.
- If the name would collide with an existing `phases/{task-name}/`, append a short suffix such as `-v2` or ask before revising the existing phase.

## Phase Shape

Every phase file must include:

- `Goal`
- `Inputs`
- `Instructions`
- `Out of Scope`
- `Done Criteria`
- `Verification`

If verification is manual, write the exact manual checks.

## Template Selection

Use templates from `assets/templates/`:

- `assets/templates/tdd/`: default for new behavior, bug fixes, feature changes, validation changes, persistence changes, UI behavior, and any request where behavior may change.
- `assets/templates/refactoring/`: use for refactors, module extraction, architecture cleanup, dependency swaps, caller updates, and structure changes where external behavior should stay the same.

If the request is ambiguous, choose `tdd` when behavior changes are possible. Choose `refactoring` only when the user intent is clearly to preserve external behavior while changing structure.

Copy the selected template into `phases/{task-name}/`, then replace placeholders and adjust step names only as needed. Preserve the selected template's test-first or characterization-first ordering.

Use `agent` for work that OpenCode should perform through `opencode run` after approval, `command` for deterministic shell command blocks, and `verify` for verification command blocks.

Set `"commit_after": true` on every development-related step that can change code, tests, configuration, scripts, migrations, or project docs. Leave it false or omit it for planning, bootstrap, and pure verification steps.

## Template Editing

After copying a template:

- Replace `{task-name}` in `state.json` with the actual task name.
- Replace generic goals with the user's concrete request.
- Replace generic inputs with the real docs, source areas, commands, and constraints.
- Keep `commit_after` on development-related steps.
- Keep planning/bootstrap/verify steps free of `commit_after` unless they are expected to change files.
- Remove any phase file that is clearly unnecessary only when its responsibility is covered by another phase.

## Output Summary

When the phase design is ready, report:

- Selected template: `tdd` or `refactoring`.
- Created or updated task directory.
- Step list with `id`, `type`, and `commit_after` where true.
- Out-of-scope boundaries.
- Verification commands or manual checks.
- Any docs gaps or assumptions.
- Explicit note that nothing has been executed or approved yet.

## Initial State

Create `state.json` with:

```json
{
  "task": "{task-name}",
  "mode": "opencode-orchestrated",
  "approved_by_user": false,
  "current_phase": null,
  "completed": [],
  "blocked": null,
  "failures": [],
  "baseline_status": {},
  "commits": {},
  "steps": {}
}
```

## Rules

- Do not place phase files directly under `phases/`; always use `phases/{task-name}/`.
- Do not expand scope beyond `docs/PRD.md`.
- Preserve existing phase files unless the user asked to revise that phase.
- Ask the user when docs are missing, contradictory, or too vague to define done criteria.
- Do not create a `review` phase unless the user explicitly asks for a separate review step.
