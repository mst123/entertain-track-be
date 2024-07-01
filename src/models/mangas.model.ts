import { model, Schema, Document } from 'mongoose';
import { Manga } from '@/interfaces/mangas.interface';

// Manga 的 Schema 定义
const MangaSchema = new Schema<Manga>({
  id: {
    // 原始id
    type: Number,
    required: true,
  },
  title: String, // 标题
  main_picture: {
    // 主图片
    medium: String, // 缩略图链接
    large: String, // 大图链接
  },
  alternative_titles: {
    // 别名
    synonyms: [String], // 同义词
    en: String, // 英文标题
    ja: String, // 日文标题
  },
  start_date: String, // 开始日期
  synopsis: String, // 简介
  mean: Number, // 平均评分
  rank: Number, // 排名
  popularity: Number, // 人气
  num_list_users: Number, // 列表用户数量
  num_scoring_users: Number, // 打分用户数量
  nsfw: {
    // 是否为成人内容
    type: String,
    enum: {
      values: ['white', 'gray', 'black'],
      message: 'nsfw is either: white, gray, black',
    },
  },
  // 媒体类型
  media_type: {
    type: String,
    enum: ['unknown', 'manga', 'novel', 'one_shot', 'doujinshi', 'manhwa', 'manhua', 'oel', 'light_novel'],
  },
  // 播放状态
  status: {
    type: String,
    enum: ['finished', 'currently_publishing', 'not_yet_published', 'on_hiatus', 'discontinued'],
  }, // 状态
  genres: [
    {
      // 标签类型
      id: Number, // 类型 ID
      name: String, // 类型名称
    },
  ],
  // my_list_status: // 用户列表状态，不需要
  num_volumes: Number, // 集数
  num_chapters: Number, // 章节
  authors: [
    {
      node: {
        id: Number, // ID
        first_name: String, // 名
        last_name: String, // 姓
      },
      role: String, // 角色
    },
  ],
  pictures: [
    {
      // 图片
      medium: String, // 缩略图链接
      large: String, // 大图链接
    },
  ],
  background: String, // 背景
  related_anime: [
    {
      // 相关动画
      node: {
        id: Number, // 关联动画 ID
        title: String, // 关联动画标题
        main_picture: {
          // 关联动画的主图
          medium: String, // 缩略图链接
          large: String, // 大图链接
        },
      },
      relation_type: String, // 关联类型
      relation_type_formatted: String, // 格式化的关联类型
    },
  ],
  related_manga: [
    {
      // 相关漫画
      node: {
        id: Number, // 关联漫画 ID
        title: String, // 关联漫画标题
        main_picture: {
          // 关联漫画的主图
          medium: String, // 缩略图链接
          large: String, // 大图链接
        },
      },
      relation_type: String, // 关联类型
      relation_type_formatted: String, // 格式化的关联类型
    },
  ],
  recommendations: [
    {
      // 推荐
      node: {
        id: Number, // 推荐的动画 ID
        title: String, // 推荐的动画标题
        main_picture: {
          // 推荐的动画的主图
          medium: String, // 缩略图链接
          large: String, // 大图链接
        },
      },
      num_recommendations: Number, // 推荐数量
    },
  ],
  serialization: [],
});
// 建立id的索引
MangaSchema.index({ id: 1 });

export const MangaModel = model<Manga & Document>('Manga', MangaSchema);
