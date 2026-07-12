# OpenCode 기반 Code Agent Harness 발표 구성

## 발표 개요

- **발표 시간:** 1시간
- **권장 발표:** 55분 발표 + 5분 질의응답
- **권장 슬라이드 수:** 약 34~38장
- **핵심 주제:** 생성형 AI와 Code Agent를 막는 것이 아니라, 검증 가능하고 통제 가능한 방식으로 활용하기 위한 OpenCode Harness
- **핵심 사례:** Phase 문서를 기반으로 작업을 수행하는 OpenCode Harness
- **예제 저장소:** https://github.com/tell-me-W/opencode_hernes_tutorial/tree/main/content
- **OpenCode 공식 문서:** https://opencode.ai/docs/ko/

---

# 발표 핵심 메시지

> AI 도입 여부를 고민하는 단계가 아니라, AI를 어떻게 제대로 사용할 것인지를 고민해야 하는 단계다.

> AI는 산출물 생성 비용을 크게 낮췄지만, 정확성 검증 비용까지 자동으로 낮추지는 못했다.

> 우리가 공유해야 하는 것은 좋은 프롬프트 한 개가 아니라, Agent가 안전하고 검증 가능하게 일하는 개발 방식이다.

---

# 전체 챕터 구성

## Chapter 1. AI Agent의 진화와 새로운 문제

- **권장 시간:** 15분
- **권장 슬라이드:** 9~11장
- **핵심 질문:** 왜 지금 Harness Engineering이 필요하며, Harness는 무엇으로 구성되는가?

### 핵심 흐름

```text
코드 자동완성
→ 대화형 코드 생성
→ Filesystem Agent
→ 자율적인 작업 수행
→ AI 산출량 증가
→ 통제와 검증의 중요성 증가
```

## Chapter 2. OpenCode를 이해하기 위한 핵심 기능

- **권장 시간:** 10분
- **권장 슬라이드:** 9~11장
- **핵심 질문:** OpenCode의 어떤 구성요소와 작성·운영 원칙을 알아야 하는가?

## 2-1. OpenCode의 기본 실행 구조

```text
사용자 요청
    ↓
Agent
    ↓
Context + Rules
    ↓
Skills / Commands / Tools
    ↓
Filesystem 및 실행환경
```

### 핵심 메시지

OpenCode는 단순 채팅 도구가 아니라 프로젝트 파일과 실행환경을 사용하는 Code Agent다.

이 챕터에서는 OpenCode의 모든 기능을 나열하지 않고, 뒤에서 설명할 Phase 기반 Harness를 이해하는 데 필요한 핵심 기능만 다룬다.

---

## 2-2. AGENTS.md: 무엇을 넣고 무엇을 넣지 말아야 하는가

### AGENTS.md의 역할

`AGENTS.md`는 프로젝트에서 Agent가 반복적으로 지켜야 하는 핵심 규칙과, 필요한 상세 문서를 찾기 위한 길잡이를 제공한다.

```text
AGENTS.md
= 항상 적용되는 핵심 규칙

docs/
= 필요할 때 읽는 상세 Context

Phase
= 이번 작업에서 수행할 구체적인 작업 계약
```

### AGENTS.md에 넣기 좋은 내용

- 프로젝트 구조의 핵심
- Build·Test 실행 방법
- 반드시 지켜야 할 개발 규칙
- 자주 발생하는 실수
- 프로젝트 특유의 제약사항
- 금지된 작업과 위험 명령
- 상세 문서의 위치와 읽어야 하는 조건
- 코드 변경 후 필수 검증 절차

### AGENTS.md에 넣지 않는 것이 좋은 내용

- 모든 설계 문서의 전문
- 쉽게 추론할 수 있는 일반적인 개발 상식
- 자주 변경되는 세부 구현 정보
- 특정 작업에만 해당하는 일회성 지시
- 장황한 배경 설명
- 서로 충돌하거나 우선순위가 불분명한 규칙
- 실제 코드와 중복되는 설명
- 필요 여부와 관계없이 항상 읽히는 대용량 Context

### 핵심 원칙

> AGENTS.md는 지식 저장소가 아니라, Agent가 프로젝트에서 길을 잃지 않게 하는 최소 운영 규칙이다.

### 참고 자료

발표에서는 다음 자료의 핵심 내용을 한 페이지 정도로 요약해 활용한다.

- `안드레 카파시가 알려준 CLAUDE.md 의 비밀- CLAUDE.md 에 절대 쓰면 안되는 것.json`

CLAUDE.md에 적용되는 원칙은 AGENTS.md에도 유사하게 적용할 수 있다.

### AGENTS.md는 실패를 반영하며 진화하는 문서

AGENTS.md를 처음부터 완벽하게 설계하려고 하지 않는다. 실제 Agent 작업에서 반복되는 실수를 발견하고, 그 실수가 다시 발생하지 않도록 규칙을 추가하거나 구조를 개선한다.

```text
Agent의 반복 실수 발생
        ↓
실수의 원인 분석
        ↓
항상 적용할 규칙인지 판단
        ↓
AGENTS.md 또는 상세 문서에 반영
        ↓
중복·오래된 규칙 정리
        ↓
다음 작업에서 다시 검증
```

### 어디에 반영할지 판단하는 기준

```text
모든 작업에 반복 적용
→ AGENTS.md

특정 영역·디렉터리에서만 적용
→ 하위 규칙 문서 또는 영역별 문서

특정 업무의 상세 수행 방법
→ Skill

이번 작업에만 적용
→ Phase 문서

코드로 강제할 수 있는 규칙
→ Test / Lint / Hook / Permission
```

### 운영 원칙

- 처음부터 모든 규칙을 넣지 않는다.
- 실제로 반복되는 실수를 우선 반영한다.
- 코드만 읽어도 알 수 있는 내용은 넣지 않는다.
- 규칙은 구체적이고 검증 가능하게 작성한다.
- Build·Test·Lint 명령은 명확하게 기록한다.
- 문서가 길어지면 상세 내용을 분리한다.
- 오래되거나 사용하지 않는 규칙은 제거한다.
- 문서 규칙만으로 부족하면 Test·Hook·Permission으로 강제한다.

### AGENTS.md 점검 체크리스트

```text
□ 코드만 읽어도 알 수 있는 설명은 없는가?
□ 반복적으로 발생한 실수를 막는 규칙인가?
□ 규칙이 구체적이고 행동 가능하게 작성됐는가?
□ Build / Test / Lint 명령이 명확한가?
□ 특정 작업에만 필요한 내용을 넣지는 않았는가?
□ 상세 내용은 별도 문서나 Skill로 분리했는가?
□ 오래되거나 중복된 규칙은 없는가?
□ 문서가 아닌 코드와 테스트로 강제할 수는 없는가?
```

