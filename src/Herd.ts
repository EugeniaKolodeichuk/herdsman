import { Point } from 'pixi.js';
import { Animal } from './Animal';
import { ANIMAL } from './constants';

export class Herd {
  private members: Animal[] = [];

  get size(): number {
    return this.members.length;
  }

  get isFull(): boolean {
    return this.members.length >= ANIMAL.maxGroupSize;
  }

  get animals(): readonly Animal[] {
    return this.members;
  }

  tryAdd(animal: Animal): boolean {
    if (this.isFull) return false;
    animal.startFollowing();
    this.members.push(animal);
    return true;
  }

  remove(animal: Animal): void {
    const index = this.members.indexOf(animal);
    if (index === -1) return;
    this.members.splice(index, 1);
    animal.stopFollowing();
  }

  update(heroX: number, heroY: number): void {
    const count = this.members.length;
    this.members.forEach((animal, index) => {
      const spread = count > 1 ? index / (count - 1) - 0.5 : 0;
      const angle = Math.PI + spread * (Math.PI / 3);
      const tx = heroX + Math.cos(angle) * ANIMAL.followDistance;
      const ty = heroY + Math.sin(angle) * ANIMAL.followDistance;
      animal.setFollowTarget(new Point(tx, ty));
    });
  }
}
