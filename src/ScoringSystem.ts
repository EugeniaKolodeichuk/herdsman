import { Rectangle } from 'pixi.js';
import { ITickable } from './ITickable';
import { Animal } from './Animal';

interface IYardArea {
  readonly bounds: Rectangle;
}

interface IAnimalGroup {
  readonly herdMembers: readonly Animal[];
  removeFromHerd(animal: Animal): void;
}

interface IScoreCounter {
  increment(): void;
}

export class ScoringSystem implements ITickable {
  private readonly yard: IYardArea;
  private readonly animalGroup: IAnimalGroup;
  private readonly scoreCounter: IScoreCounter;

  constructor(yard: IYardArea, animalGroup: IAnimalGroup, scoreCounter: IScoreCounter) {
    this.yard = yard;
    this.animalGroup = animalGroup;
    this.scoreCounter = scoreCounter;
  }

  update(_delta: number): void {
    const scored = this.animalGroup.herdMembers.filter((animal) => this.yard.bounds.contains(animal.x, animal.y));

    for (const animal of scored) {
      this.animalGroup.removeFromHerd(animal);
      this.scoreCounter.increment();
    }
  }
}
