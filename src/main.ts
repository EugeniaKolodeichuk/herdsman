import { Game } from './Game';

async function main(): Promise<void> {
  const game = new Game();
  await game.init();
}

main();
