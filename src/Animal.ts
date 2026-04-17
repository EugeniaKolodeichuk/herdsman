import { Container, Graphics, Point } from 'pixi.js';
import { ITickable } from './ITickable';
import { IZone } from './IZone';
import { ANIMAL } from './constants';

export enum AnimalState {
  Inactive = 'inactive',
  Patrol = 'patrol',
  Following = 'following',
}

export class Animal extends Container implements ITickable {
  private _state: AnimalState = AnimalState.Inactive;
  private followTarget: Point | null = null;
  private patrolTarget: Point | null = null;
  private fieldWidth = 0;
  private fieldHeight = 0;
  private excludedZones: IZone[] = [];

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

  startPatrolling(fieldWidth: number, fieldHeight: number, excludedZones: IZone[] = []): void {
    this._state = AnimalState.Patrol;
    this.fieldWidth = fieldWidth;
    this.fieldHeight = fieldHeight;
    this.excludedZones = excludedZones;
    this.pickNextWaypoint();
  }

  startFollowing(): void {
    this._state = AnimalState.Following;
    this.patrolTarget = null;
  }

  stopFollowing(): void {
    this._state = AnimalState.Inactive;
    this.followTarget = null;
  }

  setFollowTarget(point: Point): void {
    this.followTarget = point.clone();
  }

  update(delta: number): void {
    switch (this._state) {
      case AnimalState.Following:
        this.moveToward(this.followTarget, ANIMAL.speed, delta);
        break;

      case AnimalState.Patrol:
        if (!this.patrolTarget || this.hasReached(this.patrolTarget, ANIMAL.patrolStopDistance)) {
          this.pickNextWaypoint();
        }
        if (this.patrolTarget && this.nextStepEntersZone(this.patrolTarget, ANIMAL.patrolSpeed, delta)) {
          this.pickNextWaypoint();
        } else {
          this.moveToward(this.patrolTarget, ANIMAL.patrolSpeed, delta);
        }
        break;

      case AnimalState.Inactive:
        break;
    }
  }

  private pickNextWaypoint(): void {
    const maxAttempts = 10;

    for (let i = 0; i < maxAttempts; i++) {
      const candidate = new Point(
        ANIMAL.patrolMargin + Math.random() * (this.fieldWidth - ANIMAL.patrolMargin * 2),
        ANIMAL.patrolMargin + Math.random() * (this.fieldHeight - ANIMAL.patrolMargin * 2),
      );

      if (!this.excludedZones.some((zone) => zone.contains(candidate.x, candidate.y))) {
        this.patrolTarget = candidate;
        return;
      }
    }
  }

  private moveToward(target: Point | null, speed: number, delta: number): void {
    if (!target) return;

    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= ANIMAL.stopDistance) return;

    const step = speed * delta;
    this.x += (dx / distance) * step;
    this.y += (dy / distance) * step;
  }

  private nextStepEntersZone(target: Point, speed: number, delta: number): boolean {
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance <= ANIMAL.stopDistance) return false;
    const step = speed * delta;
    const nextX = this.x + (dx / distance) * step;
    const nextY = this.y + (dy / distance) * step;
    return this.excludedZones.some((zone) => zone.contains(nextX, nextY));
  }

  private hasReached(target: Point, threshold: number): boolean {
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    return Math.sqrt(dx * dx + dy * dy) <= threshold;
  }
}
