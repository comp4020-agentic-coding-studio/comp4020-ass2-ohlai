# Decisions

One paragraph per commit: the hash, what it did, what the obvious alternative
was, why I went the other way, and how I checked the result was right. An
entry needs its commit's hash, so it lands in the commit after the one it
describes.

## 3d22670 docs: course bible as single source of truth

Wrote `COURSE.md` with the thesis verbatim, a three way clause split, and the
voice rules, and left the calendar, week list and assessment sections present
but empty behind `BLOCKED` markers pointing at `notes/questions.md`. The week
list, the dates and the assessment items were never supplied. The obvious
alternative was to draft twelve plausible weeks on the thesis and let them be
edited down, which is what an agent asked for a course usually does, and it
would have produced something that reads finished. I went the other way
because a plausible week is harder to notice than an empty section: the empty
section blocks the build and gets fixed, the plausible one ships and quietly
becomes the course. The clause split is the one thing I derived rather than
received, and I made it verifiable instead of trusted by requiring the three
clauses to rejoin into the verbatim thesis character for character, so the ids
cannot drift from the line they came from. Checked by re-reading the committed
file against the original brief line by line, confirming every fact in it was
supplied rather than inferred, and confirming `git show --stat 3d22670` touched
only the two intended files.

## 0201df8 chore: harness rules

Added the rules section to `CLAUDE.md` and replaced the template's "what this
is" placeholder with the real course. The obvious alternative was a fresh
`CLAUDE.md` written only from the rules I was given, which would have read more
cleanly than a rules section bolted onto the template's existing constraints. I
kept the template's material because it carries things the new rules cannot
know: that `defaultLayout` does not reach `.mdx` pages, that a collection key
is four addresses at once, that the font cache must not be cleared. Losing
those to tidiness would cost a day the first time one of them bit. Checked by
reading the merged file end to end for rules that now contradict each other,
and by confirming the new "never weaken a check" rule agrees with the
template's existing "never commit a regression" rather than restating it.

## 178e45a chore: one parser for COURSE.md so the format lives in one place

Put COURSE.md's syntax behind `spec/course-md.ts` and the API read behind
`spec/site-api.ts` before writing any check. The obvious alternative was to let
each check parse what it needs, which is less code up front and is how test
files usually start. I went the other way because seven files with private
regexes over one document is seven places to update when a heading moves, and
the failure is silent: a check whose regex stops matching finds nothing and
passes. Checked with `pnpm typecheck`, which is clean across 28 files, and by
writing the coherence check against the parser immediately afterwards to
confirm the shape was usable rather than merely plausible.

## 110afc0 test: a week that serves no part of the thesis is a bug

The coherence check, and the first one written because it is the one the
course is most likely to fail quietly. The obvious alternative for the clause
ids was to trust them: write `T1`, `T2`, `T3` in `COURSE.md` and have the weeks
point at them. I made them verifiable instead, by asserting the three clauses
rejoin into the verbatim thesis with only comma joiners between them. Trusting
them means a clause can be reworded in a way that slowly stops matching the
thesis it came from, and nothing notices, which is exactly the drift the check
exists to catch. Checked by editing `T2` from "a designed component of it" to
"a designed part of it" and confirming the rejoin test failed with the clause
named, then restoring and confirming `git diff` was clean.

## ca6dc38 test: the register is a course design decision, not a preference

The voice check, scanning `COURSE.md`, `src/content`, `src/decks` and
`src/pages`. Two design calls. The first was what to do about `---`, which is
an em dash stand-in in prose and also a frontmatter delimiter, a deck slide
break and a table rule. The obvious alternative was to leave `---` out of the
pattern and catch only real em dashes, which is what a quick version does. I
went the other way and exempted the structural lines by shape, because the
spaced double hyphen is the exact substitution someone makes the first time
this check fails them, and a rule that can be satisfied by typing two hyphens
is not a rule. The second call was the guard test asserting the scanner found
files and that `COURSE.md` is among them, which exists because the way a voice
check really fails is by scanning an empty list and going green. Checked
against the template's own starter content, which the check caught: eleven
dashes across eight files and an "in order to" in a staff biography.

## 8f4503e test: assessment measures the thesis or it measures nothing

The assessment check. The interesting decision was what "inside a teaching
week" means, since a due date is a day and a teaching week is a name. The
obvious alternative was the loose reading the build already has: inside
`startDate` and `endDate`, which would pass a deadline in a mid-semester break
or in the gap after the last class. I defined a teaching week as the seven days
its calendar date opens and required every deadline to fall in one, because the
point of the rule is that work is due where there is teaching behind it, and the
loose reading does not test that. Checked with a fixture calendar of twelve
weekly dates and two items, one due 2027-03-05 and one due 2027-06-01: the
first passed, the second failed naming its own date, and a `tests: T9` on the
second was rejected for citing a clause the thesis does not have.
