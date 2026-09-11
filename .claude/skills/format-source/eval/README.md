# format-source eval

A fixed scoring set for the manual rules in `../SKILL.md`. It exists because a
run over a real branch can only be compared against other runs: there is no
denominator, so "found 8 things" cannot be turned into a percentage. Here the
violations are known in advance, so recall and false positives are both
measurable, and two runs months apart are comparable.

## Layout

- `review/` holds the two files under review, a test and a display context.
  They are `.java.txt` on purpose: nothing here should be compiled, formatted,
  or picked up by the source formatter, and the line numbers in the answer key
  have to stay put.
- `merged/` holds the already-merged counterparts the review files were modelled
  on. This is what "Existing Code Wins" points at.
- `ANSWERS.md` is the scoring sheet. Do not show it to the agent being scored.

## Running it

Give a fresh agent the skill body, the two files in `review/`, and the
repository path so it can reach `merged/`. Ask for report-only output in the
shape the skill already uses, one line per finding:

	<file>:<line> | rule <n> | <what is wrong>

Then score it against `ANSWERS.md`: how many of the ten seeded violations came
back, and how many of the four traps were reported as findings.

## What each half measures

The ten seeded violations measure recall, and they are spread across rules 3, 4,
12, 14, 20, 23, 32, 40 and 45, the ones that actually turn up in real diffs.

The four traps measure the sibling check. Each one is code a rule genuinely
applies to, written exactly the way the merged counterpart writes it, so the
correct behaviour is to leave it alone and say nothing. Every one of the four is
a false positive a real run produced on a real branch, so this is not a
hypothetical failure mode.

## Keeping it honest

Adding a rule to `../SKILL.md` does not oblige anyone to seed it here, but a
rule that keeps producing false positives in practice earns a trap, and a rule
nobody has ever seen fire is worth seeding once to find out whether it works at
all. When a fixture file changes, re-derive every line number in `ANSWERS.md`
rather than adjusting the ones that look wrong.
