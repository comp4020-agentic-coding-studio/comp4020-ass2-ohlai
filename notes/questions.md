# Open questions

Questions the harness hit that `COURSE.md` cannot answer. Nothing gets filled
in on guesswork. Each question stays here until it is answered in `COURSE.md`,
then it is struck through with the commit that answered it.

## 1. ~~Teaching dates~~ ANSWERED

`COURSE.md` needs twelve dated teaching weeks, and `src/course-config.ts` needs
`startDate` and `endDate` to bracket them. Neither was supplied. Needed: the
date of week 1, and confirmation that the other eleven run weekly from it with
no mid-semester break. If there is a break week, say which week it falls after
and whether it counts toward the twelve.

Raised 2026-09-20. Answered 2026-09-20: week 1 opens Monday 15 February 2027,
weekly, with a two week break after week 6 that does not count toward the
twelve. Teaching resumes with week 7 on 12 April.

## 2. ~~The week list~~ ANSWERED

`COURSE.md` needs twelve week titles, each with a one-line `does:` and a
`key-term:`. None were supplied. The message said the list would be pasted and
it was not.

Also needed per week, because the spec checks read them off the session pages:
the thesis clause or clauses the week serves (`serves:`), and the week's
readings (`readings:`), since distinctness fails any two weeks sharing more
than one reading.

Raised 2026-09-20. Answered 2026-09-20: twelve weeks supplied with titles,
`does:`, `key-term:`, `serves:` and readings. The readings are recalled rather
than retrieved, so each one is verified before it ships. See question 7.

## 3. ~~Assessment items~~ ANSWERED

`COURSE.md` needs the assessment items with weights totalling 100, a due date
for each, and the thesis clause each one tests. None were supplied. The two
starter items in `src/content/assessments/` are template placeholders and are
not the course's assessment.

Raised 2026-09-20. Answered 2026-09-20: Wait Log 15, Teardown 25, Intervention
45, Studio Presentation 15.

## 4. ~~The thesis clause split, for confirmation~~ ANSWERED

The thesis was supplied verbatim. The clause ids the coherence check needs were
not, so the split was taken at the thesis's own commas:

- `T1` waiting is not a failure of a system
- `T2` it is a designed component of it
- `T3` the design is almost always about managing the person rather than the delay

This is a derivation and not an invention: the check asserts the three clauses
rejoin into the verbatim thesis exactly, so the split cannot drift from the
line it came from. Confirm the granularity is what you want. `T1` and `T2` are
one move stated twice, and if you would rather they were a single clause, say
so, because it changes what coherence demands of a week.

Raised 2026-09-20. Answered 2026-09-20: the thesis gained a third clause and
now splits at its semicolons, not its commas. Every clause is served by at
least two weeks.

## 5. ~~The course code, for confirmation~~ ANSWERED

The brief says `SLOP2xxx`. The repo was allocated `034` and only the level
digit is yours, so the code is `SLOP2034` and `level` is `2`.
`src/course-config.ts` now says `SLOP2034` and `level: 2`, with the title,
dates, description and tags supplied.

Raised 2026-09-20. Answered 2026-09-20.

## 6. Two things the course record schema would not take

`slopCourseMetaSchema` in `src/course-config.ts` is part of the platform, not
the course, so neither of these was worked around.

The description caps at 300 characters and the course's paragraph is 356. The
first two sentences are in the record, which is what a catalogue entry needs.
The third, "You will log your own waits, take one apart, and redesign a wait
you are not permitted to shorten", is on the outline page in full, so nothing
is lost, but the catalogue will not carry it. Say if you would rather cut
elsewhere.

The tag list caps at three and four were given. `time` was dropped, as the
most general of the four and the one closest to `delay`, which is already
there. The other three are `delay`, `interaction-design` and `service-design`.

Raised 2026-09-20.
