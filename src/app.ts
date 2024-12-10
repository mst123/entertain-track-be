import 'reflect-metadata';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS, SPIDER_TYPE } from '@config';
import { dbConnection } from '@database';
import { Routes } from '@interfaces/routes.interface';
import { ErrorMiddleware } from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import { AnimeSpider } from '@/utils/sync-my-anime';
import { MangaSpider } from '@/utils/sync-my-manga';
import { GameSpider } from '@/utils/sync-my-game';
import multer from 'multer';

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
    // 爬取逻辑
    if (SPIDER_TYPE) {
      SPIDER_TYPE === 'anime' && this.getMyAnimeListDataBase();
      SPIDER_TYPE === 'manga' && this.getMyMangaListDataBase();
      SPIDER_TYPE === 'game' && this.getMyGameListDataBase();
    }
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    await dbConnection();
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof multer.MulterError) {
        // 处理文件上传错误
        return res.status(400).json({
          message: '文件上传失败',
          error: err.message,
        });
      }

      // 处理其他错误
      console.error(err);
      res.status(500).json({
        message: '服务器内部错误',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    });
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/api/v1/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }

  private getMyAnimeListDataBase() {
    const animeSpider = new AnimeSpider();
    animeSpider.start();
  }
  private getMyMangaListDataBase() {
    const mangaSpider = new MangaSpider();
    mangaSpider.start();
  }

  private getMyGameListDataBase() {
    const gameSpider = new GameSpider();
    gameSpider.start();
  }
}
