import { Router, type Router as ExpressRouter } from 'express';
import { upload } from '@/utils/file/multer';
import { FileController } from '@controllers/file.controller';
import { genDownloadFile } from '@middlewares/file.middleware';
import { Routes } from '@interfaces/routes.interface';

export class FileRoute implements Routes {
  public path = '/files';
  public router: ExpressRouter = Router();
  public fileController = new FileController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, upload.single('file'), this.fileController.uploadFile);
    this.router.get(`${this.path}`, this.fileController.getFileDetails);
    this.router.get(`${this.path}/:id`, genDownloadFile, this.fileController.genDownloadLink);
    this.router.post(`${this.path}/:id`, genDownloadFile, this.fileController.genDownloadLink);
    this.router.get(`${this.path}/delete`, this.fileController.clearUploads);
  }
}
