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

  public async findMissingAnime(): Promise<number[]> {
    // const animes: Anime[] = await AnimeModel.find();
    // 创建一个包含所有存在的 rank 值的 Set
    // const existingRanks = new Set(animes.map(anime => anime.rank));

    // // 创建一个包含所有期望的 rank 值的 Set
    // const expectedRanks = new Set(Array.from({ length: 10000 }, (_, i) => i + 1));

    // // 计算缺失的 rank
    // const missingRanks = [...expectedRanks].filter(rank => !existingRanks.has(rank));

    const missingRanks = await AnimeModel.aggregate([
      { $group: { _id: null, ranks: { $push: '$rank' } } },
      { $project: { _id: 0, missingRanks: { $setDifference: [{ $range: [1, 10001] }, '$ranks'] } } },
    ]);
    return missingRanks[0].missingRanks;
  }
}
