import { HttpException } from '@exceptions/HttpException';
import { Model } from 'mongoose';

export abstract class BaseService<T, U> {
  constructor(private readonly model: Model<T>) {
    this.model = model;
  }
  public async findAll(query): Promise<T[]> {
    const res: T[] = await this.model.find(query);
    return res;
  }

  public async findById(id: string): Promise<T> {
    const res: T = await this.model.findOne({ _id: id });
    if (!res) throw new HttpException(409, "Data doesn't exist");
    return res;
  }

  public async create(data: U): Promise<T> {
    const res: T = (await this.model.create(data)) as T;
    return res;
  }

  public async update(id: string, data: U): Promise<T> {
    const res: T = await this.model.findByIdAndUpdate(id, data, { new: true });
    if (!res) throw new HttpException(409, "Data doesn't exist");
    return res;
  }

  public async delete(id: string): Promise<T> {
    const res: T = await this.model.findByIdAndDelete(id);
    if (!res) throw new HttpException(409, "Data doesn't exist");

    return res;
  }
}
