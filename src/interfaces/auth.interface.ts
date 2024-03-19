import { Request } from 'express';
import { User } from '@interfaces/users.interface';

export interface DataStoredInToken {
  _id: string;
}
export interface Refresh {
  expiresIn: Number;
  refreshToken: String;
}
export interface TokenData {
  refresh?: Refresh;
  accessToken: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
