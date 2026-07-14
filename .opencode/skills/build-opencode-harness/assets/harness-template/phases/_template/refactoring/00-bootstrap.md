---
id: 00-bootstrap
name: Bootstrap
status: pending
---

# Goal

Confirm the project brain supports this refactoring and that external behavior must remain stable.

# Inputs

- `AGENTS.md`
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/ADR.md`
- `docs/UI_GUIDE.md` if UI exists

# Instructions

Read all docs. Identify the current behavior to preserve, architecture boundaries involved, relevant ADR tradeoffs, and any `CRITICAL` rules that constrain the refactor.

# Out of Scope

- Do not change behavior.
- Do not implement the refactor.
- Do not approve or run the phase.

# Done Criteria

- Existing behavior to preserve is explicit.
- Refactor goal and excluded behavior changes are explicit.
- Architecture and ADR constraints are understood.
- No unresolved `CRITICAL` rule conflict remains.

# Verification

Manual verification: summarize preserved behavior, refactor scope, and constraints.
