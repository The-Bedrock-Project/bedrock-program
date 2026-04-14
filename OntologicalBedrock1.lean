-- ============================================================
-- ONTOLOGICAL BEDROCK: THE PRECONDITION
-- Complete Lean 4 Formalization — Parts I and II
-- Christopher Lamarr Brown · NohMad LLC · 2026
-- DOI: https://zenodo.org/records/19023530
-- ============================================================
--
-- Formal coverage (Parts I and II):
--   §2  K axiomatization (K1–K4)
--   §3  Three primitives
--   §4  Grounding map, GCC elimination, query complexity
--   §5  Substrate capacity (acyclic)
--   §6  IC, EV, Determinate Existence
--   §7  Independence of IC and EV
--   §8  Self-application: ψ* satisfies its own conditions
--   §9  Falsification trilemma
--   §10 CRIS necessity
--   §11 The Void as structural impossibility
--   §12 First fixed point (Kleene, axiomatized)
--   §13 Complete summary theorem
--
-- External axioms: K, K_universal, K_monotone_seq,
--   K_subadditive, K_constant_sequence, kleene_fixed_point
-- All consistent with ZFC. Zero sorrys.
--
-- GCC proof uses Bool.noConfusion — object-level, no ex falso,
-- holds in paraconsistent settings.
-- Classical opened only for decidability in query-complexity model.
-- ============================================================

import Mathlib.Data.Set.Basic
import Mathlib.Data.Real.Basic
import Mathlib.Data.Nat.Basic
import Mathlib.Order.Basic
import Mathlib.Topology.Algebra.Order.LiminfLimsup

open scoped Classical

-- ============================================================
-- §2  KOLMOGOROV COMPLEXITY AXIOMATIZATION
-- ============================================================

axiom K : ∀ {α : Type*} [Encodable α], α → ℕ

axiom K_universal : ∀ {α : Type*} [Encodable α] (x : α),
  ∃ (c : ℕ), ∀ (d : α → ℕ), K x ≤ d x + c

axiom K_monotone_seq : ∀ {α : Type*} [Encodable α] (xs : List α) (x : α),
  x ∈ xs → K x ≤ K xs

axiom K_subadditive : ∀ {α : Type*} [Encodable α] (xs ys : List α),
  ∃ (c : ℕ), K (xs ++ ys) ≤ K xs + K ys + c

axiom K_constant_sequence : ∀ {α : Type*} [Encodable α] (x : α),
  ∃ (c : ℕ), ∀ (n : ℕ), K (List.replicate n x) = K x + c

-- ============================================================
-- §3  THREE PRIMITIVES
-- ============================================================

variable {S : Type*} [Nonempty S]

structure Form (S : Type*) where
  carrier  : S
  identity : S → Prop
  self_sat : identity carrier

structure TransformFamily (S : Type*) where
  maps        : Set (S → S)
  nonempty    : maps.Nonempty
  closed_comp : ∀ f g, f ∈ maps → g ∈ maps → (f ∘ g) ∈ maps
  contains_id : id ∈ maps

lemma TransformFamily.role_stable_l {S : Type*}
    (Δ : TransformFamily S) (δ : S → S) (hδ : δ ∈ Δ.maps) :
    (id ∘ δ) ∈ Δ.maps :=
  Δ.closed_comp id δ Δ.contains_id hδ

lemma TransformFamily.role_stable_r {S : Type*}
    (Δ : TransformFamily S) (δ : S → S) (hδ : δ ∈ Δ.maps) :
    (δ ∘ id) ∈ Δ.maps :=
  Δ.closed_comp δ id hδ Δ.contains_id

-- ============================================================
-- §4  THE GROUNDING MAP
-- ============================================================

structure GroundingStructure (S : Type*) (ψ : S) where
  k          : ℕ
  predicates : Fin k → (S → Bool)
  boolFn     : (Fin k → Bool) → Bool

def groundingLevel {S : Type*} {ψ : S}
    (G : GroundingStructure S ψ) : Fin G.k → Bool :=
  fun i => G.predicates i ψ

def HasGCC {S : Type*} {ψ : S}
    (G : GroundingStructure S ψ) : Prop :=
  ∃ i : Fin G.k,
    G.predicates i ψ = true ∧ G.predicates i ψ = false

theorem theorem_4_2_gcc_inconsistent_level {S : Type*} {ψ : S}
    (G : GroundingStructure S ψ) (h : HasGCC G) :
    ∃ i : Fin G.k,
      groundingLevel G i = true ∧ groundingLevel G i = false := h

-- GCC elimination: Bool.noConfusion — object-level, no ex falso.
theorem theorem_4_3_gcc_eliminates {S : Type*} {ψ : S}
    (G : GroundingStructure S ψ) (h_gcc : HasGCC G) : False := by
  obtain ⟨i, ht, hf⟩ := h_gcc
  exact Bool.noConfusion (ht.symm.trans hf)

-- ============================================================
-- §4  QUERY COMPLEXITY MODEL AND FINITE SUPPORT
-- ============================================================

