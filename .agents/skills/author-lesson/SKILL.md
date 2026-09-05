---
name: author-lesson
description: Write one planned lesson (its lesson.json and any supportive visuals) from an approved unit-plan.md, and flip the unit to available once the last lesson exists. Use once per lesson, in its own session.
---

# Author Lesson

Write a single lesson for a unit whose plan is already approved. Run this once per planned lesson, in separate sessions. Read `CONTEXT.md` for vocabulary (**Stage**, **supportive visual**, **visualize-on-select**).

## Steps

1. **Read the plan.** Open `app/content/<slug>/unit-plan.md` and find the target lesson (by `id`). Take its stage, interaction type, and purpose as fixed — do not redesign the ladder.

2. **Design the lesson**, favoring *seeing* over *reading*. Design any useful supportive visuals: a lesson-level default, and — where selecting or tapping reveals something worth seeing — per-option (`single-choice`/`multi-choice`) or per-step (`order-steps`) visuals. Each visual is a **fully self-contained HTML file** loaded in `<iframe sandbox="allow-scripts">`: it carries its own interactions and never talks to the app or reads app state.

3. **Write the lesson files** into `app/content/<slug>/<NN-stage>/<NN-lesson-id>/`:

   - `lesson.json` — one of the four shapes. `visual` paths are **relative to the lesson folder**; omit `visual` for no visual.
     - `info`: `{ "type": "info", "title": ..., "body": ..., "visual"?: "overview.html" }`
     - `single-choice`: `{ "type": "single-choice", "prompt": ..., "visual"?: ..., "options": [{ "id", "text", "visual"?, "correct" }], "explanation": ... }`
     - `multi-choice`: same as `single-choice`, with more than one option marked `"correct": true`.
     - `order-steps`: `{ "type": "order-steps", "prompt": ..., "visual"?: ..., "steps": [{ "id", "text", "visual"? }], "answer": [ids in correct order], "explanation": ... }`
   - Any supportive-visual `.html` files the lesson references.

   Keep correctness in the data only: option `correct` flags and the `answer` sequence. A visual never decides correctness.

4. **Check the plan and flip availability.** After writing, list the planned lessons and confirm each one's folder now exists. When **every** planned lesson exists, change the unit's `app/content/index.json` entry to **`"available": true`**. Until then, leave it `false`.

Write only this one lesson's files (plus the manifest flip when it's the last). Do not touch other lessons or `unit.json`.
