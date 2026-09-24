# 109: Name a Factory Helper After the Type It Returns

A private helper whose job is to construct and return an object is named `_get` followed by the full simple name of the type it returns: `_getDesignLibraryResourceCreationItem` for a helper returning `DesignLibraryResourceCreationItem`, not `_newCreationItem`, `_buildItem`, or any shortened form of the type.

**Rationale:** A reader who knows the return type can predict the name, and a grep for the type finds the helper beside every other value of that type. A private verb such as `_new` or a clipped noun such as `CreationItem` is a second spelling of a concept the type already names, and nothing in the diff shows it, since the new name reads consistently with itself.

A violation is a private helper that constructs and returns an object under a name other than `_get<ReturnType>`, most often a `_new*` name or one that drops words from the type. Counted over the private helpers in `modules/apps` outside Commerce on 2026-09-24, 2,597 are named `_get` plus their exact return type, 934 lead with `_create`, 185 with `_build`, and 7 with `_new`, so `_new` is the outlier. Do not flag an established `_create*` or `_build*` helper the file already carries, which rule 001 protects; flag the name a diff introduces.

**Example:** Brian Chan renamed `_newCreationItem` to `_getDesignLibraryResourceCreationItem` in both `FragmentDesignLibraryResourceTypeContributor` and `LayoutPageTemplateCollectionDesignLibraryResourceTypeContributor` on LPD-104839 and LPD-104840, commit `e5927d47e25a` (https://github.com/brianchandotcom/liferay-portal/commit/e5927d47e25a8e86396b6f7194316d750a16a859).
