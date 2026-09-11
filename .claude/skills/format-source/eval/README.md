# format-source eval

Instructions for running this eval. The human-facing write-up, with the results
and what they mean, is in `RESULTS.md`.

## Why it exists

A review pass over a real branch can only be compared against other passes:
nothing says how many real problems the branch held, so "found 8 things" has no
denominator. Here the violations are placed deliberately and written down, so
recall and false positives are both measurable and two runs months apart are
comparable.

## Layout

- `review/` holds the files under review.
- `merged/` holds the already-merged counterparts they were modelled on. This is
  what the skill's `## Existing Code Wins` section points at.
- `ANSWERS.md` is the scoring sheet. **Never give it to the agent being scored.**
- `RESULTS.md` is the write-up of the runs done so far.

Everything is `.java.txt` on purpose: nothing here should be compiled, formatted,
or picked up by the source formatter, and the line numbers in the answer key have
to stay put.

## Running one pass

Give a fresh agent, with no history, a prompt containing:

1. The path to the skill body (`../SKILL.md`), to be read in full first.
2. The paths of the files under review, in `review/`.
3. The paths of the merged counterparts, in `merged/`.
4. The procedure being tested. For the per-file shape: work one file at a time,
   read the file, read its merged counterpart, apply every applicable rule,
   record findings, then move on.
5. These constraints: report only, no edits, no gradle or ant, and no subagents.

Ask for exactly this output, and nothing else:

	# Findings: <n>

	- <file name>:<line> | rule <n> | <one sentence: what is wrong and the fix>

Use the bare file name and the line number counted from 1 in that file.

## Scoring a pass

Against `ANSWERS.md`:

- **Recall**, how many of the 13 seeded violations came back, and separately how
  many of the hard three, since those are what distinguish a careful pass.
- **Traps**, how many of the 4 traps were reported. Zero is the target. A trap is
  code a rule genuinely applies to, written exactly as the merged counterpart
  writes it, so the correct behaviour is silence.
- **Extras**, anything reported that is neither. Judge each on its merits: a run
  may find something real the key missed, and that is a finding about the key.

Match on file and line with a tolerance of two or three lines, because a run may
cite the opening line of a wrapped statement rather than the line naming the
symbol. Rule numbers are not scored strictly; `ANSWERS.md` lists the pairs that
describe the same fix.

Two reporting habits to record rather than penalise silently. A run may report
one defect once per affected variable, and a run may collapse three separate
blocks into a single finding. Both change the count without changing what was
detected, so note which happened.

## Adding to it

A rule that keeps producing false positives in practice earns a trap. A rule
nobody has seen fire is worth seeding once to find out whether it works at all.
Seed one defect per site: two defects on one line means runs report the other one
and the seeded miss looks like a recall failure.

When a fixture file changes, re-derive every line number in `ANSWERS.md` from the
file rather than adjusting the ones that look wrong.
