import { RecordController } from '@controllers/records.controller';
import { BaseRoute } from './base.route';

export class RecordRoute extends BaseRoute {
  public record = new RecordController();

  constructor() {
    super('/records');
    this.initializeRoutes();
  }

  protected initializeRoutes() {
    this.initializeCrudRoutes(this.record);
    // 创建或者更新
    this.router.patch(`${this.path}/:id`, this.record.updateOrCreateRecord);
  }
}
