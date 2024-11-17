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
  public async findAll(body): Promise<Menu[]> {
    const { name, materialList = [] } = body;
    const regexList = materialList.map(material => new RegExp(material, 'i'));
    const pipeline = [
      {
        $match: {
          ...(name && { name: { $regex: name, $options: 'i' } }), // 模糊匹配 name，不区分大小写
          ...(regexList.length > 0 && {
            ingredients: {
              $elemMatch: {
                name: { $regex: regexList[0] }, // 模糊匹配
              },
            },
          }),
        },
      },
    ];
    const res = await MenuModel.aggregate(pipeline);
    return res;
  }
  // 获取全部配菜
  public async getMaterials(): Promise<string[]> {
    const res = await MenuModel.distinct('ingredients.name');
    return res;
  }
}
