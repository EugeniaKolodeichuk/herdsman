import { Container, Graphics, Point } from 'pixi.js';
import { ITickable } from './ITickable';
import { ANIMAL } from './constants';

export enum AnimalState {
  Inactive = 'inactive',
  Following = 'following',
}

export class Animal extends Container implements ITickable {
  private _state: AnimalState = AnimalState.Inactive;
  private followTarget: Point | null = null;

  constructor(x: number, y: number) {
    super();

    const circle = new Graphics();
    circle.circle(0, 0, ANIMAL.radius).fill(0xffffff).stroke({ width: 1.5, color: 0x999999 });
    this.addChild(circle);

    this.position.set(x, y);
  }

  get isFollowing(): boolean {
    return this._state === AnimalState.Following;
  }

  startFollowing(): void {
    this._state = AnimalState.Following;
  }

  stopFollowing(): void {
    this._state = AnimalState.Inactive;
    this.followTarget = null;
  }

  setFollowTarget(point: Point): void {
    this.followTarget = point.clone();
  }

  update(delta: number): void {
    if (!this.isFollowing || !this.followTarget) return;

    const dx = this.followTarget.x - this.x;
    const dy = this.followTarget.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= ANIMAL.stopDistance) return;

    const step = ANIMAL.speed * delta;
    this.x += (dx / distance) * step;
    this.y += (dy / distance) * step;
  }
}
