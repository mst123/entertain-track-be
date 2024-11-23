// mongo-init.js
db = db.getSiblingDB('entertain-track');

db.createUser({
  user: 'mashitu',
  pwd: 'Zero4096266!',
  roles: [
    {
      role: 'readWrite',
      db: 'entertain-track',
    },
  ],
});