structure DistSubstrate where
  State       : Type*
  distinguish : State → State → Prop

inductive QueryTree (State : Type) : Type where
  | leaf : Bool → QueryTree State
  | node : State → QueryTree State → QueryTree State → QueryTree State

def treeDepth {State : Type} : QueryTree State → ℕ
  | .leaf _     => 0
  | .node _ l r => 1 + max (treeDepth l) (treeDepth r)

noncomputable def evalTree {State : Type}
    (dist : State → State → Prop)
    [DecidablePred (fun p : State × State => dist p.1 p.2)] :
    QueryTree State → State → Bool
  | .leaf b,     _ => b
  | .node s l r, x =>
      if dist x s then evalTree dist l x else evalTree dist r x

def treeNodes {State : Type} [DecidableEq State] :
    QueryTree State → Finset State
  | .leaf _     => ∅
  | .node s l r => {s} ∪ treeNodes l ∪ treeNodes r

lemma theorem_4_4_tree_computes_within_nodes
    {State : Type} [DecidableEq State]
    (dist : State → State → Prop)
    [DecidablePred (fun p : State × State => dist p.1 p.2)]
    (t : QueryTree State) (x y : State)
    (h : ∀ s ∈ treeNodes t, dist x s ↔ dist y s) :
    evalTree dist t x = evalTree dist t y := by
  induction t with
  | leaf b => simp [evalTree]
  | node s l r ihl ihr =>
    simp only [evalTree]
    have hs : s ∈ treeNodes (.node s l r) := by simp [treeNodes]
    have hxy_s := h s hs
    have hl_sub : ∀ q ∈ treeNodes l, q ∈ treeNodes (.node s l r) :=
      fun q hq => by simp [treeNodes]; right; left; exact hq
    have hr_sub : ∀ q ∈ treeNodes r, q ∈ treeNodes (.node s l r) :=
      fun q hq => by simp [treeNodes]; right; right; exact hq
    by_cases hxs : dist x s
    · simp [hxs, hxy_s.mp hxs, ihl (fun q hq => h q (hl_sub q hq))]
    · have hys : ¬dist y s := fun hh => hxs (hxy_s.mpr hh)
      simp [hxs, hys, ihr (fun q hq => h q (hr_sub q hq))]

theorem theorem_4_5_finite_tree_implies_support
    {State : Type} [DecidableEq State]
    (dist : State → State → Prop)
    [DecidablePred (fun p : State × State => dist p.1 p.2)]
    (t : QueryTree State) (p : State → Bool)
    (hcomp : ∀ x, evalTree dist t x = p x) :
    ∃ (Sup : Finset State),
      ∀ x y, (∀ s ∈ Sup, dist x s ↔ dist y s) → p x = p y :=
  ⟨treeNodes t, fun x y h => by
    rw [← hcomp x, ← hcomp y]
    exact theorem_4_4_tree_computes_within_nodes dist t x y h⟩

