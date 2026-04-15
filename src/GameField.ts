import { Container, Graphics } from 'pixi.js';

export class GameField extends Container {
  constructor(width: number, height: number) {
    super();

    const bg = new Graphics();
    bg.rect(0, 0, width, height).fill(0x486f38);

    this.addChild(bg);
  }
}
