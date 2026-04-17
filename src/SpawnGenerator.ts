import { SPAWN } from './constants';

interface IAnimalSpawner {
  spawnAt(x: number, y: number): void;
  randomSafePosition(): [number, number];
}

export class SpawnGenerator {
  private readonly spawner: IAnimalSpawner;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(spawner: IAnimalSpawner) {
    this.spawner = spawner;
  }

  start(): void {
    this.scheduleNext();
  }

  stop(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  private scheduleNext(): void {
    const delay = SPAWN.minDelay + Math.random() * (SPAWN.maxDelay - SPAWN.minDelay);
    this.timeoutId = setTimeout(() => {
      this.spawnRandom();
      this.scheduleNext();
    }, delay);
  }

  private spawnRandom(): void {
    const [x, y] = this.spawner.randomSafePosition();
    this.spawner.spawnAt(x, y);
  }
}
