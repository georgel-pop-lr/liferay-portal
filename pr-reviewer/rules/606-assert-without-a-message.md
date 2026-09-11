# 606: Assert Without a Message

Write `Assert.assertEquals(expected, actual)` with no leading message argument, and the same for every other assertion that offers a message overload. JUnit already reports the expected value, the actual value, and the line number, so a hand written message restates what the failure prints and drifts as the test evolves. A label that describes which case is under test belongs in the test method name, per rule 603, or in a comment, not in the assertion.

Add a message only where the actual side is a scalar derived from a collection or a map, such as `list.size()` or a count from `map.keySet()`. The failure would otherwise print two bare numbers and nothing about the contents, so the established form passes the collection itself as the message: `Assert.assertEquals(list.toString(), expected, list.size())`.

**Rationale:** An assertion is read far more often than it fails, and the message is the part that goes stale first, because it describes an expectation the code below it can change without anyone updating the string. Leaving it out removes a second statement of the same fact and lets the assertion read as the one line it is. The collection case is the exception that proves the rule: there the message carries information the failure output genuinely lacks.

A violation is an assertion whose first argument is a hardcoded string literal message and whose actual value is not a scalar derived from a collection or a map.

**Example:** the `modules/apps` test corpus settles this by a wide margin. Across `modules/apps/**/*Test.java` there are 34161 two argument `Assert.assertEquals` calls against 170 whose first argument is a hardcoded literal message, roughly 200 to 1. The 4463 three argument calls whose first argument is not a literal are the collection form above, better than a quarter of them written literally as `.toString()`.