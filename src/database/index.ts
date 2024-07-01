import mongoose, { ConnectOptions } from 'mongoose';
import { NODE_ENV, DB_HOST, DB_PORT, DB_DATABASE } from '@config';
export const dbConnection = async () => {
  const dbConfig = {
    url: `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions,
  };

  if (NODE_ENV !== 'production') {
    mongoose.set('debug', true);
    mongoose.set('strictQuery', true);
  }
  await mongoose.connect(dbConfig.url, dbConfig.options);
  console.log('数据库连接成功');
};
