# PART 3: Harness 세팅

## 1. 세팅 목표와 전체 흐름

Harness 세팅의 목표는 기존 프로젝트를 보존하면서 문서, 규칙, phase 실행 구조, safety hook을 추가하는 것입니다.

설치 흐름은 다음 순서로 진행합니다.

1. 대상 프로젝트 루트를 확인합니다.
2. 기존 파일을 조사합니다.
3. 템플릿에서 없는 파일을 복사합니다.
4. 이미 있는 파일은 덮어쓰지 않고 병합합니다.
5. 스크립트 문법 검사를 실행합니다.
6. 설치된 파일과 보존된 파일을 보고합니다.

## 2. 설치 전 점검

설치 전에는 프로젝트 루트에서 시작하고 있는지 확인합니다.

```powershell
git status --short --branch
Get-ChildItem -Force
```

다음 파일이나 디렉터리가 이미 있는지도 봅니다.

- `AGENTS.md`
- `docs/`
- `.opencode/`
- `scripts/`
- `phases/`

기존 파일이 있는 경우 Harness는 overwrite가 아니라 merge를 기본 원칙으로 삼습니다.

## 3. 설정 범위 설계: 전역 vs 프로젝트

전역 설정은 여러 프로젝트에서 공통으로 쓰는 개인/팀 환경에 적합합니다. 프로젝트 설정은 해당 repo 안에서만 적용되어야 하는 규칙에 적합합니다.

권장 기준:

- 팀 공통 사용 습관: 전역 설정 후보
- 프로젝트별 기술 규칙: 프로젝트 `AGENTS.md`
- 프로젝트별 작업 절차: `.opencode/skills/`
- 프로젝트별 검증 명령: `docs/ARCHITECTURE.md`와 phase 파일

처음 도입할 때는 프로젝트 내부에 최대한 명시적으로 두는 편이 교육과 리뷰에 유리합니다.

## 4. 설치에 필요한 Skills 준비

Harness 템플릿을 적용하기 전에 OpenCode가 사용할 보조 skill을 준비합니다.(다운받을수 있도록 세팅)

필수 skill:
- `build-opencode-harness`: Harness 구조를 설치하고 병합하는 skill
- `grill-me`: 빈 요구사항 문서를 질문으로 채우기 위한 skill


권장 설치 방식은 skill을 OpenCode skills dir에 넣는 것입니다.

```text
.opencode/
  skills/
    build-opencode-harness/
      SKILL.md
    grill-me/
      SKILL.md 
```
`https://github.com/tell-me-W/work_temp/tree/main/skill/build-opencode-harness`
`https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me` 


## 5. Harness 템플릿 적용

`build-opencode-harness`는 bundled template인 `assets/harness-template/`를 대상 프로젝트에 적용합니다.

생성되는 핵심 구조:

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
|       +-- harness/
|       |   +-- SKILL.md
|       +-- review/
|           +-- SKILL.md
+-- scripts/
|   +-- execute.py
|   +-- test_execute.py
|   +-- hooks/
|       +-- Harness.Common.ps1
|       +-- check.ps1
|       +-- pre_phase.ps1
|       +-- validate_phase.ps1
|       +-- post_phase.ps1
|       +-- tdd_guard.ps1
|       +-- dangerous_cmd_guard.ps1
|       +-- circuit_breaker.ps1
|       +-- pre_phase.py
|       +-- validate_phase.py
|       +-- post_phase.py
|       +-- tdd_guard.py
|       +-- dangerous_cmd_guard.py
|       +-- circuit_breaker.py
|   +-- success/
|       +-- ant_build.ps1
+-- phases/
    +-- _template/
        +-- index.json
        +-- 00-bootstrap.md
        +-- 10-plan.md
        +-- 20-implement.md
        +-- 30-review.md
        +-- 40-verify.md
        +-- state.json
```

주의할 점은 `.opencode/skills/`입니다. 이 Harness 템플릿은 project-local skills를 `.opencode/skills/<skill-name>/SKILL.md` 구조로 둡니다. 단수 `.opencode/skill/` 디렉터리나 Claude 전용 `commands/` 디렉터리를 만들지 않습니다.

## 6. `grill-me` Skill로 프로젝트 지식 채우기

`build-opencode-harness`의 핵심 설치 절차에는 `grill-me`가 직접 포함되어 있지는 않습니다. 다만 교육에서는 보조 단계로 유용합니다.

`grill-me` 방식은 문서를 질문으로 채우는 흐름입니다.

- PRD의 목표와 제외 범위가 비어 있는가? 내용이 맞는가?
- Architecture의 검증 명령이 실행 가능한가?
- ADR에 결정 이유와 tradeoff가 있는가?
- UI가 있다면 UI Guide가 필요한가?

이 단계의 목표는 완벽한 문서를 쓰는 것이 아니라, agent가 추측하지 않아도 될 만큼의 기준을 만드는 것입니다.

## 7. 설치 결과 검증

설치 후에는 파일이 생겼다는 것만 보지 말고, 실행 가능한 상태인지 확인합니다.

```powershell
python scripts/execute.py --help
python -m py_compile scripts/execute.py scripts/hooks/*.py
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/hooks/check.ps1
python -m pytest scripts/test_execute.py -q
```

`pytest`가 없는 환경에서는 마지막 명령을 생략할 수 있습니다. Windows에서는 PowerShell hook 검증을 먼저 확인하고, Python hook은 non-Windows 환경을 위한 portable fallback으로 유지합니다.

확인할 내용:

- 새로 설치된 파일
- 기존 내용이 보존된 파일
- 병합이 필요한 파일
- 수동 follow-up이 필요한 항목

설치 검증까지 끝나야 Harness 세팅이 완료된 것으로 봅니다.
