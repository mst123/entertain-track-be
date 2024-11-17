import { Menu } from '@interfaces/menus.interface';
import { MenuService } from '@services/menus.service';
import { BaseController } from './base.controller';
import { NextFunction, Request, Response } from 'express';

export class MenuController extends BaseController<Menu> {
  constructor() {
    super(MenuService);
  }
  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: Menu[] = await this.service.findAll(req.body);
      res.status(200).json({ data, status: 'success', message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };
  public getMaterials = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: string[] = await this.service.getMaterials();
      res.status(200).json({ data, status: 'success', message: 'getMaterials' });
    } catch (error) {
      next(error);
    }
  };
}
