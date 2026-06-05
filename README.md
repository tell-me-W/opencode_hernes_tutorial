# OpenCode Harness Tutorial

사내에서 `build-opencode-harness` skill을 공유하고, 팀원이 단계별로 OpenCode harness를 설치해 운영할 수 있게 만든 GitHub Pages 교육 사이트입니다.

현재 커리큘럼은 준비, OpenCode 핵심 개념, skill 설치, Project Brain 작성, phase 설계, runner, safety hooks, review, troubleshooting, 실습, 강사용 진행안, 팀 rollout까지 포함합니다.

## 구성

- `index.html`: 정적 문서 앱의 HTML shell
- `styles.css`: 좌측 커리큘럼, 본문, 우측 목차 레이아웃
- `app.js`: 커리큘럼 챕터 데이터와 라우팅/search 렌더링
- `.github/workflows/pages.yml`: GitHub Pages 배포 workflow
- `scripts/validate-site.ps1`: 필수 파일과 챕터를 검증하는 로컬 체크

## 로컬 확인

브라우저에서 `index.html`을 열면 바로 볼 수 있습니다. 파일 링크로 열어도 동작하도록 외부 패키지와 빌드 도구를 쓰지 않았습니다.

정적 서버로 확인하려면:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

검증:

```powershell
.\scripts\validate-site.ps1
```

## 배포

이 repo의 Pages source를 `GitHub Actions`로 설정한 뒤 `main` branch에 push하면 `.github/workflows/pages.yml`이 정적 파일을 배포합니다.

예상 URL:

```text
https://tell-me-w.github.io/opencode_hernes_tutorial/
```
