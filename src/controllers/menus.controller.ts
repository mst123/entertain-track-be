import { Menu } from '@interfaces/menus.interface';
import { MenuService } from '@services/menus.service';
import { BaseController } from './base.controller';
export class MenuController extends BaseController<Menu> {
  constructor() {
    super(MenuService);
  }
}
