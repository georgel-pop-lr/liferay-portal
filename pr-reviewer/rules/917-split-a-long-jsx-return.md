# 917: Split a Long JSX Return

Past 150 non-blank lines, a component's JSX return is split into smaller components so the return reads as a short outline of the screen. Extract the large chunks, such as a form section, a list row or a modal footer, into internal `const` components in the same file, unless a separate file clearly fits better. Keep the behavior identical, and follow the file's existing convention for how an inner component is declared and typed (rule 916).

Counted over the `.tsx` sources under `modules/apps`, Commerce and tests excluded, 2,092 of the 2,616 multiline `return (` blocks are 60 non-blank lines or fewer and 2,531 are 150 or fewer. Only 85, 3.2 percent, exceed 150.

This is a suggestion, not a violation. Name the extractions you would make and leave the scope to the author, and judge only returns the pull adds or grows past the threshold, never an untouched one that was already long.

**Rationale:** a JSX return is read to find where on the screen something is rendered. Past a few screens of markup the reader loses the nesting, and the conditional branches in the middle of the return are the ones that get missed.

Raise it as a preference when an added or grown JSX return exceeds 150 non-blank lines, with the specific components you would extract.