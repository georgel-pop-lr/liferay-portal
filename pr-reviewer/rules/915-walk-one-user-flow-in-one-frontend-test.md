# 915: Walk One User Flow in One Frontend Test

When several `it()` blocks render the same component, perform one action each, and check one piece of text each, they are usually the steps of one flow a user walks through. Write that flow as one `it()` that asserts each state on the way: submit the empty form and see the name error, fill the name and see the subtype error, submit again and see the server error, fix it and see the navigation. Reuse the one render and queue the responses with `mockResolvedValueOnce`.

Keep a test separate only when its path ends the flow early or needs a different fixture, such as a rejected fetch that shows a toast, or a different set of props. Every branch the separate tests covered must still be asserted in the merged one. Breaking one of those branches in the component has to fail the merged test.

This is a preference, not a counted convention. Frontend tests under `modules/apps` are written both ways, so weigh it against rule 001, and raise it when a pull adds three or more such single step tests for one component.

**Rationale:** Each extra `it()` pays for its own render, and the reader has to visit every block to rebuild the order the user actually meets the states in. One test that walks the flow reads in that order, and it also catches a state that only goes wrong after the step before it.

**Example:** on LPD-106071 Administer display page templates from the Design Library (https://liferay.atlassian.net/browse/LPD-106071), `AddDisplayPageTemplateDesignLibraryModalContent.test.tsx` went from five tests to two. The validation, subtype, server error and navigation steps became one flow, and the network failure toast stayed on its own. Disabling the subtype check still failed the flow.