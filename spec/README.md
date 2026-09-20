# The spec

Every deliverable's spec — what the markers consider when they judge whether
your work matches what was required — is published on the course website, and
this repo's name tells you which one applies: the course API maps repo prefixes
to deliverables, and the `start` course skill walks your agent through pulling
the right one. The brief poses the problem; the spec is the fixed contract. Read
both on the site before you plan or build.

One file is supplied here:

## Course coherence (shipped, always on)

`data-integrity.test.ts` checks the one cross-page fact the content schemas and
build cannot: dated material stays inside the course period. The build already
owns compilation, accessibility, internal links, content references, API
generation and deck compilation.

## Your spec tests (yours to write)

Turning the week's published spec into tests is your work, not the template's.
Some spec lines are mechanically checkable — assert those here, in your own test
file alongside the supplied ones (any `spec/*.test.ts` runs with `pnpm check`).
Some lines only a person can judge; leave those to the crit. There is no minimum
count: select the checks that protect your work's real promises, and test the
**contracts** — what the page must do, not how you built it — so the tests
survive a change of approach, or of stack.

A green suite here is backpressure, not a mark: your tutor verifies what you
deployed against the published spec at the crit, and keeping your own tests
green is how you arrive with no surprises.

## The course design sensors (mine, carried forward)

Eight checks that hold the course's design decisions rather than this brief's
requirements. Each file's header comment names the decision it protects, and
`COURSE.md` is what all seven read. They are sensors, not contract tests: none
of them retire when Assignment 2 does, because none of them are about
Assignment 2. A course with a thesis needs them whatever it is built in.

| File | The decision |
| :-- | :-- |
| `coherence.test.ts` | A week serving no part of the thesis is a bug, and so is a clause fewer than two weeks serve. |
| `distinctness.test.ts` | Twelve weeks that blur into each other are one week taught twelve times. |
| `voice.test.ts` | The register is a course design decision, not a preference. |
| `assessment.test.ts` | Assessment measures the thesis or it measures nothing. |
| `calendar.test.ts` | Twelve teaching weeks, in order, once each. |
| `provenance.test.ts` | A number without provenance is a rumour. |
| `deck.test.ts` | A linked deck that is a stub is a broken promise. |
| `but-wait.test.ts` | A recurring block that repeats itself is a broken promise. |

`course-md.ts` parses `COURSE.md` and is the only thing that knows its syntax.
`site-api.ts` reads the generated API and the content sources. Neither is a
test file, so neither is collected as a suite.

Two of these overlap `assignment-2.test.ts` on purpose. The contract test asks
whether there are twelve weeks and whether a deck is linked, because the brief
asks for those. The sensor asks whether the twelve weeks are different from
each other and whether the deck is worth opening, because the course needs
that. The first retires with the brief and the second does not.
