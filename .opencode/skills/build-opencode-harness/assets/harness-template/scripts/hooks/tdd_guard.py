#!/usr/bin/env python3
import subprocess
import sys
from pathlib import Path


IMPLEMENTATION_SUFFIXES = (".js", ".jsx", ".ts", ".tsx", ".java", ".kt", ".py", ".go", ".rs")
TEST_HINTS = ("test", "spec", "__tests__", "tests")


def changed_files():
    try:
        result = subprocess.run(
            ["git", "diff", "--name-only"],
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            text=True,
            check=False,
        )
    except FileNotFoundError:
        return []
    return [Path(line.strip()) for line in result.stdout.splitlines() if line.strip()]


def is_test(path):
    lowered = str(path).lower()
    return any(hint in lowered for hint in TEST_HINTS)


def main():
    files = changed_files()
    impl = [path for path in files if path.suffix in IMPLEMENTATION_SUFFIXES and not is_test(path)]
    tests = [path for path in files if is_test(path)]
    if impl and not tests:
        print("BLOCKED: implementation files changed but no test files changed.")
        for path in impl:
            print(f"- {path}")
        raise SystemExit(1)
    print("tdd_guard ok")


if __name__ == "__main__":
    main()
