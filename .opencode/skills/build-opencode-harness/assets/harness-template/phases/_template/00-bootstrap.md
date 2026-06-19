---
id: 00-bootstrap
name: Bootstrap
status: pending
---

# Goal

Confirm the project brain is present and usable.

# Inputs

- `AGENTS.md`
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/ADR.md`
- `docs/UI_GUIDE.md` if UI exists

# Instructions

Read all docs. If required docs are missing, empty, contradictory, or lack MVP exclusions and tradeoffs, stop and ask the user to clarify before implementation.

# Done Criteria

- Required docs exist.
- MVP exclusions are explicit in `docs/PRD.md`.
- Tradeoffs are explicit in `docs/ADR.md`.
- No `CRITICAL` rule conflict is unresolved.

# Verification

```bash
python scripts/execute.py phases/_template status
```
