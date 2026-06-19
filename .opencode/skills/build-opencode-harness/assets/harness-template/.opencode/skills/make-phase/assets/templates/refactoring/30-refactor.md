---
id: 30-refactor
name: Refactor Internals
status: pending
requires:
  - 20-plan-boundary
---

# Goal

Move or reshape internal code while preserving external behavior.

# Inputs

- Approved boundary plan
- Characterization tests
- `AGENTS.md`
- `docs/ARCHITECTURE.md`
- `docs/ADR.md`

# Instructions

Perform the smallest internal restructuring that matches the approved boundary. Keep public behavior stable and run characterization tests after the change.

# Out of Scope

- Do not add new user-visible behavior.
- Do not change unrelated modules.
- Do not update callers beyond what this phase explicitly requires.

# Done Criteria

- Internal structure matches the approved boundary.
- Characterization tests still pass.
- No hook blocks remain unresolved.
- A `refactor:` commit is created if files changed.

# Verification

Run the characterization command and any narrow architecture checks from `docs/ARCHITECTURE.md`.