### 핵심 메시지

> 좋은 AGENTS.md는 한 번에 작성되는 문서가 아니라, Agent의 실제 실패를 반영하며 점진적으로 성장하는 프로젝트 자산이다.

### 추천 슬라이드 구성

```text
왼쪽: AGENTS.md에 넣을 것
오른쪽: AGENTS.md에 넣지 말아야 할 것
하단: docs와 Phase 문서로 분리하는 기준
```

---

## 2-3. OpenCode 주요 구성요소

| 구성요소 | 역할 | Harness 활용 예시 |
|---|---|---|
| `AGENTS.md` | 프로젝트 지식과 작업 규칙 | 개발 표준, 금지사항, 빌드 방법 |
| Agent | 역할과 권한을 가진 작업자 | 분석 Agent, 구현 Agent, 리뷰 Agent |
| Skill | 필요할 때 불러오는 재사용 지침 | 요구사항 정제, Phase 생성, 배포 SOP |
| Command | 반복 작업의 진입점 | 분석, 구현, 테스트, 리뷰 명령 |
| Tool | 실제 작업 수행 수단 | 파일 읽기·수정, Shell 실행 |
| Permission | 동작 허용·확인·차단 | 삭제 및 위험 명령 제한 |
| Plugin / Hook | 이벤트 기반 확장과 검증 | 실행 전후 검사, Build/Test |

---

## 2-4. Agent·Command·Tool·Permission

### Agent

- 특정 책임을 가진 작업자
- 사용할 수 있는 Tool과 Permission 제한
- 분석·구현·검토 역할 분리 가능
- Primary Agent와 Subagent 구성 가능

```text
Analyst Agent
→ 영향 범위 분석

Developer Agent
→ 승인된 범위 구현

Reviewer Agent
→ 변경사항과 위험 검토
```

### Command

- 반복 작업을 정해진 방식으로 시작하는 진입점
- 특정 Agent 또는 Skill과 연결 가능
- 사용자 요청 형식을 표준화
- 복잡한 작업을 일관된 방식으로 호출

### Tool

- 파일 읽기와 수정
- Shell 명령 실행
- 검색
- 외부 도구 호출
- 실제 작업환경에 영향을 주는 기능

### Permission

- 허용
- 사용자 확인
- 차단

### 핵심 메시지

> Agent에게 능력을 주는 것만큼, 어떤 능력을 언제 사용할 수 있는지 제한하는 것도 중요하다.

---

## 2-5. Skill: 반복 가능한 업무 방식을 제공한다

### Skill의 역할

Skill은 특정 업무를 수행하는 방법과 판단 기준을 재사용 가능한 형태로 제공한다.

```text
Skill
= 어떻게 수행해야 하는지에 대한 지식

Command
= 어떤 작업을 시작할지에 대한 호출 방식
```

### Skill이 필요한 이유

- 같은 업무 방식을 매번 프롬프트로 다시 작성하지 않기 위해
- 개인의 노하우를 프로젝트와 부서에 공유하기 위해
- Agent가 필요한 시점에 적절한 지침을 읽도록 하기 위해
- 요구사항 분석·구현·검증·문서화 방식을 표준화하기 위해

### 유용한 Skill 예시

| 유형 | Skill 예시 | 역할 |
|---|---|---|
| 요구사항 정제 | `grill-me` | 모호한 요구사항을 질문으로 구체화 |
| 작업 계획 | `make-phase` | 요구사항을 Phase 작업 계약으로 변환 |
| 실행 | `run-phase` | 승인된 Phase 실행 절차 제공 |
| 분석 | `legacy-analysis` | Legacy 코드 영향 범위 분석 |
| 검증 | `code-review`, `test-review` | 코드와 테스트 품질 검토 |
| 문서화 | `adr-writer`, `release-note` | 의사결정과 변경사항 정리 |
| 운영 | `incident-analysis`, `release-sop` | 장애 분석과 배포 절차 표준화 |

### grill-me Skill

`grill-me`는 요구사항이 모호하거나 빠진 조건이 많을 때, Agent가 구현부터 시작하지 않고 필요한 질문을 먼저 하도록 만드는 Skill이다.

```text
모호한 사용자 요청
        ↓
grill-me
        ↓
누락된 조건·범위·예외 질문
        ↓
명확해진 요구사항
        ↓
make-phase
        ↓
실행 가능한 Phase
```

### Prompt·Context·Harness와 Skill 연결

```text
grill-me
→ 요구사항 명확화

프로젝트 문서
→ Context 제공

make-phase
→ 작업 계약 생성

run-phase / Runner
→ 통제된 실행

Verify
→ 완료 검증
```

### Skill 소개 시 주의할 점

- Skill 목록만 나열하지 않는다.
- 각 Skill이 어떤 문제를 해결하는지 설명한다.
- 전역 Skill과 프로젝트 Skill을 구분한다.
- Phase Harness에서 실제 사용한 Skill은 Chapter 3에서 다시 연결한다.

---

## 2-6. 전역 설정과 프로젝트 설정

### 전역 설정

```text
~/.config/opencode/
├─ opencode.json
├─ AGENTS.md
├─ agents/
├─ commands/
└─ skills/
```

- 개인의 공통 개발 습관
- 개인이 자주 사용하는 Agent와 Skill
- 공통 Permission
- 개인 환경 설정
- 여러 프로젝트에서 재사용할 Skill

### 프로젝트 설정

```text
project/
├─ opencode.json
├─ AGENTS.md
└─ .opencode/
   ├─ agents/
   ├─ commands/
   ├─ skills/
   └─ plugins/
```

- 해당 프로젝트의 시스템 구조
- 프로젝트 Build·Test 방법
- 프로젝트 전용 Agent와 Skill
- 팀이 합의한 작업 규칙
- 저장소와 함께 공유되는 Harness

### 핵심 메시지

> 전역 설정은 개인의 습관을 담고, 프로젝트 설정은 팀이 합의한 실행 규칙을 담는다.

### Chapter 3로 연결하는 문장

> 이제 AGENTS.md, Skill, Permission, 프로젝트 문서가 실제 Phase 기반 Harness에서 어떻게 하나의 실행 체계로 결합되는지 살펴본다.

---

# Chapter 3. Phase 기반 OpenCode Harness

