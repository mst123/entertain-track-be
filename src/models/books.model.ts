import { model, Schema } from 'mongoose';
import { Book } from '@/interfaces/books.interface';

// 书籍 Schema
const BookSchema = new Schema<Book>({
  priority: { type: Number, default: 0 }, // 优先级，默认值 0
  categories: { type: [String], required: true }, // 分类，必填
  name: { type: String, required: true, unique: true }, // 书名，独一无二
  introduction: { type: String, required: true }, // 简介，必填
  coverPhoto: { type: String, required: true }, // 封面
  isHave: { type: Boolean, default: true }, // 是否已经拥有
  status: {
    type: String,
    enum: ['想看', '正在看', '看过', '无'],
    default: '无',
  },
});

// 导出书籍模型
export const BookModel = model<Book>('Book', BookSchema);
