# Content is static files authored offline, not generated or scraped at runtime

The pipeline is an offline authoring skill that takes a hand-supplied problem spec (title/slug, statement, canonical solutions) and emits static `content/` files (`index.json`, per-unit `unit.json`, per-lesson `lesson.json` + assets) committed to the repo. The app only ever `fetch`es these static files; it never calls an LLM or scrapes NeetCode/LeetCode at runtime.

## Considered Options

- **Live scrape of NeetCode/LeetCode**: rejected — the sites are client-rendered (brittle) and the content is under ToS, which is a poor foundation for a prototype.
- **Runtime LLM generation in the app**: rejected — forces API keys, network, and non-determinism into a "zero-dependency, open-and-run" app.

## Consequences

The "URL" a user provides is treated as an *identifier*, not a fetch target; supplying the problem statement/solutions is a manual input to the pipeline.
