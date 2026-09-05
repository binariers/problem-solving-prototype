# Contains Duplicate Unit Plan

## Normalized Spec

- **Slug:** `contains-duplicate`
- **Title:** Contains Duplicate
- **Statement:** Given an integer array `nums`, return `true` when any value occurs more than once; otherwise return `false`. Constraints: `0 <= nums.length <= 10^5` and `-10^9 <= nums[i] <= 10^9`.
- **Brute force:** Compare every pair and stop when two equal values are found. Time `O(n^2)`, space `O(1)`.
- **Optimized:** Scan once while storing previously encountered values in a set. Expected time `O(n)`, space `O(n)`.
- **Alternative:** Sort the array, then compare adjacent values. Time `O(n log n)` and implementation-dependent auxiliary space; an in-place sort mutates the input.
- **Insight:** A duplicate is found exactly when the current value has already been seen.
- **Tradeoff:** The set spends up to `O(n)` extra space to reduce expected runtime from `O(n^2)` to `O(n)`. Sorting uses less explicit storage but costs `O(n log n)` time and may mutate the input.
- **Siblings:** Uniqueness validation, repeated-item detection in a stream, and other "have I seen this value before?" tasks.

## Proof Mapping

- **Can solve it:** `Intro` + `BruteForce` define duplicates and construct the pairwise solution.
- **Understands and recognizes the pattern:** `Insight` + `Recognize` establish the seen-before invariant and transfer it to related tasks.
- **Understands the evolution and its tradeoff:** `Optimize` + `Tradeoff` build the set scan and compare it with sorting and brute force.

## Intro

### `define-a-duplicate`

- **Stage:** `Intro`
- **Interaction type:** `info`
- **Purpose:** Establish the Unit's input, output, and meaning of "more than once."
- **Content sketch:** Contrast unique, repeated, empty, and single-value arrays; a supportive visual can highlight equal values.

### `predict-the-result`

- **Stage:** `Intro`
- **Interaction type:** `single-choice`
- **Purpose:** Check whether the learner can identify a duplicate from examples.
- **Content sketch:** Show one array and ask for the returned boolean, with a supportive visual highlighting occurrences after selection.

## BruteForce

### `compare-every-pair`

- **Stage:** `BruteForce`
- **Interaction type:** `order-steps`
- **Purpose:** Construct a correct constant-space solution.
- **Content sketch:** Arrange the nested-loop comparisons, early return, and final false return; per-step supportive visuals can trace `(i, j)`.

### `count-the-comparisons`

- **Stage:** `BruteForce`
- **Interaction type:** `single-choice`
- **Purpose:** Connect pair enumeration to quadratic runtime.
- **Content sketch:** Ask for the worst-case complexity after showing the triangular growth in comparisons; a supportive visual can make the growth concrete.

## Insight

### `remember-what-you-saw`

- **Stage:** `Insight`
- **Interaction type:** `info`
- **Purpose:** Introduce the realization behind the linear scan.
- **Content sketch:** Explain that the current value proves a duplicate when it is already in a set; a supportive visual can show the growing `seen` set.

### `state-the-invariant`

- **Stage:** `Insight`
- **Interaction type:** `single-choice`
- **Purpose:** Verify understanding of what `seen` represents.
- **Content sketch:** Choose the invariant that, before each check, `seen` contains exactly the earlier values; no supportive visual is required.

## Optimize

### `build-the-set-scan`

- **Stage:** `Optimize`
- **Interaction type:** `order-steps`
- **Purpose:** Assemble the optimized algorithm in the correct order.
- **Content sketch:** Order set creation, membership check, early return, insertion, and final false return; per-step supportive visuals can trace state changes.

### `trace-the-set`

- **Stage:** `Optimize`
- **Interaction type:** `single-choice`
- **Purpose:** Check execution-level understanding and early termination.
- **Content sketch:** Trace an array and ask when the algorithm returns; per-option supportive visuals can show alternate set states.

## Tradeoff

### `sort-and-scan`

- **Stage:** `Tradeoff`
- **Interaction type:** `info`
- **Purpose:** Present sorting as an alternative evolution from pairwise comparison.
- **Content sketch:** Show how sorting groups equal values so only adjacent pairs need checking; a before-and-after supportive visual would help.

### `choose-the-strategy`

- **Stage:** `Tradeoff`
- **Interaction type:** `multi-choice`
- **Purpose:** Compare runtime, storage, mutation, and constraints across all approaches.
- **Content sketch:** Select the true claims about pairwise comparison, a hash set, and in-place sorting; no supportive visual is required.

## Recognize

### `spot-seen-before`

- **Stage:** `Recognize`
- **Interaction type:** `multi-choice`
- **Purpose:** Recognize tasks that use the same membership pattern.
- **Content sketch:** Pick scenarios asking whether an item appeared earlier, separating them from frequency or ordering tasks; no supportive visual is required.

### `name-the-signal`

- **Stage:** `Recognize`
- **Interaction type:** `single-choice`
- **Purpose:** Consolidate the cue that should trigger the pattern.
- **Content sketch:** Choose "detect whether a value was previously encountered" as the signal for a set-backed scan; no supportive visual is required.