# 910: Prefer Clay Over Hand Written Frontend Code

Frontend work builds on Clay rather than beside it. Use the Clay component when one fits instead of hand writing the markup, and reuse the shared component or hook the repo already has instead of writing a smaller copy of it. `modules/apps` carries 2,520 `@clayui/*` imports across its 2,003 tsx and jsx files, so a hand rolled equivalent of something Clay ships is the exception that has to argue for itself.

Put a style in a class, never in an inline `style` attribute holding a fixed value. The count is not close: `className=` appears 4,575 times against 89 for `style={{`, a ratio of 51 to 1. An inline style is for a value computed at runtime that no class can express, a measured offset or a drag position, and nothing else.

A new CSS rule is worth questioning before it is worth reviewing. Ask whether a utility class already expresses it, since the style that reaches a stylesheet should be the one that could not be written as a class on the element. A block of four or five fixed declarations on a single selector is usually a utility class the author did not find.

Two things this rule deliberately does not say, because the code contradicts them. It is not a ban on `!important`, which appears 434 times in the 1,394 app SCSS files, counting neither Clay's vendored source under `frontend-js-clay-web` nor the themes. And it is not a requirement to use a Clay colour variable over a hardcoded hex: in those same files the hex wins 1,799 to 1,595, so the codebase has no settled convention and rule 001 decides it per file. Raise either as a preference at most, and never as a violation on its own.

**Rationale:** Clay is the design system the product ships, so markup that bypasses it has to be restyled by hand every time the system moves, and it drifts visibly from the screens around it. The inline style case is sharper still, since a fixed value in an attribute cannot be overridden by a theme or a customer stylesheet without `!important`, which is how a stylesheet ends up with the 434 above.

A violation is hand written markup duplicating a Clay component, a reimplementation of a shared component or hook that already exists, or an inline `style` attribute carrying a value that does not change at runtime.
