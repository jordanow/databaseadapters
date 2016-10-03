var mongoose = require('mongoose'),
  async = require('async'),
  _ = require('lodash'),
  User = require('../models/mongo/Users.js'),
  Artist = require('../models/mongo/Artists.js'),
  Tag = require('../models/mongo/Tags.js'),
  UserTag = require('../models/mongo/UserTags.js');

mongoose.Promise = global.Promise;

var seed = {
  artists: require('../data/artists.js'),
  tags: require('../data/tags.js'),
  userFriends: require('../data/user_friends.js'),
  userTags: require('../data/user_tags.js'),
  userArtists: require('../data/user_artists.js')
};

module.exports = function (callback) {

  // Methods
  var connect = function (cb) {
    mongoose.connect('mongodb://localhost/adm');
    cb();
  };

  var saveArtists = function (cb) {
    console.log('============= Saving artists ============');
    console.time('Time to save ' + seed.artists.length + ' artists');

    Artist.remove(function (err, data) {
      if (err) {
        console.log(err);
        cb(err);
      } else {

        async.map(seed.artists, function (artist, next) {
          var newArtist = new Artist({
            _id: artist.id,
            name: artist.name,
            url: artist.url,
            pictureURL: artist.pictureURL
          });

          Artist.create(newArtist, next);

        }, function (err) {
          if (err) {
            cb(err);
          } else {
            console.timeEnd('Time to save ' + seed.artists.length + ' artists');
            cb();
          }
        });
      }
    });
  };

  var saveTags = function (cb) {
    console.log('============= Saving tags ============');
    console.time('Time to save ' + seed.tags.length + ' tags');

    Tag.remove(function (err, data) {
      if (err) {
        console.log(err);
        cb(err);
      } else {

        async.map(seed.tags, function (item, next) {
          var newTag = new Tag({
            _id: item.tagID,
            tagValue: item.tagValue
          });

          Tag.create(newTag, next);

        }, function (err) {
          if (err) {
            cb(err);
          } else {
            console.timeEnd('Time to save ' + seed.tags.length + ' tags');
            cb();
          }
        });
      }
    });
  };

  var saveUsers = function (cb) {
    console.log('============= Saving users ============');

    var userIDs = _.map(seed.userFriends, function (i) {
      return i.userID;
    });

    var userIDFromFriends = _.map(seed.userTags, function (i) {
      return i.userID;
    });

    userIDs = userIDs.concat(userIDFromFriends);

    var uniqUserIDs = _.uniq(userIDs);

    console.time('Time to save ' + uniqUserIDs.length + ' users');

    User.remove(function (err, data) {
      if (err) {
        console.log(err);
        cb(err);
      } else {

        async.map(uniqUserIDs, function (item, next) {
          var newUser = new User({
            _id: item
          });

          User.create(newUser, next);

        }, function (err) {
          if (err) {
            cb(err);
          } else {
            console.timeEnd('Time to save ' + uniqUserIDs.length + ' users');
            cb();
          }
        });
      }
    });
  };

  var saveUserTags = function (cb) {
    console.log('============= Saving user tags ============');
    console.time('Time to save ' + seed.userTags.length + ' user tags');

    UserTag.remove(function (err) {
      if (err) {
        console.log(err);
        cb(err);
      } else {

        async.mapLimit(seed.userTags, 2000, function (item, next) {
          var newUserTag = new UserTag(item);

          UserTag.create(newUserTag, next);

        }, function (err) {
          if (err) {
            cb(err);
          } else {
            console.timeEnd('Time to save ' + seed.userTags.length + ' user tags');
            cb();
          }
        });
      }
    });
  };

  var saveUserFriends = function (cb) {
    console.log('============= Updating user friends ============');

    User.find(function (err, users) {
      if (err) {
        console.log(err);
        cb(err);
      } else {
        console.time('Time to update ' + users.length + ' users');


        async.mapLimit(users, 500, function (user, next) {
          var friends = _.filter(seed.userFriends, function (i) {
            return i.userID === user._id;
          });

          user.friends = _.map(friends, function (i) {
            return i.friendID;
          });

          user.save(next);
        }, function (err) {
          if (err) {
            cb(err);
          } else {
            console.timeEnd('Time to update ' + users.length + ' users');
            cb();
          }
        });
      }
    });
  };

  var saveUserArtists = function (cb) {
    console.log('============= Updating user artists ============');

    User.find(function (err, users) {
      if (err) {
        console.log(err);
        cb(err);
      } else {
        console.time('Time to update ' + users.length + ' users');

        async.mapLimit(users, 500, function (user, next) {
          user.listened_to = _.filter(seed.userArtists, function (i) {
            return i.userID === user._id;
          });

          user.save(next);
        }, function (err) {
          if (err) {
            cb(err);
          } else {
            console.timeEnd('Time to update ' + users.length + ' users');
            cb();
          }
        });
      }
    });
  };


  async.series([
    function (cb) {
      connect(cb);
    },
    function (cb) {
      saveArtists(cb);
    },
    function (cb) {
      saveTags(cb);
    },
    function (cb) {
      saveUserTags(cb);
    },
    // function (cb) {
    //   saveUsers(cb);
    // },
    // function (cb) {
    //   saveUserFriends(cb);
    // },
    // function (cb) {
    //   saveUserArtists(cb);
    // }

  ], function (err) {
    if (err) {
      console.log(err.message);
    } else {
      console.log('============= All data successfully saved ============');
    }
    callback(err);
  });
};
