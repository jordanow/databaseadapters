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
    }, function (err) {
      if (err) {
        cb(err);
      }
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

        for (var i = 0; i < seed.tags.length; i += 500) {
          var queries = createQueries.slice(i, i + 500);

          db.cypher({
            queries: queries
          }, function (err) {
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

  var saveArtists = function (cb) {
    console.log('============= Saving Artists ============');


    console.time('Time to save ' + seed.artists.length + ' artists');

    var deleteQuery = [
      'Match (artist: Artist)',
      'DELETE artist',
    ].join('\n');

    var createQueries = [];

    db.cypher({
      query: deleteQuery
    }, function (err) {
      if (err) {
        cb(err);
      }
      async.map(seed.artists, function (item, next) {

        createQueries.push({
          query: [
            'CREATE (artist: Artist {props})',
            'RETURN artist',
          ].join('\n'),
          params: {
            props: item
          }
        });

        next();
      }, function () {

        for (var i = 0; i < seed.artists.length; i += 500) {
          var queries = createQueries.slice(i, i + 500);

          db.cypher({
            queries: queries
          }, function (err) {
            if (err) {
              cb(err);
            }
          });
        }

        setTimeout(function () {
          console.timeEnd('Time to save ' + seed.artists.length + ' artists');
          cb();
        }, 7000);
      });
    });
  };

  var saveUsers = function (cb) {
    console.log('============= Saving Users ============');

    var userIDs = _.map(seed.userFriends, function (i) {
      return i.userID;
    });

    var userIDFromFriends = _.map(seed.userTags, function (i) {
      return i.userID;
    });

    userIDs = userIDs.concat(userIDFromFriends);

    var uniqUserIDs = _.uniq(userIDs);

    console.time('Time to save ' + uniqUserIDs.length + ' users');

    var deleteQuery = [
      'Match (user: User)',
      'DELETE user',
    ].join('\n');

    var createQueries = [];

    db.cypher({
      query: deleteQuery
    }, function (err) {
      if (err) {
        cb(err);
      }

      async.map(uniqUserIDs, function (item, next) {

        createQueries.push({
          query: [
            'CREATE (user: User {props})',
            'RETURN user',
          ].join('\n'),
          params: {
            props: {
              userID: item
            }
          }
        });

        next();
      }, function () {

        for (var i = 0; i < uniqUserIDs.length; i += 500) {
          var queries = createQueries.slice(i, i + 500);

          db.cypher({
            queries: queries
          }, function (err) {
            if (err) {
              cb(err);
            }
          });
        }

        setTimeout(function () {
          console.timeEnd('Time to save ' + uniqUserIDs.length + ' users');
          cb();
        }, 7000);
      });
    });
  };

  var deleteRelUserTagsArtists = function (cb) {
    console.log('============= Deleting User Artist Tag Relationship ============');

    var deleteQuery = [
      'Match (u:User)<-[r:tagged_by]-(a:Artist)-[t:has_tag]->(:Tag)',
      'DELETE r,t',
    ].join('\n');

    db.cypher({
      query: deleteQuery
    }, cb);
  };

  /**
   * Delete all the relationships
   * Match (u:User)-[r:tagged]->(a:Artist)-[t:tagged_on]->(Tag) delete r,t
   *
   * Match (u:User)  where u.userID=2 Match (a:Artist) where a.id=52 Match (t:Tag) where t.tagID=13  create (u)-[r:tagged]->(a)-[k:tagged_on{timestamp:5}]->(t)  return u,a,r,k
   */
  var saveRelUserTagsArtists = function (cb) {
    console.log('============= Saving User Tag Artist Relationship to file ============');

    var findUsersQuery = [
      'Match (user:User) ',
      'RETURN user'
    ].join('\n');


    var relQuery = [
      'Match (user:User) where user.userID={userID}',
      'Match (artist:Artist) where artist.id={artistID}',
      'Match (tag:Tag) where tag.tagID={tagID}',
      'Create (user)<-[tagged_by:tagged_by {props}]-(artist)-[has_tag:has_tag {props}]->(tag)',
      'return has_tag, tagged_by'
    ].join('\n');

    var createQueries = [];


    // Adding lean true to make the query faster
    // Also coz we dont need any extra details about the user object
    // https://github.com/thingdom/node-neo4j/tree/v2#cypher

    async.parallel([
      function (next) {
        db.cypher({
          query: findUsersQuery,
          lean: true
        }, next);
      },
      function (next) {
        next(null, seed.userTags);
      },
    ], function (err, results) {
      var users = results[0];
      var tags = results[1];

      async.mapLimit(users, 500, function (user, callback) {
        async.eachLimit(tags, 500, function (tag, innerCB) {
          if (user.user.userID === tag.userID) {
            var w = {
              timestamp: tag.timestamp
            };

            createQueries.push({
              query: relQuery,
              params: {
                userID: user.user.userID,
                artistID: tag.artistID,
                tagID: tag.tagID,
                props: w
              }
            });
          }
          setTimeout(function () {
            innerCB();
          }, 1);
        }, callback);
      }, function () {

        console.log('Total relationships to save', createQueries.length);

        var fs = require('fs');
        fs.writeFile('userArtistTagRel.js', 'module.exports=' + JSON.stringify(createQueries), cb);
      });
    });
  };

  var saveRelUserArtistTagFile = function (cb) {
    console.log('============= Saving User Artist Tag Relationship from file ============');

    var relUserArtistsTags = require('../userArtistTagRel.js');
    var i = 0;
    var factor = 1000;

    var saveFn = function (relUserArtistsTags) {
      console.log('remaining relationships', relUserArtistsTags.length);
      if (relUserArtistsTags.length === 0) {
        cb();
      }
      var queries = relUserArtistsTags.splice(i, i + factor);

      db.cypher({
        queries: queries
      }, function (err, res) {
        setTimeout(function () {
          saveFn(relUserArtistsTags.slice(i));
        }, 5000);
      });
    };

    saveFn(relUserArtistsTags);
  };

  var deleteUserArtistRel = function (cb) {
    console.log('============= Deleting User Artist Relationship ============');

    var deleteQuery = [
      'Match (:User)-[rel:Listened_To]->(:Artist)',
      'DELETE rel',
    ].join('\n');

    db.cypher({
      query: deleteQuery
    }, cb);
  };


  /**
   * Pick users from the db
   * For each user find IDs of all the artists he has listened to from the seed file.
   * Find the artist from db using the ID found in previous step.
   * Save the relationship between this user and the artist. The relationship will have a property called "weight".
   *
   * Sample query to save a relationship
   * Match (u:User)  where u.userID=572 Match (a:Artist) where a.id=1 create (u)-[r:Listened_To {weight:50}]->(a)  return u,a,r
   *
   * Delete all relationships of given type
   * Match (u:User)-[r:Listened_To]->(a:Artist) delete r
   */

  var saveRelUserArtist = function (cb) {
    console.log('============= Saving User Artist Relationship to file ============');

    var findUsersQuery = [
      'Match (user:User) ',
      'RETURN user'
    ].join('\n');

    var findArtistsQuery = [
      'Match (artist:Artist) ',
      'RETURN artist',
      'LIMIT 50'
    ].join('\n');

    var relQuery = [
      'Match (user:User) where user.userID={userID}',
      'Match (artist:Artist) where artist.id={artistID}',
      'Create (user)-[rel:Listened_To {props}]->(artist)',
      'RETURN user, artist, rel'
    ].join('\n');

    var createQueries = [];


    // Adding lean true to make the query faster
    // Also coz we dont need any extra details about the user object
    // https://github.com/thingdom/node-neo4j/tree/v2#cypher

    async.parallel([
      function (next) {
        next(null, seed.userArtists);
      },
      function (next) {
        db.cypher({
          query: findUsersQuery,
          lean: true
        }, next);
      }
    ], function (err, results) {
      var artists = results[0];
      var users = results[1];

      async.mapLimit(users, 500, function (user, callback) {
        async.eachLimit(artists, 500, function (artist, innerCB) {
          if (user.user.userID === artist.userID) {
            var w = {
              weight: artist.weight
            };

            createQueries.push({
              query: relQuery,
              params: {
                userID: user.user.userID,
                artistID: artist.artistID,
                props: w
              }
            });
          }
          setTimeout(function () {
            innerCB();
          }, 1);
        }, callback);
      }, function () {

        console.log('Total relationships to save', createQueries.length);

        var fs = require('fs');
        fs.writeFile('userArtistRel.js', 'module.exports=' + JSON.stringify(createQueries), function (err) {
          if (err) {
            return console.log(err);
          }

          console.log("The file was saved!");
        });
      });
    });
  };


  var saveRelUserArtistFile = function (cb) {
    console.log('============= Saving User Artist Relationship from file ============');

    var relUserArtists = require('../userArtistRel.js');
    var i = 0;
    var factor = 500;

    var saveFn = function (relUserArtists) {
      console.log('remaining relationships', relUserArtists.length);
      if (relUserArtists.length === 0) {
        cb();
      }
      var queries = relUserArtists.splice(i, i + factor);

      db.cypher({
        queries: queries
      }, function (err, res) {
        setTimeout(function () {
          saveFn(relUserArtists.slice(i));
        }, 5000);
      });
    };

    saveFn(relUserArtists);
  };

  var delUserFriends = function (cb) {
    console.log('============= Deleting User Friends Relationship ============');
    var delQuery = [
      'Match (u:User)-[f:has_friend]->(p:User)',
      'delete f'
    ].join('\n');

    db.cypher({
      query: delQuery
    }, cb);
  };

  var saveUserFriendsFile = function (cb) {
    console.log('============= Saving User Friends Relationship to file ============');

    var findUsersQuery = [
      'Match (user:User) ',
      'RETURN user'
    ].join('\n');

    var relQuery = [
      'Match (user:User) where user.userID={userID}',
      'Match (friend:User) where friend.userID={friendID}',
      'Create (user)-[f:has_friend]->(friend)',
      'Return f'
    ].join('\n');

    var createQueries = [];

    async.parallel([
      function (next) {
        next(null, seed.userFriends);
      },
      function (next) {
        db.cypher({
          query: findUsersQuery,
          lean: true
        }, next);
      }
    ], function (err, results) {
      var friends = results[0];
      var users = results[1];

      async.mapLimit(users, 500, function (user, callback) {
        async.eachLimit(friends, 500, function (friend, innerCB) {
          if (user.user.userID === friend.userID) {
            createQueries.push({
              query: relQuery,
              params: {
                userID: user.user.userID,
                friendID: friend.friendID
              }
            });
          }
          setTimeout(function () {
            innerCB();
          }, 1);
        }, callback);
      }, function () {

        console.log('Total relationships to save', createQueries.length);

        var fs = require('fs');
        fs.writeFile('userFriendsRel.js', 'module.exports=' + JSON.stringify(createQueries), function (err) {
          if (err) {
            return console.log(err);
          }

          console.log("The file was saved!");
        });
      });
    });
  };

  var saveUserFriendsFromFile = function (cb) {
    console.log('============= Saving User Friends Relationship from file ============');

    var userFriendsRel = require('../userFriendsRel.js');
    var i = 0;
    var factor = 1000;

    var saveFn = function (userFriendsRel) {
      console.log('remaining relationships', userFriendsRel.length);
      if (userFriendsRel.length === 0) {
        cb();
      }
      var queries = userFriendsRel.splice(i, i + factor);

      db.cypher({
        queries: queries
      }, function (err, res) {
        setTimeout(function () {
          saveFn(userFriendsRel.slice(i));
        }, 5000);
      });
    };

    saveFn(userFriendsRel);
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
    // function (cb) {
    //   deleteRelUserTagsArtists(cb);
    // },
    // function (cb) {
    //   saveTags(cb);
    // },
    // function (cb) {
    //   saveArtists(cb);
    // },
    // function (cb) {
    //   saveUsers(cb);
    // },
    // function (cb) {
    //   saveRelUserArtist(cb);
    // },
    // function (cb) {
    //   saveRelUserArtistFile(cb);
    // },
    // function (cb) {
    //   saveRelUserTagsArtists(cb);
    // },
    // function (cb) {
    //   deleteUserArtistRel(cb);
    // },
    // function (cb) {
    //   saveRelUserArtistTagFile(cb);
    // },
    function (cb) {
      delUserFriends(cb);
    },
    // function (cb) {
    //   saveUserFriendsFile(cb);
    // },
    function (cb) {
      saveUserFriendsFromFile(cb);
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
