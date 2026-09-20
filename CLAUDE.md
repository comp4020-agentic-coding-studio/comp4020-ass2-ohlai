# CLAUDE.md

Project rules for this repository. Read this before writing or changing any
code.

The
[course website](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/)
publishes this deliverable's brief and spec (Assignment 2, a whole course
website for a course of your own design). The deployed site is what gets
marked, not this repo, and `PROCESS.md` is read against the commit history
behind it.

## What this is

SLOP2034 "Wait: The Design of Delay" is a twelve week course on the design of
waiting. Its thesis, and the whole of what it argues, is one line:

> Waiting is not a failure of a system, it is a designed component of it; the design is almost always about managing the person rather than the delay; and who is made to wait, for how long, and what they are told while waiting, is never neutral.

Every week takes one part of that line and does something to it that no other
week does. `COURSE.md` is where the thesis, the twelve weeks, the assessment,
the dates and the voice rules live, and it is the single source of truth for
all of them.

The platform is Slop University and the course is mine. A marker reads this
site the way a prospective student would, for about ten minutes: the home page,
a few non-adjacent weeks, an assessment, the deck, the policies page, at both
viewports. Twelve weeks that repeat one another is the failure mode to design
against.

## Working from COURSE.md

These are the rules the course content is written under. They outrank
convenience, they outrank finishing, and they are not satisfied by something
that looks close.

- **Read `COURSE.md` before writing any content.** Not a skim. The thesis, the
  clause ids, the twelve `does:` lines and the voice rules are the brief for
  every sentence on the site.
- **Every page states which thesis clause or which week's `does:` line it
  serves.** Session pages declare `serves:` in frontmatter. Assessment pages
  declare `tests:`. A page that serves nothing is not a page that needs
  improving, it is a page that gets deleted.
- **Never invent a week, an assessment, a date, a reading or a statistic.** If
  a page needs something `COURSE.md` does not have, stop. Append the question
  to `notes/questions.md`, say in the answer that you stopped and what you
  stopped on, and leave the hole. A plausible placeholder is worse than an
  empty section, because an empty section gets fixed and a plausible one ships.
- **Any claim about the world carries provenance.** Three fields, all
  populated: where it came from, the date it was retrieved, and what it
  actually measures. Declare them in the entry's `claims:` frontmatter. No
  claim ships without all three, and "what it measures" is the one that gets
  skipped, so write it first. A figure whose population, method or unit you
  cannot state is a figure you do not have.
- **Voice: second person to the student, plain declaratives, no hype.** The
  forbidden constructions are enforced by `spec/voice.test.ts`. Do not work
  around a hit by reaching for a synonym. The phrase is banned because the move
  behind it is banned, so rewrite the sentence to not need it. The `unslop`
  skill applies on top of this to every word a student reads.
- **One commit per unit of work.** Never squash, never amend. Conventional
  commit messages: `docs:`, `test:`, `feat:`, `fix:`, `chore:`.
- **After every commit, append to `notes/decisions.md`:** the hash, what you
  did, what the obvious alternative was, why you went the other way, and how
  you checked the result was right. One short paragraph. The entry for a commit
  lands in the commit after it, because it needs that hash. The last commit of
  any run is the one that carries its predecessor's entry.
- **Never weaken a check to make it pass.** A red check is information about
  the course, not an obstacle in front of it. If a check is wrong, say so and
  change it on purpose, in its own commit, with the reasoning in
  `notes/decisions.md`.

### What the checks in `spec/` hold

Each file protects one course design decision and its header comment names it.

| Check | The decision it protects |
| :-- | :-- |
| `coherence` | A week that serves no part of the thesis is a bug, and so is a clause no week serves. |
| `distinctness` | Twelve weeks that blur into each other are twelve weeks of one week. |
| `voice` | The register is a course design decision, not a preference. |
| `assessment` | Assessment measures the thesis or it measures nothing. |
| `calendar` | Twelve weeks, in order, once each. |
| `provenance` | A number without provenance is a rumour. |
| `deck` | A linked deck that is a stub is a broken promise to a marker. |

`spec/course-md.ts` is the parser they share. It is the only thing that reads
`COURSE.md`'s syntax, so the format is changed in one place.

`CLAUDE.md`, `spec/` and `notes/` are harness and not student-facing copy, so
the voice check does not scan them. That is why the forbidden list can be
written down in `spec/voice.test.ts` at all.

## Hard constraints

These are not negotiable. If a change would break one, stop and say so instead
of working around it.

- **The platform is fixed and the course is mine.** The Slop identity
  (`astro-theme-slop`, the palette, the `src/site-config.ts` branding), the
  four content collections and their keys, the build pipeline in
  `astro.config.ts` and the generated API stay as they arrived. Adding is
  always allowed: a new collection, a page outside the collections, a component
  the theme lacks. Changing the fixed parts is not.
- **The course code keeps `034`.** It was allocated to this repo and no other
  course in the cohort has it. Only the first digit is mine, and `level` in
  `src/course-config.ts` must equal it or the schema refuses to parse.
- **Twelve dated teaching weeks**, with every dated item inside `startDate` and
  `endDate`. `spec/data-integrity.test.ts` is the check that holds this.
- **Assessment weights add up to 100%.**
- **At least one lecture carries a real deck**, linked from its page.
- **Every `STARTER_CONTENT` fragment is replaced and its marker removed**, and
  the four starter images go too (`card.png`, `hero-home.avif`, and both people
  portraits). `pnpm check:evidence` lists them by file and line.
