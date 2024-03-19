import { createClient } from 'redis';

(async () => {
  //创建redis客户端
  const redis = createClient({
    url: 'redis://127.0.0.1:6379',
    legacyMode: true,
  });
  //连接
  await redis.connect();
  //set
  await redis.set('test', '123');
  //get
  const value = await redis.get('test');
  console.log(value); //123
})();
