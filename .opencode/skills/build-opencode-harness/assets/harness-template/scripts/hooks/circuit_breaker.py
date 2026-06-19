#!/usr/bin/env python3
import json
import sys
from pathlib import Path


LIMIT = 5


def main():
    context = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8")) if len(sys.argv) > 1 else {}
    task_dir = Path(context.get("task_dir", ""))
    state_path = task_dir / "state.json"
    if not state_path.exists():
        print("circuit_breaker ok")
        return
    state = json.loads(state_path.read_text(encoding="utf-8"))
    failures = state.get("failures", [])
    current = failures[-1] if failures else None
    if not current:
        print("circuit_breaker ok")
        return
    same = [failure for failure in failures if failure.get("command") == current.get("command")]
    if len(same) >= LIMIT:
        raise SystemExit("BLOCKED: same failure repeated too often. Change strategy before retrying.")
    print("circuit_breaker ok")


if __name__ == "__main__":
    main()