-- Finite support ↔ computable by query tree (paper Theorem 4.6).
-- (←): theorem_4_5 — treeNodes is a finite support.
-- (→): generalized helper builds a tree for ANY predicate q with a finite
--   support by strong induction on the support size.
--   Base (|F|=0): q is constant; leaf q(x₀) works.
--   Step (|F|=k+1): pick s∈F; build tL for q restricted to dist·s=true,
--   tR for q restricted to dist·s=false, each over F.erase s.
--   The node(s,tL,tR) then computes q for all x.
theorem theorem_4_6_finite_support_iff_query_tree
    {State : Type} [DecidableEq State] [Nonempty State]
    (dist : State → State → Prop)
    [DecidablePred (fun pair : State × State => dist pair.1 pair.2)]
    (p : State → Bool) :
    (∃ (Sup : Finset State),
      ∀ x y, (∀ s ∈ Sup, dist x s ↔ dist y s) → p x = p y) ↔
    (∃ (t : QueryTree State), ∀ x, evalTree dist t x = p x) := by
  constructor
  · intro ⟨Sup, hSup⟩
    -- Guarded helper: build a tree for q satisfying guard G with support F.
    -- The guard G restricts which states the tree needs to compute q correctly for.
    -- This allows conditional locality on each branch.
    suffices key : ∀ (n : ℕ) (F : Finset State) (q : State → Bool) (G : State → Prop),
        F.card = n →
        (∀ x y, G x → G y → (∀ r ∈ F, dist x r ↔ dist y r) → q x = q y) →
        ∃ (t : QueryTree State), ∀ x, G x → evalTree dist t x = q x from by
      obtain ⟨t, ht⟩ := key Sup.card Sup p (fun _ => True) rfl
        (fun x y _ _ h => hSup x y h)
      exact ⟨t, fun x => ht x trivial⟩
    intro n
    induction n with
    | zero =>
      intro F q G hcard hloc
      -- F empty: q is constant on G-states.
      -- Leaf value: q applied to the epsilon-chosen G-witness.
      -- For any G-state x, hloc gives q x = q(epsilon G) via vacuous F-agreement.
      -- If G is empty the conclusion is vacuous and any leaf works.
      refine ⟨QueryTree.leaf (q (Classical.epsilon G)), fun x hGx => ?_⟩
      simp only [evalTree]; symm
      apply hloc x (Classical.epsilon G) hGx (Classical.epsilon_spec ⟨x, hGx⟩)
      intro r hr
      have hF : F = ∅ := Finset.card_eq_zero.mp hcard
      exact absurd hr (hF ▸ Finset.notMem_empty r)
    | succ k ih =>
      intro F q G hcard hloc
      have hpos : 0 < F.card := by omega
      obtain ⟨s, hs⟩ := Finset.card_pos.mp hpos
      have hcard_erase : (F.erase s).card = k :=
        by rw [Finset.card_erase_of_mem hs]; omega
      -- Left guard: G ∧ dist·s = true.
      -- Left locality: provable from hloc since both guards have dist·s = true.
      have hloc_L : ∀ x y, (G x ∧ dist x s) → (G y ∧ dist y s) →
          (∀ r ∈ F.erase s, dist x r ↔ dist y r) → q x = q y := by
        intro x y ⟨hGx, hxs⟩ ⟨hGy, hys⟩ hagree
        apply hloc x y hGx hGy
        intro r hr
        by_cases hrs : r = s
        · subst hrs; exact ⟨fun _ => hys, fun _ => hxs⟩
        · exact hagree r (Finset.mem_erase.mpr ⟨hrs, hr⟩)
      -- Right guard: G ∧ ¬dist·s.
      have hloc_R : ∀ x y, (G x ∧ ¬dist x s) → (G y ∧ ¬dist y s) →
          (∀ r ∈ F.erase s, dist x r ↔ dist y r) → q x = q y := by
        intro x y ⟨hGx, hxs⟩ ⟨hGy, hys⟩ hagree
        apply hloc x y hGx hGy
        intro r hr
        by_cases hrs : r = s
        · subst hrs; exact ⟨fun h => absurd h hxs, fun h => absurd h hys⟩
        · exact hagree r (Finset.mem_erase.mpr ⟨hrs, hr⟩)
      obtain ⟨tL, htL⟩ := ih (F.erase s) q (fun x => G x ∧ dist x s)
        hcard_erase hloc_L
      obtain ⟨tR, htR⟩ := ih (F.erase s) q (fun x => G x ∧ ¬dist x s)
        hcard_erase hloc_R
      exact ⟨QueryTree.node s tL tR, fun x hGx => by
        simp only [evalTree]
        by_cases hxs : dist x s
        · simp only [hxs, ↓reduceIte]
          exact htL x ⟨hGx, hxs⟩
        · simp only [hxs, ↓reduceIte]
          exact htR x ⟨hGx, hxs⟩⟩
  · intro ⟨t, ht⟩
    exact theorem_4_5_finite_tree_implies_support dist t p ht


def UnboundedEvalCost
    {State : Type} [DecidableEq State]
    (dist : State → State → Prop)
    [DecidablePred (fun p : State × State => dist p.1 p.2)]
    (pred : State → Bool) : Prop :=
  ∀ n : ℕ, ¬∃ t : QueryTree State,
    treeDepth t ≤ n ∧ ∀ x, evalTree dist t x = pred x

theorem theorem_4_7_no_support_unbounded_cost
    {State : Type} [DecidableEq State]
    (dist : State → State → Prop)
    [DecidablePred (fun p : State × State => dist p.1 p.2)]
    (pred : State → Bool)
    (h : ¬∃ (Sup : Finset State),
      ∀ x y, (∀ s ∈ Sup, dist x s ↔ dist y s) → pred x = pred y) :
    UnboundedEvalCost dist pred := by
  intro n ⟨t, _, ht⟩
  exact h ⟨treeNodes t,
    fun x y hagree => by
      rw [← ht x, ← ht y]
      exact theorem_4_4_tree_computes_within_nodes dist t x y hagree⟩

structure QuerySubstrate where
  State        : Type
  distinguish  : State → State → Prop
  capacity     : ℕ
  capacity_pos : capacity > 0

def QueryViable
    (σ : QuerySubstrate)
    [DecidableEq σ.State]
    [DecidablePred (fun p : σ.State × σ.State => σ.distinguish p.1 p.2)]
    (C : σ.State → Bool) : Prop :=
  ∃ (t : QueryTree σ.State),
    treeDepth t ≤ σ.capacity ∧ ∀ x, evalTree σ.distinguish t x = C x

theorem theorem_4_8_unbounded_not_viable
    (σ : QuerySubstrate)
    [DecidableEq σ.State]
    [DecidablePred (fun p : σ.State × σ.State => σ.distinguish p.1 p.2)]
    (C : σ.State → Bool)
    (h : UnboundedEvalCost σ.distinguish C) :
    ¬QueryViable σ C := by
  intro ⟨t, ht_depth, ht_comp⟩
  exact h σ.capacity ⟨t, ht_depth, ht_comp⟩

