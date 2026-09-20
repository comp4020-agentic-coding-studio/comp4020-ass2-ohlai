// The decision this protects: twelve weeks that blur into each other are one
// week taught twelve times.
//
// This is the failure a marker sees in ten minutes and a check normally
// cannot: weeks that are individually fine and collectively one idea with
// twelve titles. Three things make a week distinct and all three are
// mechanical. It does something no other week does. It installs a term no
// other week installs. It does not run on last week's reading list.
//
// The reading rule allows one shared reading, because a text the course
// returns to is a spine. Two is a repeat.
import { describe, expect, it } from "vitest";
import { readCourseBible } from "./course-md";
import { nodesOfType, stringList } from "./site-api";

const bible = readCourseBible();
const sessions = nodesOfType("sessions");

/** Near-identical phrasings are the same line. Compare them as the same line. */
const normalise = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^a-z0-9' ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function duplicates(values: { week: number; value: string }[]): string[] {
  const seen = new Map<string, number>();
  const clashes: string[] = [];
  for (const { week, value } of values) {
    const key = normalise(value);
    const first = seen.get(key);
    if (first !== undefined) clashes.push(`week ${first} and week ${week} both say "${value}"`);
    else seen.set(key, week);
  }
  return clashes;
}

describe("what makes each week its own week", () => {
  it("gives every week a does: line", () => {
    expect(bible.weeks.length, "COURSE.md declares no weeks").toBeGreaterThan(0);
    for (const week of bible.weeks) {
      expect(week.does, `week ${week.week} has no does: line`).not.toBe("");
    }
  });

  it("gives every week a key-term:", () => {
    for (const week of bible.weeks) {
      expect(week.keyTerm, `week ${week.week} has no key-term:`).not.toBe("");
    }
  });

  it("says something different in every does: line", () => {
    const clashes = duplicates(bible.weeks.map((week) => ({ week: week.week, value: week.does })));
    expect(clashes, clashes.join("; ")).toHaveLength(0);
  });

  it("installs a different key-term every week", () => {
    const clashes = duplicates(bible.weeks.map((week) => ({ week: week.week, value: week.keyTerm })));
    expect(clashes, clashes.join("; ")).toHaveLength(0);
  });

  it("gives every week a title of its own", () => {
    const clashes = duplicates(bible.weeks.map((week) => ({ week: week.week, value: week.title })));
    expect(clashes, clashes.join("; ")).toHaveLength(0);
  });
});

describe("the reading lists", () => {
  const readingsByWeek = sessions.map((session) => ({
    id: session.id,
    week: Number(session.meta?.week),
    readings: stringList(session.meta?.readings).map(normalise),
  }));

  it("puts readings on every week page", () => {
    expect(readingsByWeek.length, "there are no session pages").toBeGreaterThan(0);
    for (const entry of readingsByWeek) {
      expect(entry.readings.length, `${entry.id} lists no readings:`).toBeGreaterThan(0);
    }
  });

  it("never shares more than one reading between two weeks", () => {
    const overlaps: string[] = [];
    for (let i = 0; i < readingsByWeek.length; i += 1) {
      for (let j = i + 1; j < readingsByWeek.length; j += 1) {
        const a = readingsByWeek[i]!;
        const b = readingsByWeek[j]!;
        const shared = a.readings.filter((reading) => b.readings.includes(reading));
        if (shared.length > 1) {
          overlaps.push(`weeks ${a.week} and ${b.week} share ${shared.length} readings`);
        }
      }
    }
    expect(overlaps, overlaps.join("; ")).toHaveLength(0);
  });
});
