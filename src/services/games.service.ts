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
  public async findAll(): Promise<Game[]> {
    const pipeline = [
      {
        $sort: {
          playtime_forever: -1 as -1, // 显式地指定为-1
        },
      },
    ];
    return await GameModel.aggregate(pipeline);
  }
}
