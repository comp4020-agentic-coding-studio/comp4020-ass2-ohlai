// The decision this protects: the course makes its one joke about its own
// two week break exactly once.
//
// A course about waiting that takes a fortnight off in the middle has to
// acknowledge it or look oblivious. Acknowledging it twice is worse than
// either, because the first mention is dry and the second is the course
// laughing at its own line. The outline page owns it. Nothing else may.
//
// This check exists because I broke the rule within an hour of being given
// it: the week 1 deck closed on the same observation, phrased differently,
// and nothing would have caught it. A rule that depends on remembering is
// not a rule.
import { describe, expect, it } from "vitest";
import { contentSources } from "./site-api";

// Three places may mention the break, and each earns it.
//   the outline page  makes the observation, once, and owns it
//   COURSE.md         is the calendar, so it has to say where the gap is
//   the Teardown      is due the day before it opens, and says so on purpose
// Everywhere else, a mention is the joke being made again. The week 1 deck
// is deliberately not on this list, which is what caught the first offence.
const MAY_MENTION = [
  "src/pages/sessions/index.astro",
  "COURSE.md",
  "src/content/assessments/teardown.md",
];

// The break is a fortnight with no teaching in the middle of the semester.
// Any page observing that, in any phrasing, is making the joke.
const OBSERVES_THE_BREAK = /\b(two|2)[\s-]week[s]?\b[^.!?\n]{0,60}\b(break|gap|pause|off)\b|\b(break|gap)\b[^.!?\n]{0,40}\bin the middle\b/i;

describe("the course's one joke about its own break", () => {
  it("is made on the outline page and nowhere else", () => {
    const offenders = contentSources()
      .filter((file) => !MAY_MENTION.includes(file.path))
      .flatMap((file) =>
        file.text
          .split(/\r?\n/)
          .map((line, index) => ({ line, where: `${file.path}:${index + 1}` }))
          .filter(({ line }) => OBSERVES_THE_BREAK.test(line)),
      );
    const detail = offenders.map((hit) => `  ${hit.where}  ${hit.line.trim()}`).join("\n");
    expect(
      offenders.length,
      `only the outline page, COURSE.md and the Teardown may mention the break:\n${detail}`,
    ).toBe(0);
  });
});
