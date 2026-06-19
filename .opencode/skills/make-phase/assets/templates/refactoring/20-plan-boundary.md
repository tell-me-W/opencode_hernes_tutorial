---
id: 20-plan-boundary
name: Plan Boundary
status: pending
requires:
  - 10-characterize
---

# Goal

Define the target module, API, or architecture boundary before moving code.

# Inputs

- Characterization results
- `docs/ARCHITECTURE.md`
- `docs/ADR.md`
- Relevant source files

# Instructions

Describe the target boundary, public API or caller contract, files likely to move or change, and compatibility constraints.

# Out of Scope

- Do not move code yet.
- Do not change callers yet.
- Do not introduce new behavior.

# Done Criteria

- Target boundary is clear.
- Public API or caller contract is explicit.
- Migration steps are small and ordered.
- Verification commands are explicit.

# Verification

Manual verification: user approves the boundary plan before implementation continues.
