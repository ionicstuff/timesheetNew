#!/usr/bin/env bash
set -euo pipefail
LOG_FILE="tmp/failures.log"
mkdir -p tmp
CMD="$*"
echo ">>> $CMD"
# shellcheck disable=SC2086
if ! bash -lc "$CMD"; then
  echo "[FAIL] $CMD" | tee -a "$LOG_FILE"
  # never fail hard; caller pipeline continues
  exit 0
fi
