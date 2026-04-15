import { Container, Graphics, Rectangle } from 'pixi.js';

export class Yard extends Container {
  readonly bounds: Rectangle;

  constructor(x: number, y: number, width: number, height: number) {
    super();

    this.bounds = new Rectangle(x, y, width, height);

    const rect = new Graphics();
    rect
      .rect(0, 0, width, height)
      .fill({ color: 0xe4c02e, alpha: 0.75 })
      .rect(0, 0, width, height)
      .stroke({ width: 3, color: 0xe4c02e });

    this.position.set(x, y);
    this.addChild(rect);
  }
}
