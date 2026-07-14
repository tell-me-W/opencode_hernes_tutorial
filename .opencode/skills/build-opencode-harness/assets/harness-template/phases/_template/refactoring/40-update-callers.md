---
id: 40-update-callers
name: Update Callers
status: pending
requires:
  - 30-refactor
---

# Goal

Update callers to use the new boundary without changing behavior.

# Inputs

- Refactored internal code
- Approved boundary plan
- Relevant callers
- Characterization tests

# Instructions

Update imports, adapters, call sites, or wiring to use the refactored boundary. Preserve existing behavior and keep compatibility shims only when the plan calls for them.

# Out of Scope

- Do not add new features.
- Do not change UI or API behavior unless explicitly approved.
- Do not leave duplicate paths unless the phase plan requires temporary compatibility.

# Done Criteria

- Callers use the new boundary.
- Old direct coupling is removed or documented as intentionally retained.
- Characterization and relevant caller tests pass.
- A `refactor:` commit is created if files changed.

# Verification

Run caller-level tests and characterization tests.

# Commit

Before marking this phase complete, commit only phase-owned changed files and record the short commit hash in `state.json`.
