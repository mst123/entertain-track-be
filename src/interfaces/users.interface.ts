import { Document } from 'mongoose';

export interface User extends Document {
  username: string;
  password: string;
  email: string;
  registrationDate: Date;
  userPermission: '普通用户' | '管理员';
}
