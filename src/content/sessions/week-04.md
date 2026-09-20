---
title: Ninety-Nine Percent
description: >-
  Week 4. Determinate progress, where the system tells you something and the
  something is false.
week: 4
date: 2027-03-08
serves:
  - T2
extra: estimated time remaining
readings:
  - cite: "Harrison, C., Amento, B., Kuznetsov, S. and Bell, R. (2007). Rethinking the progress bar. UIST 2007, 115-118."
    source: https://doi.org/10.1145/1294211.1294231
    retrieved: "2026-09-20"
  - cite: "Harrison, C., Yeo, Z. and Hudson, S. E. (2010). Faster progress bars: manipulating perceived duration with visual augmentations. CHI 2010, 1545-1548."
    source: https://doi.org/10.1145/1753326.1753556
    retrieved: "2026-09-20"
claims:
  - text: "the strongest augmentation cut perceived duration by 11%"
    source: https://doi.org/10.1145/1753326.1753556
    retrieved: "2026-09-20"
    measures: "reduction in perceived duration of a progress bar with backwards moving decelerating ribbing, against a plain solid bar of identical real duration in paired comparison tests, as reported by the authors"
spec:
  - you can explain why a progress bar estimate is usually wrong
  - you can name two animation properties that change perceived duration without changing real duration
  - you can say who benefits from a bar that pauses near the end
related:
  - lectures/week-04
---

Everyone has watched a bar sit at ninety-nine per cent. This week is about why
that happens and what it tells you about the whole component.

Harrison, Amento, Kuznetsov and Bell rethought the bar in 2007, and the follow
up in 2010 went further by manipulating perceived duration with the animation
alone. In the later study the strongest augmentation, backwards moving
decelerating ribbing, cut perceived duration by 11% with the real duration
held constant.

Sit with that. The same wait, the same process, a different number in the
head of the person waiting. Nothing was made faster. Something was made
shorter.

## In the workshop

You take a real progress bar and change one property of it, whether that is
the easing, the direction, the rate of the animation, or where it pauses.
Then you run it past someone who has not seen the original and ask them to
guess the duration. Keep the real duration fixed. Write down the guess.

## But wait, there's more

Windows has shown an estimated time remaining on file copies for decades, and
the estimate is known for collapsing from twenty minutes to four seconds in a
single step. The interesting part is that nobody has removed it. A number
known to be wrong is apparently still better than no number, and this is the
week where you have to decide whether you agree.
