import { Service } from 'typedi';
import { Book, BookBase } from '@interfaces/books.interface';
import { BookModel } from '@models/books.model';
import { BaseService } from './base.service';
// 通过依赖注入的方式使用这个服务，而不需要手动实例化，使得类之间的耦合度更低
@Service()
export class BookService extends BaseService<Book, BookBase> {
  constructor() {
    super(BookModel);
  }

  public async getTags(): Promise<string[]> {
    const Tags = await BookModel.aggregate([
      { $unwind: '$categories' }, // 展开 categories 数组
      { $group: { _id: '$categories' } }, // 按 categories 元素分组
      { $sort: { _id: 1 } }, // 按照 categories 进行排序（可选）
    ]);
    return Tags.map(tag => tag._id);
  }
}
