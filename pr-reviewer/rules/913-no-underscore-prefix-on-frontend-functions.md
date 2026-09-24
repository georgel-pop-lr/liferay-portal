# 913: Do Not Prefix a Frontend Function With an Underscore

The leading underscore that marks a private member in Java does not carry over to JavaScript and TypeScript. A module scope function or arrow function constant in a `.ts` or `.tsx` file takes a plain camelCase name: `modules/apps` declares 3,125 of them without the prefix against 56 with it, and 47 of those 56 sit in three areas, `site`, `frontend-js` and `frontend-data-set`.

A function that is not exported is already private to its module, so the prefix adds nothing the language does not say.

**Rationale:** the underscore is a Java convention read as "private to the class", and in a module it marks nothing the missing `export` does not already mark, so it only makes a helper look different from the 3,125 around it.

A violation is a new function or function valued constant in a `.ts`, `.tsx`, `.js` or `.jsx` file whose name begins with `_`.