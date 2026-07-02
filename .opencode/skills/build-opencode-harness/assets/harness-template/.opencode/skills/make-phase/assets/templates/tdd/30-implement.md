---
id: 30-implement
name: Implement Behavior
status: pending
requires:
  - 20-test
---

# Goal

Implement the smallest change that satisfies the failing tests.

# Inputs

- Approved phase design
- Failing tests from `20-test`
- `AGENTS.md`
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/ADR.md`

# Instructions

Make the minimal production change needed to pass the new tests. Keep the work inside the approved scope and preserve existing behavior unless the phase explicitly changes it.

# Out of Scope

- Do not add unrelated features.
- Do not refactor unrelated code.
- Do not update docs unless the implementation reveals a real project-brain change.

# Done Criteria

- The new tests pass.
- Relevant existing tests still pass.
- No hook blocks remain unresolved.
- A `feat:` or `fix:` commit is created if files changed.

# Verification

Run the narrow test command again, then run any broader command required by `docs/ARCHITECTURE.md`.

# Commit

Before marking this phase complete, commit only phase-owned changed files and record the short commit hash in `state.json`.
