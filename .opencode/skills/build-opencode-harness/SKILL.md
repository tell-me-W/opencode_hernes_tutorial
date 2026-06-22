---
name: build-opencode-harness
description: Use when setting up an OpenCode project harness, manifest-driven phase/step execution workflow, docs-first project brain, AGENTS.md project constitution, make-phase and run-phase project-local skills, execute.py runner, retry/git lifecycle options, or safety hooks for TDD, dangerous commands, and repeated failures.
---

# Build OpenCode Harness

## Overview

Install a docs-first, phase-based OpenCode harness into the target project. The harness creates four layers:

1. `docs/` as the project brain.
2. `AGENTS.md` as the project constitution.
3. `.opencode/skills/` project-local skills plus `scripts/execute.py` as the manifest-driven execution engine.
4. `scripts/hooks/` as automated safety checks.

Use the bundled template under `assets/harness-template/`.

## Install Workflow

1. Inspect the target project root and preserve existing files.
2. Copy missing template files from `assets/harness-template/` into the project.
3. If a target file already exists, merge instead of overwriting:
   - Add missing sections to `AGENTS.md`.
   - Add missing docs files under `docs/`.
   - Keep existing project-specific content.
   - Ask before replacing scripts or phase files.
4. Make scripts executable where the platform supports it.
5. Run syntax checks:
   - `python scripts/execute.py --help`
   - `python -m py_compile scripts/execute.py scripts/hooks/*.py`
   - Windows: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/hooks/check.ps1`
   - `python -m pytest scripts/test_execute.py -q` if pytest is available
6. Report installed files, preserved files, and any manual follow-up.

## Required Output Tree

```text
project/
+-- AGENTS.md
+-- docs/
|   +-- PRD.md
|   +-- ARCHITECTURE.md
|   +-- ADR.md
|   +-- UI_GUIDE.md
+-- .opencode/
|   +-- skills/
|       +-- make-phase/
|       |   +-- SKILL.md
|       |   +-- assets/
|       |       +-- templates/
|       |           +-- tdd/
|       |           +-- refactoring/
|       +-- run-phase/
|           +-- SKILL.md
+-- scripts/
|   +-- execute.py
|   +-- test_execute.py
|   +-- hooks/
|       +-- Harness.Common.ps1
|       +-- check.ps1
|       +-- pre_phase.ps1
|       +-- validate_phase.ps1
|       +-- post_phase.ps1
|       +-- tdd_guard.ps1
|       +-- dangerous_cmd_guard.ps1
|       +-- circuit_breaker.ps1
|       +-- pre_phase.py
|       +-- validate_phase.py
|       +-- post_phase.py
|       +-- tdd_guard.py
|       +-- dangerous_cmd_guard.py
|       +-- circuit_breaker.py
|   +-- success/
|       +-- ant_build.ps1
+-- phases/
    +-- _template/
        +-- index.json
        +-- 00-bootstrap.md
        +-- 10-plan.md
        +-- 20-implement.md
        +-- 30-verify.md
        +-- state.json
```

Use `.opencode/skills/<skill-name>/SKILL.md` for project-local skills. Do not create a singular `.opencode/skill/` directory or a `commands/` directory.

## Harness Rules

- Read all docs before designing phases.
- Design phases with the user.
- Do not execute until the user approves the phase design.
- During execution, approved `agent` steps are orchestrated through `opencode run` inside the approved phase scope.
- Return to the user with completed steps, verification results, blocked state, and remaining risks after execution.
- Stop only for hook blocks, impossible done criteria, conflicting docs, `CRITICAL` rule conflicts, credentials, or destructive approval.

## Docs Contract

Treat `docs/` as the project brain:

- `PRD.md`: what to build, MVP scope, MVP exclusions, success criteria.
- `ARCHITECTURE.md`: how to build, module boundaries, data flow, build/test commands.
- `ADR.md`: why decisions were made, alternatives, tradeoffs, rollback conditions.
- `UI_GUIDE.md`: visual and interaction rules when the project has UI.

Do not let the agent expand scope beyond `PRD.md` or ignore tradeoffs in `ADR.md`.

## Execution Contract

Use `phases/{task-name}/index.json` as the step manifest when it exists. Each
step entry should include:

- `id`: stable step id, matching the phase file stem when possible.
- `file`: markdown phase file path relative to the task directory.
- `type`: `agent`, `command`, or `verify`.
- `requires`: prerequisite step ids.
- `success_hooks`: named success conditions under `scripts/success/`.
- `commit_after`: true for development-related steps that must be committed before the step is marked complete.

`scripts/execute.py` preserves compatibility with older task directories by
falling back to sorted `*.md` phase files when `index.json` is absent.

On Windows, `scripts/execute.py` runs `scripts/hooks/<name>.ps1` before the
legacy Python hook when the PowerShell hook exists. Keep the `.py` hooks as
portable fallbacks for non-Windows environments.

Keep lifecycle safety checks under `scripts/hooks/`. Put explicit phase success
conditions under `scripts/success/` and reference them from `success_hooks`.
For Ant projects, add `"success_hooks": ["ant_build"]` to the steps that must
prove the Ant build before they can complete. `ant_build.ps1` requires
`build.xml`, runs `ant` by default, and runs `$env:HARNESS_ANT_TARGET` when that
environment variable is set. If Ant fails, the step remains failed so the agent
can repair the build before continuing.

Step behavior:

- `agent`: validate the approved phase, build a bounded prompt from the phase file and project docs, then call `opencode run <prompt> --format json --dir <project-root>`. Output is written to `phases/{task}/agent-output/{step-id}.jsonl`, and `state.json` records status, attempts, output file, exit code, commit, and failures. Use `--agent-runner none` only when you intentionally want the old external-execution block.
- `command`: run shell command blocks from the phase file.
- `verify`: run verification command blocks from the phase file.

Useful commands:

```bash
python scripts/execute.py phases/my-task status
python scripts/execute.py phases/my-task approve
python scripts/execute.py phases/my-task run --max-retries 3
python scripts/execute.py phases/my-task run --git-commits
python scripts/execute.py phases/my-task run --agent-runner none
python scripts/execute.py phases/my-task run --branch-prefix harness
```

Example Ant-gated step:

```json
{
  "id": "20-implement",
  "file": "20-implement.md",
  "type": "command",
  "requires": ["10-plan"],
  "success_hooks": ["ant_build"]
}
```

Use `--git-commits` only in a git repository with user name/email configured and a clean worktree before execution starts. Agent steps with `"commit_after": true` block before calling OpenCode unless `--git-commits` is present. `--dangerously-skip-permissions` is available for OpenCode only when the user explicitly approves that risk.
Use `--branch-prefix` when each task should run on its own branch.

## Phase Contract

Each phase file must include:

- goal
- inputs
- instructions
- done criteria
- verification commands or explicit reason verification is manual

Create phase files under `phases/{task-name}/`, not directly under `phases/`, except for `_template`.

## Common Mistakes

- Do not overwrite an existing project brain without preserving local content.
- Do not start execution before phase approval.
- Do not run unapproved phase designs; automatic orchestration only applies after `approved_by_user` is true.
- Do not pass `--dangerously-skip-permissions` unless the user explicitly approved it.
- Do not bypass hooks when they block progress.
- Do not create Claude-specific `commands/` files; OpenCode project-local skills belong under `.opencode/skills/<skill-name>/SKILL.md`.
