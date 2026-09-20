// The decision this protects: assessment measures the thesis or it measures
// nothing.
//
// A course can be coherent all the way through the teaching and then grade
// something else entirely. Students read the assessment first and work
// backwards from it, so an assessment that tests no clause of the thesis
// quietly replaces the thesis with whatever it does test. Three things hold:
// the weights are a whole, every deadline lands where there is teaching to
// support it, and every item names the clause it is measuring.
import { describe, expect, it } from "vitest";
import { readCourseBible } from "./course-md";
import { nodesOfType, stringList } from "./site-api";

const bible = readCourseBible();
const clauseIds = bible.clauses.map((clause) => clause.id);
const published = nodesOfType("assessments");

const DAY = 24 * 60 * 60 * 1000;
const dayOnly = (value: unknown): string => String(value).slice(0, 10);
const asTime = (date: string): number => Date.parse(`${date}T00:00:00Z`);

/** A teaching week is the seven days its calendar date opens. */
function teachingWeekOf(date: string): number | undefined {
  const at = asTime(date);
  for (const entry of bible.calendar) {
    const start = asTime(entry.date);
    if (at >= start && at < start + 7 * DAY) return entry.week;
  }
  return undefined;
}

describe("the assessment in COURSE.md", () => {
  it("has items to weigh", () => {
    expect(bible.assessment.length, "COURSE.md declares no assessment items").toBeGreaterThan(0);
  });

  it("weighs to exactly 100", () => {
    const total = bible.assessment.reduce((sum, item) => sum + item.weight, 0);
    const breakdown = bible.assessment.map((item) => `${item.name} ${item.weight}`).join(", ");
    expect(total, `weights are ${breakdown}`).toBe(100);
  });

  it("gives every item a weight", () => {
    for (const item of bible.assessment) {
      expect(Number.isFinite(item.weight), `"${item.name}" has no weight:`).toBe(true);
    }
  });

  it("names the thesis clause every item tests", () => {
    for (const item of bible.assessment) {
      expect(item.tests.length, `"${item.name}" declares no tests:, so it tests no part of the thesis`).toBeGreaterThan(0);
      for (const id of item.tests) {
        expect(clauseIds, `"${item.name}" tests ${id}, which is not a clause in COURSE.md`).toContain(id);
      }
    }
  });

  it("falls due inside a teaching week", () => {
    expect(bible.calendar.length, "COURSE.md has no teaching calendar to check due dates against").toBeGreaterThan(0);
    for (const item of bible.assessment) {
      expect(item.due, `"${item.name}" has no due:`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(
        teachingWeekOf(item.due),
        `"${item.name}" is due ${item.due}, which is not inside any of the twelve teaching weeks`,
      ).not.toBeUndefined();
    }
  });
});

describe("the assessment pages", () => {
  it("publishes one page per item in COURSE.md", () => {
    const declared = bible.assessment.map((item) => item.name).sort();
    const live = published.map((node) => String(node.title)).sort();
    expect(live, "the assessment pages and COURSE.md disagree").toEqual(declared);
  });

  it("carries the same weight on the page as in COURSE.md", () => {
    for (const node of published) {
      const item = bible.assessment.find((entry) => entry.name === node.title);
      if (!item) continue;
      expect(Number(node.meta?.weight), `${node.id} disagrees with COURSE.md on weight`).toBe(item.weight);
    }
  });

  it("carries the same due date on the page as in COURSE.md", () => {
    for (const node of published) {
      const item = bible.assessment.find((entry) => entry.name === node.title);
      if (!item) continue;
      expect(dayOnly(node.meta?.due), `${node.id} disagrees with COURSE.md on the due date`).toBe(item.due);
    }
  });

  it("names its thesis clause on the page too", () => {
    for (const node of published) {
      const tests = stringList(node.meta?.tests);
      expect(tests.length, `${node.id} declares no tests:`).toBeGreaterThan(0);
      for (const id of tests) {
        expect(clauseIds, `${node.id} tests ${id}, which is not a clause in COURSE.md`).toContain(id);
      }
    }
  });
});
