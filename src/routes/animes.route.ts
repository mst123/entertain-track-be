import { AnimeController } from '@controllers/animes.controller';
import { BaseRoute } from './base.route';

export class AnimeRoute extends BaseRoute {
  public anime = new AnimeController();

  constructor() {
    super('/animes');
    this.initializeRoutes();
  }

  protected initializeRoutes() {
    this.initializeCrudRoutes(this.anime);
    this.router.post(`${this.path}/findMissingAnime/:scope`, this.anime.findMissingAnime);
  }
}
