Bugfix Automation (Warp-ready)
==============================

Contents:
- scripts/safe_run.sh
- scripts/fix_bugs.py
- scripts/run_fixes.sh
- ops/bugs_normalized.csv  (included if you provided one)

Usage (from your repo root):
  1) Copy the `scripts/` folder into your repo root.
  2) Copy `ops/bugs_normalized.csv` into `./ops/` (or edit to add your rows).
  3) Make scripts executable:
       chmod +x scripts/*.sh
  4) Run:
       bash scripts/run_fixes.sh ./ops/bugs_normalized.csv

Notes:
- The runner creates a parent branch `chore/batch-bugfix-YYYYMMDD` and a child branch per bug.
- It generates `tmp/<id>-context.txt` and `tmp/<id>-commit.md` for each bug.
- It runs lint/format/typecheck/tests for backend and frontend if present.
- It writes a final `fix-report.md` and a `tmp/failures.log` if any step failed.
