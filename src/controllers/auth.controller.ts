import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';

export class AuthController {
  public auth = Container.get(AuthService);

  // TODO 注册后需不需要直接登录
  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const signUpUserData: User = await this.auth.signup(userData);

      res.status(201).json({ data: signUpUserData, status: 'success', message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const { cookie, findUser, refresh } = await this.auth.login(userData);
      // accessToken 设置为token refreshToken随接口返回 需要前端保存
      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({
        data: {
          user: findUser,
          refresh,
        },
        status: 'success',
        message: 'login',
      });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const logOutUserData: User = req.user;

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, status: 'success', message: 'logout' });
    } catch (error) {
      next(error);
    }
  };

  public getRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken: string = req.body.refreshToken;
      const { cookie } = await this.auth.getRefreshToken(refreshToken);
      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({
        data: null,
        status: 'success',
        message: 'getRefreshToken',
      });
    } catch (error) {
      next(error);
    }
  };
}
