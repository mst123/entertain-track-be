import { Document } from 'mongoose';

export interface RecordBase {
  recordId: string;
  status: 'success' | 'failed';
  type: 'anime' | 'manga';
  offset: number;
  createTime?: Date;
}
export interface Record extends Document, RecordBase {}
