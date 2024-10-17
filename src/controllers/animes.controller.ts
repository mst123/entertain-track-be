import { NextFunction, Request, Response } from 'express';
import { Anime } from '@/interfaces/animes.interface';
import { BaseController } from './base.controller';
import { AnimeService } from '@/services/animes.service';

export class AnimeController extends BaseController<Anime> {
  constructor() {
    super(AnimeService);
  }

  public findMissingAnime = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = Number(req.params.scope) || 5000;
      const missRanks: number[] = await this.service.findMissingAnime(scope);
      res.status(200).json({ data: missRanks, status: 'success', message: 'findMissingAnime' });
    } catch (error) {
      next(error);
    }
  };
}
