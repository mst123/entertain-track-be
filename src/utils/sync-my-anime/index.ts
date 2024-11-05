import { Container } from 'typedi';
import { myHttp } from '@/utils/http';
import { Anime, Fields, AnimeListRequest, AnimeBase } from '@/interfaces/animes.interface';
import { AnimeService } from '@/services/animes.service';
import { logger } from '@utils/logger';
import { type MissingRanks, getMissingRanks } from '@/utils/sync-my-anime/computed-section';
import { getRecord, setRecord } from '@/utils/sync-my-anime/tools';

const LIMIT = 20;
const MAX_OFFSET = 5000;

const animeService = Container.get(AnimeService);

const fields: Fields[] = [
  'id',
  'title',
  'main_picture',
  'alternative_titles',
  'synonyms_or_iso639_1',
  'start_date',
  'end_date',
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
  'num_episodes',
  'start_season',
  'broadcast',
  'source',
  'average_episode_duration',
  'rating',
  'studios',
  'pictures',
  'background',
  'related_anime',
  'related_manga',
  'recommendations',
  'statistics',
];

type RankingResult = {
  data: {
    node: Anime;
    ranking: {
      rank: number;
    };
  }[];
  paging: {
    next: string;
  };
};
export class AnimeSpider {
  private offset: number;
  private startTime = Date.now();
  constructor() {
    this.start();
  }
  // 第一步 按顺序爬取数据
  public async start() {
    const latestOffset = (await getRecord('animeOffset')) || 0;

    if (latestOffset < MAX_OFFSET) {
      // 按顺序爬取数据
      this.offset = latestOffset;
      this.getAnimeInOrder();
    } else {
      // 差缺补漏阶段
      this.getAnimeInMissing();
    }
  }

  private async stop(status: Boolean) {
    const endTime = Date.now();
    logger.info(`MyAnimeList同步${status ? '成功' : '失败'}，耗时${(endTime - this.startTime) / 1000}秒`);
    // 退出程序
    process.exit(0);
  }
  private async getAnimeInOrder() {
    try {
      while (this.offset < MAX_OFFSET) {
        const animes = await this.getAnimes(this.offset, LIMIT);
        await Promise.all(
          animes.map(anime => {
            return this.createAnime(anime);
          })
        );
        await setRecord('animeOffset', this.offset);
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
  public async getAnimeInMissing() {
    try {
      const missingRanks: MissingRanks = await getMissingRanks(MAX_OFFSET);
      if (missingRanks.length) {
        const curRanks = [...missingRanks];
        console.log(curRanks);

        while (curRanks.length) {
          const [offset, limit] = curRanks.shift();
          const animes = await this.getAnimes(offset - 1, limit);
          await Promise.all(
            animes.map(anime => {
              return this.createAnime(anime);
            })
          );
        }
      } else {
        return this.stop(true);
      }
      // 查缺补漏第N轮
      this.getAnimeInMissing();
    } catch (error) {
      this.errHandle(error);
    }
  }
  // 共用获取动漫列表 自带3次错误尝试
  private getAnimes(offset: number, limit: number, retryCount = 0) {
    return new Promise<AnimeBase[]>((resolve, reject) => {
      myHttp
        .get<AnimeListRequest, RankingResult>('/anime/ranking', {
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
            return await this.getAnimes(offset, limit, retryCount + 1);
          }
        });
    });
  }

  private async createAnime(anime) {
    // 几乎不会创建失败
    try {
      await animeService.createOrUpdateAnime(anime);
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
