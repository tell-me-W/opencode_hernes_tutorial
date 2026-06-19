#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path


PATTERNS = [
    re.compile(r"\brm\s+-rf\b"),
    re.compile(r"\bgit\s+reset\s+--hard\b"),
    re.compile(r"\bgit\s+push\b.*\s--force\b"),
    re.compile(r"\bshutdown\b"),
    re.compile(r"\bformat\b"),
    re.compile(r"\bdrop\s+database\b", re.IGNORECASE),
    re.compile(r"\btruncate\s+table\b", re.IGNORECASE),
]


def main():
    context = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8")) if len(sys.argv) > 1 else {}
    commands = context.get("commands", [])
    blocked = []
    for command in commands:
        if any(pattern.search(command) for pattern in PATTERNS):
            blocked.append(command)
    if blocked:
        print("BLOCKED: dangerous command requires explicit user approval.")
        for command in blocked:
            print(command)
        raise SystemExit(1)
    print("dangerous_cmd_guard ok")


if __name__ == "__main__":
    main()
