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
  index.json
  00-bootstrap.md
  10-plan.md
  20-implement.md
  30-verify.md
  state.json
```

`index.json`은 실행할 step의 manifest입니다. 각 step은 phase 파일, step type, 선행 조건, 성공 hook, 개발 step의 commit 필요 여부를 선언합니다. `state.json`은 현재 step, 완료된 step, blocked 상태, 실패 정보, step별 commit 기록을 관리하는 데 사용합니다.

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

## 4. `make-phase`와 `scripts/execute.py` Runner 개요

`make-phase` skill은 사용자 요구사항과 프로젝트 문서를 읽어 `phases/{task-name}/` 아래에 phase 파일을 만듭니다. 이 skill은 실행하지 않고, goal, inputs, instructions, out-of-scope, done criteria, verification을 갖춘 phase 설계까지만 담당합니다.

`run-phase` skill은 phase 실행을 감으로 처리하지 않고, 프로젝트에 설치된 `scripts/execute.py` runner를 기준으로 phase 상태를 관리합니다.

`execute.py`의 역할은 다음과 같습니다.

- `phases/{task-name}/index.json`이 있으면 step manifest를 읽습니다.
- manifest가 없으면 기존 방식처럼 정렬된 `*.md` phase 파일을 사용합니다.
- `phases/{task-name}/state.json`을 읽고 현재 상태를 확인합니다.
- 승인되지 않은 phase는 실행하지 않습니다.
- `requires`가 충족된 다음 step을 선택합니다.
- `command` step은 phase 파일의 shell command block을 실행합니다.
- `verify` step은 phase 파일의 verification command block을 실행합니다.
- `agent` step은 phase를 검증한 뒤 외부 OpenCode/Codex agent 실행을 위해 멈춥니다.
- 실행 전후로 `scripts/hooks/`의 safety hook을 호출합니다.
- 실패하면 `state.json`에 blocked/failures 정보를 남깁니다.
- `success_hooks`가 있으면 `scripts/success/` 아래의 명명된 성공 조건을 실행합니다.

Step type은 책임이 다릅니다. `agent` step은 runner가 대신 수행하지 않습니다. Agent가 승인된 scope 안에서 phase 지시를 직접 수행하고, 개발 관련 변경은 phase-owned files만 commit한 뒤 `state.json`에 완료 상태와 commit 정보를 남깁니다. `command`와 `verify` step은 runner가 command block을 실행하고 hook, retry, 실패 기록을 관리합니다.

개발 관련 step은 `index.json`에 `"commit_after": true`를 둡니다. 코드, 테스트, 설정, 스크립트, migration, 프로젝트 문서를 바꾸는 step은 완료 처리 전에 commit을 만들거나, 변경이 없어 commit하지 않았다는 이유를 기록해야 합니다.

예를 들어 Ant 프로젝트에서는 빌드가 반드시 증명되어야 하는 step에 `"success_hooks": ["ant_build"]`를 추가합니다. 이 hook은 `scripts/success/ant_build.ps1`에서 `build.xml`을 확인하고 `ant` 또는 `$env:HARNESS_ANT_TARGET`을 실행합니다.

기본 명령은 세 가지입니다.

```powershell
python scripts/execute.py phases/todo-items status
python scripts/execute.py phases/todo-items approve
python scripts/execute.py phases/todo-items run
python scripts/execute.py phases/todo-items run --max-retries 3
python scripts/execute.py phases/todo-items run --git-commits
python scripts/execute.py phases/todo-items run --branch-prefix harness
```

- `status`: 현재 phase 상태 확인
- `approve`: 사용자가 phase 설계를 승인했다는 사실을 기록
- `run`: 승인된 phase loop 실행
- `--max-retries`: 실패한 step을 정해진 횟수만큼 재시도
- `--git-commits`: step 완료 후 git commit 생성
- `--branch-prefix`: task별 작업 branch prefix 지정

`--git-commits`는 편한 기본값이 아니라 제한적인 자동 commit 옵션입니다. git repository이고 사용자 이름과 이메일이 설정되어 있으며, 실행 전 worktree가 clean이고 해당 step이 phase-owned files만 바꾸는 것이 확실할 때만 사용합니다. unrelated 변경이 있으면 자동 stage/commit하지 말고 멈춰서 보고합니다.

일반 사용자는 이 명령을 직접 외울 필요는 없습니다. `run-phase` skill이 대상 phase 디렉터리를 받아 이 runner 흐름을 안내하거나 실행합니다.

## 5. Skill 기반 Phase 설계와 실행

Harness rule의 핵심은 "승인 전 실행하지 않는다"입니다. `make-phase`로 phase 설계를 만든 뒤, 사용자가 done criteria를 이해하고 승인해야 `run-phase`로 실행합니다.

실행 전 대화 예시:

```text
/make-phase "TODO 추가와 완료 처리 기능을 phase로 나눠줘"
/run-phase `phases/todo-items`
```

`run-phase`는 phase 상태를 확인하고, 필요한 경우 `status`, `approve`, `run` 흐름을 순서대로 안내하거나 실행합니다.

승인 후 agent는 승인된 phase 범위 안에서 작업합니다. 
작업 중 safety hook에 막히거나, 완료 기준을 만족할 수 없거나, 문서끼리 충돌하거나, `CRITICAL` 규칙과 충돌하거나, credential 또는 destructive approval이 필요하면 임의로 우회하지 않고 사용자에게 돌아옵니다.

## 6. 검증 후 다음 Phase로 전환

Phase가 끝나면 다음을 확인합니다.

- done criteria를 만족했는가?
- verification command가 실제로 실행되었는가?
- 실패가 있었다면 `state.json`이나 phase 기록에 남겼는가?
- 다음 phase로 넘어가기 전에 문서 업데이트가 필요한가?

`scripts/execute.py`는 agent 작업을 대체하는 도구가 아닙니다. Phase loop, state, hooks, shell verification을 관리하는 runner입니다.
`agent` step은 실행을 대신하지 않고 외부 agent 작업을 기다리며, `command`와 `verify` step만 phase 파일의 command block을 실행합니다.