- **`PROCESS.md` runs to 400 to 600 words** with commit citations that resolve.
  An uncited claim is not evidence, and the check fails a file with no
  citations in it. There is no separate reflection for this assignment.
- Static throughout, deployed to GitHub Pages, working at both marking
  viewports.
- `pnpm check` passes before any commit. `pnpm check:evidence` passes before
  shipping.
- The repo stays private until the cutoff.

## How to work in here

- Keep the dev server running (`pnpm dev`) so you see changes as you make them.
  The address is `http://localhost:4321/comp4020-ass2-ohlai/`. The bare
  `http://localhost:4321` that Astro prints is a 404, because the site is
  served under its base path.
- Run `pnpm check` before you push.
- Open the page in a browser and look at it, at both viewports. The rendered
  page is the truth; your mental model of it isn't.
- **Read the site as a stranger would.** A test can confirm twelve sessions
  exist and that their dates sit inside the teaching period. Only reading tells
  you whether those twelve weeks are one course or twelve unrelated topics
  under a shared banner. That judgement is the largest part of the mark and
  nothing in `check` touches it.
- **Content the agent writes is a draft, not a delivery.** An agent will
  produce content-shaped chunks all day. Making them hang together, and sound
  like one person with a position, is my job. Reject prose that could belong to
  any course.
- When a check fails, read its output before you change anything.
- **Never commit a regression.** Anything that was green stays green. The one
  exception is `spec/assignment-2.test.ts`, which is this brief turned into
  contracts and is red on purpose until the course is built. Red to green
  across those is the work, and the commits that turn each one green are the
  process evidence `PROCESS.md` cites. Never make one pass by weakening it.

## The checks

`pnpm check` runs type checking, the production build and the `spec/` tests.
`pnpm check:evidence` is the extra gate before shipping: starter fragments,
starter imagery, the `PROCESS.md` boilerplate comment, and whether the cited
commits resolve. CI runs the same plus the secret scan and the deploy, and both
CI jobs are gated on the repo being public, so local `pnpm check` is the only
feedback loop until the cutoff.

`pnpm build` is itself several checks: axe over every rendered page, internal
links against the base path, dangling content refs, deck compilation, and the
generated API.

`spec/README.md` draws the line between a **contract test**, which retires with
the brief it answers, and a **sensor**, which is harness and comes with me into
the next repo.

When something breaks, fix the check or add a new one. Do not retry until it
passes by chance.

### Facts about this stack that are easy to get wrong

- **`defaultLayout` does not reach `.mdx` pages.** The theme applies it through
  a custom `markdown.processor`, and `@astrojs/mdx` does not use that
  processor. A `.md` page picks the layout up and a `.mdx` page silently does
  not: it builds as a bare fragment with no `<html lang>`, no `<head>` and no
  `<title>`, which the axe pass then reports as document-title, html-has-lang
  and region. Nothing in the output says the page has no layout. Name the
  layout in the frontmatter of every `.mdx` page under `src/pages/`:
  `layout: ../../layouts/PageLayout.astro`. Fixed in `eda03a9`, and the same
  trap waits on every new `.mdx` page.
- **The collection key is the whole address.** `sessions/week-01` is the file
  `src/content/sessions/week-01.md`, the page `/sessions/week-01/`, the JSON at
  `/api/sessions/week-01.json`, and the ref other pages link by. Renaming one
  means renaming all four.
- **A `related:` ref that does not resolve fails the build.** That is the
  point: a dangling link is caught before it ships. The edge renders on both
  pages, so declare it on whichever side is convenient, once.
- **A hand-written root-absolute link in an `.astro` file skips the base path.**
  `href="/sessions/"` works on localhost and 404s on the live site. Markdown
  links and the theme's components are rewritten for you; hand-written ones are
  not. The build's link checker catches most of it.
- **`node_modules/.astro` holds the font cache.** Deleting it makes the next
  build fetch font metrics over the network, so a clean-cache build fails with
  `fetch failed` when the network is unavailable. Do not clear it to get a
  clean build.
- **A deck is not a collection entry**, so it has no `related:` edges. Link it
  from its lecture page with a markdown link (`[Slides](/decks/week-01/)`) and
  the build rewrites it for the base path.
- `published: false` removes an entry from the production build entirely but
  leaves it visible in `pnpm dev`. `draft: true` keeps the page and marks it as
  not final. The two are orthogonal.
- The content schemas pass through keys they do not declare: an invented
  frontmatter key survives validation and lands in that node's `meta` in the
  generated API. The reserved names are `title`, `description`, `tags`,
  `related`, `links`, `spec` and `published`.
- `src/course-config.ts` is the single source for the course record. The home
  page, navigation and `/api/index.json` all read it, so do not restate those
  facts in page content.
- The axe pass runs against the **built** site, so `pnpm build` must run before
  it. `pnpm check` does this in order.

## Working style

- One change per commit, with a message saying what changed and why.
- When a failure has a root cause, fix the cause and add a check for it. Do not
  patch the symptom and move on.
- When an approach is abandoned, say so in the commit message rather than
  quietly deleting it.
- If a requested change conflicts with anything in this file, stop and raise it
  before making the change.

## This file is yours

A starting point, not a rulebook: what I add to it is the harness, and the
harness is assessed. As I learn what this site needs, a convention the work has
to hold to, a sensor that keeps catching me out, a fact about the stack that is
easy to get wrong, it gets written down here and wired into `check`. Growing
this file is the work.

This file and the sensors wired into `check` carry across the course. Both come
with me into the next repo. The site does not: content, and the tests answering
this brief, stay behind. `spec/README.md` draws the line.
