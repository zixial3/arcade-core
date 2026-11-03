# Changelog

All notable changes to this package are documented here. This project follows [Semantic Versioning](https://semver.org/).

## 1.1.0

### Added

- `createRng(seed)`: a seeded random number generator to pass to `spawn`. The same seed always spawns the same tiles, and `rng.state` lets a game resume the exact same sequence after a reload.
- `startBoard(rng?, size?)`: an empty board with two starting tiles.

No breaking changes: every 1.0.0 function keeps its signature and behaviour.

## 1.0.0

### Added

- `move(board, direction)`, `spawn(board, rng?)`, `hasMoves(board)` and `canMove(board, direction)`.
- `moveWithDetails(board, direction)`, which reports where every tile went, which cells merged and the points earned.
- `createBoard`, `emptyCells` and `maxTile` helpers.
- TypeScript type declarations.
