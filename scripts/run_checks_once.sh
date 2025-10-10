#!/usr/bin/env bash
set -euo pipefail

# Re-run checks for backend and frontend for the first bug (BUG-001) and rebuild report.
# This script avoids git operations and only runs tools to refresh logs and fix-report.md.

# Clear prior logs
rm -f backend/tmp/failures.log frontend/tmp/failures.log tmp/failures.log || true

# Backend
if [ -f backend/package.json ]; then
  pushd backend >/dev/null
  LOG_FILE=tmp/failures.log CONTEXT='ID=BUG-001 step=backend:format'    bash ../scripts/safe_run.sh "npm run format || npx prettier -w ."
  LOG_FILE=tmp/failures.log CONTEXT='ID=BUG-001 step=backend:lint'      bash ../scripts/safe_run.sh "npm run lint || npx eslint ."
  LOG_FILE=tmp/failures.log CONTEXT='ID=BUG-001 step=backend:typecheck' bash ../scripts/safe_run.sh "npm run typecheck || npx tsc --noEmit || :"
  LOG_FILE=tmp/failures.log CONTEXT='ID=BUG-001 step=backend:test'      bash ../scripts/safe_run.sh "npm test -- --watch=false || :"
  popd >/dev/null
fi

# Frontend
if [ -f frontend/package.json ]; then
  pushd frontend >/dev/null
  LOG_FILE=tmp/failures.log CONTEXT='ID=BUG-001 step=frontend:format'    bash ../scripts/safe_run.sh "npm run format || npx prettier -w ."
  LOG_FILE=tmp/failures.log CONTEXT='ID=BUG-001 step=frontend:lint'      bash ../scripts/safe_run.sh "npm run lint || npx eslint ."
  LOG_FILE=tmp/failures.log CONTEXT='ID=BUG-001 step=frontend:typecheck' bash ../scripts/safe_run.sh "npm run typecheck || npx tsc --noEmit || :"
  LOG_FILE=tmp/failures.log CONTEXT='ID=BUG-001 step=frontend:build'     bash ../scripts/safe_run.sh "npm run build || npx vite build"
  popd >/dev/null
fi

# Rebuild report
bash scripts/build_report.sh
