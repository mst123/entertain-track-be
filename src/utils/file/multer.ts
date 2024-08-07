import multer from 'multer';
const storage = multer.memoryStorage();
const multerConfigs = {
  limits: {
    // 文件大小限制在 15MB
    fileSize: 15 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    if (!file.originalname.match(/\.(pdf|doc|docx|txt|zip|pptx|ppt|png|jpeg|jpg|gif|md)$/)) {
      return cb(new Error('Supported file types are pdf, doc, docx and txt'));
    }
    cb(undefined, true);
  },
  storage,
};

export const upload = multer(multerConfigs);
