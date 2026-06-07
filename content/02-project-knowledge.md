# PART 2: 프로젝트 지식 구조

## 1. 왜 코드보다 컨텍스트가 먼저인가

Agent가 좋은 코드를 만들려면 먼저 좋은 판단 기준이 있어야 합니다. 요구사항, 제외 범위, 시스템 구조, 과거 의사결정이 정리되어 있지 않으면 agent는 현재 코드만 보고 그럴듯한 방향을 추측합니다.

Harness에서는 `docs/`를 project brain으로 취급합니다. 이 문서는 예쁘게 보관하기 위한 문서가 아니라, agent가 매 작업 전에 읽고 판단하는 기준입니다.

## 2. `AGENTS.md`: 에이전트 작업 규칙의 진입점

`AGENTS.md`는 agent가 가장 먼저 읽는 프로젝트 작업 규칙입니다. 팀의 헌법처럼 작동해야 하므로, 단순 취향보다 반드시 지켜야 하는 규칙을 담는 편이 좋습니다.

포함할 내용은 다음과 같습니다.

- CRITICAL 규칙
- 필수 문서 읽기 순서
- 구현 전 확인해야 할 조건
- 사용자에게 돌아와야 하는 상황
- 리뷰와 검증 기준

예시:

```md
- CRITICAL: Do not expand scope beyond docs/PRD.md.
- CRITICAL: If architecture changes, update docs/ADR.md.
- CRITICAL: Do not bypass scripts/hooks.
```

## 3. `Project Brain`: 현재 상태와 장기 기억

`docs/` 디렉터리는 프로젝트의 현재 상태와 장기 기억을 담습니다. Agent가 작업 중 결정을 바꾸거나 새로운 제약을 발견하면 해당 내용은 다시 문서에 반영되어야 합니다.

기본 파일은 다음 네 가지입니다.

- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/ADR.md`
- `docs/UI_GUIDE.md`

## 4. `PRD`: 구현해야 할 요구사항

`PRD.md`는 무엇을 만들지와 무엇을 만들지 않을지를 정의합니다. Harness에서 특히 중요한 것은 MVP 제외 범위입니다.

PRD에 포함할 내용:

- Goal
- Users
- Core Features
- MVP Scope
- MVP Exclusions
- Success Criteria

MVP Exclusions가 비어 있으면 agent는 좋은 의도로 기능을 덧붙일 가능성이 큽니다. 제외 범위는 "안 할 일"을 정하는 것이 아니라, 지금 phase의 집중력을 지키는 장치입니다.
진행 중인 프로젝트라면 `PRD.md`가 반드시 새로 필요하지는 않습니다.

## 5. `Architecture`: 시스템 구조와 기술 규칙

`ARCHITECTURE.md`는 어디에 코드를 둘지, 어떤 의존성을 사용할지, 어떤 명령으로 검증할지를 정리합니다.

포함할 내용:

- 시스템 개요
- 모듈 경계
- 데이터 흐름
- 빌드 명령
- 테스트 명령
- 금지하거나 선호하는 패턴

Agent가 새 폴더 구조나 새로운 라이브러리를 제안할 때, 이 문서가 판단 기준이 됩니다.

## 6. `ADR`: 중요한 의사결정 기록

`ADR.md`는 왜 이 결정을 했는지 남기는 문서입니다. 단순히 "무엇을 선택했다"가 아니라 "무엇과 비교했고, 어떤 tradeoff를 받아들였는지"를 적어야 합니다.

ADR에 포함할 내용:

- Context
- Decision
- Alternatives Considered
- Tradeoffs
- Rollback Conditions

중요한 결정이 문서에 남아 있지 않으면 다음 phase에서 agent가 같은 문제를 다시 열 수 있습니다.

## 7. `UI Guide`: 화면과 컴포넌트 규칙

UI가 있는 프로젝트라면 `UI_GUIDE.md`가 필요합니다. Agent는 화면을 만들 때 매번 새로운 디자인 취향을 적용하기 쉬우므로, UI Guide가 제품의 톤과 규칙을 잡아줍니다.

포함할 내용:

- 화면 밀도와 정보 구조
- 컴포넌트 사용 규칙
- 색상과 타이포그래피 기준
- 반응형 기준
- 수동 검증 포인트

UI가 없는 프로젝트라면 이 파일은 생략하거나 "not applicable"로 명시할 수 있습니다.

## 8. 작업 유형별 참조 순서

기본 참조 순서는 다음과 같습니다.

```text
AGENTS.md
docs/PRD.md
docs/ARCHITECTURE.md
docs/ADR.md
docs/UI_GUIDE.md
current phase file
```

작업 유형에 따라 더 중요하게 봐야 하는 문서가 달라집니다.

- 신규 기능: `PRD.md`, `ARCHITECTURE.md`
- 버그 수정: `PRD.md`, 재현 조건, 테스트 전략
- 리팩터링: `ARCHITECTURE.md`, `ADR.md`
- UI 수정: `UI_GUIDE.md`, 수동 검증 기준
