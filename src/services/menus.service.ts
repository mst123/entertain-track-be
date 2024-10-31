import { Service } from 'typedi';
import { Menu, MenuBase } from '@interfaces/menus.interface';
import { MenuModel } from '@models/menus.model';
import { BaseService } from './base.service';
// 通过依赖注入的方式使用这个服务，而不需要手动实例化，使得类之间的耦合度更低
@Service()
export class MenuService extends BaseService<Menu, MenuBase> {
  constructor() {
    super(MenuModel);
  }
}
