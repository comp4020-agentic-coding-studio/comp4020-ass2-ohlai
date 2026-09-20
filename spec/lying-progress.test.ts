// The decision this protects: the header's progress bar has to lie in a
// particular shape, and no amount of looking at it proves that it does.
//
// The bar is driven by requestAnimationFrame, which does not run in a tab
// that is not painting. It could not be watched in the preview pane at all,
// so "it looks right" was never available. The state machine was pulled out
// of the component into src/lib/lying-progress.ts, and this drives it with a
// seeded random source and a fixed timestep instead.
//
// What it holds is the brief: it gets to 99, it sits there long enough to be
// believed before the first fall, the falls get worse, and two runs are not
// the same run. A bar that quietly stopped falling, or reset to the same
// numbers every time, would still animate and would still look fine.
import { describe, expect, it } from "vitest";
import { LyingProgress } from "../src/lib/lying-progress";

/** A seeded generator, so a failure is the same failure next time. */
function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

const STEP = 1 / 60;

interface Frame {
  t: number;
  value: number;
  falls: number;
}

/** Run the machine for `seconds` and return every frame. */
function run(seed: number, seconds: number): Frame[] {
  const bar = new LyingProgress({ random: seeded(seed) });
  const frames: Frame[] = [];
  for (let i = 0; i * STEP < seconds; i += 1) {
    bar.advance(STEP);
    frames.push({ t: i * STEP, value: bar.value, falls: bar.fallsTaken });
  }
  return frames;
}

describe("the bar that lies", () => {
  it("stays inside nought and one hundred", () => {
    for (const seed of [1, 7, 99, 20260921]) {
      const frames = run(seed, 90);
      const low = Math.min(...frames.map((f) => f.value));
      const high = Math.max(...frames.map((f) => f.value));
      expect(low, `seed ${seed} went below 0`).toBeGreaterThanOrEqual(0);
      expect(high, `seed ${seed} went above 100`).toBeLessThanOrEqual(100);
    }
  });

  it("reaches ninety-nine before it falls the first time", () => {
    for (const seed of [1, 7, 99, 20260921]) {
      const frames = run(seed, 90);
      const firstFall = frames.findIndex((f) => f.falls >= 0);
      expect(firstFall, `seed ${seed} never fell`).toBeGreaterThan(0);
      const before = frames.slice(0, firstFall);
      expect(
        Math.max(...before.map((f) => f.value)),
        `seed ${seed} fell before reaching 99`,
      ).toBeGreaterThanOrEqual(98.9);
    }
  });

  it("sits at ninety-nine long enough to be believed", () => {
    // The brief: it holds near the top at the start. Under four seconds and
    // a reader has not had time to decide the bar is nearly done, which is
    // the belief the fall is supposed to break.
    for (const seed of [1, 7, 99, 20260921]) {
      const frames = run(seed, 90);
      const held = frames.filter((f) => f.falls === -1 && f.value >= 98.9).length * STEP;
      expect(held, `seed ${seed} held the top for only ${held.toFixed(2)}s`).toBeGreaterThanOrEqual(4);
    }
  });

  it("falls further each time before starting over", () => {
    for (const seed of [1, 7, 99, 20260921]) {
      const frames = run(seed, 120);
      // The value immediately after each of the first three falls.
      const drops: number[] = [];
      for (let i = 1; i < frames.length; i += 1) {
        if (frames[i]!.falls !== frames[i - 1]!.falls && frames[i]!.falls >= 0) {
          drops.push(frames[i]!.value);
        }
        if (drops.length === 3) break;
      }
      expect(drops.length, `seed ${seed} did not fall three times in 120s`).toBe(3);
      expect(drops[0], `seed ${seed}: first fall ${drops[0]}`).toBeGreaterThan(drops[1]!);
      expect(drops[1], `seed ${seed}: second fall ${drops[1]}`).toBeGreaterThan(drops[2]!);
      expect(drops[2], `seed ${seed}: third fall should be near the bottom`).toBeLessThan(20);
    }
  });

  it("is a different run every time", () => {
    // Not decorative: a bar that replays one fixed animation is a gif, and
    // the point of this one is that the number is not a measurement.
    const a = run(1, 60).map((f) => f.value.toFixed(2));
    const b = run(2, 60).map((f) => f.value.toFixed(2));
    expect(a).not.toEqual(b);
  });
});
