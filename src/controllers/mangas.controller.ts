import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Manga } from '@/interfaces/mangas.interface';
import { MangaService } from '@/services/mangas.service';

export class MangaController {
  public manga = Container.get(MangaService);

  public getMangas = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllMangasData: Manga[] = await this.manga.findAllManga();

      res.status(200).json({ data: findAllMangasData, status: 'success', message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getMangaById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mangaId: string = req.params.id;
      const findOneMangaData: Manga = await this.manga.findMangaById(mangaId);

      res.status(200).json({ data: findOneMangaData, status: 'success', message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createManga = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mangaData: Manga = req.body;
      const createMangaData: Manga = await this.manga.createManga(mangaData);

      res.status(201).json({ data: createMangaData, status: 'success', message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateManga = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mangaId: string = req.params.id;
      const mangaData: Manga = req.body;
      const updateMangaData: Manga = await this.manga.updateManga(mangaId, mangaData);

      res.status(200).json({ data: updateMangaData, status: 'success', message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteManga = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mangaId: string = req.params.id;
      const deleteMangaData: Manga = await this.manga.deleteManga(mangaId);

      res.status(200).json({ data: deleteMangaData, status: 'success', message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public findMissingManga = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = Number(req.params.scope) || 5000;
      const missRanks: number[] = await this.manga.findMissingManga(scope);
      res.status(200).json({ data: missRanks, status: 'success', message: 'findMissingManga' });
    } catch (error) {
      next(error);
    }
  };
}
