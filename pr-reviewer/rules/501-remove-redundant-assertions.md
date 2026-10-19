# 501: Remove Redundant Assertions

Do not assert a precondition that a later line already guarantees or asserts more strongly. The common case is `assertNotNull(x)` immediately before code that dereferences `x`, which would throw and fail the test on its own, or before a stronger assertion about `x` that could not pass if `x` were null.

In a Playwright spec, `await expect(x).toBeVisible()` before `toHaveText`, `toContainText`, or `toHaveCount` on the same locator is not a redundant guard, because those matchers do not check visibility. A probe on static HTML on 2026-10-19 showed it. On a `getByTestId` or CSS locator, `toHaveText` passes on an element with `display:none` or `visibility:hidden`, and only `toBeVisible` fails. On a `getByRole` locator, the role query skips those hidden elements, but `toHaveText` and `toHaveCount` still pass on a collapsed element (`height:0; overflow:hidden`), where `toBeVisible` fails. Counted over the specs in `modules/test/playwright/tests` outside Commerce on 2026-10-19, 17 `toBeVisible` checks on a variable come directly before a `toHaveText`, `toContainText`, or `toHaveCount` check on the same variable. A guard on a parent before a `toBeVisible` check on its child is different: the visible child proves the parent, so that guard is redundant. On LPD-110394 Refactor the design library Playwright specs (https://liferay.atlassian.net/browse/LPD-110394), the liferay review flagged the guards on `headerTitle`, `ownerItem`, and the breadcrumb in two runs, and both findings were refused.

**Rationale:** An assertion that cannot change the outcome of the test is noise. If the value were null, the dereference or the stronger assertion on the next line already fails the test, so the `assertNotNull` only adds a line to read and maintain. Removing it leaves the single assertion that states the real expectation.

A violation is an `assertNotNull`, or a similar guard, immediately followed by code that dereferences the same value or asserts a stronger property of it. A Playwright `toBeVisible` check before a `toHaveText`, `toContainText`, or `toHaveCount` check on the same locator is not a violation.

**Example:** commits `fa6b60e`, `30028a0`, and `6213899` removed `assertNotNull` calls whose next line already dereferenced the value or made a stronger assertion (for example reading `configurations.length`). The shape is always the same: a lookup, an `assertNotNull` on its result, and a specific assertion that dereferences the same result on the next line.

```diff
 Foo foo = service.findFoo();

-Assert.assertNotNull(foo);
 Assert.assertEquals("expected", foo.getName());
 Assert.assertEquals("description", foo.getDescription());
```