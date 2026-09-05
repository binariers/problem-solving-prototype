---
name: extract-spec
description: Normalize a hand-supplied NeetCode problem into a canonical spec for author-unit. Use as the first step of authoring a unit, invoked by author-unit.
---

# Extract Spec

Turn a **hand-supplied** problem into a normalized spec that `author-unit` can design against. You never scrape: a problem URL is only an identifier. Everything you need is pasted in by the user — title/slug, statement, and canonical solutions.

## Input

The user (or `author-unit`) supplies some of:

- **Title** and/or **slug** (e.g. *Two Sum* / `two-sum`).
- **Problem statement** and constraints.
- **Canonical solutions**: at minimum a brute-force approach and an optimized approach, ideally with code.

If the optimized solution or the key insight is missing, ask for it. Do not invent problem semantics.

## Output

Produce a normalized spec (in-session, handed back to `author-unit`) with these fields:

- `slug` — kebab-case, used as the unit folder name.
- `title` — human title.
- `statement` — the problem in one or two sentences, plus constraints.
- `bruteForce` — the naive approach and its time/space complexity.
- `optimized` — the improved approach and its time/space complexity.
- `insight` — the single realization that unlocks the optimized approach.
- `tradeoff` — what the optimized approach spends (usually memory) to buy what (usually time).
- `siblings` — 1–3 related problems that share the pattern, for the `Recognize` stage.

Keep it tight and factual. This spec is the ground truth the six-stage ladder is built from.
