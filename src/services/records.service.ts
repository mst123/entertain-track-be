import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { Record, RequestRecord } from '@interfaces/records.interface';
import { RecordModel } from '@models/records.model';

// 通过依赖注入的方式使用这个服务，而不需要手动实例化
@Service()
export class RecordService {
  public async findAllRecord(query): Promise<Record[]> {
    const records: Record[] = await RecordModel.find(query);
    return records;
  }

  public async findRecordById(recordId: string): Promise<Record> {
    const findRecord: Record = await RecordModel.findOne({ _id: recordId });
    if (!findRecord) throw new HttpException(409, "Record doesn't exist");

    return findRecord;
  }
  // 获取最新的一条记录
  public getLatestRecord = async () => {
    const latestRecord: Record = await RecordModel.findOne().sort({ createTime: -1 });
    return latestRecord;
  };
  public async createRecord(recordData: RequestRecord): Promise<Record> {
    const createRecordData: Record = await RecordModel.create(recordData);
    return createRecordData;
  }

  public async updateRecord(recordId: string, recordData: RequestRecord): Promise<Record> {
    const updateRecordById: Record = await RecordModel.findByIdAndUpdate(recordId, { recordData });
    if (!updateRecordById) throw new HttpException(409, "Record doesn't exist");
    return updateRecordById;
  }
  public async updateOrCreateRecord(recordId: string, recordData: RequestRecord): Promise<Record> {
    const createRecordData: Record = await RecordModel.findOneAndUpdate({ recordId }, recordData, {
      new: true,
      upsert: true,
    });
    return createRecordData;
  }
  public async deleteRecord(recordId: string): Promise<Record> {
    const deleteRecordById: Record = await RecordModel.findByIdAndDelete(recordId);
    if (!deleteRecordById) throw new HttpException(409, "Record doesn't exist");

    return deleteRecordById;
  }
}
