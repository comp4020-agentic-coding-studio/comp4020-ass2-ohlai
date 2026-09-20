# Open questions

Questions the harness hit that `COURSE.md` cannot answer. Nothing gets filled
in on guesswork. Each question stays here until it is answered in `COURSE.md`,
then it is struck through with the commit that answered it.

## 1. Teaching dates

`COURSE.md` needs twelve dated teaching weeks, and `src/course-config.ts` needs
`startDate` and `endDate` to bracket them. Neither was supplied. Needed: the
date of week 1, and confirmation that the other eleven run weekly from it with
no mid-semester break. If there is a break week, say which week it falls after
and whether it counts toward the twelve.

Raised 2026-09-20.

## 2. The week list

`COURSE.md` needs twelve week titles, each with a one-line `does:` and a
`key-term:`. None were supplied. The message said the list would be pasted and
it was not.

Also needed per week, because the spec checks read them off the session pages:
the thesis clause or clauses the week serves (`serves:`), and the week's
readings (`readings:`), since distinctness fails any two weeks sharing more
than one reading.

Raised 2026-09-20.

## 3. Assessment items

`COURSE.md` needs the assessment items with weights totalling 100, a due date
for each, and the thesis clause each one tests. None were supplied. The two
starter items in `src/content/assessments/` are template placeholders and are
not the course's assessment.

Raised 2026-09-20.

## 4. The thesis clause split, for confirmation

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

Raised 2026-09-20.

## 5. The course code, for confirmation

The brief says `SLOP2xxx`. The repo was allocated `034` and only the level
digit is yours, so the code is `SLOP2034` and `level` is `2`.
`src/course-config.ts` still says `SLOP1034` and `level: 1`. It was left alone
because changing it means also writing `title`, `startDate`, `endDate`,
`description` and `tags`, and the dates are question 1.

Raised 2026-09-20.
