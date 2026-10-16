# 610: Let DataGuard Delete Test Data

Do not add cleanup code for test data that DataGuard already deletes. In an integration test, `LiferayIntegrationTestRule` adds `DataGuardTestRule`, and with no `@DataGuard` annotation on the class, `autoDelete` is true (`DataGuard.java:22`, `DataGuardTestRule._autoDelete`). After each test, DataGuard deletes every leftover row through its `PersistedModelLocalService` delete method, and then it asserts that no data is left. So an entity that a test method creates and uses can be a plain local with no cleanup. Use a `@DeleteAfterTestRun` field only for a fixture that `setUp` creates or that more than one test method shares.

Do not ask for an `@After` method, a `try` and `finally` block, or a `delete*` call that only removes what the test created. Rule 001 still applies: if the class already cleans up its data in one way, a new test in that class can follow the same way.

**Rationale:** Cleanup code that repeats what DataGuard does adds lines to read and a second place to keep in step with the setup. A "caused leftover data" failure does not mean that cleanup is missing. It means that DataGuard could NOT delete a row, for example an orphan whose parent was removed with raw SQL. On `upstream/master` at `4450e5d83b5c4`, 4295 classes in `modules/apps` run with `@RunWith(Arquillian.class)`, and only 14 files turn the default off with `autoDelete = false`.

A violation is cleanup code that an added or modified integration test adds only to delete the data that the test itself created, in a class that keeps the DataGuard default. A request to add such cleanup is a false positive.

**Example:** LPD-109452 Technical Task | Browse sites and Design Libraries in the group selector (https://liferay.atlassian.net/browse/LPD-109452). The review asked to delete the depot entries after `BaseDepotGroupItemSelectorProviderTestCase.testIsGroupType`. DataGuard deletes them, and the integration run (37 of 37) reported no leftover data, so the request was refused.
