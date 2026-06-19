#!/usr/bin/env python3
import json
import sys
from pathlib import Path


def main():
    context = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8")) if len(sys.argv) > 1 else {}
    print(f"post_phase ok: {context.get('phase')}")


if __name__ == "__main__":
    main()
