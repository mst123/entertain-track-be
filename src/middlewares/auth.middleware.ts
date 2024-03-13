import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { UserModel } from '@models/users.model';

const getAuthorization = req => {
  const coockie = req.cookies['Authorization'];
  if (coockie) return coockie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

// TODO 用户校验 未考虑用户登录后修改密码
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
      next(new HttpException(404, 'Authentication token missing'));
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
