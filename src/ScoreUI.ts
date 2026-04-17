import { Container, Text } from 'pixi.js';

export class ScoreUI extends Container {
  private scoreText: Text;
  private score = 0;

  constructor() {
    super();

    this.scoreText = new Text({
      text: 'Score: 0',
      style: {
        fontSize: 24,
        fill: '#ffffff',
        fontWeight: 'bold',
      },
    });

    this.scoreText.position.set(0, 16);
    this.addChild(this.scoreText);
  }

  increment(): void {
    this.score++;
    this.scoreText.text = `Score: ${this.score}`;
  }

  get value(): number {
    return this.score;
  }
}
