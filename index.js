var artists = require('./data/artists.js');


module.exports = (function () {
  console.log('============= Beginning procedure ============');

  var db = databaseSelected(process.argv);

  console.log('=================================================');
  console.log('Database selected = ', db);
  console.log('=================================================');
})();

function databaseSelected(args) {
  var db;

  args.forEach(function (value, key) {
    if (value.indexOf('db') > -1) {
      db = value.split('=')[1];
    }
  });

  switch (db) {
    case 'neo':
    case 'neo4j':
      db = 'neo4j';
      break;
    case 'hbase':
      break;
    default:
      db = 'mongo';
  }

  return db;
};
