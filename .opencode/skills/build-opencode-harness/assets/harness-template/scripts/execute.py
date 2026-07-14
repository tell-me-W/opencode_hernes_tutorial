#!/usr/bin/env python3
import argparse
import json
from datetime import datetime, timezone
from pathlib import Path


VALID_STEP_TYPES = {"agent", "command", "verify"}


def utc_now():
    return datetime.now(timezone.utc).isoformat()


def read_json(path, default=None):
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    if default is not None:
        return default
    raise SystemExit(f"Missing JSON file: {path}")


def write_json(path, data):
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")


def initial_state(task_dir):
    return {
        "task": task_dir.name,
        "mode": "state-only",
        "approved_by_user": False,
        "current_phase": None,
        "completed": [],
        "blocked": None,
        "failures": [],
        "baseline_status": {},
        "commits": {},
        "steps": {},
    }


def read_state(task_dir):
    state = read_json(task_dir / "state.json", initial_state(task_dir))
    state["mode"] = "state-only"
    state.setdefault("approved_by_user", False)
    state.setdefault("current_phase", None)
    state.setdefault("completed", [])
    state.setdefault("blocked", None)
    state.setdefault("failures", [])
    state.setdefault("baseline_status", {})
    state.setdefault("commits", {})
    state.setdefault("steps", {})
    return state


def write_state(task_dir, state):
    state["updated_at"] = utc_now()
    state.setdefault("steps", {})
    write_json(task_dir / "state.json", state)


def phase_files(task_dir):
    return sorted(path for path in task_dir.glob("*.md") if path.name != "README.md")


def phase_id(path):
    return path.stem


def normalize_step(task_dir, raw):
    if isinstance(raw, str):
        raw = {"id": Path(raw).stem, "file": raw}
    if not isinstance(raw, dict):
        raise SystemExit(f"BLOCKED: invalid step entry: {raw!r}")

    step_id = raw.get("id") or Path(raw.get("file", "")).stem
    if not step_id:
        raise SystemExit(f"BLOCKED: step entry missing id/file: {raw!r}")

    step_type = raw.get("type", "command")
    if step_type not in VALID_STEP_TYPES:
        allowed = ", ".join(sorted(VALID_STEP_TYPES))
        raise SystemExit(f"BLOCKED: step {step_id} has invalid type {step_type!r}; expected one of: {allowed}")

    requires = raw.get("requires", [])
    success_hooks = raw.get("success_hooks", [])
    if isinstance(requires, str):
        requires = [requires]
    if isinstance(success_hooks, str):
        success_hooks = [success_hooks]
    if not isinstance(requires, list) or not isinstance(success_hooks, list):
        raise SystemExit(f"BLOCKED: step {step_id} requires/success_hooks must be strings or lists.")

    file_name = raw.get("file") or f"{step_id}.md"
    return {
        "id": step_id,
        "file": file_name,
        "path": task_dir / file_name,
        "type": step_type,
        "requires": requires,
        "success_hooks": success_hooks,
        "commit_after": bool(raw.get("commit_after", False)),
    }


def manifest_steps(task_dir):
    manifest_path = task_dir / "index.json"
    if not manifest_path.exists():
        return None

    manifest = read_json(manifest_path)
    steps = manifest.get("steps")
    if not isinstance(steps, list):
        raise SystemExit(f"BLOCKED: {manifest_path} must contain a steps list.")
    return [normalize_step(task_dir, raw) for raw in steps]


def load_steps(task_dir):
    steps = manifest_steps(task_dir)
    if steps is not None:
        return steps
    return [
        normalize_step(
            task_dir,
            {
                "id": phase_id(path),
                "file": path.name,
                "type": "command",
            },
        )
        for path in phase_files(task_dir)
    ]


def step_summary(step):
    return {
        "id": step["id"],
        "file": step["file"],
        "type": step["type"],
        "requires": step.get("requires", []),
        "success_hooks": step.get("success_hooks", []),
        "commit_after": step.get("commit_after", False),
        "exists": step["path"].exists(),
    }


