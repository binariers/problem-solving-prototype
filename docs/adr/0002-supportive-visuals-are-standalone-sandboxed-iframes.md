# Supportive visuals are standalone, per-option `viz.html` files in sandboxed iframes

Each answer option may carry its own optional, fully self-contained `viz.html`. Tapping an option loads *that option's* visual into the visualizing area via a sandboxed `<iframe>`. There is no app-native declarative visual renderer and no message protocol between the app and the visual: the app judges correctness solely from the selected option's `correct` flag, and the visual exists only to let the learner explore what an option means.

## Considered Options

- **App-native declarative visuals** (a shared renderer driven by JSON, e.g. arrays/pointers/hash maps): rejected — a fixed renderer can't express the variety of ideas across problems, and building it is more app complexity than a prototype needs.
- **One visual per lesson driven by a `postMessage` protocol**: rejected — it couples every visual to a contract and complicates authoring; standalone per-option visuals need no wiring.

## Consequences

Visuals may be duplicated across options/lessons, and a rich multi-option lesson can imply several `viz.html` files; this authoring cost is accepted in exchange for total per-option flexibility and a dead-simple app. Visuals must be safe to sandbox (no dependence on app state or parent DOM).
