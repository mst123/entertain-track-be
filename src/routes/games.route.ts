import { Router, type Router as ExpressRouter } from 'express';
import { GameController } from '@controllers/games.controller';
import { Routes } from '@interfaces/routes.interface';

export class GameRoute implements Routes {
  public path = '/games';
  public router: ExpressRouter = Router();
  public game = new GameController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.game.getGames);
    this.router.get(`${this.path}/:id`, this.game.getGameById);
    this.router.post(`${this.path}`, this.game.createGame);
    this.router.put(`${this.path}/:id`, this.game.updateGame);
    this.router.delete(`${this.path}/:id`, this.game.deleteGame);
  }
}
