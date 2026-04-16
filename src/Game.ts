import { Application, Ticker } from 'pixi.js';
import { ANIMAL, GAME_WIDTH, GAME_HEIGHT, YARD } from './constants';
import { GameField } from './GameField';
import { Yard } from './Yard';
import { ScoreUI } from './ScoreUI';
import { Hero } from './Hero';
import { AnimalManager } from './AnimalManager';
import { ITickable } from './ITickable';

export class Game {
  private app: Application;
  private entities: ITickable[] = [];

  private _yard!: Yard;
  private _scoreUI!: ScoreUI;
  private _animalManager!: AnimalManager;

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
    this.startLoop();
  }

  private setup(): void {
    const field = new GameField(GAME_WIDTH, GAME_HEIGHT);
    this._yard = new Yard(YARD.x, YARD.y, YARD.width, YARD.height);
    this._scoreUI = new ScoreUI();
    const hero = new Hero();

    const animalCount =
      ANIMAL.minCount + Math.floor(Math.random() * (ANIMAL.maxCount - ANIMAL.minCount + 1));
    this._animalManager = new AnimalManager(hero);
    this._animalManager.spawn(animalCount, GAME_WIDTH, GAME_HEIGHT);

    this.app.stage.eventMode = 'static';
    this.app.stage.hitArea = this.app.screen;
    this.app.stage.on('pointerdown', (e) => hero.setTarget(e.global));

    this.app.stage.addChild(field);
    this.app.stage.addChild(this._yard);
    this.app.stage.addChild(this._animalManager);
    this.app.stage.addChild(hero);
    this.app.stage.addChild(this._scoreUI);

    this.registerEntity(this._animalManager);
    this.registerEntity(hero);
  }

  private registerEntity(entity: ITickable): void {
    this.entities.push(entity);
  }

  private startLoop(): void {
    this.app.ticker.add((ticker: Ticker) => {
      for (const entity of this.entities) {
        entity.update(ticker.deltaTime);
      }
    });
  }

  get yard(): Yard {
    return this._yard;
  }

  get scoreUI(): ScoreUI {
    return this._scoreUI;
  }

  get animalManager(): AnimalManager {
    return this._animalManager;
  }

  get screen() {
    return this.app.screen;
  }
}
