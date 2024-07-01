import { Router, type Router as ExpressRouter } from 'express';
import { MangaController } from '@controllers/mangas.controller';
import { Routes } from '@interfaces/routes.interface';

export class MangaRoute implements Routes {
  public path = '/mangas';
  public router: ExpressRouter = Router();
  public manga = new MangaController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.manga.getMangas);
    this.router.get(`${this.path}/:id`, this.manga.getMangaById);
    this.router.post(`${this.path}`, this.manga.createManga);
    this.router.put(`${this.path}/:id`, this.manga.updateManga);
    this.router.delete(`${this.path}/:id`, this.manga.deleteManga);

    this.router.post(`${this.path}/findMissingManga/:scope`, this.manga.findMissingManga);
  }
}
