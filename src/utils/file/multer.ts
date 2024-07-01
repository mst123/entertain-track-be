import multer from 'multer';
const storage = multer.memoryStorage();
const multerConfigs = {
  limits: {
    fileSize: 15000000,
  },
  fileFilter(req, file, cb) {
    // if (!file.originalname.match(/\.(pdf|doc|docx|txt|zip|pptx|ppt|png|jpeg|jpg|gif|md)$/)) {
    //   return cb(new Error('Supported file types are pdf, doc, docx and txt'));
    // }
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(undefined, true);
  },
  storage,
};

export const upload = multer(multerConfigs);
