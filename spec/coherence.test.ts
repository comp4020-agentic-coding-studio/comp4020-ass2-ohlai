// The decision this protects: a week that serves no part of the thesis is a
// bug, and a thesis clause no week serves is the same bug from the other end.
//
// The failure mode for a twelve week course is drift. Week 7 is interesting,
// it is about waiting, and it argues nothing the course argues. That is not
// visible from inside week 7, only from the whole, so it has to be a check.
// Both directions matter. Weeks that serve nothing are padding; clauses
// nothing serves mean the thesis promises more than the course delivers.
//
// The floor on the second direction is two weeks, not one. A clause that one
// week serves has a token week, not an argument.
import { describe, expect, it } from "vitest";
import { readCourseBible, TEACHING_WEEKS } from "./course-md";
import { nodesOfType, stringList } from "./site-api";

const bible = readCourseBible();
const clauseIds = bible.clauses.map((clause) => clause.id);
const sessions = nodesOfType("sessions");

// A clause needs more than a token week. See the test that uses it.
const MIN_WEEKS_PER_CLAUSE = 2;

describe("the thesis and its clauses", () => {
  it("states a thesis", () => {
    expect(bible.thesis.length, "COURSE.md's thesis blockquote is empty").toBeGreaterThan(0);
  });

  it("splits into clauses that rejoin into the thesis word for word", () => {
    // The joiners are the thesis's own punctuation, semicolons in this
    // case. Widening the set is not loosening the assertion: the clauses
    // still have to reconstruct the line with nothing added or dropped.
    // The clause ids are only trustworthy if they cannot drift from the line
    // they were split out of. Editing a clause without editing the thesis is
    // how a course quietly starts arguing something slightly different.
    expect(bible.clauses.length, "COURSE.md declares no thesis clauses").toBeGreaterThan(0);
    let cursor = 0;
    for (const [index, clause] of bible.clauses.entries()) {
      const at = bible.thesis.indexOf(clause.text, cursor);
      expect(at, `clause ${clause.id} does not appear in the thesis, in order`).toBeGreaterThanOrEqual(0);
      const gap = bible.thesis.slice(cursor, at);
      const expected = index === 0 ? /^$/ : /^[;,]\s+(and\s+)?$/;
      expect(gap, `text between clause ${index} and ${clause.id} is not a clause joiner`).toMatch(expected);
      cursor = at + clause.text.length;
    }
    // A clause carries no sentence-final punctuation, so the thesis may
    // end in a full stop the clauses do not. Nothing else may be left.
    expect(bible.thesis.slice(cursor), "the thesis has text after its last clause").toMatch(/^\.?$/);
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

  it(`gives every thesis clause at least ${MIN_WEEKS_PER_CLAUSE} weeks`, () => {
    // One week per clause is the loophole. A clause satisfied by a single
    // week is satisfied by a token: the week that exists so the check goes
    // green, which the rest of the course then never returns to. A clause
    // the course argues is a clause it comes back to, so the floor is two.
    for (const clause of bible.clauses) {
      const weeks = sessions
        .filter((session) => stringList(session.meta?.serves).includes(clause.id))
        .map((session) => Number(session.meta?.week))
        .sort((a, b) => a - b);
      expect(
        weeks.length,
        `${clause.id} ("${clause.text}") is served by ${weeks.length === 0 ? "no weeks" : `week ${weeks.join(", ")} alone`}`,
      ).toBeGreaterThanOrEqual(MIN_WEEKS_PER_CLAUSE);
    }
  });
});
