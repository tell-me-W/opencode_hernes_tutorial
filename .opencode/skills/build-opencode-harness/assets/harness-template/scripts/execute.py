#!/usr/bin/env python3
import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path.cwd()


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


def read_state(task_dir):
    return read_json(
        task_dir / "state.json",
        {
            "task": task_dir.name,
            "mode": "agent-executes-alone",
            "approved_by_user": False,
            "current_phase": None,
            "completed": [],
            "blocked": None,
            "failures": [],
            "baseline_status": {},
            "commits": {},
            "steps": {},
        },
    )


def write_state(task_dir, state):
    state["updated_at"] = utc_now()
    state.setdefault("steps", {})
    write_json(task_dir / "state.json", state)


def phase_files(task_dir):
    return sorted(path for path in task_dir.glob("*.md") if path.name != "README.md")


def phase_id(path):
    return path.stem


def manifest_steps(task_dir):
    manifest_path = task_dir / "index.json"
    if not manifest_path.exists():
        return None

    manifest = read_json(manifest_path)
    steps = manifest.get("steps")
    if not isinstance(steps, list):
        raise SystemExit(f"BLOCKED: {manifest_path} must contain a steps list.")

    normalized = []
    for raw in steps:
        if isinstance(raw, str):
            raw = {"id": Path(raw).stem, "file": raw}
        if not isinstance(raw, dict):
            raise SystemExit(f"BLOCKED: invalid step entry in {manifest_path}: {raw!r}")

        step_id = raw.get("id") or Path(raw.get("file", "")).stem
        if not step_id:
            raise SystemExit(f"BLOCKED: step entry missing id/file in {manifest_path}: {raw!r}")

        file_name = raw.get("file") or f"{step_id}.md"
        step = {
            "id": step_id,
            "file": file_name,
            "path": task_dir / file_name,
            "type": raw.get("type", "command"),
            "requires": raw.get("requires", []),
            "success_hooks": raw.get("success_hooks", []),
            "commit_after": bool(raw.get("commit_after", False)),
        }
        if isinstance(step["requires"], str):
            step["requires"] = [step["requires"]]
        if isinstance(step["success_hooks"], str):
            step["success_hooks"] = [step["success_hooks"]]
        normalized.append(step)
    return normalized


def load_steps(task_dir):
    steps = manifest_steps(task_dir)
    if steps is not None:
        return steps
    return [
        {
            "id": phase_id(path),
            "file": path.name,
            "path": path,
            "type": "command",
            "requires": [],
            "success_hooks": [],
            "commit_after": False,
        }
        for path in phase_files(task_dir)
    ]


def run_script(script_dir, name, context, required=False):
    ps_hook = script_dir / f"{name}.ps1"
    py_hook = script_dir / f"{name}.py"
    hook = ps_hook if os.name == "nt" and ps_hook.exists() else py_hook
    if not hook.exists():
        if required:
            raise SystemExit(f"BLOCKED: missing script {script_dir / name}")
        return
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", suffix=".json", delete=False) as handle:
        json.dump(context, handle)
        context_path = handle.name
    try:
        if hook.suffix == ".ps1":
            powershell = shutil.which("pwsh") or shutil.which("powershell") or shutil.which("powershell.exe")
            if not powershell:
                raise SystemExit(f"BLOCKED: PowerShell is required to run {hook}")
            subprocess.run(
                [
                    powershell,
                    "-NoProfile",
                    "-ExecutionPolicy",
                    "Bypass",
                    "-File",
                    str(hook),
                    context_path,
                ],
                cwd=ROOT,
                check=True,
            )
        else:
            subprocess.run([sys.executable, str(hook), context_path], cwd=ROOT, check=True)
    finally:
        Path(context_path).unlink(missing_ok=True)


def run_hook(name, context):
    run_script(ROOT / "scripts" / "hooks", name, context)


def run_success_hook(name, context):
    run_script(ROOT / "scripts" / "success", name, context, required=True)


