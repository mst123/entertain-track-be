import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { UserModel } from '@models/users.model';

const getAuthorization = req => {
  const coockie = req.cookies['Authorization'];
  if (coockie) return coockie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

// 用户校验
export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const { _id } = (await verify(Authorization, SECRET_KEY)) as DataStoredInToken;
      const findUser = await UserModel.findById(_id);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(401, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

// 校验用户的角色
export const RoleMiddleware = (roles: string[]) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.userPermission)) {
      next(new HttpException(403, 'Unauthorized'));
    }
    next();
  };
};

// 校验登录用户是否是当前用户
export const IsMeMiddleware = (userId: string) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const currentUserId = userId || req.params.id;
    if (req.user._id !== currentUserId) {
      next(new HttpException(403, 'Unauthorized'));
    }
    next();
  };
};
