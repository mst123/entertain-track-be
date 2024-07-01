import { model, Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { File } from '@/interfaces/files.interface';

// File 的 Schema 定义
const fileSchema = new Schema<File>({
  shortUrl: {
    type: String,
  },
  longUrl: {
    type: String,
  },
  protected: {
    type: Boolean,
    default: false,
  },
  fieldname: {
    type: String,
  },
  originalname: {
    type: String,
    required: true,
  },
  encoding: {
    type: String,
  },
  mimetype: {
    type: String,
  },
  buffer: {
    type: Buffer,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
  },
  downloadCount: {
    type: Number,
    required: true,
    default: 0,
  },
});

/**
 * Before saving hash and salt the password if it has been modified.
 */
fileSchema.pre<File>('save', async function (next) {
  try {
    if (this.isModified('password')) {
      const hash = await bcrypt.hash(this.password, 8);
      this.password = hash;
    }
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Compare the hashed password with the password provided.
 */
fileSchema.methods.checkPassword = function (password: string) {
  const passwordHash = this.password;
  return new Promise<boolean>((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }
      resolve(same);
    });
  });
};

export const FileModel = model<File & Document>('File', fileSchema);
