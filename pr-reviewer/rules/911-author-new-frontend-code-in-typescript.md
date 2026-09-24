# 911: Author New Frontend Code in TypeScript

A new frontend file is a `.ts` or `.tsx` file, never a `.js` or `.jsx` one. The files added to `modules/apps` in 2026 settle it: 1,336 `.ts` and `.tsx` files against 62 `.js` under `src/main/resources/META-INF/resources`, and 407 against 65 among the test files, with no `.jsx` file added anywhere.

The rule is about new files only. The tree still holds 2,552 `.js` files under those resource directories against 3,020 `.ts` and `.tsx`, so editing an existing `.js` file in place is normal work, and a pull is not asked to convert a file it only touches.

**Rationale:** the types are what let a reviewer check the props a component receives and the shape a request returns without running the code, and a new JavaScript file opts out of that for every later change to it.

A violation is a new `.js` or `.jsx` file under a module's frontend sources or its frontend tests.