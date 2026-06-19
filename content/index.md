# OpenCode Harness 입문

OpenCode를 단순 코드 생성 도구가 아니라, 문서와 phase를 기준으로 안전하게 작업하는 개발 흐름으로 사용하는 방법을 다룹니다.

이 강의의 Harness 구조는 하나의 예시입니다. 각자의 개발 방식, 프로젝트 구조, 팀 규칙에 맞게 튜닝해서 사용하는 것을 전제로 합니다.

## 목차

1. [소개](00-introduction.md)
2. [PART 1: 시작하기](01-getting-started.md)
3. [PART 2: 프로젝트 지식 구조](02-project-knowledge.md)
4. [PART 3: Harness 세팅](03-harness-setup.md)
5. [PART 4: Phase 기반 개발](04-phase-workflow.md)
6. [PART 5: 안전장치 설계](05-safety-design.md)
7. [PART 6: 실전 워크플로우](06-practical-workflow.md)

## 최종 목표

강의가 끝나면 다음 구조가 왜 필요한지, 어떻게 연결되는지, 어디를 프로젝트에 맞게 바꿔야 하는지 설명할 수 있어야 합니다.

```text
project/
+-- AGENTS.md
+-- docs/
|   +-- PRD.md
|   +-- ARCHITECTURE.md
|   +-- ADR.md
|   +-- UI_GUIDE.md
+-- .opencode/
|   +-- skills/
+-- scripts/
|   +-- execute.py
|   +-- test_execute.py
|   +-- hooks/
|   +-- success/
+-- phases/
    +-- _template/
        +-- index.json
```

## 강의의 핵심 관점

OpenCode Harness는 agent에게 더 많은 자유를 주는 구조가 아닙니다. 좋은 판단 근거와 안전한 작업 경계를 제공하는 구조입니다.

- 먼저 문서로 판단 기준을 만든다.
- 작업을 작은 phase로 나눈다.
- 사용자가 phase 설계를 승인한 뒤 실행한다.
- hook과 verification으로 결과를 검증한다.
- 수정된 내용을 다시 docs에 update 한다.
