# 603: Name a Test Method After the Method It Tests

When the qualifier names the state of a property, phrase it as `When<Subject><Property>Is<State>`: `testGetFooWhenBarBazIsNull`, not `testGetFooWhenBarHasNullBaz`, and `testGetFooWhenBarBazIsValid`, not `testGetFooWhenBarHasValidBaz`.

Name a test method `test` followed by the exact name of the method it tests, including that method's own `is` or `has` prefix. The test for `isQuotaExceeded()` is `testIsQuotaExceeded`, not `testQuotaExceeded`; the test for `isValidConnection()` is `testIsValidConnection`. Append a scenario qualifier for a variant, as in `testIsValidConnectionWithNullAPIKey`.

The method it tests is one the subject declares, the subject being the class the test is named after with its `Test` suffix removed, and that holds however the test reaches it. An integration test that drives the subject through the runtime instead of calling it still takes its name from the method under test, with the flow it drives written into the qualifier. When the subject declares a single public method, every test method in the class begins with that method's name.

This rule covers Java test methods. A frontend test in a `.ts`, `.tsx`, `.js` or `.jsx` file is titled after what it does instead, under rule 916, so never cite this rule against an `it()` or `test()` title.

An MVC command test is the one case the codebase has not settled. A `*MVCActionCommandTest`, `*MVCRenderCommandTest` or `*MVCResourceCommandTest` may name a test after the command it drives, such as `testChangeStyleBookEntry` in `ChangeStyleBookEntryMVCActionCommandTest`, instead of after a method the command declares or inherits, such as `processAction` or the protected `doTransactionalCommand` it reaches through `ReflectionTestUtil`. Counted on 2026-10-08 over the 158 non-Commerce MVC action command test files in `modules/apps`, 49 name a test after the command and 66 after a method the command declares or inherits, so both forms are accepted, even side by side in one file: never raise a test named after the command against one named after a method, or the other way round, whichever way the file or its module leans. `layout-content-page-editor-web-test` names 16 of its 33 MVC action command test files after the command against 9 after a method, `EditLayoutDesignMVCActionCommandTest` holds two command-named tests beside `testUpdateLayoutWithIconWithoutPermissions`, and `ChangeStyleBookEntryMVCActionCommandTest.testChangeStyleBookEntry` is the sibling that `testChangeMasterLayout` from LPD-81022 Design Library Scope for Master Pages (https://liferay.atlassian.net/browse/LPD-81022) copies.

**Rationale:** A test name that matches the method under test lets a reader jump from a failing test straight to the method, and it keeps the suite's names parallel to the API. Dropping the `is`, writing `testQuotaExceeded` for `isQuotaExceeded`, breaks that mapping and hides which method the test covers. Naming a test after the scenario breaks it outright, because nothing in the name says which method the failure belongs to and the class stops reading as a list of the methods it covers. Putting the property before its state in the qualifier makes a sorted method list group the variants by the property under test, and the name reads as a subject, verb, complement sentence.

A violation is a test method whose name does not begin with `test` plus a method the subject declares. It takes two common forms: a name that omits the `is` or `has` prefix of the method under test, and a name taken from the behavior or the flow the test drives rather than from any method on the subject. A scenario qualifier that puts the state before the property, as in `WhenBarHasNullBaz` for `WhenBarBazIsNull`, is a violation too.

**Example:** https://github.com/brianchandotcom/liferay-portal/pull/181681 was closed with "test method names do not map to name being tested". `LayoutPageTemplateDepotRolePermissionsContributor` declares one public method, `getDepotRolePermissions()`, and its integration test named its methods after the flow they drove, `testManageLayoutPageTemplatesWithDesignLibraryMember` and `testManageLayoutPageTemplatesWithDesignLibraryRoles`. The names are `testGetDepotRolePermissionsWithDesignLibraryMember` and `testGetDepotRolePermissionsWithDesignLibraryRoles`, which keep the scenario in the qualifier. The unit test in the same pull, `testGetDepotRolePermissions`, already mapped. A qualifier that names the state of a property puts the property first.

```diff
-public void testGetFooWhenBarHasNullBaz() throws Exception {
+public void testGetFooWhenBarBazIsNull() throws Exception {
```

```diff
-public void testGetFooWhenBarHasValidBaz() throws Exception {
+public void testGetFooWhenBarBazIsValid() throws Exception {
```