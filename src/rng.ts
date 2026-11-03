import type { Rng } from './index.js';

/** A seeded `Rng` whose current position can be saved and resumed. */
export interface SeededRng extends Rng {
  /** Pass this to `createRng` to continue the exact same sequence later. */
  readonly state: number;
}

/**
 * Creates a deterministic random number generator (mulberry32).
 * The same seed always produces the same sequence, so the same moves
 * always spawn tiles in the same places.
 */
export function createRng(seed: number): SeededRng {
  let state = seed >>> 0;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Object.defineProperty(next, 'state', { get: () => state }) as SeededRng;
}
