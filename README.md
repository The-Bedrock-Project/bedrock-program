# The Bedrock Program

**A formally verified structural constraint on determinate existence.**

---

## What This Is

The Bedrock Program is an independent structural research initiative built on a single formally verified result:

> **Any entity that exists as a determinate form must satisfy two independent structural conditions: idempotent closure and energetic viability. Violation of either condition is eliminative.**

This is not a philosophical opinion. It has been machine-verified in Lean 4.

---

## The Formal Result

**Paper:** *Persistence Without Contradiction: A Minimal Foundation for Existence* (2026)
**DOI:** [10.5281/zenodo.19023530](https://zenodo.org/records/19023530)
**Lean 4 Proof:** [OntologicalBedrock1.lean — compiles clean against Mathlib, no errors, no placeholders

The proof establishes:

- **Idempotent Closure** — a form must return itself under iterated re-application of its defining boundary
- **Energetic Viability** — maintenance cost must remain within available sustaining capacity at every step
- **GCC Elimination** — any form containing a globally coupled contradiction cannot exist as a determinate entity
- **Independence** — the two conditions filter independently (Theorem 2.3)
- **Self-Application** — the constraint satisfies its own conditions by explicit calculation, without regress (Theorem 5.1)
- **No Regress** — any well-formed denial of the constraint must itself satisfy the constraint in order to target it

---

## To Compile the Proof

```bash
# Install Lean 4 via elan
curl https://raw.githubusercontent.com/leanprover/elan/master/elan-init.sh -sSf | sh

# Add to lakefile.lean:
require mathlib from git
  "https://github.com/leanprover-community/mathlib4"

# Build
lake update && lake build
```

No errors. No warnings. No gaps.

---

## The Bedrock Statement

The one sentence that survives all scrutiny:

**Reality consists of whatever can continue being itself without breaking. Everything else is elaboration.**

---

## The Maintenance Test

Built on one question: **Does this persist on its own, or does it have to be held?**

**Response Compression** — Every question leads back to the same small set of approved answers. A self-sustaining claim expands under questioning. A maintained claim contracts.

**Burden Asymmetry** — You are required to disprove the claim rather than the claim being required to prove itself.

**Authority Substitution** — Evidence is replaced by the invocation of authority as a terminal endpoint.

**If the weight of proof is on the claim — you are standing on Bedrock.**

**If the weight of proof is on you — you are standing in a cage.**

---

## Falsification Conditions

The constraint is refuted by demonstration of any of the following:

1. A form persisting as determinate while containing a globally coupled contradiction with no stable partition witness
2. A form re-identifiable across transformations while lacking any selective criterion
3. A form with unbounded maintenance cost persisting indefinitely on finite sustaining capacity
4. Demonstration that the constraint itself contains a GCC or violates energetic viability at the level of its own statement

Absent a demonstrated instance, the constraint stands.

---

## Repository Contents

```
README.md                    — This document
MISSION.md                   — Research program scope and objectives
LICENSE.md                   — Terms of use
PWOGCC.pdf                   — Full paper: Persistence Without Contradiction
bedrock_complete_proof.lean  — Complete Lean 4 formal proof (compiles clean)
bedrock statement.docx       — The Bedrock Statement
maintenance test v2.docx     — The Maintenance Test: A Structural Field Guide
```

---

## Team

**Christopher Lamarr Brown** — Director / Principal Researcher
Framework integrity, research architecture, formal derivations, final editorial control.

**Barbara Reed** — Operations Director / Program Manager

**Henry Young** — Technical Lead / Data Infrastructure

**Alex Toal** — Distribution Lead / Content Strategist

---

## Support This Work

The Bedrock Program is independently funded. No institutional grants. No platform funding.

**[Fund The Bedrock Program on GiveSendGo](https://www.givesendgo.com/Bedrock-Program)**

---

## Contact

**NohMad LLC — The Bedrock Research Team**
NohMadllc@journalist.com
[bedrockprogram.com](https://www.bedrockprogram.com)

---

*Consistency is Law. Selection is the Closure.*

*The Bedrock Program — Independent Structural Research — NohMad LLC — 2026*
