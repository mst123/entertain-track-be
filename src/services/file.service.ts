import { Service } from 'typedi';
import fs from 'fs';
import { FileModel } from '@/models/files.model';
import bcrypt from 'bcrypt';
import { deleteUploads } from '@/utils/file/index';

// 拓展file属性
interface FileExtendProp {
  password?: string;
  protected?: Boolean;
}
@Service()
export class FileService {
  public async uploadFile(fileData: Express.Multer.File & FileExtendProp, password?: string) {
    const existingFile = await FileModel.findOne({ originalname: fileData.originalname });
    // if (await this.isFileExists(fileData.originalname)) {
    //   throw new Error(`File with name ${fileData.originalname} already exists`);
    // }
    if (existingFile) return existingFile;
    if (password) {
      fileData.password = await bcrypt.hash(password, 8);
      fileData.protected = true;
    }

    const file = new FileModel(fileData);

    file.longUrl = `/api/files/${file._id}`;

    await file.save();
    return file;
  }

  public async checkPassword(file: any, password: string): Promise<boolean> {
    return bcrypt.compare(password, file.password);
  }

  public async getFileDetails(query) {
    return FileModel.find(query).select('protected originalname longUrl size downloadCount createdAt');
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
