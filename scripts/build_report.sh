#!/usr/bin/env bash
set -euo pipefail

# Build fix-report.md based on aggregated failure logs and an existing bugs loop file.
# Usage: scripts/build_report.sh [LOOP_FILE]
# Defaults to tmp/bugs_loop.txt, prefers tmp/bugs_loop_first.txt if present and no arg provided.

LOOP_FILE="${1:-}"
if [ -z "$LOOP_FILE" ]; then
  if [ -f tmp/bugs_loop_first.txt ]; then
    LOOP_FILE="tmp/bugs_loop_first.txt"
  else
    LOOP_FILE="tmp/bugs_loop.txt"
  fi
fi

if [ ! -f "$LOOP_FILE" ]; then
  echo "Loop file not found: $LOOP_FILE" >&2
  exit 2
fi

# Aggregate logs
mkdir -p tmp
FAIL_LOG="tmp/failures.log"
: > "$FAIL_LOG"
[ -f backend/tmp/failures.log ] && cat backend/tmp/failures.log >> "$FAIL_LOG"
[ -f frontend/tmp/failures.log ] && cat frontend/tmp/failures.log >> "$FAIL_LOG"

# Build report
{
  echo "# Fix Report"
  echo
  echo "| ID | Branch | Commit(SHA) | Lint | Typecheck | Tests | Build | Notes |"
  echo "|---:|:-------|:------------|:-----:|:---------:|:-----:|:-----:|:------|"
  while IFS='|' read -r ID TITLE FILEHINT MODULE; do
    [ -z "$ID" ] && continue
    BRANCH="bugfix/${ID}-$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | tr -cd 'a-z0-9-' | sed 's/--*/-/g' | cut -c1-60)"
    SHA=$(git rev-parse --short "$BRANCH" 2>/dev/null || echo "-")
    LINT="OK"; TYPE="OK"; TESTS="OK"; BUILD="OK"
    if [ -s "$FAIL_LOG" ]; then
      grep -q "\[FAIL\].*\[ID=$ID .*lint\]" "$FAIL_LOG" && LINT="Fail" || true
      grep -q "\[FAIL\].*\[ID=$ID .*typecheck\]" "$FAIL_LOG" && TYPE="Fail" || true
      grep -q "\[FAIL\].*\[ID=$ID .*test\]" "$FAIL_LOG" && TESTS="Fail" || true
      grep -q "\[FAIL\].*\[ID=$ID .*build\]" "$FAIL_LOG" && BUILD="Fail" || true
    fi
    NOTE="see tmp/${ID}-context.txt"
    printf "| %s | %s | %s | %s | %s | %s | %s | %s |\n" "$ID" "$BRANCH" "$SHA" "$LINT" "$TYPE" "$TESTS" "$BUILD" "$NOTE"
  done < "$LOOP_FILE"
  echo
  if [ -s "$FAIL_LOG" ]; then
    echo "## Failures"
    cat "$FAIL_LOG"
  fi
} > fix-report.md

echo "Report written to fix-report.md using loop file: $LOOP_FILE"