- **권장 시간:** 25분
- **권장 슬라이드:** 15~18장
- **핵심 질문:** Phase 문서를 기반으로 Agent의 작업을 어떻게 통제하고 독립적으로 검증하는가?

### 핵심 흐름

```text
요구사항
→ Phase 생성
→ 사용자 검토·승인
→ Step 단위 실행
→ Build/Test/Verify
→ 상태 기록
→ 완료 또는 중단
```

## Chapter 4. 우리 부서에서 어떻게 사용할 것인가

- **권장 시간:** 5분
- **권장 슬라이드:** 6~7장
- **핵심 질문:** 이 Harness를 프로젝트와 부서에 어떻게 확산하고 Loop로 확장할 것인가?

### 핵심 흐름

```text
개인 프롬프트
→ 프로젝트 Harness
→ 부서 공통 Harness
→ 검증 가능한 AI 개발문화
```

---

# Chapter 1. Code Agent의 진화와 새로운 문제

## 1-1. Code Agent는 무엇이 달라졌는가

### 과거의 AI 코딩 지원

```text
질문
→ 코드 응답
→ 개발자가 복사
→ 개발자가 실행
→ 개발자가 검증
```

### 현재의 Code Agent

```text
요구사항 이해
→ 저장소 탐색
→ 관련 문서·코드 검색
→ 파일 수정
→ Build/Test 실행
→ 오류 분석
→ 재수정
```

### 핵심 메시지

> AI가 코드를 알려주는 단계에서, 개발환경 안에서 일을 수행하는 단계로 이동했다.

### 추천 슬라이드 제목

- Code Generator에서 Code Agent로
- 답변 생성에서 개발환경 실행으로
- AI는 이제 코드만 생성하지 않는다
- Filesystem을 사용하는 Agent의 등장

## 1-2. AI 엔지니어링의 4단계

```text
Prompt Engineering
        ↓
Context Engineering
        ↓
Harness Engineering
        ↓
Loop Engineering
```

이 네 가지는 앞 단계가 사라지고 다음 단계로 대체되는 관계라기보다, AI 시스템을 설계할 때 고려해야 하는 영역이 확장되어 온 과정이다.

### ① Prompt Engineering

**핵심 질문**

> 모델에게 어떻게 요청해야 원하는 답을 얻을 수 있는가?

**주요 내용**

- 역할 지정
- 명확한 요구사항
- 출력 형식
- 제약조건
- 예제 제공
- 단계별 지시

```text
좋은 질문
→ 좋은 답변
```

### ② Context Engineering

**핵심 질문**

> 모델이 작업에 필요한 정보를 어떻게 적절한 시점에 받도록 할 것인가?

**주요 내용**

- 프로젝트 구조
- 기존 코드
- 설계 문서
- 업무 규칙
- 이전 의사결정
- 검색 결과
- 메모리
- 필요한 정보의 선택적 제공

```text
좋은 질문
+
필요한 정보
→ 더 정확한 답변
```

### ③ Harness Engineering

**핵심 질문**

> Agent가 예상하지 못한 행동을 하지 않도록 어떤 환경과 절차 안에서 일하게 할 것인가?

**주요 내용**

- 역할
- 권한
- 작업 범위
- 실행 단계
- 승인
- 상태 관리
- 테스트
- 실패 처리
- 재시도
- 결과 기록

```text
좋은 Prompt
+
좋은 Context
+
실행 규칙과 통제
→ 예측 가능하고 검증 가능한 작업
```

> 이 발표에서는 네 단계 중 세 번째인 Harness Engineering을 다룬다.

### ④ Loop Engineering

**핵심 질문**

> Agent가 한 번 답하고 끝나는 것이 아니라 목표 달성까지 어떻게 반복하도록 설계할 것인가?

**주요 내용**

- 목표 설정
- 실행
- 결과 평가
- 피드백
- 재계획
- 반복
- 종료 조건

```text
목표 설정
→ 실행
→ 평가
→ 피드백
→ 재계획
→ 반복
```

```text
Harness
= Agent가 일하는 환경과 규칙

Loop
= Agent가 평가와 피드백을 통해 반복하는 구조
```

## 1-3. Harness의 4대 구성요소

Harness Engineering은 다음 네 가지 요소를 중심으로 설계한다.

```text
Harness
├─ Context
│  └─ Agent가 무엇을 알아야 하는가
│
├─ Constraints
│  └─ Agent가 무엇을 하면 안 되는가
│
├─ Workflow
│  └─ Agent가 어떤 순서로 일해야 하는가
│
└─ Validation
   └─ 작업이 제대로 끝났는지 어떻게 확인하는가
```

### ① Context

Agent가 작업을 수행하기 위해 알아야 하는 프로젝트 지식과 업무 맥락이다.

- `AGENTS.md`
- PRD
- Architecture
- ADR
- 기존 코드와 테스트
- 업무 규칙
- Build·Test 명령
- 과거 의사결정

### ② Constraints

Agent의 행동 범위와 금지사항을 정의한다.

- Permission
- 읽기·쓰기 가능 경로
- 위험 명령 제한
- 수정 금지 파일
- 외부 API 접근 제한
- Main Branch 직접 Push 제한
- 사용자 승인 조건

### ③ Workflow

Agent가 작업을 수행하는 순서와 상태 전이를 정의한다.

- 요구사항 정제
- 계획
- 사용자 승인
- 구현
- Build
- Test
- Review
- 상태 기록
- 실패와 재시도

### ④ Validation

Agent의 설명이 아니라 실제 결과를 기준으로 완료 여부를 판단한다.

- Build 성공 여부
- Test 결과
- Lint
- Architecture Test
- Done Criteria
- Verify Step
- 독립 Reviewer
- 변경 범위 검사

### OpenCode Phase Harness와 연결

```text
AGENTS.md / docs
→ Context

Permission / Hook
→ Constraints

Phase / Runner / State
→ Workflow

Build / Test / Verify / Reviewer
→ Validation
```

### 핵심 메시지

> Harness는 문서 하나나 프롬프트 하나가 아니라, Context·Constraints·Workflow·Validation이 결합된 작업환경이다.

---

## 1-4. AI는 필요하고 막을 수 없는 흐름이다


- Code Agent의 활용은 계속 확대될 가능성이 높다.
- 단순히 사용을 제한한다고 문제가 해결되지는 않는다.
- AI의 생산성을 활용하면서도 검증 가능한 구조를 만들어야 한다.
- 중요한 것은 AI 사용 여부가 아니라 AI가 일하는 방식이다.

