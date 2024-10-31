import { MenuController } from '@controllers/menus.controller';
import { BaseRoute } from './base.route';
export class MenuRoute extends BaseRoute {
  public menu = new MenuController();

  constructor() {
    super('/menus');
    this.initializeRoutes();
  }

  protected initializeRoutes() {
    this.initializeCrudRoutes(this.menu);
  }
}
