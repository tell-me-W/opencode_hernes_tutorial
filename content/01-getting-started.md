# Layer 1: `docs/` - 프로젝트의 뇌

`build-opencode-harness` skill 기준으로 Harness는 네 개의 층으로 구성됩니다.

[build-opencode-harness skill 다운로드 (.zip)](downloads/build-opencode-harness.zip)

## 1. Layer 1의 역할

Harness의 첫 번째 레이어는 `docs/`입니다. 이 폴더는 보기 좋은 문서 보관함이 아니라, OpenCode agent가 작업 전에 읽고 판단 기준으로 삼는 프로젝트의 뇌입니다.

Agent는 현재 코드만 보면 의도를 추측합니다. `docs/`가 있으면 무엇을 만들지, 어디까지 만들지, 어떤 구조를 지켜야 하는지, 왜 그런 결정을 했는지를 먼저 확인할 수 있습니다.

기본 문서는 네 가지입니다.

- `docs/PRD.md`: 무엇을 만들지
- `docs/ARCHITECTURE.md`: 어떻게 만들지
- `docs/ADR.md`: 왜 이렇게 만들지
- `docs/UI_GUIDE.md`: 어떻게 보여야 하는지

## 2. `PRD.md`: 무엇을 만드는지

`PRD.md`는 제품 요구사항과 범위를 정의합니다. Harness에서 가장 중요한 항목은 MVP scope와 MVP exclusions입니다.

포함하면 좋은 내용:

- 목표와 사용자
- 핵심 기능
- MVP 범위
- 이번에 만들지 않을 것
- 성공 기준

`MVP Exclusions`가 비어 있으면 agent는 좋은 의도로 기능을 계속 추가할 수 있습니다. "이건 안 만든다"는 문장이 "이걸 만든다"만큼 중요합니다.

## 3. `ARCHITECTURE.md`: 어떻게 만드는지

`ARCHITECTURE.md`는 코드가 놓일 자리와 검증 방법을 정리합니다.

포함하면 좋은 내용:

- 시스템 개요
- 모듈 경계
- 데이터 흐름
- 빌드 명령
- 테스트 명령
- 금지하거나 선호하는 패턴

Agent가 새 폴더 구조나 새 라이브러리를 제안할 때 이 문서가 판단 기준이 됩니다.

## 4. `ADR.md`와 `UI_GUIDE.md`: 결정과 표현

`ADR.md`는 결정의 이유를 남깁니다. 단순히 "무엇을 선택했다"가 아니라, 어떤 대안과 tradeoff를 받아들였는지를 적습니다.

`UI_GUIDE.md`는 UI가 있는 프로젝트에서 화면, 컴포넌트, 상호작용 기준을 잡습니다. UI가 없으면 생략하거나 "not applicable"로 둘 수 있습니다.

작업 전 기본 참조 순서는 다음과 같습니다.

```text
AGENTS.md
docs/PRD.md
docs/ARCHITECTURE.md
docs/ADR.md
docs/UI_GUIDE.md
current phase file
```

## 5. `grill-me` Skill로 프로젝트 지식 채우기

`build-opencode-harness`의 핵심 설치 절차에는 `grill-me`가 직접 포함되어 있지는 않습니다. 다만 교육에서는 보조 단계로 유용합니다.

`grill-me` 방식은 문서를 질문으로 채우는 흐름입니다.

- PRD의 목표와 제외 범위가 비어 있는가? 내용이 맞는가?
- Architecture의 검증 명령이 실행 가능한가?
- ADR에 결정 이유와 tradeoff가 있는가?
- UI가 있다면 UI Guide가 필요한가?

이 단계의 목표는 완벽한 문서를 쓰는 것이 아니라, agent가 추측하지 않아도 될 만큼의 기준을 만드는 것입니다.

`make-phase`는 이미 있는 지식을 phase로 쪼개는 도구에 가깝고, `grill-me`는 그 전에 비어 있는 지식을 드러내는 보조 도구입니다. 따라서 둘은 경쟁 관계가 아니라 순서가 다릅니다.
