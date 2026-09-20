// The decision this protects: the course has one title.
//
// COURSE.md's heading and `src/course-config.ts` both name the course, and
// for twenty-odd commits they named it two different things without anything
// noticing. The record is what the site, the navigation and the catalogue
// read; COURSE.md is what every page was written against. A course whose
// bible and whose record disagree about what it is called has two courses in
// it, and the one a reader sees is whichever file that page happened to use.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { api } from "./site-api";

const heading = /^#\s+(.+?)\s*$/m.exec(readFileSync(resolve("COURSE.md"), "utf8"));

describe("the course title", () => {
  it("is the first heading in COURSE.md", () => {
    expect(heading, "COURSE.md has no level one heading").not.toBeNull();
    expect(heading?.[1], "COURSE.md's heading is empty").toBeTruthy();
  });

  it("is the same in COURSE.md and in the course record", () => {
    expect(
      api.course.title,
      `the record says "${api.course.title}" and COURSE.md says "${heading?.[1]}"`,
    ).toBe(heading?.[1]);
  });

  it("states the course code in COURSE.md too", () => {
    // The code is allocated, not chosen, so the bible carries it and the
    // record has to match rather than the other way round.
    const bible = readFileSync(resolve("COURSE.md"), "utf8");
    expect(bible, `COURSE.md does not mention ${api.course.code}`).toContain(api.course.code);
  });
});
