import { Document } from 'mongoose';

export interface User extends Document {
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
