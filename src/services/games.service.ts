import { Service } from 'typedi';
import { Game, GameBase } from '@interfaces/games.interface';
import { GameModel } from '@models/games.model';
import { BaseService } from './base.service';
// 通过依赖注入的方式使用这个服务，而不需要手动实例化，使得类之间的耦合度更低
@Service()
export class GameService extends BaseService<Game, GameBase> {
  constructor() {
    super(GameModel);
  }
  public async findAll(query): Promise<Game[]> {
    const games = await GameModel.find(query);
    return games.sort((a, b) => b.playtime_forever - a.playtime_forever);
  }
}
