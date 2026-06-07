# PART 4: Phase 기반 개발

## 1. 기능을 Phase로 쪼개는 방법

Phase는 agent에게 주는 작은 작업 계약입니다. 하나의 phase는 너무 많은 일을 담지 않아야 하고, 완료 여부를 검증할 수 있어야 합니다.

좋은 phase는 다음 질문에 답합니다.

- 무엇을 하려는가?
- 어떤 문서를 입력으로 삼는가?
- 어떤 범위는 제외하는가?
- 완료 기준은 무엇인가?
- 어떤 명령이나 절차로 검증하는가?

## 2. Phase 파일 구조와 상태 관리

각 phase 파일에는 다음 항목이 들어가야 합니다.

- `goal`
- `inputs`
- `instructions`
- `done criteria`
- `verification`

작업 phase는 `phases/` 바로 아래에 흩어두지 않습니다. 실제 작업은 `phases/{task-name}/` 아래에 둡니다.

예시:

```text
phases/todo-list/
  00-bootstrap.md
  10-plan.md
  20-implement.md
  30-review.md
  40-verify.md
  state.json
```

`state.json`은 현재 phase, 완료된 phase, blocked 상태, 실패 정보를 관리하는 데 사용합니다.

## 3. Phase 실행 컨텍스트 준비

Phase를 실행하기 전에 컨텍스트를 정리합니다.

- 현재 Phase 목표 확인
- 작업 범위와 제외 범위 정리
- 완료 기준 작성
- 참조 문서 연결
- 검증 방법 정리

예시:

````md
# Goal
Add domain behavior for creating and completing TODO items.

# Inputs
- AGENTS.md
- docs/PRD.md
- docs/ARCHITECTURE.md

# Instructions
Write domain tests before implementation.
Do not change UI files in this phase.

# Done Criteria
- Tests cover add, complete, and reject-empty behavior.
- Domain tests pass.
- No UI files are changed.

# Verification
`npm test -- todo-domain`

```

## 4. `scripts/execute.py` Runner 개요

`/harness` skill은 phase 실행을 감으로 처리하지 않고, 프로젝트에 설치된 `scripts/execute.py` runner를 기준으로 phase 상태를 관리합니다.

`execute.py`의 역할은 다음과 같습니다.

- `phases/{task-name}/state.json`을 읽고 현재 상태를 확인합니다.
- 승인되지 않은 phase는 실행하지 않습니다.
- 다음에 실행할 phase 파일을 순서대로 선택합니다.
- phase 파일의 verification command block을 실행합니다.
- 실행 전후로 `scripts/hooks/`의 safety hook을 호출합니다.
- 실패하면 `state.json`에 blocked/failures 정보를 남깁니다.

기본 명령은 세 가지입니다.

```powershell
python scripts/execute.py phases/todo-items status
python scripts/execute.py phases/todo-items approve
python scripts/execute.py phases/todo-items run
```

- `status`: 현재 phase 상태 확인
- `approve`: 사용자가 phase 설계를 승인했다는 사실을 기록
- `run`: 승인된 phase loop 실행

일반 사용자는 이 명령을 직접 외울 필요는 없습니다. `/harness` skill이 대상 phase 디렉터리를 받아 이 runner 흐름을 안내하거나 실행합니다.

## 5. Skill 기반 Phase 실행

Harness rule의 핵심은 "승인 전 실행하지 않는다"입니다. Phase 설계는 사용자와 함께 만들고, 사용자가 done criteria를 이해한 뒤 승인해야 실행합니다.

실행 전 대화 예시:

```text
/harness  `phases/todo-items`
```

`/harness`는 phase 상태를 확인하고, 필요한 경우 `status`, `approve`, `run` 흐름을 순서대로 안내하거나 실행합니다.

승인 후 agent는 승인된 phase 범위 안에서 작업합니다. 
작업 중 safety hook에 막히거나, 완료 기준을 만족할 수 없거나, 문서끼리 충돌하거나, `CRITICAL` 규칙과 충돌하거나, credential 또는 destructive approval이 필요하면 임의로 우회하지 않고 사용자에게 돌아옵니다.

## 6. 검증 후 다음 Phase로 전환

Phase가 끝나면 다음을 확인합니다.

- done criteria를 만족했는가?
- verification command가 실제로 실행되었는가?
- 실패가 있었다면 `state.json`이나 phase 기록에 남겼는가?
- 다음 phase로 넘어가기 전에 문서 업데이트가 필요한가?

`scripts/execute.py`는 agent 작업을 대체하는 도구가 아닙니다. Phase loop, state, hooks, shell verification을 관리하는 runner입니다.
