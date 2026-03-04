"""
CRIS Strict Audit Engine

The Bedrock Program — NohMad LLC
Version: 2.0.0

## COPYRIGHT NOTICE

Copyright © 2026 NohMad LLC. All rights reserved.

This software is proprietary to NohMad LLC and is made available in the
Bedrock Program repository for INDEPENDENT VERIFICATION PURPOSES ONLY.

Permitted:

- Running this engine locally to verify the published audit results
- Inspecting the source code to confirm the audit methodology

Not permitted without prior written permission from NohMad LLC:

- Redistribution of this source code in any form
- Use in any commercial product or service
- Modification and republication
- Integration into any other software system

For licensing inquiries: NohMadllc@journalist.com

## WHAT THIS DOES

Audits a corpus of candidate laws against the four CRIS axioms:

A1  Consistency  — A stable fixed point exists
A2  Recursion    — The update rule is closed (input type == output type)
A3  Invariance   — An invariant subset or structure is defined
A4  Selection    — The contraction constant lambda < 1

Each run produces:
1. A console report (pass/fail per law, summary line)
2. strict_audit_results.csv  — human-readable results table
3. audit_proof_<timestamp>.json — tamper-evident proof artifact

The proof artifact contains:
- Full results
- SHA-256 hash of the input data (laws_strict.json)
- SHA-256 hash of the results
- Run timestamp (UTC ISO-8601)
- Engine version

## DEPENDENCIES

Python 3.7+ standard library only. No pip installs required.

## USAGE

python strict_audit.py
python strict_audit.py --laws path/to/laws.json
python strict_audit.py --laws path/to/laws.json --out results_dir/

## FALSIFICATION

A law FAILS this audit if ANY of the four axioms is not satisfied.
The three canonical failures in the 60-law corpus are:
- Pareto Principle    (A4: lambda = 1.2, divergent)
- Dunbar’s Number     (A4: lambda = 1.2, divergent)
- Tragedy of Commons  (A4: lambda = 1.2, divergent)

These are not bugs. They are the correct result.
A law that describes a breakdown mode or empirical heuristic
without a contractive identity attractor should fail A4.
"""

import json
import csv
import hashlib
import argparse
import sys
from datetime import datetime, timezone
from typing import Any, Dict, List, Tuple

# ── Engine Version ──────────────────────────────────────────────────────────

ENGINE_VERSION = "2.0.0"
DEFAULT_LAWS_PATH = "laws_strict.json"

# ── Exceptions ───────────────────────────────────────────────────────────────

class CRISComplianceError(Exception):
    """Raised when a law entry is structurally malformed."""
    pass

# ── Law Schema ───────────────────────────────────────────────────────────────

class CRISLaw:
    """
    Strongly typed representation of a candidate law.

    Required fields in the input JSON object:
        law_name    : str   — human-readable name
        domain      : str   — domain label (Physics, Biology, Logic, ...)
        H           : str   — state space description
        C           : str   — invariant domain description (must contain
                               'subset' or 'invariant' to pass A3)
        F_rule      : str   — update rule or equation (non-empty)
        F_type      : str   — 'discrete' or 'continuous'
        F_spec      : dict  — must contain 'input_type' and 'output_type'
        fixed_points: list  — at least one entry with 'exists': true for A1
        contraction : dict  — must contain 'verified': true and
                               'lambda': float for A4
    """

    REQUIRED_FIELDS = [
        "law_name", "domain", "H", "C",
        "F_rule", "F_type", "F_spec",
        "fixed_points", "contraction"
    ]

    def __init__(self, data: Dict[str, Any]):
        missing = [f for f in self.REQUIRED_FIELDS if f not in data]
        if missing:
            raise CRISComplianceError(
                f"Law '{data.get('law_name', '<unnamed>')}' "
                f"is missing required fields: {missing}"
            )
        self.data = data

