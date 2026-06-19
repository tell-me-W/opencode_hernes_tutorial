#!/usr/bin/env python3
import json
import sys
from pathlib import Path


REQUIRED_HEADINGS = ["# Goal", "# Inputs", "# Instructions", "# Done Criteria", "# Verification"]


def main():
    context = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8")) if len(sys.argv) > 1 else {}
    phase_file = Path(context.get("phase_file", ""))
    text = phase_file.read_text(encoding="utf-8")
    missing = [heading for heading in REQUIRED_HEADINGS if heading not in text]
    if missing:
        raise SystemExit(f"BLOCKED: phase {phase_file} missing headings: {', '.join(missing)}")
    print(f"validate_phase ok: {context.get('phase')}")


if __name__ == "__main__":
    main()
