# Quests

A Duolingo-style mobile web app that teaches problem-solving by turning NeetCode problems into interactive, gamified learning content. Two parts: a **pipeline** that authors content, and a **web app** that plays it.

## Language

**Section**:
A NeetCode topic (e.g. Arrays & Hashing), rendered as a Duolingo-style group of units.
_Avoid_: Topic, category, chapter

**Unit**:
A single NeetCode problem (e.g. Two Sum), authored as an ordered ladder of lessons.
_Avoid_: Problem, exercise, level

**Lesson**:
One interactive screen inside a unit that teaches or checks a single idea.
_Avoid_: Card, slide, step, question (a lesson may *contain* a question but is not one)

**Lesson type**:
The fixed role a lesson plays in a unit's ladder. The ladder is: `Intro` → `BruteForce` → `Insight` → `Optimize` → `Tradeoff` → `Recognize`. Together they prove the learner can solve the problem, understands the brute-force→optimized evolution and its tradeoffs, and can recognize sibling problems.

**Interaction type**:
The rendering-and-grading shape the app uses to draw a lesson. A closed set of four: `info` (teaching screen, tap-to-continue), `single-choice` (pick one), `multi-choice` (pick all that apply), `order-steps` (arrange scrambled steps). Distinct from *lesson type*, which is the pedagogical role.
_Avoid_: Question type, format, widget

**Pipeline**:
An offline authoring skill (Markdown) that takes a hand-supplied problem spec and outputs a unit folder. No live scraping, no runtime generation.
_Avoid_: Generator, scraper

**Unit folder**:
The pipeline's output for one unit, named after the problem (e.g. `contains-duplicate/`). Contains `unit.json` plus one folder per lesson.

**Lesson folder**:
A folder inside a unit folder holding one lesson's definition file plus its resources (images and any supportive visuals — lesson-level, per-option, or per-step).

**Supportive visual**:
A self-contained `viz.html`, loaded by the app in a sandboxed `<iframe>`, attached at any of three points: a **lesson-level default** (any lesson type may declare one, shown in the visualizing area by default), a **per-option** visual (`single-choice`/`multi-choice`), or a **per-step** visual (`order-steps`). Fully standalone: it carries its own interactions and never communicates with the app — it exists purely to let the learner *explore*. Correctness is judged by the app from the selected option, never by the visual.
_Avoid_: Widget, embed, tier-1/tier-2 visual

**Visualizing area**:
The region of the lesson player that hosts the current supportive visual. The lesson's default visual shows here on entry; tapping an option (or step) that has its own visual swaps it in here, reverting to the default when deselected.
_Avoid_: Canvas, stage, viewport

**Visualize-on-tap**:
Tapping (not selecting) an answer option loads that option's supportive visual into the visualizing area — in place of the lesson's default visual — so the learner explores what the option means before committing. The core interaction of the app.
_Avoid_: Preview, hover