# ── Axiom Checks ─────────────────────────────────────────────────────────

    def check_a1(self) -> Tuple[bool, str]:
        """
        A1 — Consistency
        At least one fixed point must exist.
        """
        fps = self.data["fixed_points"]
        if not isinstance(fps, list) or len(fps) == 0:
            return False, "fixed_points must be a non-empty list"
        if any(fp.get("exists", False) for fp in fps):
            return True, "Fixed point exists"
        return False, "No fixed point with exists=true"

    def check_a2(self) -> Tuple[bool, str]:
        """
        A2 — Recursion
        F_rule must be non-empty, F_type must be 'discrete' or 'continuous',
        and input_type must equal output_type (closed update map).
        """
        f_rule = self.data["F_rule"]
        f_type = self.data["F_type"]
        f_spec = self.data["F_spec"]

        if not isinstance(f_rule, str) or not f_rule.strip():
            return False, "F_rule is empty or not a string"
        if f_type not in ("discrete", "continuous"):
            return False, f"F_type '{f_type}' must be 'discrete' or 'continuous'"
        in_t = f_spec.get("input_type")
        out_t = f_spec.get("output_type")
        if in_t != out_t:
            return False, f"Type mismatch: input '{in_t}' != output '{out_t}'"
        return True, f"Closed map ({f_type}, {in_t} -> {out_t})"

    def check_a3(self) -> Tuple[bool, str]:
        """
        A3 — Invariance
        C (the identity domain description) must explicitly reference
        a subset or invariant structure.
        """
        C = self.data["C"]
        if not isinstance(C, str):
            return False, "C must be a string"
        c_lower = C.lower()
        if "subset" in c_lower or "invariant" in c_lower:
            return True, "Invariant structure declared"
        return False, "C does not declare a subset or invariant structure"

    def check_a4(self) -> Tuple[bool, str]:
        """
        A4 — Selection
        contraction.verified must be True and lambda must be strictly < 1.
        lambda >= 1 indicates divergence or marginal stability — not a
        contractive identity attractor.
        """
        contraction = self.data["contraction"]
        if not isinstance(contraction, dict):
            return False, "contraction must be a dict"
        if not contraction.get("verified", False):
            return False, "contraction.verified is not True"
        lam = contraction.get("lambda")
        if lam is None:
            return False, "contraction.lambda is missing"
        if not isinstance(lam, (int, float)):
            return False, f"contraction.lambda must be numeric, got {type(lam).__name__}"
        if lam < 1:
            return True, f"lambda = {lam} (contractive)"
        return False, f"lambda = {lam} >= 1 (divergent or marginal — FAILS Selection)"

# ── Full Audit ────────────────────────────────────────────────────────────

    def audit(self) -> Dict[str, Any]:
        a1_pass, a1_note = self.check_a1()
        a2_pass, a2_note = self.check_a2()
        a3_pass, a3_note = self.check_a3()
        a4_pass, a4_note = self.check_a4()
        compliant = all([a1_pass, a2_pass, a3_pass, a4_pass])
        return {
            "law_name":         self.data["law_name"],
            "domain":           self.data["domain"],
            "A1_Consistency":   a1_pass,
            "A1_note":          a1_note,
            "A2_Recursion":     a2_pass,
            "A2_note":          a2_note,
            "A3_Invariance":    a3_pass,
            "A3_note":          a3_note,
            "A4_Selection":     a4_pass,
            "A4_note":          a4_note,
            "CRIS_COMPLIANT":   compliant,
        }

# ── I/O Utilities ────────────────────────────────────────────────────────────

def load_laws(json_path: str) -> Tuple[List[CRISLaw], str]:
    """
    Load and parse laws from JSON. Returns (laws, sha256_of_file).
    Raises SystemExit with a message on any load failure.
    """
    try:
        with open(json_path, "r", encoding="utf-8") as f:
            raw = f.read()
    except FileNotFoundError:
        print(f"[ERROR] File not found: {json_path}")
        print("        Generate laws_strict.json first or pass --laws <path>")
        sys.exit(1)
    except OSError as e:
        print(f"[ERROR] Cannot read {json_path}: {e}")
        sys.exit(1)

    file_hash = hashlib.sha256(raw.encode("utf-8")).hexdigest()

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"[ERROR] Invalid JSON in {json_path}: {e}")
        sys.exit(1)

    if not isinstance(data, list):
        print("[ERROR] laws_strict.json must be a JSON array of law objects.")
        sys.exit(1)

    laws = []
    for i, entry in enumerate(data):
        try:
            laws.append(CRISLaw(entry))
        except CRISComplianceError as e:
            print(f"[ERROR] Entry {i}: {e}")
            sys.exit(1)

    return laws, file_hash

def hash_results(results: List[Dict[str, Any]]) -> str:
    """SHA-256 of the canonical JSON representation of results."""
    canonical = json.dumps(results, sort_keys=True, ensure_ascii=True)
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()

def write_csv(results: List[Dict[str, Any]], path: str) -> None:
    fieldnames = [
        "law_name", "domain",
        "A1_Consistency", "A2_Recursion", "A3_Invariance", "A4_Selection",
        "CRIS_COMPLIANT",
        "A1_note", "A2_note", "A3_note", "A4_note"
    ]
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for r in results:
            writer.writerow({k: r[k] for k in fieldnames})

