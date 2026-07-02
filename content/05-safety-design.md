# Layer 4: Hooks - 자동 검증 장치

## 1. Layer 4의 역할

네 번째 레이어는 `scripts/hooks/`입니다. Hook은 agent를 방해하는 장치가 아니라, 팀이 합의한 작업 흐름을 자동으로 확인하는 장치입니다.

OpenCode 자체 권한 정책이 도구 실행을 제어한다면, Harness hook은 phase 실행 전후의 프로젝트 규칙을 검사합니다.

## 2. Hook 전체 구조

주요 hook은 다음과 같습니다.

| Hook | 역할 |
| --- | --- |
| `pre_phase` | phase 파일 존재 등 시작 조건 확인 |
| `validate_phase` | phase heading과 완료 기준 검증 |
| `dangerous_cmd_guard` | 위험 command block 차단 |
| `tdd_guard` | 구현 변경에 대응하는 테스트 변경 확인 |
| `post_phase` | phase 실행 후 상태 정리 |
| `circuit_breaker` | 같은 실패가 반복될 때 중단 |

Windows에서는 같은 이름의 PowerShell hook이 있으면 `.ps1`을 먼저 실행하고, Python hook은 portable fallback으로 유지합니다.

## 3. OpenCode permission과 Harness hook

OpenCode permission은 `opencode.json`에서 도구 실행 승인을 다룹니다. 예를 들어 `rm *`나 `git reset --hard *`를 `ask` 또는 `deny`로 둘 수 있습니다.

Harness hook은 그 위에서 phase 파일과 command block을 다시 검사합니다. 둘은 경쟁 관계가 아니라 서로 다른 레이어입니다.

| 구분 | OpenCode permission | `scripts/hooks` |
| --- | --- | --- |
| 위치 | OpenCode 실행 정책 | 프로젝트 Harness 정책 |
| 목적 | 도구 호출 승인 | phase 안전성 검증 |
| 예시 | bash 명령 ask/deny | TDD guard, dangerous command guard |

## 4. 위험 명령과 반복 실패

`dangerous_cmd_guard`는 삭제, 강제 push, hard reset, database destructive command 같은 위험 명령을 차단합니다.

위험 명령이 정말 필요하면 명령의 이유, 영향 범위, rollback 방법을 설명하고 사용자 승인을 받아야 합니다.

`circuit_breaker`는 같은 실패가 반복될 때 전략 변경 없이 계속 재시도하는 것을 막습니다. 실패가 반복되면 phase 범위, done criteria, 문서 충돌, 검증 명령을 다시 확인합니다.

## 5. TDD Guard

TDD Guard는 behavior 변경에 테스트가 따라오는지 확인합니다.

좋은 적용 대상:

- 새 도메인 로직
- 버그 수정
- validation 변경
- persistence 변경
- 외부 동작을 유지해야 하는 리팩토링

UI copy 수정처럼 자동 테스트보다 수동 검증이 적절한 작업은 phase의 `Verification`에 정확한 수동 확인 절차를 적습니다.
