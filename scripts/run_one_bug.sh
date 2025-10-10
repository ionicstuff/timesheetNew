#!/usr/bin/env bash
set -euo pipefail

# Run the bug branch workflow for a single bug ID.
# Usage: scripts/run_one_bug.sh BUG_ID

ID="${1:-}"
if [ -z "$ID" ]; then
  echo "Usage: scripts/run_one_bug.sh BUG_ID" >&2
  exit 2
fi

# Resolve Python executor
if [ -z "${PY:-}" ]; then
  if command -v python3 >/dev/null 2>&1; then
    PY="python3"
  elif command -v py >/dev/null 2>&1; then
    PY="py -3"
  else
    PY="python"
  fi
fi

mkdir -p ops scripts tmp

# Ensure loop rows exist and fetch title for branch naming
$PY scripts/fix_bugs.py --emit-loop > tmp/bugs_loop.txt
TITLE=$(awk -F'|' -v id="$ID" '$1==id {print $2; exit}' tmp/bugs_loop.txt)
SAFE_TITLE=$(echo "${TITLE}" | tr '[:upper:]' '[:lower:]' | tr -cd 'a-z0-9-' | sed 's/--*/-/g' | cut -c1-60)
BRANCH="bugfix/${ID}-${SAFE_TITLE}"
PARENT="chore/batch-bugfix-$(date +%Y%m%d)"

# Make sure we are on parent branch
if git rev-parse --verify "$PARENT" >/dev/null 2>&1; then
  git switch "$PARENT"
else
  # Detect default branch and create parent if needed
  DEFAULT_BRANCH=$(git rev-parse --abbrev-ref origin/HEAD 2>/dev/null | cut -d/ -f2 || echo "main")
  git switch "$DEFAULT_BRANCH" || git switch main || git switch master
  git fetch --all --tags || true
  GIT_PAGER= git pull --rebase || true
  git switch -c "$PARENT" || git switch "$PARENT"
fi

# Create child branch
git switch -c "$BRANCH" || git switch "$BRANCH"

# Generate context and commit scaffold
$PY scripts/fix_bugs.py --one "$ID"

# Open context in VS Code if available (non-blocking)
if command -v code >/dev/null 2>&1; then
  code "tmp/${ID}-context.txt" >/dev/null 2>&1 || true
fi

# BACKEND ops
if [ -f backend/package.json ]; then
  pushd backend >/dev/null
  LOG_FILE=../tmp/failures.log CONTEXT="ID=$ID step=backend:format"    bash ../scripts/safe_run.sh "npm run format || npx prettier -w ."
  LOG_FILE=../tmp/failures.log CONTEXT="ID=$ID step=backend:lint"      bash ../scripts/safe_run.sh "npm run lint || npx eslint ."
  LOG_FILE=../tmp/failures.log CONTEXT="ID=$ID step=backend:typecheck" bash ../scripts/safe_run.sh "npm run typecheck || npx tsc --noEmit || :"
  LOG_FILE=../tmp/failures.log CONTEXT="ID=$ID step=backend:test"      bash ../scripts/safe_run.sh "npm test -- --watch=false || :"
  popd >/dev/null
fi

# FRONTEND ops
if [ -f frontend/package.json ]; then
  pushd frontend >/dev/null
  LOG_FILE=../tmp/failures.log CONTEXT="ID=$ID step=frontend:format"    bash ../scripts/safe_run.sh "npm run format || npx prettier -w ."
  LOG_FILE=../tmp/failures.log CONTEXT="ID=$ID step=frontend:lint"      bash ../scripts/safe_run.sh "npm run lint || npx eslint ."
  LOG_FILE=../tmp/failures.log CONTEXT="ID=$ID step=frontend:typecheck" bash ../scripts/safe_run.sh "npm run typecheck || npx tsc --noEmit || :"
  LOG_FILE=../tmp/failures.log CONTEXT="ID=$ID step=frontend:build"     bash ../scripts/safe_run.sh "npm run build || npx vite build"
  popd >/dev/null
fi

# Commit if changed
git add -A
if git diff --cached --quiet; then
  echo "No changes to commit for $ID"
else
  HEADER=$(head -n1 "tmp/${ID}-commit.md" || echo "fix: ${TITLE}")
  BODY=$(tail -n +2 "tmp/${ID}-commit.md" || echo "")
  git commit -m "$HEADER" -m "$BODY"
fi

# Merge back to parent
git switch "$PARENT"
if ! git merge --no-ff "$BRANCH"; then
  echo "Merge conflict on $BRANCH; resolve later" | tee -a tmp/failures.log
fi

# Rebuild report
bash scripts/build_report.sh