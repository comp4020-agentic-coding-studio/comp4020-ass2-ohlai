// The decision this protects: a citation is a claim about the world, so it
// carries provenance like any other.
//
// The reading list is where a course is most confidently wrong. An author,
// a title and a year recalled from memory look exactly like an author, a
// title and a year that were checked, and the wrong year for a real paper is
// harder to catch than an invented paper, because everything about it reads
// as correct. An agent asked for a reading list will produce one of these
// without hesitating, and so will a person.
//
// So every reading names where it was verified and when. `measures` is not
// required, unlike a figure's provenance: the claim a citation makes is that
// this work exists with this author, title and year, and the source is the
// record where that was confirmed. A URL or a DOI, because "I checked" is
// not a record.
import { describe, expect, it } from "vitest";
import { nodesOfType } from "./site-api";

interface Reading {
  cite?: unknown;
  source?: unknown;
  retrieved?: unknown;
}

const RECORD = /^(https?:\/\/\S+|10\.\d{4,}\/\S+)$/;

const readingsOf = (value: unknown): Reading[] =>
  Array.isArray(value) ? (value as Reading[]) : [];

const weeks = nodesOfType("sessions").map((session) => ({
  id: session.id,
  week: Number(session.meta?.week),
  readings: readingsOf(session.meta?.readings),
}));

const all = weeks.flatMap((week) => week.readings.map((reading) => ({ week: week.id, reading })));
const field = (value: unknown): string => String(value ?? "").trim();

describe("the reading list", () => {
  it("is on every week page", () => {
    expect(weeks.length, "there are no week pages").toBeGreaterThan(0);
    for (const week of weeks) {
      expect(week.readings.length, `${week.id} lists no readings`).toBeGreaterThan(0);
    }
  });

  it("cites every reading with a year", () => {
    for (const { week, reading } of all) {
      const cite = field(reading.cite);
      expect(cite, `${week} has a reading with no cite:`).not.toBe("");
      expect(cite, `${week}: "${cite}" has no four digit year`).toMatch(/\b(1[89]|20)\d{2}\b/);
    }
  });

  it("names the record each reading was verified against", () => {
    for (const { week, reading } of all) {
      const source = field(reading.source);
      expect(source, `${week}: "${field(reading.cite)}" has no source:`).not.toBe("");
      expect(source, `${week}: "${source}" is not a URL or a DOI`).toMatch(RECORD);
    }
  });

  it("dates the verification, in the past", () => {
    const today = new Date().toISOString().slice(0, 10);
    for (const { week, reading } of all) {
      const retrieved = field(reading.retrieved).slice(0, 10);
      expect(retrieved, `${week}: "${field(reading.cite)}" has no retrieved:`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(retrieved <= today, `${week}: retrieved ${retrieved} is in the future`).toBe(true);
    }
  });
});
