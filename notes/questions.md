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

## 7. The Houston baggage claim case does not verify

Week 6 asked for "the Houston airport baggage-claim case" as a reading. It
does not verify. The story traces to a 2012 retelling and no airport or
airline has ever confirmed the two claims it turns on, the six times longer
walk and complaints falling to zero. Neither of the outlets that tried to
source it found an original.

Following the rule, the slot is empty and no substitute was found for it.
Week 6 now runs on Norman alone as a reading. The case itself is named in the
week 6 body, as an example of a field's favourite evidence turning out to be
a parable, which is true and is worth teaching. Say if you would rather it
were cut from the page entirely.

Raised 2026-09-20.

## 8. Late work and extensions are not set

The policies page states the marks release policy, which was given. It has no
late penalty, no extension process and no evidence requirement, because none
were supplied and an assessment rule is not something to invent. The page
says so in place of stating one.

Needed: the per-day penalty and its floor, whether extensions need
documentation and from when, and who grants them.

Raised 2026-09-20.

**Answered 2026-09-21.** 5% of the item's available marks per day, floor at
seven days, the Studio Presentation exempt because it happens in a room.
Extensions up to five days from the convenor on the request with no
documentation, longer than that through the university's process, and a
decision inside two working days. The turnaround is published rather than
left vague, because this course cannot argue that delay is designed and then
leave a student refreshing an inbox for an answer it has already reached.
All four live in COURSE.md's `## Policy` section and render onto the page
through `PolicyTable.astro`, so the page cannot drift from the rule.

## 9. The teaching team is still the template's

`src/content/people/` holds two people who arrived with the template. The
convener entry has been rewritten to say only what is true of the course, and
the second entry has not been touched. Real names, roles, contact details and
consultation hours cannot be invented.

Needed: who teaches this course, and what each of them does.

Raised 2026-09-20.

**Partly answered 2026-09-21.** Consultation is set for both: the convenor
on Wednesdays 14:00 to 15:30 in teaching weeks, the tutor for thirty minutes
after each Thursday workshop. Both are drop-in, which is a course design
decision rather than an administrative one, because a booking system is a
queue with an admission test and week 7 is about what that does.

Still open: the two names are the template's and remain invented. The
portraits are gone rather than replaced, since `photo` is optional in the
people schema and a generated avatar would be a plausible placeholder, which
is the thing this repo's rules say is worse than a hole.
