// The decision this protects: a number without provenance is a rumour.
//
// A course arguing that waiting is designed will reach for figures, because
// the field is full of them: the tenth of a second that reads as instant, the
// share of people who abandon a checkout, the seconds a progress bar buys
// you. Most of those numbers circulate with no paper behind them, and an
// agent asked for a statistic will produce one that looks exactly like the
// real ones. So a figure ships with three fields or it does not ship.
//
// "What it measures" is the field that catches fabrication. A made up number
// has a plausible source and a plausible date. It does not have a population,
// a method and a unit, because those are what was never there.
//
// Course facts are not exempt. A weight or a late penalty renders from
// frontmatter and should not be restated in prose at all, and if it is, it
// declares where it came from like anything else.
import { describe, expect, it } from "vitest";
import { bodyOf, contentSources, readClaims } from "./site-api";

// Percentages, sub-minute durations, multipliers and counts of people. These
// are the shapes an empirical claim takes in this course. Bare integers are
// not matched: "week 3" is not a finding.
const FIGURE =
  /\b\d[\d,]*(?:\.\d+)?\s*(?:%|percent\b|ms\b|millisecond\w*|seconds?\b|secs?\b)|\b\d[\d,]*(?:\.\d+)?x\b|\b\d[\d,]*\s+(?:participants?|users?|people|respondents?|subjects?|studies|papers)\b/gi;

const normalise = (value: string): string => value.toLowerCase().replace(/[\s,]+/g, "");

const sources = contentSources();
const decks = sources.filter((file) => file.path.startsWith("src/decks/"));
const pages = sources.filter((file) => !file.path.startsWith("src/decks/"));

/** A deck borrows the claims of the lecture that links it. */
function claimsForDeck(deckPath: string): ReturnType<typeof readClaims> {
  const slug = deckPath.replace(/^.*\//, "").replace(/\.deck\.mdx$/, "");
  const href = `/decks/${slug}/`;
  return sources
    .filter((file) => file.text.includes(`slides: ${href}`))
    .flatMap((file) => readClaims(file.text));
}

interface Uncovered {
  where: string;
  figure: string;
}

function uncoveredFigures(file: { path: string; text: string }, claims: ReturnType<typeof readClaims>): Uncovered[] {
  const declared = claims.map((claim) => normalise(claim.text));
  const { body, offset } = bodyOf(file.text);
  const found: Uncovered[] = [];
  let fenced = false;
  body.split(/\r?\n/).forEach((line, index) => {
    if (/^\s*(```|~~~)/.test(line)) {
      fenced = !fenced;
      return;
    }
    if (fenced) return;
    FIGURE.lastIndex = 0;
    for (const match of line.matchAll(FIGURE)) {
      const figure = normalise(match[0]);
      if (!declared.some((claim) => claim.includes(figure))) {
        found.push({ where: `${file.path}:${offset + index + 1}`, figure: match[0].trim() });
      }
    }
  });
  return found;
}

const report = (items: Uncovered[]): string =>
  items.map((item) => `  ${item.where}  ${item.figure}`).join("\n");

describe("declared claims", () => {
  const declared = sources.flatMap((file) =>
    readClaims(file.text).map((claim) => ({ file: file.path, claim })),
  );

  it("populates all three provenance fields", () => {
    const missing: string[] = [];
    for (const { file, claim } of declared) {
      const label = `${file}: "${claim.text.slice(0, 50)}"`;
      if (!claim.text) missing.push(`${file}: a claim with no text`);
      if (!claim.source) missing.push(`${label} has no source`);
      if (!claim.retrieved) missing.push(`${label} has no retrieved date`);
      if (!claim.measures) missing.push(`${label} does not say what it measures`);
    }
    expect(missing, missing.join("\n")).toHaveLength(0);
  });

  it("retrieves on a real date, not a future one", () => {
    const today = new Date().toISOString().slice(0, 10);
    for (const { file, claim } of declared) {
      expect(claim.retrieved, `${file}: retrieved is not YYYY-MM-DD`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(claim.retrieved <= today, `${file}: retrieved ${claim.retrieved} is in the future`).toBe(true);
    }
  });

  it("says what each figure measures in more than a word", () => {
    // A population, a method and a unit do not fit in four words. This is the
    // field that separates a real figure from a plausible one.
    for (const { file, claim } of declared) {
      expect(
        claim.measures.split(/\s+/).filter(Boolean).length,
        `${file}: "${claim.measures}" does not describe a measurement`,
      ).toBeGreaterThanOrEqual(5);
    }
  });
});

describe("figures in the prose", () => {
  it("declares every figure on a content page", () => {
    const uncovered = pages.flatMap((file) => uncoveredFigures(file, readClaims(file.text)));
    expect(uncovered.length, `figures with no declared claim behind them:\n${report(uncovered)}`).toBe(0);
  });

  it("declares every figure on a slide, on the lecture that links the deck", () => {
    // A deck is a performance artefact and carries no frontmatter of its own
    // worth trusting. The page owns the evidence, the slide quotes it.
    const uncovered = decks.flatMap((file) => uncoveredFigures(file, claimsForDeck(file.path)));
    expect(uncovered.length, `figures on slides with no claim on their lecture:\n${report(uncovered)}`).toBe(0);
  });
});
