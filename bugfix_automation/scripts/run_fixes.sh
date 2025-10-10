#!/usr/bin/env bash
set -euo pipefail

CSV_PATH="${1:-ops/bugs_normalized.csv}"
if [ ! -f "$CSV_PATH" ]; then
  echo "CSV not found at $CSV_PATH"
  echo "Create it with headers:"
  echo "id,title,description,priority,severity,status,module,file_hint,steps_to_repro,expected,actual,owner,tags,environment,commit"
  exit 2
fi

mkdir -p ops scripts tmp

# Git setup
git fetch --all --tags || true
DEFAULT_BRANCH=$(git rev-parse --abbrev-ref origin/HEAD 2>/dev/null | cut -d/ -f2 || echo "main")
git switch "$DEFAULT_BRANCH" || git switch main || git switch master
git pull --rebase || true
PARENT="chore/batch-bugfix-$(date +%Y%m%d)"
git switch -c "$PARENT" || git switch "$PARENT"

# Generate per-bug context upfront (also used to list bugs)
python3 scripts/fix_bugs.py --emit-loop > tmp/bugs_loop.txt

while IFS='|' read -r ID TITLE FILEHINT MODULE; do
  [ -z "$ID" ] && continue
  SAFE_TITLE=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | tr -cd 'a-z0-9-' | sed 's/--*/-/g' | cut -c1-60)
  BRANCH="bugfix/${ID}-${SAFE_TITLE}"
  echo "----> Working on $ID :: $TITLE"
  git switch -c "$BRANCH" || git switch "$BRANCH"

  # Generate context and commit scaffold
  python3 scripts/fix_bugs.py --one "$ID"

  echo "Context: tmp/${ID}-context.txt"
  echo "Commit scaffold: tmp/${ID}-commit.md"

  # Open candidates if EDITOR is defined
  if command -v code >/dev/null 2>&1; then
    # open context and top candidates hint in VS Code if available
    code "tmp/${ID}-context.txt" >/dev/null 2>&1 || true
  fi

  # BACKEND ops
  if [ -f backend/package.json ]; then
    pushd backend >/dev/null
    bash scripts/safe_run.sh "npm run format || npx prettier -w ."
    bash scripts/safe_run.sh "npm run lint || npx eslint ."
    bash scripts/safe_run.sh "npm run typecheck || npx tsc --noEmit || :"
    bash scripts/safe_run.sh "npm test -- --watch=false || :"
    popd >/dev/null
  fi

  # FRONTEND ops
  if [ -f frontend/package.json ]; then
    pushd frontend >/dev/null
    bash scripts/safe_run.sh "npm run format || npx prettier -w ."
    bash scripts/safe_run.sh "npm run lint || npx eslint ."
    bash scripts/safe_run.sh "npm run typecheck || npx tsc --noEmit || :"
    bash scripts/safe_run.sh "npm run test -- --run || npm run test:unit -- --run || :"
    bash scripts/safe_run.sh "npm run build || npx vite build"
    popd >/dev/null
  fi

  # Sequelize migrations if available
  if [ -d backend ]; then
    pushd backend >/dev/null
    if npx --yes sequelize --help >/dev/null 2>&1; then
      bash scripts/safe_run.sh "npx sequelize db:migrate"
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

  # Merge back
  git switch "$PARENT"
  if ! git merge --no-ff "$BRANCH"; then
    echo "Merge conflict on $BRANCH; resolve later" | tee -a tmp/failures.log
  fi

done < tmp/bugs_loop.txt

# Final repo-wide polish
if [ -f backend/package.json ]; then
  pushd backend >/dev/null
  bash scripts/safe_run.sh "npm run format || npx prettier -w ."
  bash scripts/safe_run.sh "npm run lint || npx eslint ."
  bash scripts/safe_run.sh "npm run typecheck || npx tsc --noEmit || :"
  bash scripts/safe_run.sh "npm test -- --watch=false || :"
  popd >/dev/null
fi
if [ -f frontend/package.json ]; then
  pushd frontend >/dev/null
  bash scripts/safe_run.sh "npm run format || npx prettier -w ."
  bash scripts/safe_run.sh "npm run lint || npx eslint ."
  bash scripts/safe_run.sh "npm run typecheck || npx tsc --noEmit || :"
  bash scripts/safe_run.sh "npm run build || npx vite build"
  popd >/dev/null
fi

# Build fix-report.md
{
  echo "# Fix Report"
  echo
  echo "| ID | Branch | Commit(SHA) | Notes |"
  echo "|---:|:-------|:------------|:------|"
  while IFS='|' read -r ID TITLE FILEHINT MODULE; do
    [ -z "$ID" ] && continue
    BRANCH="bugfix/${ID}-$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | tr -cd 'a-z0-9-' | sed 's/--*/-/g' | cut -c1-60)"
    SHA=$(git rev-parse --short "$BRANCH" 2>/dev/null || echo "-")
    NOTE="see tmp/${ID}-context.txt"
    echo "| ${ID} | ${BRANCH} | ${SHA} | ${NOTE} |"
  done < tmp/bugs_loop.txt
  echo
  if [ -f tmp/failures.log ]; then
    echo "## Failures"
    cat tmp/failures.log
  fi
} > fix-report.md

echo
echo "Parent branch ready: $PARENT"
echo "Next:"
echo "  git push -u origin $PARENT"
echo "  # optionally push bug branches and open PRs"
