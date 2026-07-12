# Chapter 2. OpenCode를 이해하기 위한 핵심 기능

## 발표 정보

- **권장 시간:** 10분
- **권장 슬라이드:** 9~11장
- **핵심 질문:** Phase 기반 Harness를 이해하려면 OpenCode의 어떤 구성요소와 작성·운영 원칙을 알아야 하는가?

---

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
