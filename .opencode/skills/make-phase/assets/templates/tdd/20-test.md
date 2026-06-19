---
id: 20-test
name: Write Failing Tests
status: pending
requires:
  - 10-plan
---

# Goal

Write tests that fail for the expected reason before implementation.

# Inputs

- Approved phase design
- `AGENTS.md`
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- Relevant source and test files

# Instructions

Add or update tests for the requested behavior. Run the narrowest relevant test command and confirm the new test fails for the expected reason.

# Out of Scope

- Do not implement the production fix in this phase.
- Do not change unrelated tests.
- Do not weaken existing assertions.

# Done Criteria

- New or updated tests express the requested behavior.
- The relevant test command was run.
- The test failure is recorded and matches the missing behavior.
- A `test:` commit is created if files changed.

# Verification

Use the narrow test command from `docs/ARCHITECTURE.md`, or record the exact manual reason if no automated test can be run.

# Commit

Before marking this phase complete, commit only phase-owned changed files and record the short commit hash in `state.json`.
