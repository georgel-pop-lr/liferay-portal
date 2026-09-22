# 507: Reuse an Existing Implementation

Before adding a method that computes something, look for the computation in the codebase and call what is already there. A new method that repeats an existing one's feature flag check, its service call, and its mapping is a second copy of a decision that is supposed to have one home, and the two drift the moment either is fixed.

When the existing copy sits where the new caller cannot reach it, a private or protected method on some other class, the fix is to move the computation to the shared place rather than to write it twice. That place is a `*Util` in the `-api` module of the app that owns the concept: `modules/apps` holds 1,151 of them, and they are what a second module is expected to call.

Do not force the merge when the two are not actually the same. Check the parts that a diff of the bodies hides: whether one tolerates a missing optional service and the other does not, whether one swallows an exception and the other propagates it, whether they read the company from a parameter or from `CompanyThreadLocal`. A copy that exists to survive its dependency being absent is not duplication, it is a different contract, and collapsing it into the shared version changes behavior. Say which of the two the caller needs and why, rather than treating the shorter body as obviously correct.

`BaseAssetDisplayPageFriendlyURLResolver#getConnectedDesignLibraryGroupIds` in `modules/apps/asset/asset-display-page-api` is the case worth reading. It resolves `DepotEntryLocalService` through a `Snapshot` and returns `GetterUtil.DEFAULT_LONG_VALUES` when the depot module is absent or the call throws, so it is reusable only by a caller that wants those defaults. A caller that wants the failure is not served by it, and that, not the shape of the body, is what decides whether a second implementation is justified.

**Rationale:** Two implementations of one computation are a bug waiting for the next change to either. The cost is not the duplicated lines, it is that a reader who finds one has no way to know the other exists, so a fix lands in one and the other keeps the old behavior. It is also why the check belongs in review: the duplicate is invisible in a diff, which only ever shows the copy being added.

A violation is a new method whose body reproduces an existing method's logic, where the existing one is reachable or could be moved somewhere both callers reach, and no difference in contract justifies the second copy.
