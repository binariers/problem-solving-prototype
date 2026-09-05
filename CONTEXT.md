# Problem-Solving App

A Duolingo-style mobile web app that teaches problem-solving by turning NeetCode problems into interactive, gamified learning content. Two parts: a **pipeline** that authors content, and a **web app** that plays it.

## Language

**Section**:
A NeetCode topic (e.g. Arrays & Hashing), rendered as a Duolingo-style group of units.
_Avoid_: Topic, category

**Unit**:
A single NeetCode problem (e.g. Two Sum), authored as an ordered ladder of exactly six chapters.
_Avoid_: Problem, exercise, level

**Chapter**:
One pedagogical role in a unit's learning arc. Every unit has exactly six chapters in this order: `Intro` → `BruteForce` → `Insight` → `Optimize` → `Tradeoff` → `Recognize`. Each chapter contains one to three lessons.
_Avoid_: Lesson type, step

**Chapter role**:
The fixed purpose served by a chapter: `Intro`, `BruteForce`, `Insight`, `Optimize`, `Tradeoff`, or `Recognize`.
_Avoid_: Lesson type

**Lesson**:
One interactive screen inside a chapter that teaches or checks a single idea.
_Avoid_: Card, slide, step, question (a lesson may *contain* a question but is not one)

**Interaction type**:
The rendering-and-grading shape the app uses to draw a lesson. A closed set of four: `info` (teaching screen, tap-to-continue), `single-choice` (pick one), `multi-choice` (pick all that apply), `order-steps` (arrange scrambled steps). Distinct from a chapter role, which is pedagogical.
_Avoid_: Question type, format, widget

**Pipeline**:
An offline authoring skill (Markdown) that takes a hand-supplied problem spec and outputs a unit folder. No live scraping, no runtime generation.
_Avoid_: Generator, scraper

**Unit folder**:
The pipeline's output for one unit, named after the problem (e.g. `contains-duplicate/`). Contains `unit-plan.md`, `unit.json`, and one folder per chapter, with lesson folders nested inside.

**Lesson folder**:
A folder inside a chapter folder holding one lesson's definition file plus its resources (images and any supportive visuals — lesson-level, per-option, or per-step).

**Supportive visual**:
A self-contained HTML file loaded by the app in a sandboxed `<iframe>`, attached at any of three points: a **lesson-level default**, a **per-option** visual (`single-choice`/`multi-choice`), or a **per-step** visual (`order-steps`). Fully standalone: it carries its own interactions and never communicates with the app. Correctness is judged only from the lesson's answer data, never by the visual.
_Avoid_: Widget, embed, tier-1/tier-2 visual

**Visualizing area**:
The region of the lesson player that hosts the current supportive visual. The lesson's default visual shows here on entry; selecting an option or tapping a step that has its own visual swaps it in.
_Avoid_: Canvas, stage, viewport

**Visualize-on-select**:
Tapping an answer option selects it and loads its supportive visual into the visualizing area in place of the lesson's default visual. Selection is submitted separately with the Check button.
_Avoid_: Preview, hover
