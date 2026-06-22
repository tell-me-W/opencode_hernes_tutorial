# Layer 2: `AGENTS.md` - 프로젝트의 헌법

## 1. Layer 2의 역할

두 번째 레이어는 `AGENTS.md`입니다. 이 파일은 OpenCode agent가 가장 먼저 읽는 프로젝트 작업 규칙입니다.

`docs/`가 프로젝트의 뇌라면, `AGENTS.md`는 프로젝트의 헌법입니다. 팀이 반드시 지켜야 하는 규칙, 멈춰야 하는 조건, 문서 읽기 순서, 검증 기준을 여기에 둡니다.

## 2. CRITICAL 규칙

`CRITICAL`로 시작하는 규칙은 일반 가이드보다 강합니다. Agent는 이 규칙과 충돌하면 임의로 우회하지 않고 멈춰야 합니다.

예시:

```md
- CRITICAL: Do not expand scope beyond docs/PRD.md.
- CRITICAL: If architecture changes, update docs/ADR.md.
- CRITICAL: Do not bypass scripts/hooks.
- CRITICAL: Never hardcode secrets, tokens, passwords, or private endpoints.
```

CRITICAL 규칙은 적을수록 좋습니다. 정말 멈춰야 하는 기준만 넣어야 agent가 무엇을 강하게 지켜야 하는지 명확하게 이해합니다.

## 3. 개발 프로세스 규칙

`AGENTS.md`에는 작업 방식도 들어갑니다. 이 하네스에서는 phase 기반 실행과 TDD, 검증 기록이 핵심입니다.

포함하면 좋은 내용:

- 새 behavior는 테스트를 먼저 작성한다.
- phase 범위를 벗어나지 않는다.
- 개발 관련 step은 완료 전에 commit한다.
- 검증 명령과 실패 내용을 기록한다.
- credential, destructive approval, 문서 충돌이 있으면 멈춘다.

이 규칙은 `make-phase`가 phase를 만들 때도, `run-phase`가 승인된 phase를 실행할 때도 기준이 됩니다.

## 4. OpenCode 기준 용어

Claude Code 기준 문서를 OpenCode로 옮길 때는 용어를 바꿔야 합니다.

| Claude 기준 | OpenCode 기준 |
| --- | --- |
| `CLAUDE.md` | `AGENTS.md` |
| `.claude/commands/` | `.opencode/skills/` |
| `claude -p` | `opencode run` |
| `.claude/settings.json` hooks | `scripts/hooks/*` + `execute.py` lifecycle hooks |

Phase 생성 기능은 `/make-phase`, phase 실행 기능은 `/run-phase`로 설명합니다.
