import { Container } from 'typedi';
import { steamHttp } from '@/utils/http';
import { GameBase } from '@/interfaces/games.interface';
import { GameService } from '@/services/games.service';
import { STEAM_ID, STEAM_KEY } from '@/config/index';
const gameService = Container.get(GameService);
interface OwnGamesResponse {
  response: {
    game_count: number;
    games: Array<GameBase>;
  };
}

interface OwnGamesReq {
  key: string;
  steamid: string;
  include_appinfo: boolean;
  include_played_free_games: boolean;
  format: string;
  language: string;
}
export class GameSpider {
  constructor() {
    this.start();
  }
  // 第一步 按顺序爬取数据
  public async start() {
    this.getGame();
  }

  // 游戏列表
  private getGame() {
    steamHttp
      .get<OwnGamesReq, OwnGamesResponse>('/IPlayerService/GetOwnedGames/v0001/', {
        key: STEAM_KEY,
        steamid: STEAM_ID,
        format: 'json',
        include_appinfo: true,
        include_played_free_games: true,
        language: 'zh',
      })
      .then(res => {
        res.response.games.forEach(game => {
          this.createGame(game);
        });
      })
      .catch(async error => {
        console.log(error);
      });
  }

  private async createGame(game) {
    // 几乎不会创建失败
    try {
      await gameService.createGame(game);
    } catch (error) {
      console.log('创建失败：', error);
    }
  }
}