> AI를 막는 것이 아니라, AI가 올바르게 일할 수 있는 환경을 설계해야 한다.

## 1-5. AI 산출량만 늘렸을 때 발생하는 문제

```text
AI 사용 확대
→ 산출물 생성 비용 감소
→ 코드·PR·보안 보고서 증가
→ 검증 비용은 그대로
→ 전문가와 리뷰어에게 부담 전가
```

### 오픈소스 사례

| 프로젝트 | 발생한 문제 | 주요 대응 또는 결과 |
|---|---|---|
| curl | 저품질 AI 보안 신고 증가 | 버그바운티 종료 |
| Log4j | 보안 신고 검토량 급증 | 검토 시간과 우선순위 제한 |
| Django | 존재하지 않는 API·코드가 포함된 보고서 | 검증되지 않은 신고 제한 |
| Linux | 실제 또는 의심 버그의 중복 신고 증가 | 공개 채널·재현·패치 요구 |
| Node.js | 저품질 보고서 대량 접수 | 제출자 진입 기준 강화 |
| Python 생태계 | 스캐너 결과를 AI가 과장해 신고 | 인간 검증과 재현 요구 |

### 공통 구조

```text
AI 결과 생성
수초~수분
        ↓
보고서·코드·PR 제출
        ↓
전문가 검증
수십 분~수시간
        ↓
검증 비용이 리뷰어에게 이전
```

> 문제는 AI가 코드를 많이 만드는 것이 아니라, 검증되지 않은 결과를 사람이 다시 처음부터 검증해야 하는 구조다.

> AI를 잘 쓴다는 것은 많이 생성하는 것이 아니라, 검증 가능한 결과를 만들게 하는 것이다.

### Chapter 2로 연결하는 문장

> 그렇다면 Code Agent가 프로젝트 안에서 어떤 기능을 사용하고, 어떤 방식으로 행동하는지 먼저 이해해야 한다.

---

# Chapter 2. OpenCode를 이해하기 위한 최소 기능

## 2-1. OpenCode의 기본 실행 구조

```text
사용자 요청
    ↓
Agent
    ↓
Context + Rules
    ↓
Skills / Commands / Tools
    ↓
Filesystem 및 실행환경
```

> OpenCode는 단순 채팅 도구가 아니라 프로젝트 파일과 실행환경을 사용하는 Code Agent다.

## 2-2. OpenCode 주요 구성요소

| 구성요소 | 역할 | Harness 활용 예시 |
|---|---|---|
| `AGENTS.md` | 프로젝트 지식과 작업 규칙 | 개발 표준, 금지사항, 빌드 방법 |
| Agent | 역할과 권한을 가진 작업자 | 분석 Agent, 구현 Agent, 리뷰 Agent |
| Skill | 필요할 때 불러오는 재사용 지침 | Phase 생성, Phase 실행, 배포 SOP |
| Command | 반복 작업의 진입점 | 분석, 구현, 테스트, 리뷰 명령 |
| Tool | 실제 작업 수행 수단 | 파일 읽기·수정, Shell 실행 |
| Permission | 동작 허용·확인·차단 | 삭제 및 위험 명령 제한 |
| Plugin / Hook | 이벤트 기반 확장과 검증 | 실행 전후 검사, Build/Test |

## 2-3. Agent

- 특정 책임을 가진 작업자
- 사용할 수 있는 Tool과 Permission 제한
- 분석·구현·검토 역할 분리 가능
- Primary Agent와 Subagent 구성 가능

```text
Analyst Agent
→ 영향 범위 분석

Developer Agent
→ 승인된 범위 구현

Reviewer Agent
→ 변경사항과 위험 검토
```

## 2-4. Skill과 Command

### Skill

- 특정 작업에 필요한 재사용 가능한 지식
- 프로젝트 절차와 업무 지식을 문서화
- 필요한 시점에 Agent가 읽어 활용

### Command

- 반복 작업을 정해진 방식으로 시작하는 진입점
- 특정 Agent 또는 Skill과 연결 가능
- 사용자 요청 형식을 표준화

```text
Skill
= 어떻게 수행해야 하는지에 대한 지식

Command
= 어떤 작업을 시작할지에 대한 호출 방식
```

## 2-5. 전역 설정과 프로젝트 설정

### 전역 설정

```text
~/.config/opencode/
├─ opencode.json
├─ AGENTS.md
├─ agents/
├─ commands/
└─ skills/
```

- 개인의 공통 개발 습관
- 개인이 자주 사용하는 Agent와 Skill
- 공통 Permission
- 개인 환경 설정

### 프로젝트 설정

```text
project/
├─ opencode.json
├─ AGENTS.md
└─ .opencode/
   ├─ agents/
   ├─ commands/
   ├─ skills/
   └─ plugins/
```

- 해당 프로젝트의 시스템 구조
- 프로젝트 빌드·테스트 방법
- 프로젝트 전용 Agent와 Skill
- 팀이 합의한 작업 규칙
- 저장소와 함께 공유되는 Harness

> 전역 설정은 개인의 습관을 담고, 프로젝트 설정은 팀이 합의한 실행 규칙을 담는다.

### Chapter 3로 연결하는 문장

> 이제 이 구성요소들을 실제 프로젝트에서 Phase 기반 Harness로 어떻게 연결했는지 살펴본다.

---

# Chapter 3. Phase 기반 OpenCode Harness

## 3-1. 자유로운 Agent 실행의 문제

```text
“기능을 구현해줘”
        ↓
Agent가 범위 해석
        ↓
여러 파일 수정
        ↓
완료 기준을 자체 판단
        ↓
사용자는 결과가 맞는지 나중에 확인
```

### 문제점

- 작업 범위가 너무 큼
- 완료 기준이 모호함
- 실행 과정이 대화에 묻힘
- 작업 중간에 방향을 확인하기 어려움
- 실패 지점을 알기 어려움
- 같은 작업을 재현하기 어려움
- Agent가 필요 이상의 파일을 수정할 수 있음
- 테스트하지 않고 완료를 선언할 수 있음

## 3-2. Phase 방식

```text
요구사항
→ 작은 작업 계약으로 분할
→ 사용자가 범위와 완료 기준 검토
→ 사용자 승인
→ 순서대로 실행
→ 단계별 검증
→ 상태 기록
```

> Phase는 Agent에게 제공하는 작은 작업 계약이다.

### Phase에 포함할 정보

- Goal
- Inputs
- Instructions
- Out of Scope
- Done Criteria
- Verification

