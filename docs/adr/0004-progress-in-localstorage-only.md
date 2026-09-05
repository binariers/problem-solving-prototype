# Progress is stored in `localStorage` only, with no `.progress` file

The web app persists learner progress solely in the browser's `localStorage` under a single key holding a `completedLessons` map (unit id → completed lesson ids). On each lesson completion the app writes the updated map; on load it reads it back (empty on a fresh browser). There is no `.progress` file on disk, no seed, and no manual file editing. Resetting progress is an in-app control that clears the `localStorage` key.

## Considered Options

- **Read-only `.progress` seed file, edited by hand** (the v3 design): rejected — a static, backend-less app cannot write files, so persistence would depend on the user manually maintaining JSON, which is tedious and error-prone for a prototype.
- **File System Access API writing the real `.progress` file**: rejected — Chromium-only, requires a permission grant and user gesture per session, and adds complexity out of proportion to a prototype.
- **`localStorage` seed *plus* a read-only `.progress` file unioned in**: rejected — two sources of truth complicate reset semantics ("delete the file" no longer resets) for no real benefit.

## Consequences

Progress is per-browser and not committed to the repo, so it does not travel between machines or into version control. Reset is only possible through the in-app control (or clearing site data), not by deleting a file. This reverses the read-a-file model described in the v3 brief; v4 reflects the change.
