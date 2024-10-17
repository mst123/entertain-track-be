import { NextFunction, Request, Response } from 'express';
import { Manga } from '@/interfaces/mangas.interface';
import { MangaService } from '@/services/mangas.service';
import { BaseController } from './base.controller';

export class MangaController extends BaseController<Manga> {
  constructor() {
    super(MangaService);
  }

  public findMissingManga = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = Number(req.params.scope) || 5000;
      const missRanks: number[] = await this.service.findMissingManga(scope);
      res.status(200).json({ data: missRanks, status: 'success', message: 'findMissingManga' });
    } catch (error) {
      next(error);
    }
  };
}