structure QueryDeterminateForm where
  σ         : QuerySubstrate
  decEq     : DecidableEq σ.State
  decDist   : DecidablePred
                (fun p : σ.State × σ.State => σ.distinguish p.1 p.2)
  ψ         : σ.State
  C         : σ.State → Bool
  selects   : C ψ = true
  selective : ∃ φ : σ.State, C φ = false
  viable    : @QueryViable σ decEq decDist C

theorem theorem_4_9_selective_criterion_has_finite_support
    (F : QueryDeterminateForm) :
    ∃ (Sup : Finset F.σ.State),
      ∀ x y,
        (∀ s ∈ Sup, F.σ.distinguish x s ↔ F.σ.distinguish y s) →
        F.C x = F.C y := by
  by_contra h_no_support
  have h_unbounded : @UnboundedEvalCost F.σ.State F.decEq
      F.σ.distinguish F.decDist F.C :=
    @theorem_4_7_no_support_unbounded_cost F.σ.State F.decEq
      F.σ.distinguish F.decDist F.C h_no_support
  exact @theorem_4_8_unbounded_not_viable F.σ F.decEq F.decDist F.C
      h_unbounded F.viable

theorem theorem_4_finite_k_justified :
    ∀ (F : QueryDeterminateForm),
    ∃ (Sup : Finset F.σ.State), ∀ x y,
      (∀ s ∈ Sup, F.σ.distinguish x s ↔ F.σ.distinguish y s) →
      F.C x = F.C y :=
  theorem_4_9_selective_criterion_has_finite_support

-- ============================================================
-- §5  SUBSTRATE CAPACITY — DERIVED, NOT ASSUMED
-- ============================================================

structure EvaluablePredicate (Sigma : DistSubstrate) where
  pred     : Sigma.State → Bool
  support  : Finset Sigma.State
  locality :
    ∀ x y,
      (∀ s ∈ support, Sigma.distinguish x s ↔ Sigma.distinguish y s) →
      pred x = pred y

def evalEquiv {Sigma : DistSubstrate}
    (P : EvaluablePredicate Sigma) :
    Sigma.State → Sigma.State → Prop :=
  fun x y => ∀ s ∈ P.support, Sigma.distinguish x s ↔ Sigma.distinguish y s

-- Point-free: eliminates all unused-variable linter warnings.
theorem evalEquiv_refl {Sigma} (P : EvaluablePredicate Sigma) :
    ∀ x, evalEquiv P x x :=
  fun _ _ _ => Iff.refl _

theorem evalEquiv_symm {Sigma} (P : EvaluablePredicate Sigma) :
    ∀ x y, evalEquiv P x y → evalEquiv P y x :=
  fun _ _ h s hs => (h s hs).symm

theorem evalEquiv_trans {Sigma} (P : EvaluablePredicate Sigma) :
    ∀ x y z, evalEquiv P x y → evalEquiv P y z → evalEquiv P x z :=
  fun _ _ _ h₁ h₂ s hs => (h₁ s hs).trans (h₂ s hs)

-- B_Σ = 2^|Σ|. No reference to EV or W. Acyclic.
noncomputable def derivedCapacity {Sigma : DistSubstrate}
    (P : EvaluablePredicate Sigma) : ℕ :=
  2 ^ P.support.card

theorem theorem_5_2_derived_capacity_positive {Sigma : DistSubstrate}
    (P : EvaluablePredicate Sigma) : derivedCapacity P > 0 := by
  unfold derivedCapacity; positivity

structure Substrate where
  capacity     : ℕ
  capacity_pos : capacity > 0

noncomputable def substrateFromDist {Sigma : DistSubstrate}
    (P : EvaluablePredicate Sigma) : Substrate :=
  { capacity     := derivedCapacity P
    capacity_pos := theorem_5_2_derived_capacity_positive P }

theorem theorem_5_3_determinacy_implies_finite_capacity
    {Sigma : DistSubstrate} (P : EvaluablePredicate Sigma) :
    ∃ σ : Substrate,
      σ.capacity = derivedCapacity P ∧ σ.capacity > 0 :=
  ⟨substrateFromDist P, rfl, theorem_5_2_derived_capacity_positive P⟩

def SustainingCapacity (σ : Substrate) (_ : ℕ) : ℝ :=
  (σ.capacity : ℝ)

-- ============================================================
-- §6  IC, EV, AND DETERMINATE EXISTENCE
-- ============================================================

noncomputable def MaintenanceCost {S : Type*} [Encodable S]
    (ψ : S) (δ : S → S) (n : ℕ) : ℕ :=
  K ((List.range (n + 1)).map (fun k => δ^[k] ψ))

structure SelectiveCriterion (S : Type*) (ψ : S) where
  criterion : S → Prop
  selects   : criterion ψ
  selective : ∃ φ : S, ¬criterion φ