def extract_command_blocks(markdown):
    commands = []
    in_block = False
    lang = ""
    block = []
    for line in markdown.splitlines():
        if line.startswith("```"):
            marker = line.strip().strip("`").strip()
            if not in_block:
                lang = marker
                in_block = True
                block = []
            else:
                if lang in {"bash", "sh", "powershell", "pwsh", "cmd"}:
                    commands.append((lang, "\n".join(block).strip()))
                in_block = False
                lang = ""
            continue
        if in_block:
            block.append(line)
    return [(lang, command) for lang, command in commands if command]


def run_command_block(lang, command):
    if lang in {"powershell", "pwsh"}:
        shell = "powershell" if lang == "powershell" else "pwsh"
        return subprocess.run([shell, "-NoProfile", "-Command", command], cwd=ROOT)
    if lang == "cmd":
        return subprocess.run(["cmd.exe", "/c", command], cwd=ROOT)
    return subprocess.run(command, cwd=ROOT, shell=True)


def run_git(args, check=False):
    return subprocess.run(
        ["git", *args],
        cwd=ROOT,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        check=check,
    )


def git_available():
    try:
        return run_git(["rev-parse", "--is-inside-work-tree"]).returncode == 0
    except FileNotFoundError:
        return False


def checkout_branch(task_dir, branch_prefix):
    if not branch_prefix:
        return
    if not git_available():
        raise SystemExit("BLOCKED: --branch-prefix requires a git repository.")

    branch_name = f"{branch_prefix.rstrip('/')}/{task_dir.name}"
    current = run_git(["branch", "--show-current"], check=True).stdout.strip()
    if current == branch_name:
        return

    existing = run_git(["rev-parse", "--verify", branch_name])
    if existing.returncode == 0:
        run_git(["checkout", branch_name], check=True)
    else:
        run_git(["checkout", "-b", branch_name], check=True)


def commit_step(step):
    if not git_available():
        raise SystemExit("BLOCKED: --git-commits requires a git repository.")

    status = run_git(["status", "--porcelain"], check=True).stdout.strip()
    if not status:
        print(f"git commit skipped: no changes for {step['id']}")
        return

    for line in status.splitlines():
        path = line[3:].strip()
        if " -> " in path:
            path = path.split(" -> ", 1)[1]
        if path:
            run_git(["add", "--", path], check=True)
    message = f"harness: complete {step['id']}"
    run_git(["commit", "-m", message], check=True)
    print(message)


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


def status(task_dir):
    state = read_state(task_dir)
    steps = [
        {
            "id": step["id"],
            "file": step["file"],
            "type": step["type"],
            "requires": step.get("requires", []),
            "success_hooks": step.get("success_hooks", []),
            "commit_after": step.get("commit_after", False),
        }
        for step in load_steps(task_dir)
    ]
    print(json.dumps({"task": task_dir.name, "steps": steps, "state": state}, indent=2))


def next_step(task_dir, state):
    completed = set(state.get("completed", []))
    for step in load_steps(task_dir):
        if step["id"] not in completed:
            return step
    return None


def verify_dependencies(step, completed):
    missing = [required for required in step.get("requires", []) if required not in completed]
    if missing:
        raise SystemExit(
            f"BLOCKED: step {step['id']} requires incomplete step(s): {', '.join(missing)}"
        )


