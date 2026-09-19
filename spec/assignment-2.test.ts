// Assignment 2's published spec, turned into the checks a machine can hold.
//
// These assert the contract, not the construction: what the course must be
// true of, so they survive a change of layout, component or content voice.
// The spec lines they answer are quoted above each test. The lines they do
// not answer are the ones only a person can judge (whether the course is
// niche, whether the twelve weeks read as one idea, whether the prose has a
// voice), and those stay with the marker.
//
// They run against the built site, so `pnpm build` comes first. `pnpm check`
// does this in order.
import { existsSync } from "node:fs";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
  body?: string;
}

interface CourseApi {
  course: {
    code: string;
    level: number;
    startDate: string;
    endDate: string;
  };
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;
const nodesOfType = (type: string) => api.nodes.filter((node) => node.type === type);

// Allocated to this repo when it was provisioned. No other course in the
// cohort has these three digits, so they are not mine to change; only the
// leading level digit is.
const ALLOCATED_DIGITS = "034";
const TEACHING_WEEKS = 12;

describe("the course record", () => {
  // "under a SLOPxxxx code that keeps the three digits your repo arrived with"
  it("keeps the three digits this repo was allocated", () => {
    expect(api.course.code).toMatch(/^SLOP[123468]\d{3}$/);
    expect(api.course.code.slice(5)).toBe(ALLOCATED_DIGITS);
  });

  it("declares a level matching the code's first digit", () => {
    expect(api.course.level).toBe(Number(api.course.code.at(4)));
  });
});

describe("the teaching schedule", () => {
  // "running across twelve dated teaching weeks"
  //
  // The collection key stays `sessions` whatever the course calls its teaching
  // unit on screen, because the programs and courses page reads that name.
  const sessions = nodesOfType("sessions");

  it(`runs across ${TEACHING_WEEKS} teaching weeks`, () => {
    expect(sessions).toHaveLength(TEACHING_WEEKS);
  });

  it("numbers those weeks 1 to 12, once each", () => {
    const weeks = sessions.map((session) => session.meta?.week).sort((a, b) => Number(a) - Number(b));
    expect(weeks).toEqual(Array.from({ length: TEACHING_WEEKS }, (_, i) => i + 1));
  });

  it("dates every week", () => {
    for (const session of sessions) {
      expect(String(session.meta?.date ?? ""), `${session.id} has no date`).toMatch(
        /^\d{4}-\d{2}-\d{2}/,
      );
    }
  });
});

describe("the lectures", () => {
  // "at least one lecture carries a real deck, linked from its page"
  //
  // Linked and real are two claims. A `slides:` key that points at a deck the
  // build never produced is the failure this catches: the link renders, the
  // page 404s, and nothing else in the pipeline looks.
  const withSlides = nodesOfType("lectures").filter((lecture) => lecture.meta?.slides);

  it("has at least one lecture linking a deck", () => {
    expect(withSlides.length).toBeGreaterThan(0);
  });

  it("links only decks that actually built", () => {
    for (const lecture of withSlides) {
      const href = String(lecture.meta?.slides);
      const path = href.replace(/^\/+|\/+$/g, "");
      expect(existsSync(resolve("dist", path, "index.html")), `${lecture.id} links ${href}, which did not build`).toBe(true);
    }
  });
});

describe("the assessment", () => {
  // "assessment that adds up to 100%"
  const assessments = nodesOfType("assessments");

  it("has assessment to weigh", () => {
    expect(assessments.length).toBeGreaterThan(0);
  });

  it("adds up to 100%", () => {
    const total = assessments.reduce((sum, item) => sum + Number(item.meta?.weight ?? 0), 0);
    expect(total).toBe(100);
  });

  it("weighs each marking model to 100% where one is given", () => {
    for (const item of assessments) {
      const marking = item.meta?.marking as { criteria?: { weight: number }[] } | undefined;
      if (!marking?.criteria) continue;
      const total = marking.criteria.reduce((sum, criterion) => sum + Number(criterion.weight), 0);
      expect(total, `${item.id}'s criteria do not add up`).toBe(100);
    }
  });
});
