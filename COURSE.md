# Wait: The Design of Delay

Course code `SLOP2034`. Slop University.

This file is the single source of truth for the course. Every page on the site
answers to something in here. Nothing on the site may contradict it, and
nothing may restate a fact it already owns.

The checks in `spec/` read this file. The section headings and the field names
below are the parse contract, so keep them exactly as they are.

## Thesis

> waiting is not a failure of a system, it is a designed component of it, and the design is almost always about managing the person rather than the delay

That line is verbatim and does not get rewritten, trimmed or paraphrased
anywhere on the site.

## Thesis clauses

The thesis splits at its commas. Each clause carries an id, and every week
declares which clause or clauses it serves. The clauses must rejoin into the
thesis above character for character, which `spec/coherence.test.ts` checks, so
editing a clause here without editing the thesis is a build failure.

- `T1` waiting is not a failure of a system
- `T2` it is a designed component of it
- `T3` the design is almost always about managing the person rather than the delay

## Teaching calendar

One line per teaching week, `week N: YYYY-MM-DD`, twelve of them, strictly
increasing. `spec/calendar.test.ts` holds this.

<!-- BLOCKED: no teaching dates supplied. See notes/questions.md, question 1. -->

## Weeks

Twelve weeks. Each is a `### Week N. Title` heading followed by two fields.
`does:` is one line saying what this week does that no other week does.
`key-term:` is the single term the week installs. Both are unique across the
twelve, which `spec/distinctness.test.ts` holds.

<!-- BLOCKED: no week list supplied. See notes/questions.md, question 2. -->

## Assessment

One `### Item name` heading per item, with `weight:`, `due:` and `tests:`.
Weights total exactly 100. Every due date falls inside a teaching week. Every
item names the thesis clause it tests. `spec/assessment.test.ts` holds this.

<!-- BLOCKED: no assessment items supplied. See notes/questions.md, question 3. -->

## Voice

The register rules. They apply to every word a student reads: pages, decks,
assessment briefs, link text, error copy.

- Write to the student in second person. "You wait" and not "the user waits" or
  "one waits".
- Plain declaratives. One idea per sentence. If a sentence needs rereading,
  split it.
- No hype. Do not sell the course inside the course.
- Name the mechanism, not the feeling. A page says what a delay does to a
  person and how, with a number where there is one.
- Say what a week does before saying what it covers.
- The forbidden constructions are listed in `spec/voice.test.ts`, which fails
  the build on any hit. Do not route around a hit with a synonym. The phrase is
  banned because the move behind it is banned, so rewrite the sentence.
- Any claim about the world carries its provenance. A figure with no source, no
  retrieval date and no statement of what it measures does not ship.
