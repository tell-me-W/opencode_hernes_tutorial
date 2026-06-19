#!/usr/bin/env python3
import json
import sys
from pathlib import Path


def main():
    context = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8")) if len(sys.argv) > 1 else {}
    phase_file = Path(context.get("phase_file", ""))
    if not phase_file.exists():
        raise SystemExit(f"BLOCKED: missing phase file {phase_file}")
    print(f"pre_phase ok: {context.get('phase')}")


if __name__ == "__main__":
    main()
