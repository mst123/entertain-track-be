import { Document } from 'mongoose';
interface UserBase {
  username: string;
  password: string;
  email: string;
  photo?: String;
  registrationDate: Date;
  userPermission: 'admin' | 'user';
  passwordChangedAt?: Date;
  passwordResetToken?: String;
  passwordResetExpires?: Number;
  active: boolean;
}

export interface User extends Document, UserBase {}
export type RequestUser = UserBase;

export interface Refresh {
  refreshToken: String;
  expiresIn: Number;
}
