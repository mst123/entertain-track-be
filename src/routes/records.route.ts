import { Router, type Router as ExpressRouter } from 'express';
import { RecordController } from '@controllers/records.controller';
import { Routes } from '@interfaces/routes.interface';

export class RecordRoute implements Routes {
  public path = '/records';
  public router: ExpressRouter = Router();
  public record = new RecordController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.record.getRecords);
    this.router.get(`${this.path}/:id`, this.record.getRecordById);
    this.router.post(`${this.path}`, this.record.createRecord);
    // 创建或者更新
    this.router.patch(`${this.path}/:id`, this.record.updateOrCreateRecord);
    this.router.put(`${this.path}/:id`, this.record.updateRecord);
    this.router.delete(`${this.path}/:id`, this.record.deleteRecord);
  }
}