def write_proof(
    results: List[Dict[str, Any]],
    input_hash: str,
    results_hash: str,
    laws_path: str,
    timestamp: str,
    path: str
) -> None:
    proof = {
        "bedrock_program": {
            "title": "CRIS Strict Audit — Proof Artifact",
            "description": (
                "This file is a tamper-evident record of a single audit run. "
                "The input_sha256 hash identifies the exact laws corpus audited. "
                "The results_sha256 hash identifies the exact output produced. "
                "Any modification to either the input or results will change "
                "the corresponding hash, invalidating this proof."
            ),
            "engine_version": ENGINE_VERSION,
            "run_timestamp_utc": timestamp,
            "laws_file": laws_path,
            "total_laws": len(results),
            "passed": sum(1 for r in results if r["CRIS_COMPLIANT"]),
            "failed": sum(1 for r in results if not r["CRIS_COMPLIANT"]),
            "input_sha256": input_hash,
            "results_sha256": results_hash,
        },
        "results": results
    }
    with open(path, "w", encoding="utf-8") as f:
        json.dump(proof, f, indent=2, ensure_ascii=False)

# ── Console Report ───────────────────────────────────────────────────────────

def print_report(results: List[Dict[str, Any]]) -> None:
    col_law = 32
    col_dom = 14
    col_status = 10
    header = (
        f"{'LAW NAME':<{col_law}} "
        f"{'DOMAIN':<{col_dom}} "
        f"{'STATUS':<{col_status}} "
        f"A1  A2  A3  A4   FAILURE REASON"
    )
    print()
    print("=" * 90)
    print("  CRIS STRICT AUDIT — THE BEDROCK PROGRAM")
    print("=" * 90)
    print(header)
    print("-" * 90)

    for r in results:
        status = "PASS" if r["CRIS_COMPLIANT"] else "FAIL"
        a1 = "Y" if r["A1_Consistency"] else "N"
        a2 = "Y" if r["A2_Recursion"]   else "N"
        a3 = "Y" if r["A3_Invariance"]  else "N"
        a4 = "Y" if r["A4_Selection"]   else "N"

        # Collect failure reasons
        reasons = []
        if not r["A1_Consistency"]: reasons.append(f"A1: {r['A1_note']}")
        if not r["A2_Recursion"]:   reasons.append(f"A2: {r['A2_note']}")
        if not r["A3_Invariance"]:  reasons.append(f"A3: {r['A3_note']}")
        if not r["A4_Selection"]:   reasons.append(f"A4: {r['A4_note']}")
        reason_str = " | ".join(reasons) if reasons else ""

        print(
            f"  {r['law_name']:<{col_law}} "
            f"{r['domain']:<{col_dom}} "
            f"{status:<{col_status}} "
            f"{a1}   {a2}   {a3}   {a4}   {reason_str}"
        )

    passed = sum(1 for r in results if r["CRIS_COMPLIANT"])
    failed = len(results) - passed
    print("-" * 90)
    print(f"\n  RESULT: {passed}/{len(results)} PASSED  |  {failed} FAILED\n")
    print("=" * 90)

# ── Main ─────────────────────────────────────────────────────────────────────

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="CRIS Strict Audit Engine — The Bedrock Program"
    )
    parser.add_argument(
        "--laws",
        default=DEFAULT_LAWS_PATH,
        help=f"Path to laws JSON file (default: {DEFAULT_LAWS_PATH})"
    )
    parser.add_argument(
        "--out",
        default=".",
        help="Output directory for CSV and proof JSON (default: current directory)"
    )
    return parser.parse_args()

def main() -> None:
    args = parse_args()

    import os
    os.makedirs(args.out, exist_ok=True)

    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    ts_file   = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")

    print(f"\n[CRIS AUDIT ENGINE v{ENGINE_VERSION}]")
    print(f"  Input : {args.laws}")
    print(f"  Time  : {timestamp}")

    # Load
    laws, input_hash = load_laws(args.laws)
    print(f"  Laws loaded : {len(laws)}")
    print(f"  Input SHA-256: {input_hash}")

    # Audit
    results = [law.audit() for law in laws]

    # Hashes
    results_hash = hash_results(results)

    # Console
    print_report(results)

    # CSV
    csv_path = os.path.join(args.out, "strict_audit_results.csv")
    write_csv(results, csv_path)
    print(f"  CSV saved    : {csv_path}")

    # Proof JSON
    proof_path = os.path.join(args.out, f"audit_proof_{ts_file}.json")
    write_proof(results, input_hash, results_hash, args.laws, timestamp, proof_path)
    print(f"  Proof saved  : {proof_path}")
    print(f"  Results SHA-256: {results_hash}")
    print()

if __name__ == "__main__":
    main()