def execute_step(task_dir, state, step, max_retries, git_commits):
    if not step["path"].exists():
        raise SystemExit(f"BLOCKED: missing step file {step['path']}")

    completed = set(state.get("completed", []))
    verify_dependencies(step, completed)

    context = {"task_dir": str(task_dir), "phase": step["id"], "phase_file": str(step["path"])}
    state["current_phase"] = step["id"]
    state["blocked"] = None
    mark_step(state, step, "running", started_at=utc_now(), attempts=0)
    write_state(task_dir, state)

    run_hook("pre_phase", context)
    run_hook("validate_phase", context)

    if step["type"] == "agent":
        failure = {"phase": step["id"], "reason": "agent step requires external agent execution"}
        state.setdefault("failures", []).append(failure)
        state["blocked"] = failure
        mark_step(state, step, "blocked", blocked_at=utc_now(), reason=failure["reason"])
        write_state(task_dir, state)
        raise SystemExit("BLOCKED: agent step requires agent execution outside scripts/execute.py.")

    markdown = step["path"].read_text(encoding="utf-8")
    commands = extract_command_blocks(markdown)
    run_hook("dangerous_cmd_guard", {**context, "commands": [command for _, command in commands]})

    print(f"STEP: {step['id']} ({step['type']})")
    print(step["path"])

    attempts = 0
    while attempts < max_retries:
        attempts += 1
        mark_step(state, step, "running", attempts=attempts)
        write_state(task_dir, state)

        failed = None
        for lang, command in commands:
            result = run_command_block(lang, command)
            if result.returncode != 0:
                failed = {
                    "phase": step["id"],
                    "command": command,
                    "exit_code": result.returncode,
                    "attempt": attempts,
                }
                break

        if failed is None:
            for success_hook in step.get("success_hooks", []):
                try:
                    run_success_hook(
                        success_hook,
                        {**context, "success_hook": success_hook, "step": step["id"]},
                    )
                except subprocess.CalledProcessError as error:
                    failed = {
                        "phase": step["id"],
                        "hook": f"success:{success_hook}",
                        "exit_code": error.returncode,
                        "attempt": attempts,
                    }
                    break

        if failed is None:
            try:
                run_hook("post_phase", context)
            except subprocess.CalledProcessError as error:
                failed = {
                    "phase": step["id"],
                    "hook": "post_phase",
                    "exit_code": error.returncode,
                    "attempt": attempts,
                }

        if failed is None:
            state.setdefault("completed", []).append(step["id"])
            state["current_phase"] = None
            mark_step(
                state,
                step,
                "completed",
                attempts=attempts,
                completed_at=utc_now(),
            )
            write_state(task_dir, state)
            if git_commits:
                commit_step(step)
            return

        state.setdefault("failures", []).append(failed)
        state["blocked"] = failed
        mark_step(state, step, "failed", attempts=attempts, last_failure=failed)
        write_state(task_dir, state)

        if attempts >= max_retries:
            run_hook("circuit_breaker", {**context, "failure": failed})
            raise SystemExit(failed["exit_code"])

        print(f"retrying {step['id']}: attempt {attempts + 1}/{max_retries}")


def run(task_dir, max_retries, git_commits, branch_prefix):
    state = read_state(task_dir)
    if not state.get("approved_by_user"):
        raise SystemExit("BLOCKED: phase design is not approved. Set approved_by_user=true after user approval.")

    checkout_branch(task_dir, branch_prefix)
    if git_commits and git_available():
        baseline = run_git(["status", "--porcelain"], check=True).stdout.strip()
        if baseline:
            raise SystemExit(
                "BLOCKED: --git-commits requires a clean worktree before running. "
                "Commit, stash, or exclude existing changes first."
            )

    while True:
        step = next_step(task_dir, state)
        if step is None:
            state["current_phase"] = None
            state["blocked"] = None
            write_state(task_dir, state)
            print("DONE: all steps completed")
            return

        execute_step(task_dir, state, step, max_retries=max_retries, git_commits=git_commits)
        state = read_state(task_dir)


def mark_approved(task_dir):
    state = read_state(task_dir)
    state["approved_by_user"] = True
    write_state(task_dir, state)
    print(f"APPROVED: {task_dir}")


def main():
    parser = argparse.ArgumentParser(description="Run an OpenCode phase harness.")
    parser.add_argument("task_dir", nargs="?", default="phases/_template")
    parser.add_argument("command", nargs="?", choices=["run", "status", "approve"], default="run")
    parser.add_argument("--max-retries", type=int, default=1, help="Total attempts per step.")
    parser.add_argument(
        "--git-commits",
        action="store_true",
        help="Commit step changes after each completed step; requires a clean worktree before run starts.",
    )
    parser.add_argument("--branch-prefix", help="Checkout or create <prefix>/<task-name> before running.")
    args = parser.parse_args()

    if args.max_retries < 1:
        raise SystemExit("--max-retries must be at least 1")

    task_dir = Path(args.task_dir)
    if not task_dir.exists():
        raise SystemExit(f"Missing task directory: {task_dir}")

    if args.command == "status":
        status(task_dir)
    elif args.command == "approve":
        mark_approved(task_dir)
    else:
        run(
            task_dir,
            max_retries=args.max_retries,
            git_commits=args.git_commits,
            branch_prefix=args.branch_prefix,
        )


if __name__ == "__main__":
    main()
