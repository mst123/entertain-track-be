import { model, Schema, Document } from 'mongoose';
import { Record } from '@interfaces/records.interface';

// 记录表 Schema

const RecordSchema = new Schema<Record>({
  recordId: { type: String, required: true },
  status: { type: String, enum: ['success', 'failed'], required: true },
  type: { type: String, enum: ['anime', 'manga'], required: true },
  offset: { type: Number, required: true },
  createTime: {
    type: Date,
    default: Date.now(),
  },
});

// 建立创建时间的倒序索引
RecordSchema.index({ createTime: -1 });

export const RecordModel = model<Record & Document>('Record', RecordSchema);
