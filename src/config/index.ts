import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN, STEAM_KEY, STEAM_ID } = process.env;
export const { DB_HOST, DB_PORT, DB_DATABASE } = process.env;
export const { SPIDER_TYPE } = process.env;

console.log(SPIDER_TYPE);
