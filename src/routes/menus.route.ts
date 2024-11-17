import { MenuController } from '@controllers/menus.controller';
import { BaseRoute } from './base.route';
export class MenuRoute extends BaseRoute {
  public menu = new MenuController();

  constructor() {
    super('/menus');
    this.initializeRoutes();
  }

  protected initializeRoutes() {
    this.router.get(`${this.path}/materials`, this.menu.getMaterials);
    this.router.post(`${this.path}/query`, this.menu.getAll);

    this.initializeCrudRoutes(this.menu);
  }
}
