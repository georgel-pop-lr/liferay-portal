# Answer key

Do not give this file to the agent under evaluation. It is the scoring sheet.

Ten seeded violations and four traps, spread over the two files in `review/`.
Every line number is a line of the file it names, counted from 1.

## Seeded violations, all ten must be reported

| # | File | Line | Rule | What is wrong | Reference in `merged/` |
| --- | --- | --- | --- | --- | --- |
| S1 | `review/FooSetResourceTest.java.txt` | 23 | 3 | `"gamma"` is asserted before `"beta"` | `BarSetResourceTest.java.txt:21-23` asserts alpha, beta, gamma |
| S2 | `review/FooSetResourceTest.java.txt` | 33 | 23 | A blank line splits two parallel assertions on the same `data` map | - |
| S3 | `review/FooSetResourceTest.java.txt` | 41 | 45 | `setFieldValue` configures the mock before `themeDisplay` and `group` are declared; all declarations come first, configuration after | - |
| S4 | `review/FooSetResourceTest.java.txt` | 59 | 32 | The block mixes forms: a string literal, then three class literals, then another string literal | `BarSetResourceTest.java.txt:28-36` groups class literals first, sorted, then the string literals |
| S5 | `review/FooSetResourceTest.java.txt` | 84 | 14 | `group` and `fooCollection` are declared above the `try` although only its body uses them | `BarSetResourceTest.java.txt:44-45` declares both inside the `try` |
| S6 | `review/FooDisplayContext.java.txt` | 36 | 4 | `remoteLiveGroup` is declared before `localLiveGroup` | `BarDisplayContext.java.txt:36-37` declares them alphabetically |
| S7 | `review/FooDisplayContext.java.txt` | 46 | 12 | `title` is a single-use local handed straight to the next `return` | `BarDisplayContext.java.txt:45-47` returns the call directly |
| S8 | `review/FooDisplayContext.java.txt` | 57 | 40 | `_defaultTitle` is a noun, not a verb; it should be `_getDefaultTitle` | - |
| S9 | `review/FooDisplayContext.java.txt` | 83 | 20 | `300000L` fills a slot already typed `long` | `BarDisplayContext.java.txt:73` writes `300000` |
| S10 | `review/FooDisplayContext.java.txt` | 85 | 32 | `_FOO_PREFIX` sits after `_TIMEOUT`, splitting the sorted `String` group with a `long` | `BarDisplayContext.java.txt:69-73` keeps the two Strings together, the long last |

S5 may be reported as one finding or as two, one per variable. Either counts
once.

## Traps, none of these may be reported

Each is a case where a rule genuinely applies to the code in isolation, and the
already-merged counterpart writes it exactly the same way, so "Existing Code
Wins" says leave it. A run that reports one of these has not done the sibling
check.

| # | File | Line | Rule that appears to apply | Why it is not a finding |
| --- | --- | --- | --- | --- |
| T1 | `review/FooSetResourceTest.java.txt` | 73 | 20 | `BarSetResourceTest.java.txt:55` passes the identical `0L, 0L` |
| T2 | `review/FooSetResourceTest.java.txt` | 95 | 12 | `BarSetResourceTest.java.txt:65` writes the identical single-use `Group group` |
| T3 | `review/FooDisplayContext.java.txt` | 61 | 2 | `BarDisplayContext.java.txt:49-51` declares the same three parameters in the same order |
| T4 | `review/FooDisplayContext.java.txt` | 72 | 40 | `BarDisplayContext.java.txt:60` carries the same `_newCreationItem` name |

## Scoring

- Recall: seeded violations reported, out of 10.
- Traps: traps reported, out of 4. Zero is the target.
- Other false positives: anything reported that is neither seeded nor a trap.
  Judge these on their merits before counting them; a run may find something
  real that this key missed, and that is a finding about the key, not the run.
