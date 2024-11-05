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
  public async findAll(body): Promise<Book[]> {
    const { name, categories = [], status } = body;
    console.log('body', body);

    // 1. 构建 aggregate 管道
    const pipeline = [
      // $match 阶段：匹配查询条件
      {
        $match: {
          ...(name && { name: { $regex: name, $options: 'i' } }), // 模糊匹配 name，不区分大小写
          ...(status && { status }), // 精确匹配 status
          ...(categories.length > 0 && { categories: { $in: categories } }), // categories 数组中包含任意一个元素
        },
      },
    ];

    // 2. 执行 aggregate 管道
    const res = await BookModel.aggregate(pipeline);
    return res;
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
