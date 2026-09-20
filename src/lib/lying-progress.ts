/**
 * The state machine behind the header's progress bar.
 *
 * It lives here rather than inside the component's script for one reason:
 * `requestAnimationFrame` does not run in a tab that is not painting, so the
 * bar could not be watched in the preview pane and "it looks right" was not
 * available as a way of checking it. Pulled out and driven by an injected
 * clock and an injected random source, the behaviour becomes something
 * `spec/lying-progress.test.ts` can assert: that it reaches 99, that it
 * holds there long enough to be believed before the first fall, that the
 * falls get worse, and that two runs differ.
 *
 * The behaviour it models is week 4's: a determinate indicator whose number
 * is not a measurement. It climbs at a speed that changes for no reason,
 * stalls for no reason, reaches a ceiling, sits on it, and then drops to
 * somewhere lower and starts again.
 */

export type Phase = "climb" | "stall" | "hold";

/** How far it falls, in order. Each entry is a range, not a number. */
const FLOORS: readonly (readonly [number, number])[] = [
  [55, 68],
  [28, 44],
  [6, 18],
];

/** The opening hold, in seconds: long enough to be believed. */
const OPENING_HOLD = [4.2, 6.4] as const;

/** Every later hold, in seconds. */
const LATER_HOLD = [0.7, 2.6] as const;

const STALL = [0.25, 1.1] as const;

/** Chance per second of stalling mid-climb. */
const STALL_RATE = 0.72;

export interface LyingProgressOptions {
  /** Injected for tests. Must return [0, 1). */
  random?: () => number;
}

export class LyingProgress {
  #random: () => number;
  #value: number;
  #ceiling = 99;
  #phase: Phase = "climb";
  #timer = 0;
  #speed: number;
  #hold: number;
  /** -1 is the opening climb, which has not fallen yet. */
  #fallsTaken = -1;
  #label = "Transferring";

  constructor(options: LyingProgressOptions = {}) {
    this.#random = options.random ?? Math.random;
    this.#value = this.#between(2, 9);
    // The opening is fixed in shape and random in detail: reach 99 quickly,
    // then sit on it. A bar that falls over before anybody believed it has
    // not earned the fall.
    this.#speed = this.#between(55, 80);
    this.#hold = this.#between(...OPENING_HOLD);
  }

  get value(): number {
    return this.#value;
  }

  get label(): string {
    return this.#label;
  }

  get phase(): Phase {
    return this.#phase;
  }

  /** Falls completed. -1 until the opening hold ends. */
  get fallsTaken(): number {
    return this.#fallsTaken;
  }

  #between(min: number, max: number): number {
    return min + this.#random() * (max - min);
  }

  /** Advance by `dt` seconds. */
  advance(dt: number): void {
    if (this.#phase === "climb") {
      this.#value = Math.min(this.#value + this.#speed * dt, this.#ceiling);
      this.#label = this.#value > 95 ? "Almost done" : "Transferring";
      if (this.#value >= this.#ceiling) {
        this.#phase = "hold";
        this.#timer = this.#hold;
        this.#label = this.#ceiling > 95 ? "Finalising" : "Almost done";
      } else if (this.#random() < STALL_RATE * dt) {
        this.#phase = "stall";
        this.#timer = this.#between(...STALL);
      }
      return;
    }

    this.#timer -= dt;
    if (this.#timer > 0) return;

    if (this.#phase === "stall") {
      this.#phase = "climb";
      // A new speed after every stall, which is what makes the climb read as
      // uneven rather than as one slow line.
      this.#speed = this.#between(8, 46);
      return;
    }

    this.#fall();
  }

  #fall(): void {
    this.#fallsTaken += 1;
    if (this.#fallsTaken >= FLOORS.length) {
      // The run resets and the whole shape happens again, with new numbers.
      this.#fallsTaken = -1;
      this.#value = this.#between(2, 10);
      this.#ceiling = 99;
      this.#hold = this.#between(...OPENING_HOLD);
    } else {
      const [low, high] = FLOORS[this.#fallsTaken]!;
      this.#value = this.#between(low, high);
      this.#ceiling = this.#between(Math.min(this.#value + 14, 96), 99);
      this.#hold = this.#between(...LATER_HOLD);
    }
    this.#phase = "climb";
    this.#speed = this.#between(20, 60);
    this.#label = "Recalculating";
  }
}
