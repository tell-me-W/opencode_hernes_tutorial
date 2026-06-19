# Project: PROJECT_NAME

This file is the first context the agent must read before making changes.
Treat `CRITICAL` rules as hard constraints. Do not violate them unless the user explicitly changes the rule.

## Tech Stack

- Framework: TBD
- Language: TBD
- Main libraries: TBD
- Runtime/build: TBD

## Architecture Rules

- CRITICAL: API keys and secrets must be read from environment variables only.
- CRITICAL: Never hardcode secrets, tokens, passwords, API keys, or private endpoints.
- CRITICAL: Do not introduce new architecture patterns without updating `docs/ARCHITECTURE.md`.
- CRITICAL: If a design decision changes, update `docs/ADR.md`.

## Development Process

- CRITICAL: Write tests before implementing new behavior. Follow TDD.
- CRITICAL: Do not expand scope beyond `docs/PRD.md`.
- CRITICAL: Respect MVP exclusions in `docs/PRD.md`.
- CRITICAL: Respect tradeoffs recorded in `docs/ADR.md`.
- CRITICAL: After every development-related phase that changes files, create a git commit before marking the phase complete.
- Commit messages must follow Conventional Commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, or `chore:`.

## Verification Rules

- Verify correctness before declaring phase work complete.
- Prioritize bugs, regressions, security risks, data loss, API contract breaks, and deployment risks.
- Do not spend verification budget on style preferences unless they hide a real defect.
- Record verification commands, manual checks, failures, and remaining risks in the phase summary.

## Required Reading Order

Before starting any phase:

1. Read `AGENTS.md`.
2. Read `docs/PRD.md`.
3. Read `docs/ARCHITECTURE.md`.
4. Read `docs/ADR.md`.
5. Read `docs/UI_GUIDE.md` if it exists.
6. Read the current phase file under `phases/`.

## Hook Safety Rules

- CRITICAL: Do not bypass `scripts/hooks/tdd_guard.py`.
- CRITICAL: Do not bypass `scripts/hooks/dangerous_cmd_guard.py`.
- CRITICAL: If `scripts/hooks/circuit_breaker.py` stops execution, change strategy before retrying.
- CRITICAL: If a hook blocks work, report the reason and ask the user before continuing.

## CRITICAL Keyword Semantics

When a rule starts with `CRITICAL`:

- Treat it as stronger than normal guidance.
- Stop before violating it.
- Ask the user if the task appears to require violating it.
- Mention the rule in the final answer if it affected implementation.

## TDD Rule

For new behavior:

1. Write or update a failing test first.
2. Run the test and confirm it fails for the expected reason.
3. Implement the smallest change that passes the test.
4. Run the relevant tests again.
5. Refactor only after tests pass.

If tests cannot be written or run, explain why before implementation and record the risk in the final answer.
