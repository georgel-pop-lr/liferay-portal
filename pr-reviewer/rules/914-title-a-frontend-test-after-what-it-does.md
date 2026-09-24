# 914: Title a Frontend Test After What It Does

The title of an `it()` block in a frontend test is a short phrase saying what the test does or checks, such as `it('shows an error when the name is empty')`. It is not the name of the function under test. This is the opposite of rule 603, which names a Java test method after the method it tests.

The codebase is close to unanimous. Of the 6,863 `it()` titles in the frontend tests under `modules/apps`, Commerce excluded, 11 begin with a camelCase identifier, and most of those still go on to describe a behavior, as in `it('getRangeItems uses the last selected item as the anchor')`.

**Rationale:** Jest prints the `describe` and `it` titles as one sentence when a test fails, so the title is the only part of the test a reader sees before opening the file. A title that names a function tells them where to look but not what broke.

A violation is an `it()` or `test()` title the diff adds that is only a function or component name, or that does not say what the test does.