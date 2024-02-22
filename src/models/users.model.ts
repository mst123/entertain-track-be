import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';

// 用户 Schema

const UserSchema = new Schema<User>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
  userPermission: { type: String, enum: ['普通用户', '管理员'], default: '普通用户' },
});

export const UserModel = model<User & Document>('User', UserSchema);
