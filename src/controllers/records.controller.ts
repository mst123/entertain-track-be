import { NextFunction, Request, Response } from 'express';
import { Record } from '@interfaces/records.interface';
import { RecordService } from '@services/records.service';
import { BaseController } from './base.controller';

export class RecordController extends BaseController<Record> {
  constructor() {
    super(RecordService);
  }

  public updateOrCreateRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recordData: Record = req.body;
      const recordId: string = req.params.id;
      const createRecordData: Record = await this.service.updateOrCreateRecord(recordId, recordData);

      res.status(201).json({ data: createRecordData, status: 'success', message: 'created or updated' });
    } catch (error) {
      next(error);
    }
  };
}
