# Chapter 1. AI Agent의 진화와 새로운 과제

## 발표 정보

- **권장 시간:** 13분
- **권장 슬라이드:** 9~11장
- **핵심 질문:** AI Agent는 어떻게 발전해 왔고, 왜 이제 단순한 프롬프트를 넘어 통제와 검증이 필요한가?

---

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

## 1-2. Prompt 에서 Loop 까지

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
- 반복
- 종료 조건

```text
목표 설정
→ 실행
→ 평가
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
