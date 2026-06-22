# PART 6: 실전 워크플로우

## 1. 요구사항을 Phase로 변환하기

요구사항은 바로 구현하지 않고 phase로 변환합니다. 기준은 "agent가 한 번에 안전하게 끝낼 수 있는 크기인가"입니다.

예시:

```text
요구사항:
사용자는 TODO를 추가하고 완료 처리할 수 있어야 한다.

Phase:
00-bootstrap: 문서와 범위 확인
10-plan: 구현 계획과 파일 범위 정리
20-test: 실패하는 도메인 테스트 작성
30-implement: 테스트를 통과하는 최소 구현
40-verify: 테스트, 빌드, 수동 검증
```

`make-phase`는 이 구조를 `phases/{task-name}/` 아래의 step manifest와 phase 파일로 만듭니다.

## 2. 빠진 조건 채우기

요구사항이 흐릿하면 바로 구현하지 않습니다. 먼저 빠진 조건을 질문으로 채웁니다.

확인할 질문:

- 사용자는 누구인가?
- 성공 기준은 무엇인가?
- 이번에 만들지 않을 것은 무엇인가?
- 자동 검증과 수동 검증은 각각 무엇인가?
- 보안, 권한, 데이터 손실 위험이 있는가?

답은 `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/ADR.md`, phase 파일에 반영합니다.

## 3. 승인 후 실행하기

phase가 준비되면 사용자가 범위와 done criteria를 승인합니다. 그 다음 `run-phase` 또는 runner 명령으로 실행합니다.

```powershell
python scripts/execute.py phases/todo-list status
python scripts/execute.py phases/todo-list approve
python scripts/execute.py phases/todo-list run --max-retries 3 --git-commits
```

승인된 `agent` step은 기본적으로 `opencode run`으로 자동 수행됩니다. `commit_after: true`인 step은 `--git-commits`가 필요합니다.

## 4. 실패와 blocked 처리

실패가 발생하면 같은 명령을 무작정 반복하지 않습니다.

확인 순서:

1. 어떤 step에서 실패했는지 봅니다.
2. `state.json.failures`와 `blocked`를 확인합니다.
3. hook 실패인지, OpenCode 실행 실패인지, 검증 명령 실패인지 구분합니다.
4. done criteria가 현실적인지 확인합니다.
5. 필요하면 phase를 수정하고 다시 승인받습니다.

Credential, destructive approval, 문서 충돌, CRITICAL 규칙 충돌이 있으면 agent가 임의로 우회하지 않고 사용자에게 돌아와야 합니다.

## 5. Project Brain과 State 업데이트

작업 중 바뀐 사실은 문서와 state에 남깁니다.

- 요구사항 변경: `docs/PRD.md`
- 구조 변경: `docs/ARCHITECTURE.md`
- 의사결정 변경: `docs/ADR.md`
- UI 규칙 변경: `docs/UI_GUIDE.md`
- 실행 순서 변경: `phases/{task-name}/index.json`
- 진행 상태 변경: `phases/{task-name}/state.json`

Harness의 최종 목표는 한 번의 작업을 끝내는 데서 멈추지 않습니다. 다음 agent가 이어받아도 같은 기준으로 판단할 수 있게 만드는 것입니다.
