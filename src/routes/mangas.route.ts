import { MangaController } from '@controllers/mangas.controller';
import { BaseRoute } from './base.route';

export class MangaRoute extends BaseRoute {
  public manga = new MangaController();
  constructor() {
    super('/mangas');
    this.initializeRoutes();
  }

  protected initializeRoutes() {
    this.initializeCrudRoutes(this.manga);
    this.router.post(`${this.path}/findMissingManga/:scope`, this.manga.findMissingManga);
  }
}
