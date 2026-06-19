---
id: 40-verify
name: Verify
status: pending
requires:
  - 30-implement
---

# Goal

Run final verification and summarize results for the behavior change.

# Inputs

- Build commands from `docs/ARCHITECTURE.md`
- Test commands from `docs/ARCHITECTURE.md`
- Current task phase files
- Current `state.json`

# Instructions

Run the agreed verification commands. If a command cannot run, explain why and record the risk.

# Out of Scope

- Do not add new behavior.
- Do not revise approved phase scope.

# Done Criteria

- Relevant build/test checks pass, or failures are clearly reported.
- Final summary includes changed files, verification, and remaining risks.

# Verification

Use the final verification command set from `docs/ARCHITECTURE.md`.
