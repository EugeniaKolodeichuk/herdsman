import { Container } from 'pixi.js';
import { ITickable } from './ITickable';
import { Animal } from './Animal';
import { Herd } from './Herd';
import { ANIMAL } from './constants';

interface IPosition {
  readonly x: number;
  readonly y: number;
}

export class AnimalManager extends Container implements ITickable {
  private animals: Animal[] = [];
  private readonly herd: Herd;
  private readonly hero: IPosition;

  constructor(hero: IPosition) {
    super();
    this.hero = hero;
    this.herd = new Herd();
  }

  spawn(count: number, fieldWidth: number, fieldHeight: number): void {
    const margin = 50;
    for (let i = 0; i < count; i++) {
      const x = margin + Math.random() * (fieldWidth - margin * 2);
      const y = margin + Math.random() * (fieldHeight - margin * 2);
      const animal = new Animal(x, y);
      this.animals.push(animal);
      this.addChild(animal);
    }
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
