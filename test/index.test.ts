import { describe, expect, it } from 'vitest';
import {
  canMove,
  createBoard,
  hasMoves,
  maxTile,
  move,
  moveWithDetails,
  spawn,
  type Board,
} from '../src/index.js';

const row = (values: number[]): Board => [values, [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

describe('move', () => {
  it('slides tiles as far as they can go', () => {
    expect(move(row([0, 2, 0, 4]), 'left')[0]).toEqual([2, 4, 0, 0]);
    expect(move(row([2, 0, 4, 0]), 'right')[0]).toEqual([0, 0, 2, 4]);
  });

  it('merges each tile at most once per move', () => {
    expect(move(row([2, 2, 2, 2]), 'left')[0]).toEqual([4, 4, 0, 0]);
    expect(move(row([4, 4, 8, 0]), 'left')[0]).toEqual([8, 8, 0, 0]);
    expect(move(row([2, 2, 2, 0]), 'right')[0]).toEqual([0, 0, 2, 4]);
  });

  it('moves columns up and down', () => {
    const board: Board = [
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [4, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    expect(move(board, 'up').map((r) => r[0])).toEqual([4, 4, 0, 0]);
    expect(move(board, 'down').map((r) => r[0])).toEqual([0, 0, 4, 4]);
  });

  it('does not mutate its input', () => {
    const board = row([2, 2, 0, 0]);
    const copy = structuredClone(board);
    move(board, 'left');
    expect(board).toEqual(copy);
  });
});

describe('moveWithDetails', () => {
  it('reports points, merges and tile paths', () => {
    const result = moveWithDetails(row([2, 2, 4, 4]), 'left');
    expect(result.board[0]).toEqual([4, 8, 0, 0]);
    expect(result.points).toBe(12);
    expect(result.merges).toEqual([
      { at: { row: 0, col: 0 }, value: 4 },
      { at: { row: 0, col: 1 }, value: 8 },
    ]);
    expect(result.moves).toHaveLength(4);
    expect(result.moves[3]).toEqual({ from: { row: 0, col: 3 }, to: { row: 0, col: 1 } });
  });
});

describe('canMove and hasMoves', () => {
  it('knows when a direction changes nothing', () => {
    const board = row([2, 4, 0, 0]);
    expect(canMove(board, 'left')).toBe(false);
    expect(canMove(board, 'right')).toBe(true);
  });

  it('detects game over', () => {
    const stuck: Board = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    expect(hasMoves(stuck)).toBe(false);
    stuck[3][3] = 4;
    expect(hasMoves(stuck)).toBe(true);
  });
});

describe('spawn', () => {
  it('fills one empty cell using the injected rng', () => {
    const board = spawn(createBoard(), () => 0);
    expect(board[0][0]).toBe(2);
    expect(board.flat().filter(Boolean)).toHaveLength(1);
  });

  it('spawns a 4 one time in ten', () => {
    const values = [0, 0.95];
    const board = spawn(createBoard(), () => values.shift()!);
    expect(board[0][0]).toBe(4);
  });

  it('returns a full board unchanged', () => {
    const full: Board = Array.from({ length: 4 }, () => [2, 4, 2, 4]);
    expect(spawn(full)).toEqual(full);
  });
});

describe('maxTile', () => {
  it('finds the largest tile', () => {
    expect(maxTile(row([2, 2048, 0, 8]))).toBe(2048);
  });
});
