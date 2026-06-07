# PART 6: 실전 워크플로우

## 1. 요구사항을 Phase로 변환하기

- 요구사항은 곧바로 구현하지 않고 phase로 변환합니다. 작업 유형에 따라 phase를 나누는 기준도 달라집니다.
- Phase를 나눌 때는 "agent가 한 번에 안전하게 끝낼 수 있는 크기인가"를 기준으로 삼습니다.

### 신규 기능

```text
요구사항:
사용자는 TODO를 추가하고 완료 처리할 수 있어야 한다.

Phase:
00-bootstrap: 문서와 범위 확인
10-plan: 구현 계획과 파일 범위 정리
20-domain-tests_A: TODO 추가 도메인 테스트 작성
21-domain-tests_B: TODO 완료 도메인 테스트 작성
30-domain-implement_A: TODO 추가 도메인 구현
31-domain-implement_B: TODO 완료 도메인 구현
40-ui-implement_A: TODO 입력 UI 구현
41-ui-implement_B: TODO 완료 UI 구현
50-review: diff와 done criteria 검토
60-verify: 테스트, 빌드, 수동 검증
```

신규 기능은 기능 단위와 검증 단위를 작게 나눕니다. 도메인 동작, UI, persistence, 권한처럼 실패 원인이 달라지는 영역은 phase를 분리하는 편이 좋습니다.

### 버그 수정

```text
요구사항:
완료한 TODO가 새로고침 후 다시 미완료 상태로 보이는 문제를 수정해야 한다.

Phase:
00-bootstrap: 버그 설명, 재현 조건, 기대 동작 확인
10-reproduce: 실패를 재현하는 테스트 또는 수동 재현 절차 작성
20-regression-test: 새로고침 후 완료 상태 유지 회귀 테스트 작성
30-fix: persistence 상태 저장/복원 로직 수정
40-review: 수정 범위와 부작용 검토
50-verify: 회귀 테스트, 관련 테스트, 수동 새로고침 검증
```

버그 수정은 바로 고치기보다 먼저 재현 조건을 고정합니다. 가능하면 실패하는 회귀 테스트를 먼저 만들고, 테스트가 통과하도록 수정합니다.

### 리팩토링

```text
요구사항:
TODO 상태 관리 로직이 UI 컴포넌트에 섞여 있어 도메인 모듈로 분리해야 한다.

Phase:
00-bootstrap: 리팩토링 목적과 외부 동작 유지 조건 확인
10-characterize: 현재 동작을 보호하는 characterization test 작성
20-plan-boundary: 이동할 모듈 경계와 public API 설계
30-extract-domain: TODO 상태 변경 로직을 도메인 모듈로 이동
40-update-callers: UI 컴포넌트가 새 도메인 API를 사용하도록 수정
50-review: 외부 동작 변화와 architecture 규칙 위반 여부 검토
60-verify: 기존 테스트, characterization test, 수동 UI 검증
```

리팩토링은 새 기능을 추가하는 작업이 아니라 외부 동작을 유지하면서 내부 구조를 바꾸는 작업입니다. 따라서 동작을 보호하는 테스트와 모듈 경계 확인이 먼저 와야 합니다.


## 2. `grill-me` skill 로 빠진 조건 채우기

요구사항이 흐릿하면 agent에게 바로 구현을 맡기지 않습니다. 먼저 빠진 조건을 질문으로 채웁니다.

확인할 질문:

- 사용자는 누구인가?
- 성공 기준은 무엇인가?
- 이번에 만들지 않을 것은 무엇인가?
- 데이터는 어디에 저장하는가?
- 자동 검증과 수동 검증은 각각 무엇인가?
- 보안이나 권한 제약이 있는가?

답변 내용으로 Phase의 각 문서에 디테일한 내용을 추가합니다.

## 3. 검증 방법 먼저 정하기

Phase를 실행하기 전에 각 phase의 verification을 먼저 정합니다. 검증 방법은 자동 검증과 수동 검증으로 나눕니다.

자동 검증 예시:

```text
npm test
npm run build
```

수동 검증이 필요한 경우에는 "수동 검증 필요"라고만 쓰지 말고, 무엇을 봐야 하는지 적습니다.

예시:

```md
Manual Verification
- Add a TODO from the main input.
- Complete the TODO.
- Refresh the page and confirm expected persistence behavior.
```

실행 후에는 실제로 수행한 명령과 결과를 phase 기록이나 review summary에 남깁니다.

## 4. Skill 기반 Phase 실행

phase 파일이 준비되면 `/harness` skill에 대상 phase 디렉터리를 넘겨 실행 흐름을 맡깁니다. `/harness`는 phase 상태를 확인하고, 필요한 경우 `status`, `approve`, `run` 흐름을 순서대로 안내하거나 실행합니다.


예시:

```text
/harness phases/todo-list
```

승인 후 agent는 현재 phase의 범위 안에서만 작업합니다. 작업 중 safety hook에 막히거나, 완료 기준을 만족할 수 없거나, 문서끼리 충돌하거나, `CRITICAL` 규칙과 충돌하거나, credential 또는 destructive approval이 필요하면 임의로 우회하지 않고 사용자에게 돌아옵니다.

## 5. Review Skill로 변경사항 검토

Review는 스타일 지적보다 correctness finding을 우선합니다. 리뷰 기준은 phase의 done criteria, PRD, Architecture, ADR입니다.
`https://github.com/tell-me-W/work_temp/blob/main/skill/build-opencode-harness/assets/harness-template/.opencode/skills/review/SKILL.md`

리뷰 입력:

- `AGENTS.md`
- 관련 docs
- 현재 phase 파일
- `git status --short --branch`
- `git diff --stat`
- `git diff`

보고 형식은 findings first가 좋습니다.

```md
## Findings

- [Important] src/todo/domain.ts:42 Empty TODO text is accepted.
  PRD says empty TODO items must be rejected.
  Add a regression test and reject blank input before creating the item.

## Summary

Reviewed the todo-list phase against PRD and done criteria.
Verification still needs npm test after the fix.
```

## 6. Project Brain과 Phase State 업데이트

작업 중 바뀐 사실은 문서와 state에 남깁니다.

- 요구사항 변경: `docs/PRD.md`
- 구조 변경: `docs/ARCHITECTURE.md`
- 의사결정 변경: `docs/ADR.md`
- UI 규칙 변경: `docs/UI_GUIDE.md`
- 진행 상태 변경: `phases/{task-name}/state.json`

Harness의 목적은 한 번의 작업을 끝내는 데서 멈추지 않습니다. 다음 agent가 이어받아도 같은 기준으로 판단할 수 있게 만드는 것이 최종 목표입니다.
