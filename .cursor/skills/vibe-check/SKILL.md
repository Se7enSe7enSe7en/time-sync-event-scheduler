---
name: vibe-check
description: Scans current or uncommitted changes, prioritizes files/code marked with a "vibe-check" comment, and reviews for optimality, maintainability, and alternatives. Use when the user requests a vibe check, or when reviewing changed files for quick quality feedback.
---

# Vibe Check

## Instructions

1. Scan the current changed files (or uncommitted files).
2. Look for the commented string `vibe-check` (language-dependent, e.g. `// vibe-check`) to prioritize checking that file or code near the comment.
3. Before checking, read `specs/main.md` for context (tech stack, features) and intent.
4. When checking, apply this priority order:
   - **Optimal enough?** (avoid large performance hits)
   - **Maintainable enough?** (does not need to be perfect)
   - **Better alternative?** If yes: add a commented version of the code below the current code. For large refactors, create a plan in `docs/generated/refactor/` as an .md file with explanation.
5. Update `specs/state.md` if necessary after checking the codebase.
