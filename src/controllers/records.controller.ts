import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Record } from '@interfaces/records.interface';
import { RecordService } from '@services/records.service';

export class RecordController {
  public record = Container.get(RecordService);

  public getRecords = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllRecordsData: Record[] = await this.record.findAllRecord(req.params);

      res.status(200).json({ data: findAllRecordsData, status: 'success', message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getRecordById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recordId: string = req.params.id;
      const findOneRecordData: Record = await this.record.findRecordById(recordId);

      res.status(200).json({ data: findOneRecordData, status: 'success', message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recordData: Record = req.body;
      const createRecordData: Record = await this.record.createRecord(recordData);

      res.status(201).json({ data: createRecordData, status: 'success', message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateOrCreateRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recordData: Record = req.body;
      const recordId: string = req.params.id;
      const createRecordData: Record = await this.record.updateOrCreateRecord(recordId, recordData);

      res.status(201).json({ data: createRecordData, status: 'success', message: 'created or updated' });
    } catch (error) {
      next(error);
    }
  };

  public updateRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recordId: string = req.params.id;
      const recordData: Record = req.body;
      const updateRecordData: Record = await this.record.updateRecord(recordId, recordData);

      res.status(200).json({ data: updateRecordData, status: 'success', message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recordId: string = req.params.id;
      const deleteRecordData: Record = await this.record.deleteRecord(recordId);

      res.status(200).json({ data: deleteRecordData, status: 'success', message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
