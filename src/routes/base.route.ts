import { Router, type Router as ExpressRouter } from 'express';
import { Routes } from '@interfaces/routes.interface';

export abstract class BaseRoute implements Routes {
  public path: string;
  public router: ExpressRouter = Router();

  constructor(path: string) {
    this.path = path;
    // NOTICE 子类的初始化会在construct之后运行，所以下一行需要放在子类中
    // this.initializeRoutes();
  }

  protected abstract initializeRoutes(): void;

  protected initializeCrudRoutes(controller: any) {
    this.router.get(`${this.path}`, controller.getAll);
    this.router.get(`${this.path}/:id`, controller.getById);
    this.router.post(`${this.path}`, controller.create);
    this.router.put(`${this.path}/:id`, controller.update);
    this.router.delete(`${this.path}/:id`, controller.delete);
  }
}
