import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { Manga } from '@interfaces/mangas.interface';
import { MangaModel } from '@models/mangas.model';

// 通过依赖注入的方式使用这个服务，而不需要手动实例化
@Service()
export class MangaService {
  public async findAllManga(): Promise<Manga[]> {
    const mangas: Manga[] = await MangaModel.find();
    return mangas;
  }

  public async findMangaById(mangaId: string): Promise<Manga> {
    const findManga: Manga = await MangaModel.findOne({ _id: mangaId });
    if (!findManga) throw new HttpException(409, "Manga doesn't exist");

    return findManga;
  }

  public async createManga(mangaData: Manga): Promise<Manga> {
    const createMangaData: Manga = await MangaModel.create(mangaData);
    return createMangaData;
  }

  public async updateManga(mangaId: string, mangaData: Manga): Promise<Manga> {
    const updateMangaById: Manga = await MangaModel.findByIdAndUpdate(mangaId, { mangaData });
    if (!updateMangaById) throw new HttpException(409, "Manga doesn't exist");
    return updateMangaById;
  }

  public async deleteManga(mangaId: string): Promise<Manga> {
    const deleteMangaById: Manga = await MangaModel.findByIdAndDelete(mangaId);
    if (!deleteMangaById) throw new HttpException(409, "Manga doesn't exist");

    return deleteMangaById;
  }

  public async findMissingManga(scope: number): Promise<number[]> {
    const missingRanks = await MangaModel.aggregate([
      { $group: { _id: null, ranks: { $push: '$rank' } } },
      { $project: { _id: 0, missingRanks: { $setDifference: [{ $range: [1, scope + 1] }, '$ranks'] } } },
    ]);
    return missingRanks[0].missingRanks;
  }

  // 因为manga rank经常更新 所以遇到重复的manga 直接更新ranks
  public async createOrUpdateManga(mangaData: Manga): Promise<Manga> {
    const findManga: Manga = await MangaModel.findOne({ id: mangaData.id });
    if (!findManga) {
      const createMangaData: Manga = await MangaModel.create(mangaData);
      console.log('创建一条');
      return createMangaData;
    } else {
      // 更新已存在的文档
      let updatedManga: Manga = null;
      if (findManga.rank !== mangaData.rank) {
        findManga.rank = mangaData.rank;
        updatedManga = await findManga.save();
        console.log('更新一条');
      }
      return updatedManga;
    }
  }
}
