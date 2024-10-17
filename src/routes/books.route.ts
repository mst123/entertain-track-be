import { BookController } from '@controllers/books.controller';
import { BaseRoute } from './base.route';

export class BookRoute extends BaseRoute {
  public book = new BookController();

  constructor() {
    super('/books');
    this.initializeRoutes();
  }

  protected initializeRoutes() {
    // tags需要放在前边，优先匹配
    this.router.get(`${this.path}/tags`, this.book.getTags);
    this.initializeCrudRoutes(this.book);
  }
}
