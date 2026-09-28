# 508: Chain Overloads Through the Fullest One

When a class has several overloads of one method that do the same job, exactly one of them does the work, and every other overload calls a sibling, passing its defaults for the parameters it does not take. Two overloads that each write out the same underlying call, with their own copy of the fixed arguments, are one decision written twice.

The fullest overload is the one that carries every parameter any caller varies. The shorter ones exist to spare their callers those parameters, so their bodies are a single call to a sibling, plus whatever the shorter form adds of its own, such as placing the result in a structure. When no overload carries every parameter, add the fullest one as a private sibling rather than letting two overloads each call the underlying service with part of it.

Counted across `modules/apps`, by grouping the private methods that share a name in one file: in 2,305 production groups every overload but one calls a sibling, against 222 groups where none does and 18 where some do. In test files the split is 458 to 138, with 30 partial. The groups where no overload calls a sibling include overloads that do genuinely different work under one name, so the share of real duplication among them is smaller than the count.

Do not chain overloads that only share a name. When two overloads call different services, or the same service with a different contract (one tolerates a missing entity and the other throws), they are two methods, and forcing one through the other hides the difference. Rule 507 draws the same line for implementations in different classes.

**Rationale:** The fixed arguments of the underlying call are the part that changes when the API changes. Written once, a new parameter or a changed default is one edit; written in every overload, the edit has to find each copy, and the one it misses keeps the old behavior with nothing in the signature to say so.

A violation is two or more overloads of one private method that each make the same underlying call with their own copy of its fixed arguments, where one could call the other or a fullest sibling could carry both.

**Example:** LPD-107119 Use the target group for segments experiences when copying page content to another site (https://liferay.atlassian.net/browse/LPD-107119). `LayoutLocalServiceCopyLayoutContentTest` had two `_addFragmentEntryLink` overloads, one taking a `FragmentEntry` and one taking a renderer key, each calling `_fragmentEntryLinkLocalService.addFragmentEntryLink` with its own eighteen arguments. Commit `75bd014dd7e48` gave the only call to a private `_addFragmentEntryLink(defaultSegmentsExperienceId, fragmentEntryERC, fragmentEntryScopeERC, html, layout, position, rendererKey, type)`, and the `FragmentEntry` overload now passes its values to it.
