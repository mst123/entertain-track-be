import { Router, type Router as ExpressRouter } from 'express';
import { BookController } from '@controllers/books.controller';
import { Routes } from '@interfaces/routes.interface';

export class BookRoute implements Routes {
  public path = '/books';
  public router: ExpressRouter = Router();
  public book = new BookController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.book.getBooks);
    this.router.get(`${this.path}/:id`, this.book.getBookById);
    this.router.post(`${this.path}`, this.book.createBook);
    this.router.put(`${this.path}/:id`, this.book.updateBook);
    this.router.delete(`${this.path}/:id`, this.book.deleteBook);
  }
}
