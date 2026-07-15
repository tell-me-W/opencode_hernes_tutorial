# Chapter 3. Phase 기반 OpenCode Harness

## 발표 정보

- **권장 시간:** 26분
- **권장 슬라이드:** 15~18장
- **핵심 질문:** Phase 문서를 기반으로 Agent의 작업을 어떻게 제한하고, 순서대로 실행하며, 독립적으로 검증하는가?

---

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
