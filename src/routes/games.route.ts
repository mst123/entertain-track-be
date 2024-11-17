import { GameController } from '@controllers/games.controller';
import { BaseRoute } from './base.route';

export class GameRoute extends BaseRoute {
  public game = new GameController();

  constructor() {
    super('/games');
    this.initializeRoutes();
  }

  protected initializeRoutes() {
    // 同步游戏数据
    this.router.get(`${this.path}/sync`, this.game.syncGame);
    this.initializeCrudRoutes(this.game);
  }
}