def find_step(task_dir, step_id):
    for step in load_steps(task_dir):
        if step["id"] == step_id:
            return step
    raise SystemExit(f"BLOCKED: unknown step {step_id!r}")


def next_step(task_dir, state):
    completed = set(state.get("completed", []))
    for step in load_steps(task_dir):
        if step["id"] not in completed:
            return step
    return None


def initialize_step_state(state, step):
    steps_state = state.setdefault("steps", {})
    current = steps_state.setdefault(step["id"], {})
    current.update(
        {
            "file": step["file"],
            "type": step["type"],
            "requires": step.get("requires", []),
            "success_hooks": step.get("success_hooks", []),
            "commit_after": step.get("commit_after", False),
        }
    )
    return current


def mark_step(state, step, status, **extra):
    current = initialize_step_state(state, step)
    current["status"] = status
    current.update(extra)


def verify_step_file(step):
    if not step["path"].exists():
        raise SystemExit(f"BLOCKED: missing step file {step['path']}")


def verify_dependencies(step, completed):
    missing = [required for required in step.get("requires", []) if required not in completed]
    if missing:
        raise SystemExit(f"BLOCKED: step {step['id']} requires incomplete step(s): {', '.join(missing)}")


def require_approved(state):
    if not state.get("approved_by_user"):
        raise SystemExit("BLOCKED: phase design is not approved. Run approve only after explicit user approval.")


def status(task_dir):
    state = read_state(task_dir)
    step = next_step(task_dir, state)
    payload = {
        "task": task_dir.name,
        "mode": "state-only",
        "steps": [step_summary(step) for step in load_steps(task_dir)],
        "next_step": step_summary(step) if step else None,
        "state": state,
    }
    print(json.dumps(payload, indent=2, ensure_ascii=False))


def show_next(task_dir, command_name):
    state = read_state(task_dir)
    step = next_step(task_dir, state)
    payload = {
        "task": task_dir.name,
        "mode": "state-only",
        "command": command_name,
        "note": "execute.py manages state only; run the step with OpenCode, hooks, shell, or a human outside this script.",
        "approved_by_user": bool(state.get("approved_by_user")),
        "blocked": state.get("blocked"),
        "next_step": step_summary(step) if step else None,
    }
    print(json.dumps(payload, indent=2, ensure_ascii=False))


def approve(task_dir):
    state = read_state(task_dir)
    state["approved_by_user"] = True
    state["blocked"] = None
    write_state(task_dir, state)
    print(f"APPROVED: {task_dir}")


def start(task_dir, step_id=None, force=False, note=None):
    state = read_state(task_dir)
    require_approved(state)
    if state.get("blocked") and not force:
        raise SystemExit("BLOCKED: current state is blocked. Resolve it or pass --force to start anyway.")

    step = find_step(task_dir, step_id) if step_id else next_step(task_dir, state)
    if step is None:
        print("DONE: all steps completed")
        return
    verify_step_file(step)
    verify_dependencies(step, set(state.get("completed", [])))

    state["current_phase"] = step["id"]
    state["blocked"] = None
    mark_step(state, step, "running", started_at=utc_now(), note=note)
    write_state(task_dir, state)
    print(f"STARTED: {step['id']}")


def complete(task_dir, step_id=None, commit=None, no_changes=False, output_file=None, note=None):
    state = read_state(task_dir)
    require_approved(state)
    resolved_step_id = step_id or state.get("current_phase")
    if not resolved_step_id:
        step = next_step(task_dir, state)
    else:
        step = find_step(task_dir, resolved_step_id)
    if step is None:
        print("DONE: all steps completed")
        return

    verify_step_file(step)
    verify_dependencies(step, set(state.get("completed", [])))
    if step.get("commit_after") and not commit and not no_changes:
        raise SystemExit(f"BLOCKED: step {step['id']} has commit_after=true; pass --commit <hash> or --no-changes.")

    completed = state.setdefault("completed", [])
    if step["id"] not in completed:
        completed.append(step["id"])
    if state.get("current_phase") == step["id"]:
        state["current_phase"] = None
    state["blocked"] = None

    extra = {"completed_at": utc_now(), "note": note}
    if output_file:
        extra["output_file"] = output_file
    if commit:
        state.setdefault("commits", {})[step["id"]] = commit
        extra["commit"] = commit
    if no_changes:
        extra["commit_skipped_reason"] = "no changes"

    mark_step(state, step, "completed", **{key: value for key, value in extra.items() if value is not None})
    write_state(task_dir, state)
    print(f"COMPLETED: {step['id']}")


