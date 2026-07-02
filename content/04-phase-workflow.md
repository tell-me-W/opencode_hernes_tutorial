# Layer 3: `make-phase` / `run-phase` / `execute.py`

## 1. Phase 파일 구조

Phase는 agent에게 주는 작은 작업 계약입니다. 너무 많은 일을 담지 않고 완료 여부를 검증할 수 있어야 합니다.

각 phase 파일에는 다음 항목이 들어갑니다.

- `Goal`
- `Inputs`
- `Instructions`
- `Out of Scope`
- `Done Criteria`
- `Verification`

작업 파일은 `phases/` 바로 아래가 아니라 `phases/{task-name}/` 아래에 둡니다.

## 2. `index.json`과 `state.json`

`index.json`은 실행할 step manifest입니다.

```json
{
  "steps": [
    {
      "id": "20-implement",
      "file": "20-implement.md",
      "type": "agent",
      "requires": ["10-plan"],
      "success_hooks": [],
      "commit_after": true
    }
  ]
}
```

`state.json`은 승인 여부, 현재 step, 완료된 step, 실패와 blocked 상태를 기록합니다. `approved_by_user`가 `false`이면 runner는 실행하지 않습니다.

## 3. Step type

Step type은 실행 책임을 나눕니다.

| type | 동작 |
| --- | --- |
| `agent` | 승인된 phase 파일을 prompt로 만들어 `opencode run`을 호출 |
| `command` | phase 파일의 shell command block 실행 |
| `verify` | 검증 command block 실행 |

`agent` step은 각 step마다 새 `opencode run` 호출로 실행됩니다. 출력은 `phases/{task-name}/agent-output/{step-id}.jsonl`에 저장하고, 결과는 `state.json`에 기록합니다.

## 4. `execute.py run` 흐름

`execute.py`의 기본 흐름은 다음과 같습니다.

1. `state.json`을 읽고 승인 여부를 확인합니다.
2. `index.json`에서 다음 incomplete step을 찾습니다.
3. `pre_phase`와 `validate_phase` hook을 실행합니다.
4. `agent` step이면 `opencode run <prompt> --format json --dir <project-root>`를 실행합니다.
5. `command` 또는 `verify` step이면 command block을 실행합니다.
6. 성공 hook과 `post_phase` hook을 실행합니다.
7. 완료, 실패, blocked 상태를 `state.json`에 기록합니다.

`--agent-runner none`을 주면 agent step을 자동 수행하지 않고 기존처럼 external agent execution required 상태로 멈춥니다.

## 5. Commit과 안전 조건

개발 관련 step은 `commit_after: true`를 사용합니다. 자동 agent 실행에서 이 값이 true이면 `--git-commits` 없이 실행할 수 없습니다.

이 제한은 agent가 파일을 바꿨는데 commit 없이 완료 처리되는 일을 막기 위한 장치입니다.

권한 자동 승인은 기본으로 꺼져 있습니다. 꼭 필요한 경우에만 다음 옵션을 명시합니다.

```powershell
python scripts/execute.py phases/todo-items run --dangerously-skip-permissions
```

이 옵션은 OpenCode의 `--dangerously-skip-permissions`로 전달되며, 기본값으로 켜지지 않습니다.
