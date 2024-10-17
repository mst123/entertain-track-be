import { Router, type Router as ExpressRouter } from 'express';
import { UserController } from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware, RoleMiddleware, IsMeMiddleware } from '@/middlewares/auth.middleware';
export class UserRoute implements Routes {
  public path = '/users';
  public router: ExpressRouter = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware, RoleMiddleware(['admin']), this.user.getAll);
    this.router.get(`${this.path}/:id`, AuthMiddleware, IsMeMiddleware, this.user.getById);
    this.router.post(`${this.path}`, ValidationMiddleware(CreateUserDto), this.user.create);
    this.router.put(`${this.path}/:id`, ValidationMiddleware(CreateUserDto, true), this.user.update);
    // TODO 不允许删除用户,目前没做限制
    this.router.delete(`${this.path}/:id`, this.user.delete);
  }
}
