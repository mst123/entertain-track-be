import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Anime } from '@/interfaces/animes.interface';
import { AnimeService } from '@/services/animes.service';

export class AnimeController {
  public anime = Container.get(AnimeService);

  public getAnimes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllAnimesData: Anime[] = await this.anime.findAllAnime();

      res.status(200).json({ data: findAllAnimesData, status: 'success', message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getAnimeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const animeId: string = req.params.id;
      const findOneAnimeData: Anime = await this.anime.findAnimeById(animeId);

      res.status(200).json({ data: findOneAnimeData, status: 'success', message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createAnime = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const animeData: Anime = req.body;
      const createAnimeData: Anime = await this.anime.createAnime(animeData);

      res.status(201).json({ data: createAnimeData, status: 'success', message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateAnime = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const animeId: string = req.params.id;
      const animeData: Anime = req.body;
      const updateAnimeData: Anime = await this.anime.updateAnime(animeId, animeData);

      res.status(200).json({ data: updateAnimeData, status: 'success', message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteAnime = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const animeId: string = req.params.id;
      const deleteAnimeData: Anime = await this.anime.deleteAnime(animeId);

      res.status(200).json({ data: deleteAnimeData, status: 'success', message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public findMissingAnime = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const missRanks: number[] = await this.anime.findMissingAnime();
      res.status(200).json({ data: missRanks, status: 'success', message: 'findMissingAnime' });
    } catch (error) {
      next(error);
    }
  };
}
