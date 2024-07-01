export interface GridFSFile {
  _id: string;
  filename: string;
  contentType: string;
  length: number;
  uploadDate: Date;
  metadata: any; // 可能会有其他的自定义元数据字段
}
