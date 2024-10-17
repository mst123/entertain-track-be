import { Service } from 'typedi';
import { Anime, AnimeBase } from '@interfaces/animes.interface';
import { AnimeModel } from '@models/animes.model';
import { BaseService } from './base.service';
// 通过依赖注入的方式使用这个服务，而不需要手动实例化
@Service()
export class AnimeService extends BaseService<Anime, AnimeBase> {
  constructor() {
    super(AnimeModel);
  }
  public async findMissingAnime(scope: number): Promise<number[]> {
    const missingRanks = await AnimeModel.aggregate([
      { $group: { _id: null, ranks: { $push: '$rank' } } },
      { $project: { _id: 0, missingRanks: { $setDifference: [{ $range: [1, scope + 1] }, '$ranks'] } } },
    ]);
    return missingRanks[0].missingRanks;
  }

  // 因为anime rank经常更新 所以遇到重复的anime 直接更新ranks
  public async createOrUpdateAnime(animeData: Anime): Promise<Anime> {
    const findAnime: Anime = await AnimeModel.findOne({ id: animeData.id });
    if (!findAnime) {
      const createAnimeData: Anime = await AnimeModel.create(animeData);
      return createAnimeData;
    } else {
      // 更新已存在的文档
      let updatedAnime: Anime = null;
      if (findAnime.rank !== animeData.rank) {
        findAnime.rank = animeData.rank;
        updatedAnime = await findAnime.save();
      }
      return updatedAnime;
    }
  }
}
