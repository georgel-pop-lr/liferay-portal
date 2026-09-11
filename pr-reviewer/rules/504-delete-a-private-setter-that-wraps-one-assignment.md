# 504: Delete a Private Setter That Wraps One Assignment

A `private void _setXyz()` whose entire body is one assignment to a field, and which is called from a single place, is dead weight. Inline the assignment at that call site and delete the method.

**Rationale:** The method promises a step worth naming and delivers an assignment the reader could have read directly. It costs a jump to the definition to learn that nothing happens there, and it hides the field being set behind a name that only repeats the field. Inlining it puts the assignment in the flow where it belongs and removes a member from the class.

Rule 801 makes a method used in one place `private`; this rule goes one step further for the degenerate case, where the body is short enough and plain enough that even a private method does not earn its name.

A violation is a private method whose body is a single assignment to a field, with exactly one caller. A method with a second caller stays, and so does one whose body does real work before the assignment.

**Example:** commit `5ae164d98` (https://github.com/liferay/liferay-portal/commit/5ae164d98), titled "Inline", deleted `_setFiltersJSONArray` and `_setGroupedFiltersJSONArray` and moved their two assignments to the one place that called them.