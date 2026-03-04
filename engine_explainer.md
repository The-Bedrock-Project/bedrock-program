# The CRIS Audit Engine: A Plain Language Explainer

**The Bedrock Program — Christopher Lamarr Brown — NohMad LLC**
Version 2.0.0 | January 2026

-----

## What This Is

The CRIS Audit Engine is a structural diagnostic instrument. It does one thing: it tests whether a candidate law — a rule, principle, or governing structure from any domain — satisfies the four conditions required for genuine persistence.

Those four conditions are not opinions. They are derived from a single foundational question:

*What must be true for anything to remain identifiable as the same thing across time and transformation?*

The answer to that question is CRIS.

-----

## The Four Axioms

**A1 — Consistency (Fixed Point)**

A persistent entity must have a state it can return to. In formal terms: there must exist a fixed point x* such that applying the governing rule F to x* returns x*. Without this, the system has no stable “self” — it is pure drift with no identity anchor.

*In plain language: Does this law have a home state? Can the system governed by this law ever come to rest?*

**A2 — Recursion (Closed Map)**

The update rule must be applicable indefinitely. The output of one application must be a valid input for the next. If applying the rule produces something the rule cannot process, the system terminates rather than persists. The map must be closed — input type must equal output type.

*In plain language: Can this law keep running? Does it eat its own output without breaking?*

**A3 — Invariance (Stable Domain)**

There must be a region or structure within the state space that the law preserves. The system must have a defined domain of identity — a set of states that remain “inside” under the law’s operation. Without this, the system has no recognizable kind or nature; it can become anything, which means it is nothing determinate.

*In plain language: Does this law maintain a boundary? Is there a defined region where the system is still itself?*

**A4 — Selection (Contraction)**

This is the strictest gate. Perturbations — noise, disruptions, deviations — must decay back toward the fixed point. The contraction constant lambda must be strictly less than 1. Lambda is the rate at which the distance between any two states shrinks under repeated application of the law. If lambda is greater than or equal to 1, deviations grow or stay constant. The system cannot recover. It cannot maintain identity under pressure.

*In plain language: When something pushes the system off its fixed point, does it come back? Or does it keep drifting?*

-----

## Why A4 Is the Strictest Gate

A law can have a fixed point (A1), be indefinitely applicable (A2), and maintain a domain (A3) — and still fail to be a genuine governing law of a persistent entity if it cannot recover from perturbation.

A system that collapses under any disturbance is not a stable entity. It is a temporary configuration. Lambda >= 1 is the mathematical signature of that instability.

This is why the three failures in the 60-law corpus fail only A4 and not the other three axioms:

- **Pareto Principle**: Describes a statistical pattern of concentration. It passes A1 (there is a distribution it points toward), A2 (the rule applies iteratively), and A3 (there is a defined domain). But the dynamics it describes are divergent — the rich-get-richer accumulation process has lambda > 1. It is an empirical observation about how resources concentrate, not a law governing a persistent entity.
- **Dunbar’s Number**: Describes a cognitive limit on stable social relationships (~150). It passes A1, A2, and A3. But it is a heuristic bound, not a contractive attractor. Social groups do not return to 150 after perturbation — they fragment, scale, or collapse. Lambda >= 1.
- **Tragedy of the Commons**: Describes a failure mode — the destruction of shared resources through individually rational overconsumption. It passes A1, A2, and A3. But its “fixed point” is collapse, and the dynamics driving toward that collapse are divergent. It is a law of breakdown, not a law governing persistence. Lambda > 1.

These are not errors in the audit. They are correct results. The engine is doing exactly what it should: distinguishing laws that govern persistent entities from patterns, heuristics, and failure modes that do not.

-----

## How the Engine Works

The engine takes a JSON file containing law entries. Each entry must specify the eight required fields: law name, domain, state space (H), identity domain (C), update rule (F_rule), rule type (F_type), rule specification (F_spec), fixed points, and contraction data.

For each law, the engine runs four checks in sequence:

1. Scans the fixed_points array for at least one entry with exists: true
1. Checks that F_rule is non-empty, F_type is valid, and input_type equals output_type in F_spec
1. Checks that the C field contains the word “subset” or “invariant”
1. Checks that contraction.verified is true and contraction.lambda is strictly less than 1

A law passes if and only if all four checks return true.

-----

## The Proof Artifact

Every run of the engine produces three outputs:

**strict_audit_results.csv** — A human-readable table of all results with pass/fail for each axiom and a failure reason for any failing law.

**audit_proof_TIMESTAMP.json** — A tamper-evident proof record containing:

- The full results
- A SHA-256 hash of the input file (laws_strict.json)
- A SHA-256 hash of the results
- The run timestamp in UTC ISO-8601 format
- The engine version

The SHA-256 hashes are cryptographic fingerprints. If anyone modifies the input data or the results after the fact, the hashes will no longer match. The proof artifact is a verifiable record that a specific corpus of laws was audited at a specific time and produced a specific result.

Anyone can re-run the engine on the same input and verify they get the same hashes. The audit is reproducible, transparent, and independently verifiable.

-----

## What This Does Not Claim

The engine audits structural properties of formal representations of laws. It does not:

- Determine whether a law is empirically true
- Determine whether a law is complete or adequate for its domain
- Determine whether the formal representation of a law captures all relevant features
- Replace domain expertise in any field

The CRIS framework is a structural filter. A law that passes all four axioms is structurally consistent with governing a persistent entity. A law that fails one or more axioms is structurally inconsistent with that role — regardless of how useful, accurate, or widely accepted it may be as an empirical description.

-----

## Running the Engine

Requirements: Python 3.7 or higher. No external packages required.

```
python strict_audit.py
python strict_audit.py --laws path/to/laws.json
python strict_audit.py --laws path/to/laws.json --out results/
```

The engine will print a full report to the console and save the CSV and proof artifact to the specified output directory.

-----

## The Result

60 laws audited across physics, biology, mathematics, logic, set theory, information theory, statistics, chemistry, economics, game theory, and neuroscience.

**57 passed. 3 failed.**

The three that failed are exactly the right three — not because the audit was designed to produce a predetermined result, but because the structural test correctly distinguishes laws governing persistent entities from patterns and failure modes that do not.

That distinction is what the CRIS framework exists to make.

-----

*The Bedrock Program — Independent Structural Research — 2026*