> Harness는 Agent에게 더 좋은 프롬프트를 주는 것이 아니라, 작업을 계약·승인·실행·검증 가능한 구조로 만드는 것이다.

## 3-3. 프로젝트 Harness 구조

```text
project/
├─ AGENTS.md
├─ docs/
│  ├─ PRD.md
│  ├─ ARCHITECTURE.md
│  ├─ ADR.md
│  └─ UI_GUIDE.md
│
├─ .opencode/
│  └─ skills/
│     ├─ grill-me/
│     ├─ make-phase/
│     └─ run-phase/
│
├─ phases/
│  ├─ _template/
│  └─ todo-items/
│
└─ scripts/
   ├─ execute.py
   ├─ test_execute.py
   └─ hooks/
```

```text
AGENTS.md / docs
= 프로젝트 지식과 판단 기준

grill-me
= 모호한 요구사항의 누락 조건과 예외 확인

make-phase
= 명확해진 요구사항을 실행 가능한 Phase로 변환

run-phase
= 승인된 Phase의 실행 규칙 제공

execute.py
= 실행 순서, 상태, Hook, 재시도 관리

state.json
= 실행 상태를 파일로 기록
```

## 3-4. Phase 문서 예시

```md
# Goal

Todo 항목의 완료 상태 변경 기능을 구현한다.

# Inputs

- docs/PRD.md
- docs/ARCHITECTURE.md
- src/todo/

# Instructions

- 기존 Todo 도메인 모델을 유지한다.
- 완료 여부 변경 API를 추가한다.
- 관련 테스트를 작성한다.

# Out of Scope

- Todo 삭제 기능
- UI 스타일 변경
- 데이터베이스 마이그레이션

# Done Criteria

- 완료 상태 변경 API가 동작한다.
- 기존 테스트와 신규 테스트가 통과한다.

# Verification

- ant compile
- ant test
```

```text
Prompt
= 지금 무엇을 요청하는가

Phase
= 무엇을, 어디까지, 어떤 조건으로 완료할 것인가
```

> Phase는 단순히 긴 프롬프트가 아니라 검증 가능한 작업 계약이다.

## 3-5. Phase 생성 과정

```text
사용자 요구사항
        ↓
make-phase Skill
        ↓
프로젝트 문서 확인
        ↓
작업 범위 분리
        ↓
Phase 문서 작성
        ↓
Done Criteria와 Verification 정의
        ↓
사용자 검토
```

### 확인할 항목

- 작업 단위가 너무 크지 않은가?
- 입력 문서가 명확한가?
- 하지 않을 작업이 명시되어 있는가?
- 완료 여부를 기계적으로 검증할 수 있는가?
- 사용자 승인 전에 실행되지 않는가?

## 3-6. Manifest: `index.json`

```json
{
  "steps": [
    {
      "id": "20-implement",
      "file": "20-implement.md",
      "type": "agent",
      "requires": ["10-plan"],
      "commit_after": true
    }
  ]
}
```

### 역할

- Step 실행 순서 정의
- Step 간 의존관계 정의
- Step 유형 지정
- Commit 조건
- Hook 연결
- 실패 시 중단 조건

> 실행 순서를 Agent의 즉흥적인 판단에 맡기지 않고 명시적인 Manifest로 관리한다.

## 3-7. State: `state.json`

### 기록 대상

- 사용자 승인 여부
- 현재 실행 Step
- 완료한 Step
- 실패한 Step
- Blocked 상태
- 재시도 횟수
- 실행 결과
- 재개 지점

> 대화의 기억에 작업 상태를 맡기지 않고 파일로 명시적으로 관리한다.

### 장점

- 실행 중단 후 재개 가능
- 실패 지점 확인 가능
- Agent 세션이 달라져도 상태 유지
- 감사와 추적 가능
- 자동화와 Loop로 확장 가능

## 3-8. Step 유형

### Agent Step

```text
복잡한 코드 분석
영향 범위 판단
코드 구현
문서 작성
```

### Command Step

```text
Build
Test
Lint
정해진 Script 실행
```

### Verify Step

```text
완료 기준 확인
결과 파일 확인
테스트 성공 여부 확인
변경 범위 검증
```

```text
유연한 판단
→ Agent

결정적인 실행
→ Command

성공 여부 판정
→ Verify
```

> Agent가 모든 것을 판단하게 하지 않고, 판단·실행·검증의 책임을 분리한다.

## 3-9. 생성 Agent와 검증 Agent의 분리

Agent가 자신이 만든 결과를 직접 평가하고 완료를 선언하게 하면 확증편향과 검증 누락이 발생할 수 있다.

### 피해야 할 구조

```text
Developer Agent
→ 코드 작성
→ 스스로 결과 평가
→ 스스로 완료 선언
```

### 권장 구조

```text
Developer Agent
→ 코드 작성

Build / Test / Lint
→ 결정적 검증

Reviewer Agent
→ 독립적 품질 평가

Done Criteria / Verify
→ 최종 완료 판정
```

### 역할 분리

| 역할 | 책임 |
|---|---|
| Generator | 코드·문서·계획 생성 |
| Command | Build·Test·Lint 등 결정적 실행 |
| Evaluator | 요구사항 충족과 품질 독립 평가 |
| Runner | 실행 순서와 상태 관리 |
| Human | 중요 작업의 승인과 예외 판단 |

### Phase Harness에 적용

```text
Agent Step
→ 생성과 구현

Command Step
→ Build·Test의 결정적 실행

Verify Step
→ Done Criteria 충족 확인

Reviewer Agent
→ 생성 Agent와 분리된 독립 검토
```

### 검증 결과에 따른 상태 전이

```text
생성 완료
        ↓
결정적 검증
        ↓
독립 Reviewer
        ↓
통과 ─────────→ 완료
        │
        └─ 실패 → 수정 Phase 또는 재시도
```

### 핵심 메시지

> 생성하는 Agent와 검증하는 주체를 분리하고, 완료 여부는 설명이 아니라 독립적인 증거로 판단해야 한다.

---

## 3-10. 전체 실행 흐름

```text
요구사항 입력
        ↓
make-phase
        ↓
Phase 문서 생성
        ↓
사용자 검토·승인
        ↓
execute.py
        ↓
다음 미완료 Step 선택
        ↓
Pre Hook
        ↓
Agent / Command / Verify
        ↓
Post Hook
        ↓
state.json 기록
        ↓
다음 Step 또는 중단
```

## 3-11. 승인 절차

### 승인 전

