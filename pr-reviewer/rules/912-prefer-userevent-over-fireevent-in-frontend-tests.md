# 912: Prefer userEvent Over fireEvent in Frontend Tests

Drive a user interaction in a frontend test with `userEvent` from `@testing-library/user-event`, not with `fireEvent`. `userEvent` dispatches the whole sequence of events a real interaction fires, and it respects disabled elements and focus, so it catches a broken handler that a single synthetic `fireEvent` call passes straight through.

The codebase leans this way without having settled it. Across `modules/apps`, 227 test files import `userEvent` and 235 use `fireEvent`. Among the test files added in 2026, 65 use only `userEvent`, 39 use only `fireEvent`, and 16 use both. That is a direction, not a convention, so rule 001 decides an existing file: a new `fireEvent` call in a file that already drives everything through `fireEvent` follows the file.

**Rationale:** a test that fires one synthetic event proves the handler runs, not that a user can reach it, which is the part that breaks when a button is disabled or loses focus.

Raise a `fireEvent` call in a new test file, or in a file that otherwise uses `userEvent`, as a preference. Never report it as a violation on its own.