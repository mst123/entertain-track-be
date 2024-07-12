import { NextFunction, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { FileModel } from '@/models/files.model';
import { CustomRequest } from '@/interfaces/files.interface';

export const genDownloadFile = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  // 查询数据库中的文件信息
  const file = await FileModel.findById(id);

  if (!file) {
    return res.status(404).send({ message: 'File not found' });
  }

  // 获取文件的扩展名和数据
  const fileExtension = file.originalname.split('.').pop();
  const fileData = file.buffer;

  // 创建可读流
  const readable = new Readable();
  readable.push(fileData);
  // 设置可读流的结束
  readable.push(null);

  // 确保 uploads 目录存在
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  // 生成文件路径
  const filePath = path.join(uploadsDir, `${file.originalname.split('.')[0]}.${fileExtension}`);

  // 缓存逻辑：如果文件已存在，则直接跳过文件写入步骤
  if (!fs.existsSync(filePath)) {
    const writeStream = fs.createWriteStream(filePath);
    readable.pipe(writeStream);

    writeStream.on('finish', () => {
      // 文件写入完成后，继续执行
      req.file = file;
      req.downloadPath = filePath;
      req.originalname = file.originalname;
      next();
    });

    writeStream.on('error', error => {
      // 处理写入错误
      console.error('Error writing file:', error);
      res.status(500).send({ message: 'Error writing file' });
    });
  } else {
    // 文件已存在，直接继续
    req.file = file;
    req.downloadPath = filePath;
    req.originalname = file.originalname;
    next();
  }
};
