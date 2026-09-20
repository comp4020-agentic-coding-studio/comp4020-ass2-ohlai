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

## 3d1b54c test: twelve teaching weeks, in order, once each

The calendar check. The obvious alternative was three separate assertions:
twelve entries, no duplicate dates, dates ascending. I collapsed the last two
into one strictly increasing comparison, because equal dates are not
increasing and a week out of order goes backwards, so one assertion catches
both and names the two weeks involved rather than reporting that a set had the
wrong size. Checked with a fixture of twelve weekly dates, then by moving week
5 onto week 4's date and week 9 back to week 7's: the check failed naming
"week 5 (2027-03-15) does not come after week 4 (2027-03-15)".

## 9da35c1 test: twelve weeks that blur into each other are one week twelve times

The distinctness check. The obvious alternative was exact string comparison,
which is what uniqueness usually means and is one line. I normalise case and
punctuation first, because the duplicate this check exists to catch is not
"names the thing" twice, it is "names the thing" and "Names the thing." in
week 9, which exact comparison waves through. The reading rule allows exactly
one shared text between two weeks rather than zero, because a book the course
returns to in week 2 and again in week 11 is the spine of an argument, and
banning it would push the author into citing a different edition to get green.
Checked with two fixture weeks differing only in capitalisation and a full
stop: both the does: and key-term: checks failed and named the pair.

## 0624a77 test: a number without provenance is a rumour

The provenance check. Two decisions. The first was where to read from: the
generated API drops page bodies and never sees decks, so I wrote a narrow
frontmatter reader in `site-api.ts` rather than adding a YAML dependency or
scoping the check to what the API happens to expose. The narrowness is
deliberate, since a block scalar the reader does not understand comes back as
an empty field and fails the check instead of passing quietly. The second was
the five word floor on "what it measures". The obvious alternative was to
require the field to be non-empty, like the other two. I went further because
source and date are the two fields a fabricated statistic can fill
convincingly, and the population, the method and the unit are what was never
there, so a one word answer is the tell. Course facts get no exemption: a
weight renders from frontmatter and has no business in prose, and if it is in
prose it declares where it came from like anything else. Checked by adding
"a 400 ms response reads as instant, and 38% of people leave before it" to a
lecture body: both figures were flagged, declaring them cleared them, a
"lab task" measures field was rejected as too thin, and a 2027 retrieval date
was rejected as in the future.

## 938b87c test: a linked deck that is a stub is a broken promise

The deck check. The obvious alternative was to stop where the build stops,
confirming the linked deck compiles and its route exists, which is what
`assignment-2.test.ts` already does and what the brief literally asks for. I
added floors of 8 slides and 200 words because a four slide deck of template
text satisfies every existing check and is worse than shipping no deck: the
link on the lecture page promised a lecture. The floors are the smallest thing
that can honestly be called a lecture's slides, and they are a floor and not a
target, which the header comment says so nobody writes to them. Checked
against the template's own deck, which the check called correctly: 4 slides,
182 words, STARTER_CONTENT marker still in the file.

## 844418d docs: draw the sensor line around the seven course design checks

Extended `spec/README.md` rather than leaving it describing a spec directory
that had grown six files since it was written. The obvious alternative was to
leave it alone, since it is the template's file and its existing text is still
accurate. I added to it because it is the file that claims to draw the line
between a contract test and a sensor, and a file making that claim while not
classifying seven of the nine tests in the directory is worse than one that
never made the claim. Checked by reading it against the actual directory
listing, and by confirming the two overlaps with `assignment-2.test.ts` are
described as the deliberate pairs they are rather than as duplication.

## 3670081 docs: the thesis gains a third clause, about who is made to wait

Replaced the thesis with the three clause version and moved the split from
commas to semicolons. The work was in the rejoin assertion, which failed
immediately because its joiner pattern only knew about commas. The obvious
alternative was to drop the assertion, since it was written for a thesis that
no longer exists and it is the only thing standing between me and a green
check. I widened the joiner set to `[;,]` and allowed a sentence-final full
stop instead, because the assertion is not about which punctuation the thesis
uses, it is about the clauses reconstructing the line exactly. Widening what
counts as a joiner leaves that intact. Checked by rewording T2 from "almost
always" to "mostly" and confirming the check still failed naming T2, then
restoring.

