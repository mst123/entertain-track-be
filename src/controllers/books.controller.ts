import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Book } from '@interfaces/books.interface';
import { BookService } from '@services/books.service';

export class BookController {
  public book = Container.get(BookService);

  public getBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllBooksData: Book[] = await this.book.findAllBook(req.params);

      res.status(200).json({ data: findAllBooksData, status: 'success', message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getBookById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookId: string = req.params.id;
      const findOneBookData: Book = await this.book.findBookById(bookId);

      res.status(200).json({ data: findOneBookData, status: 'success', message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookData: Book = req.body;
      const createBookData: Book = await this.book.createBook(bookData);

      res.status(201).json({ data: createBookData, status: 'success', message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookId: string = req.params.id;
      const bookData: Book = req.body;
      const updateBookData: Book = await this.book.updateBook(bookId, bookData);

      res.status(200).json({ data: updateBookData, status: 'success', message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookId: string = req.params.id;
      const deleteBookData: Book = await this.book.deleteBook(bookId);

      res.status(200).json({ data: deleteBookData, status: 'success', message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
