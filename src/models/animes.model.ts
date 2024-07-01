import { model, Schema, Document } from 'mongoose';
import { Anime } from '@/interfaces/animes.interface';

// Anime 的 Schema 定义
const AnimeSchema = new Schema<Anime>({
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
  end_date: String, // 结束日期
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
  genres: [
    {
      // 标签类型
      id: Number, // 类型 ID
      name: String, // 类型名称
    },
  ],
  // 媒体类型
  media_type: {
    type: String,
    enum: ['unknown', 'tv', 'ova', 'movie', 'special', 'ona', 'music', 'tv_special'],
  },
  // 播放状态
  status: {
    type: String,
    enum: ['finished_airing', 'currently_airing', 'not_yet_aired'],
  }, // 状态
  num_episodes: Number, // 集数
  start_season: {
    // 开播季节
    year: Number, // 开播年份
    season: String, // 季节
  },
  broadcast: {
    // 播出信息
    day_of_the_week: String, // 播出星期
    start_time: String, // 开始时间
  },
  // 来源
  source: {
    type: String,
    enum: [
      'other',
      'original',
      'manga',
      '4_koma_manga',
      'web_manga',
      'digital_manga',
      'novel',
      'light_novel',
      'visual_novel',
      'game',
      'card_game',
      'book',
      'picture_book',
      'radio',
      'music',
      'mixed_media',
      'web_novel',
    ],
  },
  average_episode_duration: Number, // 平均集长
  // 分级
  rating: {
    type: String,
    enum: ['g', 'pg', 'pg_13', 'r', 'r+', 'rx'],
  },
  studios: [
    {
      // 工作室
      id: Number, // 工作室 ID
      name: String, // 工作室名称
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
  statistics: {
    // 统计信息
    status: {
      // 状态统计
      watching: String, // 正在观看
      completed: String, // 已完成
      on_hold: String, // 暂停观看
      dropped: String, // 放弃观看
      plan_to_watch: String, // 计划观看
    },
    num_list_users: Number, // 列表用户数量
  },
});
// 建立id的索引
AnimeSchema.index({ id: 1 });

export const AnimeModel = model<Anime & Document>('Anime', AnimeSchema);
