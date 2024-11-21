import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@utils/logger';
import { NODE_ENV } from '@/config';
export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    if (NODE_ENV === 'development') {
      console.log(error);
    }
    res.status(status).json({
      status: 'error',
      data: {
        message,
      },
    });
  } catch (error) {
    next(error);
  }
};
