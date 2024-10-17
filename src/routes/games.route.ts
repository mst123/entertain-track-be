import { GameController } from '@controllers/games.controller';
import { BaseRoute } from './base.route';
export class GameRoute extends BaseRoute {
  public game = new GameController();

  constructor() {
    super('/games');
    this.initializeRoutes();
  }

  protected initializeRoutes() {
    this.initializeCrudRoutes(this.game);
  }
}