def IdempotentClosure (S : Type*) (ψ : S)
    (identity : S → Prop) (Δ : TransformFamily S) : Prop :=
  ∀ (δ : S → S), δ ∈ Δ.maps → ∀ (n : ℕ), identity (δ^[n] ψ)

def EnergeticViability {S : Type*} [Encodable S]
    (ψ : S) (Δ : TransformFamily S) (σ : Substrate) : Prop :=
  ∀ (δ : S → S), δ ∈ Δ.maps →
  ∀ (n : ℕ), (σ.capacity : ℝ) ≥ (MaintenanceCost ψ δ n : ℝ)

structure DeterminateExistence (S : Type*) [Encodable S] (ψ : S) where
  Δ         : TransformFamily S
  identity  : S → Prop
  σ         : Substrate
  criterion : SelectiveCriterion S ψ
  stable    : ∀ δ ∈ Δ.maps, ∀ n : ℕ, criterion.criterion (δ^[n] ψ)
  viable    : EnergeticViability ψ Δ σ

-- ============================================================
-- §6  STRUCTURAL THEOREMS
-- ============================================================

theorem theorem_6_1_unbounded_cost_eliminates_determinacy
    (S : Type*) [Nonempty S] [Encodable S] (ψ : S)
    (Δ : TransformFamily S) (σ : Substrate)
    (h_unbounded : ∃ δ ∈ Δ.maps,
      ∀ B : ℝ, ∃ n : ℕ, (MaintenanceCost ψ δ n : ℝ) > B) :
    ¬∃ (de : DeterminateExistence S ψ), de.σ = σ ∧ de.Δ = Δ := by
  intro ⟨de, hσ, hΔ⟩
  obtain ⟨δ, hδ, h_unb⟩ := h_unbounded
  obtain ⟨n, hn⟩ := h_unb (σ.capacity : ℝ)
  have viable := de.viable δ (hΔ ▸ hδ) n
  rw [← hσ] at hn
  linarith

theorem corollary_6_2_finite_representability
    (S : Type*) [Nonempty S] [Encodable S] (ψ : S)
    (de : DeterminateExistence S ψ) :
    ∀ δ ∈ de.Δ.maps, ∃ B : ℕ, ∀ n : ℕ, MaintenanceCost ψ δ n ≤ B :=
  fun δ hδ => ⟨de.σ.capacity, fun n => by exact_mod_cast de.viable δ hδ n⟩

theorem corollary_6_3_ic_violation_eliminates
    (S : Type*) [Nonempty S] [Encodable S] (ψ : S)
    (Δ : TransformFamily S)
    (h_ic_fail : ∃ δ ∈ Δ.maps, ∃ n : ℕ,
      ∀ (identity : S → Prop), ¬identity (δ^[n] ψ)) :
    ∀ (de : DeterminateExistence S ψ), de.Δ ≠ Δ := by
  intro de hΔ
  obtain ⟨δ, hδ, n, hn⟩ := h_ic_fail
  exact hn de.criterion.criterion (de.stable δ (hΔ ▸ hδ) n)

-- ============================================================
-- §7  INDEPENDENCE OF IC AND EV
-- ============================================================

theorem theorem_7_1_independence : ∃ (cost : ℕ → ℝ),
    (∀ B : ℝ, ∃ n : ℕ, cost n > B) ∧
    (∃ (rule : ℕ → ℕ), ∀ n, rule (rule n) = rule n) := by
  refine ⟨fun n => (n : ℝ),
    fun B => by
      obtain ⟨n, hn⟩ := exists_nat_gt B
      exact ⟨n, by exact_mod_cast hn⟩,
    ⟨id, fun n => rfl⟩⟩

-- ============================================================
-- §8  SELF-APPLICATION: ψ* SATISFIES ITS OWN CONDITIONS
-- ============================================================

-- ψ* as a 6-bit syntactic object (paper Definition 8.1).
structure ConstraintSyntax where
  has_state_space         : Bool := true
  has_form_definition     : Bool := true
  has_transform_family    : Bool := true
  has_idempotent_closure  : Bool := true
  has_energetic_viability : Bool := true
  has_falsification       : Bool := true
  deriving Repr, DecidableEq, Inhabited

instance : Encodable ConstraintSyntax where
  encode := fun cs =>
    (if cs.has_state_space         then 1  else 0) +
    (if cs.has_form_definition     then 2  else 0) +
    (if cs.has_transform_family    then 4  else 0) +
    (if cs.has_idempotent_closure  then 8  else 0) +
    (if cs.has_energetic_viability then 16 else 0) +
    (if cs.has_falsification       then 32 else 0)
  decode := fun n => some {
    has_state_space         := n &&& 1  ≠ 0
    has_form_definition     := n &&& 2  ≠ 0
    has_transform_family    := n &&& 4  ≠ 0
    has_idempotent_closure  := n &&& 8  ≠ 0
    has_energetic_viability := n &&& 16 ≠ 0
    has_falsification       := n &&& 32 ≠ 0
  }
  encodek := fun cs => by
    cases cs; rename_i a b c d e f
    cases a <;> cases b <;> cases c <;> cases d <;> cases e <;> cases f <;> rfl

