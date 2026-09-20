// The decision this protects: a linked deck that is a stub is a broken
// promise to whoever clicks it.
//
// The build already proves a linked deck compiles and the route exists. That
// is the cheap half. A four slide deck of template text also compiles, also
// routes, and is worse than no deck at all, because the link on the lecture
// page told a reader there was a lecture behind it. So the check measures the
// deck rather than confirming it.
//
// The floors are 8 slides and 200 words, which is the smallest thing that can
// honestly be called a lecture's slides. They are a floor and not a target.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { nodesOfType } from "./site-api";

const MIN_SLIDES = 8;
const MIN_WORDS = 200;

const linked = nodesOfType("lectures").filter((lecture) => lecture.meta?.slides);

interface Deck {
  lecture: string;
  href: string;
  source: string;
  built: string;
  slides: string[];
  words: number;
  text: string;
}

const decks: Deck[] = linked.map((lecture) => {
  const href = String(lecture.meta?.slides);
  const slug = href.replace(/^\/+|\/+$/g, "").replace(/^decks\//, "");
  const source = resolve("src/decks", `${slug}.deck.mdx`);
  const text = existsSync(source) ? readFileSync(source, "utf8") : "";
  const body = text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
  const slides = body
    .split(/^\s*-{3,}\s*$/m)
    .map((slide) => slide.trim())
    .filter(Boolean);
  return {
    lecture: lecture.id,
    href,
    source,
    built: resolve("dist", href.replace(/^\/+|\/+$/g, ""), "index.html"),
    slides,
    words: body.split(/\s+/).filter(Boolean).length,
    text,
  };
});

describe("the deck a lecture links", () => {
  it("exists at all", () => {
    expect(decks.length, "no lecture declares slides:").toBeGreaterThan(0);
  });

  it("has a source deck behind the link", () => {
    for (const deck of decks) {
      expect(existsSync(deck.source), `${deck.lecture} links ${deck.href}, which has no source deck`).toBe(true);
    }
  });

  it("built a page at the address the lecture gives", () => {
    for (const deck of decks) {
      expect(existsSync(deck.built), `${deck.lecture} links ${deck.href}, which did not build`).toBe(true);
    }
  });

  it("is not a stub", () => {
    const thin = decks.filter((deck) => deck.slides.length < MIN_SLIDES || deck.words < MIN_WORDS);
    const detail = thin
      .map((deck) => `  ${deck.href}  ${deck.slides.length} slides, ${deck.words} words`)
      .join("\n");
    expect(
      thin.length,
      `a deck under ${MIN_SLIDES} slides or ${MIN_WORDS} words is a stub:\n${detail}`,
    ).toBe(0);
  });

  it("has something on every slide", () => {
    for (const deck of decks) {
      deck.slides.forEach((slide, index) => {
        const words = slide.replace(/^#+\s.*$/gm, "").split(/\s+/).filter(Boolean).length;
        expect(words, `${deck.href} slide ${index + 1} is a heading and nothing else`).toBeGreaterThan(0);
      });
    }
  });

  it("is the course's deck and not the template's", () => {
    for (const deck of decks) {
      expect(deck.text, `${deck.href} still carries the STARTER_CONTENT marker`).not.toMatch(/STARTER_CONTENT/);
    }
  });
});
