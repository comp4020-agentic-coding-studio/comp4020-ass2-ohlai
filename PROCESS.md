# Process overview

## What I built

Wait: The Design of Delay (`SLOP2034`), a twelve-week Slop University course
arguing that waiting is designed rather than broken, that the design manages the
person rather than the delay, and that who is made to wait is never neutral. The
site is the artefact.

## How I got here

I decided four things about what a good course is, and made each one mechanical.

**A good course is one argument, not twelve topics under a banner.** `COURSE.md`
is the source of truth. The thesis splits into three clauses, every week declares
which it serves, and `spec/coherence.test.ts` fails both directions: weeks
serving no clause are padding, a clause no week serves means the thesis
overpromises. `distinctness.test.ts` holds the other half: a week must do
something, install a term and use a reading list no other week does.

**A good course does not state a number it cannot source.** Then that rule caught
me. I wrote the late penalty into the policies page as prose and
`provenance.test.ts` went red inside a minute. The tempting fix was exempting the
page. Its own header comment says a figure like that should render from data, so the
numbers moved into a `## Policy` section of
`COURSE.md` and `PolicyTable.astro` renders them. The page now carries no figures
at all. I added one exemption, scoped to that section, because a rule the course
sets about itself has no source to cite ([`e1c683e`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-ohlai/commit/e1c683e)).

**A good course sounds like one person with a position.** The register went into
`CLAUDE.md` with the `unslop` list layered on the brief's, keeping only what has
no honest use in course copy ([`ca6dc38`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-ohlai/commit/ca6dc38)). A fussy rule for a
university called Slop, except the check had a hole in it. `contentSources`
matched `.md` and `.mdx`, and the home page is `.astro`, so the rules had never
reached the first page anybody sees. I widened the scan instead of fixing the em
dash in front of me, which turned up a second hit in a template I would not have
opened ([`08e1db1`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-ohlai/commit/08e1db1)).

**A good course is subject to its own argument.** The site opened on a hold
screen: a throbber over a bar stopping at 99%, once per session. It was the only
compulsory wait on the site. A course arguing that who is made to wait is never
neutral does not get to charge readers a toll to make a point about tolls.
It worked, and I deleted it ([`283d384`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-ohlai/commit/283d384)). The better answer, a
colophon naming every technique the site uses on the reader, was cut for time
rather than because it is wrong.

One rule I changed on purpose. `CLAUDE.md` listed the palette as fixed, and
asking for the course's own visual treatment put that rule in conflict with the
request. It surfaced instead of being quietly broken, and I rewrote it with the
argument inside ([`3b8aff5`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-ohlai/commit/3b8aff5)). The rest of the platform stays a
deliberate omission: layout wiring, collections and the build pipeline are not
mine to change.

Sixty-nine green tests never noticed the thesis appeared nowhere a reader could
find it, while two pages pointed at a front page without it. The new sensor reads
the built HTML, and I checked it by deleting the component and watching it go red
([`d284735`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-ohlai/commit/d284735)).

I could not see the page this session, because the preview kept painting blank
frames. The stylesheet had reached one page out of thirty-eight while the
home page looked right throughout ([`bffdc4d`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-ohlai/commit/bffdc4d)), and centring the
header took three wrong answers ([`6669dd8`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-ohlai/commit/6669dd8)). Both came out of
reading computed values, not a screenshot.
