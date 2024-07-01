import { Document } from 'mongoose';

export interface BookBase {
  appid: number;
  priority: number; // 想看才会起效的优先级 默认 0
  categories: Array<String>; // 分类，用逗号分隔
  name: string; // 书名
  introduction: string; // 简介
  isHave: boolean; // 是否已经拥有
}

export interface Book extends Document, BookBase {}
