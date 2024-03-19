import { Router } from 'express';
import { AnimeController } from '@controllers/animes.controller';
import { Routes } from '@interfaces/routes.interface';

export class AnimeRoute implements Routes {
  public path = '/animes';
  public router = Router();
  public anime = new AnimeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.anime.getAnimes);
    this.router.get(`${this.path}/:id`, this.anime.getAnimeById);
    this.router.post(`${this.path}`, this.anime.createAnime);
    this.router.put(`${this.path}/:id`, this.anime.updateAnime);
    this.router.delete(`${this.path}/:id`, this.anime.deleteAnime);
  }
}
