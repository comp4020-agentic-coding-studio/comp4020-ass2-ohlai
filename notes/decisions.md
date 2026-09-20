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
