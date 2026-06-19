---
id: 30-verify
name: Verify
status: pending
requires:
  - 20-implement
---

# Goal

Run final verification and summarize results.

# Inputs

- Build commands from `docs/ARCHITECTURE.md`
- Test commands from `docs/ARCHITECTURE.md`
- Current task phase files
- Current `state.json`

# Instructions

Run the agreed verification commands. If a command cannot run, explain why and record the risk.

# Out of Scope

- Do not add new feature scope.
- Do not rewrite earlier phase goals.

# Done Criteria

- Relevant build/test checks pass, or failures are clearly reported.
- Final summary includes changed files, verification, and remaining risks.

# Verification

```bash
python scripts/execute.py phases/_template status
```