## 62bd36b test: one week serving a clause is a token week, not an argument

Raised the coherence floor to two weeks per thesis clause. Nothing subtle in
the change itself; the decision was in the failure message. The obvious version
reports a count, "expected 1 to be greater than or equal to 2", which tells you
the rule and not the problem. I made it name the week, so a clause scraping by
on week 9 alone reads as "T3 is served by week 9 alone" and points at the page
that needs to change. Checked against the current empty course, where all three
clauses correctly report "served by no weeks" rather than the wrong message for
the zero case.

## 518de3c feat: the course record

Wrote the course record and hit two schema limits: a 300 character
description against a 356 character paragraph, and three tags against four.
The obvious move on both was to raise the limits, which is two characters of
edit in a file I had open. I did not, because `slopCourseMetaSchema` is the
contract a catalogue ingests rather than a preference of this course, and a
course that widens the field to fit its own paragraph has stopped being
catalogued and started being special. So the record carries the first two
sentences and three tags, the third sentence goes on the outline page where
there is no cap, and both are logged as question 6 rather than absorbed
silently. Checked by importing the module and printing the parsed object:
the schema accepted it, the description measured 257 characters, and the code
and level agreed at 2.

## 84a2708 docs: the teaching calendar

Twelve Mondays with a two week break after week 6. The decision was to write
down why the weeks fall where they do, not just where they fall. The obvious
version is twelve dates, which is all the calendar check reads. I added the
two holiday sentences because Good Friday lands on 26 March 2027 and Anzac Day
is observed on Monday 26 April, and both of those are inside the teaching
period and both miss the Tuesday and Thursday teaching days. Without the note,
the first person to notice a public holiday inside the semester writes an
exception onto a week page, and then the site has an exception that is not
true. Checked the two dates against the calendar for 2027, confirmed the
strictly increasing check passes on the twelve, and confirmed the break shows
as a fourteen day gap between week 6 and week 7 rather than as a missing week.

## a62956a docs: the twelve weeks

Wrote the twelve weeks into COURSE.md exactly as supplied, with no rewording
of the does: lines. The obvious alternative was to tidy them into a parallel
grammar, since half start with a verb like "establishes" and half describe a
move like "the studio week where". I left them alone because a does: line is a
claim about what a week is for, and making twelve of them scan the same way is
the first step toward making them say the same thing, which is the failure
distinctness exists to catch. Checked by running distinctness: all twelve
titles, does: lines and key-terms are unique under case and punctuation
normalisation, so none of them are near-duplicates of each other.

## 56126a3 docs: the assessment

Four items to 100, each naming a thesis clause. The decision worth recording
is the Teardown's date. It falls on the Thursday of week 6, the day before a
two week break opens, and the obvious move is to push it to the Monday after
the break, which is kinder and is what most courses do. It stays where it is
because a course arguing that waiting is designed cannot hand back a fortnight
of slack by accident, and the assessment page says it is deliberate rather
than leaving a student to assume an oversight. Checked by running the
assessment test: weights total exactly 100, and all four due dates resolve to
teaching weeks 3, 6, 10 and 12 under the seven day window rule.

## e077da5 test: a recurring block that repeats itself is a broken promise

The "But wait, there's more" check, written before any block exists. The hard
part was "no two weeks name the same artefact", which is not readable from
prose. The obvious alternative was to compare the block bodies for similarity
and flag near-duplicates, which is fuzzy, tuned by a threshold, and fails in
both directions. I made the page declare its artefact in `extra:` instead, and
then got three checks out of one field: the name must appear inside the block,
must not appear in the page body above it, and must not appear on another
week. That turns a similarity problem into three exact string comparisons, and
the second of them catches the block quietly becoming a summary of the week,
which is the decay I was least likely to notice by reading. Checked by writing
a correct block on a template session, confirming it passed, then breaking it
two ways: "there's more!" was caught as a heading that is not verbatim, and a
four sentence body pushed past the cap was caught by the sentence count.

