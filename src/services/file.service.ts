import { Service } from 'typedi';
import fs from 'fs';
import { FileModel } from '@/models/files.model';
import bcrypt from 'bcrypt';
import { getTinyUrl, deleteUploads } from '@/utils/file/index';

@Service()
export class FileService {
  private origin = process.env.NODE_ENV === 'production' ? 'https://fileshare-fikr.onrender.com' : 'http://localhost:3000';

  public async uploadFile(fileData: Express.Multer.File, password?: string) {
    if (await this.isFileExists(fileData.originalname)) {
      throw new Error(`File with name ${fileData.originalname} already exists`);
    }

    if (password) {
      fileData.password = await bcrypt.hash(password, 8);
      fileData.protected = true;
    }

    const file = new FileModel(fileData);
    let fileLink;

    if (process.env.NODE_ENV === 'production') {
      fileLink = await getTinyUrl(process.env.ACCESS_TOKEN, `${this.origin}/api/v2/file/${file._id}`);
      file.shortUrl = fileLink;
    } else {
      fileLink = `${this.origin}/api/v2/file/${file._id}`;
      file.longUrl = fileLink;
    }

    await file.save();
    return file;
  }

  public async checkPassword(file: any, password: string): Promise<boolean> {
    return bcrypt.compare(password, file.password);
  }

  public async getFileDetails(query) {
    return FileModel.find(query).select('protected encoding size downloadCount createdAt');
  }

  public clearUploads(): boolean {
    if (fs.existsSync('./uploads')) {
      fs.rmSync('./uploads', { recursive: true });
      return true;
    }
    return false;
  }

  private async isFileExists(originalname: string): Promise<boolean> {
    const existingFile = await FileModel.findOne({ originalname });
    return !!existingFile;
  }

  public deleteUploads() {
    deleteUploads();
  }
}
