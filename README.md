# @zixial3/arcade-core

Pure game logic for **2048**: no framework, no DOM, no globals. Works in Node and in the browser.

## Install

```bash
npm install @zixial3/arcade-core
```

## Usage

A board is a square array of numbers where `0` means empty.

```js
import {
  createBoard,
  move,
  spawn,
  hasMoves,
  canMove,
} from "@zixial3/arcade-core";

let board = spawn(spawn(createBoard())); // empty 4×4 board with two starting tiles

if (canMove(board, "left")) {
  board = move(board, "left"); // slide and merge
  board = spawn(board); // add a 2 or 4 in a random empty cell
}

if (!hasMoves(board)) console.log("game over");
```

Every function returns a **new** board and never mutates its input.

## API

| Function                              | Returns                                                                                         |
| ------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `move(board, direction)`              | New board after sliding every tile towards `direction` and merging equal neighbours once.       |
| `spawn(board, rng?)`                  | New board with a 2 (90%) or 4 (10%) in a random empty cell. `rng` defaults to `Math.random`.    |
| `hasMoves(board)`                     | `true` if any direction would change the board; `false` means game over.                        |
| `canMove(board, direction)`           | `true` if moving in `direction` would change the board.                                         |
| `moveWithDetails(board, direction)`   | `{ board, moves, merges, points, changed }`: where every tile went, for animations and scoring. |
| `createBoard(size?)`                  | Empty board.                                                                                    |
| `emptyCells(board)`, `maxTile(board)` | Helpers.                                                                                        |

`direction` is `'up' | 'down' | 'left' | 'right'`.

### Merging rules

Each tile merges at most once per move:

```js
move([[2, 2, 2, 2], ...], 'left'); // → [[4, 4, 0, 0], ...]
move([[4, 4, 8, 0], ...], 'left'); // → [[8, 8, 0, 0], ...]
```

### Scoring

`moveWithDetails` reports `points`, the sum of every tile created by a merge:

```js
const { board, points } = moveWithDetails([[2, 2, 4, 4], ...], 'left');
// board[0] → [4, 8, 0, 0], points → 12
```

## Development

```bash
npm install
npm test        # vitest
npm run build   # TypeScript → dist/
```

## License

MIT