## 8c38587 test: a citation is a claim about the world, so it carries provenance

Readings became objects carrying `cite`, `source` and `retrieved`, and the
check requires the source to be a URL or a DOI. The obvious alternative was to
require a non-empty source string, which is what the figure provenance check
does for its `source` field. I made it stricter here because the failure mode
is different: a figure's source is usually a paper you either have or do not,
whereas a reading's source is overwhelmingly likely to be "I know this paper",
and a free text field accepts that. A URL or a DOI cannot be produced from
memory. `measures` is not required, because the claim a citation makes is that
the work exists as described, which the record either shows or does not.
Checked by running the check against the template's readingless sessions,
where it correctly reported the absence rather than passing on an empty list.

## 8a81267 fix: an artefact name that straddles a line break still matches

A bug in my own check, found the first time real content met it. The check
compared `extra:` against the block text with newlines intact, so "the key
repeat delay slider" failed whenever markdown wrapped the line after "delay".
The obvious fix at that moment was to rewrite the sentence so the name fell on
one line, which takes ten seconds and leaves the trap for the next person. I
fixed the check instead, flattening whitespace on both sides before comparing,
because a check that makes line wrapping load bearing will be worked around
rather than obeyed. Checked by confirming the week 2 block passed afterwards
with the wrap still in it, and that the three other assertions on the same
field still failed correctly when I pointed `extra:` at a phrase the block
does not contain.

## c26baa3 feat: weeks 1 and 2, the perception gap and the thresholds it became

The first content, and the decision was how to divide a week between its
lecture page and its session page. The obvious split is that the lecture
summarises and the session elaborates, which is what the template's
placeholder text suggests and which produces two pages saying the same thing
at two lengths. I gave them different jobs instead: the lecture page states
the argument the lecture makes, and the session page carries the work, the
readings and the outcomes. Neither restates the other, and a reader who opens
only one of them still gets something whole. Checked by reading the four pages
end to end looking for a sentence that appears in substance on both, and by
running distinctness, which compares the twelve weeks against each other
rather than the pages within a week.

## a40f9db feat: weeks 3 to 6, the techniques that act on the gap

Four weeks, and one finding that changed a page. The canonical example for
occupied time is the airport that moved its baggage claim further from the
gates, and verification turned up nothing: the story traces to a 2012
retelling and neither the airport nor the airlines have confirmed it. The
obvious alternative was to substitute a case that does verify, which would
have left week 6 looking exactly as intended and quietly disposed of the
problem. I put the finding on the page instead. A course arguing that
waiting is designed should be able to say that its own field's favourite
evidence is a parable, and week 6 now teaches that rather than repeating it.
Checked by two searches that both came back with no primary source, and by
confirming the reading list check passes with Norman alone rather than being
padded back to two.

## 5c64f27 fix: week 5 declared an artefact its block does not name

## f0cb663 fix: week 6 declared an artefact its block does not name

Three of these in a row, so the entry is about the pattern rather than the
three edits. I was writing `extra:` as a label for the artefact and then
writing the block in whatever phrasing read best, which meant the two agreed
in meaning and not in characters. The obvious response after the second one
was to relax the check to a fuzzy match. I did not, because the exactness is
what makes the other two assertions on that field work, and a fuzzy match
would have made "already used in the body" unreliable in both directions.
The fix was to my process: the artefact name is now chosen after the block
is written, as a literal substring of it. Checked by the check, which caught
every one of the three before it shipped.

## bf7977a feat: weeks 7 to 9, where waiting stops being one person's problem

The T3 arc, and the first place the third thesis clause is argued rather than
asserted. The decision was in week 8, which had to handle the infomercial
"but wait, there's more" as a withholding technique on the same site where
that phrase is the title of a recurring block. The obvious move was to let
the two wink at each other, which is one sentence and is very hard to resist.
I kept them apart: the workshop paragraph describes the interruption as a
mechanism with a structure and does not acknowledge the joke at all. The
running gag survives only because the course never explains it. Checked by
reading the week 8 page for any sentence that gestures at the block, and by
confirming the but-wait check still treats week 8's block as an artefact
unrelated to its body.
