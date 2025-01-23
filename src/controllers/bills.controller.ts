import { Bill, UploadResult, Pagination } from '@/interfaces/bills.interface';
import { BillService } from '@/services/bills.service';
import { BaseController } from './base.controller';
import { NextFunction, Request, Response } from 'express';

export class BillController extends BaseController<Bill> {
  constructor() {
    super(BillService);
  }

  public findAllPlus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllBillsData: Pagination = await this.service.findAllPlus(req.body, req.user._id);
      res.status(200).json({ data: findAllBillsData, message: 'findAllPlus' });
    } catch (error) {
      next(error);
    }
  };

  public findAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllCategoriesData: string[] = await this.service.findAllCategories(req.user._id);
      res.status(200).json({ data: findAllCategoriesData, message: 'findAllCategories' });
    } catch (error) {
      next(error);
    }
  };

  public uploadFiles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];
      const type = req.params.type as 'csv' | 'pdf';

      if (!files || !Array.isArray(files) || files.length === 0) {
        res.status(400).json({
          message: '没有上传文件',
          files: req.files,
          body: req.body,
        });
        return;
      }

      const result: UploadResult = await this.service.uploadFiles(files, type, req.user._id);
      res.status(200).json({
        data: result,
        message: '文件上传处理完成',
      });
    } catch (error) {
      next(error);
    }
  };

  // 假删除 支持单条id和多条ids
  public batchFakeDelete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { ids, id } = req.body;
      await this.service.batchFakeDelete(ids || [id]);
      res.status(200).json({ message: '批量假删除成功' });
    } catch (error) {
      next(error);
    }
  };

  // 恢复 支持单条id和多条ids
  public batchRestore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { ids, id } = req.body;
      await this.service.batchRestore(ids || [id]);
      res.status(200).json({ message: '批量恢复成功' });
    } catch (error) {
      next(error);
    }
  };

  // 批量更新 支持单条id和多条ids
  public batchUpdate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { ids, id, update } = req.body;
      await this.service.batchUpdate(ids || [id], update);
      res.status(200).json({ message: '批量更新成功' });
    } catch (error) {
      next(error);
    }
  };

  // 查询金额相同的多条记录
  public findBillsWithSameAmount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bills: Pagination = await this.service.findBillsWithSameAmount(req.body, req.user._id);
      res.status(200).json({
        data: bills,
        message: 'findBillsWithSameAmount',
      });
    } catch (error) {
      next(error);
    }
  };
}
