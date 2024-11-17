import { Game } from '@interfaces/games.interface';
import { GameService } from '@services/games.service';
import { NextFunction, Request, Response } from 'express';
import { BaseController } from './base.controller';
import { GameSpider } from '@/utils/sync-my-game';

export class GameController extends BaseController<Game> {
  constructor() {
    super(GameService);
  }
  public syncGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await new GameSpider().start();
      res.status(200).json({ status: 'success', message: 'sync complete' });
    } catch (error) {
      next(error);
    }
  };
}
