// The decision this protects: a thesis a reader cannot find is not a thesis.
//
// The whole site is built on one line and three clause ids. Twelve session
// pages declare `serves:`, four assessment pages declare `tests:`, and
// `coherence.test.ts` holds both ends of that against COURSE.md. All of it
// was true and none of it was visible: the line appeared nowhere a student
// could read it, and T1, T2 and T3 were internal ids with nothing on the
// site saying what they stood for.
//
// Worse, two pages pointed at a front page that did not have it. The week 1
// deck tells a reader the rest of the line arrives later and to read it on
// the front page. Week 12 says interventions are defended against "the three
// clauses on the front page". A promise made on one page and kept on none is
// exactly the broken-promise shape `deck.test.ts` and `but-wait.test.ts`
// already watch for, and a green suite of sixty-nine tests did not notice.
//
// So this reads the built home page rather than the source: what a reader
// gets is the only thing that settles it.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { readCourseBible } from "./course-md";
import { nodesOfType, stringList } from "./site-api";

const bible = readCourseBible();
const home = readFileSync(resolve("dist/index.html"), "utf8");

/** Collapse markup and whitespace so a wrapped line still matches. */
const flatten = (html: string): string =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ");

const homeText = flatten(home);

describe("the thesis a reader can actually reach", () => {
  it("prints the thesis on the home page, word for word", () => {
    // Not paraphrased and not trimmed. COURSE.md says the line is verbatim
    // everywhere it appears, and the home page is where it appears.
    expect(
      homeText.includes(bible.thesis),
      `the home page does not carry the thesis verbatim:\n  ${bible.thesis}`,
    ).toBe(true);
  });

  it("says on the home page what every clause id stands for", () => {
    const missing = bible.clauses.filter(
      (clause) => !homeText.includes(clause.id) || !homeText.includes(clause.text),
    );
    expect(
      missing.map((clause) => `${clause.id}: ${clause.text}`),
      "clause ids a reader meets in frontmatter but never sees explained",
    ).toEqual([]);
  });

  it("leaves no clause id in use that the home page never introduces", () => {
    // The ids on the page and the ids the content declares are the same set.
    // A week serving a T4 nobody has defined is caught by coherence.test.ts;
    // this catches the reverse, a published id the front page skipped.
    const declared = new Set(
      [...nodesOfType("sessions"), ...nodesOfType("assessments")].flatMap((node) => [
        ...stringList(node.meta?.serves),
        ...stringList(node.meta?.tests),
      ]),
    );
    const introduced = new Set(bible.clauses.map((clause) => clause.id));
    const orphans = [...declared].filter((id) => !introduced.has(id));
    expect(orphans, "clause ids used by content but not on the home page").toEqual([]);
  });
});
