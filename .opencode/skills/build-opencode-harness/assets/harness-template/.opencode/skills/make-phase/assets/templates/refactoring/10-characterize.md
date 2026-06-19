---
id: 10-characterize
name: Characterize Behavior
status: pending
requires:
  - 00-bootstrap
---

# Goal

Protect existing behavior before changing structure.

# Inputs

- Existing source files
- Existing tests
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`

# Instructions

Find or add characterization tests for behavior that must not change. Prefer narrow automated tests. If automated tests are not possible, write exact manual checks.

# Out of Scope

- Do not refactor production code.
- Do not change public behavior.
- Do not remove existing tests.

# Done Criteria

- Preserved behavior is covered by existing or new tests, or exact manual checks are documented.
- The characterization command or manual check is recorded.
- Any current failing behavior is separated from refactor risk.
- A `test:` commit is created if files changed.

# Verification

Run the characterization test command or document the exact manual check.
