# Wait: The Design of Delay

Course code `SLOP2034`. Slop University.

This file is the single source of truth for the course. Every page on the site
answers to something in here. Nothing on the site may contradict it, and
nothing may restate a fact it already owns.

The checks in `spec/` read this file. The section headings and the field names
below are the parse contract, so keep them exactly as they are.

## Thesis

> Waiting is not a failure of a system, it is a designed component of it; the design is almost always about managing the person rather than the delay; and who is made to wait, for how long, and what they are told while waiting, is never neutral.

That line is verbatim and does not get rewritten, trimmed or paraphrased
anywhere on the site.

## Thesis clauses

The thesis splits at its semicolons. Each clause carries an id, and every week
declares which clause or clauses it serves. The clauses must rejoin into the
thesis above character for character, which `spec/coherence.test.ts` checks, so
editing a clause here without editing the thesis is a build failure. Every
clause is served by at least two weeks, never one.

- `T1` Waiting is not a failure of a system, it is a designed component of it
- `T2` the design is almost always about managing the person rather than the delay
- `T3` and who is made to wait, for how long, and what they are told while waiting, is never neutral

## Teaching calendar

One line per teaching week, `week N: YYYY-MM-DD`, twelve of them, strictly
increasing. `spec/calendar.test.ts` holds this.

- week 1: 2027-02-15
- week 2: 2027-02-22
- week 3: 2027-03-01
- week 4: 2027-03-08
- week 5: 2027-03-15
- week 6: 2027-03-22
- week 7: 2027-04-12
- week 8: 2027-04-19
- week 9: 2027-04-26
- week 10: 2027-05-03
- week 11: 2027-05-10
- week 12: 2027-05-17

The date is the Monday the week opens. The lecture is Tuesday and the workshop
is Thursday, every week, with no exceptions anywhere on the site.

A two week break follows week 6, covering 29 March and 5 April. Teaching
resumes with week 7 on 12 April.

The teaching days are clear of both public holidays in the period and this is
why the weeks fall where they do. Good Friday is 26 March 2027, the Friday of
week 6, after that week's Thursday workshop. Anzac Day falls on a Sunday and is
observed on Monday 26 April, which is the opening Monday of week 9 and not a
teaching day. Nothing on the site needs a holiday exception, and nothing on the
site should claim one.

## Weeks

Twelve weeks. Each is a `### Week N. Title` heading followed by two fields.
`does:` is one line saying what this week does that no other week does.
`key-term:` is the single term the week installs. Both are unique across the
twelve, which `spec/distinctness.test.ts` holds.

### Week 1. The Clock and the Feeling
- does: establishes that measured duration and felt duration are two different quantities, and that the gap between them is the course's object
- key-term: perceived duration

### Week 2. Three Thresholds
- does: converts the perception gap into the engineering thresholds that decide which affordance a delay is given
- key-term: response-time threshold

### Week 3. The Throbber
- does: reads the indeterminate spinner as a component that communicates only that something is happening, and asks what that silence is for
- key-term: indeterminate progress

### Week 4. Ninety-Nine Percent
- does: turns to determinate progress, where the system tells you something and the something is false
- key-term: progress dynamics

### Week 5. The Labour Illusion
- does: introduces showing work as a substitute for doing it faster
- key-term: operational transparency

### Week 6. Occupied Time
- does: catalogues the techniques that consume the waiter's attention rather than reduce the wait
- key-term: occupied time

### Week 7. Fairness Before Speed
- does: separates duration from justice, and shows people choosing the slower queue because it is the fair one
- key-term: queue discipline

### Week 8. Hold Music
- does: treats what you are given during a wait as authored material with a genre, a history and an economics
- key-term: the hold script

### Week 9. Who Waits
- does: asks how waiting is distributed, and treats the queue as an instrument rather than a side effect
- key-term: the politics of waiting

### Week 10. Benevolent Deception
- does: inverts the course's assumption by presenting delay deliberately added, not removed
- key-term: artificial latency

### Week 11. The Remembered Wait
- does: shows that the wait you report is not the wait you had, and that the last minute decides the whole thing
- key-term: duration neglect

### Week 12. Designing a Wait
- does: the studio week where the cohort defends interventions against the thesis rather than against a rubric
- key-term: the wait brief

## Assessment

One `### Item name` heading per item, with `weight:`, `due:` and `tests:`.
Weights total exactly 100. Every due date falls inside a teaching week. Every
item names the thesis clause it tests. `spec/assessment.test.ts` holds this.

### Wait Log
- weight: 15
- due: 2027-03-05
- tests: T1

One week of your own waits over ten seconds. For each, record clock duration, felt duration, and what you were told while it happened. Submit the data plus 500 words on where the three disagreed.

### Teardown
- weight: 25
- due: 2027-03-25
- tests: T2

Take one shipped wait apart. What is measured, what is shown, what is claimed, and which of the three is load-bearing.

### Intervention
- weight: 45
- due: 2027-05-07
- tests: T3

Redesign a wait you are not allowed to make shorter. Submit before and after, plus a justification naming the technique from weeks 5 to 8 you used and the person it acts on.

### Studio Presentation
- weight: 15
- due: 2027-05-20
- tests: T1, T2, T3

Present the intervention and defend the choice of who it manages. In class, week 12.

The Teardown falls on the Thursday of week 6, the day before the break opens.
That is deliberate and the assessment page says so in one line. A course about
waiting does not hand back a fortnight of slack by accident.

## Policy

The rules that are not assessment and not calendar. The policies page and the
people pages state these and add nothing to them.

### Late work
- penalty: 5% of the item's available marks per day late, counted in whole days from the due time
- floor: after 7 days the item scores zero
- scope: every item except the Studio Presentation, which happens in a room on a day and cannot be handed in late

### Extensions
- short: up to 5 days, granted by the convenor on the request, with no documentation
- long: beyond 5 days, needs documentation and goes through the university's process
- turnaround: a decision within 2 working days of the request

The turnaround is a published number because this course cannot argue that
delay is designed and then leave you refreshing your inbox for an answer it
already knows. The wait the course inflicts is in scope for the course.

### Consultation
- convenor: Wednesdays 14:00 to 15:30, during teaching weeks
- tutor: 30 minutes after each Thursday workshop, in the workshop room

Both are drop-in and neither is by appointment. A booking system is a queue
with an admission test, and week 7 is about what that does.

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
