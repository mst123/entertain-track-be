import { Service } from 'typedi';
import { Bill, BillBase, UploadResult } from '@/interfaces/bills.interface';
import { BillModel } from '@/models/bills.model';
import { BaseService } from './base.service';
import * as fs from 'fs';
import * as path from 'path';
import { CreditCardStatementParser } from '@utils/financial-manage/icbc-card/app';
import { BillParser } from '@utils/financial-manage/csv/app';
import { PipelineStage } from 'mongoose';

@Service()
export class BillService extends BaseService<Bill, BillBase> {
  private readonly uploadDir: string;

  constructor() {
    super(BillModel);
    this.uploadDir = path.join(process.cwd(), 'src/middlewares/uploads');
    // 确保上传目录存在
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  public async findAllPlus(body, userID: string): Promise<{ bills: Bill[]; total: number }> {
    const {
      isDeleted = false,
      startDate,
      endDate,
      type,
      category,
      platform,
      merchant,
      description,
      tag,
      minAmount,
      maxAmount,
      page = 1,
      pageSize = 30,
    } = body;
    const filter: any = { isDeleted, userID };
    if (startDate) {
      filter.date = { $gte: `${startDate} 00:00:00` };
    }
    if (endDate) {
      filter.date = { ...filter.date, $lte: `${endDate} 23:59:59` };
    }
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (platform) filter.platform = platform;
    if (tag) filter.tag = tag;
    if (merchant) filter.merchant = merchant;
    if (description) filter.description = { $regex: description, $options: 'i' };
    if (minAmount !== undefined) {
      filter.amount = { ...filter.amount, $gte: minAmount };
    }
    if (maxAmount !== undefined) {
      filter.amount = { ...filter.amount, $lte: maxAmount };
    }

    const bills = await this.model
      .find(filter)
      .sort({ date: 1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const total = await this.model.countDocuments(filter);

    return { bills, total };
  }

  // 查询所有分类category
  public async findAllCategories(userID: string): Promise<string[]> {
    return await this.model.distinct('category', { userID });
  }

  public async uploadFiles(files: Express.Multer.File[], type: 'csv' | 'pdf', userID: string): Promise<UploadResult> {
    const results: UploadResult = {
      success: 0,
      failed: 0,
      errors: [],
      insertedCount: 0,
      updatedCount: 0,
    };

    for (const file of files) {
      try {
        let transactions = [];

        if (type === 'csv') {
          console.log(file.path);
          const parser = new BillParser(file.path);
          transactions = await parser.parse();
        } else {
          const parser = new CreditCardStatementParser(file.path);
          transactions = await parser.parse();
        }
        console.log('--------------------------------csv--------------------------------');

        // 处理每个交易记录
        for (const transaction of transactions) {
          const existingBill = await this.model.findOne({
            date: transaction.date,
            amount: transaction.amount,
            isDeleted: false,
            userID,
          });

          if (existingBill) {
            if (type === 'csv') {
              // CSV数据可以覆盖PDF数据
              await this.model.updateOne({ _id: existingBill._id }, transaction);
              results.updatedCount++;
            }
          } else {
            await this.model.create({ ...transaction, userID });
            results.insertedCount++;
          }
        }

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          file: file.originalname,
          error: error.message,
        });
      } finally {
        // 清理临时文件
        try {
          fs.unlinkSync(file.path);
        } catch (error) {
          console.error('清理临时文件失败:', error);
        }
      }
    }

    return results;
  }

  // 批量操作
  public async batchUpdate(ids: string[], update: Partial<BillBase>): Promise<void> {
    await this.model.updateMany({ _id: { $in: ids } }, update);
  }
  // 批量假删除
  public async batchFakeDelete(ids: string[]): Promise<void> {
    await this.model.updateMany({ _id: { $in: ids } }, { isDeleted: true });
  }
  // 批量恢复
  public async batchRestore(ids: string[]): Promise<void> {
    await this.model.updateMany({ _id: { $in: ids } }, { isDeleted: false });
  }
  // 批量真删除
  public async batchDelete(ids: string[]): Promise<void> {
    await this.model.deleteMany({ _id: { $in: ids } });
  }

  // 查询金额相同的多条记录
  public async findBillsWithSameAmount(userID: string): Promise<Bill[]> {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          userID,
        },
      },
      {
        $group: {
          _id: '$amount',
          bills: { $push: '$$ROOT' },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
      {
        $unwind: '$bills',
      },
      {
        $replaceRoot: { newRoot: '$bills' },
      },
      {
        $sort: {
          amount: -1,
        },
      },
    ];

    return await this.model.aggregate(pipeline).exec();
  }
}
