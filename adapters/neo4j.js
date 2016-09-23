var neo4j = require('neo4j'),
  async = require('async'),
  _ = require('lodash');

var seed = {
  artists: require('../data/artists.js'),
  tags: require('../data/tags.js'),
  userFriends: require('../data/user_friends.js'),
  userTags: require('../data/user_tags.js'),
  userArtists: require('../data/user_artists.js')
};

module.exports = function (callback) {
  // Connecting to localhost
  var db;

  // Methods
  var connect = function (cb) {
    db = new neo4j.GraphDatabase({
      url: 'http://localhost:7474',
      auth: {
        username: 'neo4j',
        password: 'Shailendra@91'
      }
    });
    cb();
  };

  var saveTags = function (cb) {
    console.log('============= Saving tags ============');


    console.time('Time to save ' + seed.tags.length + ' tags');

    var deleteQuery = [
      'Match (tag: Tag)',
      'DELETE tag',
    ].join('\n');

    var createQueries = [];

    db.cypher({
      query: deleteQuery
    }, function () {

      async.map(seed.tags, function (item, next) {

        createQueries.push({
          query: [
            'CREATE (tag: Tag {props})',
            'RETURN tag',
          ].join('\n'),
          params: {
            props: item
          }
        });

        next();
      }, function () {

        for (var i = 500; i < seed.tags.length; i += 500) {
          var queries = createQueries.slice(i - 500, i);

          db.cypher({
            queries: queries
          }, function (err, res) {
            if (err) {
              cb(err);
            }
          });
        }

        setTimeout(function () {
          console.timeEnd('Time to save ' + seed.tags.length + ' tags');
          cb();
        }, 7000);
      });
    });
  };

  // Save users
  // Save artists
  // Save tags
  // Save user_tags relationship
  // Save user_artists relationship
  async.series([
    function (cb) {
      connect(cb);
    },
    function (cb) {
      saveTags(cb);
    }

  ], function (err) {
    if (err) {
      console.log(err.message);
    } else {
      console.log('============= All data successfully saved ============');
    }
    callback(err);
  });

};
