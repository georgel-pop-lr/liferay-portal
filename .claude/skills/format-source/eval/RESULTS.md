# What we measured, and what came out of it

Written 2026-09-11. This is the human-readable half; `README.md` is the runbook
for actually running a pass.

## Where this started

The `format-source` skill runs an automatic formatter and then applies 47 manual
rules that the formatter cannot see. The question on the table was narrow: should
the skill be pinned to a cheaper model to save money. Answering it turned up
something more useful, so this file records both.

The thing that made it worth measuring is LPD-104558. Two pull requests were
closed over a single defect class: `Layout.class.getName()` sorted after
`LayoutPageTemplateCollection` and `LayoutPageTemplateEntry`, first in a test, and
then, after that one was fixed and the pull resent, in the production contributor
the same change added. It was fixed by hand in three commits. The manual rules
should have caught it, and the skill as it ran then reported nothing.

## Round one: a real branch

A 41-file branch at a frozen head, reviewed by cold agents with an identical
prompt, only the model and the procedure differing. Findings were adjudicated
against the already-merged counterpart of each file, and for the ordering family
against those three fix commits, so that part is not a model judging a model.

| Shape | Model | Runs | Time | Cost | Real defects | False |
| --- | --- | --- | --- | --- | --- | --- |
| Whole diff in one pass | Sonnet | 2 | ~6m | $1.76 | 0 | 0 |
| Whole diff in one pass | Opus | 2 | ~8m | $2.80 | 2 to 6 | 4 to 5 |
| 47 rules split over 6 parallel agents | Sonnet | 1 | 8m 21s | $7.47 | 0 | 5 |
| One file at a time | Sonnet | 2 | 9 to 12m | $2.30 to $2.90 | 1 to 2 | 0 |
| One file at a time | Opus | 5 | 12 to 14m | $6.66 to $8.10 | 6 to 9 | 0, 3, 0, 0, 0 |

Three things came out of it.

Per-file scoping is the change that matters. Every one of the five per-file Opus
runs found the complete `Layout.class.getName()` family, and false positives fell
from four or five a run to none in four of five. No whole-diff pass managed both.

Splitting the rules across parallel agents was tried because it had been
suggested, and it lost on every axis: 2.7x the cost of one pass and nothing
valid, missing ordering defects a single pass catches every time. Splitting by
agent is what makes it expensive; the fixed cost is paid per agent.

Sonnet never found any of the confirmed defects at any scope tried.

## Round two: a fixture with a known answer

Round one has no denominator. It can say a run found eight real problems, not
what fraction of the real problems that is. So the fixture in this directory
places the violations deliberately, and writes down where they are.

The hard three reproduce the LPD-104558 shape: a repeated entry whose first
argument is identical in every row, so ordering is decided by the second, and the
short name sorts before the longer ones that share its prefix. In one of the three
blocks the outlier sits in the middle rather than last, so a run that finds the
defect by noticing the last entry looks wrong picks up two and misses one.

It contains **13 defects planted on purpose**, three of them the hard ones just
described, and **4 traps**. A trap is code a rule technically applies to, written
exactly the way the already-merged file writes it, so the right answer is to
leave it alone and say nothing. All four are false positives that real runs
actually produced on a real branch.

Thirty passes were run against it, five per cell: three batch sizes against two
models, everything else identical.

That gives two scores, running in opposite directions:

- **Defects found**, out of 13. Higher is better; 13 means the run found every
  planted defect.
- **Traps wrongly reported**, out of 4. Lower is better; 0 means the run fell for
  none of them.

A third column counts how many of the five runs in that row were flawless, that
is, found all 13 planted defects with nothing missed. "5 of 5" means the
configuration got everything every single time; "1 of 5" means it did so once and
the other four runs each missed something. It is there because an average hides
consistency: a configuration that scores 13 every time and one that alternates
between 8 and 13 can look similar on paper and behave very differently in use.

Each row below is one configuration run five times. The "per run" column lists
all five results rather than averaging them, because the spread turned out to
matter more than the average.

| Files per pass | Model | Defects found, per run (13 planted) | Runs (of 5) that found all 13 | Traps wrongly reported | Cost per run | Time per run |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Opus | 13, 13, 13, 13, 13 | 5 of 5 | none | $0.83 | 127s |
| 2 | Opus | 13, 13, 13, 13, 13 | 5 of 5 | none | $0.78 | 139s |
| 3 | Opus | 13, 13, 13, 13, 13 | 5 of 5 | none | $0.73 | 112s |
| 1 | Sonnet | 12, 13, 9, 10, 10 | 1 of 5 | none | $0.33 | 264s |
| 2 | Sonnet | 11, 12, 10, 12, 9 | 0 of 5 | none | $0.29 | 258s |
| 3 | Sonnet | 8, 11, 12, 13, 11 | 1 of 5 | none | $0.28 | 248s |

In words: every Opus run found all 13 planted defects, whatever the batch size.
Sonnet found between 8 and 13, changing from run to run on identical input, and
found all 13 in only 2 of its 15 runs. Neither model reported a single trap in
any of the 30 runs.

## What the numbers say

**Batch size does not change what is found, at three files.** Opus scored 13 of
13 in all fifteen runs regardless of grouping, and Sonnet's spread is the same
whichever way its files are grouped: it lands between 8 and 13 either way, and
the difference between the three shapes is smaller than the difference between
two Sonnet runs of the same shape. Reviewing everything at once was also the cheapest and
the fastest, so at this size there is no case for chunking. This does not
contradict round one, where per-file scoping beat a whole-diff pass on 41 files:
three files fit comfortably in one pass and 41 do not. The lesson is that
chunking buys nothing until the diff is large enough to need it.

**Nothing reported a trap.** Thirty runs, 120 opportunities, zero. The
merged-sibling check works when the merged file is actually put in front of the
reviewer.

**Opus and Sonnet are not interchangeable here.** Opus found all 13 in every one
of its 15 runs. Sonnet found all 13 in 2 of its 15, and in the other 13 runs it
missed between one and five. Its misses are consistent rather
than random: the blank line splitting two parallel assertions, missed in 10 runs
of 15, and the noun-only method name that rule 40 covers, missed in 8. In 6 runs
it reported the three hard blocks as a single combined finding, which detects the
defect but hands a reviewer one line instead of three fixes.

**Sonnet is cheaper and slower.** About a third of the cost, roughly twice the
wall clock, fewer but much longer turns.

## What we changed

The skill now applies the manual rules one file at a time and requires a check
against the already-merged counterpart before anything is reported. That is the
commit this eval sits beside.

The pin to a cheaper model was dropped. On the real branch Sonnet found none of
the confirmed defects, and on the fixture it misses a fifth of the seeded ones
and reports the hard cases less usefully. The saving is real and small; what it
costs is the findings.

## What this does not settle

The fixture is 3 files and 13 violations, and Opus saturates it. A saturated
fixture cannot rank anything above the level it tests, so the batch-size result
holds for small diffs only. Two further review files are in `review/` with no
keyed violations yet, so that the fixture can grow to five and the same question
can be asked where the answer might differ.

The rules exercised are 3, 4, 12, 14, 20, 23, 32, 38, 40 and 45. The other
thirty-odd are untested here, and a rule nobody has watched fire is a rule nobody
knows works.
