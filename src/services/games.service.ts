import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { Game, GameBase } from '@interfaces/games.interface';
import { GameModel } from '@models/games.model';

// 通过依赖注入的方式使用这个服务，而不需要手动实例化，使得类之间的耦合度更低
@Service()
export class GameService {
  public async findAllGame(query): Promise<Game[]> {
    const games: Game[] = await GameModel.find(query);
    return games;
  }

  public async findGameById(gameId: string): Promise<Game> {
    const findGame: Game = await GameModel.findOne({ _id: gameId });
    if (!findGame) throw new HttpException(409, "Game doesn't exist");
    return findGame;
  }

  public async createGame(gameData: GameBase): Promise<Game> {
    const createGameData: Game = await GameModel.create(gameData);
    return createGameData;
  }

  public async updateGame(gameId: string, gameData: GameBase): Promise<Game> {
    const updateGameById: Game = await GameModel.findByIdAndUpdate(gameId, { gameData });
    if (!updateGameById) throw new HttpException(409, "Game doesn't exist");
    return updateGameById;
  }

  public async deleteGame(gameId: string): Promise<Game> {
    const deleteGameById: Game = await GameModel.findByIdAndDelete(gameId);
    if (!deleteGameById) throw new HttpException(409, "Game doesn't exist");

    return deleteGameById;
  }
}
