var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  TimeStamp = Schema.Timestamp;

// Models
var UserSchema = new Schema({
  _id: Number,
  friends: [Number],
  listened_to: [{
    artistID: {
      type: Number,
      index: true
    },
    weight: Number
  }]
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
