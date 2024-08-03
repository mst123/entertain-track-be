import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { Book, BookBase } from '@interfaces/books.interface';
import { BookModel } from '@models/books.model';

// 通过依赖注入的方式使用这个服务，而不需要手动实例化，使得类之间的耦合度更低
@Service()
export class BookService {
  public async findAllBook(query): Promise<Book[]> {
    const books: Book[] = await BookModel.find(query);
    return books;
  }

  public async findBookById(bookId: string): Promise<Book> {
    const findBook: Book = await BookModel.findOne({ _id: bookId });
    if (!findBook) throw new HttpException(409, "Book doesn't exist");
    return findBook;
  }

  public async createBook(bookData: BookBase): Promise<Book> {
    const createBookData: Book = await BookModel.create(bookData);
    return createBookData;
  }

  public async updateBook(bookId: string, bookData: BookBase): Promise<Book> {
    const updateBookById: Book = await BookModel.findByIdAndUpdate(bookId, { bookData });
    if (!updateBookById) throw new HttpException(409, "Book doesn't exist");
    return updateBookById;
  }

  public async deleteBook(bookId: string): Promise<Book> {
    const deleteBookById: Book = await BookModel.findByIdAndDelete(bookId);
    if (!deleteBookById) throw new HttpException(409, "Book doesn't exist");

    return deleteBookById;
  }
}
