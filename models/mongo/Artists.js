var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  TimeStamp = Schema.Timestamp;

// Models
var ArtistSchema = new Schema({
  name: {
    index: true,
    type: String
  },
  url: {
    index: true,
    type: String
  },
  pictureURL: {
    index: true,
    type: String
  },
  _id: Number
});

var Artist = mongoose.model('Artist', ArtistSchema);

module.exports = Artist;
