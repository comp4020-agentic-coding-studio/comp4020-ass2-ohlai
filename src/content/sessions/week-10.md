---
title: Benevolent Deception
description: >-
  Week 10. Delay added rather than removed, and the question of who an added
  second is for.
week: 10
date: 2027-05-03
serves:
  - T1
  - T2
extra: progress bar on a local file
readings:
  - cite: "Adar, E., Tan, D. S. and Teevan, J. (2013). Benevolent deception in human computer interaction. CHI 2013, 1863-1872."
    source: https://doi.org/10.1145/2470654.2466246
    retrieved: "2026-09-20"
  - cite: "Brignull, H. (2023). Deceptive Patterns: Exposing the Tricks Tech Companies Use to Control You. Testimonium."
    source: https://deceptive.design/read-the-books/
    retrieved: "2026-09-20"
spec:
  - you can name three reasons a system would add latency deliberately
  - you can argue both sides of a specific added delay
  - you can say what test you would apply to decide whether an added delay is defensible
related:
  - lectures/week-10
---

The course has been arguing that waiting is designed. This is the week where
that stops being a figure of speech.

Adar, Tan and Teevan argue that deception is already everywhere in interface
design and that the useful question is who benefits, not whether it is
happening. Brignull spent a decade naming the version where the answer is
the company, and the vocabulary he built is now in regulatory findings.

Read them together and notice that the techniques overlap almost completely.
The difference is not in the mechanism. It is in who the mechanism is
pointed at, which is a sentence you should recognise by now.

## In the workshop

Each of you brings one added delay and argues it both ways in two minutes.
The room votes, and then you say which side you actually believe. The gap
between the argument you could make and the one you hold is the thing worth
noticing.

## But wait, there's more

Some installers show a progress bar on a local file operation that completes
instantly, because a task that finishes before you see it starts reads as a
task that was not done. The bar is not reporting the work. It is issuing a
receipt for it.
