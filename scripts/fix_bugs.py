#!/usr/bin/env python3
import argparse, csv, os, sys, re, subprocess
from pathlib import Path
from typing import List, Dict

CSV_PATH = Path("ops/bugs_normalized.csv")
TMP_DIR = Path("tmp")
TMP_DIR.mkdir(parents=True, exist_ok=True)

IGNORE_DIRS = {"node_modules", "dist", "build", ".next", ".git", "coverage", ".cache", ".turbo"}
ALLOWED_EXTS = {".js", ".jsx", ".ts", ".tsx", ".json", ".mjs", ".cjs", ".css", ".scss", ".md"}

# ----- CSV -----
def read_rows() -> List[Dict[str,str]]:
    if not CSV_PATH.exists():
        print(f"CSV not found at {CSV_PATH}. Create it with normalized headers.", file=sys.stderr)
        sys.exit(2)
    with open(CSV_PATH, newline='', encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        rows = [{k.strip(): (v or "").strip() for k, v in row.items()} for row in reader]
    return rows

# ----- Scope/Queries -----
def weight_scope(row: Dict) -> str:
    hint = f"{row.get('file_hint','')} {row.get('module','')} {row.get('title','')}".lower()
    for s in ["timesheetentry","timesheet","task","project","invoice","auth","db","ui","api","backend","frontend"]:
        if s in hint.replace(" ",""):
            return s if s not in {"backend","frontend"} else s
    return "timesheet"

def build_query(row: Dict) -> List[str]:
    q: List[str] = []
    if row.get("file_hint"): q.append(row["file_hint"])  # highest weight
    if row.get("module"): q.append(row["module"])        # medium
    title = (row.get("title") or "")
    words = re.findall(r"[A-Za-z0-9]{3,}", title)
    q.extend(words[:6])  # cap
    # dedupe preserve order
    seen = set(); out: List[str] = []
    for item in q:
        if item and item not in seen:
            seen.add(item); out.append(item)
    return out

# ----- Search helpers -----
def rg_available() -> bool:
    try:
        subprocess.run(["rg","--version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        return True
    except Exception:
        return False

def grep_available() -> bool:
    try:
        subprocess.run(["grep","--version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        return True
    except Exception:
        return False

# Expand direct hint paths/globs
def candidates_from_hint(file_hint: str) -> List[str]:
    if not file_hint: return []
    hints = re.split(r"[\s,]+", file_hint.strip())
    picks: List[str] = []
    for h in hints:
        if not h: continue
        p = Path(h)
        if p.exists() and p.is_file():
            picks.append(str(p))
            continue
        # try as glob under repo
        for base in [Path("."), Path("backend"), Path("frontend")]:
            for fp in base.rglob(h):
                if fp.is_file():
                    picks.append(str(fp))
    # unique preserve order
    seen=set(); res=[]
    for x in picks:
        if x not in seen:
            seen.add(x); res.append(x)
    return res

# Python fallback file scan (AND semantics across terms)
def python_scan(query_terms: List[str], roots: List[str], max_files: int) -> List[str]:
    if not query_terms:
        return []
    terms = [t.lower() for t in query_terms]
    found: List[str] = []
    def ok_file(path: Path) -> bool:
        if path.suffix.lower() in ALLOWED_EXTS:
            return True
        # allow controllers/routes/services/models even if no ext match
        return any(seg in {"controllers","routes","services","models","middleware"} for seg in path.parts)
    for root in roots:
        rootp = Path(root)
        if not rootp.exists():
            continue
        for dirpath, dirnames, filenames in os.walk(rootp):
            # prune
            dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]
            for fn in filenames:
                fp = Path(dirpath) / fn
                if not ok_file(fp):
                    continue
                try:
                    with open(fp, "r", encoding="utf-8", errors="ignore") as fh:
                        content = fh.read().lower()
                except Exception:
                    continue
                if all(term in content for term in terms if len(term) >= 3):
                    found.append(str(fp))
                    if len(found) >= max_files:
                        return found
    return found

# Unified candidate finder
def candidate_paths(row: Dict, max_files: int = 40) -> List[str]:
    # prioritized roots
    roots: List[str] = []
    if Path("backend/src").exists(): roots.append("backend/src")
    if Path("backend").exists(): roots.append("backend")
    if Path("frontend/src").exists(): roots.append("frontend/src")
    if Path("frontend").exists(): roots.append("frontend")
    if not roots: roots = ["."]

    terms = build_query(row)
    picks = candidates_from_hint(row.get("file_hint",""))

    # ripgrep path discovery
    files: List[str] = []
    if rg_available() and terms:
        try:
            base_cmd = ["rg","-n","--hidden","--no-ignore-vcs","-g","!**/node_modules/**","-g","!**/dist/**","-g","!**/build/**","-g","!**/.next/**"]
            proc = subprocess.run(base_cmd + [terms[0]] + roots, capture_output=True, text=True, check=False)
            seen = []
            for line in proc.stdout.splitlines():
                if ":" in line:
                    fp = line.split(":", 1)[0]
                    if fp not in seen:
                        seen.append(fp)
            files = seen
            # filter for subsequent terms
            for term in terms[1:]:
                filtered = []
                for fp in files:
                    try:
                        with open(fp, "r", encoding="utf-8", errors="ignore") as fh:
                            content = fh.read()
                        if re.search(re.escape(term), content, re.IGNORECASE):
                            filtered.append(fp)
                    except Exception:
                        pass
                files = filtered
                if not files:
                    break
        except Exception:
            files = []
    elif grep_available() and terms:
        try:
            cmd = ["bash","-lc", "grep -RIl --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=build --exclude-dir=.next -- %s %s" % (terms[0].replace('"','\"'), " ".join(roots))]
            proc = subprocess.run(cmd, capture_output=True, text=True, check=False)
            files = proc.stdout.splitlines()
            for term in terms[1:]:
                filtered = []
                for fp in files:
                    try:
                        with open(fp, "r", encoding="utf-8", errors="ignore") as fh:
                            content = fh.read()
                        if re.search(re.escape(term), content, re.IGNORECASE):
                            filtered.append(fp)
                    except Exception:
                        pass
                files = filtered
                if not files:
                    break
        except Exception:
            files = []

    # Pure Python fallback
    if not files:
        files = python_scan(terms, roots, max_files=max_files)

    # merge hint picks first, then files, dedup
    merged: List[str] = []
    seen = set()
    for fp in picks + files:
        if fp not in seen:
            seen.add(fp); merged.append(fp)
    return merged[:max_files]

# Snippets for context
def snippet_for_file(path: str, terms: List[str], lines=3) -> str:
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read().splitlines()
    except Exception:
        return ""
    idx = -1
    rx = re.compile("|".join([re.escape(t) for t in terms if t]), re.IGNORECASE) if terms else None
    if rx:
        for i, line in enumerate(content):
            if rx.search(line):
                idx = i; break
    if idx == -1: idx = 0
    start = max(0, idx - lines); end = min(len(content), idx + lines + 1)
    block = "\n".join(f"{start+i+1:>5}: {content[start+i]}" for i in range(end - start))
    return block

# Emit artifacts per bug
def write_context_and_commit(row: Dict) -> List[str]:
    bug_id = (row.get("id") or "").strip() or "unknown"
    title = row.get("title") or ""
    terms = build_query(row)
    files = candidate_paths(row, max_files=40)
    ctx_path = TMP_DIR / f"{bug_id}-context.txt"
    cmt_path = TMP_DIR / f"{bug_id}-commit.md"
    scope = weight_scope(row)

    with open(ctx_path, "w", encoding="utf-8") as out:
        out.write("# Bug Context\n")
        for k in ["id","title","description","priority","severity","status","module","file_hint","steps_to_repro","expected","actual","owner","tags","environment","commit"]:
            if k in row:
                out.write(f"- {k}: {row.get(k,'')}\n")
        out.write("\n## Candidate Files (top)\n")
        for fp in files:
            out.write(f"\n### {fp}\n")
            out.write(snippet_for_file(fp, terms))
            out.write("\n")

    with open(cmt_path, "w", encoding="utf-8") as out:
        header = f"fix({scope}): {title}".strip()
        body_parts = []
        if row.get("description"): body_parts.append(f"Description: {row['description']}")
        if row.get("steps_to_repro"): body_parts.append(f"Steps to Reproduce:\n{row['steps_to_repro']}")
        if row.get("expected"): body_parts.append(f"Expected: {row['expected']}")
        if row.get("actual"): body_parts.append(f"Actual: {row['actual']}")
        body = "\n\n".join(body_parts).strip()
        foot = []
        for f in ["id","priority","severity","owner","tags","environment","commit"]:
            val = row.get(f) or ""
            if val:
                label = f.capitalize() if f != "id" else "Refs"
                if f == "id":
                    foot.append(f"{label}: {val}")
                else:
                    foot.append(f"{label}: {val}")
        footer = "\n".join(foot)
        out.write(header + "\n\n" + body + ("\n\n" if body else "\n") + footer + "\n")

    return files

# Loop emitter for bash while-read
def emit_loop_rows(rows: List[Dict]):
    for r in rows:
        rid = (r.get("id") or "").replace("|","/")
        title = (r.get("title") or "").replace("|","/")
        fh = (r.get("file_hint") or "").replace("|","/")
        mod = (r.get("module") or "").replace("|","/")
        print(f"{rid}|{title}|{fh}|{mod}")

# ----- main -----
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--one", help="process a single bug id")
    ap.add_argument("--emit-loop", action="store_true", help="emit rows for bash loop")
    args = ap.parse_args()

    rows = read_rows()

    if args.emit_loop:
        emit_loop_rows(rows)
        return

    if args.one:
        target = None
        for r in rows:
            if (r.get("id") or "") == args.one:
                target = r; break
        if not target:
            print(f"No row with id={args.one}", file=sys.stderr)
            sys.exit(1)
        write_context_and_commit(target)
        return

    for r in rows:
        write_context_and_commit(r)

if __name__ == "__main__":
    main()