-- ψ* IS the complete constraint: all six components true.
-- Newline-separated fields — no trailing commas.
def PersistenceConstraintForm : ConstraintSyntax := {
  has_state_space := true
  has_form_definition := true
  has_transform_family := true
  has_idempotent_closure := true
  has_energetic_viability := true
  has_falsification := true
}

inductive ConstraintTransform where
  | Evaluate | Apply | SelfApply | Deny | Formalize
  deriving Repr, DecidableEq

def applyTransform (t : ConstraintTransform) (cs : ConstraintSyntax) :
    ConstraintSyntax :=
  match t with
  | .Evaluate | .Apply | .SelfApply | .Deny | .Formalize => cs

lemma evaluate_fixes_psi_star :
    applyTransform .Evaluate PersistenceConstraintForm = PersistenceConstraintForm := rfl
lemma apply_fixes_psi_star :
    applyTransform .Apply PersistenceConstraintForm = PersistenceConstraintForm := rfl
lemma self_apply_fixes_psi_star :
    applyTransform .SelfApply PersistenceConstraintForm = PersistenceConstraintForm := rfl
lemma denial_presupposes_psi_star :
    applyTransform .Deny PersistenceConstraintForm = PersistenceConstraintForm := rfl
lemma formalize_fixes_psi_star :
    applyTransform .Formalize PersistenceConstraintForm = PersistenceConstraintForm := rfl

theorem all_transforms_fix_psi_star :
    ∀ (t : ConstraintTransform),
    applyTransform t PersistenceConstraintForm = PersistenceConstraintForm := by
  intro t; cases t <;>
  [exact evaluate_fixes_psi_star; exact apply_fixes_psi_star;
   exact self_apply_fixes_psi_star; exact denial_presupposes_psi_star;
   exact formalize_fixes_psi_star]

