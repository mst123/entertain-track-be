import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import { DB_HOST, DB_PORT, DB_DATABASE } from '@config';

// 处理图片的中间件
const storage = new GridFsStorage({
  url: `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  file: (req, file) => {
    const match = ['image/png', 'image/jpeg'];
    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-any-name-${file.originalname}`;
      return filename;
    }
    const originalFileName = Buffer.from(file.originalname, 'base64').toString('utf8');

    return {
      filename: originalFileName,
      bucketName: 'uploads', // Same as the collection name set in dbConnection
    };
  },
});

export const upload = multer({ storage });
