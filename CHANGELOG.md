# Changelog

All notable changes to this package are documented here. This project follows [Semantic Versioning](https://semver.org/).

## 1.0.0

### Added

- `move(board, direction)`, `spawn(board, rng?)`, `hasMoves(board)` and `canMove(board, direction)`.
- `moveWithDetails(board, direction)`, which reports where every tile went, which cells merged and the points earned.
- `createBoard`, `emptyCells` and `maxTile` helpers.
- TypeScript type declarations.
