import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Game } from '@interfaces/games.interface';
import { GameService } from '@services/games.service';

export class GameController {
  public game = Container.get(GameService);

  public getGames = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllGamesData: Game[] = await this.game.findAllGame(req.params);

      res.status(200).json({ data: findAllGamesData, status: 'success', message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getGameById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameId: string = req.params.id;
      const findOneGameData: Game = await this.game.findGameById(gameId);

      res.status(200).json({ data: findOneGameData, status: 'success', message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameData: Game = req.body;
      const createGameData: Game = await this.game.createGame(gameData);

      res.status(201).json({ data: createGameData, status: 'success', message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameId: string = req.params.id;
      const gameData: Game = req.body;
      const updateGameData: Game = await this.game.updateGame(gameId, gameData);

      res.status(200).json({ data: updateGameData, status: 'success', message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameId: string = req.params.id;
      const deleteGameData: Game = await this.game.deleteGame(gameId);

      res.status(200).json({ data: deleteGameData, status: 'success', message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
