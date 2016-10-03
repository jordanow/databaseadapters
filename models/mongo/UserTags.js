var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  TimeStamp = Schema.Timestamp;

// Models
var UserTagSchema = new Schema({
  userID: {
    type: Number,
    index: true
  },
  artistID: {
    type: Number,
    index: true
  },
  tagID: {
    type: Number,
    index: true
  },
  timestamp: {
    index: true,
    type: Number
  }
});

var UserTag = mongoose.model('UserTag', UserTagSchema);

module.exports = UserTag;
