# PART 5: 안전장치 설계

## 1. 권한과 승인 모델

Harness에서 중요한 승인 지점은 phase 실행 전입니다. Agent가 먼저 phase를 설계하고, 사용자가 범위와 done criteria를 확인한 뒤 실행을 승인합니다.

멈춰야 하는 상황:

- hook block
- 불가능한 done criteria
- 충돌하는 문서
- `CRITICAL` 규칙 충돌
- credentials 요청
- destructive approval 필요

이 경우 agent는 임의로 우회하지 않고 사용자에게 돌아옵니다.

## 2. Safety Hooks 전체 구조

`scripts/hooks/`는 Harness 실행 흐름 안에서 자동 안전 검사를 수행합니다.

주요 hook:

- `pre_phase.py`: phase 시작 전 조건 확인
- `validate_phase.py`: phase 형식과 완료 조건 검증
- `post_phase.py`: phase 실행 후 상태 정리
- `tdd_guard.py`: 테스트 없는 behavior 변경 감지
- `dangerous_cmd_guard.py`: 위험 명령 감지
- `circuit_breaker.py`: 반복 실패 차단

Hook은 agent를 방해하는 장치가 아니라, 팀이 합의한 작업 흐름을 자동으로 확인하는 장치입니다. 
다만 hook이 너무 많거나 프로젝트 상황과 맞지 않으면 진행을 불필요하게 막을 수 있습니다. 
처음에는 꼭 필요한 hook만 켜고, 반복해서 막히는 조건은 팀 규칙과 실제 위험도에 맞게 `scripts/execute.py`을 튜닝해야 합니다.

## 3. Plugin Hook과 `scripts/hooks`의 역할 분리

OpenCode plugin은 OpenCode 이벤트에 붙어 동작을 확장하는 JS/TS 코드입니다. 예를 들어 파일 수정 후 자동 검사, 특정 파일 접근 제한, custom tool 추가 같은 일을 할 수 있습니다.

반면 `scripts/hooks`는 Harness 내부 실행 흐름에서 phase 안전성을 검사하는 프로젝트 스크립트입니다.

정리하면 다음과 같습니다.

| 구분 | OpenCode plugin | `scripts/hooks` |
| --- | --- | --- |
| 위치 | OpenCode 확장 레이어 | 프로젝트 Harness 레이어 |
| 성격 | 이벤트 기반 JS/TS 확장 | phase 실행 검증 스크립트 |
| 목적 | OpenCode 동작 변경 | Harness 규칙 확인 |
| 예시 | 파일 수정 후 자동 검사 | 위험 명령 차단, TDD guard |

## 4. 위험 명령 차단

OpenCode 자체 승인 정책은 `opencode.json`의 `permission`에서 설정할 수 있습니다. 예를 들어 `bash` 권한에 `rm *`이나 `git reset --hard *` 같은 패턴을 `ask` 또는 `deny`로 둘 수 있습니다.

그 위에 Harness는 `scripts/hooks/dangerous_cmd_guard.py`로 phase 실행 전 command를 한 번 더 검사합니다. 즉 `permission`은 OpenCode 도구 실행 승인 정책이고, `dangerous_cmd_guard.py`는 Harness runner 안에서 동작하는 추가 안전 검사입니다.

주의할 명령과 패턴:

- 삭제 명령
- reset류 명령
- credential 노출 가능 명령
- 파이프와 리다이렉션이 섞인 명령
- 의도하지 않은 파일 이동 또는 덮어쓰기

위험 명령이 꼭 필요하다면 명령의 필요성, 영향 범위, rollback 방법을 설명하고 사용자 승인을 받아야 합니다.

## 5. TDD Guard

TDD Guard는 필요시 적용합니다. 모든 작업에 무조건 강제하기보다, 새 behavior를 추가하거나 회귀 위험이 큰 작업에서 쓰는 것이 좋습니다.

좋은 적용 대상:

- 신규 도메인 로직
- 버그 수정
- validation 로직
- 데이터 변환 로직
- 외부 동작을 유지해야 하는 리팩터링

UI copy 수정처럼 테스트보다 수동 확인이 더 적절한 작업은 verification에 명시적으로 수동 검증 이유를 남깁니다.

## 6. 문제 상황 대응

문제가 발생했을 때 같은 명령을 반복하는 것은 좋은 대응이 아닙니다. Harness는 반복 실패를 막고 전략을 바꾸도록 설계되어 있습니다.

대응 순서:

1. 실패 메시지를 기록합니다.
2. 어떤 hook 또는 검증에서 막혔는지 확인합니다.
3. phase의 done criteria가 현실적인지 봅니다.
4. 문서 충돌이나 누락된 요구사항을 확인합니다.
5. 필요한 경우 phase를 수정하고 다시 승인받습니다.

Hook을 끄는 것은 마지막 선택입니다. 그 경우에도 강한 근거와 ADR 업데이트가 필요합니다.
