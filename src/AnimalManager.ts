import { Container } from 'pixi.js';
import { ITickable } from './ITickable';
import { Animal } from './Animal';
import { Herd } from './Herd';
import { IZone } from './IZone';
import { ANIMAL, SPAWN } from './constants';

interface IPosition {
  readonly x: number;
  readonly y: number;
}

export class AnimalManager extends Container implements ITickable {
  private animals: Animal[] = [];
  private readonly herd: Herd;
  private readonly hero: IPosition;
  private readonly fieldWidth: number;
  private readonly fieldHeight: number;
  private readonly excludedZones: IZone[];

  constructor(hero: IPosition, fieldWidth: number, fieldHeight: number, excludedZones: IZone[] = []) {
    super();
    this.hero = hero;
    this.herd = new Herd();
    this.fieldWidth = fieldWidth;
    this.fieldHeight = fieldHeight;
    this.excludedZones = excludedZones;
  }

  spawn(count: number): void {
    for (let i = 0; i < count; i++) {
      const [x, y] = this.randomSafePosition();
      this.spawnAt(x, y);
    }
  }

  spawnAt(x: number, y: number): void {
    const animal = new Animal(x, y);
    animal.startPatrolling(this.fieldWidth, this.fieldHeight, this.excludedZones);
    this.animals.push(animal);
    this.addChild(animal);
  }

  randomSafePosition(): [number, number] {
    const maxAttempts = 20;
    for (let i = 0; i < maxAttempts; i++) {
      const x = SPAWN.margin + Math.random() * (this.fieldWidth - SPAWN.margin * 2);
      const y = SPAWN.margin + Math.random() * (this.fieldHeight - SPAWN.margin * 2);
      if (!this.excludedZones.some((zone) => zone.contains(x, y))) return [x, y];
    }
    return [SPAWN.margin, SPAWN.margin];
  }

  get herdMembers(): readonly Animal[] {
    return this.herd.animals;
  }

  removeFromHerd(animal: Animal): void {
    this.herd.remove(animal);
    this.removeChild(animal);
    this.animals = this.animals.filter((a) => a !== animal);
  }

  update(delta: number): void {
    const { x: hx, y: hy } = this.hero;

    for (const animal of this.animals) {
      if (animal.isFollowing || this.herd.isFull) continue;

      const dx = hx - animal.x;
      const dy = hy - animal.y;
      if (Math.sqrt(dx * dx + dy * dy) <= ANIMAL.detectionRadius) {
        this.herd.tryAdd(animal);
      }
    }

    this.herd.update(hx, hy);

    for (const animal of this.animals) {
      animal.update(delta);
    }
  }
}
