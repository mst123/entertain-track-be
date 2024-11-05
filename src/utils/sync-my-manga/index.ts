import { Container } from 'typedi';
import { myHttp } from '@/utils/http';
import { Manga, Fields, MangaListRequest, MangaBase } from '@/interfaces/mangas.interface';
import { MangaService } from '@/services/mangas.service';
import { logger } from '@utils/logger';
import { type MissingRanks, getMissingRanks } from '@/utils/sync-my-manga/computed-section';
import { getRecord, setRecord } from '@/utils/sync-my-manga/tools';

const LIMIT = 20;
const MAX_OFFSET = 5000;

const mangaService = Container.get(MangaService);

const fields: Fields[] = [
  'id',
  'title',
  'main_picture',
  'alternative_titles',
  'start_date',
  'synopsis',
  'mean',
  'rank',
  'popularity',
  'num_list_users',
  'num_scoring_users',
  'nsfw',
  'genres',
  'media_type',
  'status',
  'my_list_status',
  'num_volumes',
  'num_chapters',
  'pictures',
  'background',
  'related_manga',
  'related_manga',
  'recommendations',
  'statistics',
];

type RankingResult = {
  data: {
    node: Manga;
    ranking: {
      rank: number;
    };
  }[];
  paging: {
    next: string;
  };
};
export class MangaSpider {
  private offset: number;
  private startTime = Date.now();
  constructor() {
    this.start();
  }
  // 第一步 按顺序爬取数据
  public async start() {
    const latestOffset = (await getRecord('mangaOffset')) || 0;

    if (latestOffset < MAX_OFFSET) {
      // 按顺序爬取数据
      this.offset = latestOffset;
      this.getMangaInOrder();
    } else {
      // 差缺补漏阶段
      this.getMangaInMissing();
    }
  }

  private async stop(status: Boolean) {
    const endTime = Date.now();
    logger.info(`MyMangaList同步${status ? '成功' : '失败'}，耗时${(endTime - this.startTime) / 1000}秒`);
    // 退出程序
    process.exit(0);
  }
  private async getMangaInOrder() {
    try {
      while (this.offset < MAX_OFFSET) {
        const mangas = await this.getMangas(this.offset, LIMIT);
        await Promise.all(
          mangas.map(manga => {
            return this.createManga(manga);
          })
        );
        await setRecord('mangaOffset', this.offset);
        // 全部成功后在进行记录
        this.offset += LIMIT;
      }
      // 顺序爬取已经完成，重新启动
      this.start();
    } catch (error) {
      this.errHandle(error);
    }
  }
  // 第二步 补充失败的数据
  public async getMangaInMissing() {
    try {
      const missingRanks: MissingRanks = await getMissingRanks(MAX_OFFSET);
      if (missingRanks.length) {
        const curRanks = [...missingRanks];
        console.log(curRanks);

        while (curRanks.length) {
          const [offset, limit] = curRanks.shift();
          const mangas = await this.getMangas(offset - 1, limit);
          await Promise.all(
            mangas.map(manga => {
              return this.createManga(manga);
            })
          );
        }
      } else {
        return this.stop(true);
      }
      // 查缺补漏第N轮
      this.getMangaInMissing();
    } catch (error) {
      this.errHandle(error);
    }
  }
  // 共用获取动漫列表 自带3次错误尝试
  private getMangas(offset: number, limit: number, retryCount = 0) {
    return new Promise<MangaBase[]>((resolve, reject) => {
      myHttp
        .get<MangaListRequest, RankingResult>('/manga/ranking', {
          offset: offset,
          limit: limit,
          fields: fields.join(',') as `${Fields}`,
        })
        .then(res => {
          resolve(
            res.data.map(item => {
              return {
                ...item.node,
                offset,
              };
            })
          );
        })
        .catch(async error => {
          // logger.error(`
          //   在offset ${this.offset} 处出现-网络问题-, 问题如下：
          //     ${JSON.stringify(error, null, 2)}
          // `);
          if (retryCount >= 5) {
            reject(error);
          } else {
            await this.waitMoment(0.1 * retryCount);
            return await this.getMangas(offset, limit, retryCount + 1);
          }
        });
    });
  }

  private async createManga(manga) {
    // 几乎不会创建失败
    try {
      await mangaService.createOrUpdateManga(manga);
    } catch (error) {
      console.log('创建失败：', error);
      // 不让此类错误打断进程
      return Promise.resolve();
    }
  }
  private async waitMoment(min: number) {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, min * 1000 * 60);
    });
  }
  private errHandle(error) {
    logger.error(`
      在offset ${this.offset} 处出现问题, 问题如下：
        ${JSON.stringify(error, null, 2)}
    `);
    this.stop(false);
  }
}
