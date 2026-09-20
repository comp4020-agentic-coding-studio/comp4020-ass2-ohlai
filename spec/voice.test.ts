// The decision this protects: the register is a course design decision, not a
// preference.
//
// A course whose thesis is that waiting is designed rather than broken cannot
// be written in the voice that calls every delay an obstacle to unlock. The
// banned constructions are banned because the move behind each one is banned:
// the phrase is the symptom. Reaching for a synonym keeps the move and hides
// the symptom, which is worse than the hit, so rewrite the sentence instead.
//
// CLAUDE.md, spec/ and notes/ are harness and not student-facing copy, so
// they are not scanned. That is the only reason the list can be written down
// here at all.
import { describe, expect, it } from "vitest";
import { contentSources } from "./site-api";

interface Rule {
  name: string;
  pattern: RegExp;
}

// Group one is the list the course brief named.
const BRIEF_RULES: Rule[] = [
  { name: "delve", pattern: /\bdelv(e|es|ed|ing)\b/gi },
  { name: "tapestry", pattern: /\btapestr(y|ies)\b/gi },
  { name: "testament to", pattern: /\btestament to\b/gi },
  { name: "navigate the complexities", pattern: /\bnavigat\w* the complexit\w*/gi },
  { name: "in today's", pattern: /\bin today'?s\b/gi },
  { name: "fast-paced", pattern: /\bfast[\s-]paced\b/gi },
  { name: "unlock", pattern: /\bunlock(s|ed|ing)?\b/gi },
  { name: "leverage", pattern: /\bleverag(e|es|ed|ing)\b/gi },
  { name: "journey", pattern: /\bjourneys?\b/gi },
  { name: "not just X, it's Y", pattern: /\bnot (just|only)\b[^.!?\n]{0,80}?\b(it'?s|but|they'?re)\b/gi },
  { name: "at its core", pattern: /\bat (its|their) core\b/gi },
  { name: "more than ever", pattern: /\bmore than ever\b/gi },
];

// Group two comes from the unslop skill, which CLAUDE.md applies on top of the
// brief's list. Kept to constructions with no honest use in course copy.
const UNSLOP_RULES: Rule[] = [
  { name: "utilize", pattern: /\butiliz(e|es|ed|ing|ation)\b/gi },
  { name: "showcase", pattern: /\bshowcas(e|es|ed|ing)\b/gi },
  { name: "pivotal", pattern: /\bpivotal\b/gi },
  { name: "groundbreaking", pattern: /\bground[\s-]?breaking\b/gi },
  { name: "seamless", pattern: /\bseamless(ly)?\b/gi },
  { name: "in order to", pattern: /\bin order to\b/gi },
  { name: "due to the fact that", pattern: /\bdue to the fact that\b/gi },
  { name: "it is important to note", pattern: /\bit is important to note\b/gi },
  { name: "serves as / stands as / boasts", pattern: /\b(serves as|stands as|boasts)\b/gi },
  { name: "the future looks bright", pattern: /\bthe future (looks|is) bright\b/gi },
];

const RULES = [...BRIEF_RULES, ...UNSLOP_RULES];

/** Frontmatter delimiters, deck slide breaks and table rules are structure. */
const isStructuralRule = (line: string): boolean =>
  /^\s*-{3,}\s*$/.test(line) || /^\s*\|?[\s:|-]{3,}\|[\s:|-]*$/.test(line);

const sources = contentSources();

interface Hit {
  where: string;
  rule: string;
  text: string;
}

function scan(check: (line: string) => { rule: string; text: string } | undefined): Hit[] {
  const hits: Hit[] = [];
  for (const file of sources) {
    let fenced = false;
    file.text.split(/\r?\n/).forEach((line, index) => {
      if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
      else if (!fenced) {
        const found = check(line);
        if (found) hits.push({ where: `${file.path}:${index + 1}`, ...found });
      }
    });
  }
  return hits;
}

const report = (hits: Hit[]): string =>
  hits
    .slice(0, 40)
    .map((hit) => `  ${hit.where}  ${hit.rule}  "${hit.text}"`)
    .join("\n") + (hits.length > 40 ? `\n  ...and ${hits.length - 40} more` : "");

describe("voice", () => {
  it("is actually reading the content", () => {
    // A scanner pointed at nothing passes every rule. This is the check that
    // stops a green voice suite from meaning the files moved.
    expect(sources.length, "contentSources() found no markdown to scan").toBeGreaterThan(5);
    expect(sources.map((file) => file.path)).toContain("COURSE.md");
  });

  it("uses none of the forbidden constructions", () => {
    const hits = scan((line) => {
      for (const rule of RULES) {
        rule.pattern.lastIndex = 0;
        const match = rule.pattern.exec(line);
        if (match) return { rule: rule.name, text: match[0] };
      }
      return undefined;
    });
    expect(hits.length, `forbidden constructions:\n${report(hits)}`).toBe(0);
  });

  it("uses no em dash, and nothing standing in for one", () => {
    // Swapping an em dash for a spaced double hyphen trades one tell for
    // another. A sentence that needs the break gets a full stop or a comma.
    const hits = scan((line) => {
      if (isStructuralRule(line)) return undefined;
      const match = /[–—―]|\s-{2,}\s|\w-{2,}\w/.exec(line);
      return match ? { rule: "em dash or stand-in", text: match[0] } : undefined;
    });
    expect(hits.length, `dashes:\n${report(hits)}`).toBe(0);
  });
});
