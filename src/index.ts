/**
 * Pure game logic for 2048.
 *
 * A board is a square grid of numbers where 0 means "empty". Every function
 * returns a new board and never mutates its input, touches the DOM, or reads
 * global state. Randomness is injected through an `rng` argument.
 */

export type Board = number[][];

export type Direction = 'up' | 'down' | 'left' | 'right';

export const DIRECTIONS: readonly Direction[] = ['up', 'down', 'left', 'right'];

/** A function returning a float in [0, 1), like `Math.random`. */
export type Rng = () => number;

export interface Position {
  row: number;
  col: number;
}

/** Where one tile travelled during a move. */
export interface TileMove {
  from: Position;
  to: Position;
}

/** A cell where two tiles combined into one. */
export interface Merge {
  at: Position;
  value: number;
}

export interface MoveResult {
  board: Board;
  /** One entry for every tile that was on the board before the move. */
  moves: TileMove[];
  merges: Merge[];
  /** Sum of every tile created by a merge. */
  points: number;
  changed: boolean;
}

/** Creates an empty `size` × `size` board. */
export function createBoard(size = 4): Board {
  return Array.from({ length: size }, () => Array<number>(size).fill(0));
}

/**
 * Cells of each line, ordered from the edge the tiles slide towards.
 * Moving left, row 0 is read left to right; moving down, column 0 is read
 * bottom to top; and so on.
 */
function linesFor(size: number, direction: Direction): Position[][] {
  const indices = [...Array(size).keys()];
  const reversed = [...indices].reverse();
  switch (direction) {
    case 'left':
      return indices.map((row) => indices.map((col) => ({ row, col })));
    case 'right':
      return indices.map((row) => reversed.map((col) => ({ row, col })));
    case 'up':
      return indices.map((col) => indices.map((row) => ({ row, col })));
    case 'down':
      return indices.map((col) => reversed.map((row) => ({ row, col })));
  }
}

/**
 * Slides every tile towards `direction`, merging equal neighbours once each,
 * and reports where every tile went.
 */
export function moveWithDetails(board: Board, direction: Direction): MoveResult {
  const next = createBoard(board.length);
  const moves: TileMove[] = [];
  const merges: Merge[] = [];
  let points = 0;

  for (const line of linesFor(board.length, direction)) {
    let write = 0;
    // Index in `line` of the last placed tile that may still merge.
    let mergeable = -1;

    for (const from of line) {
      const value = board[from.row][from.col];
      if (value === 0) continue;

      const previous = mergeable >= 0 ? line[mergeable] : undefined;
      if (previous && next[previous.row][previous.col] === value) {
        const merged = value * 2;
        next[previous.row][previous.col] = merged;
        moves.push({ from, to: previous });
        merges.push({ at: previous, value: merged });
        points += merged;
        mergeable = -1;
      } else {
        const to = line[write];
        next[to.row][to.col] = value;
        moves.push({ from, to });
        mergeable = write;
        write += 1;
      }
    }
  }

  const changed = moves.some(({ from, to }) => from.row !== to.row || from.col !== to.col);
  return { board: next, moves, merges, points, changed };
}

/** Slides and merges every tile in `direction` and returns the new board. */
export function move(board: Board, direction: Direction): Board {
  return moveWithDetails(board, direction).board;
}

/** True if moving in `direction` would change the board. */
export function canMove(board: Board, direction: Direction): boolean {
  return moveWithDetails(board, direction).changed;
}

/** True if any direction would still change the board; false means game over. */
export function hasMoves(board: Board): boolean {
  return DIRECTIONS.some((direction) => canMove(board, direction));
}

/** Positions of every empty cell, in reading order. */
export function emptyCells(board: Board): Position[] {
  const cells: Position[] = [];
  board.forEach((row, r) =>
    row.forEach((value, c) => {
      if (value === 0) cells.push({ row: r, col: c });
    }),
  );
  return cells;
}

/**
 * Puts a 2 (90%) or a 4 (10%) in a random empty cell and returns the new board.
 * A full board is returned unchanged (as a copy).
 */
export function spawn(board: Board, rng: Rng = Math.random): Board {
  const next = board.map((row) => [...row]);
  const cells = emptyCells(board);
  if (cells.length === 0) return next;

  const cell = cells[Math.floor(rng() * cells.length)];
  next[cell.row][cell.col] = rng() < 0.9 ? 2 : 4;
  return next;
}

/** The largest tile on the board. */
export function maxTile(board: Board): number {
  return Math.max(0, ...board.flat());
}

/** An empty board with two starting tiles. */
export function startBoard(rng: Rng = Math.random, size = 4): Board {
  return spawn(spawn(createBoard(size), rng), rng);
}

export { createRng, type SeededRng } from './rng.js';
