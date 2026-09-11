# 307: Use StringPool.BLANK for the Empty String

Write `StringPool.BLANK` rather than the literal `""`, and import `com.liferay.petra.string.StringPool`. This holds in production code and in tests alike, wherever the empty string is passed as an argument, compared against, or assigned.

The convention stops at the empty string. `StringPool` also defines the punctuation constants (`SPACE`, `PERIOD`, `COMMA`, `SLASH`, and the rest), and they are widely used, but the bare literal is used more, so there is no settled convention to enforce for them. Follow the file, per rule 001, and do not convert a punctuation literal on review.

**Rationale:** `""` is the one string literal a reader can misread, because an empty pair of quotes looks like an oversight or a placeholder rather than a deliberate value, and in a long argument list it is easy to lose entirely. The named constant says the empty string was meant. Nothing in the source formatter rewrites the literal into the constant, so review is the only place this is caught.

A violation is a `""` literal in Java source where `StringPool.BLANK` would compile. The exception is a multicharacter literal that happens to hold a punctuation mark, which is a value of its own and stays as written.

**Example:** across `modules/apps` the empty string constant wins where the two forms are directly comparable: `Assert.assertEquals(StringPool.BLANK` appears 119 times against 36 for `Assert.assertEquals(""`. The punctuation constants go the other way and are why this rule is narrow: `append(" ")` appears 1390 times against 153 for `append(StringPool.SPACE)`.