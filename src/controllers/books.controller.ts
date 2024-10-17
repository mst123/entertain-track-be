import { NextFunction, Request, Response } from 'express';
import { Book } from '@interfaces/books.interface';
import { BookService } from '@services/books.service';
import { BaseController } from './base.controller';

export class BookController extends BaseController<Book> {
  constructor() {
    super(BookService);
  }
  public getTags = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllTags: String[] = await this.service.getTags();
      res.status(200).json({ data: findAllTags, status: 'success', message: 'findAllTags' });
    } catch (error) {
      next(error);
    }
  };
}
