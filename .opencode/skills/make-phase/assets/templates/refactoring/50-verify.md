---
id: 50-verify
name: Verify
status: pending
requires:
  - 40-update-callers
---

# Goal

Run final verification and summarize refactoring risk.

# Inputs

- Build commands from `docs/ARCHITECTURE.md`
- Test commands from `docs/ARCHITECTURE.md`
- Current task phase files
- Current `state.json`

# Instructions

Run the agreed verification commands. Confirm that external behavior is unchanged and that the target structure matches the approved boundary.

# Out of Scope

- Do not add feature behavior.
- Do not revise the approved refactoring goal.

# Done Criteria

- Characterization tests pass.
- Relevant build/test checks pass, or failures are clearly reported.
- Final summary includes changed files, verification, behavior-preservation evidence, and remaining risks.

# Verification

Use the final verification command set from `docs/ARCHITECTURE.md`.
