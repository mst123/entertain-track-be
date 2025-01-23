import { BillController } from '@controllers/bills.controller';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

import { BaseRoute } from './base.route';
import multer from 'multer';
import path from 'path';

export class BillRoute extends BaseRoute {
  public bill = new BillController();

  constructor() {
    super('/bills');
    this.initializeRoutes();
  }

  protected initializeRoutes() {
    // 配置文件上传
    const upload = multer({
      dest: path.join(process.cwd(), 'src/middlewares/uploads/'),
      limits: {
        fileSize: 20 * 1024 * 1024, // 限制20MB
      },
    });
    this.router.use(this.path, AuthMiddleware);
    // 文件上传路由 - 支持单文件和多文件上传
    this.router.post(
      `${this.path}/upload/:type(csv|pdf)`,
      upload.any(), // 使用 any() 来接受任何字段名的文件
      this.bill.uploadFiles
    );

    // 增强型查询
    this.router.post(`${this.path}/query`, this.bill.findAllPlus);

    // 获取所有分类
    this.router.get(`${this.path}/categories`, this.bill.findAllCategories);

    // 假删除
    this.router.post(`${this.path}/fakeDelete`, this.bill.batchFakeDelete);

    // 复原
    this.router.put(`${this.path}/restore`, this.bill.batchRestore);

    // 批量更新
    this.router.put(`${this.path}/update`, this.bill.batchUpdate);

    // 查询金额相同的多条记录
    this.router.post(`${this.path}/sameAmount`, this.bill.findBillsWithSameAmount);

    // 创建、更新、删除、查询单个
    this.initializeCrudRoutes(this.bill);
  }
}
