# 506: Extract a Repeated Block Into a Helper

When the same sequence of statements appears two or more times in a class, lift it into one private helper and call it once per occurrence, parameterizing only what actually differs between the copies. Name the helper after what it does, per rule 105, not after the first caller that needed it.

This is the other side of rule 505, and the two never overlap. 505 inlines a private helper with exactly one caller whose body is a single expression, because there the name restates what the expression already says. 506 starts at the second caller, where the name stops being a restatement and becomes the one place the block is written down. A helper with two or more call sites is the codebase's normal shape: of 35,201 private methods in `modules/apps`, 16,803 have two or more call sites, 7,203 with exactly two and 9,600 with three or more.

Judge the copies, not the line count. Two occurrences of one call with different arguments are not a repeated block, they are two calls, and rule 206 says to keep them adjacent rather than to wrap them. What earns a helper is a run of statements that has to be read as a unit and understood the same way at each site: a mock built and stubbed, a fixture assembled, a URL composed, a document node created. Parameterize what differs and nothing else; a helper that takes a flag so it can be two different blocks is two helpers.

The copies include code the pull did not write. When a pull adds a helper, any block already in the class that does the same thing is replaced with a call to it, so the class ends with one copy instead of the new helper beside the old duplicates. In a test class this covers setup, stubbing, and assertion blocks that another test writes the same way, with the shared resources passed to the helper rather than rebuilt in it.

Rule 601 is the test specific case of this and takes precedence inside a test class, since it also decides whether the callers should be separate `@Test` methods at all.

**Rationale:** A block written twice has to be changed twice, and the second copy is the one that gets missed. It also costs the reader twice: they have to diff the two copies by eye to find out whether the difference is meaningful or accidental. One helper answers that question in its signature, since the parameters are exactly the parts that vary.

A violation is two or more occurrences of the same run of statements, differing only in their arguments, left in place when one parameterized private helper would cover them, including an older copy left beside a helper the pull adds.

**Example:** commits `2de6652be2099` (https://github.com/liferay/liferay-portal/commit/2de6652be2099) and `7461372f5d414` (https://github.com/liferay/liferay-portal/commit/7461372f5d414) lifted repeated test setup into helpers, `34fc7444497a7` (https://github.com/liferay/liferay-portal/commit/34fc7444497a7) deduplicated a test outright, and `772ab8f733e1d` (https://github.com/liferay/liferay-portal/commit/772ab8f733e1d) and `563fe6cf71872` (https://github.com/liferay/liferay-portal/commit/563fe6cf71872) did the same for production code, extracting a CDATA method in each of the XLIFF exporters.
