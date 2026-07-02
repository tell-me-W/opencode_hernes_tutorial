# build-opencode-harness ZIP 다운로드 설계

## 목표

부서 배포용 OpenCode Harness 튜토리얼의 `PART 1: 시작하기`에서 사용자가 `build-opencode-harness` 스킬 전체를 ZIP 파일로 바로 내려받을 수 있게 한다.

## 다운로드 파일

- 경로: `downloads/build-opencode-harness.zip`
- ZIP 최상위 디렉터리: `build-opencode-harness/`
- 원본: 프로젝트의 `.opencode/skills/build-opencode-harness/`
- 포함 항목: `SKILL.md`, `assets/` 및 현재 원본에 존재하는 기타 스킬 파일
- 제외 항목: 의도적으로 삭제된 `agents/openai.yaml`

ZIP 안의 Harness 템플릿에는 프로젝트 바깥쪽 버전과 내용이 일치하는 `make-phase`와 `run-phase`를 포함한다.

## 페이지 변경

`PART 1: 시작하기`의 다음 문장 바로 아래에 다운로드 안내를 둔다.

> `build-opencode-harness` skill 기준으로 Harness는 네 개의 층으로 구성됩니다.

안내에는 파일 형식이 ZIP임을 명시하고 `downloads/build-opencode-harness.zip`을 직접 가리키는 링크를 제공한다. 기존 Markdown 렌더러가 외부 링크처럼 새 탭을 열지 않고 브라우저 다운로드를 시작할 수 있도록 로컬 ZIP 링크를 안전하게 렌더링한다.

## 검증

- ZIP 파일이 사이트 배포 대상 경로에 존재한다.
- ZIP을 열었을 때 `build-opencode-harness/SKILL.md`와 Harness 템플릿이 존재한다.
- ZIP 내부의 `make-phase`와 `run-phase`가 프로젝트 바깥쪽 기준본과 일치한다.
- `agents/openai.yaml`은 ZIP에 존재하지 않는다.
- 정적 사이트 검증 스크립트가 다운로드 파일과 PART 1 링크를 검사한다.
- 기존 정적 사이트 검증이 통과한다.

## 범위 제외

- 자동 설치 프로그램 제공
- GitHub Release 생성
- 기존 튜토리얼 본문 개편
