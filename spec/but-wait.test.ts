// The decision this protects: a recurring block is a standing promise, and a
// recurring block that repeats itself is a broken one.
//
// Every week page ends with "But wait, there's more", holding one artefact,
// example or aside that belongs to the week's subject and did not fit its
// argument. The title is the only joke the course makes twice, which is what
// makes it a running feature rather than a gag. Everything underneath it is
// written straight.
//
// Three ways it decays, all of them checkable. It becomes a summary of the
// week, so it repeats the body. It becomes a teaser, so it repeats next week.
// It becomes a habit, so the same artefact turns up twice across the twelve.
// The block declares its artefact in `extra:` and the check holds all three:
// the name appears inside the block, nowhere else on its own page, and on no
// other week.
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { describe, expect, it } from "vitest";
import { bodyOf, contentSources, nodesOfType } from "./site-api";

const HEADING = "But wait, there's more";
const MIN_SENTENCES = 2;
const MAX_SENTENCES = 4;

const weekPages = nodesOfType("sessions").map((session) => {
  const file = contentSources().find(
    (source) =>
      source.path.startsWith("src/content/sessions/") &&
      basename(source.path).replace(/\.mdx?$/, "") === session.id.replace(/^sessions\//, ""),
  );
  const text = file ? file.text : readFileSync(`${session.id}.md`, "utf8");
  const { body } = bodyOf(text);
  const lines = body.split(/\r?\n/);
  const at = lines.findIndex((line) => /^##\s+But wait/i.test(line));
  return {
    id: session.id,
    week: Number(session.meta?.week),
    extra: String(session.meta?.extra ?? "").trim(),
    body,
    headingLine: at === -1 ? undefined : lines[at]!,
    matches: lines.filter((line) => /^#{1,6}\s+But wait/i.test(line)),
    before: at === -1 ? body : lines.slice(0, at).join("\n"),
    block: at === -1 ? "" : lines.slice(at + 1).join("\n").trim(),
  };
});

/** Sentence ends are terminal punctuation followed by a capital or the end. */
const sentences = (text: string): string[] =>
  text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z"'(])|(?<=[.!?])$/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

describe("but wait, there's more", () => {
  it("is on every week page, exactly once", () => {
    expect(weekPages.length, "there are no week pages").toBeGreaterThan(0);
    for (const page of weekPages) {
      expect(page.matches.length, `${page.id} has ${page.matches.length} "But wait" headings`).toBe(1);
    }
  });

  it("uses the heading string exactly, at level two", () => {
    // A near miss is worse than a miss. "But wait, there's more!" reads as
    // the same feature to a person and is a different string to everything
    // that has to find it.
    for (const page of weekPages) {
      expect(page.headingLine, `${page.id} has no "But wait" heading`).toBeDefined();
      expect(page.headingLine, `${page.id} does not use the heading verbatim`).toBe(`## ${HEADING}`);
    }
  });

  it("ends the page", () => {
    for (const page of weekPages) {
      expect(/^#{1,6}\s/m.test(page.block), `${page.id} has a section after the block`).toBe(false);
    }
  });

  it(`runs to between ${MIN_SENTENCES} and ${MAX_SENTENCES} sentences`, () => {
    for (const page of weekPages) {
      const count = sentences(page.block).length;
      expect(count, `${page.id}'s block runs to ${count} sentences`).toBeGreaterThanOrEqual(MIN_SENTENCES);
      expect(count, `${page.id}'s block runs to ${count} sentences`).toBeLessThanOrEqual(MAX_SENTENCES);
    }
  });

  it("names the artefact it holds", () => {
    for (const page of weekPages) {
      expect(page.extra, `${page.id} declares no extra:`).not.toBe("");
      expect(
        page.block.toLowerCase().includes(page.extra.toLowerCase()),
        `${page.id} declares extra: "${page.extra}", which its block never mentions`,
      ).toBe(true);
    }
  });

  it("holds something the week has not already used", () => {
    for (const page of weekPages) {
      if (!page.extra) continue;
      expect(
        page.before.toLowerCase().includes(page.extra.toLowerCase()),
        `${page.id} already uses "${page.extra}" in its body, so the block is a repeat`,
      ).toBe(false);
    }
  });

  it("holds a different artefact every week", () => {
    const seen = new Map<string, number>();
    for (const page of weekPages) {
      if (!page.extra) continue;
      const key = page.extra.toLowerCase();
      const first = seen.get(key);
      expect(first, `weeks ${first} and ${page.week} both hold "${page.extra}"`).toBeUndefined();
      seen.set(key, page.week);
    }
  });
});
