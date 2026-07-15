# Chapter 4. 부서 적용과 Loop Engineering으로의 확장

## 발표 정보

- **권장 시간:** 6분
- **권장 슬라이드:** 6~7장
- **핵심 질문:** Phase Harness를 부서와 프로젝트에 어떻게 확산하고, 향후 Loop Engineering으로 어떻게 발전시킬 것인가?

---

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
