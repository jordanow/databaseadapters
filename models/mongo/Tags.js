var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  TimeStamp = Schema.Timestamp;

// Models
var TagSchema = new Schema({
  tagValue: {
    index: true,
    type: String
  },
  _id: Number
});

var Tag = mongoose.model('Tag', TagSchema);

module.exports = Tag;
