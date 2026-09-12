# 505: Inline a Private Helper Used Once

A private method with exactly one caller, whose body is a single expression or statement, should be inlined at that call site and deleted. Its name only restates what the expression already says, so the reader jumps to the definition to learn nothing and jumps back.

The exception is the reason most single caller helpers exist: a block lifted out of a long method to decompose it. Inlining one of those makes the caller unreadable and fights the instinct to break up code that has grown too big. So judge the body, not the caller count:

- A body of about four lines or less that names a value: inline it.
- A body of several statements, a loop, a branch, or a try with resources block: keep it, however few callers it has.
- A body that returns a value out of a try with resources or a try finally block: keep it. Inlining forces a mutable local declared `null` before the block and assigned inside it, which is worse to read than the call it replaced.

Counted across `modules/apps`, the population is decomposition, not named one liners. The 325 `*LocalServiceImpl` files hold 553 private helpers with exactly one caller and 968 with two or more, and only 16 of the 553, three percent, have a body of four lines or less. The rest are large blocks: `_updateObjectDefinition` at 267 lines in `ObjectDefinitionLocalServiceImpl`, `_notifySubscribers` at 191 in `MBMessageLocalServiceImpl`, `_getDDMFormUpdateContext` at 162 in `DDMFieldLocalServiceImpl`. An expression sized single caller helper is therefore the anomaly, which is what makes it worth flagging. Do not read the 553 as evidence against the rule: it measures the caller count without measuring the body.

Rule 001 settles a borderline case. A file whose other private helpers all have two or more callers makes a single caller one the deviation, and a file that already names each scenario in its own helper, as a test class does under rules 601 and 605, makes the single caller form its convention.

Rule 502 answers the same question for a `private static final` constant, rule 503 for a local, and rule 504 for the degenerate method whose whole body is one assignment to a field. This rule covers the case between them, a helper whose body is one expression.

**Rationale:** The measure is what the next reader has to hold in their head. A helper that wraps one expression costs a name to learn and a jump to resolve, and gives back a word that repeats the expression. A helper that carries twenty lines out of a sixty line method gives back the shape of the caller, which is the whole point of having it. Both follow from the same principle, so the question is never the caller count on its own but whether the body is big enough that a name for it is a summary rather than an echo.

A violation is a private method with exactly one caller whose body is a single expression or statement and whose name only echoes that expression. A helper that decomposes a long method is not a violation, and neither is one with a second caller.

**Example:** LPD-99652 Technical Task | Render the fragment usages with a missing layout and report them in the log (https://liferay.atlassian.net/browse/LPD-99652) inlined `_getMissingLayoutPredicate` once a delete sweep left it with a single caller: its body read plainly as `plid.notIn(select plid from Layout)` inside a DSL `where` chain already written in that style, and `FragmentEntryLinkLocalServiceImpl` keeps two or more callers on ten of its twelve private helpers. The other direction was settled on LPD-104558 Technical Task | Grant the design library roles the add, update, and delete permissions on layout page templates (https://liferay.atlassian.net/browse/LPD-104558), where `_addLayoutPageTemplateEntry` kept its single caller: at twenty two lines it returns a value out of a `ContextUserReplace` try with resources block, and inlining it would have pushed its caller past seventy lines with two such blocks in a row.