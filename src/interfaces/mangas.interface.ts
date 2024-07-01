import { Document } from 'mongoose';

type NSFW = 'white' | 'gray' | 'black';
export type Fields =
  | 'id'
  | 'title'
  | 'main_picture'
  | 'alternative_titles'
  | 'start_date'
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
  | 'num_volumes'
  | 'num_chapters'
  | 'pictures'
  | 'background'
  | 'related_anime'
  | 'related_manga'
  | 'recommendations'
  | 'statistics';

export interface MangaListRequest {
  offset: number;
  limit: number;
  fields: `${Fields}`;
}
interface MainPicture {
  large: string | null; // 大尺寸图片链接，可能为空
  medium: string; // 中尺寸图片链接
}

interface AlternativeTitles {
  synonyms: string[] | null; // 同义词列表，可能为空
  en: string | null; // 英文标题，可能为空
  ja: string | null; // 日文标题，可能为空
}

interface Genre {
  id: number; // 类型 ID
  name: string; // 类型名称
  media_type: string; // 媒体类型，可能的值为 unknown, manga, novel, one_shot, doujinshi, manhwa, manhua, oel
}

interface MyListStatus {
  status: string; // 状态
  is_rereading: boolean; // 是否在重读
  num_volumes_read: number; // 已读卷数
  num_chapters_read: number; // 已读章节数
  score: number; // 评分
  updated_at: string; // 更新时间，日期时间格式
}

interface PersonRoleEdge {
  node: {
    id: number; // ID
    first_name: string; // 名
    last_name: string; // 姓
  };
  role: string; // 角色
}

interface RankingInfo {
  rank: number; // 当前排名
  previous_rank: number | null; // 上次排名，可能为空
}

export interface MangaBase {
  id: number; // ID
  title: string; // 标题
  main_picture: MainPicture | null; // 主要图片，可能为空
  alternative_titles: AlternativeTitles | null; // 替代标题，可能为空
  start_date: string | null; // 开始日期，可能为空
  synopsis: string | null; // 简介，可能为空
  mean: number | null; // 平均分，可能为空
  rank: number | null; // 排名，可能为空
  popularity: number | null; // 人气指数，可能为空
  num_list_users: number; // 收藏用户数
  num_scoring_users: number; // 评分用户数
  nsfw: NSFW | null; // 成人内容标识，可能的值为 white, gray, black，可能为空
  media_type: 'unknown' | 'manga' | 'novel' | 'one_shot' | 'doujinshi' | 'manhwa' | 'manhua';
  oel; // 媒体类型
  status: 'finished' | 'currently_publishing' | 'not_yet_published' | 'on_hiatus' | 'discontinued'; // 发布状态，可能的值为 finished, currently_publishing, not_yet_published
  genres: Genre[]; // 类型列表
  my_list_status: MyListStatus | null; // 用户列表状态，可能为空
  num_volumes: number; // 卷数
  num_chapters: number; // 章节数
  authors: PersonRoleEdge[]; // 作者列表
  pictures: MainPicture[]; // 图片列表
  background: string; // 背景信息
  related_anime: any[]; // 相关动画，可能为空
  related_manga: any[]; // 相关漫画，可能为空
  recommendations: any[]; // 推荐列表，可能为空
  serialization: any[]; // 连载信息，可能为空
}

// 使用类型定义来描述数组
export interface Manga extends Document, MangaBase {
  id: number;
}

export interface MangaResponse {
  data: MangaBase[];
  padding: RankingInfo;
}
