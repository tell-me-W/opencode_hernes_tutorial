---
id: 10-plan
name: Plan Tests First
status: pending
requires:
  - 00-bootstrap
---

# Goal

Plan a small test-first implementation for the requested behavior.

# Inputs

- User request
- `AGENTS.md`
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/ADR.md`

# Instructions

Identify the smallest behavior slice, the failing tests to write first, the files likely to change, and the verification commands from `docs/ARCHITECTURE.md`.

# Out of Scope

- Do not write tests yet.
- Do not implement behavior.
- Do not broaden the requested behavior.

# Done Criteria

- Test cases are listed before implementation tasks.
- Implementation scope and out-of-scope boundaries are explicit.
- Verification commands or manual checks are explicit.

# Verification

Manual verification: user approves this phase design before `run-phase` is used.
