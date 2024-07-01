import { model, Schema, Document } from 'mongoose';
import { Game } from '@/interfaces/games.interface';

// Game 的 Schema 定义
const GameSchema = new Schema<Game>({
  appid: {
    // 原始id
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  playtime_forever: {
    type: Number,
    required: true,
  },
  img_icon_url: {
    type: String,
    required: true,
  },
  // 上次游玩时间 * 1000 就是标准的毫秒值
  rtime_last_played: {
    type: Number,
    required: true,
  },
});

// 建立id的索引
GameSchema.index({ appid: 1 });

export const GameModel = model<Game & Document>('Game', GameSchema);
