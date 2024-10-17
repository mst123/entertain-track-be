import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';

export class BaseController<T> {
  constructor(public service: any) {
    this.service = Container.get(service);
    console.log('server', this.service);
  }

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: T[] = await this.service.findAll(req.params);
      res.status(200).json({ data, status: 'success', message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data: T = await this.service.findById(id);
      res.status(200).json({ data, status: 'success', message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: T = req.body;
      const createdData: T = await this.service.create(data);
      res.status(201).json({ data: createdData, status: 'success', message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data: T = req.body;
      const updatedData: T = await this.service.update(id, data);
      res.status(200).json({ data: updatedData, status: 'success', message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const deletedData: T = await this.service.delete(id);
      res.status(200).json({ data: deletedData, status: 'success', message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
