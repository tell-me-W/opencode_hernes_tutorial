#!/usr/bin/env python3
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import pytest


TEMPLATE_ROOT = Path(__file__).resolve().parents[1]


@pytest.fixture
def project_root():
    scratch_root = TEMPLATE_ROOT / ".pytest-tmp"
    scratch_root.mkdir(exist_ok=True)
    path = Path(tempfile.mkdtemp(prefix="project-", dir=scratch_root))
    try:
        yield path
    finally:
        shutil.rmtree(path, ignore_errors=True)


def copy_runner(project_root):
    scripts_dir = project_root / "scripts"
    scripts_dir.mkdir()
    shutil.copy(TEMPLATE_ROOT / "scripts" / "execute.py", scripts_dir / "execute.py")


def write_task(project_root, *, step_type="agent", commit_after=False):
    task_dir = project_root / "phases" / "demo"
    task_dir.mkdir(parents=True)
    step = {
        "id": "10-step",
        "file": "10-step.md",
        "type": step_type,
        "requires": [],
        "success_hooks": [],
    }
    if commit_after:
        step["commit_after"] = True
    (task_dir / "index.json").write_text(
        json.dumps({"steps": [step]}, indent=2),
        encoding="utf-8",
    )
    (task_dir / "state.json").write_text(
        json.dumps(
            {
                "task": "demo",
                "mode": "opencode-orchestrated",
                "approved_by_user": True,
                "current_phase": None,
                "completed": [],
                "blocked": None,
                "failures": [],
                "baseline_status": {},
                "commits": {},
                "steps": {},
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    (task_dir / "10-step.md").write_text(
        "\n".join(
            [
                "# Goal",
                "Run the agent step.",
                "# Inputs",
                "- AGENTS.md",
                "# Instructions",
                "Write a short result.",
                "# Done Criteria",
                "- The step completed.",
                "# Verification",
                "Manual verification.",
                "",
            ]
        ),
        encoding="utf-8",
    )
    return task_dir


def write_command_task(project_root):
    task_dir = write_task(project_root, step_type="command")
    (task_dir / "10-step.md").write_text(
        "\n".join(
            [
                "# Goal",
                "Run command.",
                "# Inputs",
                "- none",
                "# Instructions",
                "Run command.",
                "# Done Criteria",
                "- Command succeeded.",
                "# Verification",
                "```bash",
                f'"{sys.executable}" -c "from pathlib import Path; Path(\'command-ran.txt\').write_text(\'ok\', encoding=\'utf-8\')"',
                "```",
                "",
            ]
        ),
        encoding="utf-8",
    )
    return task_dir


def write_mock_opencode(bin_dir, *, exit_code=0):
    bin_dir.mkdir()
    if os.name == "nt":
        primary = bin_dir / "opencode.cmd"
        script_text = "\n".join(
            [
                "@echo off",
                "echo {\"event\":\"done\"}",
                f"exit /b {exit_code}",
                "",
            ]
        )
        for script in [bin_dir / "opencode.cmd", bin_dir / "opencode.bat"]:
            script.write_text(script_text, encoding="utf-8")
    else:
        primary = bin_dir / "opencode"
        primary.write_text(
            "\n".join(
                [
                    "#!/usr/bin/env sh",
                    "printf '%s\\n' \"$*\" > \"$OPENCODE_ARGS_FILE\"",
                    "printf '%s\\n' '{\"event\":\"done\"}'",
                    f"exit {exit_code}",
                    "",
                ]
            ),
            encoding="utf-8",
        )
        primary.chmod(0o755)
    return primary


def run_execute(project_root, *args, extra_env=None):
    env = os.environ.copy()
    if extra_env:
        env.update(extra_env)
    return subprocess.run(
        [sys.executable, "scripts/execute.py", *args],
        cwd=project_root,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=env,
        check=False,
    )


def test_agent_step_runs_opencode_by_default(project_root):
    copy_runner(project_root)
    write_task(project_root)
    args_file = project_root / "opencode-args.txt"
    bin_dir = project_root / "bin"
    opencode_bin = write_mock_opencode(bin_dir)

    result = run_execute(
        project_root,
        "phases/demo",
        "run",
        extra_env={
            "PATH": f"{bin_dir}{os.pathsep}{os.environ['PATH']}",
            "OPENCODE_BIN": str(opencode_bin),
            "HARNESS_AGENT_COMMAND_LOG": str(args_file),
        },
    )

    assert result.returncode == 0, result.stderr + result.stdout
    args = args_file.read_text(encoding="utf-8")
    assert "run" in args
    assert "--format json" in args
    assert "--dir" in args
    assert "--dangerously-skip-permissions" not in args
    output_file = project_root / "phases" / "demo" / "agent-output" / "10-step.jsonl"
    assert output_file.read_text(encoding="utf-8").strip() == '{"event":"done"}'
    state = json.loads((project_root / "phases" / "demo" / "state.json").read_text(encoding="utf-8"))
    assert state["completed"] == ["10-step"]
    assert state["steps"]["10-step"]["agent_runner"] == "opencode"
    assert state["steps"]["10-step"]["output_file"] == "agent-output/10-step.jsonl"


def test_agent_runner_none_blocks_agent_steps(project_root):
    copy_runner(project_root)
    write_task(project_root)

    result = run_execute(project_root, "phases/demo", "run", "--agent-runner", "none")

    assert result.returncode != 0
    state = json.loads((project_root / "phases" / "demo" / "state.json").read_text(encoding="utf-8"))
    assert state["blocked"]["reason"] == "agent step requires external agent execution"
    assert state["steps"]["10-step"]["status"] == "blocked"


def test_commit_after_agent_requires_git_commits(project_root):
    copy_runner(project_root)
    write_task(project_root, commit_after=True)
    args_file = project_root / "opencode-args.txt"
    bin_dir = project_root / "bin"
    opencode_bin = write_mock_opencode(bin_dir)

    result = run_execute(
        project_root,
        "phases/demo",
        "run",
        extra_env={
            "PATH": f"{bin_dir}{os.pathsep}{os.environ['PATH']}",
            "OPENCODE_BIN": str(opencode_bin),
            "HARNESS_AGENT_COMMAND_LOG": str(args_file),
        },
    )

    assert result.returncode != 0
    assert not args_file.exists()
    assert "commit_after agent step requires --git-commits" in result.stderr + result.stdout


def test_dangerously_skip_permissions_is_forwarded_only_when_requested(project_root):
    copy_runner(project_root)
    write_task(project_root)
    args_file = project_root / "opencode-args.txt"
    bin_dir = project_root / "bin"
    opencode_bin = write_mock_opencode(bin_dir)

    result = run_execute(
        project_root,
        "phases/demo",
        "run",
        "--dangerously-skip-permissions",
        extra_env={
            "PATH": f"{bin_dir}{os.pathsep}{os.environ['PATH']}",
            "OPENCODE_BIN": str(opencode_bin),
            "HARNESS_AGENT_COMMAND_LOG": str(args_file),
        },
    )

    assert result.returncode == 0, result.stderr + result.stdout
    assert "--dangerously-skip-permissions" in args_file.read_text(encoding="utf-8")


def test_failed_opencode_records_failure(project_root):
    copy_runner(project_root)
    write_task(project_root)
    args_file = project_root / "opencode-args.txt"
    bin_dir = project_root / "bin"
    opencode_bin = write_mock_opencode(bin_dir, exit_code=7)

    result = run_execute(
        project_root,
        "phases/demo",
        "run",
        extra_env={
            "PATH": f"{bin_dir}{os.pathsep}{os.environ['PATH']}",
            "OPENCODE_BIN": str(opencode_bin),
            "HARNESS_AGENT_COMMAND_LOG": str(args_file),
        },
    )

    assert result.returncode == 7
    state = json.loads((project_root / "phases" / "demo" / "state.json").read_text(encoding="utf-8"))
    assert state["blocked"]["exit_code"] == 7
    assert state["failures"][-1]["agent_runner"] == "opencode"
    assert state["steps"]["10-step"]["last_failure"]["exit_code"] == 7
    assert state["steps"]["10-step"]["exit_code"] == 7
    assert state["steps"]["10-step"]["output_file"] == "agent-output/10-step.jsonl"


def test_command_steps_still_execute_command_blocks(project_root):
    copy_runner(project_root)
    write_command_task(project_root)

    result = run_execute(project_root, "phases/demo", "run")

    assert result.returncode == 0, result.stderr + result.stdout
    assert (project_root / "command-ran.txt").read_text(encoding="utf-8") == "ok"
