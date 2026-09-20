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
