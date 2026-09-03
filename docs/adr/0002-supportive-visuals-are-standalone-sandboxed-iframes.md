# Supportive visuals are standalone `viz.html` files in sandboxed iframes

A supportive visual is a fully self-contained `viz.html` loaded into the visualizing area via a sandboxed `<iframe>`. Visuals attach at any of three optional points: a **lesson-level default** (any lesson type may declare one, shown by default), a **per-option** visual (`single-choice`/`multi-choice`), and a **per-step** visual (`order-steps`); tapping an option or step swaps its visual in over the lesson default. There is no app-native declarative visual renderer and no message protocol between the app and the visual: the app judges correctness solely from the selected option's `correct` flag, and the visual exists only to let the learner explore an idea.

## Considered Options

- **App-native declarative visuals** (a shared renderer driven by JSON, e.g. arrays/pointers/hash maps): rejected — a fixed renderer can't express the variety of ideas across problems, and building it is more app complexity than a prototype needs.
- **One visual per lesson driven by a `postMessage` protocol**: rejected — it couples every visual to a contract and complicates authoring; standalone per-option visuals need no wiring.

## Consequences

Visuals may be duplicated across lessons, options, and steps, and a rich lesson can imply several `viz.html` files; this authoring cost is accepted in exchange for total per-visual flexibility and a dead-simple app. Visuals must be safe to sandbox (no dependence on app state or parent DOM).
