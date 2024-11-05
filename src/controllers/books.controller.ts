import { NextFunction, Request, Response } from 'express';
import { Book } from '@interfaces/books.interface';
import { BookService } from '@services/books.service';
import { BaseController } from './base.controller';

export class BookController extends BaseController<Book> {
  constructor() {
    super(BookService);
  }
  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: Book[] = await this.service.findAll(req.body);
      res.status(200).json({ data, status: 'success', message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };
  public getTags = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllTags: String[] = await this.service.getTags();
      res.status(200).json({ data: findAllTags, status: 'success', message: 'findAllTags' });
    } catch (error) {
      next(error);
    }
  };
}
