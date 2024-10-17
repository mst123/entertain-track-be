import { Document } from 'mongoose';
import { Request } from 'express';

export interface FileBase {
  shortUrl?: string;
  longUrl?: string;
  protected?: boolean;
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
  password?: string;
  downloadCount: number;
  checkPassword(password: string): Promise<boolean>;
  stream: any;
  destination: any;
  filename: any;
  path: any;
}

export interface CustomRequest extends Request {
  file?: FileBase;
  downloadPath?: string;
  originalname?: string;
}

// file 文档的接口定义
export type File = Document & FileBase;
