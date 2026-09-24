# 608: Break Up a Long Test Method

Past 100 non-blank lines, a test method (an `@Test` method or a `_test*` scenario helper) is decomposed for reading, even where nothing in it repeats. Split it at its natural phases, such as building the fixture, stubbing a collaborator, driving the call, and checking one group of results, and move each phase into a small private helper named after what it does (rule 105), so the test reads as a short list of steps. A test under 100 lines that is still hard to follow can be split the same way, but only a block of several statements that forms one step; never wrap a single call or expression, which rule 505 inlines again.

Repeated blocks are rule 506, not this rule, and come first: a block the test repeats, or that another test in the class writes too, is shared through one helper before any length is judged, and that often brings the test under 100 lines on its own.

Do not overdo it. The test must still show what it asserts: keep the call under test and the final assertions visible in the test method rather than hiding them in helpers, and do not split a test that reads fine just to shorten it. Judge only tests the pull adds or modifies.

This rule covers Java test methods. A frontend `it()` that walks one user flow under rule 915 is long by design, so do not cite this rule against it.

**Rationale:** A test is read when it fails, by someone who needs to see quickly what it set up and what it expected. Counted over `modules/apps` at `24e6a0c4eb7e9`, Commerce excluded, 25,566 of the 30,299 test methods are 30 non-blank lines or fewer and 29,033 are 60 or fewer, while only 387 (1.3 percent) exceed 100. A test that long is an outlier the reader has to scroll through, where one that names its phases can be read from its outline.

A violation is an added or modified test method over 100 non-blank lines left as one undivided body when it has distinct phases that could be named.

**Example:** LPD-105565 List the connected design library page template sets (https://liferay.atlassian.net/browse/LPD-105565). Commit `30c4b75d79b93` (`LPD-105565 Extract the repeated mock setup into helper methods`) lifted the setup the vertical nav tests repeated into `_setUpDesignLibraryGroup`, `_setUpFeatureFlagManagerUtil`, `_setUpLayoutPageTemplateCollectionServiceUtil`, `_setUpLayoutPageTemplateEntryServiceUtil`, and `_assertVerticalNavItem`, so each scenario reads as the steps it takes and the values it asserts, and the two were then merged into one `testGetVerticalNavItemList`.
