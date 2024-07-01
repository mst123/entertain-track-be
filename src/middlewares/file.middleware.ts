import { NextFunction, Response } from 'express';
import fs from 'fs';
import { Readable } from 'stream';
import { FileModel } from '@/models/files.model';
import { CustomRequest } from '@/interfaces/files.interface';

export const genDownloadFile = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const file = await FileModel.findById(id);

  if (!file) {
    return res.status(404).send({ message: 'File not found' });
  }

  const fileExtension = file.originalname.split('.').pop();
  const fileData = file.buffer;
  const readable = new Readable();
  readable.push(fileData);
  readable.push(null);

  if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
  }

  const filePath = `./uploads/${file.originalname.split('.')[0]}.${fileExtension}`;
  if (!fs.existsSync(filePath)) {
    const writeStream = fs.createWriteStream(filePath);
    readable.pipe(writeStream);
  }

  req.file = file;
  req.downloadPath = filePath;
  req.originalname = file.originalname;

  setTimeout(() => {
    next();
  }, 2000);
};
