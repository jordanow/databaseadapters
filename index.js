var mongo = require('./adapters/mongo.js');
var neo4j = require('./adapters/neo4j.js');

module.exports = (function () {
  console.time('=============> Total runtime');

  console.log('============= Beginning program ============');

  var db = databaseSelected(process.argv);

  console.log('------------------------------------------------')
  console.log('Database selected = ', db);
  console.log('------------------------------------------------')

  return saveToDB(db);
})();

function databaseSelected(args) {
  var db;

  // Third parameter is the selected db
  db = args[2];

  // args.forEach(function (value, key) {
  //   if (value.indexOf('db') > -1) {
  //     db = value.split('=')[1];
  //   }
  // });

  switch (db) {
    case 'neo':
    case 'neo4j':
      db = 'Neo4j';
      break;
    case 'HBase':
      break;
    default:
      db = 'MongoDB';
  }

  return db;
};

function shutdown(err, data) {
  if (err) {
    console.log('============= Error in process ============');
    console.log(err);
  }

  console.log('============= Shutting down process ============');
  console.timeEnd('=============> Total runtime');

  process.exit(0);
};

function saveToDB(db) {
  switch (db) {
    case 'MongoDB':
      mongo(shutdown);
      break;
    case 'Neo4j':
      neo4j(shutdown);
      break;
    case 'HBase':
  }
  return;
};
