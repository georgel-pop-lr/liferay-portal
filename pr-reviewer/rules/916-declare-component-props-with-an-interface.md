# 916: Declare Component Props With an Interface

Declare the props of a React component with `interface`, not with a `type` alias. Across the `.tsx` files under `modules/apps`, Commerce excluded, 951 props declarations use `interface` against 204 that use `type`, and 819 files use only `interface` against 168 that use only `type`.

Only the form is a rule. The name is not settled, so it follows the module under rule 001. The plain `Props`, a component qualified `<Component>Props` and the `IProps` of `frontend-js` (121 of its 208 files) are all established, so never flag one of them in a module that already uses it. One thing does follow from the language: two components in one file cannot share `Props`, so each component besides the default export gets its own `<Component>Props`. `ContentTypeModalForm.tsx` in `layout-page-template-admin-web` has this shape, with `Props` for the default export and `MappingTypesSelectorProps` and `FormFieldProps` for the two inner components.

Every member of the props type is a name the diff adds, so it goes through rule 003 like any other name. A prop that the Java side sends through a `HashMapBuilder` keeps the same key on both sides, under rule 106.

**Rationale:** one form for one job lets a reader find the props of any component with the same search, and `interface` is the form nearly every component already uses.

A violation is a new props declaration written as a `type` alias in a module whose other props use `interface`, or two components in one file typed by the same props declaration.