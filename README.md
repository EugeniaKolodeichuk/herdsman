# Herdsman

A 2D mini-game prototype built with **PixiJS v8** and **TypeScript**. The player controls a hero who collects wandering animals and guides them into a yard to score points.

## Getting started

```bash
npm install
npm run dev
```

## How to play

- **Click / tap** anywhere on the field to move the hero
- Walk close to animals to recruit them (max group of 5)
- Lead the group into the yellow yard to score
- New animals spawn over time — keep going

---

## Architecture

The project is organised around a lightweight game-loop kernel: `Game` initialises PixiJS, builds the scene, and drives a list of `ITickable` entities each frame. Each entity is responsible for its own logic; `Game` only wires them together.

```
src/
├── main.ts              Entry point
├── Game.ts              Bootstrap, scene wiring, game loop
├── ITickable.ts         Core game-loop interface
├── constants.ts         All tuneable values in one place
│
├── GameField.ts         Green background rendering
├── Yard.ts              Yellow destination area + collision bounds
├── ScoreUI.ts           Score display
│
├── Hero.ts              Player character — movement toward click target
├── Animal.ts            Animal entity — Patrol / Following state machine
├── Herd.ts              Group management — max size, trail positioning
├── AnimalManager.ts     Spawning, hero-proximity detection, entity orchestration
│
├── ScoringSystem.ts     Yard collision check → score increment
└── SpawnGenerator.ts    Timed random spawning of new animals
```

---

## SOLID principles

### Single Responsibility
Every class has one reason to change:
- `Animal` — movement and state only; knows nothing about the hero or the yard
- `Herd` — group membership and follower positioning only
- `AnimalManager` — spawning and proximity detection; delegates group logic to `Herd`
- `ScoringSystem` — yard collision check; delegates removal and score update to its dependencies
- `SpawnGenerator` — scheduling new spawns; delegates the actual creation to `IAnimalSpawner`

### Open / Closed
`Game.startLoop()` iterates `ITickable[]`. Adding a new system (e.g. a day/night cycle or a power-up system) requires only implementing `ITickable` and calling `registerEntity()` — no changes to the loop or any existing class.

### Liskov Substitution
`Hero`, `Animal`, and `AnimalManager` all extend PixiJS `Container`. They are valid scene-graph nodes and can be added to the stage with `addChild()` without any special handling.

### Interface Segregation
Each class declares only the contract it needs from its dependencies via local interfaces:
- `ScoringSystem` uses `IYardArea`, `IAnimalGroup`, and `IScoreCounter` — not the full `Yard`, `AnimalManager`, or `ScoreUI` types
- `SpawnGenerator` uses `IAnimalSpawner` — a single-method interface
- `AnimalManager` uses `IPosition` — only `x` and `y`; does not depend on the full `Hero` class

### Dependency Inversion
High-level modules depend on abstractions:
- The game loop depends on `ITickable`, not on any concrete entity
- `SpawnGenerator` depends on `IAnimalSpawner`; `AnimalManager` satisfies this structurally
- `AnimalManager` depends on `IPosition`; `Hero` (a PixiJS `Container`) satisfies this structurally without an explicit `implements` declaration
