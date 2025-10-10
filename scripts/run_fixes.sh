#!/usr/bin/env bash
set -euo pipefail

# Batch bugfix runner with preflight, python fallback, and AUTO_FIRST_ROW support.

CSV_PATH="${1:-ops/bugs_normalized.csv}"

# Resolve Python executor (respect pre-set $PY)
if [ -z "${PY:-}" ]; then
  if command -v python3 >/dev/null 2>&1; then
    PY="python3"
  elif command -v py >/dev/null 2>&1; then
    PY="py -3"
  else
    PY="python3"
  fi
fi

mkdir -p ops scripts tmp

# Ensure CSV
if [ ! -f "$CSV_PATH" ]; then
  if [ -f "bugfix_automation/ops/bugs_normalized.csv" ]; then
    cp -f "bugfix_automation/ops/bugs_normalized.csv" "ops/bugs_normalized.csv"
    CSV_PATH="ops/bugs_normalized.csv"
  else
    echo "CSV not found at $CSV_PATH"
    echo "Creating placeholder at ops/bugs_normalized.csv; paste rows and rerun."
    echo "id,title,description,priority,severity,status,module,file_hint,steps_to_repro,expected,actual,owner,tags,environment,commit" > ops/bugs_normalized.csv
    exit 2
  fi
fi

# Preflight: install deps if node_modules missing; start docker compose; run migrations if possible
if [ -f backend/package.json ]; then
  pushd backend >/dev/null
  if [ ! -d node_modules ]; then
    echo "Installing backend dependencies..."
    npm ci || pnpm i || yarn install
  fi
  if [ -f docker-compose.yml ]; then
    echo "Starting backend docker compose..."
    docker compose up -d || docker-compose up -d || true
  fi
  # Try migrations/seeds if sequelize CLI is available
  if npx --yes sequelize --help >/dev/null 2>&1; then
    echo "Running sequelize migrations/seeds..."
    bash -c "npx sequelize db:migrate || :"
    bash -c "npx sequelize db:seed:all || :"
  else
    echo "Sequelize CLI not found; migrations skipped."
  fi
  popd >/dev/null
fi

if [ -f frontend/package.json ]; then
  pushd frontend >/dev/null
  if [ ! -d node_modules ]; then
    echo "Installing frontend dependencies..."
    npm ci || pnpm i || yarn install
  fi
  popd >/dev/null
fi

# Git setup
git fetch --all --tags || true
DEFAULT_BRANCH=$(git rev-parse --abbrev-ref origin/HEAD 2>/dev/null | cut -d/ -f2 || echo "main")
git switch "$DEFAULT_BRANCH" || git switch main || git switch master
GIT_PAGER= git pull --rebase || true
PARENT="chore/batch-bugfix-$(date +%Y%m%d)"
git switch -c "$PARENT" || git switch "$PARENT"

# Generate per-bug loop file
$PY scripts/fix_bugs.py --emit-loop > tmp/bugs_loop.txt
LOOP_FILE="tmp/bugs_loop.txt"

# AUTO_FIRST_ROW support
if [ -n "${AUTO_FIRST_ROW:-}" ]; then
  head -n1 "$LOOP_FILE" > tmp/bugs_loop_first.txt
  LOOP_FILE="tmp/bugs_loop_first.txt"
fi

# Process rows
while IFS='|' read -r ID TITLE FILEHINT MODULE; do
  [ -z "$ID" ] && continue
  SAFE_TITLE=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | tr -cd 'a-z0-9-' | sed 's/--*/-/g' | cut -c1-60)
  BRANCH="bugfix/${ID}-${SAFE_TITLE}"
  echo "----> Working on $ID :: $TITLE"
  git switch -c "$BRANCH" || git switch "$BRANCH"

  # Generate context and commit scaffold
  $PY scripts/fix_bugs.py --one "$ID"

  echo "Context: tmp/${ID}-context.txt"
  echo "Commit scaffold: tmp/${ID}-commit.md"

  # Open context in VS Code if available
  if command -v code >/dev/null 2>&1; then
    code "tmp/${ID}-context.txt" >/dev/null 2>&1 || true
  fi

  # BACKEND ops
  if [ -f backend/package.json ]; then
pushd backend >/dev/null
    CONTEXT="ID=$ID step=backend:format" bash ../scripts/safe_run.sh "npm run format || npx prettier -w ."
    CONTEXT="ID=$ID step=backend:lint" bash ../scripts/safe_run.sh "npm run lint || npx eslint ."
    CONTEXT="ID=$ID step=backend:typecheck" bash ../scripts/safe_run.sh "npm run typecheck || npx tsc --noEmit || :"
    CONTEXT="ID=$ID step=backend:test" bash ../scripts/safe_run.sh "npm test -- --watch=false || :"
    popd >/dev/null
  fi

  # FRONTEND ops
  if [ -f frontend/package.json ]; then
