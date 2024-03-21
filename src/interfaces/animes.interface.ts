import { Document } from 'mongoose';
import { type } from 'os';

// 定义枚举类型
type NSFW = 'white' | 'gray' | 'black';

// Unknown = 'unknown', // 未知
// TV = 'tv', // 电视
// OVA = 'ova', // 原创视频动画
// Movie = 'movie', // 电影
// Special = 'special', // 特别版
// ONA = 'ona', // 原创网络动画
// Music = 'music', // 音乐
type MediaType = 'unknown' | 'tv' | 'ova' | 'movie' | 'special' | 'ona' | 'music' | 'tv_special';

// FinishedAiring = 'finished_airing', // 已完结
// CurrentlyAiring = 'currently_airing', // 当前正在播放
// NotYetAired = 'not_yet_aired', // 尚未播出
type Status = 'finished_airing' | 'currently_airing' | 'not_yet_aired';

// G = 'g', // G - 适合所有年龄
// PG = 'pg', // PG - 儿童
// PG13 = 'pg_13', // PG-13 - 13岁以上观看
// R = 'r', // R - 17+ (暴力和粗话)
// RPlus = 'r+', // R+ - 粗话和轻微裸露
// Rx = 'rx', // Rx - 限制级

type Rating = 'g' | 'pg' | 'pg_13' | 'r' | 'r+' | 'rx';

type Source =
  | 'other'
  | 'original'
  | 'manga'
  | '4_koma_manga'
  | 'web_manga'
  | 'digital_manga'
  | 'novel'
  | 'light_novel'
  | 'visual_novel'
  | 'game'
  | 'card_game'
  | 'book'
  | 'picture_book'
  | 'radio'
  | 'music'
  | 'mixed_media';

export type Fields =
  | 'id'
  | 'title'
  | 'main_picture'
  | 'alternative_titles'
  | 'synonyms_or_iso639_1'
  | 'start_date'
  | 'end_date'
  | 'synopsis'
  | 'mean'
  | 'rank'
  | 'popularity'
  | 'num_list_users'
  | 'num_scoring_users'
  | 'nsfw'
  | 'genres'
  | 'media_type'
  | 'status'
  | 'my_list_status'
  | 'num_episodes'
  | 'start_season'
  | 'broadcast'
  | 'source'
  | 'average_episode_duration'
  | 'rating'
  | 'studios'
  | 'pictures'
  | 'background'
  | 'related_anime'
  | 'related_manga'
  | 'recommendations'
  | 'statistics';

export interface AnimeListRequest {
  offset: number;
  limit: number;
  fields: `${Fields}`;
}
// 定义子文档 Schema
interface MainPicture {
  medium: string; // 缩略图链接
  large: string; // 大图链接
}

interface BaseNode {
  id: number; // 关联动画 ID
  title: string; // 关联动画 /漫画标题
  main_picture: MainPicture; // 关联动画 /漫画的主图
}
// 定义子文档 Schema
interface AlternativeTitles {
  synonyms: string[]; // 同义词
  en: string; // 英文标题
  ja: string; // 日文标题
}

// 定义子文档 Schema
interface Genre {
  id: number; // 类型 ID
  name: string; // 类型名称
}

// 定义子文档 Schema
interface StartSeason {
  year: number; // 开播年份
  season: string; // 季节
}

// 定义子文档 Schema
interface Studio {
  id: number; // 工作室 ID
  name: string; // 工作室名称
}

// 定义子文档 Schema
interface Picture {
  medium: string; // 缩略图链接
  large: string; // 大图链接
}

// 定义子文档 Schema
interface RelatedAnime {
  node: BaseNode;
  relation_type: string; // 关联类型
  relation_type_formatted: string; // 格式化的关联类型
}

// TODO 暂无关联漫画
interface RelatedManga {
  node: BaseNode;
  relation_type: string; // 关联类型
  relation_type_formatted: string; // 格式化的关联类型
}
// 定义子文档 Schema
interface Recommendation {
  node: BaseNode;
  num_recommendations: number; // 推荐数
}

// 定义子文档 Schema
interface StatusStatistics {
  watching: string; // 观看中数量
  completed: string; // 已完结数量
  on_hold: string; // 搁置数量
  dropped: string; // 放弃数量
  plan_to_watch: string; // 计划观看数量
}

// 定义子文档 Schema
interface Statistics {
  status: StatusStatistics; // 观看状态统计
  num_list_users: number; // 列表用户数量
}

// Broadcast 的接口定义
interface Broadcast {
  day_of_the_week: string; // 播出星期
  start_time: string; // 开始时间
}

// Anime 文档的接口定义
export interface AnimeBase {
  id: number;
  title: string; // 标题
  main_picture: MainPicture; // 主图片
  alternative_titles: AlternativeTitles; // 别名
  start_date: string; // 开始日期
  end_date: string; // 结束日期
  synopsis: string; // 简介
  mean: number; // 平均评分
  rank: number; // 排名
  popularity: number; // 人气
  num_list_users: number; // 列表用户数量
  num_scoring_users: number; // 打分用户数量
  nsfw: NSFW; // 是否为成人内容
  genres: Genre[]; // 标签类型
  media_type: MediaType; // 媒体类型
  status: Status; // 状态
  num_episodes: number; // 集数
  start_season: StartSeason; // 开播季节
  broadcast: Broadcast; // 播出信息
  source: Source; // 来源
  average_episode_duration: number; // 平均集长
  rating: Rating; // 分级
  studios: Studio[]; // 工作室
  pictures: Picture[]; // 图片
  background: string; // 背景
  related_anime: RelatedAnime[]; // 相关动画
  related_manga: RelatedManga[]; // 相关漫画
  recommendations: Recommendation[]; // 推荐
  statistics: Statistics; // 统计信息
  [key: string]: any;
}
export interface Anime extends Document, AnimeBase {
  id: number;
}