- Phase 내용 검토
- 작업 범위 확인
- Out of Scope 확인
- Done Criteria 확인
- Verification 확인
- 변경 위험 검토

### 승인 후

- Runner 실행 허용
- Step 순서에 따라 작업
- 상태 저장
- 실패 시 중단 또는 재시도

> Agent의 실행을 막는 것이 아니라, 중요한 실행 전에 사람이 작업 계약을 승인하도록 한다.

## 3-12. Hook과 안전장치

### Pre Hook

- 허용되지 않은 파일 접근 검사
- 작업 디렉터리 상태 확인
- 필수 문서 존재 여부 확인
- 이전 Step 완료 여부 확인
- Git 상태 확인

### Post Hook

- Build 수행
- Test 수행
- 변경 파일 검사
- 결과 로그 저장
- Commit 조건 검사

### 추가 안전장치

- Permission 제한
- 위험 Shell 명령 차단
- 작업 범위 외 파일 수정 검사
- 재시도 횟수 제한
- 사용자 승인 없는 실행 차단
- 검증 실패 시 완료 처리 금지

## 3-13. 오픈소스 사례와 Harness 대응 연결

| 오픈소스에서 발생한 문제 | Harness의 대응 |
|---|---|
| AI 산출물 대량 생성 | Phase 단위로 작업 범위 제한 |
| 검증되지 않은 결과 제출 | Done Criteria와 Verify 필수화 |
| 허위 또는 과장된 설명 | 실행 결과와 테스트 근거 요구 |
| 무단 또는 과도한 변경 | 사용자 승인과 Permission |
| 실패 상태 추적 불가 | `state.json` 기록 |
| 같은 오류 반복 | 재시도 제한 |
| 리뷰어가 처음부터 재검증 | Build/Test/Review 결과 첨부 |
| 변경 이력 누락 | `commit_after` 정책 |

> curl과 Log4j 사례는 AI를 쓰지 말아야 한다는 사례가 아니라, 검증 체계 없이 AI의 생산량만 늘렸을 때 어떤 일이 발생하는지를 보여주는 사례다.

## 3-14. 데모 시나리오

### 권장 데모 시간

- 약 8~10분

### 데모 흐름

```text
1. 요구사항 제시
2. make-phase 실행
3. 생성된 Phase 확인
4. Goal과 Inputs 확인
5. Out of Scope 설명
6. Done Criteria와 Verification 확인
7. 사용자 승인
8. Runner 실행
9. Agent의 코드 변경
10. Build/Test/Verify 수행
11. state.json 확인
12. 실패 또는 중단 후 재개
```

### 데모에서 보여줘야 할 핵심

- Agent가 Phase 밖의 일을 하지 않는가?
- 실행 전에 사람이 범위를 확인하는가?
- 완료 기준이 명확한가?
- Build/Test 결과가 남는가?
- 실패한 Step을 알 수 있는가?
- 중단 후 이어서 실행할 수 있는가?
- 수정 근거와 검증 근거가 함께 남는가?

### 데모에서 피할 것

- 너무 큰 기능 구현
- 라이브 디버깅에 많은 시간 사용
- 생성 속도만 강조
- 코드 전체를 한 줄씩 설명
- 정상 실행만 보여주고 실패 처리 생략

---

# Chapter 4. 우리 부서에서 어떻게 사용할 것인가

## 4-1. 적용 전후 비교

| 항목 | 자유 프롬프트 방식 | Phase Harness 방식 |
|---|---|---|
| 작업 범위 | 대화에서 암묵적으로 결정 | Phase에 명시 |
| 프로젝트 지식 | 매번 다시 설명 | 문서로 지속 제공 |
| 실행 순서 | Agent 판단 | Manifest로 관리 |
| 사용자 개입 | 결과 생성 이후 | 실행 전 승인 |
| 완료 판단 | Agent의 설명 | Done Criteria와 Verify |
| 실패 상태 | 대화에서 추적 | State 파일에 기록 |
| 재현성 | 낮음 | 동일 Phase 재실행 가능 |
| 검증 | 리뷰어가 처음부터 확인 | Build/Test 결과 제공 |
| 공유 | 프롬프트 복사 | 저장소와 Harness 공유 |

## 4-2. 부서 공통 Harness와 프로젝트 Harness

```text
부서 공통 Harness
├─ 공통 보안 정책
├─ 기본 Permission
├─ 리뷰 기준
├─ Phase Template
├─ 공통 Hook
└─ 공통 Skill
          ↓
프로젝트별 Harness
├─ AGENTS.md
├─ PRD / Architecture / ADR
├─ 빌드·테스트 명령
├─ 업무별 SOP
├─ 프로젝트 전용 Skill
└─ 업무별 Phase
```

### 부서 공통 영역

- 금지 명령
- 보안 정책
- 코드 리뷰 기준
- 공통 Phase 템플릿
- 공통 Commit 정책
- AI 사용 가이드
- 민감정보 처리 기준

### 프로젝트별 영역

- 시스템 구조
- 빌드 방법
- 테스트 방법
- 배포 절차
- Legacy 제약사항
- 업무 규칙
- 프로젝트별 완료 기준

## 4-3. 단계적 도입 방안

### 1단계: Context 정리

```text
AGENTS.md
PRD
Architecture
ADR
업무 규칙
```

### 2단계: 반복 작업 표준화

```text
Skill
Command
Build Script
Test Script
Review Checklist
```

### 3단계: Phase 도입

```text
Goal
Inputs
Instructions
Out of Scope
Done Criteria
Verification
```

### 4단계: Runner와 State 도입

```text
실행 순서
승인
상태 기록
Hook
재시도
중단과 재개
```

### 5단계: Loop Engineering으로 확장

```text
실행 결과 평가
→ 실패 원인 분석
→ Phase 보완
→ 재실행
→ 목표 달성 여부 판단
```

## 4-4. 운영 원칙

- AI의 결과를 검증 없이 사용하지 않는다.
- 프로젝트 규칙은 개인 프롬프트가 아니라 저장소에 기록한다.
- Agent가 수행할 작업 범위를 명시한다.
- 완료 기준은 가능한 한 기계적으로 검증한다.
- 위험한 작업은 사용자 승인을 요구한다.
- 실패 상태와 실행 결과를 파일로 남긴다.
- 공통 Harness와 프로젝트 Harness의 책임을 분리한다.
- AI 산출량보다 검증된 결과의 품질을 평가한다.

## 4-5. Phase Harness는 Harness와 Loop의 경계에 있다

