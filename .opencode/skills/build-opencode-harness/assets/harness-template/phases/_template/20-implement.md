---
id: 20-implement
name: Implement
status: pending
requires:
  - 10-plan
---

# Goal

Implement the approved scope.

# Inputs

- Approved phase design
- `AGENTS.md`
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/ADR.md`

# Instructions

Work alone inside the approved scope. Follow TDD for new behavior. Do not expand MVP scope.

# Done Criteria

- Implementation is complete.
- Tests are added or updated for new behavior.
- No hook blocks remain unresolved.

# Verification

```bash
python scripts/hooks/tdd_guard.py
```
