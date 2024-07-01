import { Document } from 'mongoose';
// Game 文档的接口定义
// appid	游戏id
// name	游戏名称
// playtime_forever	全平台累计游戏时长（分）
// playtime_windows_forever	windows上的游戏时长（分）
// playtime_mac_forever	mac上的游戏时长（分）
// playtime_linux_forever	linux上的游戏时长（分）
// rtime_last_played	最近一次游戏时间（结束时间），timestamp格式
// img_icon_url	游戏图标文件名

// game的数据结构
export interface GameBase {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url: string;
  rtime_last_played: number;
}
// game 文档的接口定义
export interface Game extends Document, GameBase {}
