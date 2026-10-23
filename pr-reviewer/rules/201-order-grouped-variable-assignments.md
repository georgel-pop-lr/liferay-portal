# 201: Order Grouped Variable Assignments

When several variable assignments are grouped together as a block — for example a FreeMarker `[#assign]` block, a shell `local` declaration that lists several names, or a cluster of constant or field declarations — put them in a deliberate order rather than the order in which they were written.

Two ordering principles apply:

- Sort independent assignments alphabetically by variable name.
- Place a derived assignment — one whose value is computed from earlier variables in the same block — after the variables it depends on. Separate it from the sorted block and put it next to its first use rather than wedging it into the alphabetical order.

**Rationale:** A block left in the order it was typed is effectively random, which raises the chaos factor of the codebase: a reader must scan the whole block to find a given variable, and cannot tell which values are independent inputs and which are computed from others. Sorting the independent assignments makes any one easy to locate and signals that they are peers with no ordering relationship between them. Pulling a derived assignment out and placing it after its dependencies, next to where it is used, makes the data flow visible — the reader can see at a glance that the value is computed rather than an input, and what it is computed from.

This rule applies only to assignments that are already grouped into a consecutive block. It does not require grouping assignments that are better declared at their first use, and it never overrides a necessary dependency order: when one assignment uses the value of another, the dependency wins over alphabetical order.

A Java preamble of independent local declarations is such a block once rule 211 closes it up, and it sorts alphabetically even when the statement after it reads the variables in another order. The order of first use does not decide it. Only the argument order of one call that takes the locals as its arguments does, and rule 210 owns that case. Brian Chan's SF commits on `brian/master` that touch Java under `modules/apps` since 2026-06-01 (540 commits) reordered 20 such preambles where the two orders disagree. He sorted 18 alphabetically, 1 by use (`fromName` before `fromAddress`), and 1 in neither order (`expirationDate` ahead of an `old`/`new` pair), and both exceptions keep a semantic pair in its natural order. The legacy code is mixed: over `modules/apps` outside Commerce at `feb7200f5ffb`, 400 production and 314 test preambles are alphabetical against 518 and 269 in use order. So report it only on a preamble that a pull adds or moves. On LPD-109452 Technical Task | Browse sites and Design Libraries in the group selector (https://liferay.atlassian.net/browse/LPD-109452), his SF commit `a49b358674d5d` (https://github.com/brianchandotcom/liferay-portal/commit/a49b358674d5d2602facdfb5eff20bb9c16c52d0) moved `ThemeDisplay themeDisplay` below `GroupItemSelectorProvider groupItemSelectorProvider` in `GroupSelectorBreadcrumbUtil.getBreadcrumbEntries` and closed the blank line between them, although the lambdas of the `BreadcrumbEntryListBuilder` chain below read `themeDisplay` first. The liferay review had reported neither half.

A violation is a block of consecutive, independent assignments left in an order that is not alphabetical, or a derived assignment sorted ahead of or interleaved with the variables it depends on instead of being grouped after them. In Java, a preamble of independent locals that a pull adds or moves, left in the order of first use or split by a blank line, when no single call takes all of them as its arguments, is a violation too.

**Example:** https://github.com/brianchandotcom/liferay-portal/pull/175376 — in the `phone-number-input` fragment a block of `[#assign]` statements was in arbitrary order and was sorted alphabetically (`countryA2`, `countrySource`, `defaultLanguageId`, `disabled`, ...). The derived `fixed = countrySource == "fixed"` was then moved out of the sorted block and placed after it, next to the `[#if fixed ...]` that uses it, because it depends on `countrySource`. A grouped pair of Java locals that fed the same call was sorted the same way.

```diff
-Map<X, Y> beta = new HashMap<>();
-
 boolean alpha = check();
+Map<X, Y> beta = new HashMap<>();
```