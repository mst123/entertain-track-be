// mongo-init.js 文件内容
const appUsername = process.env.MONGO_APP_USERNAME;
const appPassword = process.env.MONGO_APP_PASSWORD;

db = db.getSiblingDB('entertain-track');

db.createUser({
  user: appUsername,
  pwd: appPassword,
  roles: [
    {
      role: 'readWrite',
      db: 'entertain-track',
    },
  ],
});
