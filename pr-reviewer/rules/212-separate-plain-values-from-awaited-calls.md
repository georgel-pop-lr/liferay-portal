# 212: Separate Plain Values from Awaited Calls

This rule is for TypeScript and JavaScript files: Playwright specs and pages, and frontend code. In a run of local declarations, each declaration has one of three types: a plain value (a `const` whose initializer has no `await`), an awaited call (a `const` whose initializer has an `await`), and a `let`. Put a blank line where the type changes. Keep a run of `let` declarations together, with no blank line between them. The dependencies decide the order of the groups, not this rule.

```ts
const applicationName = 'cms/basic-web-contents';
const contentTitle = `Title ${getRandomString()}`;

const space = await apiHelpers.headlessAssetLibrary.createSpace();
```

Inside a group that has no blank line in it, rule 201 applies: sort the names alphabetically, and put a value after the value that it uses.

**Rationale:** A plain value only names a string or a number. An awaited call creates data or waits for the page. The blank line shows the reader where the setup data stops and the side effects start. The corpus is clear on this. Counted on 2026-10-21 outside Commerce, over `modules/test/playwright`: a plain value followed by an awaited call has a blank line 440 times and no blank line 49 times, and an awaited call followed by a plain value 648 to 21. Over the frontend code of `modules/apps` (tests not counted): 18 to 4, and 41 to 4. Two `let` declarations in a row have no blank line 301 times and a blank line 24 times in Playwright, and 293 to 58 in `modules/apps`.

This rule only adds a blank line between two groups of different types. Inside one group, it does not ask for a blank line or forbid one. Between two plain values the corpus is split (1766 solid, 1557 apart in Playwright), so rule 001 decides there.

A violation is a plain value and an awaited call declared on adjacent lines with no blank line between them, in either order, or a blank line between two adjacent `let` declarations.

**Example:** on LPD-110394 Refactor the design library Playwright specs (https://liferay.atlassian.net/browse/LPD-110394), the pull changed many specs to `const space = await apiHelpers.headlessAssetLibrary.createSpace();` and put that line directly below the plain title constants, for example in `multiSpaceMembership.spec.ts` and `spaceConfiguration.spec.ts`. A blank line was added between the two groups in 25 blocks.