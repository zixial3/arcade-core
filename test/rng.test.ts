import { describe, expect, it } from 'vitest';
import { createRng, startBoard } from '../src/index.js';

describe('createRng', () => {
  it('returns the same sequence for the same seed', () => {
    const a = createRng(42);
    const b = createRng(42);
    const first = [a(), a(), a()];
    expect([b(), b(), b()]).toEqual(first);
    first.forEach((value) => {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    });
  });

  it('can resume from a saved state', () => {
    const rng = createRng(7);
    rng();
    const resumed = createRng(rng.state);
    expect(resumed()).toBe(rng());
  });
});

describe('startBoard', () => {
  it('places two tiles, identically for the same seed', () => {
    const board = startBoard(createRng(1));
    expect(board.flat().filter(Boolean)).toHaveLength(2);
    expect(startBoard(createRng(1))).toEqual(board);
  });
});
