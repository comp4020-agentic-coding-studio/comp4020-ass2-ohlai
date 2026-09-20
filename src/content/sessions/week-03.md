---
title: The Throbber
description: >-
  Week 3. The indeterminate spinner communicates only that something is
  happening. This week asks what the silence around that is for.
week: 3
date: 2027-03-01
serves:
  - T1
  - T2
extra: beachball cursor
readings:
  - cite: "Myers, B. A. (1985). The importance of percent-done progress indicators for computer-human interfaces. CHI 85, 11-17."
    source: https://doi.org/10.1145/317456.317459
    retrieved: "2026-09-20"
  - cite: "Bouch, A., Kuchinsky, A. and Bhatti, N. (2000). Quality is in the eye of the beholder: meeting user requirements for Internet quality of service. CHI 2000, 297-304."
    source: https://www.semanticscholar.org/paper/3f51ed7b59a3071da02416c6d17bdde9d02aca9b
    retrieved: "2026-09-20"
spec:
  - you can say what an indeterminate indicator does and does not communicate
  - you can find a delay whose duration is known and shown as indeterminate anyway
  - you can argue for a spinner over a progress bar in a specific case
related:
  - lectures/week-03
---

The thresholds in week 2 told you which affordance a delay gets. This week
takes the one that says least and asks what it is doing.

Myers is the founding argument for telling people how far along they are, and
it is worth reading for how modest the evidence behind it is. Bouch,
Kuchinsky and Bhatti come at it from the other side, with people rating web
latency under controlled conditions, and find that what a person will tolerate
moves with context rather than sitting at a fixed number.

Between them is the question this week is about. If you know the duration and
you show a spinner, you have withheld something. Sometimes that is the right
call. You need to be able to say when.

## In the workshop

Bring three spinners you met this week. For each, work out whether the system
knew the duration. Where it did, write the sentence the designer would have
had to say out loud to justify hiding it. Some of those sentences are
reasonable and some are not, and reading them aloud is how you tell.

## But wait, there's more

The macOS spinning beachball cursor is the only indicator in common use that
you cannot dismiss, cannot cancel and cannot interpret. It appears when an
application stops answering the window server, so the component reporting the
problem is the one part of the system still working. Watch for it this week
and note what you do with your hands while it spins.
