# A unit has a fixed six-stage ladder

Every unit is authored as the same ordered ladder of stages: `Intro → BruteForce → Insight → Optimize → Tradeoff → Recognize`. Each stage contains one to three lessons, and every lesson independently declares one of the four interaction types. This fixed stage template maps directly onto the three things a completed unit must prove (can solve it; understands the brute-force→optimized evolution and its tradeoffs; can recognize sibling problems), while allowing difficult stages to use more than one lesson.

## Consequences

The pipeline always designs six stages but may propose between six and eighteen lessons for a unit. The stage and lesson interaction type are separate data fields. Problems that do not fit the brute-force-to-optimized narrative may require this ADR to be revisited.