Phase Harness는 한 번의 Agent 작업을 안정적으로 실행하기 위한 Harness이지만, Runner·State·Verify·재시도가 결합되면서 제한적인 내부 Loop도 포함한다.

### 현재 Phase Harness의 범위

```text
사람이 요구사항 입력
        ↓
grill-me
        ↓
make-phase
        ↓
사용자 승인
        ↓
run-phase / Runner
        ↓
Build / Test / Verify
        ↓
완료 또는 제한된 재시도
```

이 구조에서는 사람이 작업 시작과 승인에 관여한다. Agent의 한 번의 실행을 안정화하는 것이 중심이므로 기본적으로 Harness Engineering의 범위다.

### Harness 내부의 제한된 Loop

```text
실행
→ 검증 실패
→ 원인 확인
→ 수정
→ 재검증
→ 종료 조건 충족
```

이 반복은 명확한 Phase 범위, 재시도 제한, 종료 조건 안에서만 수행된다.

### Loop Engineering으로 확장되는 시점

다음 요소가 추가되면 Phase Harness는 상위 Loop 시스템으로 확장된다.

- Issue·CI 실패·일정 등의 자동 Trigger
- Agent가 다음 작업을 스스로 선택
- Phase 자동 생성
- 사람의 직접 요청 없이 반복 실행
- 외부 Evaluator가 결과를 평가
- 목표 달성까지 장시간 반복
- 비용·시간·재시도 예산 관리
- 종료 조건과 Escalation

### 향후 확장 구조

```text
Issue / CI Failure / Schedule
        ↓
Trigger
        ↓
요구사항 분석
        ↓
Phase 자동 생성
        ↓
실행
        ↓
독립 검증
        ↓
통과 ─────────→ 종료
        │
        └─ 실패 → 재계획 → 다음 Phase
```

### Harness와 Loop의 구분

| 구분 | Harness Engineering | Loop Engineering |
|---|---|---|
| 중심 질문 | 한 번의 실행을 어떻게 통제할까? | 실행을 언제, 어떻게 반복할까? |
| 시작 | 주로 사용자 요청과 승인 | Trigger 또는 시스템 판단 |
| 범위 | 명시된 작업 계약 | 목표 달성까지 여러 작업 연결 |
| 상태 | Step 실행 상태 | 장기 목표와 반복 상태 |
| 종료 | Phase Done Criteria | 전체 목표와 예산·시간 조건 |
| 사람 역할 | 승인자·검토자 | Loop 설계자·예외 감독자 |

### 핵심 메시지

> Phase Harness는 Agent의 한 번의 실행을 안정화하고, Loop Engineering은 검증된 실행을 상위 수준에서 반복·조정한다.

---

## 4-6. 최종 메시지

```text
Prompt
→ 요청을 명확히 한다

Context
→ 필요한 지식을 제공한다

Harness
→ 실행을 통제하고 검증한다

Loop
→ 평가하며 반복한다
```

> Code Agent의 발전은 막을 수 없는 흐름이다.

> 중요한 것은 AI에게 더 많은 일을 시키는 것이 아니라, AI가 검증 가능한 방식으로 일하도록 만드는 것이다.

> 우리가 부서에 공유해야 하는 것은 좋은 프롬프트가 아니라, 안전하고 반복 가능하며 검증 가능한 AI 개발 방식이다.

---

# 권장 시간 배분

| 구간 | 권장 시간 |
|---|---:|
| Chapter 1 | 13분 |
| Chapter 2 | 10분 |
| Chapter 3 설명 | 18분 |
| 데모 | 8분 |
| Chapter 4 | 5분 |
| 질의응답 | 5분 |
| 전환 및 여유 | 3분 |
| **합계** | **60분** |

---

# 권장 슬라이드 수

| 챕터 | 권장 장수 |
|---|---:|
| Chapter 1 | 9~11장 |
| Chapter 2 | 9~11장 |
| Chapter 3 | 15~18장 |
| Chapter 4 | 6~7장 |
| 표지·목차·마무리 | 3장 |
| **합계** | **40~44장 전후** |

---

# 발표 제목 후보

## 기술 중심

- 생성에서 검증으로: OpenCode 기반 Code Agent Harness
- Code Agent를 제대로 일하게 만드는 방법
- OpenCode Phase Harness 구축과 적용
- 검증 가능한 Code Agent 개발환경 만들기
- Filesystem Agent를 통제하는 OpenCode Harness

## 조직·업무 중심

- AI를 막는 대신 제대로 일하게 만드는 방법
- 프롬프트를 넘어 Harness로
- Code Agent의 생산성을 조직의 개발 방식으로 전환하기
- AI 산출량이 아닌 검증된 결과를 만드는 개발환경
- 우리 부서의 Code Agent 활용을 위한 OpenCode Harness

## 추천 제목

> **생성에서 검증으로: OpenCode 기반 Code Agent Harness**

### 부제

> Phase 문서를 활용한 통제 가능하고 반복 가능한 AI 개발환경 구축

---

# Slidev 기반 발표자료 제작 구조

```text
발표 내용 Markdown
        ↓
Slidev
        ↓
Vue 컴포넌트·Mermaid·코드 예제
        ↓
taste-skill 기준으로 디자인 보정
        ↓
브라우저 전체화면 발표
        ↓
PDF 또는 PPTX로 배포
```

## 권장 프로젝트 구조

```text
presentation/
├─ slides.md
├─ content/
│  ├─ chapter-01.md
│  ├─ chapter-02.md
│  ├─ chapter-03.md
│  └─ chapter-04.md
├─ components/
│  ├─ EngineeringEvolution.vue
│  ├─ HarnessArchitecture.vue
│  ├─ PhaseExecutionFlow.vue
│  └─ BeforeAfter.vue
├─ public/
│  ├─ screenshots/
│  ├─ demo/
│  └─ diagrams/
├─ styles/
│  └─ presentation.css
└─ package.json
```

## 디자인 원칙

- 16:9 고정 화면
- 한 슬라이드에 하나의 핵심 메시지
- 본문 최소 24px
- 코드와 디렉터리 구조의 가독성 우선
- 화면당 텍스트 최소화
- 장식 목적의 카드 남용 금지
- 애니메이션은 단계 설명에만 사용
- PDF 출력 시에도 정보가 유지되어야 함
- 웹사이트가 아니라 기술 발표자료로 설계
- 실제 Harness 파일과 코드 예제를 중심으로 구성

---

# 향후 추가할 내용의 배치 기준

## Chapter 1에 추가하기 좋은 내용

