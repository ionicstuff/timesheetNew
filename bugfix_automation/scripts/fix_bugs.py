\
    #!/usr/bin/env python3
    import argparse, csv, os, sys, re, subprocess, shlex, json
    from pathlib import Path
    from typing import List, Dict

    CSV_PATH = Path("ops/bugs_normalized.csv")
    TMP_DIR = Path("tmp")
    TMP_DIR.mkdir(parents=True, exist_ok=True)

    def read_rows():
        if not CSV_PATH.exists():
            print(f"CSV not found at {CSV_PATH}. Create it with normalized headers.", file=sys.stderr)
            sys.exit(2)
        with open(CSV_PATH, newline='', encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            rows = [ {k.strip(): (v or "").strip() for k,v in row.items()} for row in reader ]
        return rows

    def weight_scope(row: Dict) -> str:
        # Infer a good Conventional Commit scope
        hint = (row.get("file_hint") or "") + " " + (row.get("module") or "") + " " + (row.get("title") or "")
        hint_l = hint.lower()
        scope = "backend" if "backend" in hint_l else "frontend" if "frontend" in hint_l else ""
        # Domain entities
        for s in ["timesheetentry","timesheet","task","project","invoice","auth","db","ui","api"]:
            if s in hint_l.replace(" ", ""):
                return s
        if scope:
            return scope
        return "timesheet"

    def build_query(row: Dict) -> List[str]:
        q = []
        if row.get("file_hint"):
            q.append(row["file_hint"])
        if row.get("module"):
            q.append(row["module"])
        title = (row.get("title") or "")
        # Keep only alnum words for the title query
        words = re.findall(r"[A-Za-z0-9]{3,}", title)
        q.extend(words[:6])  # cap
        # Deduplicate while preserving order
        seen = set()
        res = []
        for item in q:
            if item and item not in seen:
                res.append(item)
                seen.add(item)
        return res

    def rg_available() -> bool:
        try:
            subprocess.run(["rg", "--version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
            return True
        except Exception:
            return False

    def grep_available() -> bool:
        try:
            subprocess.run(["grep", "--version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
            return True
        except Exception:
            return False

    def candidate_paths(query_terms: List[str], max_files: int = 40) -> List[str]:
        # Prioritized search roots
        roots = []
        if Path("backend").exists():
            roots.append("backend")
        if Path("frontend").exists():
            roots.append("frontend")
        if not roots:
            roots = ["."]
        found = []
        if not query_terms:
            return found

        if rg_available():
            # Build ripgrep command joining terms (AND semantics by running sequentially narrowing down)
            # First search broadly by the first term, then filter subsequent terms on the set
            base_cmd = ["rg", "-n", "--hidden", "--no-ignore-vcs",
                        "-g", "!**/node_modules/**", "-g", "!**/dist/**", "-g", "!**/build/**"]
            try:
                proc = subprocess.run(base_cmd + [query_terms[0]] + roots, capture_output=True, text=True, check=False)
                lines = proc.stdout.splitlines()
                files = [l.split(":",1)[0] for l in lines if ":" in l]
                files = list(dict.fromkeys(files))  # unique preserve order
                # Filter for subsequent terms by grepping file contents
                for term in query_terms[1:]:
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
                found = files[:max_files]
            except Exception:
                found = []
        elif grep_available():
            # Fallback recursive grep for first term
            try:
                cmd = ["bash","-lc", "grep -RIl --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=build -- %s %s" % (shlex.quote(query_terms[0]), " ".join(map(shlex.quote, roots)))]
                proc = subprocess.run(cmd, capture_output=True, text=True, check=False)
                files = proc.stdout.splitlines()
                for term in query_terms[1:]:
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
                found = files[:max_files]
            except Exception:
                found = []
        else:
            # No search tool; return empty
            found = []
        return found

    def snippet_for_file(path: str, terms: List[str], lines=3) -> str:
        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read().splitlines()
        except Exception:
            return ""
        # find first matching line
        idx = -1
        rx = re.compile("|".join([re.escape(t) for t in terms]), re.IGNORECASE) if terms else None
        if rx:
            for i, line in enumerate(content):
                if rx.search(line):
                    idx = i
                    break
        if idx == -1:
            idx = 0
        start = max(0, idx - lines)
        end = min(len(content), idx + lines + 1)
        block = "\n".join(f"{start+i+1:>5}: {content[start+i]}" for i in range(end - start))
        return block

    def write_context_and_commit(row: Dict):
        bug_id = (row.get("id") or "").strip() or "unknown"
        title = row.get("title") or ""
        terms = build_query(row)
        files = candidate_paths(terms, max_files=40)
        ctx_path = TMP_DIR / f"{bug_id}-context.txt"
        cmt_path = TMP_DIR / f"{bug_id}-commit.md"
        scope = weight_scope(row)

        with open(ctx_path, "w", encoding="utf-8") as out:
            out.write("# Bug Context\\n")
            for k in ["id","title","description","priority","severity","status","module","file_hint","steps_to_repro","expected","actual","owner","tags","environment","commit"]:
                if k in row:
                    out.write(f"- {k}: {row.get(k,'')}\\n")
            out.write("\\n## Candidate Files (top)\\n")
            for fp in files:
                out.write(f"\\n### {fp}\\n")
                out.write(snippet_for_file(fp, terms))
                out.write("\\n")
        with open(cmt_path, "w", encoding="utf-8") as out:
            header = f"fix({scope}): {title}".strip()
            body_parts = []
            if row.get("description"): body_parts.append(f"Description: {row['description']}")
            if row.get("steps_to_repro"): body_parts.append(f"Steps to Reproduce:\\n{row['steps_to_repro']}")
            if row.get("expected"): body_parts.append(f"Expected: {row['expected']}")
            if row.get("actual"): body_parts.append(f"Actual: {row['actual']}")
            body = "\\n\\n".join(body_parts).strip()
            foot = []
            for f in ["id","priority","severity","owner","tags","environment","commit"]:
                val = row.get(f) or ""
                if val:
                    label = f.capitalize() if f!="id" else "Refs"
                    if f=="id":
                        foot.append(f"{label}: {val}")
                    else:
                        foot.append(f"{label}: {val}")
            footer = "\\n".join(foot)
            out.write(header + "\\n\\n" + body + ("\\n\\n" if body else "\\n") + footer + "\\n")

        return files

    def emit_loop_rows(rows: List[Dict]):
        # Emit rows for bash loop: ID|TITLE|FILE_HINT|MODULE
        for r in rows:
            rid = (r.get("id") or "").replace("|","/")
            title = (r.get("title") or "").replace("|","/")
            fh = (r.get("file_hint") or "").replace("|","/")
            mod = (r.get("module") or "").replace("|","/")
            print(f"{rid}|{title}|{fh}|{mod}")

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
                    target = r
                    break
            if not target:
                print(f"No row with id={args.one}", file=sys.stderr)
                sys.exit(1)
            write_context_and_commit(target)
            return

        # default: process all
        for r in rows:
            write_context_and_commit(r)

    if __name__ == "__main__":
        main()
