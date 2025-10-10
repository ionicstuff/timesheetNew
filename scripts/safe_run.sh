#!/usr/bin/env bash
set -euo pipefail

# Safe runner that never fails the pipeline.
# Usage:
#   CONTEXT="ID=BUG-001 step=backend:lint" LOG_FILE="tmp/failures.log" bash scripts/safe_run.sh "npm run lint || npx eslint ."

LOG_FILE="${LOG_FILE:-tmp/failures.log}"
CONTEXT="${CONTEXT:-}"
mkdir -p "$(dirname "$LOG_FILE")"

CMD="$*"
echo ">>> $CMD"
# shellcheck disable=SC2086
if ! bash -lc "$CMD"; then
  if [ -n "$CONTEXT" ]; then
    echo "[FAIL] [$CONTEXT] $CMD" | tee -a "$LOG_FILE"
  else
    echo "[FAIL] $CMD" | tee -a "$LOG_FILE"
  fi
  # never fail hard; caller pipeline continues
  exit 0
fi
