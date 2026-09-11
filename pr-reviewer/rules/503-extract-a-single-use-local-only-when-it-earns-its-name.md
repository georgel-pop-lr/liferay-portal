# 503: Extract a Single Use Local Only When It Earns Its Name

A local used exactly once earns its declaration only when its name states something the expression does not, or when the expression nests deeply enough that inlining it buries what the statement is doing. Otherwise pass the expression inline at its one use site. The same test run the other way is what forces an extraction: when an argument is itself a nested expression of two or more calls, pull it out into a named local and pass the local, so the outer call reads as a list of named pieces instead of as machinery.

Extract when any of these hold:

- The expression is two or more calls deep.
- The call it feeds already takes three or more arguments, since every nested argument adds to what the reader unpacks before reaching the one that matters.
- The name captures a concept the raw expression does not state, such as `viewMode` for `ParamUtil.getString(PortalUtil.getOriginalServletRequest(request), "p_l_mode", Constants.VIEW)`.

Otherwise inline it. A single use local whose name only echoes the call that produced it adds a line to read and an indirection to resolve for nothing.

Three constraints bound the call:

- The source formatter polices one corner of this, so its silence is not approval. `VariableDeclarationAsUsedCheck` rejects a single use local only when the initializer is a getter named after the variable, matching `(?i)_?get<VariableName>` in `BaseAsUsedCheck._matchesGetOrSetCall`. So `String canonicalURL = PortalUtil.getCanonicalURL(...)` used once is rejected with "No need to declare variable", while `String alternateURL = _generateURL(...)` used once passes. Outside that pattern both forms compile and format clean, and the choice is the author's.
- `OperatorOperandCheck` forces the extraction when a multiline call becomes an operand of a comparison, so that local stays even though it is used once.
- An extraction can force a rename. A second value of the same kind in one scope means neither can keep the plain name, and `MissingEmptyLineCheck` requires a blank line where a variable's reference chain ends, which can split an assertion block that would otherwise be contiguous.

**Rationale:** The measure is what the next reader has to hold in their head, not the line count. A name that restates the call it came from costs a line and buys nothing, while a name over a nested expression collapses several calls into one word and lets the outer statement be read in a single pass. Both directions serve the same end, so the question is never whether to use a local but whether its name says more than the expression does.

Rule 502 answers the same question for a `private static final` constant used once, and rule 203 decides where a local that survives is declared.

A violation is a single use local whose name only echoes the call that produced it, or an argument passed inline as a nested expression of two or more calls.

**Example:** LPD-99541 Technical Task | Optimize Localization URL Strategy to Eliminate Redundant Indexing (https://liferay.atlassian.net/browse/LPD-99541) settled both directions in one file. `String canonicalURL = PortalUtil.getCanonicalURL(...)`, used once, was inlined, while two `_generateURL(...)` calls that wrapped across three lines inside `Assert.assertEquals` were extracted to `englishAlternateURL` and `spanishAlternateURL`, which in turn forced the plain `alternateURL` already in that scope to take its locale qualifier back. Brian Chan rejected the inline form of the same shape on the LPD-83537 Technical Task | Render HTML tags for CMS Content in Asset Publisher (https://liferay.atlassian.net/browse/LPD-83537) branch, where `viewMode` had to be extracted before it was passed to the `AssetAnalyticsAttributesProvider` constructor.