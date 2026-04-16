import { Container, Graphics, Point } from 'pixi.js';
import { ITickable } from './ITickable';
import { HERO } from './constants';

export class Hero extends Container implements ITickable {
  private target: Point | null = null;

  constructor() {
    super();

    const circle = new Graphics();
    circle.circle(0, 0, HERO.radius).fill(0xe74c3c);
    this.addChild(circle);

    this.position.set(HERO.startX, HERO.startY);
  }

  setTarget(point: Point): void {
    this.target = point.clone();
  }

  update(delta: number): void {
    if (!this.target) return;

    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= HERO.stopDistance) {
      this.target = null;
      return;
    }

    const step = HERO.speed * delta;
    this.x += (dx / distance) * step;
    this.y += (dy / distance) * step;
  }
}
