import { Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { FileService } from '@/services/file.service';
import { CustomRequest, File } from '@/interfaces/files.interface';

export class FileController {
  private fileService = Container.get(FileService);

  public uploadFile = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const { password, uploadPin } = req.body;
      const fileData = req.file;

      if (!fileData) {
        return res.status(400).send({ message: 'No file found. Please upload a file' });
      }

      if (fileData.size > 5000000) {
        if (!uploadPin || uploadPin !== process.env.UPLOAD_PIN) {
          return res.status(400).send({ message: 'Upload PIN required for files larger than 5Mb' });
        }
      }

      const file = await this.fileService.uploadFile(fileData, password);

      return res.status(201).send({
        message: 'Your file is uploaded',
        longurl: `/api/v1/files/${file._id}`,
        shortUrl: file.shortUrl,
        protected: file.protected,
      });
    } catch (error) {
      next(error);
    }
  };

  public genDownloadLink = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const { file, downloadPath, originalname } = req;

      if (file.password && (!req.query.password || !(await this.fileService.checkPassword(file, req.query.password as string)))) {
        return res.status(400).send({ message: 'Password is required to download this file' });
      }

      file.downloadCount += 1;
      await (file as File).save();

      setTimeout(() => this.fileService.deleteUploads(), 5000);

      return res.status(200).download(downloadPath, originalname);
    } catch (error) {
      next(error);
    }
  };

  public getFileDetails = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const fileDetails = await this.fileService.getFileDetails(req.query);
      if (!fileDetails) {
        return res.status(400).send({ message: 'File does not exist' });
      }

      return res.status(200).send({ fileDetails });
    } catch (error) {
      console.error(error);

      next(error);
    }
  };

  public clearUploads = (req: CustomRequest, res: Response) => {
    if (this.fileService.clearUploads()) {
      return res.send({ message: 'Uploads folder deleted' });
    } else {
      return res.send({ message: 'Uploads folder does not exist' });
    }
  };
}
