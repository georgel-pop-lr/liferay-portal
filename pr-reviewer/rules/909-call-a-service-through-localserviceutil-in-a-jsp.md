# 909: Call a Service Through LocalServiceUtil in a JSP

In a JSP, reach a service through its `*LocalServiceUtil` static accessor. Do not have the portlet stash its injected service in a request attribute, as `renderRequest.setAttribute(FooLocalService.class.getName(), _fooLocalService)`, only for the JSP to cast it back out. Fixing it takes both halves: delete the `setAttribute` call in the portlet, and swap the JSP import from the service interface to the Util.

Both forms reach the service layer, and neither reaches persistence. The two are easy to confuse because the persistence class carries the same suffix: `FragmentCollectionLocalServiceUtil` is the service and is what this rule asks for, while `FragmentCollectionUtil` is persistence and is not.

**Rationale:** The attribute round trip buys nothing the static accessor does not already give. What it costs is the call path: a reader looking at the JSP sees a cast from an untyped attribute and has to find the portlet that put it there to learn where the service came from, and a reader looking at the portlet sees a value set into the request with no visible consumer. Neither end can be understood alone. The Util names the service at the point of use.

A violation is a `setAttribute` call keyed on a `*LocalService` class name together with the matching cast in a JSP, on either side of the pair.

**Example:** Brian Chan questioned exactly this pair on the LPD-83557 Hide the option to export when you export all Fragment Set (https://liferay.atlassian.net/browse/LPD-83557) branch: "in the jsp, why? `FragmentCollectionLocalService fragmentCollectionLocalService = (FragmentCollectionLocalService)request.getAttribute(FragmentCollectionLocalService.class.getName())`".