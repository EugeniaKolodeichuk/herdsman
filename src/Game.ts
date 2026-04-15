import { Application, Ticker } from 'pixi.js';
import { GAME_WIDTH, GAME_HEIGHT, YARD } from './constants';
import { GameField } from './GameField';
import { Yard } from './Yard';
import { ScoreUI } from './ScoreUI';

export class Game {
  private app: Application;

  yard!: Yard;
  scoreUI!: ScoreUI;

  constructor() {
    this.app = new Application();
  }

  async init(): Promise<void> {
    await this.app.init({
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: 0x000000,
      antialias: true,
    });

    document.getElementById('pixi-container')!.appendChild(this.app.canvas);

    this.setup();
  }

  private setup(): void {
    const field = new GameField(GAME_WIDTH, GAME_HEIGHT);
    this.yard = new Yard(YARD.x, YARD.y, YARD.width, YARD.height);
    this.scoreUI = new ScoreUI();

    this.app.stage.addChild(field);
    this.app.stage.addChild(this.yard);
    this.app.stage.addChild(this.scoreUI);
  }

  get stage() {
    return this.app.stage;
  }

  get ticker(): Ticker {
    return this.app.ticker;
  }

  get screen() {
    return this.app.screen;
  }
}
