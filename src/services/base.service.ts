import { HttpException } from '@exceptions/httpException';
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
    if (!res) throw new HttpException(409, "Game doesn't exist");
    return res;
  }

  public async create(gameData: U): Promise<T> {
    const res: T = (await this.model.create(gameData)) as T;
    return res;
  }

  public async update(id: string, gameData: U): Promise<T> {
    const res: T = await this.model.findByIdAndUpdate(id, { gameData });
    if (!res) throw new HttpException(409, "Game doesn't exist");
    return res;
  }

  public async delete(id: string): Promise<T> {
    const res: T = await this.model.findByIdAndDelete(id);
    if (!res) throw new HttpException(409, "Game doesn't exist");

    return res;
  }
}
