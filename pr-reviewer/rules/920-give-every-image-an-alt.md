# 920: Give Every Image an Alt

An image that the pull adds must have an `alt`. This is an accessibility requirement (WCAG 1.1.1, the axe `image-alt` check), not a convention that you count. Without an `alt`, axe flags the image and a screen reader announces the file name.

Apply it to each place that can render an image:

- In JSX, an `<img>` has an `alt` attribute. Use `alt=""` only for a decorative image that has text next to it with the same meaning.
- In a JSP, a Clay card tag with `imageSrc` also has `imageAlt`.
- In Java, a Clay card class (`VerticalCard`, `NavigationCard`, `HorizontalCard`, or a base class of one) that returns an image from `getImageSrc()` also implements `getImageAlt()`. The interface default returns `null`, and then the tag writes no `alt`.

In a Java card, return real text, usually the title of the card, and escape it with `HtmlUtil.escapeAttribute`. `NavigationCardTag`, `VerticalCardTag`, and `StickerTag` write the value into the attribute as it is, so a raw title with a quote breaks the markup. A blank value does not help here: the tags write the `alt` only when `Validator.isNotNull(imageAlt)` is true, so `StringPool.BLANK` gives an image with no `alt` at all.

The code on master does not follow this rule, and the review must not call it the convention. The counts are from `modules/apps` and `modules/dxp/apps`, with Commerce, tests, and the Clay sample module excluded. On `upstream/master` at `910175bc8f993`, 39 Java card classes return an image, and only 1 implements `getImageAlt()`, which returns `StringPool.BLANK`. The JSPs give `imageAlt` with all 3 of their `imageSrc` attributes. At `32dfa44737dd1`, 85 of the 128 `<img>` elements in JSX and JS have an `alt` or spread their props.

Judge only the images that the pull adds, or the cards whose image the pull changes. Do not flag an old card that the pull does not touch.

**Rationale:** a screen reader user cannot see the image, so the `alt` is the only thing that tells them what it shows. The fix costs one method or one attribute, and a missing `alt` is a defect that an accessibility audit reports against the product.

A violation is an added `<img>` with no `alt`, an added Clay card tag with `imageSrc` and no `imageAlt`, or an added or changed Java card class that returns an image from `getImageSrc()` and does not return a value from `getImageAlt()` that is not blank and is escaped.

**Example:** The reviewer @veroglez found the group cards of the item selector on pull 9353 (https://github.com/liferay-content-management/liferay-portal/pull/9353#issuecomment-6289437071), LPD-109452 Browse sites and Design Libraries in the group selector (https://liferay.atlassian.net/browse/LPD-109452). `GroupNavigationCard` and `GroupVerticalCard` returned the group logo with no `alt`, and the fix added `getImageAlt()` to their base class `BaseGroupCard`:

```java
public String getImageAlt() {
	return HtmlUtil.escapeAttribute(getTitle());
}
```
