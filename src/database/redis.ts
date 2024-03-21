import Redis from 'ioredis';

export const CURRENT_OFFSET = 'CURRENT_OFFSET';
// 创建 Redis 客户端实例
export const redisClient = new Redis({
  host: '127.0.0.1', // Redis 服务器地址
  port: 6379, // Redis 服务器端口号
});

redisClient.config('SET', 'save', '60 1');

// 监听 Redis 连接错误
redisClient.on('error', err => {
  console.error('Redis client error:', err);
});
