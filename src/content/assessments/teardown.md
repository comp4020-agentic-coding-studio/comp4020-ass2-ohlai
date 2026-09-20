---
title: Teardown
description: >-
  Take one shipped wait apart and say what is measured, what is shown, what
  is claimed, and which of the three is load bearing.
week: 6
due: 2027-03-25T17:00:00+11:00
weight: 25
tests:
  - T2
marking:
  mode: weighted
  criteria:
    - name: Accuracy of the teardown
      weight: 60
    - name: The argument about what is load bearing
      weight: 40
spec:
  - one shipped wait, named specifically enough that a marker can go and look at it
  - what the system measures, what it shows, and what it claims, kept apart
  - an argument for which of the three is doing the work
related:
  - sessions/week-04
  - sessions/week-05
---

## The brief

> Take one shipped wait apart. What is measured, what is shown, what is
> claimed, and which of the three is load bearing.

Three separate questions, and they come apart more often than not. A system
measures a duration it does not show. It shows a bar claiming a completion
fraction it does not have. It claims to be searching when it has already
finished. Your job is to establish which of the three is holding the
experience up.

Pick something you can observe repeatedly. You will need to run the wait more
than once, because a single observation cannot tell you whether the indicator
tracks anything at all.

## What you submit

A teardown of any length that answers the four questions in order, with
evidence for each: timings you took, screenshots, network traces if you have
them. An assertion about what a system measures, with nothing behind it, is
the failure mode here.

This tests the second clause of the thesis, that the design is about managing
the person rather than the delay. If what is shown turns out to be load
bearing and what is measured does not, you have found that clause in the
wild.

## A note on the date

This is due on the Thursday of week 6, the day before the two week break
opens. That is deliberate. Handing you the break first and the deadline
afterwards would be a kinder schedule, and it would be the wrong lesson from
a course about who decides when other people wait.
