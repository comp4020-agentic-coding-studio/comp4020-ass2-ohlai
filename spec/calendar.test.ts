// The decision this protects: twelve teaching weeks, in order, once each.
//
// The calendar is the one part of a course that cannot be argued about, and
// it is the part that rots first. A duplicated date, a week that goes
// backwards, eleven weeks where the brief promised twelve: each is invisible
// on the page it lives on and obvious to the student planning a semester
// around it. The build already holds that dated items sit inside the teaching
// period. This holds the shape of the period itself.
import { describe, expect, it } from "vitest";
import { readCourseBible, TEACHING_WEEKS } from "./course-md";
import { api, nodesOfType } from "./site-api";

const bible = readCourseBible();
const dayOnly = (value: unknown): string => String(value).slice(0, 10);

describe("the teaching calendar in COURSE.md", () => {
  it(`has exactly ${TEACHING_WEEKS} dated weeks`, () => {
    expect(bible.calendar).toHaveLength(TEACHING_WEEKS);
  });

  it(`numbers them 1 to ${TEACHING_WEEKS}, once each`, () => {
    const numbers = bible.calendar.map((entry) => entry.week);
    expect([...numbers].sort((a, b) => a - b)).toEqual(
      Array.from({ length: TEACHING_WEEKS }, (_, index) => index + 1),
    );
  });

  it("dates every week as YYYY-MM-DD", () => {
    for (const entry of bible.calendar) {
      expect(entry.date, `week ${entry.week}`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("runs strictly forwards, with no two weeks on the same date", () => {
    // Strictly increasing catches both faults at once: equal dates are not
    // increasing, and a week out of order goes backwards.
    for (let index = 1; index < bible.calendar.length; index += 1) {
      const previous = bible.calendar[index - 1]!;
      const current = bible.calendar[index]!;
      expect(
        current.date > previous.date,
        `week ${current.week} (${current.date}) does not come after week ${previous.week} (${previous.date})`,
      ).toBe(true);
    }
  });
});

describe("the calendar the site publishes", () => {
  it("dates each session page the same day COURSE.md does", () => {
    for (const session of nodesOfType("sessions")) {
      const week = Number(session.meta?.week);
      const entry = bible.calendar.find((candidate) => candidate.week === week);
      expect(entry, `${session.id} is week ${week}, which COURSE.md's calendar has no date for`).toBeDefined();
      if (entry) expect(dayOnly(session.meta?.date), `${session.id} disagrees with COURSE.md`).toBe(entry.date);
    }
  });

  it("sits inside the course record's own start and end dates", () => {
    expect(bible.calendar.length, "COURSE.md has no calendar").toBeGreaterThan(0);
    const dates = bible.calendar.map((entry) => entry.date);
    expect(dates[0]! >= api.course.startDate, `week 1 (${dates[0]}) is before startDate ${api.course.startDate}`).toBe(true);
    const last = dates[dates.length - 1]!;
    expect(last <= api.course.endDate, `the last week (${last}) is after endDate ${api.course.endDate}`).toBe(true);
  });
});
