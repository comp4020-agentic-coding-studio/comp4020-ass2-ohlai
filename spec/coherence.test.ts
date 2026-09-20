// The decision this protects: a week that serves no part of the thesis is a
// bug, and a thesis clause no week serves is the same bug from the other end.
//
// The failure mode for a twelve week course is drift. Week 7 is interesting,
// it is about waiting, and it argues nothing the course argues. That is not
// visible from inside week 7, only from the whole, so it has to be a check.
// Both directions matter. Weeks that serve nothing are padding; clauses
// nothing serves mean the thesis promises more than the course delivers.
import { describe, expect, it } from "vitest";
import { readCourseBible, TEACHING_WEEKS } from "./course-md";
import { nodesOfType, stringList } from "./site-api";

const bible = readCourseBible();
const clauseIds = bible.clauses.map((clause) => clause.id);
const sessions = nodesOfType("sessions");

describe("the thesis and its clauses", () => {
  it("states a thesis", () => {
    expect(bible.thesis.length, "COURSE.md's thesis blockquote is empty").toBeGreaterThan(0);
  });

  it("splits into clauses that rejoin into the thesis word for word", () => {
    // The clause ids are only trustworthy if they cannot drift from the line
    // they were split out of. Editing a clause without editing the thesis is
    // how a course quietly starts arguing something slightly different.
    expect(bible.clauses.length, "COURSE.md declares no thesis clauses").toBeGreaterThan(0);
    let cursor = 0;
    for (const [index, clause] of bible.clauses.entries()) {
      const at = bible.thesis.indexOf(clause.text, cursor);
      expect(at, `clause ${clause.id} does not appear in the thesis, in order`).toBeGreaterThanOrEqual(0);
      const gap = bible.thesis.slice(cursor, at);
      const expected = index === 0 ? /^$/ : /^,\s+(and\s+)?$/;
      expect(gap, `text between clause ${index} and ${clause.id} is not a comma joiner`).toMatch(expected);
      cursor = at + clause.text.length;
    }
    expect(bible.thesis.slice(cursor), "the thesis has text after its last clause").toBe("");
  });

  it("gives every clause a unique id", () => {
    expect(new Set(clauseIds).size).toBe(clauseIds.length);
  });
});

describe("what each week serves", () => {
  it(`has one session page for each of the ${TEACHING_WEEKS} weeks in COURSE.md`, () => {
    expect(bible.weeks, "COURSE.md declares no weeks").toHaveLength(TEACHING_WEEKS);
    const declared = bible.weeks.map((week) => week.week).sort((a, b) => a - b);
    const published = sessions.map((session) => Number(session.meta?.week)).sort((a, b) => a - b);
    expect(published, "the session pages and COURSE.md's weeks disagree").toEqual(declared);
  });

  it("declares a thesis clause on every week page", () => {
    expect(sessions.length, "there are no session pages").toBeGreaterThan(0);
    for (const session of sessions) {
      const serves = stringList(session.meta?.serves);
      expect(serves.length, `${session.id} declares no serves:, so it serves no part of the thesis`).toBeGreaterThan(0);
    }
  });

  it("serves only clauses the thesis actually has", () => {
    for (const session of sessions) {
      for (const id of stringList(session.meta?.serves)) {
        expect(clauseIds, `${session.id} serves ${id}, which is not a clause in COURSE.md`).toContain(id);
      }
    }
  });

  it("leaves no thesis clause unserved", () => {
    const served = new Set(sessions.flatMap((session) => stringList(session.meta?.serves)));
    for (const clause of bible.clauses) {
      expect(served.has(clause.id), `no week serves ${clause.id}: "${clause.text}"`).toBe(true);
    }
  });
});
