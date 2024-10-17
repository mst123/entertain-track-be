import { Service } from 'typedi';
import { Record, RecordBase } from '@interfaces/records.interface';
import { RecordModel } from '@models/records.model';
import { BaseService } from './base.service';
// 通过依赖注入的方式使用这个服务，而不需要手动实例化
@Service()
export class RecordService extends BaseService<Record, RecordBase> {
  constructor() {
    super(RecordModel);
  }

  // 获取最新的一条记录
  public getLatestRecord = async () => {
    const latestRecord: Record = await RecordModel.findOne().sort({ createTime: -1 });
    return latestRecord;
  };
  // 更新或者创建
  public async updateOrCreateRecord(recordId: string, recordData: RecordBase): Promise<Record> {
    const createRecordData: Record = await RecordModel.findOneAndUpdate({ recordId }, recordData, {
      new: true,
      upsert: true,
    });
    return createRecordData;
  }
}