def record_failure(task_dir, status, step_id=None, reason=None, exit_code=None, output_file=None, note=None):
    state = read_state(task_dir)
    resolved_step_id = step_id or state.get("current_phase")
    if not resolved_step_id:
        step = next_step(task_dir, state)
        if step is None:
            raise SystemExit("BLOCKED: no current or next step to mark.")
    else:
        step = find_step(task_dir, resolved_step_id)

    failure = {
        "phase": step["id"],
        "status": status,
        "reason": reason or status,
        "recorded_at": utc_now(),
    }
    if exit_code is not None:
        failure["exit_code"] = exit_code
    if output_file:
        failure["output_file"] = output_file
    if note:
        failure["note"] = note

    state.setdefault("failures", []).append(failure)
    state["blocked"] = failure
    if state.get("current_phase") == step["id"]:
        state["current_phase"] = None
    mark_step(
        state,
        step,
        status,
        blocked_at=utc_now() if status == "blocked" else None,
        failed_at=utc_now() if status == "failed" else None,
        last_failure=failure,
    )
    current = state["steps"][step["id"]]
    current.pop("blocked_at", None) if status != "blocked" else None
    current.pop("failed_at", None) if status != "failed" else None
    write_state(task_dir, state)
    print(f"{status.upper()}: {step['id']}")


def main():
    parser = argparse.ArgumentParser(
        description="Manage OpenCode phase state without running agents, hooks, shell commands, or git."
    )
    parser.add_argument("task_dir", nargs="?", default="phases/_template")
    parser.add_argument(
        "command",
        nargs="?",
        choices=["status", "approve", "next", "run", "start", "complete", "fail", "block"],
        default="status",
    )
    parser.add_argument("--step", help="Step id for start, complete, fail, or block. Defaults to current/next step.")
    parser.add_argument("--reason", help="Failure or block reason.")
    parser.add_argument("--note", help="Optional human-readable note to store in state.")
    parser.add_argument("--output-file", help="External output artifact path to record.")
    parser.add_argument("--exit-code", type=int, help="External command or agent exit code to record.")
    parser.add_argument("--commit", help="Commit hash produced outside execute.py for commit_after steps.")
    parser.add_argument("--no-changes", action="store_true", help="Record that no commit was needed for this step.")
    parser.add_argument("--force", action="store_true", help="Allow start even when state.blocked is set.")
    args = parser.parse_args()

    task_dir = Path(args.task_dir)
    if not task_dir.exists():
        raise SystemExit(f"Missing task directory: {task_dir}")

    if args.command == "status":
        status(task_dir)
    elif args.command == "approve":
        approve(task_dir)
    elif args.command in {"next", "run"}:
        show_next(task_dir, args.command)
    elif args.command == "start":
        start(task_dir, step_id=args.step, force=args.force, note=args.note)
    elif args.command == "complete":
        complete(
            task_dir,
            step_id=args.step,
            commit=args.commit,
            no_changes=args.no_changes,
            output_file=args.output_file,
            note=args.note,
        )
    elif args.command == "fail":
        record_failure(
            task_dir,
            "failed",
            step_id=args.step,
            reason=args.reason,
            exit_code=args.exit_code,
            output_file=args.output_file,
            note=args.note,
        )
    elif args.command == "block":
        record_failure(
            task_dir,
            "blocked",
            step_id=args.step,
            reason=args.reason,
            exit_code=args.exit_code,
            output_file=args.output_file,
            note=args.note,
        )


if __name__ == "__main__":
    main()
