#!/usr/bin/env bash
set -euo pipefail

git --no-pager add \
  frontend/eslint.config.js \
  scripts/run_checks_once.sh \
  scripts/build_report.sh \
  scripts/safe_run.sh \
  scripts/run_fixes.sh \
  scripts/run_one_bug.sh \
  scripts/fix_bugs.py \
  backend/eslint.config.mjs

git --no-pager commit -F tmp/commit-msg.txt || true