- 최신 Code Agent 발전 사례
- Filesystem Agent 관련 기술 변화
- AI 코딩 도구의 자율성 증가
- AI 생성물로 인한 리뷰 부담 사례
- 오픈소스 유지관리 문제
- AI 엔지니어링 개념 변화
- Prompt·Context·Harness·Loop 관련 자료
- AI를 막을 수 없는 이유
- AI 활용에 대한 조직적 시사점

## Chapter 2에 추가하기 좋은 내용

- OpenCode 공식 기능
- Agent·Skill·Command 차이
- Permission 정책
- 전역 설정과 프로젝트 설정
- AGENTS.md 사용법
- Plugin과 Hook
- Subagent 구성

## Chapter 3에 추가하기 좋은 내용

- Phase 템플릿
- 실제 `index.json`
- 실제 `state.json`
- Runner 코드
- Hook 코드
- 실패와 재시도 사례
- 승인 흐름
- Build/Test 연동
- 데모 시나리오
- 프로젝트 Harness 파일 구조

## Chapter 4에 추가하기 좋은 내용

- 부서 도입 계획
- 공통 Harness 저장소
- 운영 담당자
- 적용 대상 프로젝트
- 교육 계획
- AI 사용 정책
- 성과 측정 기준
- 향후 Loop Engineering 확장 계획

---

# 발표 준비 체크리스트

## 내용

- [ ] 발표 목적 한 문장 확정
- [ ] Prompt·Context·Harness·Loop 정의 정리
- [ ] Harness의 Context·Constraints·Workflow·Validation 다이어그램 준비
- [ ] curl·Log4j 등 사례 출처 정리
- [ ] OpenCode 기본 기능 예시 준비
- [ ] AGENTS.md에 넣을 것과 넣지 말아야 할 것 정리
- [ ] 반복 실수를 AGENTS.md·Skill·Test로 반영하는 운영 흐름 준비
- [ ] `안드레 카파시가 알려준 CLAUDE.md 의 비밀- CLAUDE.md 에 절대 쓰면 안되는 것.json` 핵심 요약
- [ ] grill-me를 포함한 유용한 Skill 사례 준비
- [ ] 전역·프로젝트 설정 비교 준비
- [ ] Phase Harness 디렉터리 구조 준비
- [ ] 실제 Phase 문서 준비
- [ ] `index.json` 예시 준비
- [ ] `state.json` 예시 준비
- [ ] Hook과 안전장치 설명 준비
- [ ] 생성 Agent와 Reviewer·Verify 분리 구조 준비
- [ ] Phase Harness와 Loop Engineering 경계 설명 준비
- [ ] 적용 전후 비교 작성
- [ ] 부서 확산 방안 정리

## 데모

- [ ] 인터넷 없이 실행 가능한 상태 준비
- [ ] 데모용 요구사항 고정
- [ ] Phase 생성 결과 미리 확인
- [ ] 실행 시간 점검
- [ ] Build/Test가 정상 동작하는지 확인
- [ ] 실패 상황 예비 화면 준비
- [ ] 라이브 데모 실패 시 사용할 녹화 영상 준비
- [ ] 터미널 글자 크기 확대
- [ ] 민감정보 제거
- [ ] 불필요한 알림 차단

## 발표자료

- [ ] 16:9 화면 확인
- [ ] 발표장 거리에서 글자 크기 확인
- [ ] 코드 한 화면 분량 제한
- [ ] 핵심 메시지를 제목에 배치
- [ ] 각 챕터 연결 문장 준비
- [ ] PDF Export 확인
- [ ] 오프라인 웹 빌드 확인
- [ ] 발표자 노트 작성
- [ ] 질의응답 예상 질문 준비

---

# 예상 질문

## AI가 잘하면 Harness가 필요 없는 것 아닌가?

모델 성능이 좋아져도 프로젝트별 규칙, 권한, 승인, 검증, 상태 관리 문제는 남는다. Harness는 모델의 부족함만 보완하는 것이 아니라, Agent를 조직의 개발 프로세스 안에서 운영하기 위한 체계다.

## Phase 문서는 결국 긴 프롬프트 아닌가?

Phase는 단순 지시문이 아니라 입력, 범위, 제외 범위, 완료 기준, 검증 방법을 포함하는 실행 계약이다. Manifest와 State, Runner, Hook이 결합되므로 일반 프롬프트와 역할이 다르다.

## 왜 Agent가 알아서 Build와 Test를 수행하게 하면 안 되는가?

Agent가 판단하도록 할 수 있지만, 프로젝트에서 반드시 수행해야 하는 검증은 Command나 Hook으로 결정적으로 실행하는 것이 재현성과 신뢰성이 높다.

## 모든 작업을 Phase로 만들어야 하는가?

단순 질의나 작은 수정까지 모두 Phase로 만들 필요는 없다. 영향 범위가 크거나 여러 단계가 필요하고, 검증과 추적이 중요한 작업에 우선 적용하는 것이 적절하다.

## Harness를 구축하는 비용이 더 크지 않은가?

초기 비용은 있지만 반복 업무, Legacy 시스템, 다수 개발자가 공유하는 프로젝트에서는 문서 재설명, 검증 누락, 리뷰 비용을 줄일 수 있다. 작은 범위에서 시작해 반복되는 작업부터 확장해야 한다.

## 생성 Agent와 검증 Agent를 반드시 분리해야 하는가?

작은 작업에서는 동일 Agent가 자체 검토할 수 있지만, 영향 범위가 크거나 장시간 실행되는 작업에서는 Build·Test와 독립 Reviewer를 분리하는 것이 안전하다. 생성 Agent의 설명만으로 완료를 판단하지 않고, 외부 검증 결과를 함께 사용해야 한다.

## Phase Runner에 재시도가 있으면 이미 Loop Engineering 아닌가?

Phase 내부의 재시도는 명시된 작업 범위와 종료 조건 안에서 동작하는 제한된 내부 Loop다. 자동 Trigger, 다음 작업 선택, Phase 생성, 장기 목표 관리까지 시스템이 수행할 때 상위 수준의 Loop Engineering으로 확장된다.

## OpenCode에만 적용 가능한가?

예제는 OpenCode 기반이지만, Prompt·Context·Harness·Loop의 원리와 Phase 기반 작업 계약은 다른 Code Agent에도 적용 가능하다.

---

# 최종 한 문장

> **AI의 생산성을 활용하되, Agent가 프로젝트의 규칙 안에서 실행하고 검증된 결과를 남기도록 만드는 것이 Harness Engineering이다.**
