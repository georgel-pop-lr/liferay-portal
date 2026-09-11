# 206: Keep Homogeneous Peer Statements Together

A run of sibling statements that perform the same operation on the same receiver is one paragraph, and so is a run of adjacent declarations of the same type that form a preamble with no use between them. Do not separate either with blank lines. Three consecutive `_fragmentsImporter.importFragmentEntries(...)` calls, or `fragmentCollection1` and `fragmentCollection2` declared back to back, read as one unit and should be laid out as one.

The source formatter wins wherever the two disagree. `MissingEmptyLineCheck` requires a blank line before a statement when the statement above it holds the last reference to a variable, so peer calls that consume different locals must stay separated even though they look homogeneous. Apply this rule only to a run that is genuinely uniform: the same receiver, the same operation, and no variable's reference chain ending inside it.

**Rationale:** A blank line is a paragraph break, and a reader takes it as a claim that what follows is a new thought. Spending one between two calls that differ only in their arguments spends the strongest layout signal available on nothing, and it hides the real breaks in the method by putting a break everywhere. Keeping a uniform run solid makes the one blank line that does separate two ideas mean something again.

Rule 203 sets each declaration off from the statement that uses it, which is the opposite case: there a blank line separates two different thoughts, while here it would split one.

A violation is blank lines between consecutive calls of the same operation on the same receiver, or between adjacent declarations of the same type that form one preamble, where no variable's last reference falls between them.

**Example:** commits `93ee2b936` (https://github.com/liferay/liferay-portal/commit/93ee2b936) and `54045b0e4` (https://github.com/liferay/liferay-portal/commit/54045b0e4) closed up runs of peer calls, and `6c2fe9034` (https://github.com/liferay/liferay-portal/commit/6c2fe9034) did the same for adjacent declarations. Brian Chan made the point once and expected it applied throughout in `a6d534848` (https://github.com/liferay/liferay-portal/commit/a6d534848), "Look at what I'm doing and apply everywhere".