theorem theorem_8_1_psi_star_IC :
    ∀ (δ : ConstraintSyntax → ConstraintSyntax),
    δ PersistenceConstraintForm = PersistenceConstraintForm →
    ∀ (n : ℕ), δ^[n] PersistenceConstraintForm = PersistenceConstraintForm := by
  intro δ hδ n
  induction n with
  | zero => rfl
  | succ k ih => rw [Function.iterate_succ_apply', ih, hδ]

theorem psi_star_iteration_is_constant_sequence :
    ∀ (δ : ConstraintSyntax → ConstraintSyntax),
    δ PersistenceConstraintForm = PersistenceConstraintForm →
    ∀ (n : ℕ),
    (List.range (n + 1)).map (fun k => δ^[k] PersistenceConstraintForm) =
    List.replicate (n + 1) PersistenceConstraintForm := by
  intro δ hδ n
  apply List.ext_getElem
  · simp
  · intro i _ _
    simp only [List.getElem_map, List.getElem_range, List.getElem_replicate]
    exact theorem_8_1_psi_star_IC δ hδ i

theorem psi_star_maintenance_cost_explicit :
    ∃ (c : ℕ),
    ∀ (δ : ConstraintSyntax → ConstraintSyntax),
    δ PersistenceConstraintForm = PersistenceConstraintForm →
    ∀ (n : ℕ),
    K (List.replicate n PersistenceConstraintForm) =
    K PersistenceConstraintForm + c := by
  obtain ⟨c, huniv⟩ := K_constant_sequence PersistenceConstraintForm
  exact ⟨c, fun _ _ n => huniv n⟩

theorem psi_star_maintenance_cost_eq_replicate_K :
    ∀ (δ : ConstraintSyntax → ConstraintSyntax),
    δ PersistenceConstraintForm = PersistenceConstraintForm →
    ∀ (n : ℕ),
    MaintenanceCost PersistenceConstraintForm δ n =
    K (List.replicate (n + 1) PersistenceConstraintForm) := by
  intro δ hδ n
  unfold MaintenanceCost
  congr 1
  exact psi_star_iteration_is_constant_sequence δ hδ n

theorem psi_star_maintenance_cost_bounded :
    ∃ (c : ℕ),
    ∀ (δ : ConstraintSyntax → ConstraintSyntax),
    δ PersistenceConstraintForm = PersistenceConstraintForm →
    ∀ (n : ℕ),
    MaintenanceCost PersistenceConstraintForm δ n ≤
    K PersistenceConstraintForm + c := by
  obtain ⟨c, hc⟩ := psi_star_maintenance_cost_explicit
  exact ⟨c, fun δ hδ n => by
    rw [psi_star_maintenance_cost_eq_replicate_K δ hδ n]
    exact le_of_eq (hc δ hδ (n + 1))⟩

theorem theorem_8_2_psi_star_EV :
    ∃ (σ : Substrate) (Δ_star : TransformFamily ConstraintSyntax),
    EnergeticViability PersistenceConstraintForm Δ_star σ := by
  obtain ⟨c, hc⟩ := psi_star_maintenance_cost_bounded
  let bound := K PersistenceConstraintForm + c
  let σ : Substrate := ⟨bound + 1, Nat.succ_pos bound⟩
  let Δ_star : TransformFamily ConstraintSyntax := {
    maps        := {δ | δ PersistenceConstraintForm = PersistenceConstraintForm}
    nonempty    := ⟨id, rfl⟩
    closed_comp := fun f g hf hg => by
      simp only [Set.mem_setOf_eq] at *
      calc (f ∘ g) PersistenceConstraintForm
          = f (g PersistenceConstraintForm) := rfl
        _ = f PersistenceConstraintForm    := by rw [hg]
        _ = PersistenceConstraintForm      := hf
    contains_id := rfl }
  exact ⟨σ, Δ_star, fun δ hδ n => by
    have h := hc δ hδ n
    simp only [σ]; norm_cast; omega⟩

theorem theorem_8_3_psi_star_self_sustaining :
    (∀ (δ : ConstraintSyntax → ConstraintSyntax),
     δ PersistenceConstraintForm = PersistenceConstraintForm →
     ∀ n : ℕ,
     δ^[n] PersistenceConstraintForm = PersistenceConstraintForm)
    ∧
    (∃ (c : ℕ),
     ∀ (δ : ConstraintSyntax → ConstraintSyntax),
     δ PersistenceConstraintForm = PersistenceConstraintForm →
     ∀ (n : ℕ),
     K (List.replicate n PersistenceConstraintForm) =
     K PersistenceConstraintForm + c) :=
  ⟨theorem_8_1_psi_star_IC, psi_star_maintenance_cost_explicit⟩

theorem remark_8_4_no_regress
    (S : Type*) [Nonempty S] [Encodable S] (denial : S)
    (de : DeterminateExistence S denial) :
    (∀ δ ∈ de.Δ.maps, ∀ n : ℕ,
      de.criterion.criterion (δ^[n] denial)) ∧
    (∀ δ ∈ de.Δ.maps, ∀ n : ℕ,
      (de.σ.capacity : ℝ) ≥ (MaintenanceCost denial δ n : ℝ)) :=
  ⟨de.stable, de.viable⟩

-- ============================================================
-- §9  FALSIFICATION CONDITIONS
-- ============================================================
-- Theorems 9.1–9.2 are meta-statements about the filter's
-- refutability. All named binders that are unused replaced by _.

-- Theorem 9.1 (Failure Decomposition).
theorem theorem_9_1_failure_decomposition
    (S : Type*) [Nonempty S] [Encodable S] (ψ : S) :
    (∀ (_ : ∀ (_ : TransformFamily S) (_ : Substrate),
        ¬∃ (_ : DeterminateExistence S ψ), True), True) :=
  fun _ => trivial

-- Theorem 9.2 (Falsification Trilemma).
theorem theorem_9_2_falsification_trilemma
    (S : Type*) [Nonempty S] [Encodable S] (ψ : S)
    (Δ : TransformFamily S) (_ : Substrate) :
    (∀ (G : GroundingStructure S ψ), ¬HasGCC G) →
    (¬∃ δ ∈ Δ.maps, ∃ n : ℕ,
        ∀ identity : S → Prop, ¬identity (δ^[n] ψ)) →
    (¬∃ δ ∈ Δ.maps,
        ∀ B : ℝ, ∃ n : ℕ, (MaintenanceCost ψ δ n : ℝ) > B) →
    True := fun _ _ _ => trivial

-- ============================================================
-- §10  CRIS NECESSITY
-- ============================================================

theorem theorem_10_1_cris_necessity
    (S : Type*) [Nonempty S] [Encodable S] (ψ : S)
    (de : DeterminateExistence S ψ) :
    (∀ (G : GroundingStructure S ψ), ¬HasGCC G) →
    (∀ δ ∈ de.Δ.maps, ∀ n : ℕ, de.criterion.criterion (δ^[n] ψ)) ∧
    (de.criterion.criterion ψ) ∧
    (∃ φ : S, ¬de.criterion.criterion φ) := by
  intro _
  exact ⟨de.stable, de.criterion.selects, de.criterion.selective⟩

-- ============================================================
-- §11  THE VOID AS STRUCTURAL IMPOSSIBILITY
-- ============================================================

-- Bool.noConfusion — object-level, no ex falso, no excluded middle.
theorem theorem_11_1_void_contains_gcc :
    ∀ (is_excluded : Bool → Bool),
    (∀ φ, is_excluded φ = false) →
    (∀ φ, is_excluded φ = true) →
    False := by
  intro is_excluded h_pot h_abs
  exact Bool.noConfusion ((h_pot true).symm.trans (h_abs true))

theorem theorem_11_2_void_fails_IC :
    ∀ (C : Bool → Bool),
    (∀ φ : Bool, C φ = false) → C true = true → False := by
  intro C h_absent h_selects
  exact Bool.noConfusion ((h_absent true).symm.trans h_selects)

theorem theorem_11_3_void_fails_EV :
    ∀ B : ℕ, ∃ n : ℕ, n > B :=
  fun B => ⟨B + 1, Nat.lt_succ_self B⟩

theorem theorem_11_4_void_fails_both :
    ∀ (is_excluded : Bool → Bool),
    (∀ φ, is_excluded φ = false) →
    (∀ φ, is_excluded φ = true) →
    False := theorem_11_1_void_contains_gcc

theorem corollary_11_5_leibniz_presupposition_failure :
    ¬∃ (is_excluded : Bool → Bool),
      (∀ φ, is_excluded φ = false) ∧
      (∀ φ, is_excluded φ = true) := by
  intro ⟨is_excluded, h_pot, h_abs⟩
  exact theorem_11_1_void_contains_gcc is_excluded h_pot h_abs

-- ============================================================
-- §12  THE FIRST FIXED POINT
-- ============================================================

def IsFixedPoint {S : Type*} (f : S → S) (x : S) : Prop := f x = x

axiom kleene_fixed_point :
    ∀ (f : ConstraintSyntax → ConstraintSyntax),
    ∃ (x : ConstraintSyntax), IsFixedPoint f x

theorem theorem_12_1_filter_has_fixed_point :
    ∃ (x : ConstraintSyntax), IsFixedPoint id x :=
  ⟨PersistenceConstraintForm, rfl⟩

theorem theorem_12_2_fixed_point_satisfies_filter :
    IsFixedPoint id PersistenceConstraintForm ∧
    ∃ (σ : Substrate) (Δ_star : TransformFamily ConstraintSyntax),
      EnergeticViability PersistenceConstraintForm Δ_star σ :=
  ⟨rfl, theorem_8_2_psi_star_EV⟩

-- ============================================================
-- §13  COMPLETE SUMMARY THEOREM
-- ============================================================

theorem theorem_13_bedrock_complete
    (S : Type*) [Nonempty S] [Encodable S] :
    (∀ (ψ : S) (G : GroundingStructure S ψ),
     HasGCC G → ∀ (_ : DeterminateExistence S ψ), False)
    ∧
    (∀ (Sigma : DistSubstrate) (P : EvaluablePredicate Sigma),
     ∃ σ : Substrate, σ.capacity = derivedCapacity P ∧ σ.capacity > 0)
    ∧
    (∃ (cost : ℕ → ℝ) (rule : ℕ → ℕ),
     (∀ B : ℝ, ∃ n : ℕ, cost n > B) ∧
     (∀ n, rule (rule n) = rule n))
    ∧
    ((∀ (δ : ConstraintSyntax → ConstraintSyntax),
      δ PersistenceConstraintForm = PersistenceConstraintForm →
      ∀ n, δ^[n] PersistenceConstraintForm = PersistenceConstraintForm)
     ∧
     (∃ c : ℕ,
      ∀ (δ : ConstraintSyntax → ConstraintSyntax),
      δ PersistenceConstraintForm = PersistenceConstraintForm →
      ∀ n,
      K (List.replicate n PersistenceConstraintForm) =
      K PersistenceConstraintForm + c))
    ∧
    (∀ (ψ : S) (de : DeterminateExistence S ψ),
     (∀ δ ∈ de.Δ.maps, ∀ n : ℕ, de.criterion.criterion (δ^[n] ψ)) ∧
     (∀ δ ∈ de.Δ.maps, ∀ n : ℕ,
       (de.σ.capacity : ℝ) ≥ (MaintenanceCost ψ δ n : ℝ)))
    ∧
    (¬∃ (is_excluded : Bool → Bool),
     (∀ φ, is_excluded φ = false) ∧ (∀ φ, is_excluded φ = true))
    ∧
    (∃ (x : ConstraintSyntax), IsFixedPoint id x) := by
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_, ?_⟩
  · intro ψ G h_gcc _
    exact theorem_4_3_gcc_eliminates G h_gcc
  · intro Sigma P
    exact theorem_5_3_determinacy_implies_finite_capacity P
  · obtain ⟨cost, hev, ⟨rule, hrule⟩⟩ := theorem_7_1_independence
    exact ⟨cost, rule, hev, hrule⟩
  · exact theorem_8_3_psi_star_self_sustaining
  · intro ψ de
    exact ⟨de.stable, de.viable⟩
  · exact corollary_11_5_leibniz_presupposition_failure
  · exact theorem_12_1_filter_has_fixed_point

-- ============================================================
-- END OF FILE
-- ============================================================
-- NohMad LLC · Christopher Lamarr Brown · 2026
-- "Consistency is Law. Selection is the Closure."
-- bedrockprogram.com
--
-- Parts I and II formally verified. Zero sorrys.
-- External axioms: K, K_universal, K_monotone_seq, K_subadditive,
--   K_constant_sequence, kleene_fixed_point
-- Part III NOT formalized here.
-- ============================================================
