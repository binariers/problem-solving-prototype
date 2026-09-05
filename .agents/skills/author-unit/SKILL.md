---
name: author-unit
description: Design a unit's six-stage ladder from a problem spec and, once the user approves it, write unit-plan.md, unit.json, and a locked manifest entry. Use to start authoring a new NeetCode unit. Does not write lesson content.
---

# Author Unit

Design the learning arc for one NeetCode problem and lock the plan. You produce the **structure** of a unit; the lessons themselves are written later, per lesson, by `author-lesson`.

Read `CONTEXT.md` first and use its vocabulary exactly (**Stage**, not "chapter"). Content lives under `app/content/`.

## Steps

1. **Normalize the problem.** Invoke `extract-spec` on the user's supplied problem to get the canonical spec.

2. **Design the six-stage ladder.** Every unit has exactly these six stages in order:

   `Intro → BruteForce → Insight → Optimize → Tradeoff → Recognize`

   For each stage, propose **one to three lessons** (so 6–18 total). Give each lesson:
   - a stable **`id`** (kebab-case, unique within the unit),
   - an **interaction type** — one of `info`, `single-choice`, `multi-choice`, `order-steps`,
   - a **purpose** (what it teaches or checks),
   - a **one-line content sketch**, noting where a supportive visual would help.

   Map the stages to the three proofs: `Intro`+`BruteForce` → can solve it; `Insight`+`Recognize` → understands and recognizes the pattern; `Optimize`+`Tradeoff` → understands the evolution and its tradeoff.

3. **Show the full ladder to the user and wait.** Do **not** write any unit content before the user approves. If the user comments, revise and ask again.

4. **On approval, write three things** (and nothing else):

   - **`app/content/<slug>/unit-plan.md`** — the authoritative plan: the six stages, each planned lesson with its `id`, `stage`, interaction type, purpose, and content sketch. `author-lesson` reads this.
   - **`app/content/<slug>/unit.json`** — the structural file the app reads:
     ```json
     {
       "id": "<slug>",
       "title": "<Title>",
       "lessons": [
         { "id": "<lesson-id>", "stage": "Intro", "path": "01-intro/01-<lesson-id>" }
       ]
     }
     ```
     List every planned lesson in order, each tagged with its `stage` and a `path` of `NN-stage/NN-lesson-id`.
   - **The manifest entry.** Add the unit to `app/content/index.json` under the right section with **`"available": false`** — it stays a locked stub until every lesson exists.

Do not create lesson folders or `lesson.json` files. Stop after the plan, `unit.json`, and manifest entry are written.
