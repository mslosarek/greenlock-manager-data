const { MongoMemoryServer } = require('mongodb-memory-server');
const tester = require('greenlock-manager-test');
const lib = require('../');

MongoMemoryServer.create({
  instance: {
    dbName: 'mongodb-test',
  },
})
  .then((mongod) => {
    mongoServer = mongod;
    const config = {
      datastore: {
        url: mongoServer.getUri(),
        database: 'mongodb-test',
      },
    };
    return tester.test(lib, config);
  })
  .then(function () {
    console.info('PASS');
  })
  .catch(function (err) {
    console.error('FAIL');
    console.error(err);
    process.exit(20);
  })
  .then(() => {
    lib._manager._data.close();
    return mongoServer.stop();
  });
