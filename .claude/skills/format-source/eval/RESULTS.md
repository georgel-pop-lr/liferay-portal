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
places the violations deliberately: 13 seeded, of which three are hard, plus four
traps where a rule applies but the merged counterpart writes the code the same
way, and the correct behaviour is silence. All four traps are false positives
that real runs actually produced.

The hard three reproduce the LPD-104558 shape: a repeated entry whose first
argument is identical in every row, so ordering is decided by the second, and the
short name sorts before the longer ones that share its prefix. In one of the three
blocks the outlier sits in the middle rather than last, so a run that finds the
defect by noticing the last entry looks wrong picks up two and misses one.

Thirty passes, five per cell: three batch sizes against two models, everything
else identical.

| Batch | Model | Runs | Found of 13 | Perfect runs | Traps | Cost | Time |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 file at a time | Opus | 5 | 13.0 | 5 | 0 | $0.83 | 127s |
| 2 at a time | Opus | 5 | 13.0 | 5 | 0 | $0.78 | 139s |
| 3 at once | Opus | 5 | 13.0 | 5 | 0 | $0.73 | 112s |
| 1 file at a time | Sonnet | 5 | 10.8 | 1 | 0 | $0.33 | 264s |
| 2 at a time | Sonnet | 5 | 10.8 | 0 | 0 | $0.29 | 258s |
| 3 at once | Sonnet | 5 | 11.0 | 1 | 0 | $0.28 | 248s |

## What the numbers say

**Batch size does not change what is found, at three files.** Opus scored 13 of
13 in all fifteen runs regardless of grouping, and Sonnet's average moved by 0.2
across the three shapes. Reviewing everything at once was also the cheapest and
the fastest, so at this size there is no case for chunking. This does not
contradict round one, where per-file scoping beat a whole-diff pass on 41 files:
three files fit comfortably in one pass and 41 do not. The lesson is that
chunking buys nothing until the diff is large enough to need it.

**Nothing reported a trap.** Thirty runs, 120 opportunities, zero. The
merged-sibling check works when the merged file is actually put in front of the
reviewer.

**Opus and Sonnet are not interchangeable here.** Opus was perfect in 15 of 15.
Sonnet was perfect in 2 of 15 and averaged 10.9. Its misses are consistent rather
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