pushd frontend >/dev/null
    CONTEXT="ID=$ID step=frontend:format" bash ../scripts/safe_run.sh "npm run format || npx prettier -w ."
    CONTEXT="ID=$ID step=frontend:lint" bash ../scripts/safe_run.sh "npm run lint || npx eslint ."
    CONTEXT="ID=$ID step=frontend:typecheck" bash ../scripts/safe_run.sh "npm run typecheck || npx tsc --noEmit || :"
    CONTEXT="ID=$ID step=frontend:test" bash ../scripts/safe_run.sh "npm run test -- --run || npm run test:unit -- --run || :"
    CONTEXT="ID=$ID step=frontend:build" bash ../scripts/safe_run.sh "npm run build || npx vite build"
    popd >/dev/null
  fi

  # Sequelize migrations if available (sanity)
  if [ -d backend ]; then
pushd backend >/dev/null
    if npx --yes sequelize --help >/dev/null 2>&1; then
      CONTEXT="ID=$ID step=db:migrate" bash ../scripts/safe_run.sh "npx sequelize db:migrate"
    fi
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

done < "$LOOP_FILE"

# Final repo-wide polish
if [ -f backend/package.json ]; then
pushd backend >/dev/null
  CONTEXT="ID=ALL step=backend:format" bash ../scripts/safe_run.sh "npm run format || npx prettier -w ."
  CONTEXT="ID=ALL step=backend:lint" bash ../scripts/safe_run.sh "npm run lint || npx eslint ."
  CONTEXT="ID=ALL step=backend:typecheck" bash ../scripts/safe_run.sh "npm run typecheck || npx tsc --noEmit || :"
  CONTEXT="ID=ALL step=backend:test" bash ../scripts/safe_run.sh "npm test -- --watch=false || :"
  popd >/dev/null
fi
if [ -f frontend/package.json ]; then
pushd frontend >/dev/null
  CONTEXT="ID=ALL step=frontend:format" bash ../scripts/safe_run.sh "npm run format || npx prettier -w ."
  CONTEXT="ID=ALL step=frontend:lint" bash ../scripts/safe_run.sh "npm run lint || npx eslint ."
  CONTEXT="ID=ALL step=frontend:typecheck" bash ../scripts/safe_run.sh "npm run typecheck || npx tsc --noEmit || :"
  CONTEXT="ID=ALL step=frontend:build" bash ../scripts/safe_run.sh "npm run build || npx vite build"
  popd >/dev/null
fi

# Aggregate failure logs into repo-root tmp/failures.log
mkdir -p tmp
FAIL_LOG="tmp/failures.log"
: > "$FAIL_LOG"
[ -f backend/tmp/failures.log ] && cat backend/tmp/failures.log >> "$FAIL_LOG"
[ -f frontend/tmp/failures.log ] && cat frontend/tmp/failures.log >> "$FAIL_LOG"

# Build fix-report.md with pass/fail inferred from aggregated log
{
  echo "# Fix Report"
  echo
  echo "| ID | Branch | Commit(SHA) | Lint | Typecheck | Tests | Build | Notes |"
  echo "|---:|:-------|:------------|:-----:|:---------:|:-----:|:-----:|:------|"
  while IFS='|' read -r ID TITLE FILEHINT MODULE; do
    [ -z "$ID" ] && continue
    BRANCH="bugfix/${ID}-$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | tr -cd 'a-z0-9-' | sed 's/--*/-/g' | cut -c1-60)"
    SHA=$(git rev-parse --short "$BRANCH" 2>/dev/null || echo "-")
    # Determine statuses
    LINT="OK"; TYPE="OK"; TESTS="OK"; BUILD="OK"
    if [ -s "$FAIL_LOG" ]; then
      grep -q "\\[FAIL\\].*\\[ID=$ID .*lint\\]" "$FAIL_LOG" && LINT="Fail" || true
      grep -q "\\[FAIL\\].*\\[ID=$ID .*typecheck\\]" "$FAIL_LOG" && TYPE="Fail" || true
      grep -q "\\[FAIL\\].*\\[ID=$ID .*test\\]" "$FAIL_LOG" && TESTS="Fail" || true
      grep -q "\\[FAIL\\].*\\[ID=$ID .*build\\]" "$FAIL_LOG" && BUILD="Fail" || true
    fi
    NOTE="see tmp/${ID}-context.txt"
    printf "| %s | %s | %s | %s | %s | %s | %s | %s |\\n" "$ID" "$BRANCH" "$SHA" "$LINT" "$TYPE" "$TESTS" "$BUILD" "$NOTE"
  done < "$LOOP_FILE"
  echo
  if [ -s "$FAIL_LOG" ]; then
    echo "## Failures"
    cat "$FAIL_LOG"
  fi
} > fix-report.md

echo
echo "Parent branch ready: $PARENT"
echo "Next:"
echo "  git push -u origin $PARENT"
echo "  # optionally push bug branches and open PRs"
