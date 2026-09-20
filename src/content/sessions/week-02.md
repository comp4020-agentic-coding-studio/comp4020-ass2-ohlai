---
title: Three Thresholds
description: >-
  Week 2. The perception gap becomes engineering. Three numbers decide which
  affordance a delay is given.
week: 2
date: 2027-02-22
serves:
  - T1
extra: the key repeat delay slider
readings:
  - cite: "Miller, R. B. (1968). Response time in man-computer conversational transactions. AFIPS Fall Joint Computer Conference, vol. 33, 267-277."
    source: https://doi.org/10.1145/1476589.1476628
    retrieved: "2026-09-20"
  - cite: "Nielsen, J. (1993). Response times: the three important limits. In Usability Engineering. Morgan Kaufmann."
    source: https://www.nngroup.com/articles/response-times-3-important-limits/
    retrieved: "2026-09-20"
claims:
  - text: "Nielsen's three response time limits are 0.1 seconds, 1 second and 10 seconds"
    source: https://www.nngroup.com/articles/response-times-3-important-limits/
    retrieved: "2026-09-20"
    measures: "three design limits stated in Usability Engineering as durations of system response after a user action, argued from perceptual and attentional grounds rather than measured as population means"
spec:
  - you can state the three response time limits and what each one governs
  - you can find the threshold a given interface is designed against
  - you can say what a threshold assumes about the person waiting
related:
  - lectures/week-02
---

Last week you established that felt duration is its own quantity. This week it
gets turned into engineering. Three numbers decide which affordance a delay is
given, and once a delay is on the far side of one of them it is treated as a
different kind of event.

Nielsen's three limits are 0.1 seconds, 1 second and 10 seconds. Under the
first, the system reads as instantaneous. Under the second, your train of
thought survives the delay although you notice it. Past the third, you go and
do something else. Miller got there twenty-five years earlier with terminals
and a different vocabulary.

Read both and notice that neither is a measurement of a population. They are
design limits, argued for. They have been copied into guidance for sixty years
with the argument left behind.

## In the workshop

You audit one piece of software against the three limits. Find a delay, time
it, and say which band it falls in and which affordance it was given. Then
find one that was given the wrong affordance for its band, which will take
about four minutes.

## But wait, there's more

Open your operating system's keyboard settings and find the key repeat delay
slider. It is a control that lets you set a threshold for yourself. Almost every
other threshold in this course was set for you by somebody you will never
meet. Drag it to one end and try to type.
