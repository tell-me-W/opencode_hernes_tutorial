# Layer 3-1: 실행 엔진 세팅

## 1. Layer 3의 역할

세 번째 레이어는 `.opencode/skills/`, `scripts/execute.py`, `phases/`입니다. 이 레이어가 요구사항을 phase로 만들고, 승인된 phase를 순서대로 실행합니다.

역할은 세 가지로 나뉩니다.

- `make-phase`: 요구사항을 phase 디렉터리로 변환
- `run-phase`: 승인된 phase 실행 흐름 안내
- `scripts/execute.py`: step manifest, state, hooks, retries, OpenCode agent 호출 관리

## 2. 설치 결과 구조

`build-opencode-harness`는 기존 프로젝트를 보존하면서 필요한 파일만 추가하거나 병합합니다.

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
|       +-- make-phase/
|       +-- run-phase/
+-- scripts/
|   +-- execute.py
|   +-- hooks/
|   +-- success/
+-- phases/
    +-- _template/
        +-- index.json
        +-- state.json
```

단수 `.opencode/skill/` 디렉터리나 Claude 전용 `.claude/commands/` 디렉터리는 만들지 않습니다.

## 3. `make-phase`: phase 생성

`make-phase`는 사용자 요구사항과 프로젝트 문서를 읽어 `phases/{task-name}/` 아래에 작은 작업 계약을 만듭니다.

생성하는 핵심 파일:

- `index.json`: 실행할 step manifest
- `*.md`: 각 step의 목표, 입력, 지시사항, 완료 기준, 검증 방법
- `state.json`: 승인 여부, 완료 step, 실패와 blocked 상태

`make-phase`는 실행하지 않습니다. phase 설계까지만 만들고, 사용자가 범위와 done criteria를 승인해야 다음 단계로 넘어갑니다.

## 4. `run-phase`와 `execute.py`: phase 실행

`run-phase`는 승인된 phase 디렉터리를 대상으로 `scripts/execute.py` 실행 흐름을 안내합니다.

기본 명령:

```powershell
python scripts/execute.py phases/todo-items status
python scripts/execute.py phases/todo-items approve
python scripts/execute.py phases/todo-items run
python scripts/execute.py phases/todo-items run --max-retries 3
python scripts/execute.py phases/todo-items run --git-commits
```

`execute.py run`은 승인된 phase에서 다음 incomplete step을 찾습니다. `agent` step은 기본적으로 `opencode run`으로 실행하고, `command`와 `verify` step은 phase 파일의 command block을 실행합니다.

## 5. 설치 검증

설치 후에는 파일이 생겼는지만 보지 말고 실행 가능한 상태인지 확인합니다.

```powershell
python scripts/execute.py --help
python -m py_compile scripts/execute.py scripts/hooks/*.py
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/hooks/check.ps1
```

여기서는 사용자가 실제로 설치 후 확인할 명령만 다룹니다. Runner 자체의 회귀 테스트 파일은 템플릿 내부 품질 보증용이므로 튜토리얼 흐름에서는 설명하지 않습니다.
