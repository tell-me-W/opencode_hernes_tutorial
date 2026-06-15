# PART 1: 시작하기

## 1. Harness 개요

Harness는 프로젝트 문서, 작업 규칙, phase 실행 흐름, 안전 hook을 묶은 작업 운영 구조입니다. 설치 후에는 agent가 문서를 읽고, phase를 설계하고, 사용자 승인을 받은 뒤, 검증 가능한 범위 안에서 작업하도록 유도합니다.

`build-opencode-harness` skill 기준으로 Harness는 네 개의 층으로 구성됩니다.

- `docs/`: project brain
- `AGENTS.md`: project constitution
- `.opencode/skills/`와 `scripts/execute.py`: manifest-driven execution engine
- `scripts/hooks/`: automated safety checks

## 2. OpenCode 기본 개념

OpenCode에서 agent는 프로젝트 안의 instruction과 문서를 읽고 작업합니다. Harness는 agent가 작업 전에 읽어야 할 정보와 실행 중 따라야 할 절차를 프로젝트 안에 명시적으로 둡니다.

이 강의에서는 OpenCode를 다음 관점으로 봅니다.

- Agent는 코드를 직접 고치는 작업자입니다.
- Skill은 반복 가능한 작업 절차입니다.
- 문서는 agent가 판단할 때 쓰는 기준입니다.
- Hook과 permission은 위험한 실행을 줄이는 안전장치입니다.

## 3. OpenCode 설정 구조

OpenCode 설정은 전역 설정과 프로젝트 설정으로 나누어 볼 수 있습니다.

- 전역 설정: `~/.config/opencode`
- 프로젝트 설정: `.opencode`
- 프로젝트 설정 파일: `.opencode/opencode.json`이 있을 수 있음
- 프로젝트 작업 규칙: `AGENTS.md`

`opencode.json`은 OpenCode의 동작 설정을 담당합니다. 어떤 skill을 허용할지, 어떤 permission 정책을 둘지 같은 실행 정책을 담을 수 있습니다. 다만 Harness 템플릿의 필수 출력물은 프로젝트 문서, project-local skills, scripts, phases 구조에 더 가깝습니다.

`AGENTS.md`는 agent가 먼저 읽는 프로젝트 규칙입니다. 이 파일에는 CRITICAL 규칙, 필수 문서 읽기 순서, 멈춰야 하는 조건, 리뷰 기준을 담습니다.

## 4. Harness를 구성하는 OpenCode 요소

Harness에서 자주 만나는 요소는 다음과 같습니다.

- `AGENTS.md`: 프로젝트 헌법, CRITICAL 규칙, 작업 원칙
- `Agents`: 역할 기반 에이전트
- `Skills`: 재사용 가능한 작업 능력
- `Plugins`: OpenCode 동작 확장과 자동화
- `scripts/hooks`: Harness 내부 안전 검증 스크립트

### Claude Code와 헷갈리기 쉬운 지점

OpenCode의 plugin과 Claude Code의 plugin은 의미가 다릅니다. OpenCode plugin은 JS/TS 코드가 OpenCode 이벤트에 붙어 동작을 확장하는 쪽에 가깝습니다. Claude Code plugin은 skills, agents, hooks, MCP 등을 묶어 배포하는 확장팩에 가깝습니다.

이 강의에서 말하는 plugin은 OpenCode 기준입니다. 다만 Harness의 핵심 실습은 plugin 제작이 아니라, project-local skill과 scripts/hooks를 이용한 작업 흐름 구성입니다.

## 5. 개발 환경 설정

교육은 실제 프로젝트 루트에서 진행하는 것이 가장 좋습니다. 다만 처음 수강할 때는 작은 샘플 프로젝트나 빈 repo에서 시작하는 편이 안전합니다.

시작 전에 다음을 확인합니다.

```powershell
opencode --version
git status --short --branch
python --version
java --version
```

기존 변경이 많은 상태에서 Harness를 설치하면 어떤 파일이 교육 중 생긴 것인지 구분하기 어렵습니다. 가능하면 clean worktree 또는 교육용 branch에서 시작합니다.
