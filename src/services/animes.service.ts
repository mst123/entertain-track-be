import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { Anime } from '@interfaces/animes.interface';
import { AnimeModel } from '@models/animes.model';

// 通过依赖注入的方式使用这个服务，而不需要手动实例化
@Service()
export class AnimeService {
  public async findAllAnime(): Promise<Anime[]> {
    const animes: Anime[] = await AnimeModel.find();
    return animes;
  }

  public async findAnimeById(animeId: string): Promise<Anime> {
    const findAnime: Anime = await AnimeModel.findOne({ _id: animeId });
    if (!findAnime) throw new HttpException(409, "Anime doesn't exist");

    return findAnime;
  }

  public async createAnime(animeData: Anime): Promise<Anime> {
    const createAnimeData: Anime = await AnimeModel.create(animeData);
    return createAnimeData;
  }

  public async updateAnime(animeId: string, animeData: Anime): Promise<Anime> {
    const updateAnimeById: Anime = await AnimeModel.findByIdAndUpdate(animeId, { animeData });
    if (!updateAnimeById) throw new HttpException(409, "Anime doesn't exist");
    return updateAnimeById;
  }

  public async deleteAnime(animeId: string): Promise<Anime> {
    const deleteAnimeById: Anime = await AnimeModel.findByIdAndDelete(animeId);
    if (!deleteAnimeById) throw new HttpException(409, "Anime doesn't exist");

    return deleteAnimeById;
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
      console.log('创建一条');
      return createAnimeData;
    } else {
      // 更新已存在的文档
      let updatedAnime: Anime = null;
      if (findAnime.rank !== animeData.rank) {
        findAnime.rank = animeData.rank;
        updatedAnime = await findAnime.save();
        console.log('更新一条');
      }
      return updatedAnime;
    }
  }
}
